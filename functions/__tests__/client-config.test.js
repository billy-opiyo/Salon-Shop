const clientConfig = require("../client-config")

describe("functions client config", () => {
	it("exposes backend branding and timezone values", () => {
		expect(clientConfig.businessName).toEqual(expect.any(String))
		expect(clientConfig.businessName.trim()).not.toBe("")
		expect(clientConfig.teamName).toEqual(expect.any(String))
		expect(clientConfig.timezone).toEqual(expect.any(String))
		expect(Number.isFinite(Number(clientConfig.utcOffsetHours))).toBe(true)
	})
})