const {
	onDocumentCreated,
	onDocumentDeleted,
	onDocumentUpdated,
} = require("firebase-functions/v2/firestore")
const { onCall, HttpsError } = require("firebase-functions/v2/https")
const { onSchedule } = require("firebase-functions/v2/scheduler")
const { defineSecret } = require("firebase-functions/params")
const logger = require("firebase-functions/logger")
const admin = require("firebase-admin")

admin.initializeApp()

const RESEND_API_KEY = defineSecret("RESEND_API_KEY")
const RESEND_FROM_EMAIL = defineSecret("RESEND_FROM_EMAIL")
const WHATSAPP_CLOUD_ACCESS_TOKEN = defineSecret("WHATSAPP_CLOUD_ACCESS_TOKEN")
const WHATSAPP_CLOUD_PHONE_NUMBER_ID = defineSecret(
	"WHATSAPP_CLOUD_PHONE_NUMBER_ID",
)
const WHATSAPP_CLOUD_API_VERSION = "v20.0"
const NAIROBI_TIMEZONE = "Africa/Nairobi"
const NAIROBI_UTC_OFFSET_HOURS = 3
const REVIEW_RATE_LIMIT_COOLDOWN_MS = 2 * 60 * 1000
const CONTACT_RATE_LIMI5T_COOLDOWN_MS = 60 * 1000
const SECURITY_ALERT_SEVERITY = {
	multiple_failed_login_attempts: "high",
	new_device_detected: "medium",
	login_unusual_country: "high",
	rapid_repeated_logins: "high",
	account_deleted: "high",
	account_deactivated: "high",
	password_changed: "medium",
	email_changed: "medium",
	phone_changed: "low",
	profile_updated: "low",
}

const ACCOUNT_CHANGE_LABELS = {
	password_changed: "Password changed",
	email_changed: "Email changed",
	phone_changed: "Phone changed",
	profile_updated: "Profile updated",
	account_deleted: "Account deleted",
	account_deactivated: "Account deactivated",
}

const ACCOUNT_CHANGE_TYPES = Object.keys(ACCOUNT_CHANGE_LABELS)
const ACTIVITY_TIMELINE_TYPES = {
	booking_created: "booking_created",
	booking_canceled: "booking_canceled",
	review_posted: "review_posted",
	review_edited: "review_edited",
	contact_submitted: "contact_submitted",
}
let ResendClient = null

function getResendClient() {
	if (!ResendClient) {
		const { Resend } = require("resend")
		ResendClient = Resend
	}
	return new ResendClient(RESEND_API_KEY.value())
}

function normalizeLoginMethod(method = "") {
	const raw = String(method || "")
		.trim()
		.toLowerCase()
	if (raw === "google") return "google"
	if (raw === "email/password" || raw === "email" || raw === "password") {
		return "email/password"
	}
	if (raw === "anonymous") return "anonymous"
	return "unknown"
}

function normalizeLoginStatus(status = "") {
	const raw = String(status || "")
		.trim()
		.toLowerCase()
	return raw === "failure" ? "failure" : "success"
}

function normalizeDeviceType(deviceType = "") {
	const raw = String(deviceType || "")
		.trim()
		.toLowerCase()
	if (["mobile", "desktop", "tablet"].includes(raw)) return raw
	return "unknown"
}

function normalizeShortText(value = "", maxLen = 80) {
	return String(value || "")
		.trim()
		.slice(0, maxLen)
}

function normalizeAccountChangeType(value = "") {
	const raw = String(value || "")
		.trim()
		.toLowerCase()
	if (ACCOUNT_CHANGE_TYPES.includes(raw)) return raw
	return ""
}

function getAccountChangeLabel(changeType = "") {
	return ACCOUNT_CHANGE_LABELS[changeType] || "Account updated"
}

function extractRequestIp(request) {
	const forwarded = request?.headers?.["x-forwarded-for"]
	if (typeof forwarded === "string" && forwarded.trim()) {
		return forwarded.split(",")[0].trim()
	}
	return String(request?.ip || "").trim()
}

function maskIpAddress(ipAddress = "") {
	const ip = String(ipAddress || "").trim()
	if (!ip) return "masked"

	if (ip.includes(".")) {
		const parts = ip.split(".")
		if (parts.length === 4) {
			return `${parts[0]}.${parts[1]}.xxx.xxx`
		}
	}

	if (ip.includes(":")) {
		const parts = ip.split(":")
		if (parts.length >= 2) {
			return `${parts[0]}:${parts[1]}:xxxx:xxxx:xxxx:xxxx`
		}
	}

	return "masked"
}

function extractApproxLocation(request) {
	const city = normalizeShortText(
		request?.headers?.["x-appengine-city"] || "",
		80,
	)
	const countryRaw = normalizeShortText(
		request?.headers?.["x-appengine-country"] || "",
		80,
	)
	const country = countryRaw && countryRaw !== "ZZ" ? countryRaw : "Unknown"
	const locationLabel = [city, country].filter(Boolean).join(", ") || "Unknown"

	return {
		city: city || "Unknown",
		country,
		locationLabel,
	}
}

function toMillis(value) {
	if (!value) return 0
	if (typeof value?.toMillis === "function") return value.toMillis()
	if (typeof value === "number" && Number.isFinite(value)) return value
	if (value?.seconds && Number.isFinite(value.seconds)) {
		return value.seconds * 1000
	}
	const parsed = Date.parse(String(value))
	return Number.isNaN(parsed) ? 0 : parsed
}

function buildRateLimitDocId(uid = "") {
	const safeUid = String(uid || "").trim()
	if (!safeUid) return ""
	return safeUid
}

async function upsertRateLimit({ kind = "", uid = "", cooldownMs = 0 } = {}) {
	const safeKind = String(kind || "")
		.trim()
		.toLowerCase()
	const docId = buildRateLimitDocId(uid)
	if (!docId) return

	const cooldownUntil = admin.firestore.Timestamp.fromMillis(
		Date.now() + Math.max(0, Number(cooldownMs || 0)),
	)
	const payload = {
		uid: String(uid || "").trim(),
		lastSubmittedAt: admin.firestore.FieldValue.serverTimestamp(),
		updatedAt: admin.firestore.FieldValue.serverTimestamp(),
	}

	if (safeKind === "review") {
		payload.reviewCooldownUntil = cooldownUntil
	} else if (safeKind === "contact") {
		payload.contactCooldownUntil = cooldownUntil
	} else {
		return
	}

	await admin
		.firestore()
		.collection("rateLimits")
		.doc(docId)
		.set(payload, { merge: true })
}

function buildCustomerName(booking = {}) {
	const fullName = `${booking.firstName || ""} ${booking.lastName || ""}`.trim()
	return fullName || "Customer"
}

function normalizePhoneForWhatsApp(input = "") {
	const raw = String(input || "").trim()
	if (!raw) return ""

	const plusPrefixed = raw.startsWith("+")
	const digits = raw.replace(/\D/g, "")
	if (!digits) return ""

	if (plusPrefixed) return `+${digits}`
	if (digits.startsWith("0") && digits.length === 10)
		return `+254${digits.slice(1)}`
	if (digits.startsWith("254")) return `+${digits}`
	if (digits.length >= 10) return `+${digits}`
	return ""
}

function parseTimeTo24Hour(timeText = "") {
	const match = String(timeText)
		.trim()
		.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
	if (!match) return null

	let hours = Number(match[1])
	const minutes = Number(match[2])
	const period = String(match[3] || "").toUpperCase()

	if (Number.isNaN(hours) || Number.isNaN(minutes)) return null
	if (hours < 1 || hours > 12 || minutes < 0 || minutes > 59) return null

	if (period === "PM" && hours !== 12) hours += 12
	if (period === "AM" && hours === 12) hours = 0

	return { hours, minutes }
}

function getBookingAppointmentDate(booking = {}) {
	const dateText = String(booking.date || "").trim()
	const timeText = String(booking.time || "").trim()
	const parsedTime = parseTimeTo24Hour(timeText)
	if (!dateText || !parsedTime) return null

	const dateParts = dateText.match(/^(\d{4})-(\d{2})-(\d{2})$/)
	if (!dateParts) return null

	const year = Number(dateParts[1])
	const month = Number(dateParts[2])
	const day = Number(dateParts[3])
	if (!year || !month || !day) return null

	const utcMs = Date.UTC(
		year,
		month - 1,
		day,
		parsedTime.hours - NAIROBI_UTC_OFFSET_HOURS,
		parsedTime.minutes,
		0,
		0,
	)

	return new Date(utcMs)
}

function formatBookingDateTimeForMessage(booking = {}) {
	const appointmentDate = getBookingAppointmentDate(booking)
	if (!appointmentDate) {
		return {
			dateLabel: booking.date || "N/A",
			timeLabel: booking.time || "N/A",
		}
	}

	return {
		dateLabel: appointmentDate.toLocaleDateString("en-KE", {
			year: "numeric",
			month: "long",
			day: "numeric",
			timeZone: NAIROBI_TIMEZONE,
		}),
		timeLabel: appointmentDate.toLocaleTimeString("en-KE", {
			hour: "numeric",
			minute: "2-digit",
			hour12: true,
			timeZone: NAIROBI_TIMEZONE,
		}),
	}
}

async function sendWhatsAppMessage({ toPhoneNumber, messageBody }) {
	const accessToken = WHATSAPP_CLOUD_ACCESS_TOKEN.value()
	const phoneNumberId = WHATSAPP_CLOUD_PHONE_NUMBER_ID.value()
	const destination = String(toPhoneNumber || "").replace(/^\+/, "")

	if (typeof fetch !== "function") {
		throw new Error("Global fetch is not available in this Node runtime")
	}
	if (!destination) {
		throw new Error("WhatsApp destination phone number is missing")
	}

	const endpoint = `https://graph.facebook.com/${WHATSAPP_CLOUD_API_VERSION}/${phoneNumberId}/messages`

	const response = await fetch(endpoint, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${accessToken}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			messaging_product: "whatsapp",
			recipient_type: "individual",
			to: destination,
			type: "text",
			text: {
				preview_url: false,
				body: messageBody,
			},
		}),
	})

	const responseText = await response.text()
	if (!response.ok) {
		throw new Error(
			`WhatsApp Cloud API send failed (${response.status}): ${responseText.slice(0, 500)}`,
		)
	}

	try {
		return JSON.parse(responseText)
	} catch (_error) {
		return { raw: responseText }
	}
}

async function createSecurityAlert({
	type = "",
	uid = "",
	email = "",
	displayName = "",
	severity = "medium",
	message = "",
	metadata = {},
} = {}) {
	const alertType = String(type || "")
		.trim()
		.toLowerCase()
	if (!alertType) return

	const safeSeverity = ["low", "medium", "high"].includes(
		String(severity || "")
			.trim()
			.toLowerCase(),
	)
		? String(severity || "")
				.trim()
				.toLowerCase()
		: "medium"

	const safeUid = String(uid || "").trim()
	const safeEmail = String(email || "")
		.trim()
		.toLowerCase()
	const safeDisplayName = normalizeShortText(displayName || "", 120)
	const safeMessage = normalizeShortText(message || "", 220)

	await admin
		.firestore()
		.collection("securityAlerts")
		.add({
			type: alertType,
			severity: safeSeverity,
			status: "open",
			message: safeMessage,
			uid: safeUid,
			email: safeEmail,
			displayName: safeDisplayName,
			metadata:
				typeof metadata === "object" && metadata && !Array.isArray(metadata)
					? metadata
					: {},
			createdAt: admin.firestore.FieldValue.serverTimestamp(),
			updatedAt: admin.firestore.FieldValue.serverTimestamp(),
		})
}

function sanitizeTimelineType(type = "") {
	const normalized = String(type || "")
		.trim()
		.toLowerCase()
	return Object.values(ACTIVITY_TIMELINE_TYPES).includes(normalized)
		? normalized
		: "activity"
}

function buildTimelineSummary({
	type = "",
	actorName = "",
	context = {},
} = {}) {
	const safeName = String(actorName || "").trim() || "User"
	const safeContext =
		typeof context === "object" && context && !Array.isArray(context)
			? context
			: {}

	if (type === ACTIVITY_TIMELINE_TYPES.booking_created) {
		return `${safeName} booked ${safeContext.service || "a service"}`
	}

	if (type === ACTIVITY_TIMELINE_TYPES.booking_canceled) {
		return `${safeName} canceled ${safeContext.service || "a booking"}`
	}

	if (type === ACTIVITY_TIMELINE_TYPES.review_posted) {
		return `${safeName} posted a review`
	}

	if (type === ACTIVITY_TIMELINE_TYPES.review_edited) {
		return `${safeName} edited a review`
	}

	if (type === ACTIVITY_TIMELINE_TYPES.contact_submitted) {
		return `${safeName} submitted contact form`
	}

	return `${safeName} performed an account action`
}

async function createActivityTimelineEvent({
	type = "",
	uid = "",
	email = "",
	displayName = "",
	context = {},
	source = "",
} = {}) {
	const safeType = sanitizeTimelineType(type)
	const safeUid = String(uid || "").trim()
	const safeEmail = normalizeShortText(email || "", 160)
		.toLowerCase()
		.trim()
	const safeDisplayName = normalizeShortText(displayName || "", 120)
	const safeSource = normalizeShortText(source || "", 80)
	const safeContext =
		typeof context === "object" && context && !Array.isArray(context)
			? context
			: {}

	await admin
		.firestore()
		.collection("activityTimeline")
		.add({
			type: safeType,
			uid: safeUid,
			email: safeEmail,
			displayName: safeDisplayName,
			source: safeSource,
			summary: buildTimelineSummary({
				type: safeType,
				actorName: safeDisplayName || safeEmail || safeUid,
				context: safeContext,
			}),
			context: safeContext,
			createdAt: admin.firestore.FieldValue.serverTimestamp(),
		})
}

exports.logLoginActivity = onCall(
	{
		region: "us-central1",
	},
	async (request) => {
		const data = request.data || {}
		const method = normalizeLoginMethod(data.method)
		const status = normalizeLoginStatus(data.status)
		const isFailure = status === "failure"
		const isAuthenticated = Boolean(request.auth?.uid)

		if (!isAuthenticated && !isFailure) {
			throw new HttpsError("unauthenticated", "Sign in required")
		}

		const uid = isAuthenticated ? String(request.auth.uid || "").trim() : ""
		if (isAuthenticated && !uid) {
			throw new HttpsError("unauthenticated", "Invalid auth session")
		}

		const deviceType = normalizeDeviceType(data.deviceType)
		const browser =
			normalizeShortText(data.browser || "Unknown", 80) || "Unknown"
		const locale = normalizeShortText(data.locale || "", 40)
		const timezone = normalizeShortText(data.timezone || "", 80)
		const source = normalizeShortText(data.source || "", 60)
		const failureCode = normalizeShortText(data.failureCode || "", 80)
		const attemptedEmail = normalizeShortText(data.attemptedEmail || "", 160)
			.toLowerCase()
			.trim()

		const authToken = request.auth?.token || {}
		const displayName = normalizeShortText(authToken.name || "", 120)
		const authEmail = normalizeShortText(authToken.email || "", 160)
		const email = (authEmail || (isFailure ? attemptedEmail : ""))
			.toLowerCase()
			.trim()

		const rawIp = extractRequestIp(request.rawRequest)
		const ipMasked = maskIpAddress(rawIp)
		const location = extractApproxLocation(request.rawRequest)
		const identityType = uid ? "uid" : email ? "email" : "masked_ip"
		const identityValue = uid || email || ipMasked

		let suspiciousFlags = []
		try {
			let recentQuery = admin
				.firestore()
				.collection("loginActivities")
				.orderBy("createdAt", "desc")
				.limit(25)

			if (uid) {
				recentQuery = recentQuery.where("uid", "==", uid)
			} else if (email) {
				recentQuery = recentQuery.where("email", "==", email)
			} else {
				recentQuery = recentQuery.where("ipMasked", "==", ipMasked)
			}

			const recentSnapshot = await recentQuery.get()

			const recent = recentSnapshot.docs.map((doc) => doc.data() || {})
			const nowMs = Date.now()
			const repeatedAttemptsInShortWindow = recent.filter((entry) => {
				const age = nowMs - toMillis(entry.createdAt)
				return age >= 0 && age <= 2 * 60 * 1000
			}).length
			if (repeatedAttemptsInShortWindow >= 4) {
				suspiciousFlags.push("rapid_repeated_logins")
			}

			if (isFailure) {
				const failuresInWindow = recent.filter((entry) => {
					if (String(entry.status || "") !== "failure") return false
					const age = nowMs - toMillis(entry.createdAt)
					return age >= 0 && age <= 5 * 60 * 1000
				}).length
				if (failuresInWindow >= 2) {
					suspiciousFlags.push("repeated_failures")
				}
			}

			if (status === "success") {
				const priorSuccess = recent.filter(
					(entry) => String(entry.status || "") === "success",
				)

				if (priorSuccess.length) {
					const hasSeenDeviceBrowser = priorSuccess.some(
						(entry) =>
							String(entry.deviceType || "") === deviceType &&
							String(entry.browser || "") === browser,
					)
					if (!hasSeenDeviceBrowser) {
						suspiciousFlags.push("new_device_or_browser")
					}

					const lastSuccess = priorSuccess[0]
					const lastCountry = String(lastSuccess.locationCountry || "")
					const lastSuccessAge = nowMs - toMillis(lastSuccess.createdAt)
					if (
						location.country !== "Unknown" &&
						lastCountry &&
						lastCountry !== "Unknown" &&
						lastCountry !== location.country &&
						lastSuccessAge >= 0 &&
						lastSuccessAge <= 24 * 60 * 60 * 1000
					) {
						suspiciousFlags.push("country_changed_quickly")
					}
				}
			}
		} catch (analysisError) {
			logger.warn("Login activity risk analysis skipped", {
				uid,
				email,
				errorMessage: analysisError?.message || "Unknown error",
			})
		}

		suspiciousFlags = [...new Set(suspiciousFlags)]
		const suspicious = suspiciousFlags.length > 0

		const activityRef = await admin
			.firestore()
			.collection("loginActivities")
			.add({
				uid,
				displayName,
				email,
				attemptedEmail,
				identityType,
				identityValue,
				method,
				status,
				deviceType,
				browser,
				locationCity: location.city,
				locationCountry: location.country,
				locationLabel: location.locationLabel,
				ipMasked,
				failureCode,
				suspicious,
				suspiciousFlags,
				source,
				locale,
				timezone,
				createdAt: admin.firestore.FieldValue.serverTimestamp(),
			})

		const alertSpecs = []
		if (suspiciousFlags.includes("repeated_failures")) {
			alertSpecs.push({
				type: "multiple_failed_login_attempts",
				message: "Multiple failed login attempts detected",
			})
		}
		if (suspiciousFlags.includes("new_device_or_browser")) {
			alertSpecs.push({
				type: "new_device_detected",
				message: "Login from a new device or browser detected",
			})
		}
		if (suspiciousFlags.includes("country_changed_quickly")) {
			alertSpecs.push({
				type: "login_unusual_country",
				message: "Login from unusual country detected",
			})
		}
		if (suspiciousFlags.includes("rapid_repeated_logins")) {
			alertSpecs.push({
				type: "rapid_repeated_logins",
				message: "Rapid repeated login attempts detected",
			})
		}

		if (alertSpecs.length) {
			await Promise.allSettled(
				alertSpecs.map((spec) =>
					createSecurityAlert({
						type: spec.type,
						uid,
						email,
						displayName,
						severity: SECURITY_ALERT_SEVERITY[spec.type] || "medium",
						message: spec.message,
						metadata: {
							loginActivityId: activityRef.id,
							method,
							status,
							deviceType,
							browser,
							locationLabel: location.locationLabel,
							ipMasked,
							suspiciousFlags,
						},
					}),
				),
			)
		}

		return { ok: true }
	},
)

exports.logAccountSecurityChange = onCall(
	{
		region: "us-central1",
	},
	async (request) => {
		if (!request.auth?.uid) {
			throw new HttpsError("unauthenticated", "Sign in required")
		}

		const data = request.data || {}
		const changeType = normalizeAccountChangeType(data.changeType)
		if (!changeType) {
			throw new HttpsError("invalid-argument", "Invalid account change type")
		}

		const uid = String(request.auth.uid || "").trim()
		const authToken = request.auth.token || {}
		const email = normalizeShortText(authToken.email || "", 160)
			.toLowerCase()
			.trim()
		const displayName = normalizeShortText(authToken.name || "", 120)
		const details = normalizeShortText(data.details || "", 280)
		const source = normalizeShortText(data.source || "", 80)

		await admin
			.firestore()
			.collection("accountChangeHistory")
			.add({
				uid,
				email,
				displayName,
				changeType,
				changeLabel: getAccountChangeLabel(changeType),
				details,
				source,
				createdAt: admin.firestore.FieldValue.serverTimestamp(),
			})

		const shouldAlert = [
			"password_changed",
			"email_changed",
			"account_deleted",
			"account_deactivated",
		].includes(changeType)

		if (shouldAlert) {
			await createSecurityAlert({
				type: changeType,
				uid,
				email,
				displayName,
				severity: SECURITY_ALERT_SEVERITY[changeType] || "medium",
				message: `${getAccountChangeLabel(changeType)} event recorded`,
				metadata: {
					source,
					details,
				},
			})
		}

		return { ok: true }
	},
)

exports.sendBookingConfirmationEmail = onDocumentCreated(
	{
		document: "bookings/{bookingId}",
		secrets: [RESEND_API_KEY, RESEND_FROM_EMAIL],
		region: "europe-west1",
	},
	async (event) => {
		const snapshot = event.data
		if (!snapshot) return

		const bookingId = event.params.bookingId
		const booking = snapshot.data()

		if (!booking?.email) {
			logger.warn("Booking missing email. Skipping send.", { bookingId })
			return
		}

		const resend = getResendClient()

		const customerName = buildCustomerName(booking)

		const textContent = [
			`Hi ${customerName},`,
			"",
			"Your booking has been confirmed.",
			`Booking ID: ${bookingId}`,
			`Service: ${booking.service || "N/A"}`,
			`Stylist: ${booking.stylist || "Any Available"}`,
			`Date: ${booking.date || "N/A"}`,
			`Time: ${booking.time || "N/A"}`,
			"",
			"Thank you for choosing Royal Braids!",
		].join("\n")

		const htmlContent = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
          <h2 style="margin-bottom: 8px;">Booking Confirmed ✅</h2>
          <p>Hi <strong>${customerName}</strong>,</p>
          <p>Your appointment at <strong>Royal Braids</strong> has been confirmed.</p>
          <table style="border-collapse: collapse; margin: 16px 0;">
            <tr><td style="padding: 6px 10px; font-weight: bold;">Booking ID:</td><td style="padding: 6px 10px;">${bookingId}</td></tr>
            <tr><td style="padding: 6px 10px; font-weight: bold;">Service:</td><td style="padding: 6px 10px;">${booking.service || "N/A"}</td></tr>
            <tr><td style="padding: 6px 10px; font-weight: bold;">Stylist:</td><td style="padding: 6px 10px;">${booking.stylist || "Any Available"}</td></tr>
            <tr><td style="padding: 6px 10px; font-weight: bold;">Date:</td><td style="padding: 6px 10px;">${booking.date || "N/A"}</td></tr>
            <tr><td style="padding: 6px 10px; font-weight: bold;">Time:</td><td style="padding: 6px 10px;">${booking.time || "N/A"}</td></tr>
          </table>
          <p>We look forward to seeing you.</p>
          <p>— Royal Braids Team</p>
        </div>
      `

		const message = {
			to: booking.email,
			from: RESEND_FROM_EMAIL.value(),
			subject: "Royal Braids Booking Confirmation",
			text: textContent,
			html: htmlContent,
		}

		try {
			await resend.emails.send(message)
			await snapshot.ref.set(
				{
					emailStatus: "sent",
					emailSentAt: admin.firestore.FieldValue.serverTimestamp(),
				},
				{ merge: true },
			)
			logger.info("Booking confirmation email sent", { bookingId })
		} catch (error) {
			logger.error("Failed to send booking confirmation email", {
				bookingId,
				errorMessage: error?.message || "Unknown error",
			})

			await snapshot.ref.set(
				{
					emailStatus: "failed",
					emailError: error?.message || "Unknown error",
					emailTriedAt: admin.firestore.FieldValue.serverTimestamp(),
				},
				{ merge: true },
			)
		}
	},
)

exports.sendBookingConfirmationWhatsApp = onDocumentCreated(
	{
		document: "bookings/{bookingId}",
		secrets: [WHATSAPP_CLOUD_ACCESS_TOKEN, WHATSAPP_CLOUD_PHONE_NUMBER_ID],
		region: "europe-west1",
	},
	async (event) => {
		const snapshot = event.data
		if (!snapshot) return

		const bookingId = event.params.bookingId
		const booking = snapshot.data()
		const normalizedPhone = normalizePhoneForWhatsApp(booking?.phone)

		if (!normalizedPhone) {
			logger.warn(
				"Booking missing valid phone. Skipping WhatsApp confirmation.",
				{
					bookingId,
				},
			)
			await snapshot.ref.set(
				{
					whatsappStatus: "confirmation_skipped_no_phone",
					whatsappTriedAt: admin.firestore.FieldValue.serverTimestamp(),
				},
				{ merge: true },
			)
			return
		}

		const customerName = buildCustomerName(booking)
		const { dateLabel, timeLabel } = formatBookingDateTimeForMessage(booking)
		const messageBody = [
			`Hi ${customerName}, your Royal Braids booking is confirmed ✅`,
			`Booking ID: ${bookingId}`,
			`Service: ${booking?.service || "N/A"}`,
			`Stylist: ${booking?.stylist || "Any Available"}`,
			`Date: ${dateLabel}`,
			`Time: ${timeLabel}`,
			"See you soon!",
		].join("\n")

		try {
			await sendWhatsAppMessage({
				toPhoneNumber: normalizedPhone,
				messageBody,
			})

			await snapshot.ref.set(
				{
					whatsappStatus: "confirmation_sent",
					whatsappSentAt: admin.firestore.FieldValue.serverTimestamp(),
				},
				{ merge: true },
			)

			logger.info("Booking confirmation WhatsApp sent", { bookingId })
		} catch (error) {
			logger.error("Failed to send booking confirmation WhatsApp", {
				bookingId,
				errorMessage: error?.message || "Unknown error",
			})

			await snapshot.ref.set(
				{
					whatsappStatus: "confirmation_failed",
					whatsappError: error?.message || "Unknown error",
					whatsappTriedAt: admin.firestore.FieldValue.serverTimestamp(),
				},
				{ merge: true },
			)
		}
	},
)

exports.sendUpcomingBookingWhatsAppReminders = onSchedule(
	{
		schedule: "every 15 minutes",
		timeZone: "Africa/Nairobi",
		region: "us-central1",
		secrets: [WHATSAPP_CLOUD_ACCESS_TOKEN, WHATSAPP_CLOUD_PHONE_NUMBER_ID],
	},
	async () => {
		const nowMs = Date.now()
		const minDiffMs = 23 * 60 * 60 * 1000
		const maxDiffMs = 25 * 60 * 60 * 1000

		const bookingsSnap = await admin
			.firestore()
			.collection("bookings")
			.where("status", "==", "confirmed")
			.where("reminderSentAt", "==", null)
			.limit(300)
			.get()

		if (bookingsSnap.empty) {
			logger.info("No candidate bookings for WhatsApp reminders")
			return
		}

		let sentCount = 0
		let failedCount = 0
		let skippedCount = 0

		for (const doc of bookingsSnap.docs) {
			const booking = doc.data()
			const appointmentDate = getBookingAppointmentDate(booking)
			if (!appointmentDate) {
				skippedCount += 1
				continue
			}

			const diffMs = appointmentDate.getTime() - nowMs
			if (diffMs < minDiffMs || diffMs > maxDiffMs) {
				continue
			}

			const normalizedPhone = normalizePhoneForWhatsApp(booking?.phone)
			if (!normalizedPhone) {
				skippedCount += 1
				await doc.ref.set(
					{
						whatsappStatus: "reminder_skipped_no_phone",
						reminderSentAt: admin.firestore.FieldValue.serverTimestamp(),
					},
					{ merge: true },
				)
				continue
			}

			const customerName = buildCustomerName(booking)
			const { dateLabel, timeLabel } = formatBookingDateTimeForMessage(booking)
			const messageBody = [
				`Hi ${customerName}, reminder from Royal Braids ⏰`,
				"Your appointment is in about 24 hours.",
				`Service: ${booking?.service || "N/A"}`,
				`Stylist: ${booking?.stylist || "Any Available"}`,
				`Date: ${dateLabel}`,
				`Time: ${timeLabel}`,
				"Reply to this message if you need help rescheduling.",
			].join("\n")

			try {
				await sendWhatsAppMessage({
					toPhoneNumber: normalizedPhone,
					messageBody,
				})

				sentCount += 1
				await doc.ref.set(
					{
						whatsappStatus: "reminder_sent",
						reminderSentAt: admin.firestore.FieldValue.serverTimestamp(),
					},
					{ merge: true },
				)
			} catch (error) {
				failedCount += 1
				logger.error("Failed to send 24h WhatsApp reminder", {
					bookingId: doc.id,
					errorMessage: error?.message || "Unknown error",
				})

				await doc.ref.set(
					{
						whatsappStatus: "reminder_failed",
						whatsappError: error?.message || "Unknown error",
						reminderTriedAt: admin.firestore.FieldValue.serverTimestamp(),
					},
					{ merge: true },
				)
			}
		}

		logger.info("WhatsApp reminder run completed", {
			totalCandidates: bookingsSnap.size,
			sentCount,
			failedCount,
			skippedCount,
		})
	},
)

exports.initializeBookingSystemFields = onDocumentCreated(
	{
		document: "bookings/{bookingId}",
		region: "europe-west1",
	},
	async (event) => {
		const snapshot = event.data
		if (!snapshot) return

		const data = snapshot.data() || {}
		const patch = {}
		if (typeof data.whatsappStatus !== "string")
			patch.whatsappStatus = "pending"
		if (!("reminderSentAt" in data)) patch.reminderSentAt = null

		if (!Object.keys(patch).length) return
		patch.updatedAt = admin.firestore.FieldValue.serverTimestamp()
		await snapshot.ref.set(patch, { merge: true })
	},
)

exports.updateReviewRateLimit = onDocumentCreated(
	{
		document: "reviews/{reviewId}",
		region: "europe-west1",
	},
	async (event) => {
		const snapshot = event.data
		if (!snapshot) return
		const review = snapshot.data() || {}
		if (!review.uid) return

		await createActivityTimelineEvent({
			type: ACTIVITY_TIMELINE_TYPES.review_posted,
			uid: String(review.uid || "").trim(),
			email: String(review.email || "").trim(),
			displayName: String(review.name || "").trim(),
			source: "reviews",
			context: {
				reviewId: String(event.params.reviewId || "").trim(),
				rating: Number(review.rating || 0) || 0,
				service: normalizeShortText(review.service || "", 80),
			},
		})

		await upsertRateLimit({
			kind: "review",
			uid: review.uid,
			cooldownMs: REVIEW_RATE_LIMIT_COOLDOWN_MS,
		})
	},
)

exports.trackReviewEdited = onDocumentUpdated(
	{
		document: "reviews/{reviewId}",
		region: "europe-west1",
	},
	async (event) => {
		const before = event.data?.before?.data() || {}
		const after = event.data?.after?.data() || {}
		if (!after.uid) return

		const beforeText = String(before.text || "").trim()
		const afterText = String(after.text || "").trim()
		const beforeRating = Number(before.rating || 0) || 0
		const afterRating = Number(after.rating || 0) || 0
		const beforeService = String(before.service || "").trim()
		const afterService = String(after.service || "").trim()

		const wasEdited =
			beforeText !== afterText ||
			beforeRating !== afterRating ||
			beforeService !== afterService

		if (!wasEdited) return

		await createActivityTimelineEvent({
			type: ACTIVITY_TIMELINE_TYPES.review_edited,
			uid: String(after.uid || "").trim(),
			email: String(after.email || "").trim(),
			displayName: String(after.name || "").trim(),
			source: "reviews",
			context: {
				reviewId: String(event.params.reviewId || "").trim(),
				rating: afterRating,
				service: normalizeShortText(after.service || "", 80),
				updatedBy: String(after.uid || "").trim(),
			},
		})
	},
)

exports.updateContactRateLimit = onDocumentCreated(
	{
		document: "contactMessages/{messageId}",
		region: "europe-west1",
	},
	async (event) => {
		const snapshot = event.data
		if (!snapshot) return
		const message = snapshot.data() || {}
		if (!message.uid) return

		await createActivityTimelineEvent({
			type: ACTIVITY_TIMELINE_TYPES.contact_submitted,
			uid: String(message.uid || "").trim(),
			email: String(message.email || "").trim(),
			displayName: String(message.name || "").trim(),
			source: "contact",
			context: {
				messageId: String(event.params.messageId || "").trim(),
				subject: normalizeShortText(message.subject || "", 120),
			},
		})

		await upsertRateLimit({
			kind: "contact",
			uid: message.uid,
			cooldownMs: CONTACT_RATE_LIMIT_COOLDOWN_MS,
		})
	},
)

exports.trackBookingCreated = onDocumentCreated(
	{
		document: "bookings/{bookingId}",
		region: "europe-west1",
	},
	async (event) => {
		const booking = event.data?.data() || {}
		if (!booking.uid) return

		await createActivityTimelineEvent({
			type: ACTIVITY_TIMELINE_TYPES.booking_created,
			uid: String(booking.uid || "").trim(),
			email: String(booking.email || "").trim(),
			displayName: buildCustomerName(booking),
			source: "bookings",
			context: {
				bookingId: String(event.params.bookingId || "").trim(),
				service: normalizeShortText(booking.service || "", 80),
				stylist: normalizeShortText(booking.stylist || "", 80),
				date: normalizeShortText(booking.date || "", 20),
				time: normalizeShortText(booking.time || "", 20),
			},
		})
	},
)

exports.trackBookingCanceled = onDocumentUpdated(
	{
		document: "bookings/{bookingId}",
		region: "europe-west1",
	},
	async (event) => {
		const before = event.data?.before?.data() || {}
		const after = event.data?.after?.data() || {}
		if (!after.uid) return

		const prevStatus = String(before.status || "")
			.trim()
			.toLowerCase()
		const nextStatus = String(after.status || "")
			.trim()
			.toLowerCase()
		if (prevStatus === "cancelled" || nextStatus !== "cancelled") return

		await createActivityTimelineEvent({
			type: ACTIVITY_TIMELINE_TYPES.booking_canceled,
			uid: String(after.uid || "").trim(),
			email: String(after.email || "").trim(),
			displayName: buildCustomerName(after),
			source: "bookings",
			context: {
				bookingId: String(event.params.bookingId || "").trim(),
				service: normalizeShortText(after.service || "", 80),
				stylist: normalizeShortText(after.stylist || "", 80),
				date: normalizeShortText(after.date || "", 20),
				time: normalizeShortText(after.time || "", 20),
				fromStatus: prevStatus,
				toStatus: nextStatus,
			},
		})
	},
)

exports.notifyWaitlistOnSlotOpen = onDocumentDeleted(
	{
		document: "bookingSlots/{slotId}",
		region: "europe-west1",
		secrets: [
			RESEND_API_KEY,
			RESEND_FROM_EMAIL,
			WHATSAPP_CLOUD_ACCESS_TOKEN,
			WHATSAPP_CLOUD_PHONE_NUMBER_ID,
		],
	},
	async (event) => {
		const snapshot = event.data
		if (!snapshot) return

		const slotId = String(event.params.slotId || "").trim()
		if (!slotId) return

		const slotData = snapshot.data() || {}
		const db = admin.firestore()
		let waitlistDocs = []

		try {
			const indexed = await db
				.collection("waitlist")
				.where("preferredSlotId", "==", slotId)
				.where("status", "==", "waiting")
				.orderBy("createdAt", "asc")
				.limit(20)
				.get()
			waitlistDocs = indexed.docs
		} catch (queryError) {
			logger.warn("Waitlist indexed query failed. Using fallback query.", {
				slotId,
				errorMessage: queryError?.message || "Unknown error",
			})
			const fallback = await db
				.collection("waitlist")
				.where("preferredSlotId", "==", slotId)
				.where("status", "==", "waiting")
				.limit(50)
				.get()
			waitlistDocs = fallback.docs.sort(
				(a, b) => toMillis(a.data()?.createdAt) - toMillis(b.data()?.createdAt),
			)
		}

		if (!waitlistDocs.length) {
			logger.info("No waitlist entries for released slot", { slotId })
			return
		}

		const nextEntryDoc = waitlistDocs[0]
		const entry = nextEntryDoc.data() || {}
		const fullName =
			`${entry.firstName || ""} ${entry.lastName || ""}`.trim() || "Client"
		const dateLabel = String(slotData.date || entry.preferredDate || "N/A")
		const timeLabel = String(slotData.time || entry.preferredTime || "N/A")
		const stylistLabel = String(
			entry.stylist || slotData.stylistKey || "Any Available",
		)
		const serviceLabel = String(entry.service || "your selected service")

		const textBody = [
			`Hi ${fullName},`,
			"",
			"Good news — your waitlisted appointment slot is now available! 🎉",
			`Service: ${serviceLabel}`,
			`Date: ${dateLabel}`,
			`Time: ${timeLabel}`,
			`Stylist: ${stylistLabel}`,
			"",
			"Please return to Royal Braids booking page to secure it.",
		].join("\n")

		let emailSent = false
		let whatsappSent = false

		if (entry.email) {
			try {
				const resend = getResendClient()
				await resend.emails.send({
					to: entry.email,
					from: RESEND_FROM_EMAIL.value(),
					subject: "Slot Available: Your Royal Braids Waitlist Alert",
					text: textBody,
				})
				emailSent = true
			} catch (emailError) {
				logger.error("Failed sending waitlist email notification", {
					slotId,
					waitlistId: nextEntryDoc.id,
					errorMessage: emailError?.message || "Unknown error",
				})
			}
		}

		const normalizedPhone = normalizePhoneForWhatsApp(entry.phone)
		if (normalizedPhone) {
			try {
				await sendWhatsAppMessage({
					toPhoneNumber: normalizedPhone,
					messageBody: textBody,
				})
				whatsappSent = true
			} catch (whatsError) {
				logger.error("Failed sending waitlist WhatsApp notification", {
					slotId,
					waitlistId: nextEntryDoc.id,
					errorMessage: whatsError?.message || "Unknown error",
				})
			}
		}

		const anySent = emailSent || whatsappSent
		await nextEntryDoc.ref.set(
			{
				status: anySent ? "notified" : "notification_failed",
				notifiedAt: anySent
					? admin.firestore.FieldValue.serverTimestamp()
					: null,
				notificationChannel: anySent
					? emailSent && whatsappSent
						? "email_whatsapp"
						: emailSent
							? "email"
							: "whatsapp"
					: "none",
				updatedAt: admin.firestore.FieldValue.serverTimestamp(),
			},
			{ merge: true },
		)

		logger.info("Processed waitlist notification for released slot", {
			slotId,
			waitlistId: nextEntryDoc.id,
			emailSent,
			whatsappSent,
		})
	},
)
