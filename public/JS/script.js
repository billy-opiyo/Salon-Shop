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
let dashboardFavoritesUnsubscribe = null
let dashboardFavoriteStyles = []
let activeDashboardUid = ""
let gallerySortBy = "recommended"
const galleryFiltersState = {
	length: "all",
	size: "all",
	styleType: "all",
}

const fallbackBlogsData = [
	{
		title: "How to Keep Knotless Braids Fresh for Weeks",
		excerpt:
			"Discover simple daily and nightly habits that keep your knotless braids neat, moisturized, and long-lasting.",
		imageUrl: "IMG/knotless braids.jpg",
		publishDate: "2026-04-16",
		readTime: "5 min read",
		readMoreUrl: "#blog",
	},
	{
		title: "Scalp Care Tips for Protective Styles",
		excerpt:
			"Healthy braids start with a healthy scalp. Learn the products and routines our stylists recommend for itch-free comfort.",
		imageUrl: "IMG/natural hair care.webp",
		publishDate: "2026-03-28",
		readTime: "6 min read",
		readMoreUrl: "#blog",
	},
	{
		title: "Top Bridal Braids for Nairobi Brides",
		excerpt:
			"From elegant up-dos to crown-inspired braid patterns, explore timeless bridal options for your big day.",
		imageUrl: "IMG/goddess-braids.webp",
		publishDate: "2026-03-08",
		readTime: "4 min read",
		readMoreUrl: "#blog",
	},
	{
		title: "Before-and-After Transformations We Love",
		excerpt:
			"See how the right braid pattern, parting, and finish can transform your entire look while protecting natural hair.",
		imageUrl: "IMG/box-braids-hairstyles-1x1-1.jpg",
		publishDate: "2026-02-14",
		readTime: "5 min read",
		readMoreUrl: "#blog",
	},
	{
		title: "Braids for Busy Professionals",
		excerpt:
			"Need a low-maintenance style that still looks polished? These braid options are ideal for packed work schedules.",
		imageUrl: "IMG/Lemonade_Braids.webp",
		publishDate: "2026-01-30",
		readTime: "4 min read",
		readMoreUrl: "#blog",
	},
	{
		title: "Kids Braiding: Comfort-First Styling Guide",
		excerpt:
			"Our gentle approach to kids braiding keeps little ones comfortable while delivering neat and durable protective styles.",
		imageUrl: "IMG/Kids-Small Single Braids after.jpg",
		publishDate: "2026-01-12",
		readTime: "5 min read",
		readMoreUrl: "#blog",
	},
]

const BLOG_CARD_IMAGE_FALLBACK = "IMG/Kids-Small Single Braids after.jpg"

let blogsData = [...fallbackBlogsData]
let blogsRealtimeUnsubscribe = null
const DEFAULT_VISIBLE_BLOGS = 3
let showAllBlogs = false
let blogsToggleAnimationTimer = null

const fallbackTestimonialsData = [
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

let testimonialsData = [...fallbackTestimonialsData]
let testimonialsRealtimeUnsubscribe = null
const DEFAULT_VISIBLE_REVIEWS = 6
let showAllReviews = false
let reviewsSortMode = "featured"
let reviewMessageTimer = null
let reviewsToggleAnimationTimer = null
let favoritesToastTimer = null
let dashboardFavoritesMessageTimer = null
let authMessageTimer = null
let accountDeletePopupTimer = null
let pendingDeleteAccountResolver = null
let deleteAccountConfirmCloseTimer = null
const formMessageTimers = new WeakMap()
const REVIEW_LOCAL_KEYS = {
	profanityWords: "rb_admin_profanity_words",
	reviewDrafts: "rb_review_drafts",
}

const MANAGE_ACCOUNT_LOCAL_KEYS = {
	notifications: "rb_manage_notifications",
	accessibility: "rb_manage_accessibility",
}

const DEFAULT_PROFANITY_WORDS = [
	"fuck",
	"shit",
	"bitch",
	"asshole",
	"stupid",
	"idiot",
	"scam",
]

function escapeHtml(value) {
	return String(value ?? "")
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;")
}

function toTimestampMs(value) {
	if (!value) return 0
	if (typeof value?.toMillis === "function") return value.toMillis()
	if (typeof value === "number" && Number.isFinite(value)) return value
	if (value?.seconds && Number.isFinite(value.seconds))
		return value.seconds * 1000
	const parsed = Date.parse(String(value))
	return Number.isNaN(parsed) ? 0 : parsed
}

function formatDateTime(value) {
	const ms = toTimestampMs(value)
	if (!ms) return "N/A"
	return new Date(ms).toLocaleString()
}

function getStoredProfanityWords() {
	try {
		const raw = localStorage.getItem(REVIEW_LOCAL_KEYS.profanityWords)
		if (!raw) return [...DEFAULT_PROFANITY_WORDS]
		const parsed = JSON.parse(raw)
		if (!Array.isArray(parsed)) return [...DEFAULT_PROFANITY_WORDS]
		const cleaned = parsed
			.map((w) =>
				String(w || "")
					.trim()
					.toLowerCase(),
			)
			.filter(Boolean)
		return cleaned.length ? cleaned : [...DEFAULT_PROFANITY_WORDS]
	} catch (_error) {
		return [...DEFAULT_PROFANITY_WORDS]
	}
}

function textContainsBlockedWord(text = "") {
	const normalized = String(text || "").toLowerCase()
	if (!normalized) return false
	const words = getStoredProfanityWords()
	return words.some((word) => {
		if (!word) return false
		return normalized.includes(word)
	})
}

function saveReviewDraft(review = {}) {
	if (!review?.id) return
	try {
		const raw = localStorage.getItem(REVIEW_LOCAL_KEYS.reviewDrafts)
		const data = raw ? JSON.parse(raw) : {}
		data[review.id] = {
			id: review.id,
			name: review.name || "",
			rating: Number(review.rating || 5),
			service: review.service || "",
			text: review.text || "",
			photoUrl: review.photoUrl || "",
			createdAt: review.createdAt || null,
		}
		localStorage.setItem(REVIEW_LOCAL_KEYS.reviewDrafts, JSON.stringify(data))
	} catch (_error) {
		// no-op
	}
}

function removeReviewDraft(reviewId = "") {
	if (!reviewId) return
	try {
		const raw = localStorage.getItem(REVIEW_LOCAL_KEYS.reviewDrafts)
		if (!raw) return
		const data = JSON.parse(raw)
		if (!data || typeof data !== "object") return
		delete data[reviewId]
		localStorage.setItem(REVIEW_LOCAL_KEYS.reviewDrafts, JSON.stringify(data))
	} catch (_error) {
		// no-op
	}
}

function getReviewDraftsArray() {
	try {
		const raw = localStorage.getItem(REVIEW_LOCAL_KEYS.reviewDrafts)
		if (!raw) return []
		const data = JSON.parse(raw)
		if (!data || typeof data !== "object") return []
		return Object.values(data)
	} catch (_error) {
		return []
	}
}

function showFormMessage(msg, type, text) {
	if (!msg) return
	msg.className = `form-message ${type}`
	msg.textContent = text
	msg.style.display = "block"
	msg.classList.remove("is-leaving")
	requestAnimationFrame(() => {
		msg.classList.add("is-visible")
	})
}

function clearFormMessage(msg) {
	if (!msg) return
	const activeTimer = formMessageTimers.get(msg)
	if (activeTimer) {
		clearTimeout(activeTimer)
		formMessageTimers.delete(msg)
	}
	msg.className = "form-message"
	msg.textContent = ""
	msg.style.display = "none"
}

function hideReviewMessage(msg, animated = false) {
	if (!msg) return

	if (!animated) {
		clearFormMessage(msg)
		return
	}

	msg.classList.remove("is-visible")
	msg.classList.add("is-leaving")
	setTimeout(() => {
		clearFormMessage(msg)
	}, 300)
}

function showTimedReviewMessage(type, text, duration = 3500) {
	const msg = document.getElementById("reviewMessage")
	if (!msg) return

	if (reviewMessageTimer) {
		clearTimeout(reviewMessageTimer)
		reviewMessageTimer = null
	}

	showFormMessage(msg, type, text)
	reviewMessageTimer = setTimeout(() => {
		hideReviewMessage(msg, true)
		reviewMessageTimer = null
	}, duration)
}

function showTimedFormMessage(msg, type, text, duration = 4000) {
	if (!msg) return

	const activeTimer = formMessageTimers.get(msg)
	if (activeTimer) {
		clearTimeout(activeTimer)
		formMessageTimers.delete(msg)
	}

	showFormMessage(msg, type, text)
	const timerId = setTimeout(() => {
		hideReviewMessage(msg, true)
		formMessageTimers.delete(msg)
	}, duration)
	formMessageTimers.set(msg, timerId)
}

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
let authMode = "signin"
let authObserverAttached = false
let shouldAutoFocusDashboardAfterAuth = false
let googleAuthInProgress = false

function isNonGuestSignedIn() {
	return Boolean(auth?.currentUser && !auth.currentUser.isAnonymous)
}

const authUi = {
	modal: null,
	openBtn: null,
	closeBtn: null,
	backdrop: null,
	googleBtn: null,
	phoneBtn: null,
	emailForm: null,
	nameGroup: null,
	nameInput: null,
	emailInput: null,
	passwordInput: null,
	passwordToggleBtn: null,
	submitBtn: null,
	switchToSignupBtn: null,
	switchToSigninBtn: null,
	forgotPasswordBtn: null,
	continueAsGuestBtn: null,
	message: null,
	profileMenu: null,
	profileTrigger: null,
	profileDropdown: null,
	profileInitial: null,
	profileName: null,
	logoutBtn: null,
	navDashboardLink: null,
	clientDashboard: null,
	dashboardAuthBtn: null,
	dashboardDeleteAccountBtn: null,
	dashboardMessage: null,
	dashboardBookingsList: null,
	dashboardReviewsList: null,
	dashboardFavoritesList: null,
	dashboardFavoritesCount: null,
	dashboardProfileName: null,
	dashboardProfileEmail: null,
	dashboardProfilePhone: null,
	postBookingAuthPrompt: null,
	postBookingGoogleBtn: null,
	postBookingLaterBtn: null,
	reviewAuthHint: null,
	reviewAuthHintBtn: null,
	reviewSubmitWrap: null,
	reviewSubmitAuthGate: null,
	reviewSubmitAuthGateBtn: null,
	favoritesToast: null,
	accountDeleteSuccessPopup: null,
	deleteAccountConfirmModal: null,
	deleteAccountConfirmBackdrop: null,
	deleteAccountConfirmCloseBtn: null,
	deleteAccountConfirmCancelBtn: null,
	deleteAccountConfirmProceedBtn: null,
	deleteAccountConfirmMessage: null,
	manageAccountModal: null,
	manageAccountBackdrop: null,
	manageAccountCloseBtn: null,
	manageAccountMessage: null,
	manageAccountName: null,
	manageAccountEmail: null,
	manageAccountEmailHint: null,
	manageAccountPhone: null,
	manageAccountPhoneHint: null,
	manageAccountAvatarInput: null,
	manageAccountAvatarPreview: null,
	manageAccountAvatarInitial: null,
	manageAccountSaveProfileBtn: null,
	manageAccountCurrentPassword: null,
	manageAccountCurrentPasswordToggle: null,
	manageAccountNewPassword: null,
	manageAccountNewPasswordToggle: null,
	managePasswordStrengthFill: null,
	managePasswordStrengthText: null,
	managePasswordChecks: null,
	manageAccountChangePasswordBtn: null,
	manageAccountResetPasswordBtn: null,
	manageAccountThemeSelect: null,
	manageAccountFontSizeSelect: null,
	manageAccountHighContrast: null,
	manageAccountReducedMotion: null,
	manageAccountNotifEmail: null,
	manageAccountNotifSms: null,
	manageAccountNotifPush: null,
	manageAccountSavePreferencesBtn: null,
	manageAccountDeleteBtn: null,
}

function getFriendlyAuthError(error) {
	const code = error?.code || ""

	if (code === "auth/popup-closed-by-user") {
		return "Sign-in popup was closed before completing. Please try again."
	}

	if (code === "auth/popup-blocked") {
		return "Popup was blocked by your browser. Allow popups for this site and try again."
	}

	if (code === "auth/cancelled-popup-request") {
		return "A sign-in attempt is already in progress. Please wait and try again."
	}

	if (code === "auth/unauthorized-domain") {
		return "This website domain is not authorized in Firebase Authentication. Add it under Authentication → Settings → Authorized domains."
	}

	if (code === "auth/invalid-credential") {
		return "Invalid sign-in credential. Please try again with Google."
	}

	if (code === "auth/invalid-action-code") {
		return "The requested auth action is invalid or expired. Please retry sign-in."
	}

	if (code === "auth/operation-not-supported-in-this-environment") {
		return "Google popup sign-in is not supported in this environment. Use a normal browser window (not restricted/private embedded mode)."
	}

	if (code === "auth/user-disabled") {
		return "This account has been disabled. Please contact support."
	}

	if (error?.code === "auth/admin-restricted-operation") {
		return "Anonymous sign-in is disabled. In Firebase Console, go to Authentication → Sign-in method and enable Anonymous provider."
	}

	if (error?.code === "auth/operation-not-allowed") {
		return "This sign-in method is not enabled. Enable Anonymous provider in Firebase Authentication settings."
	}

	if (code === "auth/requires-recent-login") {
		return "For your security, please log in again before deleting your account."
	}

	return error?.message || "Authentication failed"
}

function setGoogleAuthButtonsBusy(isBusy) {
	const busy = isBusy === true
	if (authUi.googleBtn) {
		authUi.googleBtn.disabled = busy
		authUi.googleBtn.textContent = busy
			? "Signing in..."
			: "Continue with Google"
	}
	if (authUi.postBookingGoogleBtn) {
		authUi.postBookingGoogleBtn.disabled = busy
		authUi.postBookingGoogleBtn.textContent = busy
			? "Signing in..."
			: "Log In Now"
	}
}

function setAuthSwitchingState(isSwitching) {
	const active = isSwitching === true
	authUi.openBtn?.classList.toggle("is-auth-switching", active)
	authUi.profileTrigger?.classList.toggle("is-auth-switching", active)
}

function shouldPreferRedirectGoogleAuth() {
	const ua = navigator.userAgent || ""
	const isMobileDevice = /Android|iPhone|iPad|iPod|Mobile/i.test(ua)
	const isEmbeddedBrowser =
		/(FBAN|FBAV|Instagram|Line|LinkedInApp|Twitter|wv|WebView)/i.test(ua) ||
		/ /.test(ua)

	return isMobileDevice || isEmbeddedBrowser
}

async function finalizeGoogleSignInResult(user, context = {}) {
	if (!user || user.isAnonymous) {
		throw new Error("Google sign-in did not complete. Please try again.")
	}

	setDashboardSignedInState(user)
	closeAuthModal()
	const loggedInName = getUserDisplayName(user)
	showFavoritesToast(`You're now Logged In as ${loggedInName}`)
	focusDashboardAfterAuthIfRequested()

	await Promise.allSettled([
		upsertUserProfile(user, { provider: "google.com" }),
		loadUserDashboardData(user),
	])

	if (context.source === "redirect" && authUi.message) {
		showTimedAuthMessage("success", "✅ Signed in with Google successfully.")
	}
}

async function handleGoogleRedirectResultOnLoad(showNoResult = false) {
	if (!firebaseReady || !auth) return false

	try {
		const redirectResult = await auth.getRedirectResult()
		const redirectedUser = redirectResult?.user || auth.currentUser
		if (redirectedUser && !redirectedUser.isAnonymous) {
			await finalizeGoogleSignInResult(redirectedUser, { source: "redirect" })
			return true
		}

		if (showNoResult && authUi.message) {
			showTimedAuthMessage(
				"error",
				"❌ Google redirect sign-in did not complete. Please try again.",
			)
		}
		return false
	} catch (error) {
		console.error("Google redirect result failed:", error)
		if (authUi.message) {
			showTimedAuthMessage("error", `❌ ${getFriendlyAuthError(error)}`)
		}
		return false
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

async function initializeFirebaseServices() {
	if (!canInitializeFirebase()) return

	if (!firebase.apps.length) {
		firebase.initializeApp(firebaseConfig)
	}

	if (typeof firebase.appCheck === "function" && appCheckConfig.siteKey) {
		firebase.appCheck().activate(appCheckConfig.siteKey, true)
	}

	auth = firebase.auth()
	attachAuthStateObserver()
	try {
		await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
	} catch (persistenceError) {
		console.warn("Auth persistence setup failed:", persistenceError)
	}
	db = firebase.firestore()

	firebaseReady = true

	const persistedUser = auth.currentUser
	if (persistedUser && !persistedUser.isAnonymous) {
		setDashboardSignedInState(persistedUser)
		await Promise.allSettled([
			upsertUserProfile(persistedUser),
			loadUserDashboardData(persistedUser),
		])
	}
}

function initAuthUiRefs() {
	authUi.modal = document.getElementById("authModal")
	authUi.openBtn = document.getElementById("openAuthModalBtn")
	authUi.closeBtn = document.getElementById("closeAuthModalBtn")
	authUi.backdrop = document.getElementById("authModalBackdrop")
	authUi.googleBtn = document.getElementById("continueWithGoogleBtn")
	authUi.phoneBtn = document.getElementById("continueWithPhoneBtn")
	authUi.emailForm = document.getElementById("emailAuthForm")
	authUi.nameGroup = document.getElementById("authNameGroup")
	authUi.nameInput = document.getElementById("authName")
	authUi.emailInput = document.getElementById("authEmail")
	authUi.passwordInput = document.getElementById("authPassword")
	authUi.passwordToggleBtn = document.getElementById("authPasswordToggle")
	authUi.submitBtn = document.getElementById("emailAuthSubmit")
	authUi.switchToSignupBtn = document.getElementById("switchToSignupBtn")
	authUi.switchToSigninBtn = document.getElementById("switchToSigninBtn")
	authUi.forgotPasswordBtn = document.getElementById("forgotPasswordBtn")
	authUi.continueAsGuestBtn = document.getElementById("continueAsGuestBtn")
	authUi.message = document.getElementById("authMessage")
	authUi.profileMenu = document.getElementById("authProfileMenu")
	authUi.profileTrigger = document.getElementById("authProfileTrigger")
	authUi.profileDropdown = document.getElementById("authProfileDropdown")
	authUi.profileInitial = document.getElementById("authProfileInitial")
	authUi.profileName = document.getElementById("authProfileName")
	authUi.logoutBtn = document.getElementById("logoutBtn")
	authUi.navDashboardLink = document.getElementById("navDashboardLink")
	authUi.clientDashboard = document.getElementById("clientDashboard")
	authUi.dashboardAuthBtn = document.getElementById("dashboardAuthBtn")
	authUi.dashboardDeleteAccountBtn = document.getElementById(
		"dashboardDeleteAccountBtn",
	)
	authUi.dashboardMessage = document.getElementById("dashboardMessage")
	authUi.dashboardBookingsList = document.getElementById(
		"dashboardBookingsList",
	)
	authUi.dashboardReviewsList = document.getElementById("dashboardReviewsList")
	authUi.dashboardFavoritesList = document.getElementById(
		"dashboardFavoritesList",
	)
	authUi.dashboardFavoritesCount = document.getElementById(
		"dashboardFavoritesCount",
	)
	authUi.dashboardProfileName = document.getElementById("dashboardProfileName")
	authUi.dashboardProfileEmail = document.getElementById(
		"dashboardProfileEmail",
	)
	authUi.dashboardProfilePhone = document.getElementById(
		"dashboardProfilePhone",
	)
	authUi.postBookingAuthPrompt = document.getElementById(
		"postBookingAuthPrompt",
	)
	authUi.postBookingGoogleBtn = document.getElementById("postBookingGoogleBtn")
	authUi.postBookingLaterBtn = document.getElementById("postBookingLaterBtn")
	authUi.reviewAuthHint = document.getElementById("reviewAuthHint")
	authUi.reviewAuthHintBtn = document.getElementById("reviewAuthHintBtn")
	authUi.reviewSubmitWrap = document.getElementById("reviewSubmitWrap")
	authUi.reviewSubmitAuthGate = document.getElementById("reviewSubmitAuthGate")
	authUi.reviewSubmitAuthGateBtn = document.getElementById(
		"reviewSubmitAuthGateBtn",
	)
	authUi.favoritesToast = document.getElementById("favoritesToast")
	authUi.accountDeleteSuccessPopup = document.getElementById(
		"accountDeleteSuccessPopup",
	)
	authUi.deleteAccountConfirmModal = document.getElementById(
		"deleteAccountConfirmModal",
	)
	authUi.deleteAccountConfirmBackdrop = document.getElementById(
		"deleteAccountConfirmBackdrop",
	)
	authUi.deleteAccountConfirmCloseBtn = document.getElementById(
		"deleteAccountConfirmCloseBtn",
	)
	authUi.deleteAccountConfirmCancelBtn = document.getElementById(
		"deleteAccountConfirmCancelBtn",
	)
	authUi.deleteAccountConfirmProceedBtn = document.getElementById(
		"deleteAccountConfirmProceedBtn",
	)
	authUi.deleteAccountConfirmMessage = document.getElementById(
		"deleteAccountConfirmMessage",
	)
	authUi.manageAccountModal = document.getElementById("manageAccountModal")
	authUi.manageAccountBackdrop = document.getElementById(
		"manageAccountBackdrop",
	)
	authUi.manageAccountCloseBtn = document.getElementById(
		"manageAccountCloseBtn",
	)
	authUi.manageAccountMessage = document.getElementById("manageAccountMessage")
	authUi.manageAccountName = document.getElementById("manageAccountName")
	authUi.manageAccountEmail = document.getElementById("manageAccountEmail")
	authUi.manageAccountEmailHint = document.getElementById(
		"manageAccountEmailHint",
	)
	authUi.manageAccountPhone = document.getElementById("manageAccountPhone")
	authUi.manageAccountPhoneHint = document.getElementById(
		"manageAccountPhoneHint",
	)
	authUi.manageAccountAvatarInput = document.getElementById(
		"manageAccountAvatarInput",
	)
	authUi.manageAccountAvatarPreview = document.getElementById(
		"manageAccountAvatarPreview",
	)
	authUi.manageAccountAvatarInitial = document.getElementById(
		"manageAccountAvatarInitial",
	)
	authUi.manageAccountSaveProfileBtn = document.getElementById(
		"manageAccountSaveProfileBtn",
	)
	authUi.manageAccountCurrentPassword = document.getElementById(
		"manageAccountCurrentPassword",
	)
	authUi.manageAccountCurrentPasswordToggle = document.getElementById(
		"manageAccountCurrentPasswordToggle",
	)
	authUi.manageAccountNewPassword = document.getElementById(
		"manageAccountNewPassword",
	)
	authUi.manageAccountNewPasswordToggle = document.getElementById(
		"manageAccountNewPasswordToggle",
	)
	authUi.managePasswordStrengthFill = document.getElementById(
		"managePasswordStrengthFill",
	)
	authUi.managePasswordStrengthText = document.getElementById(
		"managePasswordStrengthText",
	)
	authUi.managePasswordChecks = document.getElementById("managePasswordChecks")
	authUi.manageAccountChangePasswordBtn = document.getElementById(
		"manageAccountChangePasswordBtn",
	)
	authUi.manageAccountResetPasswordBtn = document.getElementById(
		"manageAccountResetPasswordBtn",
	)
	authUi.manageAccountThemeSelect = document.getElementById(
		"manageAccountThemeSelect",
	)
	authUi.manageAccountFontSizeSelect = document.getElementById(
		"manageAccountFontSizeSelect",
	)
	authUi.manageAccountHighContrast = document.getElementById(
		"manageAccountHighContrast",
	)
	authUi.manageAccountReducedMotion = document.getElementById(
		"manageAccountReducedMotion",
	)
	authUi.manageAccountNotifEmail = document.getElementById(
		"manageAccountNotifEmail",
	)
	authUi.manageAccountNotifSms = document.getElementById(
		"manageAccountNotifSms",
	)
	authUi.manageAccountNotifPush = document.getElementById(
		"manageAccountNotifPush",
	)
	authUi.manageAccountSavePreferencesBtn = document.getElementById(
		"manageAccountSavePreferencesBtn",
	)
	authUi.manageAccountDeleteBtn = document.getElementById(
		"manageAccountDeleteBtn",
	)
}

function getStoredNotificationPrefs() {
	try {
		const parsed = JSON.parse(
			localStorage.getItem(MANAGE_ACCOUNT_LOCAL_KEYS.notifications) || "{}",
		)
		return {
			email: parsed.email !== false,
			sms: parsed.sms === true,
			push: parsed.push !== false,
		}
	} catch (_error) {
		return { email: true, sms: false, push: true }
	}
}

function saveNotificationPrefs(prefs = {}) {
	localStorage.setItem(
		MANAGE_ACCOUNT_LOCAL_KEYS.notifications,
		JSON.stringify({
			email: prefs.email === true,
			sms: prefs.sms === true,
			push: prefs.push === true,
		}),
	)
}

function getStoredAccessibilityPrefs() {
	try {
		const parsed = JSON.parse(
			localStorage.getItem(MANAGE_ACCOUNT_LOCAL_KEYS.accessibility) || "{}",
		)
		const fontSize = ["normal", "large", "xlarge"].includes(parsed.fontSize)
			? parsed.fontSize
			: "normal"
		return {
			highContrast: parsed.highContrast === true,
			reducedMotion: parsed.reducedMotion === true,
			fontSize,
		}
	} catch (_error) {
		return { highContrast: false, reducedMotion: false, fontSize: "normal" }
	}
}

function applyAccessibilityPrefs(prefs = {}) {
	document.body.classList.toggle("high-contrast", prefs.highContrast === true)
	document.body.classList.toggle("reduced-motion", prefs.reducedMotion === true)
	document.body.classList.remove("font-large", "font-xlarge")
	if (prefs.fontSize === "large") document.body.classList.add("font-large")
	if (prefs.fontSize === "xlarge") document.body.classList.add("font-xlarge")
}

function saveAccessibilityPrefs(prefs = {}) {
	localStorage.setItem(
		MANAGE_ACCOUNT_LOCAL_KEYS.accessibility,
		JSON.stringify({
			highContrast: prefs.highContrast === true,
			reducedMotion: prefs.reducedMotion === true,
			fontSize: ["normal", "large", "xlarge"].includes(prefs.fontSize)
				? prefs.fontSize
				: "normal",
		}),
	)
	applyAccessibilityPrefs(prefs)
}

function isValidEmailFormat(value = "") {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim())
}

function isValidPhoneFormat(value = "") {
	if (!value) return true
	return /^\+?[0-9][0-9\s-]{6,18}$/.test(String(value).trim())
}

function evaluatePasswordRules(value = "") {
	const password = String(value || "")
	const rules = {
		length: password.length >= 8,
		upper: /[A-Z]/.test(password),
		lower: /[a-z]/.test(password),
		number: /\d/.test(password),
	}
	const score = Object.values(rules).filter(Boolean).length
	return { rules, score }
}

function updateManageHintState(field, hintEl, isValid, validText, invalidText) {
	if (!field || !hintEl) return
	field.classList.toggle("manage-field-valid", Boolean(isValid))
	field.classList.toggle("manage-field-invalid", !Boolean(isValid))
	hintEl.classList.toggle("is-valid", Boolean(isValid))
	hintEl.classList.toggle("is-invalid", !Boolean(isValid))
	hintEl.textContent = isValid ? validText : invalidText
}

function updateManagePasswordStrengthUI(password = "") {
	const { rules, score } = evaluatePasswordRules(password)
	if (authUi.managePasswordChecks) {
		authUi.managePasswordChecks
			.querySelectorAll("li[data-rule]")
			.forEach((item) => {
				const key = item.dataset.rule
				item.classList.toggle("met", Boolean(rules[key]))
			})
	}

	const pct = Math.min(100, Math.max(0, score * 25))
	if (authUi.managePasswordStrengthFill) {
		authUi.managePasswordStrengthFill.style.width = `${pct}%`
		authUi.managePasswordStrengthFill.classList.remove(
			"strength-weak",
			"strength-medium",
			"strength-strong",
		)
		authUi.managePasswordStrengthFill.classList.add(
			score <= 1
				? "strength-weak"
				: score <= 3
					? "strength-medium"
					: "strength-strong",
		)
	}
	if (authUi.managePasswordStrengthText) {
		authUi.managePasswordStrengthText.textContent =
			score <= 1
				? "Strength: Too weak"
				: score <= 3
					? "Strength: Medium"
					: "Strength: Strong"
	}
}

function setManageAvatarPreview(user) {
	if (!authUi.manageAccountAvatarPreview || !authUi.manageAccountAvatarInitial)
		return
	const existingImg = authUi.manageAccountAvatarPreview.querySelector("img")
	if (existingImg) existingImg.remove()
	const initial = (getUserDisplayName(user).charAt(0) || "R").toUpperCase()
	authUi.manageAccountAvatarInitial.textContent = initial
	if (user?.photoURL) {
		const img = document.createElement("img")
		img.src = user.photoURL
		img.alt = "Profile"
		authUi.manageAccountAvatarPreview.appendChild(img)
		authUi.manageAccountAvatarInitial.style.display = "none"
	} else {
		authUi.manageAccountAvatarInitial.style.display = "inline-flex"
	}
}

function loadManageAccountForm(user) {
	if (!user) return
	if (authUi.manageAccountName)
		authUi.manageAccountName.value =
			user.displayName || getUserDisplayName(user)
	if (authUi.manageAccountEmail)
		authUi.manageAccountEmail.value = user.email || ""
	if (authUi.manageAccountPhone) {
		const dashboardPhoneText = String(
			authUi.dashboardProfilePhone?.textContent || "",
		).trim()
		authUi.manageAccountPhone.value =
			dashboardPhoneText === "Add phone during booking"
				? ""
				: dashboardPhoneText
	}
	setManageAvatarPreview(user)

	if (authUi.manageAccountThemeSelect) {
		authUi.manageAccountThemeSelect.value = isDark ? "dark" : "light"
	}
	const access = getStoredAccessibilityPrefs()
	if (authUi.manageAccountFontSizeSelect)
		authUi.manageAccountFontSizeSelect.value = access.fontSize
	if (authUi.manageAccountHighContrast)
		authUi.manageAccountHighContrast.checked = access.highContrast
	if (authUi.manageAccountReducedMotion)
		authUi.manageAccountReducedMotion.checked = access.reducedMotion

	const notif = getStoredNotificationPrefs()
	if (authUi.manageAccountNotifEmail)
		authUi.manageAccountNotifEmail.checked = notif.email
	if (authUi.manageAccountNotifSms)
		authUi.manageAccountNotifSms.checked = notif.sms
	if (authUi.manageAccountNotifPush)
		authUi.manageAccountNotifPush.checked = notif.push

	if (authUi.manageAccountEmail && authUi.manageAccountEmailHint) {
		updateManageHintState(
			authUi.manageAccountEmail,
			authUi.manageAccountEmailHint,
			isValidEmailFormat(authUi.manageAccountEmail.value),
			"✅ Email looks good.",
			"Use a valid email format (e.g. name@example.com).",
		)
	}
	if (authUi.manageAccountPhone && authUi.manageAccountPhoneHint) {
		updateManageHintState(
			authUi.manageAccountPhone,
			authUi.manageAccountPhoneHint,
			isValidPhoneFormat(authUi.manageAccountPhone.value),
			"✅ Phone format looks good.",
			"Use digits with optional +, spaces, or dashes.",
		)
	}
	updateManagePasswordStrengthUI(authUi.manageAccountNewPassword?.value || "")
}

function openManageAccountModal() {
	if (!isNonGuestSignedIn()) {
		openAuthModal("signin")
		return
	}
	if (authUi.manageAccountMessage) clearFormMessage(authUi.manageAccountMessage)
	loadManageAccountForm(auth.currentUser)
	if (authUi.manageAccountModal) {
		authUi.manageAccountModal.classList.add("active")
		authUi.manageAccountModal.setAttribute("aria-hidden", "false")
		document.body.style.overflow = "hidden"
	}
}

function closeManageAccountModal() {
	if (authUi.manageAccountModal) {
		authUi.manageAccountModal.classList.remove("active")
		authUi.manageAccountModal.setAttribute("aria-hidden", "true")
		document.body.style.overflow = ""
	}
}

async function handleManageAccountSaveProfile() {
	if (!firebaseReady || !auth?.currentUser) return
	const user = auth.currentUser
	const name = authUi.manageAccountName?.value?.trim() || ""
	const email = authUi.manageAccountEmail?.value?.trim() || ""
	const phone = authUi.manageAccountPhone?.value?.trim() || ""
	const avatarFile = authUi.manageAccountAvatarInput?.files?.[0] || null
	if (!isValidEmailFormat(email)) {
		showTimedFormMessage(
			authUi.manageAccountMessage,
			"error",
			"❌ Please enter a valid email address.",
		)
		return
	}
	if (!isValidPhoneFormat(phone)) {
		showTimedFormMessage(
			authUi.manageAccountMessage,
			"error",
			"❌ Please enter a valid phone number format.",
		)
		return
	}

	const btn = authUi.manageAccountSaveProfileBtn
	if (btn) {
		btn.disabled = true
		btn.textContent = "Saving..."
	}

	try {
		const profileUpdate = {}
		if (name && name !== (user.displayName || ""))
			profileUpdate.displayName = name
		if (avatarFile) {
			if (avatarFile.size > 5 * 1024 * 1024) {
				throw new Error("Profile picture must be 5MB or less.")
			}
			const uploadedUrl = await uploadImageToCloudinary(avatarFile)
			if (uploadedUrl) profileUpdate.photoURL = uploadedUrl
		}
		if (Object.keys(profileUpdate).length) {
			await user.updateProfile(profileUpdate)
		}
		if (email && email !== (user.email || "")) {
			await user.updateEmail(email)
		}
		await upsertUserProfile(user, {
			displayName: name || user.displayName || getUserDisplayName(user),
			email: email || user.email || "",
			phone,
		})
		setDashboardSignedInState(auth.currentUser)
		if (authUi.dashboardProfilePhone && phone) {
			authUi.dashboardProfilePhone.textContent = phone
		}
		setManageAvatarPreview(auth.currentUser)
		if (authUi.manageAccountAvatarInput) {
			authUi.manageAccountAvatarInput.value = ""
		}
		showTimedFormMessage(
			authUi.manageAccountMessage,
			"success",
			"✅ Profile updated successfully.",
		)
	} catch (error) {
		showTimedFormMessage(
			authUi.manageAccountMessage,
			"error",
			`❌ ${getFriendlyAuthError(error)}`,
		)
	} finally {
		if (btn) {
			btn.disabled = false
			btn.textContent = "Save Profile"
		}
	}
}

async function handleManageAccountChangePassword() {
	if (!firebaseReady || !auth?.currentUser) return
	const user = auth.currentUser
	const currentPassword = authUi.manageAccountCurrentPassword?.value || ""
	const newPassword = authUi.manageAccountNewPassword?.value || ""
	const passwordRules = evaluatePasswordRules(newPassword)

	if (!currentPassword || !newPassword || passwordRules.score < 4) {
		showTimedFormMessage(
			authUi.manageAccountMessage,
			"error",
			"❌ New password must be 8+ chars with upper, lower, and number.",
		)
		return
	}

	const btn = authUi.manageAccountChangePasswordBtn
	if (btn) {
		btn.disabled = true
		btn.textContent = "Updating..."
	}

	try {
		if (!user.email) {
			throw new Error("Email account required for password change.")
		}
		const credential = firebase.auth.EmailAuthProvider.credential(
			user.email,
			currentPassword,
		)
		await user.reauthenticateWithCredential(credential)
		await user.updatePassword(newPassword)
		if (authUi.manageAccountCurrentPassword)
			authUi.manageAccountCurrentPassword.value = ""
		if (authUi.manageAccountNewPassword)
			authUi.manageAccountNewPassword.value = ""
		showTimedFormMessage(
			authUi.manageAccountMessage,
			"success",
			"✅ Password changed securely.",
		)
	} catch (error) {
		showTimedFormMessage(
			authUi.manageAccountMessage,
			"error",
			`❌ ${getFriendlyAuthError(error)}`,
		)
	} finally {
		if (btn) {
			btn.disabled = false
			btn.textContent = "Change Password"
		}
	}
}

async function handleManageAccountResetPassword() {
	if (!firebaseReady || !auth) return
	const email =
		authUi.manageAccountEmail?.value?.trim() || auth.currentUser?.email || ""
	if (!email) {
		showTimedFormMessage(
			authUi.manageAccountMessage,
			"error",
			"❌ No email found to send reset link.",
		)
		return
	}
	if (!isValidEmailFormat(email)) {
		showTimedFormMessage(
			authUi.manageAccountMessage,
			"error",
			"❌ Please enter a valid email before requesting reset.",
		)
		return
	}
	try {
		await auth.sendPasswordResetEmail(email)
		showTimedFormMessage(
			authUi.manageAccountMessage,
			"success",
			"✅ Password reset email sent.",
		)
	} catch (error) {
		showTimedFormMessage(
			authUi.manageAccountMessage,
			"error",
			`❌ ${getFriendlyAuthError(error)}`,
		)
	}
}

function handleManageAccountSavePreferences() {
	const theme =
		authUi.manageAccountThemeSelect?.value === "light" ? "light" : "dark"
	isDark = theme === "dark"
	localStorage.setItem("theme", isDark ? "dark" : "light")
	applyTheme()

	const accessibility = {
		highContrast: authUi.manageAccountHighContrast?.checked === true,
		reducedMotion: authUi.manageAccountReducedMotion?.checked === true,
		fontSize: authUi.manageAccountFontSizeSelect?.value || "normal",
	}
	saveAccessibilityPrefs(accessibility)

	const notifications = {
		email: authUi.manageAccountNotifEmail?.checked === true,
		sms: authUi.manageAccountNotifSms?.checked === true,
		push: authUi.manageAccountNotifPush?.checked === true,
	}
	saveNotificationPrefs(notifications)

	showTimedFormMessage(
		authUi.manageAccountMessage,
		"success",
		"✅ Preferences saved.",
	)
}

function hideAccountDeletedPopup() {
	if (!authUi.accountDeleteSuccessPopup) return
	authUi.accountDeleteSuccessPopup.classList.remove("show")
	if (accountDeletePopupTimer) {
		clearTimeout(accountDeletePopupTimer)
		accountDeletePopupTimer = null
	}
}

function showAccountDeletedPopup() {
	if (!authUi.accountDeleteSuccessPopup) return
	authUi.accountDeleteSuccessPopup.classList.add("show")
	if (accountDeletePopupTimer) {
		clearTimeout(accountDeletePopupTimer)
	}
	accountDeletePopupTimer = setTimeout(() => {
		hideAccountDeletedPopup()
	}, 4200)
}

function closeDeleteAccountConfirmModal(confirmed = false) {
	const modal = authUi.deleteAccountConfirmModal
	if (modal) {
		if (deleteAccountConfirmCloseTimer) {
			clearTimeout(deleteAccountConfirmCloseTimer)
			deleteAccountConfirmCloseTimer = null
		}

		modal.classList.remove("active")
		modal.classList.add("is-closing")
		modal.setAttribute("aria-hidden", "true")

		deleteAccountConfirmCloseTimer = setTimeout(() => {
			modal.classList.remove("is-closing")
			deleteAccountConfirmCloseTimer = null
		}, 230)
	}

	if (pendingDeleteAccountResolver) {
		pendingDeleteAccountResolver(Boolean(confirmed))
		pendingDeleteAccountResolver = null
	}
}

function openDeleteAccountConfirmModal() {
	return new Promise((resolve) => {
		if (!authUi.deleteAccountConfirmModal) {
			resolve(false)
			return
		}

		if (pendingDeleteAccountResolver) {
			pendingDeleteAccountResolver(false)
		}
		pendingDeleteAccountResolver = resolve

		if (deleteAccountConfirmCloseTimer) {
			clearTimeout(deleteAccountConfirmCloseTimer)
			deleteAccountConfirmCloseTimer = null
		}

		if (authUi.deleteAccountConfirmMessage) {
			authUi.deleteAccountConfirmMessage.textContent =
				"This action is permanent and cannot be undone."
		}

		authUi.deleteAccountConfirmModal.classList.remove("is-closing")
		authUi.deleteAccountConfirmModal.classList.add("active")
		authUi.deleteAccountConfirmModal.setAttribute("aria-hidden", "false")
	})
}

function updateReviewAuthHintVisibility() {
	if (!authUi.reviewAuthHint) return
	authUi.reviewAuthHint.classList.toggle("hidden", isNonGuestSignedIn())
}

function updateReviewSubmissionVisibility() {
	const canSubmitReview = isNonGuestSignedIn()
	if (authUi.reviewSubmitWrap) {
		authUi.reviewSubmitWrap.classList.toggle("hidden", !canSubmitReview)
	}
	if (authUi.reviewSubmitAuthGate) {
		authUi.reviewSubmitAuthGate.classList.toggle("hidden", canSubmitReview)
	}
}

function showFavoritesToast(message = "") {
	if (!authUi.favoritesToast || !message) return
	authUi.favoritesToast.textContent = message
	authUi.favoritesToast.classList.add("show")
	if (favoritesToastTimer) {
		clearTimeout(favoritesToastTimer)
	}
	favoritesToastTimer = setTimeout(() => {
		authUi.favoritesToast?.classList.remove("show")
		favoritesToastTimer = null
	}, 1800)
}

function showTimedDashboardFavoritesMessage(type, text, duration = 2600) {
	if (!authUi.dashboardMessage) return

	if (dashboardFavoritesMessageTimer) {
		clearTimeout(dashboardFavoritesMessageTimer)
		dashboardFavoritesMessageTimer = null
	}

	showFormMessage(authUi.dashboardMessage, type, text)

	dashboardFavoritesMessageTimer = setTimeout(() => {
		hideReviewMessage(authUi.dashboardMessage, true)
		dashboardFavoritesMessageTimer = null
	}, duration)
}

function showTimedAuthMessage(type, text, duration = 4200) {
	if (!authUi.message) return

	if (authMessageTimer) {
		clearTimeout(authMessageTimer)
		authMessageTimer = null
	}

	showFormMessage(authUi.message, type, text)
	authMessageTimer = setTimeout(() => {
		hideReviewMessage(authUi.message, true)
		authMessageTimer = null
	}, duration)
}

function setAuthPasswordVisibility(isVisible) {
	if (!authUi.passwordInput || !authUi.passwordToggleBtn) return

	const shouldShow = isVisible === true
	authUi.passwordInput.type = shouldShow ? "text" : "password"
	authUi.passwordToggleBtn.setAttribute(
		"aria-label",
		shouldShow ? "Hide password" : "Show password",
	)
	authUi.passwordToggleBtn.setAttribute(
		"aria-pressed",
		shouldShow ? "true" : "false",
	)

	const icon = authUi.passwordToggleBtn.querySelector("i")
	if (icon) {
		icon.classList.toggle("fa-eye", !shouldShow)
		icon.classList.toggle("fa-eye-slash", shouldShow)
	}
}

function setManagePasswordVisibility(
	inputEl,
	toggleEl,
	isVisible = false,
	fieldLabel = "password",
) {
	if (!inputEl || !toggleEl) return

	const shouldShow = isVisible === true
	inputEl.type = shouldShow ? "text" : "password"
	toggleEl.setAttribute(
		"aria-label",
		`${shouldShow ? "Hide" : "Show"} ${fieldLabel}`,
	)
	toggleEl.setAttribute("aria-pressed", shouldShow ? "true" : "false")

	const icon = toggleEl.querySelector("i")
	if (icon) {
		icon.classList.toggle("fa-eye", !shouldShow)
		icon.classList.toggle("fa-eye-slash", shouldShow)
	}
}

function clearRegisterPromptHighlight() {
	authUi.switchToSignupBtn?.classList.remove("auth-register-highlight")
	authUi.switchToSignupBtn?.removeAttribute("aria-live")
}

function promptRegisterForMissingAccount() {
	setAuthMode("signin")
	if (authUi.switchToSignupBtn) {
		authUi.switchToSignupBtn.classList.add("auth-register-highlight")
		authUi.switchToSignupBtn.setAttribute("aria-live", "polite")
		authUi.switchToSignupBtn.focus()
	}
}

function setPostBookingPromptVisible(isVisible) {
	if (!authUi.postBookingAuthPrompt) return
	authUi.postBookingAuthPrompt.classList.toggle("hidden", !isVisible)
}

function setAuthMode(mode = "signin") {
	authMode = mode === "signup" ? "signup" : "signin"
	clearRegisterPromptHighlight()
	if (authUi.nameGroup) {
		authUi.nameGroup.style.display = authMode === "signup" ? "block" : "none"
	}
	if (authUi.submitBtn) {
		authUi.submitBtn.textContent =
			authMode === "signup" ? "Create Account" : "Log In"
	}
	if (authUi.switchToSignupBtn) {
		authUi.switchToSignupBtn.classList.toggle("hidden", authMode === "signup")
	}
	if (authUi.switchToSigninBtn) {
		authUi.switchToSigninBtn.classList.toggle("hidden", authMode !== "signup")
	}
	if (authUi.passwordInput) {
		authUi.passwordInput.setAttribute(
			"autocomplete",
			authMode === "signup" ? "new-password" : "current-password",
		)
	}
	setAuthPasswordVisibility(false)
}

function openAuthModal(defaultMode = "signin") {
	setAuthMode(defaultMode)
	if (authUi.message) clearFormMessage(authUi.message)
	if (authUi.modal) {
		authUi.modal.classList.add("active")
		authUi.modal.setAttribute("aria-hidden", "false")
		document.body.style.overflow = "hidden"
	}
}

function closeAuthModal() {
	if (authUi.modal) {
		authUi.modal.classList.remove("active")
		authUi.modal.setAttribute("aria-hidden", "true")
		document.body.style.overflow = ""
	}
}

function getUserDisplayName(user) {
	if (!user) return "Guest User"
	if (user.displayName && user.displayName.trim())
		return user.displayName.trim()
	if (user.email && user.email.includes("@")) {
		return user.email.split("@")[0]
	}
	return "Royal Braids Client"
}

function setHeaderProfileAvatar(user) {
	if (!authUi.profileTrigger || !authUi.profileInitial) return

	const existingImg = authUi.profileTrigger.querySelector("img")
	if (existingImg) existingImg.remove()

	const displayName = getUserDisplayName(user)
	authUi.profileInitial.textContent = (
		displayName.charAt(0) || "R"
	).toUpperCase()

	if (user?.photoURL) {
		const img = document.createElement("img")
		img.src = user.photoURL
		img.alt = `${displayName} profile photo`
		img.loading = "lazy"
		authUi.profileTrigger.appendChild(img)
		authUi.profileInitial.style.display = "none"
	} else {
		authUi.profileInitial.style.display = "inline-flex"
	}
}

function setDashboardPromptState() {
	stopDashboardFavoritesListener()
	dashboardFavoriteStyles = []
	activeDashboardUid = ""
	if (authUi.clientDashboard) authUi.clientDashboard.classList.add("hidden")
	if (authUi.navDashboardLink) authUi.navDashboardLink.classList.add("hidden")
	if (authUi.openBtn) authUi.openBtn.classList.remove("hidden")
	if (authUi.profileMenu) authUi.profileMenu.classList.add("hidden")
	setHeaderProfileAvatar(null)
	if (authUi.dashboardProfileName)
		authUi.dashboardProfileName.textContent = "Guest User"
	if (authUi.dashboardProfileEmail)
		authUi.dashboardProfileEmail.textContent = "Not signed in"
	if (authUi.dashboardProfilePhone)
		authUi.dashboardProfilePhone.textContent = "Add phone during booking"
	if (authUi.dashboardAuthBtn) {
		authUi.dashboardAuthBtn.textContent = "Log In to Sync Data"
	}
	if (authUi.dashboardDeleteAccountBtn) {
		authUi.dashboardDeleteAccountBtn.classList.add("hidden")
		authUi.dashboardDeleteAccountBtn.disabled = false
		authUi.dashboardDeleteAccountBtn.textContent = "Delete Account"
	}
	closeManageAccountModal()
	if (dashboardFavoritesMessageTimer) {
		clearTimeout(dashboardFavoritesMessageTimer)
		dashboardFavoritesMessageTimer = null
	}
	renderDashboardFavorites(
		authUi.dashboardFavoritesList,
		[],
		"Log in to save favorite braid styles.",
	)
	if (authUi.dashboardFavoritesCount)
		authUi.dashboardFavoritesCount.textContent = "0"
	updateFavoriteButtonsUI()
	setPostBookingPromptVisible(false)
	updateReviewSubmissionVisibility()
}

function setDashboardSignedInState(user) {
	if (authUi.clientDashboard) authUi.clientDashboard.classList.remove("hidden")
	if (authUi.navDashboardLink)
		authUi.navDashboardLink.classList.remove("hidden")
	if (authUi.openBtn) authUi.openBtn.classList.add("hidden")
	if (authUi.profileMenu) authUi.profileMenu.classList.remove("hidden")

	const displayName = getUserDisplayName(user)
	const initial = displayName.charAt(0).toUpperCase() || "R"

	if (authUi.profileName) authUi.profileName.textContent = displayName
	if (authUi.profileInitial) authUi.profileInitial.textContent = initial
	setHeaderProfileAvatar(user)
	if (authUi.dashboardProfileName)
		authUi.dashboardProfileName.textContent = displayName
	if (authUi.dashboardProfileEmail)
		authUi.dashboardProfileEmail.textContent = user?.email || "No email"
	if (authUi.dashboardAuthBtn) {
		authUi.dashboardAuthBtn.textContent = "Manage Account"
	}
	if (authUi.dashboardDeleteAccountBtn) {
		authUi.dashboardDeleteAccountBtn.classList.remove("hidden")
		authUi.dashboardDeleteAccountBtn.disabled = false
		authUi.dashboardDeleteAccountBtn.textContent = "Delete Account"
	}
	updateReviewSubmissionVisibility()
	setPostBookingPromptVisible(false)
}

function focusDashboardAfterAuthIfRequested() {
	if (!shouldAutoFocusDashboardAfterAuth) return
	shouldAutoFocusDashboardAfterAuth = false

	if (authUi.clientDashboard) {
		authUi.clientDashboard.scrollIntoView({
			behavior: "smooth",
			block: "start",
		})
		authUi.clientDashboard.setAttribute("tabindex", "-1")
		authUi.clientDashboard.focus({ preventScroll: true })
	}
}

async function upsertUserProfile(user, extras = {}) {
	if (!firebaseReady || !db || !user?.uid) return
	const safeDisplayName =
		(user.displayName || extras.displayName || "").trim() ||
		getUserDisplayName(user)
	const providerId =
		user.providerData?.[0]?.providerId || extras.provider || "unknown"
	const emailValue = user.email || extras.email || ""
	const phoneValue =
		typeof extras.phone === "string"
			? extras.phone
			: (user.phoneNumber && String(user.phoneNumber)) || ""
	await db.collection("users").doc(user.uid).set(
		{
			displayName: safeDisplayName,
			email: emailValue,
			provider: providerId,
			phone: phoneValue,
			updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
			createdAt: firebase.firestore.FieldValue.serverTimestamp(),
		},
		{ merge: true },
	)
}

function renderDashboardList(mount, items, emptyText) {
	if (!mount) return
	if (!Array.isArray(items) || !items.length) {
		mount.innerHTML = `<li>${emptyText}</li>`
		return
	}
	mount.innerHTML = items.map((item) => `<li>${item}</li>`).join("")
}

function getGalleryIdentity(style = {}) {
	return String(style.id || style.styleName || style.styleType || "")
		.trim()
		.toLowerCase()
}

function isStyleFavorited(style = {}) {
	const identity = getGalleryIdentity(style)
	if (!identity) return false
	return dashboardFavoriteStyles.some(
		(item) => getGalleryIdentity(item) === identity,
	)
}

function setFavoriteButtonState(button, favorited) {
	if (!button) return
	const active = favorited === true
	button.classList.toggle("is-favorited", active)
	button.textContent = active ? "♥ Saved" : "♡ Save"
	button.setAttribute("aria-pressed", active ? "true" : "false")
}

function updateFavoriteButtonsUI() {
	document.querySelectorAll(".gallery-save-favorite-btn").forEach((btn) => {
		const styleId = btn.dataset.favStyleId || ""
		const style = galleryData.find(
			(item) => String(item.id || "") === String(styleId),
		)
		setFavoriteButtonState(btn, isStyleFavorited(style))
	})

	const lightboxFavoriteBtn = document.getElementById("lightboxFavoriteBtn")
	if (lightboxFavoriteBtn) {
		const visible = getVisibleGalleryData()
		const safeIndex =
			((currentLightboxIndex % Math.max(visible.length, 1)) +
				Math.max(visible.length, 1)) %
			Math.max(visible.length, 1)
		const activeStyle = visible[safeIndex]
		setFavoriteButtonState(lightboxFavoriteBtn, isStyleFavorited(activeStyle))
	}
}

function renderDashboardFavorites(mount, styles = [], emptyText) {
	if (authUi.dashboardFavoritesCount) {
		authUi.dashboardFavoritesCount.textContent = String(styles.length || 0)
	}

	if (!mount) return
	if (!Array.isArray(styles) || !styles.length) {
		mount.innerHTML = `<li>${emptyText}</li>`
		return
	}

	mount.innerHTML = styles
		.map((style) => {
			const styleId = escapeHtml(String(style.id || ""))
			const styleName = escapeHtml(style.styleName || "Favorite style")
			const styleMeta = escapeHtml(
				`${style.styleType || "Braids"} • ${style.stylistName || "Royal Braids Team"}`,
			)
			const imageUrl = escapeHtml(style.imageUrl || "")
			return `
      <li class="dashboard-favorite-card">
        <div class="dashboard-favorite-item">
        <div class="dashboard-favorite-media">
          ${
						imageUrl
							? `<img src="${imageUrl}" alt="${styleName}" loading="lazy" />`
							: "<span>Style</span>"
					}
        </div>
        <div class="dashboard-favorite-content">
          <strong>${styleName}</strong>
          <p>${styleMeta}</p>
          <div class="dashboard-favorite-actions">
            <button type="button" class="btn btn-outline" data-dashboard-favorite-book="${styleId}">Book</button>
            <button type="button" class="btn btn-outline" data-dashboard-favorite-remove="${styleId}">Remove</button>
          </div>
        </div>
        </div>
      </li>
    `
		})
		.join("")
}

function stopDashboardFavoritesListener() {
	if (typeof dashboardFavoritesUnsubscribe === "function") {
		dashboardFavoritesUnsubscribe()
		dashboardFavoritesUnsubscribe = null
	}
}

function getFavoritePayload(style = {}) {
	return {
		id: String(style.id || "").trim(),
		styleName: String(style.styleName || "").trim(),
		styleType: String(style.styleType || "").trim(),
		stylistName: String(style.stylistName || "").trim(),
		imageUrl: String(style.imageUrl || "").trim(),
		savedAt: firebase.firestore.FieldValue.serverTimestamp(),
	}
}

async function toggleFavoriteStyle(style = {}, sourceButton = null) {
	if (!firebaseReady || !db || !auth) return

	const user = auth.currentUser
	if (!user || user.isAnonymous) {
		shouldAutoFocusDashboardAfterAuth = true
		openAuthModal("signin")
		if (authUi.message) {
			showTimedAuthMessage("error", "🔐 Log in to save favorite braid styles.")
		}
		return
	}

	const styleId = String(style.id || "").trim()
	if (!styleId) return

	if (sourceButton) sourceButton.disabled = true
	const favoriteRef = db
		.collection("users")
		.doc(user.uid)
		.collection("favorites")
		.doc(styleId)

	try {
		if (isStyleFavorited(style)) {
			await favoriteRef.delete()
			showFavoritesToast("Removed from favorites")
			showTimedDashboardFavoritesMessage(
				"success",
				"🗑️ Style removed from favorites.",
			)
		} else {
			await favoriteRef.set(getFavoritePayload(style), { merge: true })
			showFavoritesToast("Saved to favorites")
			showTimedDashboardFavoritesMessage(
				"success",
				"💖 Style saved to favorites.",
			)
		}
	} catch (error) {
		console.error("Favorite toggle failed:", error)
		showTimedDashboardFavoritesMessage(
			"error",
			"⚠️ Could not update favorites right now.",
		)
	} finally {
		if (sourceButton) sourceButton.disabled = false
	}
}

function startDashboardFavoritesListener(uid) {
	if (!firebaseReady || !db || !uid) return

	if (
		activeDashboardUid === uid &&
		typeof dashboardFavoritesUnsubscribe === "function"
	) {
		return
	}

	stopDashboardFavoritesListener()
	activeDashboardUid = uid

	dashboardFavoritesUnsubscribe = db
		.collection("users")
		.doc(uid)
		.collection("favorites")
		.limit(30)
		.onSnapshot(
			(snapshot) => {
				dashboardFavoriteStyles = snapshot.docs
					.map((doc) => ({ id: doc.id, ...(doc.data() || {}) }))
					.sort(
						(a, b) =>
							toTimestampMs(b.savedAt || b.updatedAt) -
							toTimestampMs(a.savedAt || a.updatedAt),
					)

				renderDashboardFavorites(
					authUi.dashboardFavoritesList,
					dashboardFavoriteStyles,
					"No favorite styles yet. Tap ♡ Save in gallery.",
				)
				updateFavoriteButtonsUI()
			},
			(error) => {
				console.error("Favorites listener failed:", error)
				renderDashboardFavorites(
					authUi.dashboardFavoritesList,
					[],
					"Could not load favorite styles right now.",
				)
			},
		)
}

async function loadUserDashboardData(userOrUid) {
	const uid =
		typeof userOrUid === "string"
			? userOrUid
			: userOrUid?.uid || auth?.currentUser?.uid || ""
	const email =
		typeof userOrUid === "string"
			? String(auth?.currentUser?.email || "")
			: String(userOrUid?.email || auth?.currentUser?.email || "")
					.trim()
					.toLowerCase()

	if (!firebaseReady || !db || !uid) return
	startDashboardFavoritesListener(uid)

	try {
		let bookingsByUidSnap = null
		let bookingsByEmailSnap = null
		let reviewsSnap = null

		try {
			;[bookingsByUidSnap, reviewsSnap] = await Promise.all([
				db
					.collection("bookings")
					.where("uid", "==", uid)
					.orderBy("createdAt", "desc")
					.limit(5)
					.get(),
				db
					.collection("reviews")
					.where("uid", "==", uid)
					.orderBy("createdAt", "desc")
					.limit(5)
					.get(),
			])
		} catch (indexedQueryError) {
			console.warn(
				"Indexed dashboard query failed, falling back to non-indexed fetch:",
				indexedQueryError,
			)
			;[bookingsByUidSnap, reviewsSnap] = await Promise.all([
				db.collection("bookings").where("uid", "==", uid).get(),
				db.collection("reviews").where("uid", "==", uid).get(),
			])
		}

		if (email) {
			try {
				bookingsByEmailSnap = await db
					.collection("bookings")
					.where("email", "==", email)
					.limit(20)
					.get()
			} catch (emailQueryError) {
				console.warn("Email-linked bookings query failed:", emailQueryError)
			}
		}

		const bookingItems = []
		let latestPhone = ""
		const bookingDocMap = new Map()
		;(bookingsByUidSnap?.docs || []).forEach((doc) => {
			bookingDocMap.set(doc.id, doc)
		})
		;(bookingsByEmailSnap?.docs || []).forEach((doc) => {
			if (!bookingDocMap.has(doc.id)) {
				bookingDocMap.set(doc.id, doc)
			}
		})

		const bookingsDocs = [...bookingDocMap.values()].sort(
			(a, b) =>
				toTimestampMs(b.data()?.createdAt) - toTimestampMs(a.data()?.createdAt),
		)
		bookingsDocs.slice(0, 5).forEach((doc) => {
			const data = doc.data() || {}
			if (!latestPhone && data.phone) latestPhone = data.phone
			bookingItems.push(
				`${escapeHtml(data.service || "Service")} • ${escapeHtml(data.date || "No date")} at ${escapeHtml(data.time || "No time")} • ${escapeHtml(data.status || "pending")}`,
			)
		})

		const reviewItems = []
		const reviewDocs = [...(reviewsSnap?.docs || [])].sort(
			(a, b) =>
				toTimestampMs(b.data()?.createdAt) - toTimestampMs(a.data()?.createdAt),
		)
		reviewDocs.slice(0, 5).forEach((doc) => {
			const data = doc.data() || {}
			const safeRating = Math.max(0, Math.min(5, Number(data.rating || 0)))
			reviewItems.push(
				`${"★".repeat(safeRating)}${"☆".repeat(5 - safeRating)} • ${escapeHtml(data.status || "pending")} • ${escapeHtml((data.text || "").slice(0, 80))}${(data.text || "").length > 80 ? "..." : ""}`,
			)
		})

		renderDashboardList(
			authUi.dashboardBookingsList,
			bookingItems,
			"No appointments yet.",
		)
		renderDashboardList(
			authUi.dashboardReviewsList,
			reviewItems,
			"No reviews submitted yet.",
		)

		if (latestPhone && authUi.dashboardProfilePhone) {
			authUi.dashboardProfilePhone.textContent = latestPhone
		}

		if (authUi.dashboardMessage) clearFormMessage(authUi.dashboardMessage)
	} catch (error) {
		console.error("Dashboard data load failed:", error)
		if (authUi.dashboardMessage) {
			showFormMessage(
				authUi.dashboardMessage,
				"error",
				"⚠️ Could not load dashboard data right now.",
			)
		}
	}
}

async function handleGoogleAuth() {
	if (!firebaseReady || !auth) return
	if (authUi.message) clearFormMessage(authUi.message)
	if (googleAuthInProgress) {
		if (authUi.message) {
			showTimedAuthMessage(
				"error",
				"⏳ Google sign-in is already in progress. Please wait...",
			)
		}
		return
	}

	googleAuthInProgress = true
	setGoogleAuthButtonsBusy(true)
	setAuthSwitchingState(true)

	try {
		const provider = new firebase.auth.GoogleAuthProvider()
		provider.setCustomParameters({
			prompt: "select_account",
		})

		if (shouldPreferRedirectGoogleAuth()) {
			if (authUi.message) {
				showTimedAuthMessage("success", "🔄 Opening secure Google sign-in...")
			}
			if (auth.currentUser?.isAnonymous) {
				await auth.currentUser.linkWithRedirect(provider)
			} else {
				await auth.signInWithRedirect(provider)
			}
			return
		}

		let popupResult = null
		if (auth.currentUser?.isAnonymous) {
			try {
				popupResult = await auth.currentUser.linkWithPopup(provider)
			} catch (linkError) {
				const linkCode = linkError?.code || ""
				const canFallbackToSignin =
					linkCode === "auth/credential-already-in-use" ||
					linkCode === "auth/email-already-in-use" ||
					linkCode === "auth/account-exists-with-different-credential"

				if (!canFallbackToSignin) {
					throw linkError
				}

				popupResult = await auth.signInWithPopup(provider)
			}
		} else {
			popupResult = await auth.signInWithPopup(provider)
		}

		const signedInUser = popupResult?.user || auth.currentUser
		await finalizeGoogleSignInResult(signedInUser, { source: "popup" })
	} catch (error) {
		console.error("Google auth failed:", error)
		shouldAutoFocusDashboardAfterAuth = false
		const code = error?.code || ""

		const useRedirectFallback =
			code === "auth/invalid-action-code" ||
			code === "auth/operation-not-supported-in-this-environment" ||
			code === "auth/popup-blocked"

		if (useRedirectFallback) {
			try {
				if (authUi.message) {
					showTimedAuthMessage(
						"success",
						"🔄 Popup failed, redirecting to Google sign-in...",
					)
				}
				const provider = new firebase.auth.GoogleAuthProvider()
				provider.setCustomParameters({ prompt: "select_account" })
				if (auth.currentUser?.isAnonymous) {
					await auth.currentUser.linkWithRedirect(provider)
				} else {
					await auth.signInWithRedirect(provider)
				}
				return
			} catch (redirectError) {
				console.error("Google redirect fallback failed:", redirectError)
				if (authUi.message) {
					showTimedAuthMessage(
						"error",
						`❌ ${getFriendlyAuthError(redirectError)}`,
					)
				}
			}
		}

		if (authUi.message) {
			showTimedAuthMessage("error", `❌ ${getFriendlyAuthError(error)}`)
		}
	} finally {
		googleAuthInProgress = false
		setGoogleAuthButtonsBusy(false)
		setAuthSwitchingState(false)
	}
}

async function handleEmailAuthSubmit(event) {
	event.preventDefault()
	if (!firebaseReady || !auth) return
	if (authUi.message) clearFormMessage(authUi.message)

	const email = authUi.emailInput?.value?.trim() || ""
	const password = authUi.passwordInput?.value || ""
	const name = authUi.nameInput?.value?.trim() || ""

	if (!email || !password) {
		if (authUi.message) {
			showTimedAuthMessage("error", "❌ Email and password are required.")
		}
		return
	}

	if (authMode === "signup" && name.length < 2) {
		if (authUi.message) {
			showTimedAuthMessage("error", "❌ Please enter your full name.")
		}
		return
	}

	if (authUi.submitBtn) {
		authUi.submitBtn.disabled = true
		authUi.submitBtn.textContent =
			authMode === "signup" ? "Creating Account..." : "Signing In..."
	}
	setAuthSwitchingState(true)

	try {
		const currentUser = auth.currentUser
		const credential = firebase.auth.EmailAuthProvider.credential(
			email,
			password,
		)
		let signedInUser = null

		if (authMode === "signup") {
			if (currentUser?.isAnonymous) {
				const linked = await currentUser.linkWithCredential(credential)
				signedInUser = linked?.user || currentUser
			} else {
				const created = await auth.createUserWithEmailAndPassword(
					email,
					password,
				)
				signedInUser = created?.user || auth.currentUser
			}

			if (name && signedInUser) {
				await signedInUser.updateProfile({ displayName: name })
				signedInUser = {
					...signedInUser,
					displayName: name,
				}
			}
		} else {
			const signedIn = await auth.signInWithEmailAndPassword(email, password)
			signedInUser = signedIn?.user || auth.currentUser
		}

		signedInUser = signedInUser || auth.currentUser
		if (signedInUser && !signedInUser.isAnonymous) {
			setDashboardSignedInState(signedInUser)
			closeAuthModal()
			const loggedInName = getUserDisplayName(signedInUser)
			showFavoritesToast(`You're now Logged In as ${loggedInName}`)
			focusDashboardAfterAuthIfRequested()
		}

		await upsertUserProfile(signedInUser, {
			displayName: name,
			provider: "password",
		})
		if (signedInUser?.uid) {
			await loadUserDashboardData(signedInUser)
		}

		if (authUi.emailForm) authUi.emailForm.reset()
	} catch (error) {
		console.error("Email auth failed:", error)
		const code = error?.code || ""

		if (authMode === "signin" && code === "auth/wrong-password") {
			showTimedAuthMessage(
				"error",
				"❌ Incorrect password. This account exists — please enter the correct password and try again.",
			)
			return
		}

		if (authMode === "signin" && code === "auth/invalid-credential") {
			try {
				const methods = await auth.fetchSignInMethodsForEmail(email)

				if (!Array.isArray(methods) || methods.length === 0) {
					showTimedAuthMessage(
						"error",
						"❌ This account is not available. Please create an account and log in again.",
					)
					promptRegisterForMissingAccount()
					return
				}

				if (methods.includes("password")) {
					showTimedAuthMessage(
						"error",
						"❌ Incorrect password. This account exists — please enter the correct password and try again.",
					)
					return
				}

				showTimedAuthMessage(
					"error",
					"⚠️ This account exists but is not set up for password login. Please use the original sign-in method used during registration.",
				)
				return
			} catch (_lookupError) {
				showTimedAuthMessage(
					"error",
					"❌ This account is not available. Please create an account and log in again.",
				)
				promptRegisterForMissingAccount()
				return
			}
		}

		if (authMode === "signin" && code === "auth/user-not-found") {
			showTimedAuthMessage(
				"error",
				"❌ This account is not available. Please create an account and log in again.",
			)
			promptRegisterForMissingAccount()
			return
		}

		if (authMode === "signup" && code === "auth/email-already-in-use") {
			setAuthMode("signin")
			if (authUi.message) {
				showTimedAuthMessage(
					"error",
					"⚠️ This email is already registered. Please log in with your password.",
				)
			}
			return
		}

		if (authUi.message) {
			showTimedAuthMessage("error", `❌ ${getFriendlyAuthError(error)}`)
		}
	} finally {
		setAuthSwitchingState(false)
		if (authUi.submitBtn) {
			authUi.submitBtn.disabled = false
			authUi.submitBtn.textContent =
				authMode === "signup" ? "Create Account" : "Log In"
		}
	}
}

async function handleForgotPassword() {
	if (!firebaseReady || !auth) return
	const email = authUi.emailInput?.value?.trim() || ""
	if (!email) {
		if (authUi.message) {
			showTimedAuthMessage(
				"error",
				"❌ Enter your email first, then click Forgot Password.",
			)
		}
		return
	}

	try {
		await auth.sendPasswordResetEmail(email)
		if (authUi.message) {
			showTimedAuthMessage(
				"success",
				"✅ Password reset email sent. Please check your inbox.",
			)
		}
	} catch (error) {
		if (authUi.message) {
			showTimedAuthMessage("error", `❌ ${getFriendlyAuthError(error)}`)
		}
	}
}

async function handleLogout() {
	if (!firebaseReady || !auth) return
	try {
		await auth.signOut()
		closeAuthModal()
		setDashboardPromptState()
		showFavoritesToast("You're now continuing as guest")
	} catch (error) {
		console.error("Logout failed:", error)
	}
}

async function handleContinueAsGuest() {
	const guestBtn = authUi.continueAsGuestBtn
	if (guestBtn) {
		guestBtn.disabled = true
		guestBtn.textContent = "Continuing..."
	}

	try {
		if (firebaseReady && auth) {
			const currentUser = auth.currentUser
			if (currentUser && !currentUser.isAnonymous) {
				await auth.signOut()
			}

			if (!auth.currentUser) {
				await auth.signInAnonymously()
			}
		}

		setDashboardPromptState()
		closeAuthModal()
		showFavoritesToast("You're now continuing as guest")
		document.getElementById("booking")?.scrollIntoView({
			behavior: "smooth",
			block: "start",
		})
	} catch (error) {
		console.error("Continue as guest failed:", error)
		if (authUi.message) {
			showTimedAuthMessage("error", `❌ ${getFriendlyAuthError(error)}`)
		}
	} finally {
		if (guestBtn) {
			guestBtn.disabled = false
			guestBtn.textContent = "Continue as Guest"
		}
	}
}

async function handleDeleteAccount() {
	if (!firebaseReady || !auth) return

	const user = auth.currentUser
	if (!user || user.isAnonymous) {
		if (authUi.dashboardMessage) {
			showTimedFormMessage(
				authUi.dashboardMessage,
				"error",
				"⚠️ Please log in first to delete your account.",
			)
		}
		return
	}

	const confirmed = await openDeleteAccountConfirmModal()
	if (!confirmed) return

	const deleteBtn =
		authUi.manageAccountDeleteBtn || authUi.dashboardDeleteAccountBtn
	if (deleteBtn) {
		deleteBtn.disabled = true
		deleteBtn.textContent = "Deleting..."
	}

	try {
		await user.delete()

		if (!auth.currentUser) {
			await auth.signInAnonymously()
		}

		setDashboardPromptState()
		closeManageAccountModal()
		closeAuthModal()
		showAccountDeletedPopup()
		document.getElementById("home")?.scrollIntoView({
			behavior: "smooth",
			block: "start",
		})
	} catch (error) {
		console.error("Delete account failed:", error)
		if (authUi.dashboardMessage) {
			showTimedFormMessage(
				authUi.dashboardMessage,
				"error",
				`❌ ${getFriendlyAuthError(error)}`,
			)
		}
	} finally {
		if (deleteBtn) {
			deleteBtn.disabled = false
			deleteBtn.textContent = "Delete Account"
		}
	}
}

function bindAuthUiEvents() {
	if (authUi.openBtn) {
		authUi.openBtn.addEventListener("click", () => openAuthModal("signin"))
	}
	if (authUi.closeBtn) {
		authUi.closeBtn.addEventListener("click", closeAuthModal)
	}
	if (authUi.backdrop) {
		authUi.backdrop.addEventListener("click", closeAuthModal)
	}
	if (authUi.googleBtn) {
		authUi.googleBtn.addEventListener("click", () => {
			void handleGoogleAuth()
		})
	}
	if (authUi.emailForm) {
		authUi.emailForm.addEventListener("submit", (event) => {
			void handleEmailAuthSubmit(event)
		})
	}
	if (authUi.passwordToggleBtn && authUi.passwordInput) {
		authUi.passwordToggleBtn.addEventListener("click", () => {
			setAuthPasswordVisibility(authUi.passwordInput.type === "password")
		})
	}
	if (authUi.switchToSignupBtn) {
		authUi.switchToSignupBtn.addEventListener("click", () =>
			setAuthMode("signup"),
		)
	}
	if (authUi.switchToSigninBtn) {
		authUi.switchToSigninBtn.addEventListener("click", () =>
			setAuthMode("signin"),
		)
	}
	if (authUi.forgotPasswordBtn) {
		authUi.forgotPasswordBtn.addEventListener("click", () => {
			void handleForgotPassword()
		})
	}
	if (authUi.continueAsGuestBtn) {
		authUi.continueAsGuestBtn.addEventListener("click", () => {
			void handleContinueAsGuest()
		})
	}
	if (authUi.postBookingGoogleBtn) {
		authUi.postBookingGoogleBtn.addEventListener("click", () => {
			openAuthModal("signin")
			if (authUi.message) {
				showTimedAuthMessage(
					"success",
					"Log in using your email and password to sync this booking.",
				)
			}
		})
	}
	if (authUi.postBookingLaterBtn) {
		authUi.postBookingLaterBtn.addEventListener("click", () => {
			setPostBookingPromptVisible(false)
		})
	}
	if (authUi.reviewAuthHintBtn) {
		authUi.reviewAuthHintBtn.addEventListener("click", () => {
			openAuthModal("signin")
		})
	}
	if (authUi.reviewSubmitAuthGateBtn) {
		authUi.reviewSubmitAuthGateBtn.addEventListener("click", () => {
			openAuthModal("signin")
		})
	}
	if (authUi.logoutBtn) {
		authUi.logoutBtn.addEventListener("click", () => {
			void handleLogout()
		})
	}
	if (authUi.dashboardAuthBtn) {
		authUi.dashboardAuthBtn.addEventListener("click", () => {
			if (isNonGuestSignedIn()) {
				openManageAccountModal()
				return
			}
			openAuthModal("signin")
		})
	}
	if (authUi.manageAccountBackdrop) {
		authUi.manageAccountBackdrop.addEventListener(
			"click",
			closeManageAccountModal,
		)
	}
	if (authUi.manageAccountCloseBtn) {
		authUi.manageAccountCloseBtn.addEventListener(
			"click",
			closeManageAccountModal,
		)
	}
	if (authUi.manageAccountSaveProfileBtn) {
		authUi.manageAccountSaveProfileBtn.addEventListener("click", () => {
			void handleManageAccountSaveProfile()
		})
	}
	if (authUi.manageAccountEmail && authUi.manageAccountEmailHint) {
		authUi.manageAccountEmail.addEventListener("input", () => {
			updateManageHintState(
				authUi.manageAccountEmail,
				authUi.manageAccountEmailHint,
				isValidEmailFormat(authUi.manageAccountEmail.value),
				"✅ Email looks good.",
				"Use a valid email format (e.g. name@example.com).",
			)
		})
	}
	if (authUi.manageAccountPhone && authUi.manageAccountPhoneHint) {
		authUi.manageAccountPhone.addEventListener("input", () => {
			updateManageHintState(
				authUi.manageAccountPhone,
				authUi.manageAccountPhoneHint,
				isValidPhoneFormat(authUi.manageAccountPhone.value),
				"✅ Phone format looks good.",
				"Use digits with optional +, spaces, or dashes.",
			)
		})
	}
	if (authUi.manageAccountNewPassword) {
		authUi.manageAccountNewPassword.addEventListener("input", () => {
			updateManagePasswordStrengthUI(authUi.manageAccountNewPassword.value)
		})
		setManagePasswordVisibility(
			authUi.manageAccountCurrentPassword,
			authUi.manageAccountCurrentPasswordToggle,
			false,
			"current password",
		)
		setManagePasswordVisibility(
			authUi.manageAccountNewPassword,
			authUi.manageAccountNewPasswordToggle,
			false,
			"new password",
		)
	}
	if (authUi.manageAccountAvatarInput) {
		authUi.manageAccountAvatarInput.addEventListener("change", () => {
			const file = authUi.manageAccountAvatarInput?.files?.[0]
			if (!file || !authUi.manageAccountAvatarPreview) return
			if (file.size > 5 * 1024 * 1024) {
				showTimedFormMessage(
					authUi.manageAccountMessage,
					"error",
					"❌ Profile picture must be 5MB or less.",
				)
				authUi.manageAccountAvatarInput.value = ""
				setManageAvatarPreview(auth.currentUser)
				return
			}

			const reader = new FileReader()
			reader.onload = () => {
				const existingImg =
					authUi.manageAccountAvatarPreview.querySelector("img")
				if (existingImg) existingImg.remove()
				const previewImg = document.createElement("img")
				previewImg.src = String(reader.result || "")
				previewImg.alt = "Profile preview"
				authUi.manageAccountAvatarPreview.appendChild(previewImg)
				if (authUi.manageAccountAvatarInitial) {
					authUi.manageAccountAvatarInitial.style.display = "none"
				}
			}
			reader.readAsDataURL(file)
		})
	}
	if (authUi.manageAccountChangePasswordBtn) {
		authUi.manageAccountChangePasswordBtn.addEventListener("click", () => {
			void handleManageAccountChangePassword()
		})
	}
	if (
		authUi.manageAccountCurrentPasswordToggle &&
		authUi.manageAccountCurrentPassword
	) {
		authUi.manageAccountCurrentPasswordToggle.addEventListener("click", () => {
			setManagePasswordVisibility(
				authUi.manageAccountCurrentPassword,
				authUi.manageAccountCurrentPasswordToggle,
				authUi.manageAccountCurrentPassword.type === "password",
				"current password",
			)
		})
	}
	if (
		authUi.manageAccountNewPasswordToggle &&
		authUi.manageAccountNewPassword
	) {
		authUi.manageAccountNewPasswordToggle.addEventListener("click", () => {
			setManagePasswordVisibility(
				authUi.manageAccountNewPassword,
				authUi.manageAccountNewPasswordToggle,
				authUi.manageAccountNewPassword.type === "password",
				"new password",
			)
		})
	}
	if (authUi.manageAccountResetPasswordBtn) {
		authUi.manageAccountResetPasswordBtn.addEventListener("click", () => {
			void handleManageAccountResetPassword()
		})
	}
	if (authUi.manageAccountSavePreferencesBtn) {
		authUi.manageAccountSavePreferencesBtn.addEventListener(
			"click",
			handleManageAccountSavePreferences,
		)
	}
	if (authUi.manageAccountDeleteBtn) {
		authUi.manageAccountDeleteBtn.addEventListener("click", () => {
			void handleDeleteAccount()
		})
	}
	if (authUi.dashboardDeleteAccountBtn) {
		authUi.dashboardDeleteAccountBtn.addEventListener("click", () => {
			void handleDeleteAccount()
		})
	}
	if (authUi.deleteAccountConfirmBackdrop) {
		authUi.deleteAccountConfirmBackdrop.addEventListener("click", () => {
			closeDeleteAccountConfirmModal(false)
		})
	}
	if (authUi.deleteAccountConfirmCloseBtn) {
		authUi.deleteAccountConfirmCloseBtn.addEventListener("click", () => {
			closeDeleteAccountConfirmModal(false)
		})
	}
	if (authUi.deleteAccountConfirmCancelBtn) {
		authUi.deleteAccountConfirmCancelBtn.addEventListener("click", () => {
			closeDeleteAccountConfirmModal(false)
		})
	}
	if (authUi.deleteAccountConfirmProceedBtn) {
		authUi.deleteAccountConfirmProceedBtn.addEventListener("click", () => {
			closeDeleteAccountConfirmModal(true)
		})
	}
	if (authUi.dashboardFavoritesList) {
		authUi.dashboardFavoritesList.addEventListener("click", (event) => {
			const removeBtn = event.target.closest("[data-dashboard-favorite-remove]")
			const bookBtn = event.target.closest("[data-dashboard-favorite-book]")
			if (!removeBtn && !bookBtn) return

			const styleId =
				removeBtn?.dataset.dashboardFavoriteRemove ||
				bookBtn?.dataset.dashboardFavoriteBook ||
				""
			const style = dashboardFavoriteStyles.find(
				(item) => String(item.id || "") === String(styleId),
			)
			if (!style) return

			if (bookBtn) {
				selectService(style.styleName || style.styleType || "")
				return
			}

			void toggleFavoriteStyle(style, removeBtn)
		})
	}

	if (authUi.profileTrigger && authUi.profileMenu) {
		authUi.profileTrigger.addEventListener("click", () => {
			authUi.profileMenu.classList.toggle("open")
			const expanded = authUi.profileMenu.classList.contains("open")
			authUi.profileTrigger.setAttribute(
				"aria-expanded",
				expanded ? "true" : "false",
			)
		})

		document.addEventListener("click", (event) => {
			if (!authUi.profileMenu?.contains(event.target)) {
				authUi.profileMenu.classList.remove("open")
				authUi.profileTrigger?.setAttribute("aria-expanded", "false")
			}
		})
	}
}

function attachAuthStateObserver() {
	if (authObserverAttached || !auth) return
	authObserverAttached = true

	auth.onAuthStateChanged(async (user) => {
		if (user && !user.isAnonymous) {
			setDashboardSignedInState(user)
			await upsertUserProfile(user)
			await loadUserDashboardData(user)
			renderTestimonials(testimonialsData)
			focusDashboardAfterAuthIfRequested()
		} else {
			setDashboardPromptState()
			renderDashboardList(
				authUi.dashboardBookingsList,
				[],
				"Log in to view your appointments.",
			)
			renderDashboardList(
				authUi.dashboardReviewsList,
				[],
				"Log in to view your submitted reviews.",
			)
			renderTestimonials(testimonialsData)
		}
	})
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
		String(a.styleName || "").localeCompare(
			String(b.styleName || ""),
			undefined,
			{
				sensitivity: "base",
			},
		)

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
        <button type="button" class="gallery-save-favorite-btn" data-fav-style-id="${escapeHtml(item.id || "")}" aria-pressed="false">♡ Save</button>
      </div>
    </div>
  `,
		)
		.join("")

	updateFavoriteButtonsUI()
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

	const galleryGrid = document.getElementById("galleryGrid")
	if (galleryGrid) {
		galleryGrid.addEventListener("click", (event) => {
			const favoriteBtn = event.target.closest(".gallery-save-favorite-btn")
			if (!favoriteBtn) return
			event.preventDefault()
			event.stopPropagation()

			const styleId = favoriteBtn.dataset.favStyleId || ""
			const style = galleryData.find(
				(item) => String(item.id || "") === String(styleId),
			)
			if (!style) return

			void toggleFavoriteStyle(style, favoriteBtn)
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

function normalizeBlogItem(item = {}) {
	return {
		id: String(item.id || "").trim(),
		title:
			String(item.title || item.heading || "Untitled Blog").trim() ||
			"Untitled Blog",
		excerpt: String(item.excerpt || item.description || "").trim(),
		imageUrl: String(item.imageUrl || item.image || "").trim(),
		readMoreUrl:
			String(item.readMoreUrl || item.url || "#blog").trim() || "#blog",
		readTime: String(item.readTime || "5 min read").trim() || "5 min read",
		publishDate: item.publishDate || item.date || "",
		createdAt: item.createdAt || null,
		updatedAt: item.updatedAt || null,
	}
}

function formatBlogDate(value) {
	if (!value) return "N/A"
	const text = String(value).trim()
	if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
		const [year, month, day] = text.split("-").map(Number)
		const date = new Date(year, month - 1, day)
		if (!Number.isNaN(date.getTime())) {
			return date.toLocaleDateString(undefined, {
				year: "numeric",
				month: "short",
				day: "numeric",
			})
		}
	}

	const ms = toTimestampMs(value)
	if (!ms) return text
	return new Date(ms).toLocaleDateString(undefined, {
		year: "numeric",
		month: "short",
		day: "numeric",
	})
}

function getBlogSortTime(item = {}) {
	return (
		toTimestampMs(item.updatedAt) ||
		toTimestampMs(item.createdAt) ||
		toTimestampMs(item.publishDate)
	)
}

function sortBlogsList(items = []) {
	return [...items].sort((a, b) => {
		const timeDiff = getBlogSortTime(b) - getBlogSortTime(a)
		if (timeDiff !== 0) return timeDiff
		return String(a.title || "").localeCompare(
			String(b.title || ""),
			undefined,
			{
				sensitivity: "base",
			},
		)
	})
}

function updateBlogScrollButtons() {
	const grid = document.getElementById("blogGrid")
	const prevBtn = document.getElementById("blogPrevBtn")
	const nextBtn = document.getElementById("blogNextBtn")
	if (!grid || !prevBtn || !nextBtn) return

	const hasMoreBlogsThanDefault =
		Array.isArray(blogsData) && blogsData.length > DEFAULT_VISIBLE_BLOGS
	if (!showAllBlogs && hasMoreBlogsThanDefault) {
		prevBtn.disabled = true
		nextBtn.disabled = false
		return
	}

	const canScroll = grid.scrollWidth - grid.clientWidth > 8
	if (!canScroll) {
		prevBtn.disabled = true
		nextBtn.disabled = true
		return
	}

	prevBtn.disabled = grid.scrollLeft <= 2
	nextBtn.disabled = grid.scrollLeft + grid.clientWidth >= grid.scrollWidth - 2
}

function scrollBlogCards(direction = "next") {
	const grid = document.getElementById("blogGrid")
	if (!grid) return

	if (
		!showAllBlogs &&
		Array.isArray(blogsData) &&
		blogsData.length > DEFAULT_VISIBLE_BLOGS
	) {
		showAllBlogs = true
		renderBlogs(blogsData)
		requestAnimationFrame(() => scrollBlogCards(direction))
		return
	}

	const firstCard = grid.querySelector(".blog-card")
	if (!firstCard) return

	const style = getComputedStyle(grid)
	const gap = Number.parseFloat(style.columnGap || style.gap || "24") || 24
	const step =
		Math.max(firstCard.offsetWidth, firstCard.getBoundingClientRect().width) +
		gap
	const delta = direction === "prev" ? -step : step
	const maxLeft = Math.max(0, grid.scrollWidth - grid.clientWidth)
	const targetLeft = Math.min(maxLeft, Math.max(0, grid.scrollLeft + delta))

	if (typeof grid.scrollTo === "function") {
		grid.scrollTo({ left: targetLeft, behavior: "smooth" })
	} else {
		grid.scrollLeft = targetLeft
	}

	window.setTimeout(updateBlogScrollButtons, 240)
}

function renderBlogs(list = blogsData) {
	const grid = document.getElementById("blogGrid")
	const viewAllBtn = document.getElementById("viewAllBlogsBtn")
	const viewLessBtn = document.getElementById("viewLessBlogsBtn")
	const toggleControls = document.getElementById("blogToggleControls")
	const scrollControls = document.getElementById("blogScrollControls")
	if (!grid) return

	const sourceItems =
		Array.isArray(list) && list.length
			? list
			: fallbackBlogsData.map((item, i) => ({
					id: `fallback-blog-${i}`,
					...item,
				}))

	const sortedList = sortBlogsList(sourceItems.map(normalizeBlogItem))
	const shouldCollapse = sortedList.length > DEFAULT_VISIBLE_BLOGS
	const visibleList =
		shouldCollapse && !showAllBlogs
			? sortedList.slice(0, DEFAULT_VISIBLE_BLOGS)
			: sortedList

	grid.innerHTML = visibleList
		.map(
			(blog) => `
    <article class="blog-card">
      <div class="blog-card-image">
        <img
          src="${escapeHtml(blog.imageUrl || BLOG_CARD_IMAGE_FALLBACK)}"
          alt="${escapeHtml(blog.title)}"
          loading="lazy"
          onerror="if(!this.dataset.fallbackApplied){this.dataset.fallbackApplied='true';this.src='${escapeHtml(BLOG_CARD_IMAGE_FALLBACK)}';}"
        />
      </div>
      <div class="blog-card-content">
        <div class="blog-card-meta">
          <span>${escapeHtml(formatBlogDate(blog.publishDate || blog.createdAt))}</span>
          <span>${escapeHtml(blog.readTime || "5 min read")}</span>
        </div>
        <h3>${escapeHtml(blog.title)}</h3>
        <p class="blog-card-excerpt">${escapeHtml(blog.excerpt)}</p>
        <a href="${escapeHtml(blog.readMoreUrl || "#blog")}" class="read-more" target="_blank" rel="noopener">
          Read More
          <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
        </a>
      </div>
    </article>
  `,
		)
		.join("")

	if (toggleControls && viewAllBtn && viewLessBtn) {
		if (!shouldCollapse) {
			toggleControls.classList.add("hidden")
			viewAllBtn.classList.add("hidden")
			viewLessBtn.classList.add("hidden")
		} else {
			toggleControls.classList.remove("hidden")
			if (showAllBlogs) {
				viewAllBtn.classList.add("hidden")
				viewLessBtn.classList.remove("hidden")
			} else {
				viewAllBtn.classList.remove("hidden")
				viewLessBtn.classList.add("hidden")
				grid.scrollTo({ left: 0, behavior: "auto" })
			}
		}
	}

	if (scrollControls) {
		scrollControls.classList.toggle("hidden", visibleList.length < 2)
	}

	requestAnimationFrame(() => {
		updateBlogScrollButtons()
	})
}

function bindBlogScrollControls() {
	const grid = document.getElementById("blogGrid")
	const prevBtn = document.getElementById("blogPrevBtn")
	const nextBtn = document.getElementById("blogNextBtn")

	if (prevBtn) {
		prevBtn.addEventListener("click", () => {
			scrollBlogCards("prev")
		})
	}

	if (nextBtn) {
		nextBtn.addEventListener("click", () => {
			scrollBlogCards("next")
		})
	}

	if (grid) {
		grid.addEventListener("scroll", updateBlogScrollButtons, { passive: true })
		window.addEventListener("resize", updateBlogScrollButtons)
	}
}

function bindBlogToggleControls() {
	const viewAllBtn = document.getElementById("viewAllBlogsBtn")
	const viewLessBtn = document.getElementById("viewLessBlogsBtn")

	const animateBlogsToggle = (nextShowAll, scrollToTop = false) => {
		if (showAllBlogs === nextShowAll) return

		const grid = document.getElementById("blogGrid")

		const commitSwitch = () => {
			showAllBlogs = nextShowAll
			renderBlogs(blogsData)
			if (scrollToTop) {
				document
					.getElementById("blog")
					?.scrollIntoView({ behavior: "smooth", block: "start" })
			}
		}

		if (!grid) {
			commitSwitch()
			return
		}

		if (blogsToggleAnimationTimer) {
			clearTimeout(blogsToggleAnimationTimer)
			blogsToggleAnimationTimer = null
		}

		grid.classList.add("is-switching")
		blogsToggleAnimationTimer = setTimeout(() => {
			commitSwitch()
			requestAnimationFrame(() => {
				grid.classList.remove("is-switching")
			})
			blogsToggleAnimationTimer = null
		}, 220)
	}

	if (viewAllBtn) {
		viewAllBtn.addEventListener("click", () => {
			animateBlogsToggle(true)
		})
	}

	if (viewLessBtn) {
		viewLessBtn.addEventListener("click", () => {
			animateBlogsToggle(false, true)
		})
	}
}

function startBlogsRealtimeListener() {
	if (!firebaseReady || !db) return

	if (typeof blogsRealtimeUnsubscribe === "function") {
		blogsRealtimeUnsubscribe()
		blogsRealtimeUnsubscribe = null
	}

	blogsRealtimeUnsubscribe = db
		.collection("blogs")
		.limit(300)
		.onSnapshot(
			(snapshot) => {
				const docs = snapshot.docs.map((doc) =>
					normalizeBlogItem({ id: doc.id, ...doc.data() }),
				)

				blogsData = docs.length
					? docs
					: fallbackBlogsData.map((item, i) =>
							normalizeBlogItem({ id: `fallback-blog-${i}`, ...item }),
						)

				renderBlogs(blogsData)
			},
			(error) => {
				console.error("Blogs realtime listener failed:", error)
				blogsData = fallbackBlogsData.map((item, i) =>
					normalizeBlogItem({ id: `fallback-blog-${i}`, ...item }),
				)
				renderBlogs(blogsData)
			},
		)
}

function normalizeReviewItem(item = {}) {
	const name =
		String(item.name || "Anonymous Client").trim() || "Anonymous Client"
	const text = String(item.text || "").trim()
	const ratingRaw = Number(item.rating)
	const rating = Number.isFinite(ratingRaw)
		? Math.max(1, Math.min(5, Math.round(ratingRaw)))
		: 5
	const source = String(item.source || "Website").trim() || "Website"
	const service = String(item.service || "").trim()
	const role = service ? `${service} Client` : item.role || "Verified Client"
	const avatar =
		String(item.avatar || "").trim() ||
		name
			.split(" ")
			.map((part) => part[0])
			.join("")
			.slice(0, 2)
			.toUpperCase()

	return {
		id: item.id || "",
		name,
		avatar,
		role,
		text,
		rating,
		source,
		service,
		photoUrl: String(item.photoUrl || "").trim(),
		adminReply: String(item.adminReply || "").trim(),
		verifiedBooking: item.verifiedBooking === true,
		reportsCount: Number(item.reportsCount || 0),
		featured: item.featured === true,
		status: item.status || "approved",
		createdAt: item.createdAt || null,
	}
}

function getReviewSourceIcon(source = "") {
	if (source === "Instagram") {
		return '<rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>'
	}
	if (source === "Facebook") {
		return '<path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>'
	}
	if (source === "Google") {
		return '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>'
	}
	return '<path d="M22 12h-4"/><path d="M6 12H2"/><path d="M12 6V2"/><path d="M12 22v-4"/><circle cx="12" cy="12" r="6"/>'
}

function parseReviewTime(value) {
	if (!value) return 0
	if (typeof value?.toMillis === "function") return value.toMillis()
	if (typeof value === "number" && Number.isFinite(value)) return value
	if (value?.seconds && Number.isFinite(value.seconds))
		return value.seconds * 1000
	const parsed = Date.parse(String(value))
	return Number.isNaN(parsed) ? 0 : parsed
}

function sortReviewsList(list = [], mode = reviewsSortMode) {
	const items = [...list]

	if (mode === "newest") {
		return items.sort(
			(a, b) => parseReviewTime(b.createdAt) - parseReviewTime(a.createdAt),
		)
	}

	if (mode === "highest-rated") {
		return items.sort((a, b) => {
			const ratingDiff = Number(b.rating || 0) - Number(a.rating || 0)
			if (ratingDiff !== 0) return ratingDiff
			if (a.featured !== b.featured) return a.featured ? -1 : 1
			return parseReviewTime(b.createdAt) - parseReviewTime(a.createdAt)
		})
	}

	return items.sort((a, b) => {
		if (a.featured !== b.featured) return a.featured ? -1 : 1
		return parseReviewTime(b.createdAt) - parseReviewTime(a.createdAt)
	})
}

function renderReviewsSummary() {
	const summary = document.getElementById("reviewsSummary")
	if (!summary) return

	const total = testimonialsData.length
	if (!total) {
		summary.textContent = "No approved reviews yet."
		return
	}

	const average =
		testimonialsData.reduce(
			(sum, review) => sum + Number(review.rating || 0),
			0,
		) / total
	summary.textContent = `★ ${average.toFixed(1)} average from ${total} review${total === 1 ? "" : "s"}`
}

function renderTestimonials(list = testimonialsData) {
	const grid = document.getElementById("testimonialsGrid")
	const viewAllBtn = document.getElementById("viewAllReviewsBtn")
	const viewLessBtn = document.getElementById("viewLessReviewsBtn")
	const controls = document.getElementById("reviewsToggleControls")
	if (!grid) return
	const canReportAbuse = isNonGuestSignedIn()
	updateReviewAuthHintVisibility()

	const approvedList =
		Array.isArray(list) && list.length ? list : fallbackTestimonialsData
	const approvedIds = new Set(
		approvedList
			.map((review) => String(review?.id || "").trim())
			.filter(Boolean),
	)
	const pendingDrafts = getReviewDraftsArray()
		.filter((draft) => {
			const draftId = String(draft?.id || "").trim()
			return draftId ? !approvedIds.has(draftId) : true
		})
		.map((draft) =>
			normalizeReviewItem({ ...draft, status: "pending", source: "Website" }),
		)

	// Defensive dedupe by ID in case data from different sources overlaps.
	const dedupedMap = new Map()
	for (const review of [...approvedList, ...pendingDrafts]) {
		const reviewId = String(review?.id || "").trim()
		const dedupeKey = reviewId || `${review.name}__${review.text}`
		if (!dedupedMap.has(dedupeKey)) {
			dedupedMap.set(dedupeKey, review)
		}
	}
	const safeList = Array.from(dedupedMap.values())
	const sortedList = sortReviewsList(safeList)
	const shouldCollapse = sortedList.length > DEFAULT_VISIBLE_REVIEWS
	const visibleList =
		shouldCollapse && !showAllReviews
			? sortedList.slice(0, DEFAULT_VISIBLE_REVIEWS)
			: sortedList

	grid.innerHTML = visibleList
		.map(
			(t) => `
    <div class="testimonial-card">
      <div class="testimonial-stars">
        ${'<svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>'.repeat(t.rating)}
      </div>
      ${t.service ? `<div class="admin-gallery-tags" style="margin-bottom:8px"><span>${escapeHtml(t.service)}</span></div>` : ""}
      ${t.verifiedBooking ? '<div class="admin-gallery-tags" style="margin-bottom:8px"><span>✅ Verified Booking</span></div>' : ""}
      <p class="testimonial-text">"${t.text}"</p>
	      ${t.photoUrl ? `<div class="testimonial-review-photo-wrap"><img src="${escapeHtml(t.photoUrl)}" alt="Review photo" class="testimonial-review-photo" /></div>` : ""}
      ${t.adminReply ? `<p class="testimonial-text" style="font-style:normal;border-left:3px solid var(--primary);padding-left:10px"><strong>Admin Reply:</strong> ${escapeHtml(t.adminReply)}</p>` : ""}
      <div class="testimonial-author">
        <div class="testimonial-avatar">${t.avatar}</div>
        <div class="testimonial-author-info">
          <h4>${t.name}</h4>
          <span>${t.role}</span>
        </div>
      </div>
	      ${
					t.status === "pending"
						? `<div style="margin-top:10px"><div class="admin-booking-actions"><button class="admin-action-btn" data-review-ui-action="edit" data-review-id="${escapeHtml(t.id)}">Edit Pending</button></div><p style="margin-top:8px;font-size:0.78rem;color:var(--text-muted)">Pending reviews can be edited but not deleted.</p></div>`
						: ""
				}
	      ${
					canReportAbuse
						? `<div class="admin-booking-actions" style="margin-top:10px">
	        <button class="admin-action-btn review-report-btn" data-review-ui-action="report" data-review-id="${escapeHtml(t.id)}">Report Abuse</button>
	      </div>`
						: ""
				}
      <div class="testimonial-social">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${getReviewSourceIcon(t.source)}</svg>
      </div>
    </div>
  `,
		)
		.join("")

	if (controls && viewAllBtn && viewLessBtn) {
		if (!shouldCollapse) {
			controls.classList.add("hidden")
			viewAllBtn.classList.add("hidden")
			viewLessBtn.classList.add("hidden")
		} else {
			controls.classList.remove("hidden")
			if (showAllReviews) {
				viewAllBtn.classList.add("hidden")
				viewLessBtn.classList.remove("hidden")
			} else {
				viewAllBtn.classList.remove("hidden")
				viewLessBtn.classList.add("hidden")
			}
		}
	}

	renderReviewsSummary()
}

function bindReviewToggleControls() {
	const viewAllBtn = document.getElementById("viewAllReviewsBtn")
	const viewLessBtn = document.getElementById("viewLessReviewsBtn")

	const animateReviewsToggle = (nextShowAll, scrollToTop = false) => {
		if (showAllReviews === nextShowAll) return

		const grid = document.getElementById("testimonialsGrid")

		const commitSwitch = () => {
			showAllReviews = nextShowAll
			renderTestimonials(testimonialsData)
			if (scrollToTop) {
				document
					.getElementById("testimonials")
					?.scrollIntoView({ behavior: "smooth", block: "start" })
			}
		}

		if (!grid) {
			commitSwitch()
			return
		}

		if (reviewsToggleAnimationTimer) {
			clearTimeout(reviewsToggleAnimationTimer)
			reviewsToggleAnimationTimer = null
		}

		grid.classList.add("is-switching")
		reviewsToggleAnimationTimer = setTimeout(() => {
			commitSwitch()
			requestAnimationFrame(() => {
				grid.classList.remove("is-switching")
			})
			reviewsToggleAnimationTimer = null
		}, 220)
	}

	if (viewAllBtn) {
		viewAllBtn.addEventListener("click", () => {
			animateReviewsToggle(true)
		})
	}

	if (viewLessBtn) {
		viewLessBtn.addEventListener("click", () => {
			animateReviewsToggle(false, true)
		})
	}
}

function bindReviewsSortControls() {
	const reviewsSortSelect = document.getElementById("reviewsSortSelect")
	if (!reviewsSortSelect) return

	reviewsSortSelect.value = reviewsSortMode
	reviewsSortSelect.addEventListener("change", (event) => {
		reviewsSortMode = event.target.value || "featured"
		showAllReviews = false
		renderTestimonials(testimonialsData)
	})
}

async function submitReview(event) {
	event.preventDefault()

	const form = event.currentTarget
	const submitBtn = form?.querySelector('button[type="submit"]')
	const msg = document.getElementById("reviewMessage")

	if (!form || !submitBtn || !msg) return
	if (!isNonGuestSignedIn()) {
		showTimedFormMessage(msg, "error", "🔐 Please log in to submit a review.")
		openAuthModal("signin")
		return
	}

	const name = document.getElementById("reviewName")?.value?.trim() || ""
	const ratingValue = Number(
		document.getElementById("reviewRating")?.value || 0,
	)
	const service = document.getElementById("reviewService")?.value?.trim() || ""
	const text = document.getElementById("reviewText")?.value?.trim() || ""
	const editId = document.getElementById("reviewEditId")?.value?.trim() || ""
	const photoFile = document.getElementById("reviewPhoto")?.files?.[0] || null

	clearFormMessage(msg)
	msg.classList.remove("is-leaving")
	if (reviewMessageTimer) {
		clearTimeout(reviewMessageTimer)
		reviewMessageTimer = null
	}

	if (
		!name ||
		!text ||
		!Number.isFinite(ratingValue) ||
		ratingValue < 1 ||
		ratingValue > 5
	) {
		showTimedFormMessage(
			msg,
			"error",
			"❌ Please provide your name, rating, and review message.",
		)
		return
	}

	if (text.length < 10) {
		showTimedFormMessage(
			msg,
			"error",
			"❌ Please write at least 10 characters so your feedback is useful.",
		)
		return
	}

	if (name.length < 2 || name.length > 80) {
		showTimedFormMessage(
			msg,
			"error",
			"❌ Name must be between 2 and 80 characters.",
		)
		return
	}

	if (text.length > 800) {
		showTimedFormMessage(
			msg,
			"error",
			"❌ Review message is too long (max 800 characters).",
		)
		return
	}

	if (!firebaseReady || !db || !auth) {
		showTimedFormMessage(
			msg,
			"error",
			"⚠️ Reviews service is not configured yet. Add Firebase keys in APP_CONFIG.",
		)
		return
	}

	submitBtn.disabled = true
	submitBtn.textContent = "Submitting..."

	try {
		const activeUid = auth.currentUser?.uid || null

		if (!activeUid) {
			throw new Error("Please log in to submit your review.")
		}

		let photoUrl = ""
		if (photoFile) {
			photoUrl = await uploadImageToCloudinary(photoFile)
		}

		let verifiedBooking = false
		if (service) {
			try {
				const bookingSnapshot = await db
					.collection("bookings")
					.where("uid", "==", activeUid)
					.where("service", "==", service)
					.where("status", "==", "completed")
					.limit(1)
					.get()
				verifiedBooking = !bookingSnapshot.empty
			} catch (verificationError) {
				console.warn(
					"Verified-booking lookup skipped (permission/index issue):",
					verificationError,
				)
				verifiedBooking = false
			}
		}

		const payload = {
			name,
			avatar: name
				.split(" ")
				.map((part) => part[0])
				.join("")
				.slice(0, 2)
				.toUpperCase(),
			text,
			rating: Math.round(ratingValue),
			source: "Website",
			service,
			photoUrl,
			adminReply: "",
			reportsCount: 0,
			verifiedBooking,
			status: "pending",
			featured: false,
			uid: activeUid,
			createdAt: firebase.firestore.FieldValue.serverTimestamp(),
			updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
		}

		if (editId) {
			await db.collection("reviews").doc(editId).set(payload, { merge: true })
			saveReviewDraft({
				id: editId,
				name,
				rating: Math.round(ratingValue),
				service,
				text,
				photoUrl,
			})
		} else {
			const created = await db.collection("reviews").add(payload)
			saveReviewDraft({
				id: created.id,
				name,
				rating: Math.round(ratingValue),
				service,
				text,
				photoUrl,
			})
		}

		form.reset()
		const reviewEditIdInput = document.getElementById("reviewEditId")
		const cancelEditBtn = document.getElementById("cancelReviewEditBtn")
		const submitReviewBtn = document.getElementById("submitReviewBtn")
		if (reviewEditIdInput) reviewEditIdInput.value = ""
		if (cancelEditBtn) cancelEditBtn.style.display = "none"
		if (submitReviewBtn) submitReviewBtn.textContent = "Submit Review"
		showTimedFormMessage(
			msg,
			"success",
			editId
				? "✅ Review updated and is pending approval."
				: "✅ Thank you! Your review was submitted and is pending approval.",
		)
	} catch (error) {
		console.error("Review submit failed:", error)
		const friendlyError =
			error?.code === "permission-denied"
				? "Permission issue while saving review. Please log in again and retry. If it persists, ask admin to deploy latest Firestore rules."
				: error.message || "Failed to submit review. Please try again."
		showTimedFormMessage(msg, "error", `❌ ${friendlyError}`)
	} finally {
		submitBtn.disabled = false
		submitBtn.textContent = "Submit Review"
	}
}

function bindReviewForm() {
	const reviewForm = document.getElementById("reviewForm")
	if (!reviewForm) return
	const cancelEditBtn = document.getElementById("cancelReviewEditBtn")
	const submitReviewBtn = document.getElementById("submitReviewBtn")

	reviewForm.addEventListener("input", () => {
		const msg = document.getElementById("reviewMessage")
		if (!msg) return
		if (reviewMessageTimer) {
			clearTimeout(reviewMessageTimer)
			reviewMessageTimer = null
		}
		hideReviewMessage(msg, false)
	})

	reviewForm.addEventListener("submit", (event) => {
		event.preventDefault()
		event.stopPropagation()
		void submitReview(event)
	})

	if (cancelEditBtn) {
		cancelEditBtn.addEventListener("click", () => {
			reviewForm.reset()
			const reviewEditIdInput = document.getElementById("reviewEditId")
			if (reviewEditIdInput) reviewEditIdInput.value = ""
			cancelEditBtn.style.display = "none"
			if (submitReviewBtn) submitReviewBtn.textContent = "Submit Review"
		})
	}

	const grid = document.getElementById("testimonialsGrid")
	if (grid) {
		grid.addEventListener("click", async (event) => {
			const actionBtn = event.target.closest("button[data-review-ui-action]")
			if (!actionBtn) return

			const action = actionBtn.dataset.reviewUiAction
			const reviewId = actionBtn.dataset.reviewId
			if (!action || !reviewId) return

			if (action === "report") {
				if (!db || !auth || !isNonGuestSignedIn()) {
					showTimedReviewMessage("error", "🔐 Log in to report abuse.")
					return
				}

				try {
					await db
						.collection("reviews")
						.doc(reviewId)
						.set(
							{
								reportsCount: firebase.firestore.FieldValue.increment(1),
								updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
							},
							{ merge: true },
						)
					showTimedReviewMessage("success", "✅ Abuse report submitted.")
				} catch (error) {
					console.error("Report abuse failed:", error)
					showTimedReviewMessage(
						"error",
						"⚠️ Could not submit abuse report right now.",
					)
				}
				return
			}

			const draft = getReviewDraftsArray().find((item) => item.id === reviewId)
			if (!draft) {
				showTimedReviewMessage(
					"error",
					"⚠️ You can only edit your own local pending draft.",
				)
				return
			}

			if (action === "edit") {
				document.getElementById("reviewEditId").value = draft.id
				document.getElementById("reviewName").value = draft.name || ""
				document.getElementById("reviewRating").value = String(
					draft.rating || 5,
				)
				document.getElementById("reviewService").value = draft.service || ""
				document.getElementById("reviewText").value = draft.text || ""
				if (cancelEditBtn) cancelEditBtn.style.display = "inline-flex"
				if (submitReviewBtn) submitReviewBtn.textContent = "Update Review"
				reviewForm.scrollIntoView({ behavior: "smooth", block: "start" })
			}
		})
	}
}

function populateReviewServiceSelect() {
	const select = document.getElementById("reviewService")
	if (!select) return
	select.innerHTML = '<option value="">Select Service (Optional)</option>'
	servicesData.forEach((service) => {
		const option = document.createElement("option")
		option.value = service.name
		option.textContent = service.name
		select.appendChild(option)
	})
}

function startTestimonialsRealtimeListener() {
	if (!firebaseReady || !db) return

	if (typeof testimonialsRealtimeUnsubscribe === "function") {
		testimonialsRealtimeUnsubscribe()
		testimonialsRealtimeUnsubscribe = null
	}

	testimonialsRealtimeUnsubscribe = db
		.collection("reviews")
		.where("status", "==", "approved")
		.limit(120)
		.onSnapshot(
			(snapshot) => {
				const docs = snapshot.docs.map((doc) =>
					normalizeReviewItem({ id: doc.id, ...doc.data() }),
				)

				testimonialsData = docs.length
					? docs
					: fallbackTestimonialsData.map((item, i) =>
							normalizeReviewItem({ id: `fallback-review-${i}`, ...item }),
						)

				renderTestimonials(testimonialsData)
			},
			(error) => {
				console.error("Reviews realtime listener failed:", error)
				testimonialsData = fallbackTestimonialsData.map((item, i) =>
					normalizeReviewItem({ id: `fallback-review-${i}`, ...item }),
				)
				renderTestimonials(testimonialsData)
			},
		)
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
if (!localStorage.getItem("theme")) {
	localStorage.setItem("theme", "dark")
}
let isDark = localStorage.getItem("theme") !== "light"
function applyTheme() {
	document.body.classList.toggle("light-mode", !isDark)
	darkModeToggle.classList.toggle("active", isDark)
}
applyTheme()
applyAccessibilityPrefs(getStoredAccessibilityPrefs())
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
function focusBookingFormCard({ behavior = "smooth", block = "start" } = {}) {
	const bookingForm = document.getElementById("bookingForm")
	const bookingSection = document.getElementById("booking")
	const bookingSuccess = document.getElementById("bookingSuccess")
	if (!bookingForm && !bookingSection) return

	if (bookingForm && bookingForm.style.display === "none") {
		bookingForm.style.display = "block"
	}
	if (bookingSuccess && bookingSuccess.style.display !== "none") {
		bookingSuccess.style.display = "none"
	}

	const target =
		bookingForm && bookingForm.style.display !== "none"
			? bookingForm
			: bookingSection

	target?.scrollIntoView({ behavior, block })

	if (target === bookingForm) {
		bookingForm.classList.remove("booking-form--focus-flash")
		// Force reflow so the animation can replay on repeated taps
		void bookingForm.offsetWidth
		bookingForm.classList.add("booking-form--focus-flash")

		setTimeout(() => {
			bookingForm.classList.remove("booking-form--focus-flash")
		}, 1600)
	}
}

function selectService(name) {
	document.getElementById("serviceSelect").value = name
	focusBookingFormCard({ behavior: "smooth", block: "center" })
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

	clearFormMessage(msg)

	if (!firebaseReady || !db || !auth) {
		showTimedFormMessage(
			msg,
			"error",
			"⚠️ Booking service is not configured yet. Add Firebase keys in APP_CONFIG.",
		)
		return
	}

	btn.classList.add("loading")
	btn.disabled = true
	btn.textContent = "Processing..."
	;(async () => {
		try {
			const signedInUser = auth.currentUser && !auth.currentUser.isAnonymous
			let activeUid = signedInUser ? auth.currentUser.uid : null

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
					email: String(data.email || "")
						.trim()
						.toLowerCase(),
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
			const bookingSuccess = document.getElementById("bookingSuccess")
			bookingSuccess.style.display = "block"
			showTimedFormMessage(
				msg,
				"success",
				"✅ Booking confirmed and saved in realtime!",
			)

			bookingSuccess.setAttribute("tabindex", "-1")
			bookingSuccess.scrollIntoView({ behavior: "smooth", block: "center" })
			bookingSuccess.focus({ preventScroll: true })

			setPostBookingPromptVisible(Boolean(auth.currentUser?.isAnonymous))
			if (signedInUser && activeUid) {
				await upsertUserProfile(auth.currentUser, {
					phone: data.phone || "",
				})
				await loadUserDashboardData(auth.currentUser)
			}

			handleAvailabilityWatch()
		} catch (error) {
			console.error("Booking failed:", error)
			showTimedFormMessage(
				msg,
				"error",
				`❌ ${error.message || "Booking failed. Please try again."}`,
			)
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
	clearFormMessage(document.getElementById("bookingMessage"))
	setPostBookingPromptVisible(false)
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

	const lightboxFavoriteBtn = document.getElementById("lightboxFavoriteBtn")
	if (lightboxFavoriteBtn) {
		lightboxFavoriteBtn.dataset.favStyleId = String(item.id || "")
		setFavoriteButtonState(lightboxFavoriteBtn, isStyleFavorited(item))
	}
}

document
	.getElementById("lightboxFavoriteBtn")
	?.addEventListener("click", () => {
		const visible = getVisibleGalleryData()
		if (!visible.length) return
		const safeIndex =
			((currentLightboxIndex % visible.length) + visible.length) %
			visible.length
		const item = visible[safeIndex]
		if (!item) return
		const lightboxFavoriteBtn = document.getElementById("lightboxFavoriteBtn")
		void toggleFavoriteStyle(item, lightboxFavoriteBtn)
	})

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
	if (
		e.key === "Escape" &&
		authUi.manageAccountModal?.classList.contains("active")
	) {
		closeManageAccountModal()
		return
	}

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
document
	.getElementById("contactForm")
	?.addEventListener("submit", async function (e) {
		e.preventDefault()

		const form = this
		const submitBtn = this.querySelector('button[type="submit"]')
		const msg = document.getElementById("contactFormMessage")

		if (submitBtn) {
			submitBtn.disabled = true
			submitBtn.textContent = "Sending..."
		}

		if (msg) clearFormMessage(msg)

		try {
			if (!firebaseReady || !db || !auth) {
				throw new Error(
					"Contact service is not ready yet. Please wait a moment and try again.",
				)
			}

			let activeUid = auth.currentUser?.uid || null
			if (!activeUid) {
				try {
					const userCredential = await auth.signInAnonymously()
					activeUid = userCredential?.user?.uid || auth.currentUser?.uid || null
				} catch (authError) {
					throw new Error(getFriendlyAuthError(authError))
				}
			}

			if (!activeUid) {
				throw new Error(
					"Unable to authenticate contact session. Please refresh and try again.",
				)
			}

			const payload = {
				name: String(
					document.getElementById("contactName")?.value || "",
				).trim(),
				email: String(
					document.getElementById("contactEmail")?.value || "",
				).trim(),
				subject: String(
					document.getElementById("contactSubject")?.value || "",
				).trim(),
				message: String(
					document.getElementById("contactMessage")?.value || "",
				).trim(),
				status: "new",
				uid: activeUid,
				createdAt: firebase.firestore.FieldValue.serverTimestamp(),
				updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
			}

			if (
				!payload.name ||
				!payload.email ||
				!payload.subject ||
				!payload.message
			) {
				throw new Error("Please fill in all contact fields before sending.")
			}

			await db.collection("contactMessages").add(payload)

			form.reset()
			showContactSuccessPopup()
			if (msg) {
				showTimedFormMessage(msg, "success", "✅ Message sent successfully.")
			}
		} catch (error) {
			console.error("Contact form submit failed:", error)
			if (msg) {
				showTimedFormMessage(
					msg,
					"error",
					`❌ ${error.message || "Failed to send message. Please try again."}`,
				)
			}
		} finally {
			if (submitBtn) {
				submitBtn.disabled = false
				submitBtn.textContent = "Send Message"
			}
		}
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
		const href = this.getAttribute("href")

		if (href === "#booking") {
			e.preventDefault()
			focusBookingFormCard({ behavior: "smooth", block: "center" })
			return
		}

		const target = document.querySelector(href)
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

// ============ HEADER LOGO 3D CUBE FLIP ROTATION ============
function initAnimatedHeaderLogo() {
	const logoCube = document.querySelector("#header .logo .logo-cube")
	const cubeTrack = document.getElementById("logoCubeTrack")
	const logoImage = document.getElementById("logoCubeImage")
	if (!logoCube || !cubeTrack || !logoImage) return

	const logoImages = [
		"IMG/logo.png",
		"IMG/logo 2.jpg",
		"IMG/logo 3.png",
		"IMG/logo 4.png",
		"IMG/logo 5.png",
	]

	let imageIndex = 0
	let isTransitioning = false
	const swapIntervalMs = 5000
	const halfFlipMs = 560
	const totalTransitionMs = 1400

	logoImages.forEach((src) => {
		const preload = new Image()
		preload.src = src
	})

	logoImage.src = logoImages[imageIndex]

	const runLogoFlip = () => {
		if (isTransitioning) return
		isTransitioning = true

		logoCube.classList.add("is-morphing")
		logoImage.classList.remove("is-flip-in")
		logoImage.classList.add("is-flip-out")

		window.setTimeout(() => {
			imageIndex = (imageIndex + 1) % logoImages.length
			logoImage.src = logoImages[imageIndex]
			logoImage.classList.remove("is-flip-out")
			logoImage.classList.add("is-flip-in")

			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					logoImage.classList.remove("is-flip-in")
				})
			})
		}, halfFlipMs)

		window.setTimeout(() => {
			logoCube.classList.remove("is-morphing")
			isTransitioning = false
		}, totalTransitionMs)
	}

	window.setInterval(runLogoFlip, swapIntervalMs)
}

// ============ INITIALIZE ============
initAuthUiRefs()
setAuthMode("signin")
setDashboardPromptState()
bindAuthUiEvents()
renderServices()
galleryData = fallbackGalleryData.map((item, i) =>
	normalizeGalleryItem({ id: `fallback-${i}`, ...item }),
)
renderGalleryFilters()
renderFeaturedStyles()
renderGallery()
wireGalleryInteractions()
blogsData = fallbackBlogsData.map((item, i) =>
	normalizeBlogItem({ id: `fallback-blog-${i}`, ...item }),
)
renderBlogs(blogsData)
bindBlogScrollControls()
bindBlogToggleControls()
document
	.getElementById("viewAllGallery")
	?.addEventListener("click", toggleGalleryView)
renderTestimonials(testimonialsData.map((item) => normalizeReviewItem(item)))
bindReviewsSortControls()
bindReviewToggleControls()
bindReviewForm()
updateReviewSubmissionVisibility()
populateReviewServiceSelect()
populateServiceSelect()
populateTimeSlots()
initAnimatedHeaderLogo()

// Initialize booking integrations
initializeFirebaseServices().then(async () => {
	await handleGoogleRedirectResultOnLoad()

	const stylistSelect = document.getElementById("stylistSelect")
	const dateInput = document.getElementById("datePicker")

	if (stylistSelect) {
		stylistSelect.addEventListener("change", handleAvailabilityWatch)
	}
	if (dateInput) {
		dateInput.addEventListener("change", handleAvailabilityWatch)
	}

	startGalleryRealtimeListener()
	startBlogsRealtimeListener()
	startTestimonialsRealtimeListener()
})
