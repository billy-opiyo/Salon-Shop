const appConfig = window.APP_CONFIG || {}
const firebaseConfig = appConfig.firebase || {}
const adminConfig = appConfig.admin || {}
const appCheckConfig = appConfig.appCheck || {}

let firebaseReady = false
let db = null
let auth = null
let adminUnlocked = false
let adminBookingsUnsubscribe = null
const adminMessageTimers = new Map()

function canInitializeFirebase() {
	return (
		typeof firebase !== "undefined" &&
		firebaseConfig.apiKey &&
		firebaseConfig.authDomain &&
		firebaseConfig.projectId &&
		firebaseConfig.appId
	)
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
	return value
}

function stopAdminBookingsListener() {
	if (typeof adminBookingsUnsubscribe === "function") {
		adminBookingsUnsubscribe()
		adminBookingsUnsubscribe = null
	}
}

function setAdminMessage(type, text, targetId = "adminMessage") {
	const msg = document.getElementById(targetId)
	if (!msg) return

	const existingTimer = adminMessageTimers.get(targetId)
	if (existingTimer) {
		clearTimeout(existingTimer)
		adminMessageTimers.delete(targetId)
	}

	if (!text) {
		msg.className = "form-message"
		msg.style.display = "none"
		msg.textContent = ""
		return
	}

	msg.className = `form-message ${type}`
	msg.textContent = text
	msg.style.display = "block"

	const shouldAutoDismiss = type === "success" || type === "error"
	if (!shouldAutoDismiss) return

	const timer = setTimeout(() => {
		msg.className = "form-message"
		msg.style.display = "none"
		msg.textContent = ""
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
		setAdminMessage("", "")
	} else {
		startAdminBookingsListener()
		setAdminMessage("success", "✅ Admin login successful.", "adminAuthMessage")
	}
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
	auth.signOut().catch((error) => {
		console.error("Forced admin signout failed:", error)
	})
}

function renderAdminBookings(docs) {
	const list = document.getElementById("adminBookingsList")
	if (!list) return

	const normalizedDocs = docs.map((b) => ({
		...b,
		status: normalizeStatus(extractRawStatus(b)),
	}))

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
			const customerName =
				`${b.firstName || ""} ${b.lastName || ""}`.trim() || "Unknown Customer"

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
          </div>
          <div class="admin-booking-actions">
            <button
              class="admin-action-btn"
              data-action="pending"
              data-id="${b.id}"
              data-tooltip="Move booking back to pending review"
              title="Move booking back to pending review"
            >
              Set Pending
            </button>
            <button
              class="admin-action-btn"
              data-action="confirmed"
              data-id="${b.id}"
              data-tooltip="Mark booking as approved and scheduled"
              title="Mark booking as approved and scheduled"
            >
              Confirm
            </button>
            <button
              class="admin-action-btn"
              data-action="completed"
              data-id="${b.id}"
              data-tooltip="Mark booking as service completed"
              title="Mark booking as service completed"
            >
              Complete
            </button>
            <button
              class="admin-action-btn danger"
              data-action="cancel-release"
              data-id="${b.id}"
              data-tooltip="Cancel booking and free that time slot"
              title="Cancel booking and free that time slot"
            >
              Cancel + Release Slot
            </button>
          </div>
        </div>
      `
		})
		.join("")
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

function initializeAdminPanel() {
	const loginForm = document.getElementById("adminLoginForm")
	const logoutBtn = document.getElementById("adminLogoutBtn")
	const loginBtn = document.getElementById("adminLoginBtn")
	const list = document.getElementById("adminBookingsList")

	if (!loginForm || !logoutBtn || !list) return

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
			if (passwordInput) passwordInput.value = ""
		} catch (error) {
			console.error("Admin sign in failed:", error)
			setAdminMessage(
				"error",
				`❌ Login failed: ${error.message || "unknown error"}`,
				"adminAuthMessage",
			)
		} finally {
			if (loginBtn) {
				loginBtn.disabled = false
				loginBtn.textContent = "Sign In"
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

	list.addEventListener("click", async (event) => {
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

	if (!firebase.apps.length) {
		firebase.initializeApp(firebaseConfig)
	}

	if (typeof firebase.appCheck === "function" && appCheckConfig.siteKey) {
		firebase.appCheck().activate(appCheckConfig.siteKey, true)
	}

	auth = firebase.auth()
	db = firebase.firestore()

	auth.onAuthStateChanged((user) => {
		handleAuthStateChange(user)
	})

	firebaseReady = true
}

initializeAdminPanel()
initializeFirebaseServices()
