async function installFirebaseMock(page, options = {}) {
	await page.addInitScript((mockOptions) => {
		const clone = (value) => JSON.parse(JSON.stringify(value ?? null))
		const state = {
			collections: clone(mockOptions.initialCollections || {}),
			auth: {
				currentUser: null,
				signInCalls: [],
			},
			callables: [],
			generatedIdCounter: 0,
		}

		window.__firebaseMockState = state

		function ensureCollection(collectionName) {
			if (!state.collections[collectionName]) {
				state.collections[collectionName] = {}
			}
			return state.collections[collectionName]
		}

		function makeSnapshot(id, collectionName) {
			const collection = ensureCollection(collectionName)
			const exists = Object.prototype.hasOwnProperty.call(collection, id)
			return {
				id,
				exists,
				ref: makeDocRef(collectionName, id),
				data: () => (exists ? clone(collection[id]) : undefined),
			}
		}

		function makeQuerySnapshot(collectionName) {
			const collection = ensureCollection(collectionName)
			const docs = Object.entries(collection).map(([id]) =>
				makeSnapshot(id, collectionName),
			)
			return {
				docs,
				empty: docs.length === 0,
				size: docs.length,
				forEach(callback) {
					docs.forEach(callback)
				},
			}
		}

		function setDocData(collectionName, id, data, options = {}) {
			const collection = ensureCollection(collectionName)
			collection[id] = options.merge
				? { ...(collection[id] || {}), ...clone(data) }
				: clone(data)
		}

		function makeDocRef(collectionName, id) {
			const safeId = id || `${collectionName}-${++state.generatedIdCounter}`
			return {
				id: safeId,
				path: `${collectionName}/${safeId}`,
				async get() {
					return makeSnapshot(safeId, collectionName)
				},
				async set(data, options = {}) {
					setDocData(collectionName, safeId, data, options)
				},
				async delete() {
					delete ensureCollection(collectionName)[safeId]
				},
				onSnapshot(success) {
					window.setTimeout(() => success(makeSnapshot(safeId, collectionName)), 0)
					return () => {}
				},
			}
		}

		function makeCollectionRef(collectionName) {
			return {
				doc(id) {
					return makeDocRef(collectionName, id)
				},
				async add(data) {
					const ref = makeDocRef(
						collectionName,
						`${collectionName}-${++state.generatedIdCounter}`,
					)
					await ref.set(data)
					return ref
				},
				where() {
					return this
				},
				orderBy() {
					return this
				},
				limit() {
					return this
				},
				onSnapshot(success) {
					window.setTimeout(() => success(makeQuerySnapshot(collectionName)), 0)
					return () => {}
				},
			}
		}

		const db = {
			collection(collectionName) {
				return makeCollectionRef(collectionName)
			},
			collectionGroup(collectionName) {
				return makeCollectionRef(`__collectionGroup:${collectionName}`)
			},
			async runTransaction(callback) {
				const transaction = {
					get: (ref) => ref.get(),
					set: (ref, data, options = {}) => ref.set(data, options),
					delete: (ref) => ref.delete(),
				}
				return callback(transaction)
			},
		}

		const authListeners = []
		const authService = {
			currentUser: null,
			async setPersistence() {},
			onAuthStateChanged(callback) {
				authListeners.push(callback)
				window.setTimeout(() => callback(authService.currentUser), 0)
				return () => {}
			},
			async signInAnonymously() {
				const user = {
					uid: mockOptions.anonymousUid || "mock-anonymous-user",
					email: null,
					displayName: "Guest User",
					isAnonymous: true,
				}
				authService.currentUser = user
				state.auth.currentUser = clone(user)
				authListeners.forEach((callback) => callback(user))
				return { user }
			},
			async signInWithEmailAndPassword(email, password) {
				state.auth.signInCalls.push({ email, password })
				if (mockOptions.rejectEmailPasswordSignIn) {
					const error = new Error(
						mockOptions.rejectEmailPasswordMessage ||
							"Mock email/password sign-in failed",
					)
					error.code = "auth/invalid-credential"
					throw error
				}

				const user = {
					uid: mockOptions.adminUid || "admin-uid",
					email,
					displayName: mockOptions.adminDisplayName || "Admin User",
					isAnonymous: false,
				}
				authService.currentUser = user
				state.auth.currentUser = clone(user)
				authListeners.forEach((callback) => callback(user))
				return { user }
			},
			async signInWithPopup() {
				return this.signInWithEmailAndPassword(
					mockOptions.adminEmail || "admin@royalbraids.test",
					"popup",
				)
			},
			async getRedirectResult() {
				return { user: null }
			},
			async createUserWithEmailAndPassword(email) {
				return this.signInWithEmailAndPassword(email, "created")
			},
			async sendPasswordResetEmail() {},
			async signOut() {
				authService.currentUser = null
				state.auth.currentUser = null
				authListeners.forEach((callback) => callback(null))
			},
		}

		function authFactory() {
			return authService
		}
		authFactory.Auth = {
			Persistence: {
				LOCAL: "local",
				SESSION: "session",
			},
		}
		authFactory.EmailAuthProvider = {
			credential: (email, password) => ({ email, password }),
		}
		authFactory.GoogleAuthProvider = function GoogleAuthProvider() {}

		function firestoreFactory() {
			return db
		}
		firestoreFactory.FieldValue = {
			serverTimestamp: () => ({ __type: "serverTimestamp" }),
			increment: (amount) => ({ __type: "increment", amount }),
		}
		firestoreFactory.Timestamp = {
			fromMillis: (millis) => ({ __type: "timestamp", millis }),
		}
		firestoreFactory.FieldPath = {
			documentId: () => "__name__",
		}

		function functionsFactory() {
			return {
				httpsCallable(name) {
					return async (payload) => {
						state.callables.push({ name, payload: clone(payload) })
						return {
							data: {
								ok: true,
								admins: mockOptions.adminCallableUsers || [],
							},
						}
					}
				},
			}
		}

		window.firebase = {
			apps: [],
			initializeApp(config, name) {
				const app = { config, name: name || "[DEFAULT]" }
				this.apps.push(app)
				return app
			},
			auth: authFactory,
			firestore: firestoreFactory,
			functions: functionsFactory,
		}
	}, options)
}

module.exports = { installFirebaseMock }