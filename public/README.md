# Royal Braids (Salon Shop)

Production-ready Firebase salon platform for **Royal Braids** with:

- Public website (`public/index.html`) for services, gallery, booking, reviews, blog, and contact
- Client authentication + personal dashboard (appointments, reviews, favorites)
- Admin console (`public/admin.html`) for bookings, gallery, blogs, reviews, and messages
- Firestore realtime data pipelines
- Cloud Function automation for booking confirmation emails via Resend

---

## Table of Contents

1. [Project Summary](#1-project-summary)
2. [Latest Project Changes (Current State)](#2-latest-project-changes-current-state)
3. [Tech Stack](#3-tech-stack)
4. [Project Structure](#4-project-structure)
5. [Runtime Architecture](#5-runtime-architecture)
6. [Public-Site Features](#6-public-site-features)
7. [Client Auth + Dashboard Features](#7-client-auth--dashboard-features)
8. [Admin Features](#8-admin-features)
9. [Firestore Data Model](#9-firestore-data-model)
10. [Security Model (`firestore.rules`)](#10-security-model-firestorerules)
11. [Cloud Functions](#11-cloud-functions)
12. [Local Setup](#12-local-setup)
13. [Deployment](#13-deployment)
14. [Important Notes](#14-important-notes)
15. [Troubleshooting](#15-troubleshooting)

---

## 1. Project Summary

This project is built to:

1. Showcase salon services, styles, and content dynamically.
2. Accept online bookings with strict anti-double-booking logic.
3. Let clients authenticate and track their own data (dashboard + favorites).
4. Give admins one panel to manage all operational content and customer pipelines.
5. Enforce security through Firebase Auth + strict Firestore rules.

---

## 2. Latest Project Changes (Current State)

The README now reflects **current implementation**, including:

- Added **Blogs module** end-to-end:
  - Public blog rendering with realtime Firestore sync and fallback content
  - Admin blog CRUD (create/edit/delete), image uploads, date/read-time metadata
- Added **Client Auth + Dashboard** module:
  - Email/password register/login, forgot-password
  - Continue-as-guest flow
  - Dashboard with recent bookings, reviews, profile info, and favorite styles
- Added **Favorites system**:
  - Save/unsave styles from gallery/lightbox
  - Stored under `users/{uid}/favorites`
  - Dashboard management actions (book/remove)
- Upgraded **Gallery management**:
  - Filter chips, sorting, featured strips (Trending + Most Booked)
  - Before/after lightbox comparison
  - Admin live preview + publish checklist/progress meter
- Upgraded **Review workflow**:
  - Public display pulls approved reviews only
  - Review submission creates pending docs
  - Local pending draft edit UX
  - Abuse report increments `reportsCount`
  - Admin moderation (approve/reject/pending, feature, edit text, reply, delete)
- Upgraded **Contact workflow**:
  - Firestore message pipeline with statuses (`new`, `read`, `resolved`)
  - Admin message sorting/status lifecycle/delete
  - Contact success popup/toast
- Upgraded **Booking workflow**:
  - Realtime slot availability via `bookingSlots`
  - Transactional slot locking + booking write
  - Cancel + release slot action in admin (transaction)
- Added/updated **Cloud Function email automation**:
  - On booking create, sends confirmation email through Resend
  - Writes send status fields (`emailStatus`, timestamps, errors)
- Added **Manage Account + Delete Account confirmation modal UI** on the public app:
  - New account settings sections in `index.html`/`style.css` for profile, security, preferences, and account deletion
  - Includes UI elements for avatar upload, password strength checks, accessibility/notification preferences, and a dedicated delete-confirm dialog
  - Current state: markup + styling are present; JS wiring for full runtime behavior is still pending

---

## 3. Tech Stack

### Frontend

- HTML + CSS + Vanilla JavaScript
- Public script: `public/JS/script.js`
- Admin script: `public/JS/admin.js`

### Firebase

- Firebase Hosting (serves `public/`)
- Firebase Authentication (email/password + anonymous)
- Cloud Firestore
- Firestore Security Rules (`firestore.rules`)
- App Check support (configured in public/admin pages)

### Media + Automation

- Cloudinary unsigned uploads (booking/gallery/review/blog images)
- Firebase Cloud Functions (`functions/index.js`)
- Resend transactional email API

---

## 4. Project Structure

```txt
.
├── firebase.json
├── .firebaserc
├── firestore.rules
├── functions/
│   ├── index.js
│   └── package.json
└── public/
    ├── index.html
    ├── admin.html
    ├── README.md
    ├── CSS/style.css
    ├── JS/script.js
    ├── JS/admin.js
    └── IMG/
```

---

## 5. Runtime Architecture

### Public App (`index.html` + `script.js`)

1. Initializes Firebase/Auth/Firestore/App Check.
2. Renders fallback content first.
3. Starts realtime listeners for:
   - `galleryStyles`
   - `blogs`
   - approved `reviews`
   - `bookingSlots` availability by selected date/stylist
4. Handles booking, review submit, favorites, and contact flows.

### Client Dashboard Runtime

- Authenticated clients get dashboard data from:
  - `bookings`
  - `reviews`
  - `users/{uid}/favorites`
- User profile is upserted in `users/{uid}`.

### Admin App (`admin.html` + `admin.js`)

1. Admin email/password login.
2. Allowed-email gate via `APP_CONFIG.admin.allowedEmails`.
3. Realtime listeners across:
   - `bookings`
   - `galleryStyles`
   - `blogs`
   - `reviews`
   - `contactMessages`

### Backend Automation

- Cloud Function triggers on new booking doc.
- Sends confirmation email via Resend.
- Writes delivery status metadata back to same booking doc.

---

## 6. Public-Site Features

### Services

- JS-driven services catalog + category tabs
- “Book This Service” quick-fill action

### Gallery

- Firestore realtime gallery with fallback dataset
- Filters: length, size, style type
- Sorting: recommended/name/date variants
- Featured rails: Trending Braids + Most Booked Styles
- View All/View Less controls
- Lightbox with prev/next/keyboard/escape and before-after view
- Save-style button (favorites)

### Booking

- Required validation + optional inspiration image upload
- Date minimum restriction (no past bookings)
- Realtime slot availability from `bookingSlots`
- Transactional booking write:
  - checks slot
  - locks slot (`taken: true`)
  - creates booking doc with `status: "confirmed"`

### Reviews

- Public reviews list shows approved reviews only
- Sorting: Featured/Newest/Highest Rated
- View All/View Less controls
- Submission requires **non-anonymous logged-in user** in UI
- New/updated review saved as `status: "pending"`
- Verified booking check attempted (uid + service + completed booking)
- Abuse report increments `reportsCount`
- Local pending draft edit UX

### Blog

- Public blog cards with image/date/read-time/CTA
- Horizontal scroll controls
- View More/View Less with animation
- Realtime Firestore sync + fallback blog dataset

### Contact

- Contact form intercepted in JS and persisted to Firestore
- Creates `contactMessages` with `status: "new"`
- Success inline message + success popup

---

## 7. Client Auth + Dashboard Features

- Auth modal with:
  - Email/password login/register
  - Forgot password
  - Continue as guest
  - Phone auth placeholder (coming soon UI)
- Guest sessions via anonymous auth for booking/contact operations
- Profile dropdown + logout
- Client dashboard:
  - Recent appointments
  - Recent reviews
  - Favorite styles list + count
  - Favorite actions (book/remove)
  - Profile summary (name/email/phone)
- Manage Account modal UI includes:
  - **Profile Info:** avatar picker, name/email/phone fields with input hints
  - **Login & Security:** current/new password fields, password strength + rule checklist, change/reset actions
  - **Preferences:** theme/font size selectors, accessibility toggles, notification toggles
  - **Danger Zone:** delete account trigger + dedicated confirmation modal
  - **Implementation status:** current update is UI structure/styling in HTML/CSS

---

## 8. Admin Features

### Access + UX

- Firebase email/password admin login
- Allowed-email guard
- Password visibility toggle
- Section tabs: Bookings, Gallery, Blogs, Reviews, Messages
- Confirmation modal for destructive actions

### Bookings

- Realtime bookings list + status stats
- Actions: pending / confirmed / completed
- Cancel + release slot (transaction)

### Gallery

- Create/edit/delete gallery style
- Cloudinary upload (main + optional before image)
- Featured flags (Trending, Most Booked)
- Live preview + checklist + completion progress meter

### Blogs

- Create/edit/delete blog posts
- Fields: title, excerpt, read time, publish date, read-more URL, image
- Blog list vertical scroll controls

### Reviews

- Realtime moderation queue + stats
- Sort reviews (featured/newest/highest-rated)
- Actions:
  - approve/reject/set pending
  - edit text (resets to pending)
  - save admin reply
  - toggle featured
  - delete
- Local profanity/content list management for moderation assistance

### Messages

- Realtime contact inbox + stats
- Sort modes (newest/oldest/status/name)
- Status transitions (`new`, `read`, `resolved`)
- Delete message

---

## 9. Firestore Data Model

### `bookings/{bookingId}`

- Customer fields: `firstName`, `lastName`, `email`, `phone`
- Booking fields: `service`, `stylist`, `stylistKey`, `date`, `time`, `slotId`, `notes`
- Media/status: `inspirationImageUrl`, `status`, `uid`
- Timestamps: `createdAt`, `updatedAt`
- Function metadata: `emailStatus`, `emailSentAt`, `emailError`, `emailTriedAt`

### `bookingSlots/{slotId}`

- `taken`, `date`, `time`, `stylistKey`, `bookingId`, `uid`, timestamps

### `galleryStyles/{styleId}`

- Style metadata + image fields + featured flags + timestamps

### `blogs/{blogId}`

- `title`, `excerpt`, `readTime`, `publishDate`, `readMoreUrl`, `imageUrl`, timestamps

### `reviews/{reviewId}`

- Review content, rating, optional service/photo, moderation + report fields, status, featured, uid, timestamps

### `users/{userId}`

- Profile fields: `displayName`, `email`, `provider`, `phone`, timestamps

### `users/{userId}/favorites/{favoriteId}`

- Favorite style snapshot: `id`, `styleName`, `styleType`, `stylistName`, `imageUrl`, `savedAt`

### `contactMessages/{messageId}`

- `name`, `email`, `subject`, `message`, `status`, `uid`, timestamps

---

## 10. Security Model (`firestore.rules`)

Core rule behavior:

- Helper guards:
  - `isSignedIn()`
  - `isAdmin()`
- Strict payload key/type checks on writes
- Collection-level access:
  - `bookings`: signed-in create, owner/admin read, admin status updates
  - `bookingSlots`: signed-in create, public read, admin delete
  - `galleryStyles`: public read, admin write
  - `blogs`: public read, admin write
  - `reviews`: approved public read, owner/admin constraints, report increment path
  - `users`: self read/write, no delete; favorites scoped to owner
  - `contactMessages`: signed-in create, admin read/update/delete

---

## 11. Cloud Functions

File: `functions/index.js`

### `sendBookingConfirmationEmail`

- Trigger: `onDocumentCreated("bookings/{bookingId}")`
- Uses secrets:
  - `RESEND_API_KEY`
  - `RESEND_FROM_EMAIL`
- Sends booking confirmation email (HTML + text)
- Writes send outcome back to booking doc:
  - success: `emailStatus: "sent"`, `emailSentAt`
  - failure: `emailStatus: "failed"`, `emailError`, `emailTriedAt`

---

## 12. Local Setup

### Prerequisites

- Node.js + npm
- Firebase CLI
- Access to Firebase project

### Install Functions Dependencies

```bash
cd functions
npm install
cd ..
```

### Firebase Checklist

1. Enable Firestore
2. Enable Authentication providers:
   - Email/Password
   - Anonymous
3. Deploy rules:

```bash
firebase deploy --only firestore:rules
```

4. Set function secrets:

```bash
firebase functions:secrets:set RESEND_API_KEY
firebase functions:secrets:set RESEND_FROM_EMAIL
```

5. Deploy functions:

```bash
firebase deploy --only functions
```

6. Deploy hosting:

```bash
firebase deploy --only hosting:main-site
```

---

## 13. Deployment

Deploy all:

```bash
firebase deploy
```

Deploy specific components:

- Hosting only: `firebase deploy --only hosting:main-site`
- Rules only: `firebase deploy --only firestore:rules`
- Functions only: `firebase deploy --only functions`

---

## 14. Important Notes

1. Frontend Firebase config is expected in web apps; security is enforced by rules + auth.
2. Anonymous auth is required for guest booking/contact flow.
3. Review form UI currently requires non-anonymous login to submit.
4. Cloudinary uploads are unsigned; keep upload preset tightly restricted.
5. Booking UI mentions SMS reminders, but implemented automation is email confirmation function.
6. Contact form has `formsubmit.co` attributes in HTML, but active flow is JS + Firestore (`preventDefault`).
7. Manage Account/Delete Account modal UI is included in `index.html` + `CSS/style.css`; runtime JS handlers are not yet implemented in `JS/script.js`.

---

## 15. Troubleshooting

### "Anonymous sign-in is disabled"

- Enable Anonymous provider in Firebase Authentication.

### Permission denied errors

- Verify auth state and payload schema against rules.
- Ensure latest rules are deployed.

### Realtime listeners not updating

- Check browser console for listener/query errors.
- Verify `window.APP_CONFIG` project values.
- Confirm required collections/documents exist.

### Email confirmation not sent

- Confirm function deployment.
- Confirm secrets are set.
- Check Cloud Functions logs.

---

**Status:** This README reflects the current implementation in `public/`, `functions/`, `firebase.json`, and `firestore.rules`.
