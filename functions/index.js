const { onDocumentCreated } = require("firebase-functions/v2/firestore")
const { onSchedule } = require("firebase-functions/v2/scheduler")
const { defineSecret } = require("firebase-functions/params")
const logger = require("firebase-functions/logger")
const admin = require("firebase-admin")
const { Resend } = require("resend")

admin.initializeApp()

const RESEND_API_KEY = defineSecret("RESEND_API_KEY")
const RESEND_FROM_EMAIL = defineSecret("RESEND_FROM_EMAIL")
const TWILIO_ACCOUNT_SID = defineSecret("TWILIO_ACCOUNT_SID")
const TWILIO_AUTH_TOKEN = defineSecret("TWILIO_AUTH_TOKEN")
const TWILIO_WHATSAPP_FROM = defineSecret("TWILIO_WHATSAPP_FROM")
const NAIROBI_TIMEZONE = "Africa/Nairobi"
const NAIROBI_UTC_OFFSET_HOURS = 3

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
	const accountSid = TWILIO_ACCOUNT_SID.value()
	const authToken = TWILIO_AUTH_TOKEN.value()
	const from = TWILIO_WHATSAPP_FROM.value()

	if (typeof fetch !== "function") {
		throw new Error("Global fetch is not available in this Node runtime")
	}

	const endpoint = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`
	const authHeader = Buffer.from(`${accountSid}:${authToken}`).toString(
		"base64",
	)

	const response = await fetch(endpoint, {
		method: "POST",
		headers: {
			Authorization: `Basic ${authHeader}`,
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: new URLSearchParams({
			From: from,
			To: `whatsapp:${toPhoneNumber}`,
			Body: messageBody,
		}),
	})

	const responseText = await response.text()
	if (!response.ok) {
		throw new Error(
			`Twilio WhatsApp send failed (${response.status}): ${responseText.slice(0, 500)}`,
		)
	}

	try {
		return JSON.parse(responseText)
	} catch (_error) {
		return { raw: responseText }
	}
}

exports.sendBookingConfirmationEmail = onDocumentCreated(
	{
		document: "bookings/{bookingId}",
		secrets: [RESEND_API_KEY, RESEND_FROM_EMAIL],
		region: "us-central1",
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

		const resend = new Resend(RESEND_API_KEY.value())

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
		secrets: [TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM],
		region: "us-central1",
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
		secrets: [TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM],
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
