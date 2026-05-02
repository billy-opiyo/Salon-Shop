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

const galleryData = [
	{
		img: "IMG/box-braids-hairstyles-1x1-1.jpg",
		title: "Box Braids",
		stylist: "Fatima Hassan",
		beforeAfter: false,
	},
	{
		img: "IMG/knotless braids.jpg",
		title: "Knotless Braids",
		stylist: "Zainab Mohamed",
		beforeAfter: true,
	},
	{
		img: "IMG/black-cornrows.webp",
		title: "Cornrows Design",
		stylist: "Grace Wanjiku",
	},
	{
		img: "IMG/fulan-braids.jpg",
		title: "Fulani Braids",
		stylist: "Amina Diallo",
	},
	{
		img: "IMG/Senegalese_Twist.webp",
		title: "Senegalese Twists",
		stylist: "Fatima Hassan",
	},
	{
		img: "IMG/passion-twists.webp",
		title: "Passion Twists",
		stylist: "Zainab Mohamed",
		beforeAfter: true,
	},
	{
		img: "IMG/goddess-braids.webp",
		title: "Goddess Braids",
		stylist: "Grace Wanjiku",
	},
	{
		img: "IMG/Lemonade_Braids.webp",
		title: "Lemonade Braids",
		stylist: "Amina Diallo",
	},
	{
		img: "IMG/braiding trends.jpg",
		title: "Braiding Trends",
		stylist: "Fatima Hassan",
		beforeAfter: false,
	},
	{
		img: "IMG/keeping box braids.jpg",
		title: "Box Braids Care",
		stylist: "Zainab Mohamed",
		beforeAfter: false,
	},
	{
		img: "IMG/natural hair care.webp",
		title: "Natural Hair Care",
		stylist: "Grace Wanjiku",
		beforeAfter: false,
	},
	{
		img: "IMG/twist-braids.jpg",
		title: "Twist Braids",
		stylist: "Amina Diallo",
		beforeAfter: false,
	},
]

let showAllGallery = false

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

function renderGallery() {
	const grid = document.getElementById("galleryGrid")
	const dataToShow = showAllGallery ? galleryData : galleryData.slice(0, 8)
	grid.innerHTML = dataToShow
		.map(
			(g, i) => `
    <div class="gallery-item" onclick="openLightbox(${i})" style="animation-delay: ${i * 0.1}s">
      <img src="${g.img}" alt="${g.title}" loading="lazy">
      <div class="gallery-overlay">
        <h4>${g.title}</h4>
        <p>by ${g.stylist}</p>
        ${g.beforeAfter ? '<span class="before-after">Before & After</span>' : ""}
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
	button.textContent = showAllGallery ? "View Less Braids" : "View All Braids"
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
	const btn = document.getElementById("submitBtn")
	const msg = document.getElementById("bookingMessage")

	btn.classList.add("loading")
	btn.textContent = "Processing..."

	setTimeout(() => {
		btn.classList.remove("loading")
		this.style.display = "none"
		document.getElementById("bookingSuccess").style.display = "block"

		msg.className = "form-message success"
		msg.textContent = "✅ Booking confirmed! Check your email for details."
		msg.style.display = "block"
	}, 1500)
})

function resetBooking() {
	document.getElementById("bookingForm").reset()
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
let currentLightboxIndex = 0
const lightbox = document.getElementById("lightbox")
const lightboxImg = document.getElementById("lightboxImg")
const lightboxCaption = document.getElementById("lightboxCaption")

function openLightbox(index) {
	currentLightboxIndex = index
	updateLightbox()
	lightbox.classList.add("active")
	document.body.style.overflow = "hidden"
}

function updateLightbox() {
	const item = galleryData[currentLightboxIndex]
	lightboxImg.src = item.img.replace("w=600", "w=1200")
	lightboxCaption.textContent = `${item.title} — by ${item.stylist}`
}

document.getElementById("lightboxClose").addEventListener("click", () => {
	lightbox.classList.remove("active")
	document.body.style.overflow = ""
})

document.getElementById("lightboxPrev").addEventListener("click", () => {
	currentLightboxIndex =
		(currentLightboxIndex - 1 + galleryData.length) % galleryData.length
	updateLightbox()
})

document.getElementById("lightboxNext").addEventListener("click", () => {
	currentLightboxIndex = (currentLightboxIndex + 1) % galleryData.length
	updateLightbox()
})

lightbox.addEventListener("click", (e) => {
	if (e.target === lightbox) {
		lightbox.classList.remove("active")
		document.body.style.overflow = ""
	}
})

document.addEventListener("keydown", (e) => {
	if (!lightbox.classList.contains("active")) return
	if (e.key === "Escape") {
		lightbox.classList.remove("active")
		document.body.style.overflow = ""
	}
	if (e.key === "ArrowLeft") {
		currentLightboxIndex =
			(currentLightboxIndex - 1 + galleryData.length) % galleryData.length
		updateLightbox()
	}
	if (e.key === "ArrowRight") {
		currentLightboxIndex = (currentLightboxIndex + 1) % galleryData.length
		updateLightbox()
	}
})

// ============ NEWSLETTER ============
document
	.getElementById("newsletterForm")
	.addEventListener("submit", function (e) {
		e.preventDefault()
		const msg = document.getElementById("newsletterMessage")
		const input = this.querySelector("input")

		msg.className = "form-message success"
		msg.textContent = "🎉 Welcome aboard! Check your inbox for a welcome email."
		msg.style.display = "block"
		input.value = ""

		setTimeout(() => {
			msg.style.display = "none"
		}, 5000)
	})

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
renderGallery()
document
	.getElementById("viewAllGallery")
	.addEventListener("click", toggleGalleryView)
renderTestimonials()
populateServiceSelect()
populateTimeSlots()
