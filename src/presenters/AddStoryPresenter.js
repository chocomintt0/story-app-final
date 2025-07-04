// Add Story Presenter - Menghubungkan Model dan View
import L from "leaflet"

export class AddStoryPresenter {
  constructor(model, view) {
    this.model = model
    this.view = view
    this.map = null
    this.selectedLocation = null
    this.camera = null
    this.capturedImage = null
    this.locationMarker = null
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
    const mapContainer = this.view.getMapContainer()
    if (!mapContainer) return

    try {
      this.map = L.map("add-story-map").setView([-6.2, 106.8], 6)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(this.map)
      this.map.on("click", (e) => this.selectLocation(e.latlng))
    } catch (error) {
      console.error("Error initializing map:", error)
    }
  }

  selectLocation(latlng) {
    if (this.locationMarker) {
      this.map.removeLayer(this.locationMarker)
    }
    this.locationMarker = L.marker([latlng.lat, latlng.lng]).addTo(this.map).bindPopup("Lokasi Terpilih").openPopup()
    this.selectedLocation = { latitude: latlng.lat, longitude: latlng.lng }
    this.view.updateLocationDisplay(latlng.lat, latlng.lng)
    this.view.clearValidationError("location")
  }

  initCamera() {
    this.view.getStartCameraButton()?.addEventListener("click", () => this.startCamera())
    this.view.getCapturePhotoButton()?.addEventListener("click", () => this.capturePhoto())
    this.view.getRetakePhotoButton()?.addEventListener("click", () => this.retakePhoto())
  }

  async startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 400, height: 300 } })
      this.camera = stream
      const cameraPreview = this.view.getCameraPreviewElement()
      cameraPreview.srcObject = stream
      this.view.showCameraPreview()
      this.view.toggleCameraControls(true, false)
    } catch (error) {
      this.view.showAlert("Tidak dapat mengakses kamera. Pastikan izin telah diberikan.")
    }
  }

  capturePhoto() {
    const cameraPreview = this.view.getCameraPreviewElement()
    const photoCanvas = this.view.getPhotoCanvasElement()
    const context = photoCanvas.getContext("2d")
    photoCanvas.width = cameraPreview.videoWidth
    photoCanvas.height = cameraPreview.videoHeight
    context.drawImage(cameraPreview, 0, 0)
    this.capturedImage = photoCanvas.toDataURL("image/jpeg", 0.8)
    this.view.showPhotoPreview(this.capturedImage, true)
    this.view.hideCameraPreview()
    this.view.toggleCameraControls(false, true)
    this.view.clearValidationError("photo")
    this.stopCamera()
  }

  retakePhoto() {
    this.view.getCapturedPhotoElement().classList.add("hidden")
    this.view.toggleCameraControls(false, false)
    this.capturedImage = null
  }

  stopCamera() {
    if (this.camera) {
      this.camera.getTracks().forEach((track) => track.stop())
      this.camera = null
    }
  }

  initPhotoTabs() {
    this.view.getCameraTabElement()?.addEventListener("click", () => {
      this.view.switchToTab("camera")
      this.clearUpload()
    })
    this.view.getUploadTabElement()?.addEventListener("click", () => {
      this.view.switchToTab("upload")
      this.clearCamera()
    })
  }

  initUpload() {
    const uploadArea = this.view.getUploadAreaElement()
    const fileInput = this.view.getFileInputElement()
    
    uploadArea?.addEventListener("click", () => fileInput.click())
    uploadArea?.addEventListener("dragover", (e) => { e.preventDefault(); uploadArea.classList.add("drag-over") })
    uploadArea?.addEventListener("dragleave", () => uploadArea.classList.remove("drag-over"))
    uploadArea?.addEventListener("drop", (e) => {
      e.preventDefault()
      uploadArea.classList.remove("drag-over")
      if (e.dataTransfer.files.length > 0) this.handleFileUpload(e.dataTransfer.files[0])
    })
    fileInput?.addEventListener("change", (e) => {
      if (e.target.files.length > 0) this.handleFileUpload(e.target.files[0])
    })
    this.view.getRemoveUploadButton()?.addEventListener("click", () => this.clearUpload())
  }

  handleFileUpload(file) {
    if (!file.type.startsWith("image/")) {
      this.view.showValidationError("photo", "Silakan pilih file gambar.")
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      this.view.showValidationError("photo", "Ukuran file tidak boleh lebih dari 5MB.")
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => {
      this.capturedImage = e.target.result
      this.view.showPhotoPreview(this.capturedImage, false)
      this.view.toggleUploadControls(true)
      this.view.clearValidationError("photo")
    }
    reader.readAsDataURL(file)
  }

  clearUpload() {
    this.view.toggleUploadControls(false)
    this.view.clearFileInput()
    if (this.view.getUploadTabElement()?.classList.contains("active")) {
      this.capturedImage = null
    }
  }

  clearCamera() {
    this.view.hideCameraPreview()
    this.view.getCapturedPhotoElement().classList.add("hidden")
    this.view.toggleCameraControls(false, false)
    this.stopCamera()
    if (this.view.getCameraTabElement()?.classList.contains("active")) {
      this.capturedImage = null
    }
  }

  initForm() {
    this.view.getFormElement()?.addEventListener("submit", (e) => {
      e.preventDefault()
      this.handleFormSubmit()
    })
  }

  async handleFormSubmit() {
    this.view.clearAllValidationErrors()
    const formData = this.view.getFormData()
    const storyData = {
      description: formData.get("description"),
      imageUrl: this.capturedImage,
      latitude: this.selectedLocation?.latitude,
      longitude: this.selectedLocation?.longitude,
    }

    const validationErrors = this.model.validateStoryData(storyData)
    if (validationErrors.length > 0) {
      validationErrors.forEach(err => {
        if (err.includes("Deskripsi")) this.view.showValidationError("description", err)
        if (err.includes("Foto")) this.view.showValidationError("photo", err)
        if (err.includes("Lokasi")) this.view.showValidationError("location", err)
      })
      return
    }

    try {
      this.view.showLoading()
      await this.model.addStory(storyData)
      this.view.showAlert("Cerita berhasil ditambahkan!")
      this.view.navigateTo("#home")
    } catch (error) {
      this.view.showAlert(error.message || "Gagal menambahkan cerita. Silakan coba lagi.")
    } finally {
      this.view.hideLoading()
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