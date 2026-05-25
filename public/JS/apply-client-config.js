// Applies public/client-config.js values to the current HTML page.
// This lets each client launch from the same codebase by changing one config file.
;(function () {
	function getValue(source, path, fallback = "") {
		return (
			String(path || "")
				.split(".")
				.reduce((value, key) => {
					if (value && Object.prototype.hasOwnProperty.call(value, key)) {
						return value[key]
					}
					return undefined
				}, source) ?? fallback
		)
	}

	function setMetaByName(name, content) {
		if (!content) return
		let meta = document.querySelector(`meta[name="${name}"]`)
		if (!meta) {
			meta = document.createElement("meta")
			meta.setAttribute("name", name)
			document.head.appendChild(meta)
		}
		meta.setAttribute("content", content)
	}

	function setMetaByProperty(property, content) {
		if (!content) return
		let meta = document.querySelector(`meta[property="${property}"]`)
		if (!meta) {
			meta = document.createElement("meta")
			meta.setAttribute("property", property)
			document.head.appendChild(meta)
		}
		meta.setAttribute("content", content)
	}

	function applyTextBindings(config) {
		document.querySelectorAll("[data-client-text]").forEach((element) => {
			const value = getValue(config, element.dataset.clientText, null)
			if (value !== null && value !== undefined) {
				element.textContent = value
			}
		})

		document.querySelectorAll("[data-client-html]").forEach((element) => {
			const value = getValue(config, element.dataset.clientHtml, null)
			if (value !== null && value !== undefined) {
				element.innerHTML = value
			}
		})
	}

	function applyAttributeBindings(config) {
		document.querySelectorAll("[data-client-attr]").forEach((element) => {
			const bindings = String(element.dataset.clientAttr || "")
				.split(";")
				.map((item) => item.trim())
				.filter(Boolean)

			bindings.forEach((binding) => {
				const [attr, path] = binding.split(":").map((item) => item.trim())
				if (!attr || !path) return

				const value = getValue(config, path, null)
				if (value !== null && value !== undefined && value !== "") {
					element.setAttribute(attr, value)
				}
			})
		})
	}

	function applyTheme(config) {
		const theme = config.theme || {}
		const root = document.documentElement
		const themeMap = {
			"--primary": theme.primary,
			"--primary-dark": theme.primaryDark,
			"--primary-light": theme.primaryLight,
			"--focus-gold": theme.primary,
			"--accent-purple": theme.accentPurple,
			"--accent-pink": theme.accentPink,
		}

		Object.entries(themeMap).forEach(([cssVariable, value]) => {
			if (value) root.style.setProperty(cssVariable, value)
		})

		if (theme.primary && theme.primaryLight) {
			root.style.setProperty(
				"--gradient-gold",
				`linear-gradient(135deg, ${theme.primary}, ${theme.primaryLight}, ${theme.primary})`,
			)
		}
	}

	function applyHead(config) {
		const isAdminPage = /admin\.html$/i.test(window.location.pathname)
		document.title = isAdminPage
			? getValue(config, "brand.adminTitle", document.title)
			: getValue(config, "seo.title", document.title)

		setMetaByName("description", getValue(config, "seo.description"))
		setMetaByName("keywords", getValue(config, "seo.keywords"))
		setMetaByProperty("og:title", getValue(config, "seo.ogTitle"))
		setMetaByProperty("og:image", getValue(config, "seo.ogImage"))

		const favicon = document.querySelector('link[rel="icon"]')
		const faviconPath = getValue(config, "brand.favicon")
		if (favicon && faviconPath) favicon.setAttribute("href", faviconPath)
	}

	function applyContactForm(config) {
		const form = document.getElementById("contactForm")
		if (!form) return

		const formSubmitEmail = getValue(config, "contact.formSubmitEmail")
		if (formSubmitEmail) {
			form.setAttribute("action", `https://formsubmit.co/${formSubmitEmail}`)
		}

		const subjectInput = form.querySelector('input[name="_subject"]')
		const subject = getValue(config, "contact.formSubject")
		if (subjectInput && subject) subjectInput.value = subject
	}

	function applyClientConfig() {
		const config = window.CLIENT_CONFIG || {}
		if (!Object.keys(config).length) return

		applyHead(config)
		applyTheme(config)
		applyTextBindings(config)
		applyAttributeBindings(config)
		applyContactForm(config)
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", applyClientConfig)
	} else {
		applyClientConfig()
	}
})()
