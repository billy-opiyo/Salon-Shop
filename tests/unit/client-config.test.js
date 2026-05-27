const fs = require("node:fs")
const path = require("node:path")
const vm = require("node:vm")

function loadClientConfig() {
	const code = fs.readFileSync(
		path.resolve(__dirname, "..", "..", "public", "client-config.js"),
		"utf8",
	)
	const sandbox = {
		Date,
		console,
		window: {},
	}

	vm.createContext(sandbox)
	vm.runInContext(code, sandbox, { filename: "public/client-config.js" })

	return sandbox.window
}

describe("client-config.js", () => {
	it("exports CLIENT_CONFIG and legacy APP_CONFIG bridge", () => {
		const window = loadClientConfig()

		expect(window.CLIENT_CONFIG).toBeTruthy()
		expect(window.APP_CONFIG).toBe(window.CLIENT_CONFIG.app)
		expect(window.CLIENT_CONFIG.client.name).toMatch(/\S/)
		expect(window.APP_CONFIG.firebase.projectId).toMatch(/\S/)
	})

	it("keeps service catalog data available for public rendering", () => {
		const window = loadClientConfig()
		const serviceCategories = window.CLIENT_CONFIG.catalog.serviceCategories
		const services = window.CLIENT_CONFIG.catalog.services

		expect(Array.isArray(serviceCategories)).toBe(true)
		expect(serviceCategories.length).toBeGreaterThan(0)
		expect(Array.isArray(services)).toBe(true)
		expect(services.length).toBeGreaterThan(0)
	})
})