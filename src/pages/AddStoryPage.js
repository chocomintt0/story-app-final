import { Icons } from "../utils/Icons.js"

export class AddStoryPage {
  constructor() {
    this.map = null
    this.selectedLocation = null
    this.camera = null
    this.capturedImage = null
    this.locationMarker = null
  }

  async render() {
    return `
    <div class="page">
      <h2 class="page-title">
        ${Icons.plusCircle}
        Add New Story
      </h2>
      
      <form class="form" id="add-story-form">
        <div class="form-group">
          <label for="story-description" class="form-label">Story Description *</label>
          <textarea id="story-description" 
                    name="description" 
                    class="form-textarea" 
                    required 
                    placeholder="Tell your story..."></textarea>
        </div>
        
        <!-- Photo Section -->
        <div class="form-group">
          <label class="form-label">Story Photo *</label>
          <div class="photo-options">
            <div class="photo-tabs">
              <button type="button" id="camera-tab" class="photo-tab active">
                ${Icons.camera}
                Camera
              </button>
              <button type="button" id="upload-tab" class="photo-tab">
                ${Icons.upload}
                Upload
              </button>
            </div>
            
            <!-- Camera Section -->
            <div id="camera-section" class="photo-section">
              <div class="camera-container">
                <video id="camera-preview" 
                       class="camera-preview hidden" 
                       autoplay 
                       playsinline></video>
                <canvas id="photo-canvas" 
                        class="camera-preview hidden"></canvas>
                <img id="captured-photo" 
                     class="camera-preview hidden" 
                     alt="Captured photo">
                
                <div class="camera-controls">
                  <button type="button" 
                          id="start-camera" 
                          class="btn btn-secondary">
                    ${Icons.camera}
                    Start Camera
                  </button>
                  <button type="button" 
                          id="capture-photo" 
                          class="btn btn-primary hidden">
                    ${Icons.aperture}
                    Capture Photo
                  </button>
                  <button type="button" 
                          id="retake-photo" 
                          class="btn btn-secondary hidden">
                    ${Icons.refreshCw}
                    Retake
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Upload Section -->
            <div id="upload-section" class="photo-section hidden">
              <div class="upload-container">
                <div class="upload-area" id="upload-area">
                  <div class="upload-content">
                    ${Icons.upload}
                    <p>Click to select image or drag & drop</p>
                    <p class="upload-hint">Supports: JPG, PNG, GIF (Max 5MB)</p>
                  </div>
                  <input type="file" 
                         id="file-input" 
                         accept="image/*" 
                         class="file-input">
                </div>
                <img id="uploaded-photo" 
                     class="camera-preview hidden" 
                     alt="Uploaded photo">
                <div class="upload-controls hidden" id="upload-controls">
                  <button type="button" 
                          id="remove-upload" 
                          class="btn btn-secondary">
                    ${Icons.x}
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Location Section -->
        <div class="form-group">
          <label class="form-label">Story Location *</label>
          <p class="mb-2" style="font-size: 0.9rem; color: #666;">
            Click on the map to select the location of your story
          </p>
          <div id="add-story-map" class="map-container"></div>
          <div id="selected-location" class="mt-2" style="font-size: 0.9rem; color: #666;">
            No location selected
          </div>
        </div>
        
        <div class="form-group">
          <button type="submit" class="btn btn-success">
            ${Icons.save}
            Save Story
          </button>
        </div>
      </form>
    </div>
  `
  }

  async init() {
    setTimeout(() => {
      this.initMap()
      this.initCamera()
      this.initUpload()
      this.initPhotoTabs()
      this.initForm()
    }, 100)
  }

  initMap() {
    const mapContainer = document.getElementById("add-story-map")
    if (!mapContainer) {
      console.error("Map container not found")
      return
    }

    try {
      this.map = L.map("add-story-map").setView([-6.2, 106.8], 6)

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
        Satellite: satelliteLayer,
      }

      L.control.layers(baseLayers).addTo(this.map)

      this.map.on("click", (e) => {
        this.selectLocation(e.latlng)
      })
    } catch (error) {
      console.error("Error initializing map:", error)
    }
  }

  selectLocation(latlng) {
    if (this.locationMarker) {
      this.map.removeLayer(this.locationMarker)
    }

    this.locationMarker = L.marker([latlng.lat, latlng.lng]).addTo(this.map).bindPopup("Selected location").openPopup()

    this.selectedLocation = {
      latitude: latlng.lat,
      longitude: latlng.lng,
    }

    document.getElementById("selected-location").textContent =
      `Selected: ${latlng.lat.toFixed(6)}, ${latlng.lng.toFixed(6)}`
  }

  initCamera() {
    const startCameraBtn = document.getElementById("start-camera")
    const capturePhotoBtn = document.getElementById("capture-photo")
    const retakePhotoBtn = document.getElementById("retake-photo")

    if (!startCameraBtn || !capturePhotoBtn || !retakePhotoBtn) {
      console.error("Camera buttons not found")
      return
    }

    startCameraBtn.addEventListener("click", async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 400, height: 300 },
        })

        this.camera = stream
        const cameraPreview = document.getElementById("camera-preview")
        cameraPreview.srcObject = stream

        cameraPreview.classList.remove("hidden")
        capturePhotoBtn.classList.remove("hidden")
        startCameraBtn.classList.add("hidden")
      } catch (error) {
        console.error("Error accessing camera:", error)
        alert("Unable to access camera. Please check permissions or use a different device.")
      }
    })

    capturePhotoBtn.addEventListener("click", () => {
      this.capturePhoto()
    })

    retakePhotoBtn.addEventListener("click", () => {
      this.retakePhoto()
    })
  }

  capturePhoto() {
    const cameraPreview = document.getElementById("camera-preview")
    const photoCanvas = document.getElementById("photo-canvas")
    const capturedPhoto = document.getElementById("captured-photo")
    const capturePhotoBtn = document.getElementById("capture-photo")
    const retakePhotoBtn = document.getElementById("retake-photo")

    if (!cameraPreview || !photoCanvas || !capturedPhoto) {
      console.error("Camera elements not found")
      return
    }

    photoCanvas.width = cameraPreview.videoWidth || 400
    photoCanvas.height = cameraPreview.videoHeight || 300

    const context = photoCanvas.getContext("2d")
    context.drawImage(cameraPreview, 0, 0)

    this.capturedImage = photoCanvas.toDataURL("image/jpeg", 0.8)

    capturedPhoto.src = this.capturedImage
    capturedPhoto.classList.remove("hidden")

    cameraPreview.classList.add("hidden")
    capturePhotoBtn.classList.add("hidden")
    retakePhotoBtn.classList.remove("hidden")

    this.stopCamera()
  }

  retakePhoto() {
    const capturedPhoto = document.getElementById("captured-photo")
    const retakePhotoBtn = document.getElementById("retake-photo")
    const startCameraBtn = document.getElementById("start-camera")

    if (capturedPhoto) capturedPhoto.classList.add("hidden")
    if (retakePhotoBtn) retakePhotoBtn.classList.add("hidden")
    if (startCameraBtn) startCameraBtn.classList.remove("hidden")

    this.capturedImage = null
  }

  stopCamera() {
    if (this.camera) {
      this.camera.getTracks().forEach((track) => track.stop())
      this.camera = null
    }
  }

  initPhotoTabs() {
    const cameraTab = document.getElementById("camera-tab")
    const uploadTab = document.getElementById("upload-tab")
    const cameraSection = document.getElementById("camera-section")
    const uploadSection = document.getElementById("upload-section")

    cameraTab.addEventListener("click", () => {
      cameraTab.classList.add("active")
      uploadTab.classList.remove("active")
      cameraSection.classList.remove("hidden")
      uploadSection.classList.add("hidden")
      this.clearUpload()
    })

    uploadTab.addEventListener("click", () => {
      uploadTab.classList.add("active")
      cameraTab.classList.remove("active")
      uploadSection.classList.remove("hidden")
      cameraSection.classList.add("hidden")
      this.clearCamera()
    })
  }

  initUpload() {
    const uploadArea = document.getElementById("upload-area")
    const fileInput = document.getElementById("file-input")
    const uploadedPhoto = document.getElementById("uploaded-photo")
    const uploadControls = document.getElementById("upload-controls")
    const removeUploadBtn = document.getElementById("remove-upload")

    uploadArea.addEventListener("click", () => {
      fileInput.click()
    })

    uploadArea.addEventListener("dragover", (e) => {
      e.preventDefault()
      uploadArea.classList.add("drag-over")
    })

    uploadArea.addEventListener("dragleave", () => {
      uploadArea.classList.remove("drag-over")
    })

    uploadArea.addEventListener("drop", (e) => {
      e.preventDefault()
      uploadArea.classList.remove("drag-over")
      const files = e.dataTransfer.files
      if (files.length > 0) {
        this.handleFileUpload(files[0])
      }
    })

    fileInput.addEventListener("change", (e) => {
      if (e.target.files.length > 0) {
        this.handleFileUpload(e.target.files[0])
      }
    })

    removeUploadBtn.addEventListener("click", () => {
      this.clearUpload()
    })
  }

  handleFileUpload(file) {
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB")
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      this.capturedImage = e.target.result

      const uploadArea = document.getElementById("upload-area")
      const uploadedPhoto = document.getElementById("uploaded-photo")
      const uploadControls = document.getElementById("upload-controls")

      uploadedPhoto.src = this.capturedImage
      uploadedPhoto.classList.remove("hidden")
      uploadControls.classList.remove("hidden")
      uploadArea.classList.add("hidden")
    }
    reader.readAsDataURL(file)
  }

  clearUpload() {
    const uploadArea = document.getElementById("upload-area")
    const uploadedPhoto = document.getElementById("uploaded-photo")
    const uploadControls = document.getElementById("upload-controls")
    const fileInput = document.getElementById("file-input")

    if (uploadedPhoto) uploadedPhoto.classList.add("hidden")
    if (uploadControls) uploadControls.classList.add("hidden")
    if (uploadArea) uploadArea.classList.remove("hidden")
    if (fileInput) fileInput.value = ""

    const uploadTab = document.getElementById("upload-tab")
    if (uploadTab && uploadTab.classList.contains("active")) {
      this.capturedImage = null
    }
  }

  clearCamera() {
    const cameraPreview = document.getElementById("camera-preview")
    const capturedPhoto = document.getElementById("captured-photo")
    const capturePhotoBtn = document.getElementById("capture-photo")
    const retakePhotoBtn = document.getElementById("retake-photo")
    const startCameraBtn = document.getElementById("start-camera")

    if (cameraPreview) cameraPreview.classList.add("hidden")
    if (capturedPhoto) capturedPhoto.classList.add("hidden")
    if (capturePhotoBtn) capturePhotoBtn.classList.add("hidden")
    if (retakePhotoBtn) retakePhotoBtn.classList.add("hidden")
    if (startCameraBtn) startCameraBtn.classList.remove("hidden")

    this.stopCamera()

    const cameraTab = document.getElementById("camera-tab")
    if (cameraTab && cameraTab.classList.contains("active")) {
      this.capturedImage = null
    }
  }

  initForm() {
    const form = document.getElementById("add-story-form")
    if (!form) {
      console.error("Form not found")
      return
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault()
      await this.handleFormSubmit(e)
    })
  }

  async handleFormSubmit(e) {
    const formData = new FormData(e.target)

    if (!this.selectedLocation) {
      alert("Please select a location on the map")
      return
    }

    if (!this.capturedImage) {
      alert("Please capture a photo for your story")
      return
    }

    const storyData = {
      description: formData.get("description"),
      imageUrl: this.capturedImage,
      latitude: this.selectedLocation.latitude,
      longitude: this.selectedLocation.longitude,
    }

    try {
      window.app.showLoading()
      await window.storyService.addStory(storyData)
      alert("Story added successfully!")
      window.location.hash = "#home"
    } catch (error) {
      console.error("Error adding story:", error)
      alert(error.message || "Error adding story. Please try again.")
    } finally {
      window.app.hideLoading()
    }
  }

  destroy() {
    this.stopCamera()
    if (this.map) {
      this.map.remove()
      this.map = null
    }
  }
}
