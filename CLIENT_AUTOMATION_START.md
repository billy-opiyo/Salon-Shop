# Client Automation Start Guide

Use this project as a reusable salon/business template. The goal is to sell the same system to multiple clients without coding from scratch each time.

## Main files you edit per client

```txt
public/client-config.js       # Public website/admin branding, contacts, theme, Firebase web config
functions/client-config.js    # Backend business name, timezone, Cloudinary upload folder
```

> ⚠️ Do **not** put private API keys inside `public/client-config.js`.
> Resend, WhatsApp Cloud API, and Cloudinary private credentials are Firebase Function secrets.

## Fastest new-client flow

### 1) Create/copy a client version

Use a new branch, new folder, or copied project for each client.

### 2) Run the generator

Interactive mode:

```bash
node scripts/new-client.js
```

Or pass values directly:

```bash
node scripts/new-client.js --name "Glam House Spa" --slug glam-house-spa --phone "+254700000000" --email "info@glamhouse.co.ke"
```

The generator updates:

- `public/client-config.js`
- `functions/client-config.js`

It updates the main constants in `public/client-config.js`:

```js
const businessName = "Glam House Spa"
const businessSlug = "glam-house-spa"
const businessShortNameHtml = "GLAM<br />HOUSE SPA"
const businessLogoTextHtml = "✨ GLAM HOUSE SPA"
const phonePrimary = "+254700000000"
const phonePrimaryHref = "tel:+254700000000"
const whatsappUrl = "https://wa.me/254700000000"
const emailPrimary = "info@glamhouse.co.ke"
const emailBookings = "bookings@glamhouse.co.ke"
const formSubmitEmail = "info@glamhouse.co.ke"
```

It also updates `functions/client-config.js`:

```js
module.exports = {
	businessName: "Glam House Spa",
	teamName: "Glam House Spa Team",
	timezone: "Africa/Nairobi",
	utcOffsetHours: 3,
	cloudinaryFolder: "glam-house-spa/uploads",
}
```

---

## `public/client-config.js` explained

This is the main frontend white-label config. It has complete sections for the website and admin.

### 1) Firebase web config

At the top:

```js
const firebaseConfig = {
	apiKey: "...",
	authDomain: "...",
	projectId: "...",
	storageBucket: "...",
	messagingSenderId: "...",
	appId: "...",
	measurementId: "...",
}
```

Replace this with the client Firebase project's **web app config**.

### 2) Client identity constants

Edit these first:

```js
const businessName = "Royal Braids"
const businessSlug = "royal-braids"
const businessShortNameHtml = "ROYAL<br />BRAIDS"
const businessLogoTextHtml = "👑 ROYAL BRAIDS"
const country = "Kenya"
const city = "Nairobi"
const timezone = "Africa/Nairobi"
const locale = "en-KE"
const currency = "KES"
```

### 3) Contact constants

```js
const phonePrimary = "+254 700 123 456"
const phonePrimaryHref = "tel:+254700123456"
const phoneSecondary = "+254 711 987 654"
const phoneSecondaryHref = "tel:+254711987654"
const whatsappUrl = "https://wa.me/254700123456"
const emailPrimary = "info@royalbraids.ke"
const emailBookings = "bookings@royalbraids.ke"
const formSubmitEmail = "billyopiyo597@gmail.com"
const cloudinaryGalleryFolder = `${businessSlug}/gallery`
```

### 4) Complete config sections inside `window.CLIENT_CONFIG`

`public/client-config.js` contains these sections:

- `client` — name, slug, country, city, timezone, locale, currency.
- `brand` — business name, admin title, logo text, logo/favicon paths, hero content, footer text.
- `seo` — page title, meta description, keywords, Open Graph title/image.
- `contact` — phones, emails, contact form target, location, map, opening hours.
- `social` — Instagram, Facebook, X/Twitter, TikTok, WhatsApp.
- `theme` — brand colors applied by `public/JS/apply-client-config.js`.
- `media` — reusable logo/favicon/hero/gallery folder references.
- `integrations` — Firebase web config, Cloudinary folder, WhatsApp public URL, Firebase secret names.
- `features` — feature flags for booking/reviews/blog/gallery/waitlist/notifications.
- `app` — compatibility bridge used by existing scripts.

Do **not** remove `app`. `public/JS/admin.js` reads `window.APP_CONFIG`, and `public/client-config.js` creates it from `window.CLIENT_CONFIG.app`.

---

## `functions/client-config.js` explained

This is the backend white-label config used by Cloud Functions:

```js
module.exports = {
	businessName: "Royal Braids",
	teamName: "Royal Braids Team",
	timezone: "Africa/Nairobi",
	utcOffsetHours: 3,
	cloudinaryFolder: "royal-braids/uploads",
}
```

Used by `functions/index.js` for:

- email subject/body branding
- WhatsApp message branding
- reminder schedule timezone
- Cloudinary upload folder defaults

---

## API keys and secrets

### Where code declares secrets

File: `functions/index.js`

Secret names currently used:

```txt
RESEND_API_KEY
RESEND_FROM_EMAIL
WHATSAPP_CLOUD_ACCESS_TOKEN
WHATSAPP_CLOUD_PHONE_NUMBER_ID
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
```

### Where real values are edited

Use Firebase CLI per client project:

```bash
firebase use CLIENT_FIREBASE_PROJECT_ID

firebase functions:secrets:set RESEND_API_KEY
firebase functions:secrets:set RESEND_FROM_EMAIL

firebase functions:secrets:set WHATSAPP_CLOUD_ACCESS_TOKEN
firebase functions:secrets:set WHATSAPP_CLOUD_PHONE_NUMBER_ID

firebase functions:secrets:set CLOUDINARY_CLOUD_NAME
firebase functions:secrets:set CLOUDINARY_API_KEY
firebase functions:secrets:set CLOUDINARY_API_SECRET
```

You can confirm secrets with:

```bash
firebase functions:secrets:list
```

---

## Final client deployment checklist

1. Run `node scripts/new-client.js`.
2. Update `public/client-config.js` fully:
   - Firebase web config
   - logo/favicon/hero image paths
   - contact/location/map/hours
   - SEO text
   - social links
   - theme colors
3. Update `functions/client-config.js` if needed:
   - timezone
   - UTC offset
   - Cloudinary backend folder
4. Add client images inside `public/IMG/`.
5. Set Firebase secrets.
6. Deploy:

```bash
firebase use CLIENT_FIREBASE_PROJECT_ID
firebase deploy --only firestore:rules
firebase deploy --only functions
firebase deploy --only hosting:main-site
```

---

## Quick validation commands

Before deploying, run:

```bash
node --check public/client-config.js
node --check functions/client-config.js
node --check scripts/new-client.js
node --check functions/index.js
node --check public/JS/apply-client-config.js
node --check public/JS/admin.js
```

If all pass, the config files are valid JavaScript.
