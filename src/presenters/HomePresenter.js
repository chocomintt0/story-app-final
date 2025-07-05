import L from "leaflet"
import { Icons } from "../utils/Icons.js"

export class HomePresenter {
  constructor(model, view) {
    this.model = model
    this.view = view
    this.map = null
  }

  async init() {
    this.view.onStoryCardClick((storyId) => this.handleStoryClick(storyId))
    this.view.onAddToFavorites((storyId) => this.handleAddToFavorites(storyId))

    await this.loadStories()
    setTimeout(() => {
      this.initMap()
      this.updateFavoriteButtonStates()
    }, 100)
  }

  async loadStories() {
    try {
      this.view.showLoading()
      const stories = await this.model.getAllStories()
      this.view.renderStories(stories)
    } catch (error) {
      console.error("Error loading stories:", error)
      this.view.showError("Gagal memuat cerita. Silakan coba lagi nanti.")
    }
  }

  async updateFavoriteButtonStates() {
    const stories = this.model.stories || []
    for (const story of stories) {
      const isFav = await this.model.isFavorite(story.id)
      this.view.updateFavoriteButton(story.id, isFav)
    }
  }

  async handleStoryClick(storyId) {
    try {
      const story = await this.model.getStoryById(storyId)
      if (story) {
        this.view.showStoryDetail(story)
      }
    } catch (error) {
      console.error("Error fetching story details:", error)
      this.view.showAlert("Gagal memuat detail cerita.")
    }
  }

  async handleAddToFavorites(storyId) {
    try {
      const story = await this.model.getStoryById(storyId)
      if (story) {
        const isFav = await this.model.isFavorite(storyId)
        if (isFav) {
          await this.model.removeFromFavorites(storyId)
          this.view.showSuccessMessage("Cerita dihapus dari favorit!")
          this.view.updateFavoriteButton(storyId, false)
        } else {
          await this.model.addToFavorites(story)
          this.view.showSuccessMessage("Cerita ditambahkan ke favorit!")
          this.view.updateFavoriteButton(storyId, true)
        }
      }
    } catch (error) {
      console.error("Error managing favorites:", error)
      this.view.showAlert("Gagal memperbarui favorit.")
    }
  }
  
  initMap() {
    const mapContainer = this.view.getMapContainer()
    if (!mapContainer) {
      console.error("Map container not found")
      return
    }

    try {
      this.map = L.map("home-map").setView([-6.2, 106.8], 6)

      const osmLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      })

      const satelliteLayer = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        {
          attribution: "© Esri",
        },
      )
      
      osmLayer.addTo(this.map)

      const baseLayers = {
        OpenStreetMap: osmLayer,
        Satelit: satelliteLayer,
      }

      L.control.layers(baseLayers).addTo(this.map)
      this.addStoryMarkers()
    } catch (error) {
      console.error("Error initializing map:", error)
    }
  }

  addStoryMarkers() {
    if (!this.map || !this.model.stories) return

    this.model.stories.forEach((story) => {
      if (story.lat && story.lon) {
        const marker = L.marker([story.lat, story.lon]).addTo(this.map)
        const popupContent = this.view.createPopupContent(story)
        marker.bindPopup(popupContent)
      }
    })
  }

  destroy() {
    if (this.map) {
      this.map.remove()
      this.map = null
    }
  }
}