import{I as i}from"./main-DJR8oUtS.js";class n{constructor(){this.element=null,this.storyCardClickCallback=null,this.addToFavoritesCallback=null}render(){return`
      <article class="home-page">
        <header class="page-header">
          <h1 class="page-title">
            ${i.map}
            Story Explorer
          </h1>
          <p class="page-description">Temukan cerita menakjubkan dari seluruh dunia</p>
        </header>
        
        <section class="map-section" aria-labelledby="map-heading">
          <h2 id="map-heading" class="visually-hidden">Peta Cerita Interaktif</h2>
          <div id="home-map" class="map-container map-full" role="application" aria-label="Peta interaktif menunjukkan lokasi cerita"></div>
        </section>
        
        <section class="stories-section" aria-labelledby="stories-heading">
          <h2 id="stories-heading" class="visually-hidden">Koleksi Cerita</h2>
          <div id="stories-container" class="stories-container">
            <div class="stories-grid" id="stories-grid" role="feed" aria-label="Stories feed" aria-busy="false">
              <p class="loading-message">Memuat cerita...</p>
            </div>
          </div>
        </section>
      </article>
    `}createPopupContent(t){return`
      <div style="max-width: 200px;">
        <img src="${t.photoUrl||"https://picsum.photos/200/100"}" 
             alt="${t.name||"Gambar Cerita"}" 
             style="width: 100%; height: 100px; object-fit: cover; border-radius: 4px; margin-bottom: 8px;"
             onerror="this.src='https://picsum.photos/200/100?random=1'">
        <h4 style="margin: 0 0 8px 0; font-size: 14px;">${t.name||"Cerita Tanpa Judul"}</h4>
        <p style="margin: 0; font-size: 12px; color: #666;">${(t.description||"Tidak ada deskripsi").substring(0,100)}...</p>
      </div>
    `}showSuccessMessage(t){const a=document.createElement("div");a.className="success-notification",a.innerHTML=`
      <div class="notification-content">
        <span class="success-icon">⭐</span>
        <span class="success-text">${t}</span>
      </div>
    `,document.body.appendChild(a),setTimeout(()=>{a.parentNode&&a.parentNode.removeChild(a)},3e3)}updateFavoriteButton(t,a){const e=document.querySelector(`[data-story-id="${t}"] .favorite-btn`);e&&(a?(e.innerHTML=i.heartFilled,e.setAttribute("aria-label","Hapus dari favorit"),e.classList.add("favorited")):(e.innerHTML=i.heart,e.setAttribute("aria-label","Tambahkan ke favorit"),e.classList.remove("favorited")))}showStoryDetail(t){const a=t.lat&&t.lon?`${t.lat.toFixed(4)}, ${t.lon.toFixed(4)}`:"Lokasi tidak tersedia";alert(`Cerita: ${t.name||"Tanpa Judul"}

Deskripsi: ${t.description||"Tidak ada deskripsi"}

Lokasi: ${a}

Tanggal: ${t.createdAt?new Date(t.createdAt).toLocaleDateString():"Tanggal tidak diketahui"}`)}showAlert(t){alert(t)}showLoading(){const t=this.getStoriesGrid();t&&(t.setAttribute("aria-busy","true"),t.innerHTML='<p class="loading-message">Memuat cerita...</p>')}showError(t){const a=this.getStoriesGrid();a&&(a.setAttribute("aria-busy","false"),a.innerHTML=`<div class="error-message" role="alert"><p>Error: ${t}</p></div>`)}showNoStories(){const t=this.getStoriesGrid();t&&(t.setAttribute("aria-busy","false"),t.innerHTML='<div class="empty-state"><p>Tidak ada cerita yang ditemukan.</p></div>')}renderStories(t){const a=this.getStoriesGrid();if(a){if(a.setAttribute("aria-busy","false"),t.length===0){this.showNoStories();return}a.innerHTML=t.map((e,s)=>`
        <article class="story-card" 
                 data-story-id="${e.id}" 
                 tabindex="0" 
                 role="button" 
                 aria-label="Lihat cerita: ${e.name||e.title||"Cerita Tanpa Judul"}"
                 aria-posinset="${s+1}"
                 aria-setsize="${t.length}">
          <figure class="story-figure">
            <img src="${e.photoUrl||"https://picsum.photos/400/300?random="+Math.floor(Math.random()*100)}" 
                 alt="${e.name||e.title||"Gambar cerita"}" 
                 class="story-image"
                 loading="lazy"
                 onerror="this.src='https://picsum.photos/400/300?random=1'">
            <button class="favorite-btn" 
                    data-story-id="${e.id}"
                    type="button"
                    aria-label="Tambahkan ke favorit"
                    title="Tambahkan ke favorit">
              ${i.heart}
            </button>
          </figure>
          <div class="story-content">
            <header class="story-header">
              <h3 class="story-title">${e.name||e.title||"Cerita Tanpa Judul"}</h3>
            </header>
            <div class="story-body">
              <p class="story-description">${e.description||"Tidak ada deskripsi."}</p>
            </div>
            <footer class="story-meta">
              <address class="story-location">
                ${i.mapPin}
                <span class="location-text">
                  ${e.lat&&e.lon?`${e.lat.toFixed(4)}, ${e.lon.toFixed(4)}`:"Lokasi tidak tersedia"}
                </span>
              </address>
              <time class="story-date" datetime="${e.createdAt||""}">
                ${e.createdAt?new Date(e.createdAt).toLocaleDateString():"Tanggal tidak diketahui"}
              </time>
            </footer>
          </div>
        </article>
      `).join(""),this.bindStoryCardEvents()}}bindStoryCardEvents(){document.querySelectorAll(".story-card").forEach(t=>{const a=t.cloneNode(!0);t.parentNode.replaceChild(a,t)}),document.querySelectorAll(".story-card").forEach(t=>{t.addEventListener("click",a=>{if(a.target.closest(".favorite-btn"))return;const e=t.getAttribute("data-story-id");this.storyCardClickCallback&&this.storyCardClickCallback(e)}),t.addEventListener("keydown",a=>{if(a.key==="Enter"||a.key===" "){a.preventDefault();const e=t.getAttribute("data-story-id");this.storyCardClickCallback&&this.storyCardClickCallback(e)}})}),document.querySelectorAll(".favorite-btn").forEach(t=>{t.addEventListener("click",async a=>{a.stopPropagation();const e=t.getAttribute("data-story-id");this.addToFavoritesCallback&&await this.addToFavoritesCallback(e)})})}onStoryCardClick(t){this.storyCardClickCallback=t}onAddToFavorites(t){this.addToFavoritesCallback=t}getMapContainer(){return document.getElementById("home-map")}getStoriesGrid(){return document.getElementById("stories-grid")}getAllStoryCards(){return document.querySelectorAll(".story-card")}getStoriesContainer(){return document.getElementById("stories-container")}}export{n as HomeView};
