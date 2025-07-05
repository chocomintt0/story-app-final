
export class StoryModel {
  constructor() {
    this.baseURL = "https://story-api.dicoding.dev/v1"
    this.stories = []
    this.authToken = localStorage.getItem("authToken")
    this.currentUser = null
  }

  
  async register(userData) {
    try {
      const response = await fetch(`${this.baseURL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          password: userData.password,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Registration failed")
      }

      return result
    } catch (error) {
      throw error
    }
  }

  async login(credentials) {
    try {
      const response = await fetch(`${this.baseURL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Login failed")
      }

      
      this.authToken = result.loginResult.token
      this.currentUser = {
        name: result.loginResult.name,
        userId: result.loginResult.userId,
      }

      localStorage.setItem("authToken", this.authToken)
      localStorage.setItem("userName", this.currentUser.name)
      localStorage.setItem("userId", this.currentUser.userId)

      return result
    } catch (error) {
      throw error
    }
  }

  logout() {
    this.authToken = null
    this.currentUser = null
    localStorage.removeItem("authToken")
    localStorage.removeItem("userName")
    localStorage.removeItem("userId")
  }

  isAuthenticated() {
    return !!this.authToken
  }

  getCurrentUser() {
    if (!this.currentUser && this.authToken) {
      this.currentUser = {
        name: localStorage.getItem("userName"),
        userId: localStorage.getItem("userId"),
      }
    }
    return this.currentUser
  }

  
  async getAllStories() {
    try {
      console.log("Fetching stories with token:", this.authToken ? "Token exists" : "No token")

      const response = await fetch(`${this.baseURL}/stories`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.authToken}`,
          "Content-Type": "application/json",
        },
      })

      const result = await response.json()
      console.log("Stories response:", result)

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch stories")
      }

      
      if (result && result.listStory && Array.isArray(result.listStory)) {
        this.stories = result.listStory
        
        if (window.indexedDBService) {
          await window.indexedDBService.saveStories(this.stories)
        }
      } else {
        console.warn("Unexpected API response structure, using cached data")
        this.stories = await this.getCachedStories()
      }

      return this.stories
    } catch (error) {
      console.error("Error fetching stories:", error)
      
      this.stories = await this.getCachedStories()
      return this.stories
    }
  }

  async getCachedStories() {
    try {
      if (window.indexedDBService) {
        const cachedStories = await window.indexedDBService.getStories()
        if (cachedStories.length > 0) {
          console.log("Using cached stories from IndexedDB")
          return cachedStories
        }
      }
    } catch (error) {
      console.error("Error getting cached stories:", error)
    }

    
    return this.getMockStories()
  }

  async getStoryById(id) {
    try {
      const response = await fetch(`${this.baseURL}/stories/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.authToken}`,
          "Content-Type": "application/json",
        },
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch story")
      }

      return result.story
    } catch (error) {
      return this.stories.find((story) => story.id === id)
    }
  }

  async addStory(storyData) {
    try {
      console.log("Adding story:", storyData)

      const formData = new FormData()
      formData.append("description", storyData.description)

      const lat = Number.parseFloat(storyData.latitude)
      const lon = Number.parseFloat(storyData.longitude)

      if (isNaN(lat) || isNaN(lon)) {
        throw new Error("Invalid location coordinates")
      }

      formData.append("lat", lat.toString())
      formData.append("lon", lon.toString())

      if (storyData.imageUrl && storyData.imageUrl.startsWith("data:")) {
        try {
          const response = await fetch(storyData.imageUrl)
          const blob = await response.blob()
          formData.append("photo", blob, "story-photo.jpg")
        } catch (error) {
          console.error("Error processing image:", error)
          throw new Error("Failed to process image")
        }
      } else {
        throw new Error("No valid image provided")
      }

      const response = await fetch(`${this.baseURL}/stories`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.authToken}`,
        },
        body: formData,
      })

      const result = await response.json()
      console.log("Add story response:", result)

      if (!response.ok) {
        throw new Error(result.message || "Failed to add story")
      }

      
      await this.getAllStories()
      return result
    } catch (error) {
      console.error("Error adding story:", error)

      
      if (!navigator.onLine && window.indexedDBService) {
        await window.indexedDBService.addToOfflineQueue({
          type: "addStory",
          data: storyData,
        })
        console.log("Story added to offline queue")
        throw new Error("Story saved offline. It will be uploaded when you're back online.")
      }

      throw error
    }
  }

  
  validateStoryData(storyData) {
    const errors = []

    if (!storyData.description || storyData.description.trim().length < 10) {
      errors.push("Description must be at least 10 characters long")
    }

    if (!storyData.imageUrl) {
      errors.push("Photo is required")
    }

    if (!storyData.latitude || !storyData.longitude) {
      errors.push("Location is required")
    }

    return errors
  }

  validateCredentials(credentials) {
    const errors = []

    if (!credentials.email || !credentials.email.includes("@")) {
      errors.push("Valid email is required")
    }

    if (!credentials.password || credentials.password.length < 6) {
      errors.push("Password must be at least 6 characters long")
    }

    return errors
  }

  validateRegistrationData(userData) {
    const errors = []

    if (!userData.name || userData.name.trim().length < 2) {
      errors.push("Name must be at least 2 characters long")
    }

    if (!userData.email || !userData.email.includes("@")) {
      errors.push("Valid email is required")
    }

    if (!userData.password || userData.password.length < 6) {
      errors.push("Password must be at least 6 characters long")
    }

    return errors
  }

  getMockStories() {
    return [
      {
        id: "story-1",
        name: "Sample Story 1",
        description: "This is a sample story from Jakarta. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        photoUrl: "https://picsum.photos/400/300?random=1",
        createdAt: "2024-01-15T10:30:00.000Z",
        lat: -6.2088,
        lon: 106.8456,
      },
      {
        id: "story-2",
        name: "Sample Story 2",
        description:
          "Another sample story from Bandung. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        photoUrl: "https://picsum.photos/400/300?random=2",
        createdAt: "2024-01-14T15:45:00.000Z",
        lat: -6.9175,
        lon: 107.6191,
      },
      {
        id: "story-3",
        name: "Sample Story 3",
        description: "A beautiful story from Yogyakarta. Ut enim ad minim veniam, quis nostrud exercitation ullamco.",
        photoUrl: "https://picsum.photos/400/300?random=3",
        createdAt: "2024-01-13T08:20:00.000Z",
        lat: -7.7956,
        lon: 110.3695,
      },
    ]
  }

  
  async addToFavorites(story) {
    if (window.indexedDBService) {
      return await window.indexedDBService.addToFavorites(story)
    }
    throw new Error("IndexedDB not available")
  }

  async removeFromFavorites(storyId) {
    if (window.indexedDBService) {
      return await window.indexedDBService.removeFromFavorites(storyId)
    }
    throw new Error("IndexedDB not available")
  }

  async getFavorites() {
    if (window.indexedDBService) {
      return await window.indexedDBService.getFavorites()
    }
    return []
  }

  async isFavorite(storyId) {
    if (window.indexedDBService) {
      return await window.indexedDBService.isFavorite(storyId)
    }
    return false
  }
}
