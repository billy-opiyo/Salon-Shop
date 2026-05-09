# Royal Braids (Salon Shop)

A Firebase-powered salon website for **Royal Braids** with:

- A public marketing + booking site (`public/index.html`)
- A secure admin dashboard (`public/admin.html`)
- Firestore-backed realtime data (bookings, gallery, reviews, messages)
- Cloud Functions email automation (booking confirmation via Resend)

This README explains how the project works end-to-end, including architecture, feature operations, security model, setup, and deployment.

## Table of Contents

- [1) Project Goals](#1-project-goals)
- [1.1) Latest Features Added](#11-latest-features-added)
- [2) Tech Stack](#2-tech-stack)
- [3) Repository Structure](#3-repository-structure)
- [4) Firebase Configuration & Hosting Targets](#4-firebase-configuration--hosting-targets)
- [5) App Architecture (Runtime)](#5-app-architecture-runtime)
- [6) Public Features and Their Operations](#6-public-features-and-their-operations)
- [7) Admin Features and Their Operations](#7-admin-features-and-their-operations)
- [8) Firestore Data Model](#8-firestore-data-model)
- [9) Security Model (firestore.rules)](#9-security-model-firestorerules)
- [10) Cloud Function: Booking Confirmation Email](#10-cloud-function-booking-confirmation-email)
- [11) Local Development Setup](#11-local-development-setup)
- [12) Deployment Notes](#12-deployment-notes)
- [13) Operational Workflows (Step-by-Step)](#13-operational-workflows-step-by-step)
- [14) Important Implementation Notes](#14-important-implementation-notes)
- [15) Troubleshooting](#15-troubleshooting)
- [16) Future Enhancements (Recommended)](#16-future-enhancements-recommended)
- [17) License / Ownership](#17-license--ownership)
- [18) All Current Features in This Project (As of Now)](#18-all-current-features-in-this-project-as-of-now)

---

## 1) Project Goals

The project is designed to:

1. Showcase salon services and portfolio styles.
2. Allow clients to book appointments online.
3. Prevent double-booking using transactional slot locks.
4. Let admins manage bookings, gallery styles, reviews, and contact messages in one console.
5. Keep public content dynamic through Firestore realtime listeners.

---

## 1.1) Latest Features Added

This README now reflects the newer capabilities currently implemented in the codebase:

- **Realtime slot-based availability** for booking (`bookingSlots` listener + transaction lock).
- **Gallery upgrades**:
  - Dynamic filter chips (length, size, style type)
  - Multi-mode sorting (recommended, name, created/updated dates)
  - Featured rails (**Trending** and **Most Booked**)
  - Before/after lightbox support
- **Review system upgrades**:
  - Public review submission with anonymous auth support
  - Pending-review local drafts + “edit pending” UX
  - Public abuse reporting (`reportsCount` increments)
  - Review sorting (featured/newest/highest-rated)
  - Verified-booking detection attempt on submit (service + completed booking check)
- **Admin dashboard upgrades**:
  - Section-based tabs (Bookings, Gallery, Reviews, Messages)
  - Gallery live preview + publish checklist + progress meter
  - Review moderation tools (approve/reject/pending, feature toggle, text edit, admin reply, delete)
  - Contact inbox tools (sort, status workflow, delete)
  - Confirmation modal for destructive actions
  - Password visibility toggle in admin login
- **Contact workflow upgrade**:
  - Firestore-backed contact message pipeline with statuses (`new`, `read`, `resolved`)
  - Success toast popup on submit
- **Security hardening in Firestore rules**:
  - Strict allowed keys and type validation
  - Owner/admin access separation
  - Constrained update paths per collection
- **Cloud Function email automation**:
  - Booking-created trigger sends confirmation email via Resend
  - Delivery result tracked in booking document fields (`emailStatus`, timestamps/errors)

---

## 2) Tech Stack

### Frontend

- Plain HTML/CSS/Vanilla JavaScript
- Main app script: `public/JS/script.js`
- Admin app script: `public/JS/admin.js`

### Backend / BaaS

- Firebase Hosting (serves `public/`)
- Firebase Authentication (email/password for admin + anonymous for public actions)
- Cloud Firestore (application data)
- Firestore Security Rules (`firestore.rules`)

### Server-side Automation

- Firebase Cloud Functions (`functions/index.js`)
- Resend API for transactional booking confirmation emails

### Media Uploads

- Cloudinary unsigned upload (from browser) for:
  - Booking inspiration photos
  - Gallery images
  - Optional review photos

---

## 3) Repository Structure

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
    ├── CSS/style.css
    ├── JS/script.js
    ├── JS/admin.js
    └── IMG/
```

---

## 4) Firebase Configuration & Hosting Targets

### `firebase.json`

- `functions.source = "functions"`
- `firestore.rules = "firestore.rules"`
- Hosting serves `public/` with target `main-site`

### `.firebaserc`

- Default Firebase project: `services-website-billydev`
- Hosting target `main-site` mapped to site `royal-braids-billydev`

---

## 5) App Architecture (Runtime)

## Public Site Flow (`index.html` + `script.js`)

1. UI loads static sections (hero, services, gallery, booking, reviews, contact).
2. `window.APP_CONFIG` provides Firebase, Cloudinary, and App Check settings.
3. `initializeFirebaseServices()` initializes Firebase Auth + Firestore + App Check.
4. Realtime listeners pull dynamic content:
   - `galleryStyles` for gallery cards and featured blocks
   - `reviews` (approved only) for public testimonials
   - `bookingSlots` for availability (date/stylist specific)

## Admin Flow (`admin.html` + `admin.js`)

1. Admin signs in via Firebase email/password.
2. Email is checked against `APP_CONFIG.admin.allowedEmails`.
3. On success, dashboard sections unlock:
   - Bookings
   - Gallery
   - Reviews
   - Messages
4. Admin gets realtime Firestore listeners across those collections.

## Serverless Flow (Cloud Function)

1. New booking document created in `bookings/{bookingId}`.
2. `sendBookingConfirmationEmail` function triggers.
3. Sends email via Resend.
4. Writes `emailStatus` metadata back to booking doc (`sent` or `failed`).

---

## 6) Public Features and Their Operations

## 6.1 Services Module

- Services are currently defined in `servicesData` inside `script.js`.
- Tabs (`All`, `Braids`, `Twists`, etc.) filter client-side.
- “Book This Service” auto-selects that service in the booking form and scrolls to booking section.

## 6.2 Gallery Module

- Uses fallback static data first (`fallbackGalleryData`) for resilience.
- If Firestore is available, `galleryStyles` overrides fallback in realtime.
- Features:
  - Sort options (recommended, name, created/updated date)
  - Filter chips by length, size, style type
  - Featured strips:
    - Trending Braids
    - Most Booked Styles
  - Lightbox with optional before/after comparison

### Gallery Data Source Priority

1. Firestore realtime docs (`galleryStyles`)
2. Fallback local array when Firestore fails or empty

## 6.3 Booking Module (Critical Business Logic)

Booking form captures client details + optional inspiration image.

### Availability Mechanism

- Slot IDs are deterministic: `date__stylistKey__normalizedTime`.
- Availability listener queries `bookingSlots` by document ID range.
- Taken slots are removed from time options in realtime.

### Double-Booking Prevention

Booking submission runs a Firestore **transaction**:

1. Read slot doc (`bookingSlots/{slotId}`).
2. If already taken -> abort with user error.
3. Create slot lock (`taken: true`).
4. Create booking doc referencing `slotId`.

This guarantees atomic reservation and avoids race conditions.

### Booking Status at Creation

New bookings are stored with status = `confirmed` (per current implementation/rules).

## 6.4 Reviews / Testimonials Module

- Public can submit review form (name, rating, text required; optional service/photo).
- Review is always created as `pending`.
- Only `approved` reviews are visible publicly from Firestore.
- Pending drafts are stored in `localStorage` to allow “edit pending” UX for owner.
- Abuse reporting increments `reportsCount` (+1 only).

### Review Safety Helpers

- Frontend profanity list exists in `localStorage` (editable in admin).
- Admin can reject/approve/edit/feature and reply to negative reviews.

## 6.5 Contact Module

- Contact form is handled by JS and saved to Firestore collection `contactMessages`.
- Records are created with `status: "new"`.
- Success toast is shown on completion.

> Note: The form has `formsubmit.co` attributes in HTML, but JS uses `preventDefault()` and writes to Firestore in the active flow.

---

## 7) Admin Features and Their Operations

## 7.1 Authentication & Access Control

- Admin login uses Firebase email/password auth.
- Additional client-side gate checks allowed email list.
- Real enforcement is from Firestore Rules (`isAdmin()` based on auth token email).

## 7.2 Bookings Management

Admin can:

- View booking stats by status
- Change status (`pending`, `confirmed`, `completed`)
- Run **Cancel + Release Slot**:
  - Transaction updates booking to `cancelled`
  - Deletes related `bookingSlots/{slotId}` to free availability

## 7.3 Gallery Management

Admin can:

- Create/update/delete gallery styles
- Upload main image and optional before image to Cloudinary
- Mark styles as Trending / Most Booked
- Use live preview + publish checklist before save

## 7.4 Reviews Moderation

Admin can:

- Sort reviews (featured/newest/highest-rated)
- Approve, reject, set pending
- Edit review text (resets status to pending)
- Add admin reply
- Toggle featured
- Delete reviews

Profanity/content filter list can be edited and saved in local storage.

## 7.5 Contact Messages Inbox

Admin can:

- View message stats (`new`, `read`, `resolved`)
- Sort by date/status/name
- Update status
- Delete message

---

## 8) Firestore Data Model

## `bookings/{bookingId}`

Key fields:

- `firstName`, `lastName`, `email`, `phone`
- `service`, `stylist`, `stylistKey`
- `date`, `time`, `slotId`
- `notes`, `inspirationImageUrl`
- `status` (`confirmed` at create)
- `uid`, `createdAt`, `updatedAt`
- Cloud Function metadata: `emailStatus`, `emailSentAt`, `emailError`, etc.

## `bookingSlots/{slotId}`

- `taken: true`
- `date`, `time`, `stylistKey`
- `bookingId`, `uid`, `createdAt`, `updatedAt`

## `galleryStyles/{styleId}`

- `styleName`, `styleType`
- `length`, `size`, `timeTaken`, `priceRange`
- `hairType`, `stylistName`
- `imageUrl`, `beforeImageUrl`, `hasBeforeAfter`
- `featuredTrending`, `featuredMostBooked`
- `createdAt`, `updatedAt`

## `reviews/{reviewId}`

- `name`, `avatar`, `text`, `rating`, `source`
- `service`, `photoUrl`, `adminReply`
- `reportsCount`, `verifiedBooking`
- `status` (`pending|approved|rejected`)
- `featured`, `uid`, `bookingId`
- moderation metadata: `approvedBy`, `approvedAt`
- `createdAt`, `updatedAt`

## `contactMessages/{messageId}`

- `name`, `email`, `subject`, `message`
- `status` (`new|read|resolved`)
- `uid`, `createdAt`, `updatedAt`

---

## 9) Security Model (`firestore.rules`)

### Auth Helpers

- `isSignedIn()`: requires authenticated user
- `isAdmin()`: signed-in + email in admin allowlist

### Collection Rules Summary

- **bookings**
  - Create: signed-in + strict schema/type checks + `uid == request.auth.uid`
  - Read: owner or admin
  - Update: admin only, and only `status`/`updatedAt`
  - Delete: denied

- **bookingSlots**
  - Create: signed-in + strict key/type checks + owner UID
  - Read: public (for realtime availability)
  - Update: denied
  - Delete: admin only

- **galleryStyles**
  - Read: public
  - Write: admin only

- **reviews**
  - Read: approved public OR admin all
  - Create: signed-in + strict pending-only payload rules
  - Update:
    - admin full moderation
    - owner edits pending review (limited fields)
    - signed-in users can report (reportsCount +1)
  - Delete: admin only

- **contactMessages**
  - Create: signed-in + validation
  - Read/Delete: admin only
  - Update: admin only (`status`, `updatedAt`)

---

## 10) Cloud Function: Booking Confirmation Email

File: `functions/index.js`

Function: `sendBookingConfirmationEmail`

- Trigger: `onDocumentCreated("bookings/{bookingId}")`
- Uses Firebase secrets:
  - `RESEND_API_KEY`
  - `RESEND_FROM_EMAIL`
- Sends plain-text and HTML email summary to customer.
- Writes send result to booking doc for traceability.

---

## 11) Local Development Setup

## Prerequisites

- Node.js + npm
- Firebase CLI
- Firebase project access

## Install Functions Dependencies

```bash
cd functions
npm install
cd ..
```

## Recommended Firebase Setup Checklist

1. Enable **Firestore**.
2. Enable **Authentication** providers:
   - Email/Password (admin)
   - Anonymous (public booking/review/contact submissions)
3. Deploy rules:

```bash
firebase deploy --only firestore:rules
```

4. Set functions secrets:

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

## 12) Deployment Notes

You can deploy everything together:

```bash
firebase deploy
```

Or by component:

- Hosting only: `firebase deploy --only hosting:main-site`
- Rules only: `firebase deploy --only firestore:rules`
- Functions only: `firebase deploy --only functions`

---

## 13) Operational Workflows (Step-by-Step)

## Booking Lifecycle

1. User selects service/date/time.
2. Realtime listener filters out taken slots.
3. User submits booking.
4. Transaction creates slot lock + booking.
5. Cloud Function sends email and writes status.
6. Admin can later mark completed/cancelled.

## Review Lifecycle

1. User submits review -> `pending`.
2. Admin moderates in dashboard.
3. Approved reviews appear publicly in realtime.
4. Other users can report abuse (counter increments).

## Contact Message Lifecycle

1. User submits contact form -> `new` message.
2. Admin reads and updates status (`read`, `resolved`).
3. Admin can delete when handled.

## Gallery Content Lifecycle

1. Admin uploads style + metadata.
2. Image(s) uploaded to Cloudinary.
3. Firestore doc created/updated.
4. Public gallery updates in realtime.

---

## 14) Important Implementation Notes

1. **Frontend config exposure**
   - Firebase client config in HTML is expected for web apps.
   - App security depends on Auth + Firestore Rules, not hidden API keys.

2. **Cloudinary unsigned uploads**
   - Convenient for direct browser upload, but should be tightly scoped by upload preset settings.

3. **Anonymous auth is required**
   - Public booking/review/contact submissions depend on anonymous sign-in.

4. **Rules are strict by design**
   - Payload keys/types are validated to limit abuse and malformed writes.

5. **UI copy vs implemented automation**
   - The UI mentions reminders/SMS, but current backend automation implemented is booking confirmation email only.

---

## 15) Troubleshooting

## “Anonymous sign-in is disabled”

- Enable Anonymous provider in Firebase Authentication.

## “Permission denied” on writes

- Confirm user is authenticated.
- Confirm payload matches Firestore rule schema exactly.
- Redeploy latest `firestore.rules`.

## Realtime data not updating

- Check Firestore listeners in browser console.
- Verify project config in `window.APP_CONFIG`.
- Confirm the expected collections/documents exist.

## Email not sending

- Verify function deployed.
- Verify secrets `RESEND_API_KEY` and `RESEND_FROM_EMAIL` are set.
- Check Cloud Functions logs.

---

## 16) Future Enhancements (Recommended)

- Move runtime config to environment-driven injection pipeline.
- Add Firestore indexes file if needed for more complex queries.
- Add Cloud Function hooks for:
  - contact email notifications
  - review moderation notifications
  - optional SMS reminders
- Add automated tests (rules + functions).
- Add CI/CD with staged deploy checks.

---

## 17) License / Ownership

This repository is currently configured as a private/business project for Royal Braids operations.

---

## 18) All Current Features in This Project (As of Now)

### A) Public Website Features

1. Sticky header + active-section navigation highlight.
2. Mobile menu toggle with body-scroll lock.
3. Dark mode toggle with localStorage persistence.
4. Smooth scroll navigation for in-page anchors.
5. Scroll-triggered animations (`IntersectionObserver`).
6. Hero counters with animated count-up effect.
7. Services catalog rendered from JS data.
8. Service category tabs (All, Braids, Twists, Cornrows, Special).
9. “Book This Service” quick action (auto-fills booking service selection).
10. Gallery with Firestore realtime sync and local fallback data.
11. Gallery filter chips (length, size, style type).
12. Gallery sort controls (recommended, name asc/desc, created/updated date modes).
13. Featured gallery rails:
    - Trending Braids
    - Most Booked Styles
14. Gallery “View All / View Less” paging behavior.
15. Gallery empty-state message when filters return no matches.
16. Lightbox with:
    - Previous/next navigation
    - Keyboard navigation
    - Escape close
    - Overlay click close
    - Before/after split view support
17. Booking form with required validation and optional inspiration image upload.
18. Date minimum restriction to block past-date bookings.
19. Realtime slot availability by date + stylist.
20. Firestore transaction-based slot locking (double-booking prevention).
21. Booking success state view + reset booking flow.
22. Review summary (average rating + review count).
23. Testimonials rendering with Firestore approved reviews + fallback list.
24. Review sort modes (Featured, Newest, Highest Rated).
25. Review toggle controls (View All / View Less with transition effect).
26. Review submission form with validation rules.
27. Optional review photo upload via Cloudinary.
28. Pending review draft persistence in localStorage.
29. Pending review edit UX for owner draft context.
30. Public abuse reporting action on reviews.
31. Contact form saved to Firestore (`contactMessages`).
32. Contact success toast popup + timed auto-hide.
33. Back-to-top floating button.
34. Footer quick links + social links.

### B) Admin Console Features

1. Admin login with Firebase email/password auth.
2. Allowed-email gate for admin access.
3. Admin logout flow.
4. Password visibility toggle in login form.
5. Admin section tabs:
   - Bookings
   - Gallery
   - Reviews
   - Messages
6. Realtime bookings feed.
7. Booking stats cards (total/pending/confirmed/completed/cancelled).
8. Booking status updates from action buttons.
9. Cancel + release slot transaction action.
10. Realtime gallery management list.
11. Gallery create/update/delete.
12. Gallery image upload (main + optional before image).
13. Gallery live preview card.
14. Gallery publish checklist with completion meter.
15. Gallery featured flags (Trending, Most Booked).
16. Realtime reviews moderation list.
17. Review stats cards (total/pending/approved/rejected).
18. Review moderation actions:
    - Set pending / approve / reject
    - Save text edit
    - Save admin reply
    - Toggle featured
    - Delete
19. Basic profanity/content blocklist management (local storage-based in admin UI).
20. Realtime contact messages list.
21. Contact message stats cards (total/new/read/resolved).
22. Contact message sort modes (newest/oldest/status/name variants).
23. Contact status transitions (new/read/resolved).
24. Contact message delete action.
25. Destructive action confirmation modal.
26. Per-section success/error toasts/messages.

### C) Backend / Data / Security Features

1. Firebase Hosting with target mapping (`main-site`).
2. Firestore security rules with helper guards:
   - `isSignedIn()`
   - `isAdmin()`
3. Strict schema validation for booking creation.
4. Strict schema validation for slot-lock creation.
5. Public read-only slot availability model.
6. Public gallery read + admin-only gallery writes.
7. Review lifecycle security (pending submit, admin moderation, owner pending edit, report increments).
8. Contact message security (signed-in create, admin read/update/delete).
9. Booking ownership/admin read controls.
10. Admin-limited booking status updates.
11. App Check activation support in both public/admin apps.
12. Cloud Function trigger on booking create.
13. Booking confirmation email delivery via Resend.
14. Booking email delivery status persistence (`sent`/`failed`) for auditability.
