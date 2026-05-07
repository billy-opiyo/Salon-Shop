//<!-- ========== JAVASCRIPT ========== -->

// ============ DATA ============
const servicesData = [
	{
		name: "Box Braids",
		desc: "Classic box braids with synthetic or natural hair extensions",
		price: "KSh 3,500",
		duration: "3-4 hrs",
		icon: "scissors",
		category: "braids",
	},
	{
		name: "Knotless Braids",
		desc: "Seamless, pain-free braids that protect your edges",
		price: "KSh 4,500",
		duration: "4-5 hrs",
		icon: "scissors",
		category: "braids",
	},
	{
		name: "Fulani Braids",
		desc: "Traditional Fulani style with beads and accessories",
		price: "KSh 4,000",
		duration: "4 hrs",
		icon: "scissors",
		category: "braids",
	},
	{
		name: "Senegalese Twists",
		desc: "Elegant rope twists for a sophisticated look",
		price: "KSh 4,000",
		duration: "4-5 hrs",
		icon: "feather",
		category: "twists",
	},
	{
		name: "Passion Twists",
		desc: "Bohemian-style twists with curly ends",
		price: "KSh 3,800",
		duration: "3-4 hrs",
		icon: "feather",
		category: "twists",
	},
	{
		name: "Marley Twists",
		desc: "Chunky, natural-looking twists",
		price: "KSh 3,500",
		duration: "3-4 hrs",
		icon: "feather",
		category: "twists",
	},
	{
		name: "Cornrows - Straight",
		desc: "Classic straight back cornrows",
		price: "KSh 1,500",
		duration: "1-2 hrs",
		icon: "heart",
		category: "cornrows",
	},
	{
		name: "Cornrows - Designs",
		desc: "Intricate cornrow patterns and designs",
		price: "KSh 2,500",
		duration: "2-3 hrs",
		icon: "heart",
		category: "cornrows",
	},
	{
		name: "Stitch Braids",
		desc: "Trendy cornrows with stitch-like parts",
		price: "KSh 2,000",
		duration: "2 hrs",
		icon: "heart",
		category: "cornrows",
	},
	{
		name: "Goddess Braids",
		desc: "Large, elegant braids fit for royalty",
		price: "KSh 3,000",
		duration: "2-3 hrs",
		icon: "crown",
		category: "special",
	},
	{
		name: "Lemonade Braids",
		desc: "Side-swept cornrows inspired by Beyoncé",
		price: "KSh 2,500",
		duration: "2-3 hrs",
		icon: "crown",
		category: "special",
	},
	{
		name: "Kids Braiding",
		desc: "Gentle braiding services for children",
		price: "KSh 1,500",
		duration: "1-2 hrs",
		icon: "smile",
		category: "special",
	},
]

const fallbackGalleryData = [
	{
		imageUrl: "IMG/box-braids-hairstyles-1x1-1.jpg",
		styleName: "Box Braids",
		styleType: "Classic Box",
		stylistName: "Fatima Hassan",
		length: "Medium",
		size: "Medium",
		timeTaken: "4 hours",
		priceRange: "KSh 3,500 - 5,000",
		hairType: "18-inch synthetic blend",
		featuredTrending: true,
		featuredMostBooked: true,
	},
	{
		imageUrl: "IMG/knotless braids.jpg",
		beforeImageUrl: "IMG/keeping box braids.jpg",
		hasBeforeAfter: true,
		styleName: "Knotless Braids",
		styleType: "Knotless",
		stylistName: "Zainab Mohamed",
		length: "Long",
		size: "Small",
		timeTaken: "5 hours",
		priceRange: "KSh 4,500 - 6,500",
		hairType: "22-inch human blend",
		featuredTrending: true,
	},
	{
		imageUrl: "IMG/black-cornrows.webp",
		styleName: "Cornrows Design",
		styleType: "Cornrows",
		stylistName: "Grace Wanjiku",
		length: "Short",
		size: "Medium",
		timeTaken: "2 hours",
		priceRange: "KSh 2,000 - 3,000",
		hairType: "Natural hair",
	},
	{
		imageUrl: "IMG/fulan-braids.jpg",
		styleName: "Fulani Braids",
		styleType: "Fulani",
		stylistName: "Amina Diallo",
		length: "Long",
		size: "Small",
		timeTaken: "4 hours",
		priceRange: "KSh 4,000 - 5,500",
		hairType: "20-inch synthetic blend",
		featuredMostBooked: true,
	},
	{
		imageUrl: "IMG/Senegalese_Twist.webp",
		styleName: "Senegalese Twists",
		styleType: "Twists",
		stylistName: "Fatima Hassan",
		length: "Long",
		size: "Medium",
		timeTaken: "4.5 hours",
		priceRange: "KSh 4,000 - 6,000",
		hairType: "24-inch twist fiber",
	},
	{
		imageUrl: "IMG/passion-twists.webp",
		beforeImageUrl: "IMG/natural hair care.webp",
		hasBeforeAfter: true,
		styleName: "Passion Twists",
		styleType: "Twists",
		stylistName: "Zainab Mohamed",
		length: "Medium",
		size: "Large",
		timeTaken: "3.5 hours",
		priceRange: "KSh 3,800 - 5,000",
		hairType: "Boho curl fiber",
	},
	{
		imageUrl: "IMG/goddess-braids.webp",
		styleName: "Goddess Braids",
		styleType: "Goddess",
		stylistName: "Grace Wanjiku",
		length: "Long",
		size: "Large",
		timeTaken: "3 hours",
		priceRange: "KSh 3,000 - 4,500",
		hairType: "20-inch fiber",
	},
	{
		imageUrl: "IMG/Lemonade_Braids.webp",
		styleName: "Lemonade Braids",
		styleType: "Side Cornrows",
		stylistName: "Amina Diallo",
		length: "Medium",
		size: "Small",
		timeTaken: "2.5 hours",
		priceRange: "KSh 2,500 - 3,800",
		hairType: "16-inch synthetic blend",
		featuredTrending: true,
	},
	{
		imageUrl: "IMG/braiding trends.jpg",
		styleName: "Braiding Trends",
		styleType: "Creative Mix",
		stylistName: "Fatima Hassan",
		length: "Medium",
		size: "Medium",
		timeTaken: "3 hours",
		priceRange: "KSh 3,000 - 4,500",
		hairType: "Mixed extensions",
	},
	{
		imageUrl: "IMG/keeping box braids.jpg",
		styleName: "Box Braids Care",
		styleType: "Maintenance",
		stylistName: "Zainab Mohamed",
		length: "Medium",
		size: "Small",
		timeTaken: "1.5 hours",
		priceRange: "KSh 1,500 - 2,500",
		hairType: "Retouch service",
	},
	{
		imageUrl: "IMG/natural hair care.webp",
		styleName: "Natural Hair Care",
		styleType: "Protective Prep",
		stylistName: "Grace Wanjiku",
		length: "Short",
		size: "Medium",
		timeTaken: "2 hours",
		priceRange: "KSh 2,000 - 3,000",
		hairType: "Natural afro texture",
	},
	{
		imageUrl: "IMG/twist-braids.jpg",
		styleName: "Twist Braids",
		styleType: "Two Strand Twists",
		stylistName: "Amina Diallo",
		length: "Long",
		size: "Medium",
		timeTaken: "4 hours",
		priceRange: "KSh 3,500 - 5,000",
		hairType: "22-inch twist fiber",
		featuredMostBooked: true,
	},
]

let galleryData = [...fallbackGalleryData]
let filteredGalleryData = [...galleryData]
let showAllGallery = false
let currentLightboxIndex = 0
let galleryRealtimeUnsubscribe = null
let gallerySortBy = "recommended"
const galleryFiltersState = {
	length: "all",
	size: "all",
	styleType: "all",
}

const testimonialsData = [
	{
		name: "Fatuma Ali",
		avatar: "FA",
		role: "Regular Client",
		text: "Fatima is the best braider in Nairobi! My knotless braids lasted 8 weeks and my edges stayed intact. Highly recommend Royal Cuts!",
		rating: 5,
		source: "Google",
	},
	{
		name: "Amina Hassan",
		avatar: "AH",
		role: "New Client",
		text: "Finally found a salon that understands my hair! The box braids are neat, affordable, and the salon is so welcoming. I'm never going anywhere else!",
		rating: 5,
		source: "Instagram",
	},
	{
		name: "Zainab Mohammed",
		avatar: "ZM",
		role: "5 Years Client",
		text: "I've been coming to Royal Cuts for 5 years. The consistency, professionalism, and quality are unmatched. My go-to for all protective styles!",
		rating: 5,
		source: "Facebook",
	},
	{
		name: "Grace Wanjiku",
		avatar: "GW",
		role: "Bridal Client",
		text: "Had my bridal braids done here and they were stunning! Lasted through my entire honeymoon. Thank you to the amazing team!",
		rating: 5,
		source: "Google",
	},
	{
		name: "Aisha Diallo",
		avatar: "AD",
		role: "Monthly Client",
		text: "Grace is a natural hair expert! She always gives the best advice on maintaining my hair between appointments. Love this place!",
		rating: 5,
		source: "Instagram",
	},
	{
		name: "Sarah Omondi",
		avatar: "SO",
		role: "Mom of 3",
		text: "Sarah is so patient with my daughters! The kids braiding service is excellent and my girls always leave happy. Best salon for families!",
		rating: 5,
		source: "Google",
	},
]

const iconPaths = {
	scissors:
		'<path d="M14.5 9.5L19.5 4.5M9.5 9.5L4.5 4.5M7 17l-3 3m13-3l3 3m-7-3a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"/>',
	droplet:
		'<path d="M12 22c5.523 0 10-4.477 10-10S12 2 12 2 2 11.477 2 12c0 5.523 4.477 10 10 10z"/><path d="M12 8v4M10 14h4"/>',
	feather:
		'<path d="M20.24 12.24a6 6 0 00-8.49-8.49L5 10.5V19h8.5zM16 8L2 22M17.5 15H9"/>',
	heart:
		'<path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>',
	gift: '<polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/>',
	crown:
		'<path d="M2 20h20"/><path d="M4 20l2-8 4 4 4-8 4 8 2-8 2 8H4z"/><path d="M12 4v8"/>',
	smile:
		'<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>',
}

const timeSlots = [
	"8:00 AM",
	"8:30 AM",
	"9:00 AM",
	"9:30 AM",
	"10:00 AM",
	"10:30 AM",
	"11:00 AM",
	"11:30 AM",
	"12:00 PM",
	"12:30 PM",
	"1:00 PM",
	"1:30 PM",
	"2:00 PM",
	"2:30 PM",
	"3:00 PM",
	"3:30 PM",
	"4:00 PM",
	"4:30 PM",
	"5:00 PM",
	"5:30 PM",
	"6:00 PM",
	"6:30 PM",
	"7:00 PM",
]

// ============ FIREBASE + CLOUDINARY CONFIG ============
const appConfig = window.APP_CONFIG || {}
const firebaseConfig = appConfig.firebase || {}
const cloudinaryConfig = appConfig.cloudinary || {}
const appCheckConfig = appConfig.appCheck || {}

let firebaseReady = false
let db = null
let auth = null
let activeAvailabilityUnsubscribe = null

function getFriendlyAuthError(error) {
	if (error?.code === "auth/admin-restricted-operation") {
		return "Anonymous sign-in is disabled. In Firebase Console, go to Authentication → Sign-in method and enable Anonymous provider."
	}

	if (error?.code === "auth/operation-not-allowed") {
		return "This sign-in method is not enabled. Enable Anonymous provider in Firebase Authentication settings."
	}

	return error?.message || "Authentication failed"
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

async function initializeFirebaseServices() {
	if (!canInitializeFirebase()) return

	if (!firebase.apps.length) {
		firebase.initializeApp(firebaseConfig)
	}

	if (typeof firebase.appCheck === "function" && appCheckConfig.siteKey) {
		firebase.appCheck().activate(appCheckConfig.siteKey, true)
	}

	auth = firebase.auth()
	db = firebase.firestore()

	firebaseReady = true
}

function getSlotId(date, stylist, time) {
	const stylistKey = stylist && stylist.trim() ? stylist : "any"
	const normalizedTime = time.replace(/\s+/g, "").replace(/[:]/g, "")
	return `${date}__${stylistKey}__${normalizedTime}`
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

function subscribeToAvailability(date, stylist) {
	if (!firebaseReady || !db || !date) return

	if (typeof activeAvailabilityUnsubscribe === "function") {
		activeAvailabilityUnsubscribe()
		activeAvailabilityUnsubscribe = null
	}

	const stylistKey = stylist && stylist.trim() ? stylist : "any"
	const timeSelect = document.getElementById("timeSelect")
	const startId = `${date}__${stylistKey}__`
	const endId = `${date}__${stylistKey}__\uf8ff`

	const query = db
		.collection("bookingSlots")
		.where(firebase.firestore.FieldPath.documentId(), ">=", startId)
		.where(firebase.firestore.FieldPath.documentId(), "<=", endId)

	activeAvailabilityUnsubscribe = query.onSnapshot(
		(snapshot) => {
			const taken = new Set()
			snapshot.forEach((doc) => {
				const data = doc.data()
				if (data.taken && data.time) taken.add(data.time)
			})

			timeSelect.innerHTML = '<option value="">Select Time</option>'
			timeSlots.forEach((slot) => {
				if (taken.has(slot)) return
				const opt = document.createElement("option")
				opt.value = slot
				opt.textContent = slot
				timeSelect.appendChild(opt)
			})
		},
		(error) => {
			console.error("Realtime availability listener failed:", error)
		},
	)
}

function handleAvailabilityWatch() {
	const dateValue = document.getElementById("datePicker").value
	const stylistValue = document.getElementById("stylistSelect").value
	if (!dateValue) {
		populateTimeSlots()
		return
	}

	if (firebaseReady) {
		subscribeToAvailability(dateValue, stylistValue)
	}
}

// ============ RENDER FUNCTIONS ============

function renderServices(filter = "all") {
	const grid = document.getElementById("servicesGrid")
	const filtered =
		filter === "all"
			? servicesData
			: servicesData.filter((s) => s.category === filter)
	grid.innerHTML = filtered
		.map(
			(s, i) => `
    <div class="service-card animate-on-scroll visible delay-${(i % 4) + 1}" id="service-${s.name
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/^-|-$/g, "")}">
      <div class="service-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${iconPaths[s.icon] || iconPaths.scissors}</svg>
      </div>
      <h3>${s.name}</h3>
      <p>${s.desc}</p>
      <div>
        <span class="service-price">${s.price}</span>
        <span class="service-duration">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          ${s.duration}
        </span>
      </div>
      <button class="service-book-btn" onclick="selectService('${s.name}')">Book This Service</button>
    </div>
  `,
		)
		.join("")
}

function normalizeGalleryItem(item = {}) {
	const styleName = item.styleName || item.title || "Untitled Style"
	const styleType = item.styleType || "General"
	const stylistName = item.stylistName || item.stylist || "Royal Braids Team"
	const imageUrl = item.imageUrl || item.img || ""
	const beforeImageUrl = item.beforeImageUrl || ""
	const hasBeforeAfter =
		item.hasBeforeAfter === true ||
		item.beforeAfter === true ||
		Boolean(beforeImageUrl)

	return {
		id: item.id || "",
		styleName,
		styleType,
		stylistName,
		length: item.length || "Medium",
		size: item.size || "Medium",
		timeTaken: item.timeTaken || "N/A",
		priceRange: item.priceRange || "On request",
		hairType: item.hairType || "N/A",
		imageUrl,
		beforeImageUrl,
		hasBeforeAfter,
		featuredTrending: item.featuredTrending === true,
		featuredMostBooked: item.featuredMostBooked === true,
		createdAt: item.createdAt || item.created_at || item.createdOn || null,
		updatedAt: item.updatedAt || item.updated_at || item.updatedOn || null,
	}
}

function getUniqueGalleryValues(key) {
	const values = galleryData
		.map((item) => item[key])
		.filter((value) => Boolean(value && String(value).trim()))
	return [...new Set(values)]
}

function renderGalleryFilterGroup(groupKey, mountId, prefixLabel) {
	const mount = document.getElementById(mountId)
	if (!mount) return

	const activeValue = galleryFiltersState[groupKey] || "all"
	const values = getUniqueGalleryValues(groupKey)

	mount.innerHTML = `
    <button class="gallery-filter-chip ${activeValue === "all" ? "active" : ""}" data-filter-group="${groupKey}" data-filter-value="all">
      All ${prefixLabel}
    </button>
    ${values
			.map(
				(value) => `
      <button class="gallery-filter-chip ${activeValue === value ? "active" : ""}" data-filter-group="${groupKey}" data-filter-value="${value}">
        ${value}
      </button>
    `,
			)
			.join("")}
  `
}

function renderGalleryFilters() {
	renderGalleryFilterGroup("length", "galleryLengthFilters", "Lengths")
	renderGalleryFilterGroup("size", "gallerySizeFilters", "Sizes")
	renderGalleryFilterGroup(
		"styleType",
		"galleryStyleTypeFilters",
		"Style Types",
	)
}

function applyGalleryFilters() {
	filteredGalleryData = galleryData.filter((item) => {
		if (
			galleryFiltersState.length !== "all" &&
			item.length !== galleryFiltersState.length
		) {
			return false
		}
		if (
			galleryFiltersState.size !== "all" &&
			item.size !== galleryFiltersState.size
		) {
			return false
		}
		if (
			galleryFiltersState.styleType !== "all" &&
			item.styleType !== galleryFiltersState.styleType
		) {
			return false
		}
		return true
	})

	filteredGalleryData = sortGalleryItems(filteredGalleryData, gallerySortBy)
}

function parseItemTimeValue(item, keys = ["updatedAt", "createdAt"]) {
	for (const key of keys) {
		const raw = item?.[key]
		if (!raw) continue
		if (typeof raw?.toMillis === "function") return raw.toMillis()
		if (typeof raw === "number" && Number.isFinite(raw)) return raw
		if (raw?.seconds && Number.isFinite(raw.seconds)) return raw.seconds * 1000
		const parsed = Date.parse(String(raw))
		if (!Number.isNaN(parsed)) return parsed
	}
	return 0
}

function sortGalleryItems(items = [], sortBy = "recommended") {
	const data = [...items]

	const byNameAsc = (a, b) =>
		String(a.styleName || "").localeCompare(String(b.styleName || ""), undefined, {
			sensitivity: "base",
		})

	if (sortBy === "name-asc") {
		return data.sort(byNameAsc)
	}

	if (sortBy === "name-desc") {
		return data.sort((a, b) => byNameAsc(b, a))
	}

	if (sortBy === "date-modified-desc" || sortBy === "new") {
		return data.sort(
			(a, b) =>
				parseItemTimeValue(b, ["updatedAt", "createdAt"]) -
				parseItemTimeValue(a, ["updatedAt", "createdAt"]),
		)
	}

	if (sortBy === "date-modified-asc" || sortBy === "old") {
		return data.sort(
			(a, b) =>
				parseItemTimeValue(a, ["updatedAt", "createdAt"]) -
				parseItemTimeValue(b, ["updatedAt", "createdAt"]),
		)
	}

	if (sortBy === "date-created-desc") {
		return data.sort(
			(a, b) =>
				parseItemTimeValue(b, ["createdAt", "updatedAt"]) -
				parseItemTimeValue(a, ["createdAt", "updatedAt"]),
		)
	}

	if (sortBy === "date-created-asc") {
		return data.sort(
			(a, b) =>
				parseItemTimeValue(a, ["createdAt", "updatedAt"]) -
				parseItemTimeValue(b, ["createdAt", "updatedAt"]),
		)
	}

	return data.sort((a, b) => {
		const scoreA =
			(a.featuredTrending ? 2 : 0) +
			(a.featuredMostBooked ? 2 : 0) +
			(a.hasBeforeAfter ? 1 : 0)
		const scoreB =
			(b.featuredTrending ? 2 : 0) +
			(b.featuredMostBooked ? 2 : 0) +
			(b.hasBeforeAfter ? 1 : 0)

		if (scoreA !== scoreB) return scoreB - scoreA

		const updatedDiff =
			parseItemTimeValue(b, ["updatedAt", "createdAt"]) -
			parseItemTimeValue(a, ["updatedAt", "createdAt"])
		if (updatedDiff !== 0) return updatedDiff

		return byNameAsc(a, b)
	})
}

function setGallerySort(sortValue = "recommended") {
	gallerySortBy = sortValue
	showAllGallery = false
	const button = document.getElementById("viewAllGallery")
	if (button) button.textContent = "View All Braids"
	renderGallery()
}

function renderFeaturedStyles() {
	const trendingList = document.getElementById("trendingBraidsList")
	const mostBookedList = document.getElementById("mostBookedStylesList")
	if (!trendingList || !mostBookedList) return

	const trending = galleryData
		.filter((item) => item.featuredTrending)
		.slice(0, 6)
	const mostBooked = galleryData
		.filter((item) => item.featuredMostBooked)
		.slice(0, 6)

	trendingList.innerHTML = trending.length
		? trending
				.map(
					(item) =>
						`<button class="gallery-feature-pill" data-feature-open="${item.id || item.styleName}">${item.styleName}</button>`,
				)
				.join("")
		: '<span class="gallery-feature-empty">No trending styles yet.</span>'

	mostBookedList.innerHTML = mostBooked.length
		? mostBooked
				.map(
					(item) =>
						`<button class="gallery-feature-pill" data-feature-open="${item.id || item.styleName}">${item.styleName}</button>`,
				)
				.join("")
		: '<span class="gallery-feature-empty">No most booked styles yet.</span>'
}

function renderGallery() {
	const grid = document.getElementById("galleryGrid")
	const emptyState = document.getElementById("galleryEmptyState")
	const actions = document.getElementById("galleryActions")
	if (!grid) return

	applyGalleryFilters()

	const dataToShow = showAllGallery
		? filteredGalleryData
		: filteredGalleryData.slice(0, 8)

	if (emptyState) {
		emptyState.style.display = filteredGalleryData.length ? "none" : "block"
	}

	if (actions) {
		actions.style.display = filteredGalleryData.length > 8 ? "block" : "none"
	}

	grid.innerHTML = dataToShow
		.map(
			(item, i) => `
    <div class="gallery-item" onclick="openLightbox(${i})" style="animation-delay: ${i * 0.1}s">
      <img src="${item.imageUrl}" alt="${item.styleName}" loading="lazy">
      <div class="gallery-overlay">
        <h4>${item.styleName}</h4>
        <p>${item.styleType} • by ${item.stylistName}</p>
        ${item.hasBeforeAfter ? '<span class="before-after">Before & After</span>' : ""}
      </div>
    </div>
  `,
		)
		.join("")
}

function toggleGalleryView() {
	showAllGallery = !showAllGallery
	renderGallery()
	const button = document.getElementById("viewAllGallery")
	if (button) {
		button.textContent = showAllGallery ? "View Less Braids" : "View All Braids"
	}
}

function setGalleryFilter(group, value) {
	galleryFiltersState[group] = value
	showAllGallery = false
	const button = document.getElementById("viewAllGallery")
	if (button) button.textContent = "View All Braids"
	renderGalleryFilters()
	renderGallery()
}

function getVisibleGalleryData() {
	return showAllGallery ? filteredGalleryData : filteredGalleryData.slice(0, 8)
}

function isMatchingGalleryItem(item, idOrName) {
	return (item.id && item.id === idOrName) || item.styleName === idOrName
}

function resetGalleryFiltersState() {
	galleryFiltersState.length = "all"
	galleryFiltersState.size = "all"
	galleryFiltersState.styleType = "all"
}

function openGalleryItemByIdOrName(idOrName) {
	let visible = getVisibleGalleryData()
	let index = visible.findIndex((item) => isMatchingGalleryItem(item, idOrName))
	if (index >= 0) {
		openLightbox(index)
		return
	}

	const inFiltered = filteredGalleryData.some((item) =>
		isMatchingGalleryItem(item, idOrName),
	)
	if (inFiltered && !showAllGallery) {
		showAllGallery = true
		renderGallery()
		const button = document.getElementById("viewAllGallery")
		if (button) button.textContent = "View Less Braids"

		visible = getVisibleGalleryData()
		index = visible.findIndex((item) => isMatchingGalleryItem(item, idOrName))
		if (index >= 0) {
			openLightbox(index)
			return
		}
	}

	resetGalleryFiltersState()
	showAllGallery = true
	renderGalleryFilters()
	renderGallery()
	const button = document.getElementById("viewAllGallery")
	if (button) button.textContent = "View Less Braids"

	visible = getVisibleGalleryData()
	index = visible.findIndex((item) => isMatchingGalleryItem(item, idOrName))
	openLightbox(index >= 0 ? index : 0)
}

function wireGalleryInteractions() {
	const filtersRoot = document.getElementById("galleryFilters")
	if (filtersRoot) {
		filtersRoot.addEventListener("click", (event) => {
			const chip = event.target.closest(".gallery-filter-chip")
			if (!chip) return
			const group = chip.dataset.filterGroup
			const value = chip.dataset.filterValue
			if (!group || typeof value === "undefined") return
			setGalleryFilter(group, value)
		})
	}

	const featuredWrap = document.querySelector(".gallery-featured-wrap")
	if (featuredWrap) {
		featuredWrap.addEventListener("click", (event) => {
			const trigger = event.target.closest("[data-feature-open]")
			if (!trigger) return
			const key = trigger.dataset.featureOpen
			openGalleryItemByIdOrName(key)
		})
	}

	const sortSelect = document.getElementById("gallerySortSelect")
	if (sortSelect) {
		sortSelect.value = gallerySortBy
		sortSelect.addEventListener("change", (event) => {
			setGallerySort(event.target.value || "recommended")
		})
	}
}

function startGalleryRealtimeListener() {
	if (!firebaseReady || !db) return

	if (typeof galleryRealtimeUnsubscribe === "function") {
		galleryRealtimeUnsubscribe()
		galleryRealtimeUnsubscribe = null
	}

	galleryRealtimeUnsubscribe = db
		.collection("galleryStyles")
		.limit(300)
		.onSnapshot(
			(snapshot) => {
				const docs = snapshot.docs.map((doc) =>
					normalizeGalleryItem({ id: doc.id, ...doc.data() }),
				)
				if (docs.length) {
					galleryData = docs
				} else {
					galleryData = fallbackGalleryData.map((item, i) =>
						normalizeGalleryItem({ id: `fallback-${i}`, ...item }),
					)
				}

				renderGalleryFilters()
				renderFeaturedStyles()
				renderGallery()
			},
			(error) => {
				console.error("Gallery realtime listener failed:", error)
				galleryData = fallbackGalleryData.map((item, i) =>
					normalizeGalleryItem({ id: `fallback-${i}`, ...item }),
				)
				renderGalleryFilters()
				renderFeaturedStyles()
				renderGallery()
			},
		)
}

function renderTestimonials() {
	const grid = document.getElementById("testimonialsGrid")
	grid.innerHTML = testimonialsData
		.map(
			(t) => `
    <div class="testimonial-card">
      <div class="testimonial-stars">
        ${'<svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>'.repeat(t.rating)}
      </div>
      <p class="testimonial-text">"${t.text}"</p>
      <div class="testimonial-author">
        <div class="testimonial-avatar">${t.avatar}</div>
        <div class="testimonial-author-info">
          <h4>${t.name}</h4>
          <span>${t.role}</span>
        </div>
      </div>
      <div class="testimonial-social">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${t.source === "Instagram" ? '<rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>' : t.source === "Facebook" ? '<path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>' : '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>'}</svg>
      </div>
    </div>
  `,
		)
		.join("")
}

function populateServiceSelect() {
	const select = document.getElementById("serviceSelect")
	const categories = ["all", ...new Set(servicesData.map((s) => s.category))]
	categories.forEach((cat) => {
		if (cat === "all") return
		const services = servicesData.filter((s) => s.category === cat)
		const optgroup = document.createElement("optgroup")
		optgroup.label = cat.charAt(0).toUpperCase() + cat.slice(1)
		services.forEach((s) => {
			const opt = document.createElement("option")
			opt.value = s.name
			opt.textContent = `${s.name} (${s.price})`
			optgroup.appendChild(opt)
		})
		select.appendChild(optgroup)
	})
}

function populateTimeSlots() {
	const select = document.getElementById("timeSelect")
	select.innerHTML = '<option value="">Select Time</option>'
	timeSlots.forEach((t) => {
		const opt = document.createElement("option")
		opt.value = t
		opt.textContent = t
		select.appendChild(opt)
	})
}

// ============ NAVIGATION & UI ============
const header = document.getElementById("header")
const navToggle = document.getElementById("navToggle")
const nav = document.getElementById("nav")
const backToTop = document.getElementById("backToTop")
const darkModeToggle = document.getElementById("darkModeToggle")

// Sticky header
window.addEventListener("scroll", () => {
	header.classList.toggle("scrolled", window.scrollY > 50)
	backToTop.classList.toggle("visible", window.scrollY > 500)
})

// Mobile nav
navToggle.addEventListener("click", () => {
	navToggle.classList.toggle("active")
	nav.classList.toggle("active")
	document.body.style.overflow = nav.classList.contains("active")
		? "hidden"
		: ""
})
nav.querySelectorAll("a").forEach((a) => {
	a.addEventListener("click", () => {
		navToggle.classList.remove("active")
		nav.classList.remove("active")
		document.body.style.overflow = ""
	})
})

// Active nav on scroll
const sections = document.querySelectorAll("section[id]")
window.addEventListener("scroll", () => {
	const scrollY = window.scrollY + 100
	sections.forEach((s) => {
		const top = s.offsetTop
		const height = s.offsetHeight
		const id = s.getAttribute("id")
		const link = document.querySelector(`.nav a[href="#${id}"]`)
		if (link) {
			if (scrollY >= top && scrollY < top + height) {
				document
					.querySelectorAll(".nav a")
					.forEach((a) => a.classList.remove("active"))
				link.classList.add("active")
			}
		}
	})
})

// ============ DARK MODE ============
let isDark = localStorage.getItem("theme") !== "light"
function applyTheme() {
	document.body.classList.toggle("light-mode", !isDark)
	darkModeToggle.classList.toggle("active", isDark)
}
applyTheme()
darkModeToggle.addEventListener("click", () => {
	isDark = !isDark
	localStorage.setItem("theme", isDark ? "dark" : "light")
	applyTheme()
})

// ============ SCROLL ANIMATIONS ============
const observer = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				entry.target.classList.add("visible")
			}
		})
	},
	{ threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
)

document
	.querySelectorAll(".animate-on-scroll")
	.forEach((el) => observer.observe(el))

// ============ COUNTER ANIMATION ============
function animateCounters() {
	document.querySelectorAll(".hero-stat .number").forEach((el) => {
		const target = parseInt(el.dataset.count)
		const duration = 2000
		const start = performance.now()
		function update(now) {
			const elapsed = now - start
			const progress = Math.min(elapsed / duration, 1)
			const eased = 1 - Math.pow(1 - progress, 3)
			const current = Math.floor(target * eased)
			el.textContent = current.toLocaleString() + (target === 98 ? "%" : "+")
			if (progress < 1) requestAnimationFrame(update)
		}
		requestAnimationFrame(update)
	})
}
const heroObserver = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				animateCounters()
				heroObserver.disconnect()
			}
		})
	},
	{ threshold: 0.3 },
)
document.querySelector(".hero-stats") &&
	heroObserver.observe(document.querySelector(".hero-stats"))

// ============ SERVICES TABS ============
document.querySelectorAll(".services-tab").forEach((tab) => {
	tab.addEventListener("click", () => {
		document
			.querySelectorAll(".services-tab")
			.forEach((t) => t.classList.remove("active"))
		tab.classList.add("active")
		renderServices(tab.dataset.filter)
	})
})

// ============ BOOKING ============
function selectService(name) {
	document.getElementById("serviceSelect").value = name
	document.getElementById("booking").scrollIntoView({ behavior: "smooth" })
	// Update min date to today
	document.getElementById("datePicker").min = new Date()
		.toISOString()
		.split("T")[0]
}

document.getElementById("bookingForm").addEventListener("submit", function (e) {
	e.preventDefault()

	const form = this
	const btn = document.getElementById("submitBtn")
	const msg = document.getElementById("bookingMessage")
	const imageInput = document.getElementById("inspirationImage")

	const data = Object.fromEntries(new FormData(form).entries())
	const stylistKey = data.stylist && data.stylist.trim() ? data.stylist : "any"
	const slotId = getSlotId(data.date, stylistKey, data.time)

	msg.className = "form-message"
	msg.textContent = ""
	msg.style.display = "none"

	if (!firebaseReady || !db || !auth) {
		msg.className = "form-message error"
		msg.textContent =
			"⚠️ Booking service is not configured yet. Add Firebase keys in APP_CONFIG."
		msg.style.display = "block"
		return
	}

	btn.classList.add("loading")
	btn.disabled = true
	btn.textContent = "Processing..."
	;(async () => {
		try {
			let activeUid = auth.currentUser?.uid || null

			if (!activeUid) {
				try {
					const userCredential = await auth.signInAnonymously()
					activeUid = userCredential?.user?.uid || auth.currentUser?.uid || null
				} catch (error) {
					throw new Error(getFriendlyAuthError(error))
				}
			}

			if (!activeUid) {
				throw new Error(
					"Unable to authenticate booking session. Please refresh and try again.",
				)
			}

			let inspirationImageUrl = ""
			const selectedFile = imageInput?.files?.[0]
			if (selectedFile) {
				inspirationImageUrl = await uploadImageToCloudinary(selectedFile)
			}

			const bookingRef = db.collection("bookings").doc()
			const slotRef = db.collection("bookingSlots").doc(slotId)

			await db.runTransaction(async (transaction) => {
				const slotDoc = await transaction.get(slotRef)
				if (slotDoc.exists && slotDoc.data().taken) {
					throw new Error(
						"This time slot was just taken. Please choose another one.",
					)
				}

				transaction.set(slotRef, {
					taken: true,
					date: data.date,
					time: data.time,
					stylistKey,
					bookingId: bookingRef.id,
					uid: activeUid,
					createdAt: firebase.firestore.FieldValue.serverTimestamp(),
					updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
				})

				transaction.set(bookingRef, {
					firstName: data.firstName || "",
					lastName: data.lastName || "",
					email: data.email || "",
					phone: data.phone || "",
					service: data.service || "",
					stylist: data.stylist || "",
					stylistKey,
					date: data.date || "",
					time: data.time || "",
					slotId,
					notes: data.notes || "",
					inspirationImageUrl,
					status: "confirmed",
					uid: activeUid,
					createdAt: firebase.firestore.FieldValue.serverTimestamp(),
					updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
				})
			})

			form.style.display = "none"
			document.getElementById("bookingSuccess").style.display = "block"
			msg.className = "form-message success"
			msg.textContent = "✅ Booking confirmed and saved in realtime!"
			msg.style.display = "block"

			handleAvailabilityWatch()
		} catch (error) {
			console.error("Booking failed:", error)
			msg.className = "form-message error"
			msg.textContent = `❌ ${error.message || "Booking failed. Please try again."}`
			msg.style.display = "block"
		} finally {
			btn.classList.remove("loading")
			btn.disabled = false
			btn.textContent = "Confirm Booking"
		}
	})()
})

function resetBooking() {
	document.getElementById("bookingForm").reset()
	populateTimeSlots()
	document.getElementById("bookingForm").style.display = "block"
	document.getElementById("bookingSuccess").style.display = "none"
	document.getElementById("bookingMessage").style.display = "none"
}

// Set min date for booking
const datePicker = document.getElementById("datePicker")
if (datePicker) {
	datePicker.min = new Date().toISOString().split("T")[0]
}

// ============ GALLERY LIGHTBOX ============
const lightbox = document.getElementById("lightbox")
const lightboxImg = document.getElementById("lightboxImg")
const lightboxBeforeAfter = document.getElementById("lightboxBeforeAfter")
const lightboxBeforeImg = document.getElementById("lightboxBeforeImg")
const lightboxAfterImg = document.getElementById("lightboxAfterImg")
const lightboxStyleName = document.getElementById("lightboxStyleName")
const lightboxStyleType = document.getElementById("lightboxStyleType")
const lightboxTimeTaken = document.getElementById("lightboxTimeTaken")
const lightboxPriceRange = document.getElementById("lightboxPriceRange")
const lightboxLength = document.getElementById("lightboxLength")
const lightboxSize = document.getElementById("lightboxSize")
const lightboxHairType = document.getElementById("lightboxHairType")
const lightboxStylist = document.getElementById("lightboxStylist")
const lightboxBookNow = document.getElementById("lightboxBookNow")

function openLightbox(index) {
	const visible = getVisibleGalleryData()
	if (!visible.length || !lightbox) return

	currentLightboxIndex = index
	updateLightbox()
	lightbox.classList.add("active")
	document.body.style.overflow = "hidden"
}

function updateLightbox() {
	const visible = getVisibleGalleryData()
	if (!visible.length) return

	const safeIndex =
		((currentLightboxIndex % visible.length) + visible.length) % visible.length
	currentLightboxIndex = safeIndex

	const item = visible[safeIndex]
	if (!item) return

	if (lightboxImg) {
		lightboxImg.src = item.imageUrl || ""
		lightboxImg.alt = item.styleName || "Gallery style"
	}

	if (lightboxStyleName) lightboxStyleName.textContent = item.styleName || "-"
	if (lightboxStyleType) lightboxStyleType.textContent = item.styleType || "-"
	if (lightboxTimeTaken) lightboxTimeTaken.textContent = item.timeTaken || "-"
	if (lightboxPriceRange)
		lightboxPriceRange.textContent = item.priceRange || "On request"
	if (lightboxLength) lightboxLength.textContent = item.length || "-"
	if (lightboxSize) lightboxSize.textContent = item.size || "-"
	if (lightboxHairType) lightboxHairType.textContent = item.hairType || "-"
	if (lightboxStylist) lightboxStylist.textContent = item.stylistName || "-"

	if (lightboxBeforeAfter && lightboxBeforeImg && lightboxAfterImg) {
		if (item.hasBeforeAfter && item.beforeImageUrl) {
			lightboxBeforeAfter.style.display = "grid"
			lightboxBeforeImg.src = item.beforeImageUrl
			lightboxBeforeImg.alt = `${item.styleName} before`
			lightboxAfterImg.src = item.imageUrl || ""
			lightboxAfterImg.alt = `${item.styleName} after`
			if (lightboxImg) lightboxImg.style.display = "none"
		} else {
			lightboxBeforeAfter.style.display = "none"
			if (lightboxImg) lightboxImg.style.display = "block"
		}
	}

	if (lightboxBookNow) {
		lightboxBookNow.onclick = () => {
			const serviceSelect = document.getElementById("serviceSelect")
			if (serviceSelect) {
				serviceSelect.value = item.styleName || item.styleType || ""
			}
			if (lightbox) lightbox.classList.remove("active")
			document.body.style.overflow = ""
		}
	}
}

document.getElementById("lightboxClose")?.addEventListener("click", () => {
	if (lightbox) lightbox.classList.remove("active")
	document.body.style.overflow = ""
})

document.getElementById("lightboxPrev")?.addEventListener("click", () => {
	const visible = getVisibleGalleryData()
	if (!visible.length) return
	currentLightboxIndex =
		(currentLightboxIndex - 1 + visible.length) % visible.length
	updateLightbox()
})

document.getElementById("lightboxNext")?.addEventListener("click", () => {
	const visible = getVisibleGalleryData()
	if (!visible.length) return
	currentLightboxIndex = (currentLightboxIndex + 1) % visible.length
	updateLightbox()
})

lightbox?.addEventListener("click", (e) => {
	if (e.target === lightbox) {
		lightbox.classList.remove("active")
		document.body.style.overflow = ""
	}
})

document.addEventListener("keydown", (e) => {
	if (!lightbox || !lightbox.classList.contains("active")) return

	const visible = getVisibleGalleryData()
	if (!visible.length) return

	if (e.key === "Escape") {
		lightbox.classList.remove("active")
		document.body.style.overflow = ""
	}
	if (e.key === "ArrowLeft") {
		currentLightboxIndex =
			(currentLightboxIndex - 1 + visible.length) % visible.length
		updateLightbox()
	}
	if (e.key === "ArrowRight") {
		currentLightboxIndex = (currentLightboxIndex + 1) % visible.length
		updateLightbox()
	}
})

// ============ CONTACT FORM ============
document.getElementById("contactForm").addEventListener("submit", function (e) {
	e.preventDefault()

	const form = this
	const submitBtn = this.querySelector('button[type="submit"]')
	if (submitBtn) {
		submitBtn.disabled = true
		submitBtn.textContent = "Sending..."
	}

	const formData = new FormData(form)

	fetch(form.action, {
		method: "POST",
		body: formData,
		headers: {
			Accept: "application/json",
		},
	})
		.then((response) => {
			if (!response.ok) throw new Error("Failed to send message")
			form.reset()
			showContactSuccessPopup()
		})
		.catch(() => {
			// Keep the user on the same page even if sending fails.
		})
		.finally(() => {
			if (submitBtn) {
				submitBtn.disabled = false
				submitBtn.textContent = "Send Message"
			}
		})
})

const contactSuccessPopup = document.getElementById("contactSuccessPopup")
const contactSuccessPopupClose = document.getElementById(
	"contactSuccessPopupClose",
)
let contactPopupTimeout

function hideContactSuccessPopup() {
	if (!contactSuccessPopup) return
	contactSuccessPopup.classList.remove("show")
	if (contactPopupTimeout) {
		clearTimeout(contactPopupTimeout)
		contactPopupTimeout = null
	}
}

function showContactSuccessPopup() {
	if (!contactSuccessPopup) return
	contactSuccessPopup.classList.add("show")
	if (contactPopupTimeout) {
		clearTimeout(contactPopupTimeout)
	}
	contactPopupTimeout = setTimeout(() => {
		hideContactSuccessPopup()
	}, 5000)
}

if (contactSuccessPopupClose) {
	contactSuccessPopupClose.addEventListener("click", hideContactSuccessPopup)
}

// ============ SMOOTH SCROLL FOR ALL ANCHOR LINKS ============
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
	anchor.addEventListener("click", function (e) {
		const target = document.querySelector(this.getAttribute("href"))
		if (target) {
			e.preventDefault()
			target.scrollIntoView({ behavior: "smooth", block: "start" })
		}
	})
})

// ============ RE-OBSERVE DYNAMICALLY ADDED ELEMENTS ============
const mutationObserver = new MutationObserver((mutations) => {
	mutations.forEach((mutation) => {
		mutation.addedNodes.forEach((node) => {
			if (node.nodeType === 1) {
				const animated = node.querySelectorAll(".animate-on-scroll")
				animated.forEach((el) => observer.observe(el))
			}
		})
	})
})
mutationObserver.observe(document.body, { childList: true, subtree: true })

// ============ INITIALIZE ============
renderServices()
galleryData = fallbackGalleryData.map((item, i) =>
	normalizeGalleryItem({ id: `fallback-${i}`, ...item }),
)
renderGalleryFilters()
renderFeaturedStyles()
renderGallery()
wireGalleryInteractions()
document
	.getElementById("viewAllGallery")
	?.addEventListener("click", toggleGalleryView)
renderTestimonials()
populateServiceSelect()
populateTimeSlots()

// Initialize booking integrations
initializeFirebaseServices().then(() => {
	const stylistSelect = document.getElementById("stylistSelect")
	const dateInput = document.getElementById("datePicker")

	if (stylistSelect) {
		stylistSelect.addEventListener("change", handleAvailabilityWatch)
	}
	if (dateInput) {
		dateInput.addEventListener("change", handleAvailabilityWatch)
	}

	startGalleryRealtimeListener()
})
