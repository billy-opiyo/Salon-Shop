# Royal Braids (Salon Shop)

Production-ready Firebase salon platform for **Royal Braids** with:

- Public website (`public/index.html`) for services, gallery, booking, reviews, blog, and contact
- Client authentication + personal dashboard (appointments, reviews, favorites, account settings)
- Admin console (`public/admin.html`) for bookings, schedule view, gallery, blogs, reviews, and messages
- Firestore realtime data pipelines
- Cloud Functions automation for email + WhatsApp booking notifications and waitlist alerts

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
14. [Feature Testing Sample (End-to-End QA)](#14-feature-testing-sample-end-to-end-qa)
15. [Important Notes](#15-important-notes)
16. [Troubleshooting](#16-troubleshooting)

---

## 1. Project Summary

This project is built to:

1. Showcase salon services, styles, and content dynamically.
2. Accept online bookings with anti-double-booking slot locking.
3. Support authenticated client self-service (dashboard, favorites, reschedule/cancel actions).
4. Give admins one panel for operations (bookings, calendar schedule, content, and messages).
5. Enforce security via Firebase Auth + strict Firestore Rules.

---

## 2. Latest Project Changes (Current State)

- Added/expanded **Client Dashboard self-service**:
  - Client-side booking reschedule flow with slot re-locking
  - Client-side booking cancellation flow
  - Realtime dashboard sections for appointments/reviews/favorites
- Added full **Manage Account runtime implementation**:
  - Profile updates (name/email/phone/avatar)
  - Password change + password reset actions
  - Theme/accessibility/notification preferences persistence
  - Account delete confirmation flow in UI
- Added **Waitlist workflow** for lost booking slots:
  - Public app prompts client to join waitlist when slot was just taken
  - Waitlist entries stored in Firestore (`waitlist` collection)
  - Backend notifies next waitlisted client when a slot lock is deleted
- Expanded **Cloud Functions automation**:
  - Email booking confirmation via Resend
  - WhatsApp booking confirmation on create
  - Scheduled WhatsApp reminders (24h window)
  - Booking system field initialization + per-user review/contact rate-limit updates
- Expanded **Admin operations**:
  - Schedule tab with day/week calendar view and quick booking actions
  - Existing CRUD/moderation modules maintained for gallery, blogs, reviews, and messages

---

## 3. Tech Stack

### Frontend

- HTML + CSS + Vanilla JavaScript
- Public script: `public/JS/script.js`
- Admin script: `public/JS/admin.js`

### Firebase

- Firebase Hosting (`public/`)
- Firebase Authentication (Email/Password + Anonymous)
- Cloud Firestore
- Firestore Security Rules (`firestore.rules`)
- Firebase App Check (configured in public/admin apps)

### Media + Automation

- Cloudinary unsigned uploads (booking/gallery/review/blog images)
- Firebase Cloud Functions (`functions/index.js`)
- Resend transactional email API
- WhatsApp Cloud API for confirmations/reminders

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
2. Renders fallback datasets first.
3. Starts realtime listeners for gallery/blog/reviews and slot availability.
4. Handles booking, waitlist fallback, reviews, favorites, contact, and account workflows.

### Client Dashboard Runtime

- Reads authenticated user data from:
  - `bookings`
  - `reviews`
  - `users/{uid}/favorites`
- Supports booking reschedule/cancel actions.
- Upserts user profile data in `users/{uid}`.

### Admin App (`admin.html` + `admin.js`)

1. Email/password admin login with allowed-email gating.
2. Realtime listeners for bookings, gallery, blogs, reviews, and contact messages.
3. Calendar-like schedule board (day/week) for operational booking management.

### Backend Automation

- Functions trigger on booking creation and slot release events.
- Email + WhatsApp booking notifications.
- Scheduled WhatsApp reminders.
- Waitlist notification dispatch for newly opened slots.

---

## 6. Public-Site Features

### Services

- JS-driven service catalog + category tabs
- “Book This Service” quick-fill action

### Gallery

- Realtime Firestore gallery with fallback dataset
- Filters (length/size/style type), sorting, featured rails
- Before/after lightbox support
- Save-style to favorites

### Booking

- Required validation + optional inspiration image upload
- Realtime slot availability from `bookingSlots`
- Transactional slot lock + booking write
- If race condition occurs (slot taken), optional waitlist enrollment

### Reviews

- Public feed shows approved reviews only
- Auth-gated submission for non-anonymous signed-in users
- Pending moderation on create/update
- Abuse report increments `reportsCount`

### Blog

- Realtime blog rendering with fallback content
- Public card rendering with controls for browsing

### Contact

- Firestore-backed contact pipeline (`status: new` on create)
- Success messaging in UI

---

## 7. Client Auth + Dashboard Features

- Auth modal:
  - Email/password sign-in/register
  - Forgot password
  - Continue as guest
- Dashboard:
  - Recent appointments and reviews
  - Favorites list + quick actions
  - Profile summary fields
- Manage Account runtime:
  - Profile updates + optional avatar upload
  - Password security tools (change/reset + strength checks)
  - Preferences (theme, font size, accessibility, notifications)
  - Account deletion confirmation flow
- Booking self-service:
  - Reschedule booking
  - Cancel booking

---

## 8. Admin Features

### Access + UX

- Firebase admin login + allowed email guard
- Password visibility toggle
- Section tabs: **Bookings, Schedule, Gallery, Blogs, Reviews, Messages, Security**
- Confirmation modal for destructive actions

### Bookings + Schedule

- Realtime bookings list + status cards
- Status actions (pending / confirmed / completed)
- Cancel + release slot action
- Day/week schedule board with quick-detail action panel

### Gallery

- Create/edit/delete styles
- Cloudinary upload (after + optional before image)
- Featured flags + live preview + checklist/progress meter

### Blogs

- Create/edit/delete blog posts
- Fields: title, excerpt, read time, publish date, URL, image

### Reviews

- Realtime moderation queue + sorting
- Actions: approve/reject/pending, edit, reply, feature, delete
- Local blocked-word list helper for moderation

### Messages

- Realtime inbox + status stats
- Sort modes (newest/oldest/status/name)
- Status transitions: `new`, `read`, `resolved`

### Security

- Dedicated **Security** tab in admin console with realtime monitoring blocks for:
  - Login activity (`loginActivities`)
  - Session tracking (`collectionGroup("sessions")`)
  - Security alerts (`securityAlerts`)
  - Account change history (`accountChangeHistory`)
  - User behavior timeline (`activityTimeline`)
- Security counters/widgets:
  - Total/success/failed logins
  - Suspicious events, locked accounts, repeated wrong passwords, high-risk logins
  - Online users + online sessions + multi-device user detection
  - Daily KPI widgets (today logins, failed attempts, new registrations, returning users, provider mix)
- Advanced login activity controls:
  - Sort: newest, oldest, failed-first, suspicious-first
  - Filters: risk, date, date range, provider, device, known/anonymous user, country, status
  - Search by email/username/booking ID
  - Export visible rows to CSV/Excel
  - Clear all filters action
- Risk and anomaly model surfaced in UI:
  - Risk level (`low` / `medium` / `high`) with score and trust score
  - Repeated failures, rapid repeated logins, new device/browser, country-change anomalies
  - Temporary lock indicators from backend (`lockUntil`, failed-attempt windows)
- Inline admin incident response actions (per linked user):
  - **Temp Block** (`temporary_block`)
  - **Force Logout** (`force_logout`)
  - **Force Password Reset** (`force_password_reset`)
  - **Clear Restrictions** (`clear_restrictions`)
  - Backed by callable function `adminRestrictUserAccount`

---

## 9. Firestore Data Model

Main collections used:

- `bookings/{bookingId}`
- `bookingSlots/{slotId}`
- `waitlist/{waitlistId}`
- `galleryStyles/{styleId}`
- `blogs/{blogId}`
- `reviews/{reviewId}`
- `users/{userId}`
- `users/{userId}/favorites/{favoriteId}`
- `contactMessages/{messageId}`
- `rateLimits/{uid}` (function-managed internal cooldown docs)

---

## 10. Security Model (`firestore.rules`)

Core behavior:

- Helper guards: `isSignedIn()`, `isAdmin()`, owner/admin checks
- Strict payload and changed-key validation for create/update operations
- Booking owner update logic supports constrained reschedule/cancel paths
- Public reads only where intended (`galleryStyles`, `blogs`, approved reviews, slot availability)
- Waitlist create/read/update constraints added
- Internal `rateLimits` collection is not client-readable/writeable
- Security collections are server-written only (no direct client create/update/delete):
  - `loginActivities`
  - `securityAlerts`
  - `accountChangeHistory`
  - `activityTimeline`
- Admin-only security reads are enforced for dashboard monitoring collections.
- Session monitoring rules support admin `collectionGroup("sessions")` reads.

---

## 11. Cloud Functions

File: `functions/index.js`

- `sendBookingConfirmationEmail` (on booking create)
- `sendBookingConfirmationWhatsApp` (on booking create)
- `sendUpcomingBookingWhatsAppReminders` (scheduled every 15 minutes)
- `initializeBookingSystemFields` (booking defaults patch)
- `updateReviewRateLimit` (on review create)
- `updateContactRateLimit` (on contact create)
- `notifyWaitlistOnSlotOpen` (on booking slot deletion)
- `logLoginActivity` (callable login telemetry + risk/scoring + alert triggers)
- `logAccountSecurityChange` (callable account security-change audit + optional alert)
- `adminRestrictUserAccount` (callable admin security actions: block/logout/reset/clear)

Required function secrets include:

- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `WHATSAPP_CLOUD_ACCESS_TOKEN`
- `WHATSAPP_CLOUD_PHONE_NUMBER_ID`

---

## 12. Local Setup

### Prerequisites

- Node.js + npm
- Firebase CLI
- Firebase project access

### Install Functions Dependencies

```bash
cd functions
npm install
cd ..
```

### Firebase Checklist

1. Enable Firestore.
2. Enable Authentication providers:
   - Email/Password
   - Anonymous
3. Deploy Firestore rules:

```bash
firebase deploy --only firestore:rules
```

4. Set function secrets:

```bash
firebase functions:secrets:set RESEND_API_KEY
firebase functions:secrets:set RESEND_FROM_EMAIL
firebase functions:secrets:set WHATSAPP_CLOUD_ACCESS_TOKEN
firebase functions:secrets:set WHATSAPP_CLOUD_PHONE_NUMBER_ID
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

## 14. Feature Testing Sample (End-to-End QA)

Use this as a practical checklist to confirm all major features are working.

### A) Public website smoke test

1. Open `index.html` (or deployed site) and verify:
   - Hero, Services, Gallery, Reviews, Blog, and Contact sections render.
   - Dark mode toggle works.
2. In **Gallery**:
   - Change filters/sort options.
   - Open a style in lightbox; test next/prev and close.
   - Expected: list updates correctly and lightbox navigation works.

### B) Auth + dashboard test

1. Click **Log In** and create a test account (email/password).
2. Open **My Dashboard** and confirm:
   - Profile info appears.
   - Favorites count/list updates after saving a style.
3. In **Manage Account**:
   - Update name/phone and save.
   - Trigger password reset email.
   - Change theme/accessibility/preferences and save.
   - Expected: success messages appear and profile/preferences persist.

### C) Booking + slot locking test

1. Submit booking form with valid data.
2. Confirm success UI appears.
3. In Firestore, verify:
   - New doc in `bookings`.
   - Corresponding doc in `bookingSlots` with `taken: true`.
4. In dashboard:
   - Use **Reschedule** to pick a new slot.
   - Use **Cancel** on another active booking.
   - Expected: slot changes/cancellation reflected in Firestore and UI.

### D) Waitlist test (race condition path)

1. Attempt to book an already-taken slot (or simulate by taking slot in another session first).
2. Accept the waitlist prompt.
3. Verify new document in `waitlist` with `status: "waiting"`.
4. Delete the related `bookingSlots/{slotId}` lock (admin cancellation path is easiest).
5. Expected: top waitlisted client gets notified (email/WhatsApp based on available contact data) and waitlist status updates.

### E) Reviews + moderation test

1. Submit a review while signed in.
2. Confirm review saved as `pending`.
3. Open admin panel → **Reviews**:
   - Approve/reject/pending transitions.
   - Edit text and save reply.
   - Toggle featured and test delete.
4. Expected: public site only shows approved reviews.

### F) Contact + admin messages test

1. Submit contact form.
2. Verify document created in `contactMessages` with `status: "new"`.
3. In admin panel → **Messages**:
   - Sort list.
   - Move status new → read → resolved.
   - Delete one message.
4. Expected: counts and status badges update in realtime.

### G) Admin content management test

1. Admin login using allowed email.
2. **Gallery**: create/edit/delete a style (with image).
3. **Blogs**: create/edit/delete a blog post.
4. **Schedule**:
   - Switch Day/Week.
   - Open an event and run quick actions.
5. Expected: public site reflects gallery/blog changes in realtime.

### H) Backend automation verification

After creating test bookings, verify on booking docs:

- `emailStatus` updates (`sent`/`failed`)
- `whatsappStatus` updates (`confirmation_sent`, `reminder_sent`, etc.)
- reminder timestamps (`reminderSentAt`, `reminderTriedAt` when applicable)

Also check logs:

```bash
firebase functions:log
```

Expected: successful execution logs for:

- `sendBookingConfirmationEmail`
- `sendBookingConfirmationWhatsApp`
- `sendUpcomingBookingWhatsAppReminders`
- `notifyWaitlistOnSlotOpen`

### I) Security tab testing procedure (all Security features)

Use this procedure to validate the full **Admin → Security** module end-to-end.

#### 0) Prerequisites

1. Deploy latest Firestore rules and functions:
   - `firebase deploy --only firestore:rules`
   - `firebase deploy --only functions`
2. Sign in as an allowed admin user in `admin.html`.
3. Keep Firestore Console open for these collections:
   - `loginActivities`
   - `securityAlerts`
   - `accountChangeHistory`
   - `activityTimeline`
   - `adminSecurityActions`
   - `users/{uid}` (for `securityRestrictions` updates)

#### 1) Open Security tab + validate realtime counters/widgets

1. In admin panel, open **Security** tab.
2. Confirm Security cards render (not empty/broken) for:
   - total/success/failed/suspicious/locked/repeated wrong/high-risk
   - online users/sessions/multi-device
   - alerts/account changes/timeline totals
3. Expected:
   - Values update automatically when new activity is logged.
   - No permission errors shown in the Security message areas.

#### 2) Generate login activity test data

1. From one or more browser sessions/devices, perform:
   - Successful login(s)
   - Failed login attempts (wrong password)
2. Include mixed providers if available (email/password, anonymous, Google).
3. Expected:
   - New docs appear in `loginActivities`.
   - Security table updates in realtime.
   - Failed attempts increase failed counters.
   - Suspicious/risk flags appear when thresholds are reached.

#### 3) Verify risk analysis and lock behavior

1. Trigger repeated failed attempts within short windows.
2. Confirm rows show:
   - `failedAttemptsIn5m` / `failedAttemptsIn15m`
   - `accountLockTriggered` / active lock state and lock-until timestamp
   - risk level/score and trust score
3. Expected:
   - Suspicious flags such as `repeated_failures`, `rapid_repeated_logins`, or lock indicators appear.
   - High-risk counters increment accordingly.

#### 4) Test sorting, filtering, search, and badge behavior

1. Test **Sort Activity** options: Newest, Oldest, Failed First, Suspicious First.
2. Apply filters one-by-one and in combination:
   - Risk, Provider, Date, From/To, Device, User type, Country, Status
3. Use search input with known email/username/booking id fragments.
4. Click **Clear All Filters**.
5. Expected:
   - Visible rows match selected criteria.
   - Risk filter badge reflects selected risk scope.
   - Clear resets controls and returns full visible list.

#### 5) Test export features (CSV + Excel)

1. With filtered results visible, click **Export CSV**.
2. Click **Export Excel**.
3. Open downloaded files and verify columns include status/risk/attempt windows/lock state and metadata.
4. Expected:
   - Files download successfully.
   - Export respects current filtered visible rows.
   - If no rows are visible, UI shows a "no logs to export" error message.

#### 6) Test per-user security response actions

From any activity row linked to a known user (`uid` present), run each action:

1. **Temp Block**
   - Enter block duration (e.g., 15 minutes) and confirm.
   - Expected:
     - Success message appears.
     - `users/{uid}.securityRestrictions.blockedUntilMs` updated.
     - `adminSecurityActions` logs action.
2. **Force Logout**
   - Confirm action.
   - Expected:
     - Success message appears.
     - Claims/refresh tokens are revoked by backend.
     - Action logged in `adminSecurityActions`.
3. **Force Password Reset**
   - Confirm action.
   - Expected:
     - `passwordResetRequired` flags set in user restrictions/claims.
     - Action logged.
4. **Clear Restrictions**
   - Confirm action.
   - Expected:
     - Restriction flags/claims reset to neutral values.
     - `clearedAt/clearedBy` recorded.

#### 7) Validate session tracking table

1. Keep one user signed in from multiple devices/tabs if possible.
2. In Security tab, use **Sort Sessions** modes:
   - Online First
   - Last Active (Newest)
   - Longest Session
   - Multi-Device First
3. Expected:
   - Session rows update in realtime.
   - Online and multi-device counters reflect active test state.

#### 8) Validate security alerts feed

1. Trigger scenarios that create alerts (repeated failures/new device/unusual country or account security changes).
2. Check `securityAlerts` collection and Security Alerts table.
3. Test **Sort Alerts** modes: Newest, Oldest, High Severity First, Open First.
4. Expected:
   - Alerts appear with correct severity/status metadata.
   - Open/high counters update.

#### 9) Validate account changes and timeline feeds

1. Perform account events (e.g., password/email change from user side).
2. Confirm `accountChangeHistory` receives entries.
3. Confirm timeline actions appear in `activityTimeline`.
4. Test sort controls:
   - Account Changes: Newest, Oldest, Critical First, Change Type
   - Timeline: Newest, Oldest, Bookings First, Reviews First, Contact First
5. Expected:
   - Both tables refresh in realtime and counts update correctly.

#### 10) Permission/security regression check

1. Sign out admin or use non-admin account.
2. Attempt to access Security data.
3. Expected:
   - Firestore rules prevent unauthorized reads for admin-only security collections.
   - No client can directly create/update/delete `loginActivities`, `securityAlerts`, `accountChangeHistory`, or `activityTimeline`.
   - Only callable backend paths write these security records.

---

## 15. Important Notes

1. Frontend Firebase config in web clients is expected; rules + auth enforce security.
2. Anonymous auth is required for guest booking/contact entry points.
3. Cloudinary uploads are unsigned; keep upload presets tightly restricted.
4. Booking/notification automation currently covers email and WhatsApp.
5. Contact HTML may include legacy attributes, but active pipeline is JS + Firestore.

---

## 16. Troubleshooting

### "Anonymous sign-in is disabled"

- Enable Anonymous provider in Firebase Authentication.

### Permission denied errors

- Validate auth state and payload schema against deployed `firestore.rules`.

### Realtime listeners not updating

- Check browser console for query/listener errors.
- Verify `window.APP_CONFIG` values.

### Notifications not sent

- Confirm functions are deployed.
- Confirm all required secrets are set.
- Check Cloud Functions logs for failed status writes.

---

**Status:** This README reflects current implementation in `public/`, `functions/`, `firebase.json`, and `firestore.rules`.
