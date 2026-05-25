// Complete white-label client configuration.
// ------------------------------------------------------------
// For a new client, edit this file instead of hunting through HTML/JS.
// Safe to expose here: branding, contact details, public social links,
// Firebase WEB config, public Cloudinary folder name.
// Never put private API secrets here. Resend/WhatsApp/Cloudinary secrets
// are set with Firebase Functions secrets; see CLIENT_AUTOMATION_START.md.
// ------------------------------------------------------------
;(function () {
	const firebaseConfig = {
		apiKey: "AIzaSyAyVcRjG55o6nwaXpRzZyt2BtX2RamGEqg",
		authDomain: "services-website-billydev.firebaseapp.com",
		projectId: "services-website-billydev",
		storageBucket: "services-website-billydev.firebasestorage.app",
		messagingSenderId: "712913782427",
		appId: "1:712913782427:web:e997553d71bd9a1f6a283e",
		measurementId: "G-B6LVQBEN3G",
	}

	const businessName = "Royal Braids"
	const businessSlug = "royal-braids"
	const businessShortNameHtml = "ROYAL<br />BRAIDS"
	const businessLogoTextHtml = "👑 ROYAL BRAIDS"
	const country = "Kenya"
	const city = "Nairobi"
	const timezone = "Africa/Nairobi"
	const locale = "en-KE"
	const currency = "KES"

	const phonePrimary = "+254 700 123 456"
	const phonePrimaryHref = "tel:+254700123456"
	const phoneSecondary = "+254 711 987 654"
	const phoneSecondaryHref = "tel:+254711987654"
	const whatsappUrl = "https://wa.me/254700123456"
	const emailPrimary = "info@royalbraids.ke"
	const emailBookings = "bookings@royalbraids.ke"
	const formSubmitEmail = "billyopiyo597@gmail.com"
	const cloudinaryGalleryFolder = `${businessSlug}/gallery`

	window.CLIENT_CONFIG = {
		client: {
			name: businessName,
			slug: businessSlug,
			country,
			city,
			timezone,
			locale,
			currency,
		},

		brand: {
			businessName,
			adminTitle: `${businessName} Admin`,
			shortNameHtml: businessShortNameHtml,
			footerLogoHtml: businessLogoTextHtml,
			logoSrc: "IMG/logo.png",
			favicon: "IMG/Royal Braids logo.png",
			logoAlt: `${businessName} rotating logo`,
			heroImage: "IMG/1000_F_595420115_RZi6MAsq90qVRMfFz37ZKBianocAltUu.jpg",
			heroImageAlt: "African Hair Braiding Salon",
			heroSubtitle: "Premium African Hair Braiding & Beauty",
			heroTitleHtml: "Celebrate Your Crown with <span>Beautiful Braids</span>",
			heroDescription:
				"From signature braids, hair services and flawless twists to glowing beauty spa rituals, precision nails, radiant makeup, barber grooming, eyebrows & lash enhancements, and bridal-ready glam—step into a full beauty experience crafted to make you shine.",
			footerDescription:
				"Nairobi’s premier beauty destination for braids and beyond—offering expert hair styling, spa indulgence, nail artistry, makeup, barber grooming, lash enhancement, wellness care, and unforgettable bridal/event transformations.",
			copyright: `© 2026 ${businessName}. All rights reserved.`,
			craftedBy: `Crafted with ❤️ in ${city}, ${country}`,
		},

		seo: {
			title: `${businessName} | Premium African Hair Braiding Salon`,
			description:
				"Premium African Hair Braiding & Salon in Nairobi offering luxury braiding, and hair treatments. Book online today.",
			keywords:
				"Saloonist Nairobi, Salon Westlands, Braids Twists Kenya, Royal Braids",
			ogTitle: `${businessName} | Premium African Hair Braiding & Salon`,
			ogImage: "IMG/logo.png",
		},

		contact: {
			phonePrimary,
			phonePrimaryHref,
			phoneSecondary,
			phoneSecondaryHref,
			emailPrimary,
			emailPrimaryHref: `mailto:${emailPrimary}`,
			emailBookings,
			emailBookingsHref: `mailto:${emailBookings}`,
			formSubmitEmail,
			formSubject: `New Contact Message - ${businessName}`,
			locationShort: "Westlands, Nairobi",
			addressHtml:
				"Westlands Shopping Centre, 2nd Floor<br />Waiyaki Way, Nairobi, Kenya",
			mapEmbedUrl:
				"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.8199!2d36.8075!3d-1.2644!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f17390b2f4643%3A0x4b25b087296c88f7!2sWestlands%2C+Nairobi!5e0!3m2!1sen!2ske!4v1",
			weekdayHours: "8:00 AM - 8:00 PM",
			saturdayHours: "9:00 AM - 7:00 PM",
			sundayHours: "10:00 AM - 5:00 PM",
			publicHolidayHours: "10:00 AM - 4:00 PM",
			footerWeekdayHours: "Mon-Fri: 8AM - 8PM",
			footerWeekendHours: "Sat-Sun: 9AM - 7PM",
		},

		social: {
			instagram: "https://www.instagram.com",
			facebook: "https://www.facebook.com",
			twitter: "https://x.com",
			tiktok: "https://www.tiktok.com",
			whatsapp: whatsappUrl,
		},

		theme: {
			primary: "#C8963E",
			primaryDark: "#A6792D",
			primaryLight: "#E8C27A",
			accentPurple: "#6B2E7A",
			accentPink: "#B84E7A",
		},

		media: {
			logoSrc: "IMG/logo.png",
			favicon: "IMG/Royal Braids logo.png",
			heroImage: "IMG/1000_F_595420115_RZi6MAsq90qVRMfFz37ZKBianocAltUu.jpg",
			galleryFolder: cloudinaryGalleryFolder,
		},

		integrations: {
			firebase: firebaseConfig,
			cloudinaryFolder: cloudinaryGalleryFolder,
			whatsappPublicUrl: whatsappUrl,
			formSubmitProvider: "formsubmit.co",
			firebaseSecretNames: {
				resendApiKey: "RESEND_API_KEY",
				resendFromEmail: "RESEND_FROM_EMAIL",
				whatsappAccessToken: "WHATSAPP_CLOUD_ACCESS_TOKEN",
				whatsappPhoneNumberId: "WHATSAPP_CLOUD_PHONE_NUMBER_ID",
				cloudinaryCloudName: "CLOUDINARY_CLOUD_NAME",
				cloudinaryApiKey: "CLOUDINARY_API_KEY",
				cloudinaryApiSecret: "CLOUDINARY_API_SECRET",
			},
		},

		features: {
			bookingEnabled: true,
			reviewsEnabled: true,
			blogEnabled: true,
			galleryEnabled: true,
			waitlistEnabled: true,
			whatsappNotificationsEnabled: true,
			emailNotificationsEnabled: true,
		},

		app: {
			firebase: firebaseConfig,
			cloudinaryFolder: cloudinaryGalleryFolder,
			businessName,
			businessSlug,
			timezone,
			locale,
			currency,
		},
	}

	// Existing app/admin scripts already read APP_CONFIG, so keep this bridge.
	window.APP_CONFIG = window.CLIENT_CONFIG.app
})()
