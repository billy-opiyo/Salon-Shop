const appConfig = window.APP_CONFIG || {}
const firebaseConfig = appConfig.firebase || {}
const adminConfig = appConfig.admin || {}
const appCheckConfig = appConfig.appCheck || {}
const cloudinaryConfig = appConfig.cloudinary || {}

let firebaseReady = false
let db = null
let auth = null
let adminUnlocked = false
let adminBookingsUnsubscribe = null
let adminGalleryUnsubscribe = null
let adminGalleryDocs = []
let adminGalleryPreviewObjectUrl = ""
const adminMessageTimers = new Map()
const adminMessageHideTimers = new Map()
const defaultAdminSection = "bookings"
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

function stopAdminGalleryListener() {
	if (typeof adminGalleryUnsubscribe === "function") {
		adminGalleryUnsubscribe()
		adminGalleryUnsubscribe = null
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
		if (isGalleryToast && animated) {
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

	if (isGalleryToast) {
		msg.classList.remove("is-leaving")
		requestAnimationFrame(() => {
			msg.classList.add("is-visible")
		})
	}

	const shouldAutoDismiss = type === "success" || type === "error"
	if (!shouldAutoDismiss) return

	const timer = setTimeout(() => {
		hideMessage(isGalleryToast)
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
		setAdminMessage("", "")
		setAdminMessage("", "", "adminGalleryMessage")
	} else {
		startAdminBookingsListener()
		startAdminGalleryListener()
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
            <button class="admin-action-btn" data-action="pending" data-id="${b.id}">Set Pending</button>
            <button class="admin-action-btn" data-action="confirmed" data-id="${b.id}">Confirm</button>
            <button class="admin-action-btn" data-action="completed" data-id="${b.id}">Complete</button>
            <button class="admin-action-btn danger" data-action="cancel-release" data-id="${b.id}">Cancel + Release Slot</button>
          </div>
        </div>
      `
		})
		.join("")
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
	const item = document.querySelector(`.admin-gallery-checklist li[data-check="${key}"]`)
	if (!item) return
	item.classList.toggle("completed", Boolean(done))
}

function updateChecklistProgressMeter() {
	const checklistItems = document.querySelectorAll(".admin-gallery-checklist li[data-check]")
	const progressText = document.getElementById("adminGalleryChecklistProgressText")
	const progressFill = document.getElementById("adminGalleryChecklistProgressFill")
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
	const styleName = document.getElementById("galleryStyleName")?.value?.trim() || ""
	const styleType = document.getElementById("galleryStyleType")?.value?.trim() || ""
	const length = document.getElementById("galleryLength")?.value || ""
	const size = document.getElementById("gallerySize")?.value || ""
	const timeTaken = document.getElementById("galleryTimeTaken")?.value?.trim() || ""
	const priceRange = document.getElementById("galleryPriceRange")?.value?.trim() || ""
	const stylistName = document.getElementById("galleryStylistName")?.value?.trim() || ""
	const hasTrending = document.getElementById("galleryFeaturedTrending")?.checked === true
	const hasMostBooked =
		document.getElementById("galleryFeaturedMostBooked")?.checked === true
	const beforeImageSelected =
		(document.getElementById("galleryBeforeImage")?.files?.length || 0) > 0

	const previewName = document.getElementById("adminGalleryPreviewName")
	const previewMeta = document.getElementById("adminGalleryPreviewMeta")
	const previewDetails = document.getElementById("adminGalleryPreviewDetails")
	const previewTags = document.getElementById("adminGalleryPreviewTags")
	const beforeAfterBadge = document.getElementById("adminGalleryPreviewBeforeAfterBadge")

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
		beforeAfterBadge.style.display = beforeImageSelected ? "inline-flex" : "none"
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
				.map((tag) => `<span class="admin-gallery-preview-tag">${escapeHtml(tag)}</span>`)
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
          ${item.imageUrl ? `<img src="${item.imageUrl}" alt="${item.styleName}" class="admin-gallery-thumb" />` : '<div class="admin-gallery-thumb admin-gallery-thumb--empty">No Image</div>'}
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

function initializeAdminPanel() {
	const loginForm = document.getElementById("adminLoginForm")
	const logoutBtn = document.getElementById("adminLogoutBtn")
	const loginBtn = document.getElementById("adminLoginBtn")
	const passwordToggleBtn = document.getElementById("adminPasswordToggle")
	const bookingList = document.getElementById("adminBookingsList")
	const galleryForm = document.getElementById("adminGalleryForm")
	const galleryList = document.getElementById("adminGalleryList")
	const cancelEditBtn = document.getElementById("adminGalleryCancelEdit")
	const confirmModal = document.getElementById("adminConfirmModal")
	const confirmCancelBtn = document.getElementById("adminConfirmCancel")
	const confirmOkBtn = document.getElementById("adminConfirmOk")

	if (!loginForm || !logoutBtn || !bookingList) return

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
