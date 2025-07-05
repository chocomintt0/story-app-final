export class IndexedDBService {
    constructor() {
      this.dbName = "StoryExplorerDB"
      this.dbVersion = 1
      this.db = null
    }
  
    async init() {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(this.dbName, this.dbVersion)
  
        request.onerror = () => {
          console.error("IndexedDB error:", request.error)
          reject(request.error)
        }
  
        request.onsuccess = () => {
          this.db = request.result
          console.log("IndexedDB initialized successfully")
          resolve(this.db)
        }
  
        request.onupgradeneeded = (event) => {
          const db = event.target.result
  
          if (!db.objectStoreNames.contains("stories")) {
            const storiesStore = db.createObjectStore("stories", { keyPath: "id" })
            storiesStore.createIndex("createdAt", "createdAt", { unique: false })
            storiesStore.createIndex("name", "name", { unique: false })
          }
  
          if (!db.objectStoreNames.contains("favorites")) {
            const favoritesStore = db.createObjectStore("favorites", { keyPath: "id" })
            favoritesStore.createIndex("addedAt", "addedAt", { unique: false })
          }
  
          if (!db.objectStoreNames.contains("offlineQueue")) {
            const queueStore = db.createObjectStore("offlineQueue", { keyPath: "id", autoIncrement: true })
            queueStore.createIndex("timestamp", "timestamp", { unique: false })
            queueStore.createIndex("type", "type", { unique: false })
          }
  
          if (!db.objectStoreNames.contains("preferences")) {
            const preferencesStore = db.createObjectStore("preferences", { keyPath: "key" })
          }
  
          console.log("IndexedDB schema created/updated")
        }
      })
    }
  
    async saveStories(stories) {
      if (!this.db) await this.init()
  
      const transaction = this.db.transaction(["stories"], "readwrite")
      const store = transaction.objectStore("stories")
  
      const promises = stories.map((story) => {
        return new Promise((resolve, reject) => {
          const request = store.put({
            ...story,
            cachedAt: new Date().toISOString(),
          })
          request.onsuccess = () => resolve(request.result)
          request.onerror = () => reject(request.error)
        })
      })
  
      return Promise.all(promises)
    }
  
    async getStories() {
      if (!this.db) await this.init()
  
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(["stories"], "readonly")
        const store = transaction.objectStore("stories")
        const request = store.getAll()
  
        request.onsuccess = () => {
          resolve(request.result || [])
        }
        request.onerror = () => reject(request.error)
      })
    }
  
    async getStoryById(id) {
      if (!this.db) await this.init()
  
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(["stories"], "readonly")
        const store = transaction.objectStore("stories")
        const request = store.get(id)
  
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      })
    }
  
    async deleteStory(id) {
      if (!this.db) await this.init()
  
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(["stories"], "readwrite")
        const store = transaction.objectStore("stories")
        const request = store.delete(id)
  
        request.onsuccess = () => resolve(true)
        request.onerror = () => reject(request.error)
      })
    }
  
    async addToFavorites(story) {
      if (!this.db) await this.init()
  
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(["favorites"], "readwrite")
        const store = transaction.objectStore("favorites")
        const request = store.put({
          ...story,
          addedAt: new Date().toISOString(),
        })
  
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      })
    }
  
    async removeFromFavorites(id) {
      if (!this.db) await this.init()
  
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(["favorites"], "readwrite")
        const store = transaction.objectStore("favorites")
        const request = store.delete(id)
  
        request.onsuccess = () => resolve(true)
        request.onerror = () => reject(request.error)
      })
    }
  
    async getFavorites() {
      if (!this.db) await this.init()
  
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(["favorites"], "readonly")
        const store = transaction.objectStore("favorites")
        const request = store.getAll()
  
        request.onsuccess = () => resolve(request.result || [])
        request.onerror = () => reject(request.error)
      })
    }
  
    async isFavorite(id) {
      if (!this.db) await this.init()
  
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(["favorites"], "readonly")
        const store = transaction.objectStore("favorites")
        const request = store.get(id)
  
        request.onsuccess = () => resolve(!!request.result)
        request.onerror = () => reject(request.error)
      })
    }
  
    async addToOfflineQueue(action) {
      if (!this.db) await this.init()
  
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(["offlineQueue"], "readwrite")
        const store = transaction.objectStore("offlineQueue")
        const request = store.add({
          ...action,
          timestamp: new Date().toISOString(),
        })
  
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      })
    }
  
    async getOfflineQueue() {
      if (!this.db) await this.init()
  
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(["offlineQueue"], "readonly")
        const store = transaction.objectStore("offlineQueue")
        const request = store.getAll()
  
        request.onsuccess = () => resolve(request.result || [])
        request.onerror = () => reject(request.error)
      })
    }
  
    async removeFromOfflineQueue(id) {
      if (!this.db) await this.init()
  
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(["offlineQueue"], "readwrite")
        const store = transaction.objectStore("offlineQueue")
        const request = store.delete(id)
  
        request.onsuccess = () => resolve(true)
        request.onerror = () => reject(request.error)
      })
    }
  
    async clearOfflineQueue() {
      if (!this.db) await this.init()
  
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(["offlineQueue"], "readwrite")
        const store = transaction.objectStore("offlineQueue")
        const request = store.clear()
  
        request.onsuccess = () => resolve(true)
        request.onerror = () => reject(request.error)
      })
    }
  
    async setPreference(key, value) {
      if (!this.db) await this.init()
  
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(["preferences"], "readwrite")
        const store = transaction.objectStore("preferences")
        const request = store.put({ key, value, updatedAt: new Date().toISOString() })
  
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      })
    }
  
    async getPreference(key) {
      if (!this.db) await this.init()
  
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(["preferences"], "readonly")
        const store = transaction.objectStore("preferences")
        const request = store.get(key)
  
        request.onsuccess = () => resolve(request.result?.value)
        request.onerror = () => reject(request.error)
      })
    }
  
    async clearAllData() {
      if (!this.db) await this.init()
  
      const storeNames = ["stories", "favorites", "offlineQueue", "preferences"]
      const promises = storeNames.map((storeName) => {
        return new Promise((resolve, reject) => {
          const transaction = this.db.transaction([storeName], "readwrite")
          const store = transaction.objectStore(storeName)
          const request = store.clear()
  
          request.onsuccess = () => resolve(true)
          request.onerror = () => reject(request.error)
        })
      })
  
      return Promise.all(promises)
    }
  
    async getStorageInfo() {
      if (!this.db) await this.init()
  
      const storeNames = ["stories", "favorites", "offlineQueue", "preferences"]
      const info = {}
  
      for (const storeName of storeNames) {
        const transaction = this.db.transaction([storeName], "readonly")
        const store = transaction.objectStore("stories")
        const countRequest = store.count()
  
        info[storeName] = await new Promise((resolve, reject) => {
          countRequest.onsuccess = () => resolve(countRequest.result)
          countRequest.onerror = () => reject(countRequest.error)
        })
      }
  
      return info
    }
  }
  