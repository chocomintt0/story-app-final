// Update HomePage to use real API data structure
import { Icons } from "../utils/Icons.js"

export class HomePage {
  constructor() {
    this.stories = []
    this.map = null
  }

  async render() {
    return `
      <div class="page">
        <h2 class="page-title">
          ${Icons.map}
          Story Explorer
        </h2>
        <p class="mb-3">Discover amazing stories from around the world</p>
        
        <div id="home-map" class="map-container map-full"></div>
        
        <div id="stories-container">
          <div class="stories-grid" id="stories-grid">
            <p class="text-center">Loading stories...</p>
          </div>
        </div>
      </div>
    `
  }

  async init() {
    await this.loadStories()
    // Add small delay to ensure DOM is ready
    setTimeout(() => {
      this.initMap()
    }, 100)
  }

  async loadStories() {
    try {
      this.stories = await window.storyService.getAllStories()
      this.renderStories()
    } catch (error) {
      console.error("Error loading stories:", error)
      document.getElementById("stories-grid").innerHTML =
        '<p class="text-center">Error loading stories. Please try again later.</p>'
    }
  }

  renderStories() {
    const storiesGrid = document.getElementById("stories-grid")

    if (this.stories.length === 0) {
      storiesGrid.innerHTML = '<p class="text-center">No stories found.</p>'
      return
    }

    storiesGrid.innerHTML = this.stories
      .map(
        (story) => `
          <article class="story-card" data-story-id="${story.id}">
            <img src="${story.photoUrl || "https://picsum.photos/400/300?random=" + Math.floor(Math.random() * 100)}" 
                 alt="${story.name || story.title || "Story image"}" 
                 class="story-image"
                 loading="lazy"
                 onerror="this.src='https://picsum.photos/400/300?random=1'">
            <div class="story-content">
              <h3 class="story-title">${story.name || story.title || "Untitled Story"}</h3>
              <p class="story-description">${story.description || "No description available."}</p>
              <div class="story-meta">
                <span class="story-location">
                  ${Icons.mapPin}
                  ${story.lat && story.lon ? `${story.lat.toFixed(4)}, ${story.lon.toFixed(4)}` : "Location not available"}
                </span>
                <span class="story-date">${story.createdAt ? new Date(story.createdAt).toLocaleDateString() : "Date unknown"}</span>
              </div>
            </div>
          </article>
        `,
      )
      .join("")

    // Add click event listeners to story cards
    document.querySelectorAll(".story-card").forEach((card) => {
      card.addEventListener("click", () => {
        const storyId = card.getAttribute("data-story-id")
        this.showStoryDetail(storyId)
      })
    })
  }

  async showStoryDetail(storyId) {
    try {
      const story = await window.storyService.getStoryById(storyId)
      if (story) {
        const locationText =
          story.lat && story.lon ? `${story.lat.toFixed(4)}, ${story.lon.toFixed(4)}` : "Location not available"

        alert(
          `Story: ${story.name || story.title || "Untitled"}\n\nDescription: ${story.description || "No description"}\n\nLocation: ${locationText}\n\nDate: ${story.createdAt ? new Date(story.createdAt).toLocaleDateString() : "Date unknown"}`,
        )
      }
    } catch (error) {
      console.error("Error fetching story details:", error)
      alert("Error loading story details")
    }
  }

  initMap() {
    // Check if map container exists
    const mapContainer = document.getElementById("home-map")
    if (!mapContainer) {
      console.error("Map container not found")
      return
    }

    try {
      // Initialize map
      this.map = L.map("home-map").setView([-6.2, 106.8], 6)

      // Add tile layers
      const osmLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      })

      const satelliteLayer = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        {
          attribution: "© Esri",
        },
      )

      const topoLayer = L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenTopoMap contributors",
      })

      // Add default layer
      osmLayer.addTo(this.map)

      // Create layer control
      const baseLayers = {
        OpenStreetMap: osmLayer,
        Satellite: satelliteLayer,
        Topographic: topoLayer,
      }

      L.control.layers(baseLayers).addTo(this.map)

      // Add story markers
      this.addStoryMarkers()
    } catch (error) {
      console.error("Error initializing map:", error)
    }
  }

  addStoryMarkers() {
    if (!this.map || !this.stories) return

    this.stories.forEach((story) => {
      if (story.lat && story.lon) {
        const marker = L.marker([story.lat, story.lon]).addTo(this.map)

        const popupContent = `
          <div style="max-width: 200px;">
            <img src="${story.photoUrl || "https://picsum.photos/200/100?random=" + Math.floor(Math.random() * 100)}" 
                 alt="${story.name || story.title || "Story"}" 
                 style="width: 100%; height: 100px; object-fit: cover; border-radius: 4px; margin-bottom: 8px;"
                 onerror="this.src='https://picsum.photos/200/100?random=1'">
            <h4 style="margin: 0 0 8px 0; font-size: 14px;">${story.name || story.title || "Untitled Story"}</h4>
            <p style="margin: 0; font-size: 12px; color: #666;">${(story.description || "No description").substring(0, 100)}...</p>
            <p style="margin: 8px 0 0 0; font-size: 11px; color: #999;">${story.createdAt ? new Date(story.createdAt).toLocaleDateString() : "Date unknown"}</p>
          </div>
        `

        marker.bindPopup(popupContent)
      }
    })
  }

  // Add cleanup method
  destroy() {
    if (this.map) {
      this.map.remove()
      this.map = null
    }
  }
}
