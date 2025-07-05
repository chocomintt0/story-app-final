import { Icons } from "../utils/Icons.js"

export class AddStoryView {
  constructor() {
    this.element = null
  }
  
  showLoading() { window.app.showLoading(); }
  hideLoading() { window.app.hideLoading(); }
  showAlert(message) { alert(message); }
  navigateTo(hash) { window.location.hash = hash; }


  render() {
    return `
    <article class="add-story-page">
      <header class="page-header">
        <h1 class="page-title">
          ${Icons.plusCircle}
          Tambah Cerita Baru
        </h1>
      </header>
      
      <section class="story-form-section">
        <form class="story-form" id="add-story-form" novalidate aria-labelledby="form-heading">
          <h2 id="form-heading" class="visually-hidden">Form Detail Cerita</h2>
          
          <fieldset class="form-fieldset">
            <legend class="form-legend visually-hidden">Informasi Cerita</legend>
            <div class="form-group">
              <label for="story-description" class="form-label">Deskripsi Cerita *</label>
              <textarea id="story-description" name="description" class="form-textarea" required 
                        aria-describedby="description-help description-error" placeholder="Ceritakan kisahmu..."></textarea>
              <div id="description-help" class="form-help">Minimal 10 karakter.</div>
              <div id="description-error" class="form-error hidden" role="alert" aria-live="polite"></div>
            </div>
          </fieldset>
          
          <fieldset class="form-fieldset photo-fieldset">
            <legend class="form-legend">Foto Cerita *</legend>
            <div class="photo-options">
              <div class="photo-tabs" role="tablist" aria-label="Metode input foto">
                <button type="button" id="camera-tab" class="photo-tab active" role="tab" aria-selected="true" aria-controls="camera-section">
                  ${Icons.camera} <span class="tab-text">Kamera</span>
                </button>
                <button type="button" id="upload-tab" class="photo-tab" role="tab" aria-selected="false" aria-controls="upload-section">
                  ${Icons.upload} <span class="tab-text">Unggah</span>
                </button>
              </div>
              
              <section id="camera-section" class="photo-section" role="tabpanel" aria-labelledby="camera-tab">
                <div class="camera-container">
                  <div class="camera-viewport">
                    <video id="camera-preview" class="camera-preview hidden" autoplay playsinline aria-label="Pratinjau kamera"></video>
                    <canvas id="photo-canvas" class="camera-preview hidden" aria-label="Kanvas foto"></canvas>
                    <img id="captured-photo" class="camera-preview hidden" alt="Foto yang diambil">
                  </div>
                  <div class="camera-controls">
                    <button type="button" id="start-camera" class="btn btn-secondary">${Icons.camera} <span class="btn-text">Mulai Kamera</span></button>
                    <button type="button" id="capture-photo" class="btn btn-primary hidden">${Icons.aperture} <span class="btn-text">Ambil Foto</span></button>
                    <button type="button" id="retake-photo" class="btn btn-secondary hidden">${Icons.refreshCw} <span class="btn-text">Ulangi</span></button>
                  </div>
                </div>
              </section>
              
              <section id="upload-section" class="photo-section hidden" role="tabpanel" aria-labelledby="upload-tab">
                <div class="upload-container">
                  <div class="upload-area" id="upload-area" tabindex="0" role="button">
                    <div class="upload-content">
                      ${Icons.upload}
                      <p class="upload-primary-text">Klik untuk memilih atau seret gambar</p>
                      <p class="upload-hint">Format: JPG, PNG (Maks 5MB)</p>
                    </div>
                    <input type="file" id="file-input" accept="image/*" class="file-input" aria-label="Pilih file gambar">
                  </div>
                  <figure class="upload-preview hidden">
                    <img id="uploaded-photo" class="camera-preview" alt="Foto yang diunggah">
                  </figure>
                  <div class="upload-controls hidden" id="upload-controls">
                    <button type="button" id="remove-upload" class="btn btn-secondary">${Icons.x} <span class="btn-text">Hapus</span></button>
                  </div>
                </div>
              </section>
            </div>
            <div id="photo-error" class="form-error hidden" role="alert" aria-live="polite"></div>
          </fieldset>
          
          <fieldset class="form-fieldset location-fieldset">
            <legend class="form-legend">Lokasi Cerita *</legend>
            <div class="location-instructions">
              <p class="instruction-text">Klik pada peta untuk memilih lokasi cerita Anda.</p>
            </div>
            <div id="add-story-map" class="map-container" role="application" aria-label="Peta interaktif untuk memilih lokasi cerita"></div>
            <div id="selected-location" class="location-display" aria-live="polite">Lokasi belum dipilih</div>
            <div id="location-error" class="form-error hidden" role="alert" aria-live="polite"></div>
          </fieldset>
          
          <div class="form-actions">
            <button type="submit" class="btn btn-success btn-primary-action">${Icons.save} <span class="btn-text">Simpan Cerita</span></button>
          </div>
        </form>
      </section>
    </article>
  `
  }

  showValidationError(fieldId, message) {
    const errorElement = this.getErrorElement(fieldId)
    if (errorElement) {
      errorElement.textContent = message
      errorElement.classList.remove("hidden")
    }
  }

  clearValidationError(fieldId) {
    const errorElement = this.getErrorElement(fieldId)
    if (errorElement) {
      errorElement.classList.add("hidden")
    }
  }

  clearAllValidationErrors() {
    const errorElements = document.querySelectorAll(".form-error")
    errorElements.forEach((element) => element.classList.add("hidden"))
  }

  updateLocationDisplay(lat, lng) {
    this.getSelectedLocationElement().textContent = `Terpilih: ${lat.toFixed(6)}, ${lng.toFixed(6)}`
  }

  showPhotoPreview(imageUrl, isCamera = true) {
    const photoElement = isCamera ? this.getCapturedPhotoElement() : this.getUploadedPhotoElement();
    const previewContainer = isCamera ? null : document.querySelector(".upload-preview");
    if (photoElement) {
        photoElement.src = imageUrl;
        photoElement.classList.remove("hidden");
    }
    if (previewContainer) previewContainer.classList.remove("hidden");
  }


  toggleCameraControls(showCapture = false, showRetake = false) {
    this.getStartCameraButton()?.classList.toggle("hidden", showCapture || showRetake)
    this.getCapturePhotoButton()?.classList.toggle("hidden", !showCapture)
    this.getRetakePhotoButton()?.classList.toggle("hidden", !showRetake)
  }

  toggleUploadControls(showControls = false) {
    this.getUploadAreaElement()?.classList.toggle("hidden", showControls)
    this.getUploadControlsElement()?.classList.toggle("hidden", !showControls)
    document.querySelector(".upload-preview")?.classList.toggle("hidden", !showControls)
  }

  switchToTab(tabName) {
    const isCamera = tabName === "camera";
    this.getCameraTabElement()?.classList.toggle("active", isCamera);
    this.getCameraTabElement()?.setAttribute("aria-selected", isCamera);
    this.getUploadTabElement()?.classList.toggle("active", !isCamera);
    this.getUploadTabElement()?.setAttribute("aria-selected", !isCamera);
    this.getCameraSectionElement()?.classList.toggle("hidden", !isCamera);
    this.getUploadSectionElement()?.classList.toggle("hidden", isCamera);
  }

  showCameraPreview() { this.getCameraPreviewElement()?.classList.remove("hidden") }
  hideCameraPreview() { this.getCameraPreviewElement()?.classList.add("hidden") }
  clearFileInput() { if (this.getFileInputElement()) this.getFileInputElement().value = "" }

  getMapContainer() { return document.getElementById("add-story-map") }
  getFormElement() { return document.getElementById("add-story-form") }
  getFormData() { return new FormData(this.getFormElement()) }
  getErrorElement(fieldId) { return document.getElementById(`${fieldId}-error`) }
  getSelectedLocationElement() { return document.getElementById("selected-location") }
  getCapturedPhotoElement() { return document.getElementById("captured-photo") }
  getUploadedPhotoElement() { return document.getElementById("uploaded-photo") }
  getCameraPreviewElement() { return document.getElementById("camera-preview") }
  getPhotoCanvasElement() { return document.getElementById("photo-canvas") }
  getStartCameraButton() { return document.getElementById("start-camera") }
  getCapturePhotoButton() { return document.getElementById("capture-photo") }
  getRetakePhotoButton() { return document.getElementById("retake-photo") }
  getCameraTabElement() { return document.getElementById("camera-tab") }
  getUploadTabElement() { return document.getElementById("upload-tab") }
  getCameraSectionElement() { return document.getElementById("camera-section") }
  getUploadSectionElement() { return document.getElementById("upload-section") }
  getUploadAreaElement() { return document.getElementById("upload-area") }
  getUploadControlsElement() { return document.getElementById("upload-controls") }
  getFileInputElement() { return document.getElementById("file-input") }
  getRemoveUploadButton() { return document.getElementById("remove-upload") }
}