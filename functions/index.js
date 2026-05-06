const { onDocumentCreated } = require("firebase-functions/v2/firestore")
const { defineSecret } = require("firebase-functions/params")
const logger = require("firebase-functions/logger")
const admin = require("firebase-admin")
const { Resend } = require("resend")

admin.initializeApp()

const RESEND_API_KEY = defineSecret("RESEND_API_KEY")
const RESEND_FROM_EMAIL = defineSecret("RESEND_FROM_EMAIL")

exports.sendBookingConfirmationEmail = onDocumentCreated(
	{
		document: "bookings/{bookingId}",
		secrets: [RESEND_API_KEY, RESEND_FROM_EMAIL],
		region: "us-central1",
	},
	async (event) => {
		const snapshot = event.data
		if (!snapshot) return

		const bookingId = event.params.bookingId
		const booking = snapshot.data()

		if (!booking?.email) {
			logger.warn("Booking missing email. Skipping send.", { bookingId })
			return
		}

		const resend = new Resend(RESEND_API_KEY.value())

		const fullName = `${booking.firstName || ""} ${booking.lastName || ""}`.trim()
		const customerName = fullName || "Customer"

		const textContent = [
			`Hi ${customerName},`,
			"",
			"Your booking has been confirmed.",
			`Booking ID: ${bookingId}`,
			`Service: ${booking.service || "N/A"}`,
			`Stylist: ${booking.stylist || "Any Available"}`,
			`Date: ${booking.date || "N/A"}`,
			`Time: ${booking.time || "N/A"}`,
			"",
			"Thank you for choosing Royal Braids!",
		].join("\n")

		const htmlContent = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
          <h2 style="margin-bottom: 8px;">Booking Confirmed ✅</h2>
          <p>Hi <strong>${customerName}</strong>,</p>
          <p>Your appointment at <strong>Royal Braids</strong> has been confirmed.</p>
          <table style="border-collapse: collapse; margin: 16px 0;">
            <tr><td style="padding: 6px 10px; font-weight: bold;">Booking ID:</td><td style="padding: 6px 10px;">${bookingId}</td></tr>
            <tr><td style="padding: 6px 10px; font-weight: bold;">Service:</td><td style="padding: 6px 10px;">${booking.service || "N/A"}</td></tr>
            <tr><td style="padding: 6px 10px; font-weight: bold;">Stylist:</td><td style="padding: 6px 10px;">${booking.stylist || "Any Available"}</td></tr>
            <tr><td style="padding: 6px 10px; font-weight: bold;">Date:</td><td style="padding: 6px 10px;">${booking.date || "N/A"}</td></tr>
            <tr><td style="padding: 6px 10px; font-weight: bold;">Time:</td><td style="padding: 6px 10px;">${booking.time || "N/A"}</td></tr>
          </table>
          <p>We look forward to seeing you.</p>
          <p>— Royal Braids Team</p>
        </div>
      `

		const message = {
			to: booking.email,
			from: RESEND_FROM_EMAIL.value(),
			subject: "Royal Braids Booking Confirmation",
			text: textContent,
			html: htmlContent,
		}

		try {
			await resend.emails.send(message)
			await snapshot.ref.set(
				{
					emailStatus: "sent",
					emailSentAt: admin.firestore.FieldValue.serverTimestamp(),
				},
				{ merge: true },
			)
			logger.info("Booking confirmation email sent", { bookingId })
		} catch (error) {
			logger.error("Failed to send booking confirmation email", {
				bookingId,
				errorMessage: error?.message || "Unknown error",
			})

			await snapshot.ref.set(
				{
					emailStatus: "failed",
					emailError: error?.message || "Unknown error",
					emailTriedAt: admin.firestore.FieldValue.serverTimestamp(),
				},
				{ merge: true },
			)
		}
	},
)
