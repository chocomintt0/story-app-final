import{I as i}from"./main-DJR8oUtS.js";class m{constructor(){this.element=null}showLoading(){window.app.showLoading()}hideLoading(){window.app.hideLoading()}showAlert(e){alert(e)}navigateTo(e){window.location.hash=e}render(){return`
    <article class="add-story-page">
      <header class="page-header">
        <h1 class="page-title">
          ${i.plusCircle}
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
                  ${i.camera} <span class="tab-text">Kamera</span>
                </button>
                <button type="button" id="upload-tab" class="photo-tab" role="tab" aria-selected="false" aria-controls="upload-section">
                  ${i.upload} <span class="tab-text">Unggah</span>
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
                    <button type="button" id="start-camera" class="btn btn-secondary">${i.camera} <span class="btn-text">Mulai Kamera</span></button>
                    <button type="button" id="capture-photo" class="btn btn-primary hidden">${i.aperture} <span class="btn-text">Ambil Foto</span></button>
                    <button type="button" id="retake-photo" class="btn btn-secondary hidden">${i.refreshCw} <span class="btn-text">Ulangi</span></button>
                  </div>
                </div>
              </section>
              
              <section id="upload-section" class="photo-section hidden" role="tabpanel" aria-labelledby="upload-tab">
                <div class="upload-container">
                  <div class="upload-area" id="upload-area" tabindex="0" role="button">
                    <div class="upload-content">
                      ${i.upload}
                      <p class="upload-primary-text">Klik untuk memilih atau seret gambar</p>
                      <p class="upload-hint">Format: JPG, PNG (Maks 5MB)</p>
                    </div>
                    <input type="file" id="file-input" accept="image/*" class="file-input" aria-label="Pilih file gambar">
                  </div>
                  <figure class="upload-preview hidden">
                    <img id="uploaded-photo" class="camera-preview" alt="Foto yang diunggah">
                  </figure>
                  <div class="upload-controls hidden" id="upload-controls">
                    <button type="button" id="remove-upload" class="btn btn-secondary">${i.x} <span class="btn-text">Hapus</span></button>
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
            <button type="submit" class="btn btn-success btn-primary-action">${i.save} <span class="btn-text">Simpan Cerita</span></button>
          </div>
        </form>
      </section>
    </article>
  `}showValidationError(e,t){const a=this.getErrorElement(e);a&&(a.textContent=t,a.classList.remove("hidden"))}clearValidationError(e){const t=this.getErrorElement(e);t&&t.classList.add("hidden")}clearAllValidationErrors(){document.querySelectorAll(".form-error").forEach(t=>t.classList.add("hidden"))}updateLocationDisplay(e,t){this.getSelectedLocationElement().textContent=`Terpilih: ${e.toFixed(6)}, ${t.toFixed(6)}`}showPhotoPreview(e,t=!0){const a=t?this.getCapturedPhotoElement():this.getUploadedPhotoElement(),o=t?null:document.querySelector(".upload-preview");a&&(a.src=e,a.classList.remove("hidden")),o&&o.classList.remove("hidden")}toggleCameraControls(e=!1,t=!1){var a,o,l;(a=this.getStartCameraButton())==null||a.classList.toggle("hidden",e||t),(o=this.getCapturePhotoButton())==null||o.classList.toggle("hidden",!e),(l=this.getRetakePhotoButton())==null||l.classList.toggle("hidden",!t)}toggleUploadControls(e=!1){var t,a,o;(t=this.getUploadAreaElement())==null||t.classList.toggle("hidden",e),(a=this.getUploadControlsElement())==null||a.classList.toggle("hidden",!e),(o=document.querySelector(".upload-preview"))==null||o.classList.toggle("hidden",!e)}switchToTab(e){var a,o,l,r,n,s;const t=e==="camera";(a=this.getCameraTabElement())==null||a.classList.toggle("active",t),(o=this.getCameraTabElement())==null||o.setAttribute("aria-selected",t),(l=this.getUploadTabElement())==null||l.classList.toggle("active",!t),(r=this.getUploadTabElement())==null||r.setAttribute("aria-selected",!t),(n=this.getCameraSectionElement())==null||n.classList.toggle("hidden",!t),(s=this.getUploadSectionElement())==null||s.classList.toggle("hidden",t)}showCameraPreview(){var e;(e=this.getCameraPreviewElement())==null||e.classList.remove("hidden")}hideCameraPreview(){var e;(e=this.getCameraPreviewElement())==null||e.classList.add("hidden")}clearFileInput(){this.getFileInputElement()&&(this.getFileInputElement().value="")}getMapContainer(){return document.getElementById("add-story-map")}getFormElement(){return document.getElementById("add-story-form")}getFormData(){return new FormData(this.getFormElement())}getErrorElement(e){return document.getElementById(`${e}-error`)}getSelectedLocationElement(){return document.getElementById("selected-location")}getCapturedPhotoElement(){return document.getElementById("captured-photo")}getUploadedPhotoElement(){return document.getElementById("uploaded-photo")}getCameraPreviewElement(){return document.getElementById("camera-preview")}getPhotoCanvasElement(){return document.getElementById("photo-canvas")}getStartCameraButton(){return document.getElementById("start-camera")}getCapturePhotoButton(){return document.getElementById("capture-photo")}getRetakePhotoButton(){return document.getElementById("retake-photo")}getCameraTabElement(){return document.getElementById("camera-tab")}getUploadTabElement(){return document.getElementById("upload-tab")}getCameraSectionElement(){return document.getElementById("camera-section")}getUploadSectionElement(){return document.getElementById("upload-section")}getUploadAreaElement(){return document.getElementById("upload-area")}getUploadControlsElement(){return document.getElementById("upload-controls")}getFileInputElement(){return document.getElementById("file-input")}getRemoveUploadButton(){return document.getElementById("remove-upload")}}export{m as AddStoryView};
