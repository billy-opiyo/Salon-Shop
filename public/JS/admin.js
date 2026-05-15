const appConfig = window.APP_CONFIG || {}
const firebaseConfig = appConfig.firebase || {}
const adminConfig = appConfig.admin || {}
const appCheckConfig = appConfig.appCheck || {}
const cloudinaryConfig = appConfig.cloudinary || {}

let firebaseReady = false
let db = null
let auth = null
let adminFirebaseApp = null
let adminUnlocked = false
let adminBookingsUnsubscribe = null
let adminGalleryUnsubscribe = null
let adminBlogsUnsubscribe = null
let adminReviewsUnsubscribe = null
let adminContactUnsubscribe = null
let adminSecurityUnsubscribe = null
let adminSecurityAlertsUnsubscribe = null
let adminAccountHistoryUnsubscribe = null
let adminGalleryDocs = []
let adminBlogDocs = []
let adminReviewDocs = []
let adminReviewRawDocs = []
let adminContactDocs = []
let adminBookingDocs = []
let adminReviewsSortMode = "featured"
let adminMessagesSortMode = "newest"
let adminSecuritySortMode = "newest"
let adminSecurityAlertsSortMode = "newest"
let adminAccountHistorySortMode = "newest"
let adminSecurityDocs = []
let adminSecurityAlertsDocs = []
let adminAccountHistoryDocs = []
let adminGalleryPreviewObjectUrl = ""
const ADMIN_SCHEDULE_VIEWS = {
	day: "day",
	week: "week",
}
let adminScheduleView = ADMIN_SCHEDULE_VIEWS.week
let adminScheduleSelectedBookingId = ""
let adminScheduleVisibleBookingIds = []
let adminScheduleAnchorDate = new Date()
adminScheduleAnchorDate.setHours(0, 0, 0, 0)
const adminMessageTimers = new Map()
const adminMessageHideTimers = new Map()
const defaultAdminSection = "bookings"
const ADMIN_APP_NAME = "royalBraidsAdminApp"
const ADMIN_REVIEW_KEYS = {
	profanityWords: "rb_admin_profanity_words",
}
const DEFAULT_ADMIN_PROFANITY_WORDS = [
	"fuck",
	"shit",
	"bitch",
	"asshole",
	"idiot",
	"scam",
]
let adminConfirmState = {
	resolve: null,
	isOpen: false,
}

function closeAdminConfirmModal(result = false) {
	const modal = document.getElementById("adminConfirmModal")
	if (!modal || !adminConfirmState.isOpen) return

	modal.classList.remove("active")
	modal.setAttribute("aria-hidden", "true")
	document.body.style.overflow = ""

	adminConfirmState.isOpen = false
	const resolver = adminConfirmState.resolve
	adminConfirmState.resolve = null
	if (typeof resolver === "function") {
		resolver(result)
	}
}

function showAdminConfirmModal(
	message = "Are you sure you want to continue?",
	confirmLabel = "Confirm",
) {
	const modal = document.getElementById("adminConfirmModal")
	const messageEl = document.getElementById("adminConfirmMessage")
	const confirmBtn = document.getElementById("adminConfirmOk")
	if (!modal || !messageEl || !confirmBtn) {
		return Promise.resolve(window.confirm(message))
	}

	messageEl.textContent = message
	confirmBtn.textContent = confirmLabel

	modal.classList.add("active")
	modal.setAttribute("aria-hidden", "false")
	document.body.style.overflow = "hidden"
	adminConfirmState.isOpen = true

	return new Promise((resolve) => {
		adminConfirmState.resolve = resolve
	})
}

function setActiveAdminSection(sectionKey = defaultAdminSection) {
	const tabs = document.querySelectorAll("[data-admin-section-tab]")
	const sections = document.querySelectorAll("[data-admin-section]")
	if (!tabs.length || !sections.length) return

	const normalizedSection = String(
		sectionKey || defaultAdminSection,
	).toLowerCase()

	tabs.forEach((tab) => {
		const isActive = tab.dataset.adminSectionTab === normalizedSection
		tab.classList.toggle("active", isActive)
		tab.setAttribute("aria-selected", isActive ? "true" : "false")
	})

	sections.forEach((section) => {
		const isActive = section.dataset.adminSection === normalizedSection
		section.classList.toggle("active", isActive)
		section.setAttribute("aria-hidden", isActive ? "false" : "true")
	})
}

function initializeAdminSectionTabs() {
	const tabList = document.querySelector(".admin-section-tabs")
	if (!tabList) return

	tabList.addEventListener("click", (event) => {
		const tab = event.target.closest("[data-admin-section-tab]")
		if (!tab) return
		setActiveAdminSection(tab.dataset.adminSectionTab)
	})

	setActiveAdminSection(defaultAdminSection)
}

function setAdminPasswordVisibility(isVisible) {
	const passwordInput = document.getElementById("adminPassword")
	const passwordToggle = document.getElementById("adminPasswordToggle")
	if (!passwordInput || !passwordToggle) return

	const shouldShow = isVisible === true
	passwordInput.type = shouldShow ? "text" : "password"
	passwordToggle.setAttribute("aria-pressed", shouldShow ? "true" : "false")
	passwordToggle.setAttribute(
		"aria-label",
		shouldShow ? "Hide password" : "Show password",
	)

	const icon = passwordToggle.querySelector("i")
	if (icon) {
		icon.classList.toggle("fa-eye", !shouldShow)
		icon.classList.toggle("fa-eye-slash", shouldShow)
	}
}

function canInitializeFirebase() {
	return (
		typeof firebase !== "undefined" &&
		firebaseConfig.apiKey &&
		firebaseConfig.authDomain &&
		firebaseConfig.projectId &&
		firebaseConfig.appId
	)
}

function getOrCreateAdminFirebaseApp() {
	if (!firebase?.apps?.length) {
		return firebase.initializeApp(firebaseConfig, ADMIN_APP_NAME)
	}

	const existingNamed = firebase.apps.find((app) => app.name === ADMIN_APP_NAME)
	if (existingNamed) return existingNamed

	return firebase.initializeApp(firebaseConfig, ADMIN_APP_NAME)
}

function isAllowedAdminEmail(email) {
	if (!email) return false
	const allowed = Array.isArray(adminConfig.allowedEmails)
		? adminConfig.allowedEmails
		: []
	if (!allowed.length) return true
	return allowed.includes(String(email).toLowerCase())
}

function getStatusClass(status) {
	switch (normalizeStatus(status)) {
		case "confirmed":
			return "admin-status-confirmed"
		case "completed":
			return "admin-status-completed"
		case "cancelled":
			return "admin-status-cancelled"
		default:
			return "admin-status-pending"
	}
}

function normalizeStatus(status) {
	const raw = String(status || "pending")
		.trim()
		.toLowerCase()

	if (raw === "complete") return "completed"
	if (raw === "canceled") return "cancelled"
	if (raw === "in progress" || raw === "in_progress" || raw === "in-progress") {
		return "confirmed"
	}

	if (["pending", "confirmed", "completed", "cancelled"].includes(raw)) {
		return raw
	}

	return "pending"
}

function extractRawStatus(booking = {}) {
	return (
		booking.status ??
		booking.bookingStatus ??
		booking.state ??
		booking.booking_state ??
		booking.currentStatus ??
		"pending"
	)
}

function toTimestampMs(value) {
	if (!value) return 0

	if (typeof value?.toMillis === "function") {
		return value.toMillis()
	}

	if (typeof value === "number") return value

	const parsed = Date.parse(String(value))
	return Number.isNaN(parsed) ? 0 : parsed
}

function formatAdminDate(value) {
	if (!value) return "N/A"
	const raw = String(value).trim()
	if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
		const [year, month, day] = raw.split("-").map(Number)
		const localDate = new Date(year, month - 1, day)
		if (!Number.isNaN(localDate.getTime())) {
			return localDate.toLocaleDateString()
		}
	}
	const ms = toTimestampMs(value)
	if (!ms) return raw
	return new Date(ms).toLocaleString()
}

function normalizeAdminScheduleView(view) {
	return view === ADMIN_SCHEDULE_VIEWS.day
		? ADMIN_SCHEDULE_VIEWS.day
		: ADMIN_SCHEDULE_VIEWS.week
}

function formatAdminDateKey(dateValue) {
	const date = new Date(dateValue)
	if (Number.isNaN(date.getTime())) return ""
	const year = date.getFullYear()
	const month = String(date.getMonth() + 1).padStart(2, "0")
	const day = String(date.getDate()).padStart(2, "0")
	return `${year}-${month}-${day}`
}

function parseAdminBookingDate(value) {
	if (!value) return null
	const raw = String(value).trim()
	if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
		const [year, month, day] = raw.split("-").map(Number)
		const date = new Date(year, month - 1, day)
		if (!Number.isNaN(date.getTime())) {
			date.setHours(0, 0, 0, 0)
			return date
		}
	}

	const ms = toTimestampMs(value)
	if (!ms) return null
	const parsed = new Date(ms)
	if (Number.isNaN(parsed.getTime())) return null
	parsed.setHours(0, 0, 0, 0)
	return parsed
}

function parseAdminBookingTimeToMinutes(value) {
	const text = String(value || "")
		.trim()
		.toLowerCase()
	if (!text) return 9 * 60

	const compact = text.replace(/\./g, "").replace(/\s+/g, "")
	const match = compact.match(/^(\d{1,2})(?::?(\d{2}))?(am|pm)?$/)
	if (!match) return 9 * 60

	let hours = Number(match[1])
	const minutes = Number(match[2] || 0)
	const meridiem = match[3] || ""

	if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return 9 * 60
	if (minutes < 0 || minutes > 59) return 9 * 60

	if (meridiem === "pm" && hours < 12) hours += 12
	if (meridiem === "am" && hours === 12) hours = 0

	if (!meridiem && hours === 24 && minutes === 0) hours = 0
	if (hours < 0 || hours > 23) return 9 * 60

	return hours * 60 + minutes
}

function getAdminBookingStartDate(booking = {}) {
	const dateSource =
		booking.date ??
		booking.bookingDate ??
		booking.appointmentDate ??
		booking.serviceDate ??
		booking.slotDate ??
		booking.createdAt
	const dayDate = parseAdminBookingDate(dateSource)
	if (!dayDate) return null

	const minutes = parseAdminBookingTimeToMinutes(
		booking.time ?? booking.bookingTime ?? booking.slotTime ?? "",
	)
	const startDate = new Date(dayDate)
	startDate.setHours(Math.floor(minutes / 60), minutes % 60, 0, 0)
	return startDate
}

function getAdminBookingCustomerName(booking = {}) {
	return (
		`${booking.firstName || ""} ${booking.lastName || ""}`.trim() ||
		String(booking.name || "").trim() ||
		"Unknown Customer"
	)
}

function getAdminScheduleWeekStart(dateValue) {
	const date = new Date(dateValue)
	date.setHours(0, 0, 0, 0)
	const day = date.getDay()
	const diff = day === 0 ? -6 : 1 - day
	date.setDate(date.getDate() + diff)
	return date
}

function getAdminVisibleScheduleDates() {
	const anchor = parseAdminBookingDate(adminScheduleAnchorDate) || new Date()
	anchor.setHours(0, 0, 0, 0)

	if (
		normalizeAdminScheduleView(adminScheduleView) === ADMIN_SCHEDULE_VIEWS.day
	) {
		return [anchor]
	}

	const start = getAdminScheduleWeekStart(anchor)
	return Array.from({ length: 7 }, (_, idx) => {
		const day = new Date(start)
		day.setDate(start.getDate() + idx)
		return day
	})
}

function formatAdminScheduleRangeLabel(visibleDates = []) {
	if (!visibleDates.length) return "Schedule"
	if (visibleDates.length === 1) {
		return visibleDates[0].toLocaleDateString(undefined, {
			weekday: "long",
			month: "long",
			day: "numeric",
			year: "numeric",
		})
	}

	const start = visibleDates[0]
	const end = visibleDates[visibleDates.length - 1]
	const sameYear = start.getFullYear() === end.getFullYear()
	const startLabel = start.toLocaleDateString(undefined, {
		month: "short",
		day: "numeric",
		...(sameYear ? {} : { year: "numeric" }),
	})
	const endLabel = end.toLocaleDateString(undefined, {
		month: "short",
		day: "numeric",
		year: "numeric",
	})
	return `${startLabel} - ${endLabel}`
}

function moveAdminScheduleAnchorByDays(days = 0) {
	const anchor = parseAdminBookingDate(adminScheduleAnchorDate) || new Date()
	anchor.setDate(anchor.getDate() + Number(days || 0))
	anchor.setHours(0, 0, 0, 0)
	adminScheduleAnchorDate = anchor
}

function getAdminScheduleTimeBucketLabel(dateValue) {
	const date = new Date(dateValue)
	const hour = Number.isNaN(date.getTime()) ? 9 : date.getHours()

	if (hour < 6) return "Late Night"
	if (hour < 12) return "Morning"
	if (hour < 17) return "Afternoon"
	if (hour < 22) return "Evening"
	return "Late Night"
}

function selectPreviousAdminScheduleBooking() {
	const ids = Array.isArray(adminScheduleVisibleBookingIds)
		? adminScheduleVisibleBookingIds.filter(Boolean)
		: []

	if (!ids.length) {
		adminScheduleSelectedBookingId = ""
		renderAdminSchedule()
		return
	}

	const currentId = String(adminScheduleSelectedBookingId || "")
	const currentIndex = currentId ? ids.indexOf(currentId) : -1
	const prevIndex =
		currentIndex >= 0
			? (currentIndex - 1 + ids.length) % ids.length
			: ids.length - 1

	adminScheduleSelectedBookingId = ids[prevIndex]
	renderAdminSchedule()
}

function selectNextAdminScheduleBooking() {
	const ids = Array.isArray(adminScheduleVisibleBookingIds)
		? adminScheduleVisibleBookingIds.filter(Boolean)
		: []

	if (!ids.length) {
		adminScheduleSelectedBookingId = ""
		renderAdminSchedule()
		return
	}

	const currentId = String(adminScheduleSelectedBookingId || "")
	const currentIndex = currentId ? ids.indexOf(currentId) : -1
	const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % ids.length : 0

	adminScheduleSelectedBookingId = ids[nextIndex]
	renderAdminSchedule()
}

function renderAdminScheduleDetails(booking = null) {
	const details = document.getElementById("adminScheduleDetails")
	if (!details) return

	if (!booking) {
		details.innerHTML =
			'<div class="admin-empty-state">Click a calendar event to view booking details and quick actions.</div>'
		return
	}

	const status = normalizeStatus(extractRawStatus(booking))
	const customerName = getAdminBookingCustomerName(booking)
	const specialRequest = String(
		booking.notes || booking.specialRequest || "",
	).trim()
	const inspirationImageUrl = String(
		booking.inspirationImageUrl ||
			booking.inspirationImage ||
			booking.referenceImageUrl ||
			"",
	).trim()

	details.innerHTML = `
		<article class="admin-booking-item admin-schedule-detail-card">
			<div class="admin-booking-item-head">
				<div>
					<div class="admin-booking-name">${escapeHtml(customerName)}</div>
					<div class="admin-booking-id">Booking ID: ${escapeHtml(booking.id || "N/A")}</div>
				</div>
				<span class="admin-status-badge ${getStatusClass(status)}">${escapeHtml(status)}</span>
			</div>

			<div class="admin-booking-meta">
				<div><span>Service:</span> ${escapeHtml(booking.service || "N/A")}</div>
				<div><span>Stylist:</span> ${escapeHtml(booking.stylist || "Any Available")}</div>
				<div><span>Date:</span> ${escapeHtml(formatAdminDate(booking.date))}</div>
				<div><span>Time:</span> ${escapeHtml(booking.time || "N/A")}</div>
				<div><span>Email:</span> ${escapeHtml(booking.email || "N/A")}</div>
				<div><span>Phone:</span> ${escapeHtml(booking.phone || "N/A")}</div>
			</div>

			<div class="admin-booking-special-request">
				<span>Special Request:</span>
				<p>${specialRequest ? escapeHtml(specialRequest) : "No special request provided."}</p>
			</div>

			<div class="admin-booking-inspiration">
				<div><span>Inspiration Image:</span> ${inspirationImageUrl ? `<a class="admin-inline-link" href="${escapeHtml(inspirationImageUrl)}" target="_blank" rel="noopener">Open full image</a>` : "Not provided"}</div>
			</div>

			<div class="admin-booking-actions admin-schedule-detail-actions">
				<button class="admin-action-btn admin-schedule-prev-btn" data-schedule-nav="previous">← Previous Booking</button>
				<button class="admin-action-btn admin-schedule-next-btn" data-schedule-nav="next">Next Booking →</button>
				<button class="admin-action-btn" data-schedule-action="pending" data-id="${escapeHtml(booking.id || "")}">Set Pending</button>
				<button class="admin-action-btn" data-schedule-action="confirmed" data-id="${escapeHtml(booking.id || "")}">Confirm</button>
				<button class="admin-action-btn" data-schedule-action="completed" data-id="${escapeHtml(booking.id || "")}">Complete</button>
				<button class="admin-action-btn danger" data-schedule-action="cancel-release" data-id="${escapeHtml(booking.id || "")}">Cancel + Release Slot</button>
			</div>
		</article>
	`
}

function renderAdminSchedule() {
	const grid = document.getElementById("adminScheduleGrid")
	const rangeLabel = document.getElementById("adminScheduleRangeLabel")
	if (!grid) return

	const view = normalizeAdminScheduleView(adminScheduleView)
	adminScheduleView = view

	const viewButtons = document.querySelectorAll("[data-schedule-view]")
	viewButtons.forEach((button) => {
		const active = button.dataset.scheduleView === view
		button.classList.toggle("active", active)
		button.setAttribute("aria-pressed", active ? "true" : "false")
	})

	const visibleDates = getAdminVisibleScheduleDates()
	if (rangeLabel) {
		rangeLabel.textContent = formatAdminScheduleRangeLabel(visibleDates)
	}

	const normalizedDocs = (
		Array.isArray(adminBookingDocs) ? adminBookingDocs : []
	).map((booking) => ({
		...booking,
		status: normalizeStatus(extractRawStatus(booking)),
	}))

	const grouped = new Map()
	visibleDates.forEach((date) => {
		grouped.set(formatAdminDateKey(date), [])
	})

	let selectedBooking = null
	normalizedDocs.forEach((booking) => {
		const startDate = getAdminBookingStartDate(booking)
		if (!startDate) return

		const dateKey = formatAdminDateKey(startDate)
		if (!grouped.has(dateKey)) return

		const scheduleBooking = {
			...booking,
			__scheduleStart: startDate,
		}
		grouped.get(dateKey).push(scheduleBooking)

		if (booking.id && booking.id === adminScheduleSelectedBookingId) {
			selectedBooking = scheduleBooking
		}
	})

	grouped.forEach((items) => {
		items.sort(
			(a, b) => a.__scheduleStart.getTime() - b.__scheduleStart.getTime(),
		)
	})

	if (adminScheduleSelectedBookingId && !selectedBooking) {
		adminScheduleSelectedBookingId = ""
	}

	const orderedVisibleBookings = []
	visibleDates.forEach((date) => {
		const items = grouped.get(formatAdminDateKey(date)) || []
		orderedVisibleBookings.push(...items)
	})

	adminScheduleVisibleBookingIds = orderedVisibleBookings
		.map((booking) => String(booking.id || "").trim())
		.filter(Boolean)

	if (!selectedBooking) {
		const firstVisible = orderedVisibleBookings[0] || null
		if (firstVisible) {
			selectedBooking = firstVisible
			adminScheduleSelectedBookingId = String(firstVisible.id || "")
		}
	}

	grid.classList.toggle("is-week-view", view === ADMIN_SCHEDULE_VIEWS.week)
	grid.innerHTML = visibleDates
		.map((date) => {
			const dateKey = formatAdminDateKey(date)
			const items = grouped.get(dateKey) || []
			const dayLabel = date.toLocaleDateString(undefined, { weekday: "short" })
			const dateLabel = date.toLocaleDateString(undefined, {
				month: "short",
				day: "numeric",
			})

			const itemsHtml = items.length
				? (() => {
						const bucketOrder = [
							"Morning",
							"Afternoon",
							"Evening",
							"Late Night",
						]
						const groupedByBucket = new Map()

						items.forEach((booking) => {
							const bucket = getAdminScheduleTimeBucketLabel(
								booking.__scheduleStart,
							)
							if (!groupedByBucket.has(bucket)) {
								groupedByBucket.set(bucket, [])
							}
							groupedByBucket.get(bucket).push(booking)
						})

						return bucketOrder
							.filter((bucket) => groupedByBucket.has(bucket))
							.map((bucket) => {
								const bucketItems = groupedByBucket.get(bucket) || []
								const eventsHtml = bucketItems
									.map((booking) => {
										const status = normalizeStatus(extractRawStatus(booking))
										const selectedClass =
											booking.id === adminScheduleSelectedBookingId
												? " is-selected"
												: ""
										const displayTime =
											String(booking.time || "").trim() ||
											booking.__scheduleStart.toLocaleTimeString(undefined, {
												hour: "2-digit",
												minute: "2-digit",
											})

										return `
											<button
												type="button"
												class="admin-schedule-event ${getStatusClass(status)}${selectedClass}"
												data-schedule-booking="${escapeHtml(booking.id || "")}" 
											>
												<div class="admin-schedule-event-time">${escapeHtml(displayTime)}</div>
												<div class="admin-schedule-event-name">${escapeHtml(getAdminBookingCustomerName(booking))}</div>
												<div class="admin-schedule-event-service">${escapeHtml(booking.service || "Service not set")}</div>
											</button>
										`
									})
									.join("")

								return `
									<div class="admin-schedule-bucket">
										<div class="admin-schedule-bucket-label">${escapeHtml(bucket)}</div>
										${eventsHtml}
									</div>
								`
							})
							.join("")
					})()
				: '<div class="admin-schedule-empty-day">No bookings</div>'

			return `
				<section class="admin-schedule-day-column">
					<header class="admin-schedule-day-header">
						<h4>${escapeHtml(dayLabel)}</h4>
						<p>${escapeHtml(dateLabel)}</p>
					</header>
					<div class="admin-schedule-day-events">${itemsHtml}</div>
				</section>
			`
		})
		.join("")

	renderAdminScheduleDetails(selectedBooking)
}

function stopAdminBookingsListener() {
	if (typeof adminBookingsUnsubscribe === "function") {
		adminBookingsUnsubscribe()
		adminBookingsUnsubscribe = null
	}
}

function stopAdminGalleryListener() {
	if (typeof adminGalleryUnsubscribe === "function") {
		adminGalleryUnsubscribe()
		adminGalleryUnsubscribe = null
	}
}

function stopAdminBlogsListener() {
	if (typeof adminBlogsUnsubscribe === "function") {
		adminBlogsUnsubscribe()
		adminBlogsUnsubscribe = null
	}
}

function stopAdminReviewsListener() {
	if (typeof adminReviewsUnsubscribe === "function") {
		adminReviewsUnsubscribe()
		adminReviewsUnsubscribe = null
	}
}

function stopAdminContactListener() {
	if (typeof adminContactUnsubscribe === "function") {
		adminContactUnsubscribe()
		adminContactUnsubscribe = null
	}
}

function stopAdminSecurityListener() {
	if (typeof adminSecurityUnsubscribe === "function") {
		adminSecurityUnsubscribe()
		adminSecurityUnsubscribe = null
	}
}

function stopAdminSecurityAlertsListener() {
	if (typeof adminSecurityAlertsUnsubscribe === "function") {
		adminSecurityAlertsUnsubscribe()
		adminSecurityAlertsUnsubscribe = null
	}
}

function stopAdminAccountHistoryListener() {
	if (typeof adminAccountHistoryUnsubscribe === "function") {
		adminAccountHistoryUnsubscribe()
		adminAccountHistoryUnsubscribe = null
	}
}

function setAdminMessage(type, text, targetId = "adminMessage") {
	const msg = document.getElementById(targetId)
	if (!msg) return
	const isGalleryToast = targetId === "adminGalleryMessage"

	const existingTimer = adminMessageTimers.get(targetId)
	if (existingTimer) {
		clearTimeout(existingTimer)
		adminMessageTimers.delete(targetId)
	}

	const existingHideTimer = adminMessageHideTimers.get(targetId)
	if (existingHideTimer) {
		clearTimeout(existingHideTimer)
		adminMessageHideTimers.delete(targetId)
	}

	const hideMessage = (animated = false) => {
		if (animated) {
			msg.classList.remove("is-visible")
			msg.classList.add("is-leaving")
			const hideTimer = setTimeout(() => {
				msg.className = "form-message"
				msg.style.display = "none"
				msg.textContent = ""
				adminMessageHideTimers.delete(targetId)
			}, 320)
			adminMessageHideTimers.set(targetId, hideTimer)
			return
		}

		msg.className = "form-message"
		msg.style.display = "none"
		msg.textContent = ""
	}

	if (!text) {
		hideMessage(false)
		return
	}

	msg.className = isGalleryToast
		? `form-message ${type} form-message--toast`
		: `form-message ${type}`
	msg.textContent = text
	msg.style.display = "block"
	msg.classList.remove("is-leaving")
	requestAnimationFrame(() => {
		msg.classList.add("is-visible")
	})

	const shouldAutoDismiss = type === "success" || type === "error"
	if (!shouldAutoDismiss) return

	const timer = setTimeout(() => {
		hideMessage(true)
		adminMessageTimers.delete(targetId)
	}, 4200)

	adminMessageTimers.set(targetId, timer)
}

function setAdminUnlockedState(value) {
	adminUnlocked = value

	const panel = document.getElementById("adminPanel")
	const loginForm = document.getElementById("adminLoginForm")
	const logoutBtn = document.getElementById("adminLogoutBtn")
	const userState = document.getElementById("adminUserState")
	const currentUser = auth?.currentUser || null

	if (panel) panel.style.display = value ? "block" : "none"
	if (loginForm) loginForm.style.display = value ? "none" : "grid"
	if (logoutBtn) logoutBtn.style.display = value ? "inline-flex" : "none"

	if (userState) {
		userState.textContent = value
			? `Logged in as: ${currentUser?.email || "Admin"}`
			: "Not logged in"
	}

	if (!value) {
		stopAdminBookingsListener()
		stopAdminGalleryListener()
		stopAdminBlogsListener()
		stopAdminReviewsListener()
		stopAdminContactListener()
		stopAdminSecurityListener()
		stopAdminSecurityAlertsListener()
		stopAdminAccountHistoryListener()
		setAdminMessage("", "")
		setAdminMessage("", "", "adminGalleryMessage")
		setAdminMessage("", "", "adminBlogsMessage")
		setAdminMessage("", "", "adminReviewsMessage")
		setAdminMessage("", "", "adminContactMessage")
		setAdminMessage("", "", "adminSecurityMessage")
		setAdminMessage("", "", "adminSecurityEventsMessage")
		setAdminMessage("", "", "adminScheduleMessage")
		adminBookingDocs = []
		adminSecurityDocs = []
		adminSecurityAlertsDocs = []
		adminAccountHistoryDocs = []
		adminScheduleSelectedBookingId = ""
		renderAdminSchedule()
	} else {
		startAdminBookingsListener()
		startAdminGalleryListener()
		startAdminBlogsListener()
		startAdminReviewsListener()
		startAdminContactListener()
		startAdminSecurityListener()
		startAdminSecurityAlertsListener()
		startAdminAccountHistoryListener()
		setAdminMessage("success", "✅ Admin login successful.", "adminAuthMessage")
	}
}

function normalizeContactStatus(status) {
	const raw = String(status || "new")
		.trim()
		.toLowerCase()
	if (["new", "read", "resolved"].includes(raw)) return raw
	return "new"
}

function getContactStatusClass(status) {
	switch (normalizeContactStatus(status)) {
		case "resolved":
			return "admin-status-completed"
		case "read":
			return "admin-status-confirmed"
		default:
			return "admin-status-pending"
	}
}

function normalizeSecurityStatus(status = "") {
	const raw = String(status || "success")
		.trim()
		.toLowerCase()
	return raw === "failure" ? "failure" : "success"
}

function normalizeSecurityMethod(method = "") {
	const raw = String(method || "unknown")
		.trim()
		.toLowerCase()
	if (raw === "google") return "Google"
	if (raw === "email/password" || raw === "password" || raw === "email") {
		return "Email/Password"
	}
	if (raw === "anonymous") return "Anonymous"
	return "Unknown"
}

function normalizeSecurityDeviceType(deviceType = "") {
	const raw = String(deviceType || "unknown")
		.trim()
		.toLowerCase()
	if (["mobile", "desktop", "tablet"].includes(raw)) {
		return raw.charAt(0).toUpperCase() + raw.slice(1)
	}
	return "Unknown"
}

function normalizeSecurityDoc(doc = {}) {
	const status = normalizeSecurityStatus(doc.status)
	const suspiciousFlags = Array.isArray(doc.suspiciousFlags)
		? doc.suspiciousFlags
				.map((flag) => String(flag || "").trim())
				.filter(Boolean)
		: []
	const isSuspicious = doc.suspicious === true || suspiciousFlags.length > 0

	return {
		id: String(doc.id || ""),
		uid: String(doc.uid || ""),
		displayName: String(doc.displayName || "").trim(),
		email: String(doc.email || "").trim(),
		method: normalizeSecurityMethod(doc.method),
		deviceType: normalizeSecurityDeviceType(doc.deviceType),
		browser: String(doc.browser || "Unknown").trim() || "Unknown",
		locationLabel:
			String(doc.locationLabel || "").trim() ||
			[
				String(doc.locationCity || "").trim(),
				String(doc.locationCountry || "").trim(),
			]
				.filter(Boolean)
				.join(", ") ||
			"Unknown",
		ipMasked: String(doc.ipMasked || "").trim() || "Masked",
		status,
		failureCode: String(doc.failureCode || "").trim(),
		isSuspicious,
		suspiciousFlags,
		createdAt: doc.createdAt || null,
	}
}

function sortAdminSecurityActivities(items = [], mode = adminSecuritySortMode) {
	const data = [...items]
	if (mode === "oldest") {
		return data.sort(
			(a, b) => toTimestampMs(a.createdAt) - toTimestampMs(b.createdAt),
		)
	}

	if (mode === "failed-first") {
		return data.sort((a, b) => {
			if (a.status !== b.status) {
				return a.status === "failure" ? -1 : 1
			}
			return toTimestampMs(b.createdAt) - toTimestampMs(a.createdAt)
		})
	}

	if (mode === "suspicious-first") {
		return data.sort((a, b) => {
			if (a.isSuspicious !== b.isSuspicious) {
				return a.isSuspicious ? -1 : 1
			}
			return toTimestampMs(b.createdAt) - toTimestampMs(a.createdAt)
		})
	}

	return data.sort(
		(a, b) => toTimestampMs(b.createdAt) - toTimestampMs(a.createdAt),
	)
}

function renderAdminSecurityActivities(docs = []) {
	const mount = document.getElementById("adminSecurityActivityList")
	if (!mount) return

	const normalized = docs.map(normalizeSecurityDoc)
	const sorted = sortAdminSecurityActivities(normalized, adminSecuritySortMode)
	adminSecurityDocs = sorted

	const total = sorted.length
	const successCount = sorted.filter((item) => item.status === "success").length
	const failedCount = sorted.filter((item) => item.status === "failure").length
	const suspiciousCount = sorted.filter((item) => item.isSuspicious).length

	const totalEl = document.getElementById("adminSecurityTotalCount")
	const successEl = document.getElementById("adminSecuritySuccessCount")
	const failedEl = document.getElementById("adminSecurityFailedCount")
	const suspiciousEl = document.getElementById("adminSecuritySuspiciousCount")

	if (totalEl) totalEl.textContent = String(total)
	if (successEl) successEl.textContent = String(successCount)
	if (failedEl) failedEl.textContent = String(failedCount)
	if (suspiciousEl) suspiciousEl.textContent = String(suspiciousCount)

	const shouldEnableVerticalScroll = sorted.length > 4
	mount.classList.toggle(
		"is-vertical-scroll-active",
		shouldEnableVerticalScroll,
	)
	mount.setAttribute(
		"data-scroll-active",
		shouldEnableVerticalScroll ? "true" : "false",
	)

	if (!sorted.length) {
		mount.innerHTML =
			'<div class="admin-empty-state">No login activity yet. Activity appears here once users attempt sign-in.</div>'
		return
	}

	mount.innerHTML = `
		<table class="admin-security-table">
			<thead>
				<tr>
					<th>User</th>
					<th>Method</th>
					<th>Device/Browser</th>
					<th>Location</th>
					<th>IP (Masked)</th>
					<th>Status</th>
					<th>Suspicious</th>
					<th>Time</th>
				</tr>
			</thead>
			<tbody>
				${sorted
					.map((item) => {
						const userLabel =
							item.displayName || item.email || item.uid || "Unknown user"
						const statusClass =
							item.status === "success"
								? "admin-status-completed"
								: "admin-status-cancelled"
						const suspiciousText = item.isSuspicious
							? item.suspiciousFlags.join(", ") || "Flagged"
							: "No"

						return `
							<tr>
								<td>${escapeHtml(userLabel)}</td>
								<td>${escapeHtml(item.method)}</td>
								<td>${escapeHtml(`${item.deviceType} ${item.browser}`)}</td>
								<td>${escapeHtml(item.locationLabel)}</td>
								<td>${escapeHtml(item.ipMasked)}</td>
								<td><span class="admin-status ${statusClass}">${escapeHtml(item.status)}</span></td>
								<td>${escapeHtml(suspiciousText)}</td>
								<td>${escapeHtml(formatAdminDate(item.createdAt))}</td>
							</tr>
						`
					})
					.join("")}
			</tbody>
		</table>
	`
}

function normalizeAlertSeverity(severity = "") {
	const raw = String(severity || "")
		.trim()
		.toLowerCase()
	if (["low", "medium", "high"].includes(raw)) return raw
	return "medium"
}

function normalizeAlertStatus(status = "") {
	const raw = String(status || "")
		.trim()
		.toLowerCase()
	if (["open", "investigating", "resolved"].includes(raw)) return raw
	return "open"
}

function normalizeSecurityAlertDoc(doc = {}) {
	const type = String(doc.type || "")
		.trim()
		.toLowerCase()
	const severity = normalizeAlertSeverity(doc.severity)
	const status = normalizeAlertStatus(doc.status)
	const message =
		String(doc.message || "").trim() ||
		String(type || "security alert").replace(/_/g, " ")

	return {
		id: String(doc.id || ""),
		type,
		severity,
		status,
		message,
		email: String(doc.email || "").trim(),
		displayName: String(doc.displayName || "").trim(),
		uid: String(doc.uid || "").trim(),
		createdAt: doc.createdAt || null,
	}
}

function sortAdminSecurityAlerts(
	items = [],
	mode = adminSecurityAlertsSortMode,
) {
	const data = [...items]
	if (mode === "oldest") {
		return data.sort(
			(a, b) => toTimestampMs(a.createdAt) - toTimestampMs(b.createdAt),
		)
	}

	if (mode === "high-first") {
		const priority = { high: 0, medium: 1, low: 2 }
		return data.sort((a, b) => {
			const pDiff = (priority[a.severity] ?? 9) - (priority[b.severity] ?? 9)
			if (pDiff !== 0) return pDiff
			return toTimestampMs(b.createdAt) - toTimestampMs(a.createdAt)
		})
	}

	if (mode === "open-first") {
		return data.sort((a, b) => {
			const aOpen = a.status !== "resolved"
			const bOpen = b.status !== "resolved"
			if (aOpen !== bOpen) return aOpen ? -1 : 1
			return toTimestampMs(b.createdAt) - toTimestampMs(a.createdAt)
		})
	}

	return data.sort(
		(a, b) => toTimestampMs(b.createdAt) - toTimestampMs(a.createdAt),
	)
}

function getAdminSeverityClass(severity = "medium") {
	if (severity === "high") return "admin-status-cancelled"
	if (severity === "low") return "admin-status-completed"
	return "admin-status-pending"
}

function renderAdminSecurityAlerts(docs = []) {
	const mount = document.getElementById("adminSecurityAlertsList")
	if (!mount) return

	const normalized = docs.map(normalizeSecurityAlertDoc)
	const sorted = sortAdminSecurityAlerts(
		normalized,
		adminSecurityAlertsSortMode,
	)
	adminSecurityAlertsDocs = sorted

	const totalEl = document.getElementById("adminSecurityAlertsTotalCount")
	const openEl = document.getElementById("adminSecurityAlertsOpenCount")
	const highEl = document.getElementById("adminSecurityAlertsHighCount")

	const total = sorted.length
	const openCount = sorted.filter((item) => item.status !== "resolved").length
	const highCount = sorted.filter((item) => item.severity === "high").length

	if (totalEl) totalEl.textContent = String(total)
	if (openEl) openEl.textContent = String(openCount)
	if (highEl) highEl.textContent = String(highCount)

	if (!sorted.length) {
		mount.innerHTML =
			'<div class="admin-empty-state">No security alerts yet. Alerts will appear here in realtime.</div>'
		return
	}

	mount.innerHTML = `
		<table class="admin-security-table">
			<thead>
				<tr>
					<th>Alert</th>
					<th>User</th>
					<th>Severity</th>
					<th>Status</th>
					<th>Time</th>
				</tr>
			</thead>
			<tbody>
				${sorted
					.map((item) => {
						const userLabel =
							item.displayName || item.email || item.uid || "Unknown user"
						return `
							<tr>
								<td>${escapeHtml(item.message)}</td>
								<td>${escapeHtml(userLabel)}</td>
								<td><span class="admin-status ${getAdminSeverityClass(item.severity)}">${escapeHtml(item.severity)}</span></td>
								<td>${escapeHtml(item.status)}</td>
								<td>${escapeHtml(formatAdminDate(item.createdAt))}</td>
							</tr>
						`
					})
					.join("")}
			</tbody>
		</table>
	`
}

function normalizeAccountHistoryDoc(doc = {}) {
	const changeType = String(doc.changeType || "")
		.trim()
		.toLowerCase()
	const changeLabel =
		String(doc.changeLabel || "").trim() ||
		String(changeType || "account updated").replace(/_/g, " ")

	return {
		id: String(doc.id || ""),
		changeType,
		changeLabel,
		details: String(doc.details || "").trim(),
		email: String(doc.email || "").trim(),
		displayName: String(doc.displayName || "").trim(),
		uid: String(doc.uid || "").trim(),
		createdAt: doc.createdAt || null,
	}
}

function sortAdminAccountHistory(
	items = [],
	mode = adminAccountHistorySortMode,
) {
	const data = [...items]
	if (mode === "oldest") {
		return data.sort(
			(a, b) => toTimestampMs(a.createdAt) - toTimestampMs(b.createdAt),
		)
	}

	if (mode === "critical-first") {
		const critical = new Set([
			"password_changed",
			"email_changed",
			"account_deleted",
			"account_deactivated",
		])
		return data.sort((a, b) => {
			const aCritical = critical.has(a.changeType)
			const bCritical = critical.has(b.changeType)
			if (aCritical !== bCritical) return aCritical ? -1 : 1
			return toTimestampMs(b.createdAt) - toTimestampMs(a.createdAt)
		})
	}

	if (mode === "type") {
		return data.sort((a, b) => {
			const typeDiff = String(a.changeLabel || "").localeCompare(
				String(b.changeLabel || ""),
				undefined,
				{ sensitivity: "base" },
			)
			if (typeDiff !== 0) return typeDiff
			return toTimestampMs(b.createdAt) - toTimestampMs(a.createdAt)
		})
	}

	return data.sort(
		(a, b) => toTimestampMs(b.createdAt) - toTimestampMs(a.createdAt),
	)
}

function renderAdminAccountHistory(docs = []) {
	const mount = document.getElementById("adminAccountHistoryList")
	if (!mount) return

	const normalized = docs.map(normalizeAccountHistoryDoc)
	const sorted = sortAdminAccountHistory(
		normalized,
		adminAccountHistorySortMode,
	)
	adminAccountHistoryDocs = sorted

	const totalEl = document.getElementById("adminAccountHistoryTotalCount")
	if (totalEl) totalEl.textContent = String(sorted.length)

	if (!sorted.length) {
		mount.innerHTML =
			'<div class="admin-empty-state">No account change history yet. Entries will appear here in realtime.</div>'
		return
	}

	mount.innerHTML = `
		<table class="admin-security-table">
			<thead>
				<tr>
					<th>Change</th>
					<th>User</th>
					<th>Details</th>
					<th>Time</th>
				</tr>
			</thead>
			<tbody>
				${sorted
					.map((item) => {
						const userLabel =
							item.displayName || item.email || item.uid || "Unknown user"
						return `
							<tr>
								<td>${escapeHtml(item.changeLabel)}</td>
								<td>${escapeHtml(userLabel)}</td>
								<td>${escapeHtml(item.details || "-")}</td>
								<td>${escapeHtml(formatAdminDate(item.createdAt))}</td>
							</tr>
						`
					})
					.join("")}
			</tbody>
		</table>
	`
}

function normalizeContactDoc(doc = {}) {
	return {
		id: String(doc.id || ""),
		name: String(doc.name || "Anonymous").trim() || "Anonymous",
		email: String(doc.email || "").trim(),
		subject: String(doc.subject || "").trim() || "No subject",
		message: String(doc.message || "").trim(),
		status: normalizeContactStatus(doc.status),
		uid: String(doc.uid || "").trim(),
		createdAt: doc.createdAt || null,
		updatedAt: doc.updatedAt || null,
	}
}

function sortAdminContactMessages(items = [], mode = adminMessagesSortMode) {
	const data = [...items]

	if (mode === "oldest") {
		return data.sort((a, b) => {
			const createdDiff =
				toTimestampMs(a.createdAt) - toTimestampMs(b.createdAt)
			if (createdDiff !== 0) return createdDiff
			return toTimestampMs(a.updatedAt) - toTimestampMs(b.updatedAt)
		})
	}

	if (mode === "status-new-first") {
		const priority = { new: 0, read: 1, resolved: 2 }
		return data.sort((a, b) => {
			const pDiff =
				(priority[normalizeContactStatus(a.status)] ?? 9) -
				(priority[normalizeContactStatus(b.status)] ?? 9)
			if (pDiff !== 0) return pDiff
			const updatedDiff =
				toTimestampMs(b.updatedAt) - toTimestampMs(a.updatedAt)
			if (updatedDiff !== 0) return updatedDiff
			return toTimestampMs(b.createdAt) - toTimestampMs(a.createdAt)
		})
	}

	if (mode === "status-unresolved-first") {
		return data.sort((a, b) => {
			const aResolved = normalizeContactStatus(a.status) === "resolved"
			const bResolved = normalizeContactStatus(b.status) === "resolved"
			if (aResolved !== bResolved) return aResolved ? 1 : -1
			const updatedDiff =
				toTimestampMs(b.updatedAt) - toTimestampMs(a.updatedAt)
			if (updatedDiff !== 0) return updatedDiff
			return toTimestampMs(b.createdAt) - toTimestampMs(a.createdAt)
		})
	}

	if (mode === "name-az") {
		return data.sort((a, b) => {
			const nameDiff = String(a.name || "").localeCompare(
				String(b.name || ""),
				undefined,
				{
					sensitivity: "base",
				},
			)
			if (nameDiff !== 0) return nameDiff
			return toTimestampMs(b.updatedAt) - toTimestampMs(a.updatedAt)
		})
	}

	return data.sort((a, b) => {
		const updatedDiff = toTimestampMs(b.updatedAt) - toTimestampMs(a.updatedAt)
		if (updatedDiff !== 0) return updatedDiff
		return toTimestampMs(b.createdAt) - toTimestampMs(a.createdAt)
	})
}

function renderAdminContactMessages(docs) {
	const list = document.getElementById("adminContactList")
	if (!list) return

	const normalizedItems = docs.map(normalizeContactDoc)
	adminContactDocs = normalizedItems
	const items = sortAdminContactMessages(normalizedItems)

	const total = items.length
	const newCount = items.filter((m) => m.status === "new").length
	const readCount = items.filter((m) => m.status === "read").length
	const resolvedCount = items.filter((m) => m.status === "resolved").length

	const totalEl = document.getElementById("adminMessagesTotalCount")
	const newEl = document.getElementById("adminMessagesNewCount")
	const readEl = document.getElementById("adminMessagesReadCount")
	const resolvedEl = document.getElementById("adminMessagesResolvedCount")

	if (totalEl) totalEl.textContent = String(total)
	if (newEl) newEl.textContent = String(newCount)
	if (readEl) readEl.textContent = String(readCount)
	if (resolvedEl) resolvedEl.textContent = String(resolvedCount)

	if (!items.length) {
		list.innerHTML =
			'<div class="admin-empty-state">No contact messages yet. New messages will appear in realtime.</div>'
		return
	}

	list.innerHTML = items
		.map(
			(item) => `
      <article class="admin-review-item">
        <div class="admin-review-item-head">
          <div>
            <div class="admin-booking-name">${escapeHtml(item.name)}</div>
            <div class="admin-booking-id">Message ID: ${escapeHtml(item.id)}</div>
          </div>
          <span class="admin-status-badge ${getContactStatusClass(item.status)}">${item.status}</span>
        </div>
        <div class="admin-review-meta">
          <div><span>Email:</span> ${item.email ? `<a class="admin-inline-link" href="mailto:${encodeURIComponent(item.email)}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.email)}</a>` : "N/A"}</div>
          <div><span>Subject:</span> ${escapeHtml(item.subject)}</div>
          <div><span>Sent:</span> ${formatAdminDate(item.createdAt)}</div>
          <div><span>Updated:</span> ${formatAdminDate(item.updatedAt)}</div>
        </div>
        <div class="admin-booking-special-request">
          <span>Message Received:</span>
          <p>${item.message ? escapeHtml(item.message) : "No message content provided."}</p>
        </div>
        <div class="admin-booking-actions">
          <button class="admin-action-btn" data-contact-action="new" data-id="${item.id}">Mark New</button>
          <button class="admin-action-btn" data-contact-action="read" data-id="${item.id}">Mark Read</button>
          <button class="admin-action-btn" data-contact-action="resolved" data-id="${item.id}">Resolve</button>
          <button class="admin-action-btn danger" data-contact-action="delete" data-id="${item.id}">Delete</button>
        </div>
      </article>
    `,
		)
		.join("")
}

async function updateContactMessageStatus(messageId, status) {
	await db
		.collection("contactMessages")
		.doc(messageId)
		.set(
			{
				status: normalizeContactStatus(status),
				updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
			},
			{ merge: true },
		)
}

async function deleteContactMessage(messageId) {
	const confirmed = await showAdminConfirmModal(
		"Delete this contact message permanently? This action cannot be undone.",
		"Delete Message",
	)
	if (!confirmed) return
	await db.collection("contactMessages").doc(messageId).delete()
}

function normalizeReviewStatus(status) {
	const raw = String(status || "pending")
		.trim()
		.toLowerCase()
	if (["pending", "approved", "rejected"].includes(raw)) return raw
	return "pending"
}

function extractReviewStatus(review = {}) {
	return review.status ?? review.reviewStatus ?? "pending"
}

function getReviewStatusClass(status) {
	switch (normalizeReviewStatus(status)) {
		case "approved":
			return "admin-status-confirmed"
		case "rejected":
			return "admin-status-cancelled"
		default:
			return "admin-status-pending"
	}
}

function normalizeReviewDoc(doc = {}) {
	const name =
		String(doc.name || "Anonymous Client").trim() || "Anonymous Client"
	const text = String(doc.text || "").trim()
	const source = String(doc.source || "Website").trim() || "Website"
	const service = String(doc.service || "").trim()
	const ratingRaw = Number(doc.rating)
	const rating = Number.isFinite(ratingRaw)
		? Math.max(1, Math.min(5, Math.round(ratingRaw)))
		: 5

	return {
		id: doc.id,
		name,
		text,
		source,
		service,
		rating,
		photoUrl: String(doc.photoUrl || "").trim(),
		adminReply: String(doc.adminReply || "").trim(),
		reportsCount: Number(doc.reportsCount || 0),
		verifiedBooking: doc.verifiedBooking === true,
		approvedBy: String(doc.approvedBy || "").trim(),
		approvedAt: doc.approvedAt || null,
		status: normalizeReviewStatus(extractReviewStatus(doc)),
		featured: doc.featured === true,
		uid: doc.uid || "",
		createdAt: doc.createdAt,
		updatedAt: doc.updatedAt,
	}
}

function getAdminProfanityWords() {
	try {
		const raw = localStorage.getItem(ADMIN_REVIEW_KEYS.profanityWords)
		if (!raw) return [...DEFAULT_ADMIN_PROFANITY_WORDS]
		const parsed = JSON.parse(raw)
		if (!Array.isArray(parsed)) return [...DEFAULT_ADMIN_PROFANITY_WORDS]
		const cleaned = parsed
			.map((w) =>
				String(w || "")
					.trim()
					.toLowerCase(),
			)
			.filter(Boolean)
		return cleaned.length ? cleaned : [...DEFAULT_ADMIN_PROFANITY_WORDS]
	} catch (_error) {
		return [...DEFAULT_ADMIN_PROFANITY_WORDS]
	}
}

function setAdminProfanityWords(words = []) {
	const cleaned = words
		.map((w) =>
			String(w || "")
				.trim()
				.toLowerCase(),
		)
		.filter(Boolean)
	localStorage.setItem(
		ADMIN_REVIEW_KEYS.profanityWords,
		JSON.stringify(cleaned.length ? cleaned : DEFAULT_ADMIN_PROFANITY_WORDS),
	)
}

function getFlaggedWordsInText(text = "") {
	const normalized = String(text || "").toLowerCase()
	if (!normalized) return []
	return getAdminProfanityWords().filter((word) => normalized.includes(word))
}

function sortAdminReviewsList(items = [], mode = adminReviewsSortMode) {
	const data = [...items]

	if (mode === "newest") {
		return data.sort((a, b) => {
			const updatedDiff =
				toTimestampMs(b.updatedAt) - toTimestampMs(a.updatedAt)
			if (updatedDiff !== 0) return updatedDiff
			return toTimestampMs(b.createdAt) - toTimestampMs(a.createdAt)
		})
	}

	if (mode === "highest-rated") {
		return data.sort((a, b) => {
			const ratingDiff = Number(b.rating || 0) - Number(a.rating || 0)
			if (ratingDiff !== 0) return ratingDiff
			if (a.featured !== b.featured) return a.featured ? -1 : 1
			return toTimestampMs(b.createdAt) - toTimestampMs(a.createdAt)
		})
	}

	return data.sort((a, b) => {
		if (a.featured !== b.featured) return a.featured ? -1 : 1
		const aUpdated = toTimestampMs(a.updatedAt)
		const bUpdated = toTimestampMs(b.updatedAt)
		if (aUpdated !== bUpdated) return bUpdated - aUpdated
		return toTimestampMs(b.createdAt) - toTimestampMs(a.createdAt)
	})
}

function renderAdminReviews(docs) {
	const list = document.getElementById("adminReviewsList")
	if (!list) return

	adminReviewRawDocs = Array.isArray(docs) ? [...docs] : []
	const items = sortAdminReviewsList(docs.map(normalizeReviewDoc))

	adminReviewDocs = items

	const total = items.length
	const pending = items.filter((r) => r.status === "pending").length
	const approved = items.filter((r) => r.status === "approved").length
	const rejected = items.filter((r) => r.status === "rejected").length

	const totalEl = document.getElementById("adminReviewsTotalCount")
	const pendingEl = document.getElementById("adminReviewsPendingCount")
	const approvedEl = document.getElementById("adminReviewsApprovedCount")
	const rejectedEl = document.getElementById("adminReviewsRejectedCount")

	if (totalEl) totalEl.textContent = String(total)
	if (pendingEl) pendingEl.textContent = String(pending)
	if (approvedEl) approvedEl.textContent = String(approved)
	if (rejectedEl) rejectedEl.textContent = String(rejected)

	if (!items.length) {
		list.innerHTML =
			'<div class="admin-empty-state">No reviews yet. New review submissions will appear in realtime.</div>'
		return
	}

	list.innerHTML = items
		.map((item) => {
			const stars = "★".repeat(item.rating) + "☆".repeat(5 - item.rating)
			const isNegative = item.rating <= 3
			return `
      <article class="admin-review-item">
        <div class="admin-review-item-head">
          <div>
            <div class="admin-booking-name">${escapeHtml(item.name)}</div>
            <div class="admin-booking-id">Review ID: ${escapeHtml(item.id)} • ${escapeHtml(item.source)}</div>
          </div>
          <span class="admin-status-badge ${getReviewStatusClass(item.status)}">${item.status}</span>
        </div>
        <div class="admin-review-meta">
          <div><span>Rating:</span> ${stars}</div>
          <div><span>Service:</span> ${escapeHtml(item.service || "N/A")}</div>
          <div><span>Featured:</span> ${item.featured ? "Yes" : "No"}</div>
          <div><span>Verified Booking:</span> ${item.verifiedBooking ? "Yes" : "No"}</div>
          <div><span>Reports:</span> ${item.reportsCount}</div>
          <div><span>Approved By:</span> ${escapeHtml(item.approvedBy || "N/A")}</div>
          <div><span>Approved At:</span> ${item.approvedAt ? formatAdminDate(item.approvedAt) : "N/A"}</div>
        </div>
        <p class="admin-review-text">"${escapeHtml(item.text || "")}"</p>
        <textarea class="form-control" data-review-edit-text="${item.id}" rows="3">${escapeHtml(item.text || "")}</textarea>
		${item.photoUrl ? `<div style="margin:8px 0"><img src="${escapeHtml(item.photoUrl)}" alt="Review Photo" loading="lazy" decoding="async" fetchpriority="low" style="max-width:180px;border-radius:8px"/></div>` : ""}
        ${isNegative ? `<textarea class="form-control" data-review-reply-text="${item.id}" rows="2" placeholder="Admin reply for negative feedback...">${escapeHtml(item.adminReply || "")}</textarea>` : ""}
        <div class="admin-booking-actions">
          <button class="admin-action-btn" data-review-action="save-edit" data-id="${item.id}">Save Edit</button>
          ${isNegative ? `<button class="admin-action-btn" data-review-action="save-reply" data-id="${item.id}">Save Reply</button>` : ""}
          <button class="admin-action-btn" data-review-action="pending" data-id="${item.id}">Set Pending</button>
          <button class="admin-action-btn" data-review-action="approved" data-id="${item.id}">Approve</button>
          <button class="admin-action-btn danger" data-review-action="rejected" data-id="${item.id}">Reject</button>
          <button class="admin-action-btn" data-review-action="toggle-featured" data-id="${item.id}">${item.featured ? "Unfeature" : "Feature"}</button>
          <button class="admin-action-btn danger" data-review-action="delete" data-id="${item.id}">Delete</button>
        </div>
      </article>
    `
		})
		.join("")
}

async function updateReviewStatus(reviewId, status) {
	const normalizedStatus = normalizeReviewStatus(status)
	const review = adminReviewDocs.find((r) => r.id === reviewId)
	if (normalizedStatus === "approved") {
		const flagged = getFlaggedWordsInText(review?.text || "")
		if (flagged.length) {
			throw new Error(
				`Cannot approve: flagged content found (${flagged.join(", ")}). Edit review text first.`,
			)
		}
	}

	const payload = {
		status: normalizedStatus,
		updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
	}

	if (normalizedStatus === "approved") {
		payload.approvedBy = auth?.currentUser?.email || "admin"
		payload.approvedAt = firebase.firestore.FieldValue.serverTimestamp()
	}

	await db.collection("reviews").doc(reviewId).set(payload, { merge: true })
}

async function updateReviewText(reviewId, text) {
	await db
		.collection("reviews")
		.doc(reviewId)
		.set(
			{
				text: String(text || "").trim(),
				status: "pending",
				updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
			},
			{ merge: true },
		)
}

async function updateReviewReply(reviewId, reply) {
	await db
		.collection("reviews")
		.doc(reviewId)
		.set(
			{
				adminReply: String(reply || "").trim(),
				updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
			},
			{ merge: true },
		)
}

async function toggleReviewFeatured(reviewId) {
	const review = adminReviewDocs.find((r) => r.id === reviewId)
	const nextFeatured = !(review?.featured === true)
	await db.collection("reviews").doc(reviewId).set(
		{
			featured: nextFeatured,
			updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
		},
		{ merge: true },
	)
}

async function deleteReview(reviewId) {
	const confirmed = await showAdminConfirmModal(
		"Delete this review permanently? This action cannot be undone.",
		"Delete Review",
	)
	if (!confirmed) return
	await db.collection("reviews").doc(reviewId).delete()
}

function handleAuthStateChange(user) {
	if (!user) {
		setAdminUnlockedState(false)
		return
	}

	if (isAllowedAdminEmail(user.email)) {
		setAdminUnlockedState(true)
		setAdminMessage("", "", "adminAuthMessage")
		return
	}

	setAdminMessage(
		"error",
		"❌ This account is not authorized for admin access.",
		"adminAuthMessage",
	)
	setAdminUnlockedState(false)
}

function renderAdminBookings(docs) {
	const list = document.getElementById("adminBookingsList")
	if (!list) return

	const normalizedDocs = docs.map((b) => ({
		...b,
		status: normalizeStatus(extractRawStatus(b)),
	}))
	adminBookingDocs = normalizedDocs

	const total = normalizedDocs.length
	const pending = normalizedDocs.filter((b) => b.status === "pending").length
	const confirmed = normalizedDocs.filter(
		(b) => b.status === "confirmed",
	).length
	const completed = normalizedDocs.filter(
		(b) => b.status === "completed",
	).length
	const cancelled = normalizedDocs.filter(
		(b) => b.status === "cancelled",
	).length

	const totalEl = document.getElementById("adminTotalCount")
	const pendingEl = document.getElementById("adminPendingCount")
	const confirmedEl = document.getElementById("adminConfirmedCount")
	const completedEl = document.getElementById("adminCompletedCount")
	const cancelledEl = document.getElementById("adminCancelledCount")

	if (totalEl) totalEl.textContent = String(total)
	if (pendingEl) pendingEl.textContent = String(pending)
	if (confirmedEl) confirmedEl.textContent = String(confirmed)
	if (completedEl) completedEl.textContent = String(completed)
	if (cancelledEl) cancelledEl.textContent = String(cancelled)

	if (!normalizedDocs.length) {
		list.innerHTML =
			'<div class="admin-empty-state">No bookings yet. New bookings will appear in realtime.</div>'
		renderAdminSchedule()
		return
	}

	const sortedDocs = [...normalizedDocs].sort((a, b) => {
		const aUpdated = toTimestampMs(a.updatedAt)
		const bUpdated = toTimestampMs(b.updatedAt)
		if (aUpdated !== bUpdated) return bUpdated - aUpdated

		const aCreated = toTimestampMs(a.createdAt)
		const bCreated = toTimestampMs(b.createdAt)
		return bCreated - aCreated
	})

	list.innerHTML = sortedDocs
		.map((b) => {
			const status = normalizeStatus(extractRawStatus(b))
			const customerName = getAdminBookingCustomerName(b)
			const specialRequest = String(b.notes || b.specialRequest || "").trim()
			const inspirationImageUrl = String(
				b.inspirationImageUrl ||
					b.inspirationImage ||
					b.referenceImageUrl ||
					"",
			).trim()

			return `
        <div class="admin-booking-item">
          <div class="admin-booking-item-head">
            <div>
              <div class="admin-booking-name">${customerName}</div>
              <div class="admin-booking-id">Booking ID: ${b.id}</div>
            </div>
            <span class="admin-status-badge ${getStatusClass(status)}">${status}</span>
          </div>
          <div class="admin-booking-meta">
            <div><span>Service:</span> ${b.service || "N/A"}</div>
            <div><span>Stylist:</span> ${b.stylist || "Any Available"}</div>
			<div><span>Date:</span> ${formatAdminDate(b.date)}</div>
            <div><span>Time:</span> ${b.time || "N/A"}</div>
            <div><span>Email:</span> ${b.email || "N/A"}</div>
            <div><span>Phone:</span> ${b.phone || "N/A"}</div>
            <div><span>WhatsApp:</span> ${b.whatsappStatus || "pending"}</div>
            <div><span>Reminder Sent:</span> ${b.reminderSentAt ? formatAdminDate(b.reminderSentAt) : "Not sent"}</div>
          </div>
          <div class="admin-booking-special-request">
            <span>Special Request:</span>
            <p>${specialRequest ? escapeHtml(specialRequest) : "No special request provided."}</p>
          </div>
          <div class="admin-booking-inspiration">
            <div><span>Inspiration Image:</span> ${inspirationImageUrl ? `<a href="${escapeHtml(inspirationImageUrl)}" target="_blank" rel="noopener">Open full image</a>` : "Not provided"}</div>
            ${
							inspirationImageUrl
								? `<a class="admin-booking-inspiration-link" href="${escapeHtml(inspirationImageUrl)}" target="_blank" rel="noopener"><img src="${escapeHtml(inspirationImageUrl)}" alt="Inspiration image for ${escapeHtml(customerName)}" class="admin-booking-inspiration-image" loading="lazy" decoding="async" fetchpriority="low" /></a>`
								: ""
						}
          </div>
          <div class="admin-booking-actions">
            <button class="admin-action-btn" data-action="pending" data-id="${b.id}">Set Pending</button>
            <button class="admin-action-btn" data-action="confirmed" data-id="${b.id}">Confirm</button>
            <button class="admin-action-btn" data-action="completed" data-id="${b.id}">Complete</button>
            <button class="admin-action-btn danger" data-action="cancel-release" data-id="${b.id}">Cancel + Release Slot</button>
          </div>
        </div>
      `
		})
		.join("")

	renderAdminSchedule()
}

function galleryDocToViewModel(doc) {
	return {
		id: doc.id,
		styleName: doc.styleName || "Untitled Style",
		styleType: doc.styleType || "N/A",
		length: doc.length || "N/A",
		size: doc.size || "N/A",
		timeTaken: doc.timeTaken || "N/A",
		priceRange: doc.priceRange || "",
		hairType: doc.hairType || "N/A",
		stylistName: doc.stylistName || "N/A",
		imageUrl: doc.imageUrl || "",
		beforeImageUrl: doc.beforeImageUrl || "",
		hasBeforeAfter:
			doc.hasBeforeAfter === true ||
			Boolean(doc.beforeImageUrl && String(doc.beforeImageUrl).trim()),
		featuredTrending: doc.featuredTrending === true,
		featuredMostBooked: doc.featuredMostBooked === true,
		createdAt: doc.createdAt,
		updatedAt: doc.updatedAt,
	}
}

function blogDocToViewModel(doc = {}) {
	return {
		id: String(doc.id || ""),
		title:
			String(doc.title || doc.heading || "Untitled Blog").trim() ||
			"Untitled Blog",
		excerpt: String(doc.excerpt || doc.description || "").trim(),
		imageUrl: String(doc.imageUrl || doc.image || "").trim(),
		readMoreUrl: String(doc.readMoreUrl || doc.url || "").trim(),
		readTime: String(doc.readTime || "5 min read").trim() || "5 min read",
		publishDate: doc.publishDate || doc.date || "",
		createdAt: doc.createdAt || null,
		updatedAt: doc.updatedAt || null,
	}
}

function formatAdminBlogDate(value) {
	if (!value) return "N/A"
	const text = String(value).trim()
	if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
		const [year, month, day] = text.split("-").map(Number)
		const date = new Date(year, month - 1, day)
		if (!Number.isNaN(date.getTime())) {
			return date.toLocaleDateString(undefined, {
				year: "numeric",
				month: "long",
				day: "numeric",
			})
		}
	}

	const ms = toTimestampMs(value)
	if (!ms) return text
	return new Date(ms).toLocaleDateString(undefined, {
		year: "numeric",
		month: "long",
		day: "numeric",
	})
}

function resetAdminBlogsForm() {
	const form = document.getElementById("adminBlogsForm")
	if (!form) return

	form.reset()
	document.getElementById("blogEditId").value = ""
	document.getElementById("adminBlogsFormTitle").textContent = "Add New Blog"
	document.getElementById("adminBlogsSaveBtn").textContent = "Save Blog"
	document.getElementById("adminBlogsCancelEdit").style.display = "none"
}

function loadBlogItemForEditing(id) {
	const item = adminBlogDocs.find((blog) => blog.id === id)
	if (!item) return

	setActiveAdminSection("blogs")

	document.getElementById("blogEditId").value = item.id
	document.getElementById("blogTitle").value = item.title || ""
	document.getElementById("blogExcerpt").value = item.excerpt || ""
	document.getElementById("blogReadTime").value = item.readTime || ""
	document.getElementById("blogDate").value = String(
		item.publishDate || "",
	).trim()
	document.getElementById("blogReadMoreUrl").value = item.readMoreUrl || ""

	document.getElementById("adminBlogsFormTitle").textContent = "Edit Blog"
	document.getElementById("adminBlogsSaveBtn").textContent = "Update Blog"
	document.getElementById("adminBlogsCancelEdit").style.display = "inline-flex"

	setAdminMessage("", "", "adminBlogsMessage")

	const blogsForm = document.getElementById("adminBlogsForm")
	if (blogsForm) {
		requestAnimationFrame(() => {
			const headerOffset = 96
			const targetTop =
				window.scrollY + blogsForm.getBoundingClientRect().top - headerOffset

			window.scrollTo({
				top: Math.max(0, targetTop),
				behavior: "smooth",
			})

			const firstInput = blogsForm.querySelector("input, textarea")
			if (firstInput && typeof firstInput.focus === "function") {
				setTimeout(() => firstInput.focus({ preventScroll: true }), 320)
			}
		})
	}
}

function renderAdminBlogs(docs) {
	const list = document.getElementById("adminBlogsList")
	if (!list) return

	const items = docs.map(blogDocToViewModel).sort((a, b) => {
		const aUpdated = toTimestampMs(a.updatedAt)
		const bUpdated = toTimestampMs(b.updatedAt)
		if (aUpdated !== bUpdated) return bUpdated - aUpdated

		const aCreated = toTimestampMs(a.createdAt)
		const bCreated = toTimestampMs(b.createdAt)
		if (aCreated !== bCreated) return bCreated - aCreated

		return String(b.publishDate || "").localeCompare(
			String(a.publishDate || ""),
		)
	})

	adminBlogDocs = items

	if (!items.length) {
		list.innerHTML =
			'<div class="admin-empty-state">No blog posts yet. Add your first blog above.</div>'
		updateAdminBlogScrollButtons()
		return
	}

	list.innerHTML = items
		.map(
			(item) => `
      <article class="admin-blog-item">
        <div class="admin-blog-thumb-wrap">
			${item.imageUrl ? `<img src="${escapeHtml(item.imageUrl)}" alt="${escapeHtml(item.title)}" class="admin-blog-thumb" loading="lazy" decoding="async" fetchpriority="low" />` : '<div class="admin-blog-thumb admin-blog-thumb--empty">No Image</div>'}
        </div>
        <div class="admin-blog-content">
          <h4>${escapeHtml(item.title)}</h4>
          <div class="admin-blog-meta">
            <span>${escapeHtml(formatAdminBlogDate(item.publishDate || item.createdAt))}</span>
            <span>${escapeHtml(item.readTime || "5 min read")}</span>
          </div>
          <p>${escapeHtml(item.excerpt || "")}</p>
          <a href="${escapeHtml(item.readMoreUrl || "#")}" target="_blank" rel="noopener" class="admin-inline-link">Open Article</a>
        </div>
        <div class="admin-gallery-actions">
          <button class="admin-action-btn" data-blog-action="edit" data-id="${item.id}">Edit</button>
          <button class="admin-action-btn danger" data-blog-action="delete" data-id="${item.id}">Delete</button>
        </div>
      </article>
    `,
		)
		.join("")

	updateAdminBlogScrollButtons()
}

function updateAdminBlogScrollButtons() {
	const list = document.getElementById("adminBlogsList")
	const prevBtn = document.getElementById("adminBlogsPrevBtn")
	const nextBtn = document.getElementById("adminBlogsNextBtn")
	if (!list || !prevBtn || !nextBtn) return

	const canScroll = list.scrollHeight - list.clientHeight > 8
	if (!canScroll) {
		prevBtn.disabled = true
		nextBtn.disabled = true
		return
	}

	prevBtn.disabled = list.scrollTop <= 2
	nextBtn.disabled = list.scrollTop + list.clientHeight >= list.scrollHeight - 2
}

function escapeHtml(value) {
	return String(value ?? "")
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;")
}

function setGalleryPreviewImage(src = "") {
	const previewImage = document.getElementById("adminGalleryPreviewImage")
	const placeholder = document.getElementById("adminGalleryPreviewPlaceholder")
	if (!previewImage || !placeholder) return

	if (src) {
		previewImage.src = src
		previewImage.style.display = "block"
		placeholder.style.display = "none"
		return
	}

	previewImage.removeAttribute("src")
	previewImage.style.display = "none"
	placeholder.style.display = "grid"
}

function setChecklistState(key, done) {
	const item = document.querySelector(
		`.admin-gallery-checklist li[data-check="${key}"]`,
	)
	if (!item) return
	item.classList.toggle("completed", Boolean(done))
}

function updateChecklistProgressMeter() {
	const checklistItems = document.querySelectorAll(
		".admin-gallery-checklist li[data-check]",
	)
	const progressText = document.getElementById(
		"adminGalleryChecklistProgressText",
	)
	const progressFill = document.getElementById(
		"adminGalleryChecklistProgressFill",
	)
	if (!checklistItems.length) return

	let completed = 0
	checklistItems.forEach((item) => {
		if (item.classList.contains("completed")) completed += 1
	})

	const total = checklistItems.length
	const percent = total > 0 ? Math.round((completed / total) * 100) : 0

	if (progressText) {
		progressText.textContent = `${completed}/${total} completed`
	}

	if (progressFill) {
		progressFill.style.width = `${percent}%`
	}
}

function updateGalleryPreview() {
	const styleName =
		document.getElementById("galleryStyleName")?.value?.trim() || ""
	const styleType =
		document.getElementById("galleryStyleType")?.value?.trim() || ""
	const length = document.getElementById("galleryLength")?.value || ""
	const size = document.getElementById("gallerySize")?.value || ""
	const timeTaken =
		document.getElementById("galleryTimeTaken")?.value?.trim() || ""
	const priceRange =
		document.getElementById("galleryPriceRange")?.value?.trim() || ""
	const stylistName =
		document.getElementById("galleryStylistName")?.value?.trim() || ""
	const hasTrending =
		document.getElementById("galleryFeaturedTrending")?.checked === true
	const hasMostBooked =
		document.getElementById("galleryFeaturedMostBooked")?.checked === true
	const beforeImageSelected =
		(document.getElementById("galleryBeforeImage")?.files?.length || 0) > 0

	const previewName = document.getElementById("adminGalleryPreviewName")
	const previewMeta = document.getElementById("adminGalleryPreviewMeta")
	const previewDetails = document.getElementById("adminGalleryPreviewDetails")
	const previewTags = document.getElementById("adminGalleryPreviewTags")
	const beforeAfterBadge = document.getElementById(
		"adminGalleryPreviewBeforeAfterBadge",
	)

	if (previewName) {
		previewName.textContent = styleName || "Style name preview"
	}

	if (previewMeta) {
		previewMeta.textContent = `${styleType || "Type"} • ${length || "Length"} • ${size || "Size"}`
	}

	if (previewDetails) {
		previewDetails.textContent = `Stylist: ${stylistName || "N/A"} • Time: ${timeTaken || "N/A"}`
	}

	if (beforeAfterBadge) {
		beforeAfterBadge.style.display = beforeImageSelected
			? "inline-flex"
			: "none"
	}

	if (previewTags) {
		const tags = []
		if (hasTrending) tags.push("Trending")
		if (hasMostBooked) tags.push("Most Booked")
		if (priceRange) tags.push(priceRange)

		if (!tags.length) {
			previewTags.innerHTML =
				'<span class="admin-gallery-preview-tag is-empty">No tags yet</span>'
		} else {
			previewTags.innerHTML = tags
				.map(
					(tag) =>
						`<span class="admin-gallery-preview-tag">${escapeHtml(tag)}</span>`,
				)
				.join("")
		}
	}

	setChecklistState("styleName", Boolean(styleName))
	setChecklistState("styleType", Boolean(styleType))
	setChecklistState("stylistName", Boolean(stylistName))
	setChecklistState("timeTaken", Boolean(timeTaken))
	setChecklistState(
		"mainImage",
		(document.getElementById("galleryMainImage")?.files?.length || 0) > 0,
	)

	updateChecklistProgressMeter()
}

function syncGalleryPreviewImageFromFile() {
	const mainImageInput = document.getElementById("galleryMainImage")
	if (!mainImageInput) return

	const file = mainImageInput.files?.[0]
	if (adminGalleryPreviewObjectUrl) {
		URL.revokeObjectURL(adminGalleryPreviewObjectUrl)
		adminGalleryPreviewObjectUrl = ""
	}

	if (!file) {
		setGalleryPreviewImage("")
		updateGalleryPreview()
		return
	}

	adminGalleryPreviewObjectUrl = URL.createObjectURL(file)
	setGalleryPreviewImage(adminGalleryPreviewObjectUrl)
	updateGalleryPreview()
}

function bindGalleryPreviewEvents() {
	const ids = [
		"galleryStyleName",
		"galleryStyleType",
		"galleryLength",
		"gallerySize",
		"galleryTimeTaken",
		"galleryPriceRange",
		"galleryStylistName",
		"galleryFeaturedTrending",
		"galleryFeaturedMostBooked",
		"galleryBeforeImage",
	]

	ids.forEach((id) => {
		const el = document.getElementById(id)
		if (!el) return
		el.addEventListener("input", updateGalleryPreview)
		el.addEventListener("change", updateGalleryPreview)
	})

	const mainImageInput = document.getElementById("galleryMainImage")
	if (mainImageInput) {
		mainImageInput.addEventListener("change", syncGalleryPreviewImageFromFile)
	}

	updateGalleryPreview()
}

function resetGalleryForm() {
	const form = document.getElementById("adminGalleryForm")
	if (!form) return

	form.reset()
	document.getElementById("galleryEditId").value = ""
	document.getElementById("adminGalleryFormTitle").textContent =
		"Add New Gallery Style"
	document.getElementById("adminGallerySaveBtn").textContent =
		"Save Gallery Style"
	document.getElementById("adminGalleryCancelEdit").style.display = "none"

	if (adminGalleryPreviewObjectUrl) {
		URL.revokeObjectURL(adminGalleryPreviewObjectUrl)
		adminGalleryPreviewObjectUrl = ""
	}
	setGalleryPreviewImage("")
	updateGalleryPreview()
}

function loadGalleryItemForEditing(id) {
	const item = adminGalleryDocs.find((g) => g.id === id)
	if (!item) return

	document.getElementById("galleryEditId").value = item.id
	document.getElementById("galleryStyleName").value = item.styleName || ""
	document.getElementById("galleryStyleType").value = item.styleType || ""
	document.getElementById("galleryLength").value = item.length || ""
	document.getElementById("gallerySize").value = item.size || ""
	document.getElementById("galleryTimeTaken").value = item.timeTaken || ""
	document.getElementById("galleryPriceRange").value = item.priceRange || ""
	document.getElementById("galleryHairType").value = item.hairType || ""
	document.getElementById("galleryStylistName").value = item.stylistName || ""
	document.getElementById("galleryFeaturedTrending").checked =
		item.featuredTrending === true
	document.getElementById("galleryFeaturedMostBooked").checked =
		item.featuredMostBooked === true

	document.getElementById("adminGalleryFormTitle").textContent =
		"Edit Gallery Style"
	document.getElementById("adminGallerySaveBtn").textContent =
		"Update Gallery Style"
	document.getElementById("adminGalleryCancelEdit").style.display =
		"inline-flex"

	setAdminMessage("", "", "adminGalleryMessage")

	if (adminGalleryPreviewObjectUrl) {
		URL.revokeObjectURL(adminGalleryPreviewObjectUrl)
		adminGalleryPreviewObjectUrl = ""
	}
	setGalleryPreviewImage(item.imageUrl || "")
	updateGalleryPreview()

	const galleryForm = document.getElementById("adminGalleryForm")
	if (galleryForm) {
		galleryForm.scrollIntoView({ behavior: "smooth", block: "start" })
		galleryForm.classList.remove("admin-gallery-form--focus-flash")
		void galleryForm.offsetWidth
		galleryForm.classList.add("admin-gallery-form--focus-flash")
		setTimeout(() => {
			galleryForm.classList.remove("admin-gallery-form--focus-flash")
		}, 1600)
		const firstInput = galleryForm.querySelector("input, select, textarea")
		if (firstInput && typeof firstInput.focus === "function") {
			setTimeout(() => {
				firstInput.focus({ preventScroll: true })
			}, 250)
		}
	}
}

function renderAdminGallery(docs) {
	const list = document.getElementById("adminGalleryList")
	if (!list) return

	const items = docs.map(galleryDocToViewModel).sort((a, b) => {
		const aUpdated = toTimestampMs(a.updatedAt)
		const bUpdated = toTimestampMs(b.updatedAt)
		if (aUpdated !== bUpdated) return bUpdated - aUpdated
		return toTimestampMs(b.createdAt) - toTimestampMs(a.createdAt)
	})

	adminGalleryDocs = items

	if (!items.length) {
		list.innerHTML =
			'<div class="admin-empty-state">No gallery styles yet. Add your first style above.</div>'
		return
	}

	list.innerHTML = items
		.map(
			(item) => `
      <article class="admin-gallery-item">
        <div class="admin-gallery-thumb-wrap">
			${item.imageUrl ? `<img src="${item.imageUrl}" alt="${item.styleName}" class="admin-gallery-thumb" loading="lazy" decoding="async" fetchpriority="low" />` : '<div class="admin-gallery-thumb admin-gallery-thumb--empty">No Image</div>'}
          ${item.hasBeforeAfter ? '<span class="admin-gallery-badge">Before & After</span>' : ""}
        </div>
        <div class="admin-gallery-content">
          <h4>${item.styleName}</h4>
          <p>${item.styleType} • ${item.length} • ${item.size}</p>
          <p>Stylist: ${item.stylistName} • Time: ${item.timeTaken}</p>
          <div class="admin-gallery-tags">
            ${item.featuredTrending ? "<span>Trending</span>" : ""}
            ${item.featuredMostBooked ? "<span>Most Booked</span>" : ""}
            ${item.priceRange ? `<span>${item.priceRange}</span>` : ""}
          </div>
        </div>
        <div class="admin-gallery-actions">
          <button class="admin-action-btn" data-gallery-action="edit" data-id="${item.id}">Edit</button>
          <button class="admin-action-btn danger" data-gallery-action="delete" data-id="${item.id}">Delete</button>
        </div>
      </article>
    `,
		)
		.join("")
}

async function uploadImageToCloudinary(file) {
	if (!file) return ""
	if (!cloudinaryConfig.cloudName || !cloudinaryConfig.uploadPreset) {
		throw new Error("Cloudinary config is missing")
	}

	const endpoint = `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`
	const body = new FormData()
	body.append("file", file)
	body.append("upload_preset", cloudinaryConfig.uploadPreset)
	if (cloudinaryConfig.folder) {
		body.append("folder", cloudinaryConfig.folder)
	}

	const response = await fetch(endpoint, {
		method: "POST",
		body,
	})

	if (!response.ok) {
		throw new Error("Failed to upload image to Cloudinary")
	}

	const result = await response.json()
	return result.secure_url || ""
}

async function saveGalleryItem(event) {
	event.preventDefault()
	if (!adminUnlocked || !db || !auth?.currentUser) return

	const saveBtn = document.getElementById("adminGallerySaveBtn")
	const editId = document.getElementById("galleryEditId").value.trim()

	const styleName = document.getElementById("galleryStyleName").value.trim()
	const styleType = document.getElementById("galleryStyleType").value.trim()
	const length = document.getElementById("galleryLength").value
	const size = document.getElementById("gallerySize").value
	const timeTaken = document.getElementById("galleryTimeTaken").value.trim()
	const priceRange = document.getElementById("galleryPriceRange").value.trim()
	const hairType = document.getElementById("galleryHairType").value.trim()
	const stylistName = document.getElementById("galleryStylistName").value.trim()
	const featuredTrending = document.getElementById(
		"galleryFeaturedTrending",
	).checked
	const featuredMostBooked = document.getElementById(
		"galleryFeaturedMostBooked",
	).checked

	const mainImageFile = document.getElementById("galleryMainImage").files?.[0]
	const beforeImageFile =
		document.getElementById("galleryBeforeImage").files?.[0]

	if (
		!styleName ||
		!styleType ||
		!length ||
		!size ||
		!timeTaken ||
		!hairType ||
		!stylistName
	) {
		setAdminMessage(
			"error",
			"❌ Please complete all required fields.",
			"adminGalleryMessage",
		)
		return
	}

	if (!editId && !mainImageFile) {
		setAdminMessage(
			"error",
			"❌ After/final style image is required for new entries.",
			"adminGalleryMessage",
		)
		return
	}

	const currentItem = adminGalleryDocs.find((g) => g.id === editId)

	try {
		if (saveBtn) {
			saveBtn.disabled = true
			saveBtn.textContent = editId ? "Updating..." : "Saving..."
		}

		let imageUrl = currentItem?.imageUrl || ""
		let beforeImageUrl = currentItem?.beforeImageUrl || ""

		if (mainImageFile) {
			imageUrl = await uploadImageToCloudinary(mainImageFile)
		}
		if (beforeImageFile) {
			beforeImageUrl = await uploadImageToCloudinary(beforeImageFile)
		}

		const payload = {
			styleName,
			styleType,
			length,
			size,
			timeTaken,
			priceRange,
			hairType,
			stylistName,
			imageUrl,
			beforeImageUrl,
			hasBeforeAfter: Boolean(beforeImageUrl),
			featuredTrending,
			featuredMostBooked,
			updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
		}

		if (editId) {
			await db
				.collection("galleryStyles")
				.doc(editId)
				.set(payload, { merge: true })
			setAdminMessage(
				"success",
				"✅ Gallery style updated successfully.",
				"adminGalleryMessage",
			)
		} else {
			await db.collection("galleryStyles").add({
				...payload,
				createdAt: firebase.firestore.FieldValue.serverTimestamp(),
			})
			setAdminMessage(
				"success",
				"✅ Gallery style created successfully.",
				"adminGalleryMessage",
			)
		}

		resetGalleryForm()
	} catch (error) {
		console.error("Saving gallery style failed:", error)
		setAdminMessage(
			"error",
			`❌ Failed to save gallery style: ${error.message || "unknown error"}`,
			"adminGalleryMessage",
		)
	} finally {
		if (saveBtn) {
			saveBtn.disabled = false
			saveBtn.textContent = document.getElementById("galleryEditId").value
				? "Update Gallery Style"
				: "Save Gallery Style"
		}
	}
}

async function deleteGalleryItem(id) {
	if (!id) return
	const confirmed = await showAdminConfirmModal(
		"Delete this gallery style permanently? This action cannot be undone.",
		"Delete Style",
	)
	if (!confirmed) return

	try {
		await db.collection("galleryStyles").doc(id).delete()
		setAdminMessage(
			"success",
			"✅ Gallery style deleted.",
			"adminGalleryMessage",
		)
		if (document.getElementById("galleryEditId").value === id) {
			resetGalleryForm()
		}
	} catch (error) {
		console.error("Delete gallery style failed:", error)
		setAdminMessage(
			"error",
			`❌ Failed to delete style: ${error.message || "unknown error"}`,
			"adminGalleryMessage",
		)
	}
}

async function saveBlogItem(event) {
	event.preventDefault()
	if (!adminUnlocked || !db || !auth?.currentUser) return

	const saveBtn = document.getElementById("adminBlogsSaveBtn")
	const editId = document.getElementById("blogEditId").value.trim()

	const title = document.getElementById("blogTitle").value.trim()
	const excerpt = document.getElementById("blogExcerpt").value.trim()
	const readTime = document.getElementById("blogReadTime").value.trim()
	const publishDate = document.getElementById("blogDate").value
	const readMoreUrl = document.getElementById("blogReadMoreUrl").value.trim()
	const imageFile = document.getElementById("blogImage").files?.[0]

	if (!title || !excerpt || !readTime || !publishDate || !readMoreUrl) {
		setAdminMessage(
			"error",
			"❌ Please complete all required blog fields.",
			"adminBlogsMessage",
		)
		return
	}

	const currentItem = adminBlogDocs.find((blog) => blog.id === editId)
	if (!editId && !imageFile) {
		setAdminMessage(
			"error",
			"❌ Blog image is required for new posts.",
			"adminBlogsMessage",
		)
		return
	}

	try {
		if (saveBtn) {
			saveBtn.disabled = true
			saveBtn.textContent = editId ? "Updating..." : "Saving..."
		}

		let imageUrl = currentItem?.imageUrl || ""
		if (imageFile) {
			imageUrl = await uploadImageToCloudinary(imageFile)
		}

		const payload = {
			title,
			excerpt,
			readTime,
			publishDate,
			readMoreUrl,
			imageUrl,
			updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
		}

		if (editId) {
			await db.collection("blogs").doc(editId).set(payload, { merge: true })
			setAdminMessage(
				"success",
				"✅ Blog updated successfully.",
				"adminBlogsMessage",
			)
		} else {
			await db.collection("blogs").add({
				...payload,
				createdAt: firebase.firestore.FieldValue.serverTimestamp(),
			})
			setAdminMessage(
				"success",
				"✅ Blog created successfully.",
				"adminBlogsMessage",
			)
		}

		resetAdminBlogsForm()
	} catch (error) {
		console.error("Saving blog failed:", error)
		setAdminMessage(
			"error",
			`❌ Failed to save blog: ${error.message || "unknown error"}`,
			"adminBlogsMessage",
		)
	} finally {
		if (saveBtn) {
			saveBtn.disabled = false
			saveBtn.textContent = document.getElementById("blogEditId").value
				? "Update Blog"
				: "Save Blog"
		}
	}
}

async function deleteBlogItem(id) {
	if (!id) return
	const confirmed = await showAdminConfirmModal(
		"Delete this blog permanently? This action cannot be undone.",
		"Delete Blog",
	)
	if (!confirmed) return

	try {
		await db.collection("blogs").doc(id).delete()
		setAdminMessage("success", "✅ Blog deleted.", "adminBlogsMessage")
		if (document.getElementById("blogEditId").value === id) {
			resetAdminBlogsForm()
		}
	} catch (error) {
		console.error("Delete blog failed:", error)
		setAdminMessage(
			"error",
			`❌ Failed to delete blog: ${error.message || "unknown error"}`,
			"adminBlogsMessage",
		)
	}
}

function scrollAdminBlogs(direction = "next") {
	const list = document.getElementById("adminBlogsList")
	if (!list) return

	const firstCard = list.querySelector(".admin-blog-item")
	if (!firstCard) return

	const gap = Number.parseFloat(getComputedStyle(list).rowGap || "12") || 12
	const step = Math.max(firstCard.offsetHeight, 220) + gap
	const delta = direction === "prev" ? -step : step
	const maxTop = Math.max(0, list.scrollHeight - list.clientHeight)
	const targetTop = Math.min(maxTop, Math.max(0, list.scrollTop + delta))

	if (typeof list.scrollTo === "function") {
		list.scrollTo({ top: targetTop, behavior: "smooth" })
	} else {
		list.scrollTop = targetTop
	}

	window.setTimeout(updateAdminBlogScrollButtons, 240)
}

async function updateBookingStatus(bookingId, status) {
	const ref = db.collection("bookings").doc(bookingId)
	await ref.set(
		{
			status,
			updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
		},
		{ merge: true },
	)
}

async function cancelBookingAndReleaseSlot(bookingId) {
	const bookingRef = db.collection("bookings").doc(bookingId)

	await db.runTransaction(async (transaction) => {
		const bookingDoc = await transaction.get(bookingRef)
		if (!bookingDoc.exists) {
			throw new Error("Booking no longer exists")
		}

		const booking = bookingDoc.data()
		if (booking?.slotId) {
			const slotRef = db.collection("bookingSlots").doc(booking.slotId)
			transaction.delete(slotRef)
		}

		transaction.set(
			bookingRef,
			{
				status: "cancelled",
				updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
			},
			{ merge: true },
		)
	})
}

function startAdminBookingsListener() {
	if (!firebaseReady || !db || !adminUnlocked) return

	stopAdminBookingsListener()

	adminBookingsUnsubscribe = db
		.collection("bookings")
		.limit(100)
		.onSnapshot(
			(snapshot) => {
				const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
				renderAdminBookings(docs)
			},
			(error) => {
				console.error("Admin bookings listener failed:", error)
				setAdminMessage(
					"error",
					`❌ Failed to watch bookings in realtime: ${error.message || "unknown error"}`,
				)
			},
		)
}

function startAdminGalleryListener() {
	if (!firebaseReady || !db || !adminUnlocked) return

	stopAdminGalleryListener()

	adminGalleryUnsubscribe = db
		.collection("galleryStyles")
		.limit(200)
		.onSnapshot(
			(snapshot) => {
				const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
				renderAdminGallery(docs)
			},
			(error) => {
				console.error("Admin gallery listener failed:", error)
				setAdminMessage(
					"error",
					`❌ Failed to watch gallery in realtime: ${error.message || "unknown error"}`,
					"adminGalleryMessage",
				)
			},
		)
}

function startAdminBlogsListener() {
	if (!firebaseReady || !db || !adminUnlocked) return

	stopAdminBlogsListener()

	adminBlogsUnsubscribe = db
		.collection("blogs")
		.limit(300)
		.onSnapshot(
			(snapshot) => {
				const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
				renderAdminBlogs(docs)
			},
			(error) => {
				console.error("Admin blogs listener failed:", error)
				setAdminMessage(
					"error",
					`❌ Failed to watch blogs in realtime: ${error.message || "unknown error"}`,
					"adminBlogsMessage",
				)
			},
		)
}

function startAdminReviewsListener() {
	if (!firebaseReady || !db || !adminUnlocked) return

	stopAdminReviewsListener()

	adminReviewsUnsubscribe = db
		.collection("reviews")
		.limit(300)
		.onSnapshot(
			(snapshot) => {
				const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
				renderAdminReviews(docs)
			},
			(error) => {
				console.error("Admin reviews listener failed:", error)
				setAdminMessage(
					"error",
					`❌ Failed to watch reviews in realtime: ${error.message || "unknown error"}`,
					"adminReviewsMessage",
				)
			},
		)
}

function startAdminContactListener() {
	if (!firebaseReady || !db || !adminUnlocked) return

	stopAdminContactListener()

	adminContactUnsubscribe = db
		.collection("contactMessages")
		.limit(300)
		.onSnapshot(
			(snapshot) => {
				const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
				renderAdminContactMessages(docs)
			},
			(error) => {
				console.error("Admin contact messages listener failed:", error)
				setAdminMessage(
					"error",
					`❌ Failed to watch contact messages in realtime: ${error.message || "unknown error"}`,
					"adminContactMessage",
				)
			},
		)
}

function startAdminSecurityListener() {
	if (!firebaseReady || !db || !adminUnlocked) return

	stopAdminSecurityListener()

	adminSecurityUnsubscribe = db
		.collection("loginActivities")
		.orderBy("createdAt", "desc")
		.limit(400)
		.onSnapshot(
			(snapshot) => {
				const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
				renderAdminSecurityActivities(docs)
			},
			(error) => {
				console.error("Admin security activity listener failed:", error)
				setAdminMessage(
					"error",
					`❌ Failed to watch login activities in realtime: ${error.message || "unknown error"}`,
					"adminSecurityMessage",
				)
			},
		)
}

function startAdminSecurityAlertsListener() {
	if (!firebaseReady || !db || !adminUnlocked) return

	stopAdminSecurityAlertsListener()

	adminSecurityAlertsUnsubscribe = db
		.collection("securityAlerts")
		.orderBy("createdAt", "desc")
		.limit(400)
		.onSnapshot(
			(snapshot) => {
				const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
				renderAdminSecurityAlerts(docs)
			},
			(error) => {
				console.error("Admin security alerts listener failed:", error)
				setAdminMessage(
					"error",
					`❌ Failed to watch security alerts in realtime: ${error.message || "unknown error"}`,
					"adminSecurityEventsMessage",
				)
			},
		)
}

function startAdminAccountHistoryListener() {
	if (!firebaseReady || !db || !adminUnlocked) return

	stopAdminAccountHistoryListener()

	adminAccountHistoryUnsubscribe = db
		.collection("accountChangeHistory")
		.orderBy("createdAt", "desc")
		.limit(400)
		.onSnapshot(
			(snapshot) => {
				const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
				renderAdminAccountHistory(docs)
			},
			(error) => {
				console.error("Admin account history listener failed:", error)
				setAdminMessage(
					"error",
					`❌ Failed to watch account history in realtime: ${error.message || "unknown error"}`,
					"adminSecurityEventsMessage",
				)
			},
		)
}

function initializeAdminPanel() {
	const loginForm = document.getElementById("adminLoginForm")
	const logoutBtn = document.getElementById("adminLogoutBtn")
	const loginBtn = document.getElementById("adminLoginBtn")
	const passwordToggleBtn = document.getElementById("adminPasswordToggle")
	const bookingList = document.getElementById("adminBookingsList")
	const scheduleGrid = document.getElementById("adminScheduleGrid")
	const scheduleDetails = document.getElementById("adminScheduleDetails")
	const schedulePrevBtn = document.getElementById("adminSchedulePrev")
	const scheduleTodayBtn = document.getElementById("adminScheduleToday")
	const scheduleNextBtn = document.getElementById("adminScheduleNext")
	const scheduleViewButtons = document.querySelectorAll("[data-schedule-view]")
	const blogsForm = document.getElementById("adminBlogsForm")
	const blogsList = document.getElementById("adminBlogsList")
	const blogsCancelEditBtn = document.getElementById("adminBlogsCancelEdit")
	const blogsPrevBtn = document.getElementById("adminBlogsPrevBtn")
	const blogsNextBtn = document.getElementById("adminBlogsNextBtn")
	const galleryForm = document.getElementById("adminGalleryForm")
	const galleryList = document.getElementById("adminGalleryList")
	const reviewsList = document.getElementById("adminReviewsList")
	const contactList = document.getElementById("adminContactList")
	const securityList = document.getElementById("adminSecurityActivityList")
	const reviewsSortSelect = document.getElementById("adminReviewsSortSelect")
	const messagesSortSelect = document.getElementById("adminMessagesSortSelect")
	const securitySortSelect = document.getElementById("adminSecuritySortSelect")
	const securityAlertsSortSelect = document.getElementById(
		"adminSecurityAlertsSortSelect",
	)
	const accountHistorySortSelect = document.getElementById(
		"adminAccountHistorySortSelect",
	)
	const profanityWordsInput = document.getElementById("adminProfanityWords")
	const saveProfanityBtn = document.getElementById("adminSaveProfanityList")
	const cancelEditBtn = document.getElementById("adminGalleryCancelEdit")
	const confirmModal = document.getElementById("adminConfirmModal")
	const confirmCancelBtn = document.getElementById("adminConfirmCancel")
	const confirmOkBtn = document.getElementById("adminConfirmOk")

	if (!loginForm || !logoutBtn || !bookingList || !securityList) return

	initializeAdminSectionTabs()
	bindGalleryPreviewEvents()
	setAdminPasswordVisibility(false)

	if (passwordToggleBtn) {
		passwordToggleBtn.addEventListener("click", () => {
			const passwordInput = document.getElementById("adminPassword")
			if (!passwordInput) return
			setAdminPasswordVisibility(passwordInput.type === "password")
		})
	}

	loginForm.addEventListener("submit", async (event) => {
		event.preventDefault()
		if (!firebaseReady || !auth) {
			setAdminMessage(
				"error",
				"❌ Firebase Auth is not ready yet.",
				"adminAuthMessage",
			)
			return
		}

		const emailInput = document.getElementById("adminEmail")
		const passwordInput = document.getElementById("adminPassword")
		const email = emailInput?.value?.trim().toLowerCase() || ""
		const password = passwordInput?.value || ""

		if (!email || !password) {
			setAdminMessage(
				"error",
				"❌ Email and password are required.",
				"adminAuthMessage",
			)
			return
		}

		if (loginBtn) {
			loginBtn.disabled = true
			loginBtn.textContent = "Signing In..."
		}

		try {
			await auth.signInWithEmailAndPassword(email, password)
			if (passwordInput) {
				passwordInput.value = ""
				setAdminPasswordVisibility(false)
			}
		} catch (error) {
			console.error("Admin log in failed:", error)
			setAdminMessage(
				"error",
				`❌ Login failed: ${error.message || "unknown error"}`,
				"adminAuthMessage",
			)
		} finally {
			if (loginBtn) {
				loginBtn.disabled = false
				loginBtn.textContent = "Log In"
			}
		}
	})

	logoutBtn.addEventListener("click", async () => {
		if (!auth) return
		try {
			await auth.signOut()
			setAdminMessage(
				"success",
				"🔒 Logged out successfully.",
				"adminAuthMessage",
			)
		} catch (error) {
			console.error("Admin signout failed:", error)
			setAdminMessage(
				"error",
				`❌ Logout failed: ${error.message || "unknown error"}`,
				"adminAuthMessage",
			)
		}
	})

	bookingList.addEventListener("click", async (event) => {
		const button = event.target.closest("button[data-action]")
		if (!button || !adminUnlocked || !auth?.currentUser) return

		const action = button.dataset.action
		const bookingId = button.dataset.id
		if (!action || !bookingId) return

		button.disabled = true
		try {
			if (action === "cancel-release") {
				await cancelBookingAndReleaseSlot(bookingId)
				setAdminMessage(
					"success",
					"✅ Booking cancelled and slot released successfully.",
					"adminActionMessage",
				)
			} else {
				await updateBookingStatus(bookingId, action)
				setAdminMessage(
					"success",
					`✅ Booking updated to ${action}.`,
					"adminActionMessage",
				)
			}
		} catch (error) {
			console.error("Admin action failed:", error)
			setAdminMessage(
				"error",
				`❌ Action failed: ${error.message || "unknown error"}`,
				"adminActionMessage",
			)
		} finally {
			button.disabled = false
		}
	})

	if (schedulePrevBtn) {
		schedulePrevBtn.addEventListener("click", () => {
			moveAdminScheduleAnchorByDays(
				adminScheduleView === ADMIN_SCHEDULE_VIEWS.day ? -1 : -7,
			)
			renderAdminSchedule()
		})
	}

	if (scheduleTodayBtn) {
		scheduleTodayBtn.addEventListener("click", () => {
			const today = new Date()
			today.setHours(0, 0, 0, 0)
			adminScheduleAnchorDate = today
			renderAdminSchedule()
		})
	}

	if (scheduleNextBtn) {
		scheduleNextBtn.addEventListener("click", () => {
			moveAdminScheduleAnchorByDays(
				adminScheduleView === ADMIN_SCHEDULE_VIEWS.day ? 1 : 7,
			)
			renderAdminSchedule()
		})
	}

	if (scheduleViewButtons.length) {
		scheduleViewButtons.forEach((button) => {
			button.addEventListener("click", () => {
				adminScheduleView = normalizeAdminScheduleView(
					button.dataset.scheduleView,
				)
				renderAdminSchedule()
			})
		})
	}

	if (scheduleGrid) {
		scheduleGrid.addEventListener("click", (event) => {
			const eventBtn = event.target.closest("[data-schedule-booking]")
			if (!eventBtn) return

			const bookingId = String(eventBtn.dataset.scheduleBooking || "").trim()
			if (!bookingId) return

			adminScheduleSelectedBookingId = bookingId
			renderAdminSchedule()
		})
	}

	if (scheduleDetails) {
		scheduleDetails.addEventListener("click", async (event) => {
			const navButton = event.target.closest("button[data-schedule-nav]")
			if (navButton) {
				if (navButton.dataset.scheduleNav === "previous") {
					selectPreviousAdminScheduleBooking()
				}
				if (navButton.dataset.scheduleNav === "next") {
					selectNextAdminScheduleBooking()
				}
				return
			}

			const button = event.target.closest("button[data-schedule-action]")
			if (!button || !adminUnlocked || !auth?.currentUser) return

			const action = button.dataset.scheduleAction
			const bookingId = button.dataset.id
			if (!action || !bookingId) return

			button.disabled = true
			try {
				if (action === "cancel-release") {
					await cancelBookingAndReleaseSlot(bookingId)
					setAdminMessage(
						"success",
						"✅ Booking cancelled and slot released successfully.",
						"adminScheduleMessage",
					)
				} else {
					await updateBookingStatus(bookingId, action)
					setAdminMessage(
						"success",
						`✅ Booking updated to ${action}.`,
						"adminScheduleMessage",
					)
				}
			} catch (error) {
				console.error("Schedule quick action failed:", error)
				setAdminMessage(
					"error",
					`❌ Action failed: ${error.message || "unknown error"}`,
					"adminScheduleMessage",
				)
			} finally {
				button.disabled = false
			}
		})
	}

	if (galleryForm) {
		// Defensive: always block native form navigation/reload on gallery save
		galleryForm.setAttribute("action", "javascript:void(0)")
		galleryForm.addEventListener("submit", (event) => {
			event.preventDefault()
			event.stopPropagation()
			void saveGalleryItem(event)
		})
	}

	if (cancelEditBtn) {
		cancelEditBtn.addEventListener("click", resetGalleryForm)
	}

	if (galleryList) {
		galleryList.addEventListener("click", (event) => {
			const actionBtn = event.target.closest("button[data-gallery-action]")
			if (!actionBtn || !adminUnlocked || !auth?.currentUser) return

			const action = actionBtn.dataset.galleryAction
			const id = actionBtn.dataset.id
			if (!action || !id) return

			if (action === "edit") {
				loadGalleryItemForEditing(id)
				return
			}
			if (action === "delete") {
				deleteGalleryItem(id)
			}
		})
	}

	if (blogsForm) {
		blogsForm.setAttribute("action", "javascript:void(0)")
		blogsForm.addEventListener("submit", (event) => {
			event.preventDefault()
			event.stopPropagation()
			void saveBlogItem(event)
		})
	}

	if (blogsCancelEditBtn) {
		blogsCancelEditBtn.addEventListener("click", resetAdminBlogsForm)
	}

	if (blogsPrevBtn) {
		blogsPrevBtn.addEventListener("click", () => {
			scrollAdminBlogs("prev")
		})
	}

	if (blogsNextBtn) {
		blogsNextBtn.addEventListener("click", () => {
			scrollAdminBlogs("next")
		})
	}

	if (blogsList) {
		blogsList.addEventListener("scroll", updateAdminBlogScrollButtons, {
			passive: true,
		})
		window.addEventListener("resize", updateAdminBlogScrollButtons)

		blogsList.addEventListener("click", (event) => {
			const actionBtn = event.target.closest("button[data-blog-action]")
			if (!actionBtn || !adminUnlocked || !auth?.currentUser) return

			const action = actionBtn.dataset.blogAction
			const id = actionBtn.dataset.id
			if (!action || !id) return

			if (action === "edit") {
				loadBlogItemForEditing(id)
				return
			}
			if (action === "delete") {
				void deleteBlogItem(id)
			}
		})
	}

	if (reviewsList) {
		reviewsList.addEventListener("click", async (event) => {
			const actionBtn = event.target.closest("button[data-review-action]")
			if (!actionBtn || !adminUnlocked || !auth?.currentUser) return

			const action = actionBtn.dataset.reviewAction
			const reviewId = actionBtn.dataset.id
			if (!action || !reviewId) return

			actionBtn.disabled = true
			try {
				if (action === "save-edit") {
					const textInput = reviewsList.querySelector(
						`[data-review-edit-text="${reviewId}"]`,
					)
					const nextText = textInput?.value?.trim() || ""
					if (nextText.length < 10) {
						throw new Error("Review text must be at least 10 characters.")
					}
					await updateReviewText(reviewId, nextText)
					setAdminMessage(
						"success",
						"✅ Review text updated (status reset to pending).",
						"adminReviewsMessage",
					)
				} else if (action === "save-reply") {
					const replyInput = reviewsList.querySelector(
						`[data-review-reply-text="${reviewId}"]`,
					)
					await updateReviewReply(reviewId, replyInput?.value || "")
					setAdminMessage(
						"success",
						"✅ Admin reply saved.",
						"adminReviewsMessage",
					)
				} else if (action === "toggle-featured") {
					await toggleReviewFeatured(reviewId)
					setAdminMessage(
						"success",
						"✅ Review featured state updated.",
						"adminReviewsMessage",
					)
				} else if (action === "delete") {
					await deleteReview(reviewId)
					setAdminMessage(
						"success",
						"✅ Review deleted successfully.",
						"adminReviewsMessage",
					)
				} else {
					await updateReviewStatus(reviewId, action)
					setAdminMessage(
						"success",
						`✅ Review marked as ${normalizeReviewStatus(action)}.`,
						"adminReviewsMessage",
					)
				}
			} catch (error) {
				console.error("Review moderation action failed:", error)
				setAdminMessage(
					"error",
					`❌ Review action failed: ${error.message || "unknown error"}`,
					"adminReviewsMessage",
				)
			} finally {
				actionBtn.disabled = false
			}
		})
	}

	if (reviewsSortSelect) {
		reviewsSortSelect.value = adminReviewsSortMode
		reviewsSortSelect.addEventListener("change", (event) => {
			adminReviewsSortMode = event.target.value || "featured"
			renderAdminReviews(adminReviewRawDocs)
		})
	}

	if (messagesSortSelect) {
		messagesSortSelect.value = adminMessagesSortMode
		messagesSortSelect.addEventListener("change", (event) => {
			adminMessagesSortMode = event.target.value || "newest"
			renderAdminContactMessages(adminContactDocs)
		})
	}

	if (securitySortSelect) {
		securitySortSelect.value = adminSecuritySortMode
		securitySortSelect.addEventListener("change", (event) => {
			adminSecuritySortMode = event.target.value || "newest"
			renderAdminSecurityActivities(adminSecurityDocs)
		})
	}

	if (securityAlertsSortSelect) {
		securityAlertsSortSelect.value = adminSecurityAlertsSortMode
		securityAlertsSortSelect.addEventListener("change", (event) => {
			adminSecurityAlertsSortMode = event.target.value || "newest"
			renderAdminSecurityAlerts(adminSecurityAlertsDocs)
		})
	}

	if (accountHistorySortSelect) {
		accountHistorySortSelect.value = adminAccountHistorySortMode
		accountHistorySortSelect.addEventListener("change", (event) => {
			adminAccountHistorySortMode = event.target.value || "newest"
			renderAdminAccountHistory(adminAccountHistoryDocs)
		})
	}

	if (contactList) {
		contactList.addEventListener("click", async (event) => {
			const actionBtn = event.target.closest("button[data-contact-action]")
			if (!actionBtn || !adminUnlocked || !auth?.currentUser) return

			const action = actionBtn.dataset.contactAction
			const messageId = actionBtn.dataset.id
			if (!action || !messageId) return

			actionBtn.disabled = true
			try {
				if (action === "delete") {
					await deleteContactMessage(messageId)
					setAdminMessage(
						"success",
						"✅ Contact message deleted.",
						"adminContactMessage",
					)
				} else {
					await updateContactMessageStatus(messageId, action)
					setAdminMessage(
						"success",
						`✅ Message marked as ${normalizeContactStatus(action)}.`,
						"adminContactMessage",
					)
				}
			} catch (error) {
				console.error("Contact message action failed:", error)
				setAdminMessage(
					"error",
					`❌ Message action failed: ${error.message || "unknown error"}`,
					"adminContactMessage",
				)
			} finally {
				actionBtn.disabled = false
			}
		})
	}

	if (profanityWordsInput) {
		profanityWordsInput.value = getAdminProfanityWords().join(", ")
	}

	if (saveProfanityBtn) {
		saveProfanityBtn.addEventListener("click", () => {
			const raw = profanityWordsInput?.value || ""
			const words = raw
				.split(",")
				.map((w) => w.trim())
				.filter(Boolean)
			setAdminProfanityWords(words)
			if (profanityWordsInput) {
				profanityWordsInput.value = getAdminProfanityWords().join(", ")
			}
			setAdminMessage(
				"success",
				"✅ Profanity/content filter list saved.",
				"adminReviewsMessage",
			)
		})
	}

	if (confirmCancelBtn) {
		confirmCancelBtn.addEventListener("click", () => {
			closeAdminConfirmModal(false)
		})
	}

	if (confirmOkBtn) {
		confirmOkBtn.addEventListener("click", () => {
			closeAdminConfirmModal(true)
		})
	}

	if (confirmModal) {
		confirmModal.addEventListener("click", (event) => {
			if (event.target === confirmModal) {
				closeAdminConfirmModal(false)
			}
		})
	}

	document.addEventListener("keydown", (event) => {
		if (event.key === "Escape" && adminConfirmState.isOpen) {
			closeAdminConfirmModal(false)
		}
	})

	renderAdminSchedule()

	setAdminUnlockedState(false)
}

async function initializeFirebaseServices() {
	if (!canInitializeFirebase()) {
		setAdminMessage(
			"error",
			"⚠️ Firebase is not configured. Add APP_CONFIG keys on this page.",
			"adminAuthMessage",
		)
		return
	}

	adminFirebaseApp = getOrCreateAdminFirebaseApp()

	if (typeof firebase.appCheck === "function" && appCheckConfig.siteKey) {
		try {
			firebase.appCheck(adminFirebaseApp).activate(appCheckConfig.siteKey, true)
		} catch (appCheckError) {
			console.warn("Admin App Check activation failed:", appCheckError)
		}
	}

	auth = firebase.auth(adminFirebaseApp)
	db = firebase.firestore(adminFirebaseApp)

	try {
		await auth.setPersistence(firebase.auth.Auth.Persistence.SESSION)
	} catch (persistenceError) {
		console.warn("Admin auth persistence setup failed:", persistenceError)
	}

	auth.onAuthStateChanged((user) => {
		handleAuthStateChange(user)
	})

	firebaseReady = true
}

initializeAdminPanel()
initializeFirebaseServices()
