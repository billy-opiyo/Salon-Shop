const fs = require("node:fs")
const path = require("node:path")

const {
	assertFails,
	assertSucceeds,
	initializeTestEnvironment,
} = require("@firebase/rules-unit-testing")
const { doc, getDoc, setDoc } = require("firebase/firestore")

let testEnv

function authedDb(uid, token = {}) {
	return testEnv
		.authenticatedContext(uid, {
			email: `${uid}@example.com`,
			...token,
		})
		.firestore()
}

function publicDb() {
	return testEnv.unauthenticatedContext().firestore()
}

async function seedDoc(documentPath, data) {
	await testEnv.withSecurityRulesDisabled(async (context) => {
		await setDoc(doc(context.firestore(), documentPath), data)
	})
}

describe("Firestore security rules", () => {
	beforeAll(async () => {
		testEnv = await initializeTestEnvironment({
			projectId: "demo-salon-shop-tests",
			firestore: {
				rules: fs.readFileSync(
					path.resolve(__dirname, "..", "..", "firestore.rules"),
					"utf8",
				),
			},
		})
	})

	afterEach(async () => {
		await testEnv.clearFirestore()
	})

	afterAll(async () => {
		await testEnv.cleanup()
	})

	it("allows public content reads but blocks unauthenticated private booking reads", async () => {
		await seedDoc("galleryStyles/style-1", {
			name: "Box Braids",
			status: "published",
		})
		await seedDoc("bookings/booking-1", {
			uid: "client-a",
			email: "client-a@example.com",
			status: "pending",
		})

		await assertSucceeds(getDoc(doc(publicDb(), "galleryStyles/style-1")))
		await assertFails(getDoc(doc(publicDb(), "bookings/booking-1")))
	})

	it("allows signed-in clients to create their own booking and slot lock", async () => {
		const clientDb = authedDb("client-a")
		const bookingPayload = {
			firstName: "Client",
			lastName: "A",
			email: "client-a@example.com",
			phone: "+254700000001",
			service: "Knotless Braids",
			stylist: "Fatima Hassan",
			stylistKey: "fatima",
			date: "2099-01-15",
			time: "10:00 AM",
			slotId: "2099-01-15__fatima__1000AM",
			notes: "Rules test booking",
			inspirationImageUrl: "",
			status: "confirmed",
			uid: "client-a",
			createdAt: new Date(),
			updatedAt: new Date(),
		}
		const slotPayload = {
			taken: true,
			date: "2099-01-15",
			time: "10:00 AM",
			stylistKey: "fatima",
			bookingId: "booking-allowed",
			uid: "client-a",
			createdAt: new Date(),
			updatedAt: new Date(),
		}

		await assertSucceeds(
			setDoc(doc(clientDb, "bookings/booking-allowed"), bookingPayload),
		)
		await assertSucceeds(
			setDoc(
				doc(clientDb, "bookingSlots/2099-01-15__fatima__1000AM"),
				slotPayload,
			),
		)
	})

	it("blocks clients from creating bookings for another user", async () => {
		const clientDb = authedDb("client-a")

		await assertFails(
			setDoc(doc(clientDb, "bookings/booking-other-user"), {
				firstName: "Client",
				lastName: "A",
				email: "client-a@example.com",
				phone: "+254700000001",
				service: "Knotless Braids",
				stylist: "Fatima Hassan",
				stylistKey: "fatima",
				date: "2099-01-15",
				time: "10:00 AM",
				slotId: "2099-01-15__fatima__1000AM",
				notes: "Invalid owner",
				inspirationImageUrl: "",
				status: "confirmed",
				uid: "client-b",
				createdAt: new Date(),
				updatedAt: new Date(),
			}),
		)
	})

	it("allows signed-in clients to create contact messages", async () => {
		const clientDb = authedDb("client-a")

		await assertSucceeds(
			setDoc(doc(clientDb, "contactMessages/message-1"), {
				name: "Client A",
				email: "client-a@example.com",
				subject: "Booking question",
				message: "Do you have availability tomorrow?",
				status: "new",
				uid: "client-a",
				createdAt: new Date(),
				updatedAt: new Date(),
			}),
		)
	})

	it("allows users to create only their own profile document", async () => {
		const clientDb = authedDb("client-a")
		const validProfile = {
			displayName: "Client A",
			email: "client-a@example.com",
			provider: "password",
			phone: "+254700000000",
			createdAt: new Date(),
			updatedAt: new Date(),
		}

		await assertSucceeds(setDoc(doc(clientDb, "users/client-a"), validProfile))
		await assertFails(setDoc(doc(clientDb, "users/client-b"), validProfile))
	})

	it("blocks direct client writes to server-managed admin records", async () => {
		await seedDoc("adminUsers/super-admin", {
			active: true,
			role: "super_admin",
			permissions: {
				canManageAdmins: true,
				canManageBookings: true,
				canManageContent: true,
				canManageSecurity: true,
			},
		})
		await seedDoc("adminUsers/existing-admin", {
			active: true,
			role: "admin",
			permissions: { canManageBookings: true },
		})

		const superAdminDb = authedDb("super-admin")

		await assertSucceeds(getDoc(doc(superAdminDb, "adminUsers/existing-admin")))
		await assertFails(
			setDoc(doc(superAdminDb, "adminUsers/new-admin"), {
				active: true,
				role: "admin",
				permissions: { canManageBookings: true },
			}),
		)
	})

	it("allows security admins, but not normal clients, to read security alerts", async () => {
		await seedDoc("adminUsers/security-admin", {
			active: true,
			role: "admin",
			permissions: { canManageSecurity: true },
		})
		await seedDoc("securityAlerts/alert-1", {
			severity: "high",
			status: "open",
			createdAt: new Date(),
		})

		await assertFails(getDoc(doc(authedDb("client-a"), "securityAlerts/alert-1")))
		await assertSucceeds(
			getDoc(doc(authedDb("security-admin"), "securityAlerts/alert-1")),
		)
	})

	it("keeps login activity server-written while allowing owners to read their own history", async () => {
		await seedDoc("loginActivities/activity-1", {
			uid: "client-a",
			status: "success",
			createdAt: new Date(),
		})

		const clientDb = authedDb("client-a")

		await assertSucceeds(getDoc(doc(clientDb, "loginActivities/activity-1")))
		await assertFails(
			setDoc(doc(clientDb, "loginActivities/activity-2"), {
				uid: "client-a",
				status: "success",
				createdAt: new Date(),
			}),
		)
	})
})