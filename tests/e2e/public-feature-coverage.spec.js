const { expect, test } = require("@playwright/test")
const { installFirebaseMock } = require("./helpers/firebase-mock")
const { blockExternalNetwork } = require("./helpers/network")
const { watchForUnexpectedPageErrors } = require("./helpers/page-errors")

async function openPublicPageWithFirebaseMock(page, mockOptions = {}) {
	await installFirebaseMock(page, mockOptions)
	await blockExternalNetwork(page)
	const pageErrors = watchForUnexpectedPageErrors(page)
	await page.goto("/", { waitUntil: "domcontentloaded" })
	return pageErrors
}

test.describe("public feature coverage", () => {
	test("dark mode toggle persists selection across reload", async ({ page }) => {
		const pageErrors = await openPublicPageWithFirebaseMock(page)

		await expect(page.locator("body")).not.toHaveClass(/light-mode/)
		await page.locator("#darkModeToggle").click()
		await expect(page.locator("body")).toHaveClass(/light-mode/)

		await page.reload({ waitUntil: "domcontentloaded" })
		await expect(page.locator("body")).toHaveClass(/light-mode/)

		expect(pageErrors).toEqual([])
	})

	test("review submit section enforces login gate for guests", async ({ page }) => {
		const pageErrors = await openPublicPageWithFirebaseMock(page)

		await page.locator('a[href="#testimonials"]').first().click()
		await expect(page.locator("#reviewAuthHint")).toBeVisible()
		await expect(page.locator("#reviewSubmitAuthGate")).toBeVisible()
		await expect(page.locator("#reviewSubmitWrap")).toHaveClass(/hidden/)

		await page.locator("#reviewSubmitAuthGateBtn").click()
		await expect(page.locator("#authModal")).toHaveClass(/active/)

		expect(pageErrors).toEqual([])
	})

	test("review sorting controls can switch between available strategies", async ({ page }) => {
		const pageErrors = await openPublicPageWithFirebaseMock(page)

		await page.locator('a[href="#testimonials"]').first().click()
		await expect(page.locator("#reviewsSortSelect")).toBeVisible()

		await page.locator("#reviewsSortSelect").selectOption("highest-rated")
		await expect(page.locator("#reviewsSortSelect")).toHaveValue("highest-rated")

		await page.locator("#reviewsSortSelect").selectOption("newest")
		await expect(page.locator("#reviewsSortSelect")).toHaveValue("newest")

		expect(pageErrors).toEqual([])
	})

	test("blog section exposes carousel and expand/collapse controls", async ({ page }) => {
		const pageErrors = await openPublicPageWithFirebaseMock(page)

		await page.locator('a[href="#blog"]').first().click()
		await expect(page.locator("#blogGrid")).toBeVisible()
		await expect(page.locator("#blogPrevBtn")).toBeVisible()
		await expect(page.locator("#blogNextBtn")).toBeVisible()

		await page.locator("#viewAllBlogsBtn").click()
		await expect(page.locator("#viewLessBlogsBtn")).not.toHaveClass(/hidden/)

		await page.locator("#viewLessBlogsBtn").click()
		await expect(page.locator("#viewLessBlogsBtn")).toHaveClass(/hidden/)

		expect(pageErrors).toEqual([])
	})
})