# Automated Testing Quick Start

This project now has a starter automated testing foundation for the first tools you chose:

1. Playwright for browser end-to-end smoke tests.
2. Firebase Emulator Suite for safe local Firebase testing.
3. Firebase Rules Unit Testing for `firestore.rules`.
4. Vitest for root/frontend unit tests.
5. Jest for Cloud Functions tests.
6. GitHub Actions for automatic test runs on push and pull request.

## Install dependencies

Use Node.js `22` for this project. Firebase Functions is configured for the
Node `22` runtime in `functions/package.json`, and GitHub Actions also runs on
Node `22`. If your local machine uses a newer Node version, such as Node `24`,
`npm install --prefix functions` may show an engine warning even though CI and
Firebase deployment target the correct runtime.

From the project root:

```bash
npm install
npm install --prefix functions
npx playwright install chromium
```

If you use a Node version manager, the repository includes `.nvmrc` and
`.node-version` markers set to `22`.

## Dependency audit notes

Review npm audit findings before applying fixes. Avoid running
`npm audit fix --force` automatically for Functions dependencies because npm may
suggest major-version downgrades of Firebase packages, which can introduce
runtime or API compatibility issues. Prefer conservative updates within the
current major version first, then rerun the audit and test suite.

## Useful commands

```bash
# Check JS syntax only
npm run check:js

# Run root/unit tests
npm run test:unit

# Run Firestore rules tests through the Firestore emulator
npm run test:rules

# Run browser smoke tests
npm run test:e2e

# Run Functions Jest tests
npm --prefix functions test

# Run the main safe local checks
npm test
```

## Local Firebase emulators

```bash
# Start Auth + Firestore emulators
npm run emulators

# Start Auth + Firestore + Functions emulators
npm run emulators:functions
```

Rules tests already start the Firestore emulator automatically with `firebase emulators:exec`.
The Firestore emulator is configured on port `18080` to avoid common local conflicts with other development tools.

## First tests included

- Public homepage smoke test.
- Public mobile horizontal-overflow check.
- Public booking form flow that confirms an appointment and verifies booking + slot writes through a Firebase browser mock.
- Public services/category rendering and “Book This Service” prefill behavior.
- Public contact links and contact form submission flow through a Firebase browser mock.
- Public mobile/tablet responsive checks across important customer-facing sections.
- Admin login page smoke test.
- Admin login success flow that unlocks the dashboard and renders booking statistics through a Firebase browser mock.
- Admin mobile responsive check.
- Firestore rules tests for public/private reads, owner profile writes, admin records, security alerts, and login activity.
- Firestore rules tests for client booking writes, booking slot locks, and contact message writes in the Firebase emulator.
- Client config unit tests.
- Functions config Jest test.

These are intentionally safe starter tests. They do not submit real bookings or write to production Firebase.

The E2E browser flow tests use a local Firebase compatibility mock so they can
verify page behavior and submitted payloads without touching production data.
The Firestore rules tests use the Firebase Emulator Suite to verify the real
security rules that protect booking/contact writes.

The Playwright smoke tests block external network requests so they do not depend on Google Fonts, CDN assets, Firebase Auth iframes, or live production Firebase during local/CI smoke testing.
