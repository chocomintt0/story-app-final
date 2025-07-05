import{I as o}from"./main-DJR8oUtS.js";class v{constructor(){this.element=null,this.storyCardClickCallback=null,this.removeFromFavoritesCallback=null,this.clearFavoritesCallback=null,this.exportFavoritesCallback=null}render(){return`
      <article class="favorites-page">
        <header class="page-header">
          <h1 class="page-title">
            ${o.heart}
            Favorite Stories
          </h1>
          <p class="page-description">Cerita yang Anda simpan akan tersedia secara offline</p>
        </header>
        
        <section class="favorites-section" aria-labelledby="favorites-heading">
          <h2 id="favorites-heading" class="visually-hidden">Koleksi Cerita Favorit</h2>
          <div id="favorites-container" class="favorites-container">
            <div class="favorites-grid" id="favorites-grid" role="feed" aria-label="Favorites feed" aria-busy="false">
              <p class="loading-message">Memuat favorit...</p>
            </div>
          </div>
        </section>

        <section class="favorites-actions" aria-labelledby="actions-heading">
          <h2 id="actions-heading" class="visually-hidden">Tindakan Favorit</h2>
          <div class="action-buttons">
            <button id="clear-favorites" class="btn btn-secondary" type="button">
              ${o.trash}
              <span class="btn-text">Hapus Semua Favorit</span>
            </button>
            <button id="export-favorites" class="btn btn-primary" type="button">
              ${o.download}
              <span class="btn-text">Unduh Favorit</span>
            </button>
          </div>
        </section>
      </article>
    `}showStoryDetail(t){const a=t.lat&&t.lon?`${t.lat.toFixed(4)}, ${t.lon.toFixed(4)}`:"Lokasi tidak tersedia",e=t.addedAt?new Date(t.addedAt).toLocaleDateString():"Tidak diketahui";alert(`Cerita: ${t.name||"Tanpa Judul"}

Deskripsi: ${t.description||"Tidak ada deskripsi"}

Lokasi: ${a}

Tanggal Dibuat: ${t.createdAt?new Date(t.createdAt).toLocaleDateString():"Tidak diketahui"}

Ditambahkan ke Favorit: ${e}`)}confirmAction(t){return confirm(t)}showAlert(t){alert(t)}showSuccessMessage(t){const a=document.createElement("div");a.className="success-notification",a.innerHTML=`
      <div class="notification-content">
        <span class="success-icon">✅</span>
        <span class="success-text">${t}</span>
      </div>
    `,document.body.appendChild(a),setTimeout(()=>{a.parentNode&&a.parentNode.removeChild(a)},3e3)}downloadFile(t,a){const e=new Blob([JSON.stringify(t,null,2)],{type:"application/json"}),n=URL.createObjectURL(e),r=document.createElement("a");r.href=n,r.download=a,document.body.appendChild(r),r.click(),document.body.removeChild(r),URL.revokeObjectURL(n)}showLoading(){const t=this.getFavoritesGrid();t&&(t.setAttribute("aria-busy","true"),t.innerHTML='<p class="loading-message">Memuat favorit...</p>')}showError(t){const a=this.getFavoritesGrid();a&&(a.setAttribute("aria-busy","false"),a.innerHTML=`<div class="error-message" role="alert"><p>Error: ${t}</p></div>`)}showNoFavorites(){const t=this.getFavoritesGrid();t&&(t.setAttribute("aria-busy","false"),t.innerHTML=`
        <div class="empty-state">
          <div class="empty-icon">${o.heart}</div>
          <h3 class="empty-title">Belum Ada Cerita Favorit</h3>
          <p class="empty-description">Cerita yang Anda tandai sebagai favorit akan muncul di sini dan tersedia secara offline.</p>
          <a href="#home" class="btn btn-primary">Lihat Cerita</a>
        </div>
      `)}renderFavorites(t){const a=this.getFavoritesGrid();if(a){if(a.setAttribute("aria-busy","false"),t.length===0){this.showNoFavorites();return}a.innerHTML=t.map((e,n)=>`
          <article class="favorite-card" 
                   data-story-id="${e.id}" 
                   tabindex="0" 
                   role="button" 
                   aria-label="Lihat cerita favorit: ${e.name||e.title||"Cerita Tanpa Judul"}"
                   aria-posinset="${n+1}"
                   aria-setsize="${t.length}">
            <figure class="story-figure">
              <img src="${e.photoUrl||"https://picsum.photos/400/300?random="+Math.floor(Math.random()*100)}" 
                   alt="${e.name||e.title||"Gambar cerita"}" 
                   class="story-image"
                   loading="lazy"
                   onerror="this.src='https://picsum.photos/400/300?random=1'">
              <button class="favorite-remove-btn" 
                      data-story-id="${e.id}"
                      type="button"
                      aria-label="Hapus dari favorit"
                      title="Hapus dari favorit">
                ${o.heartFilled}
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
                  ${o.mapPin}
                  <span class="location-text">
                    ${e.lat&&e.lon?`${e.lat.toFixed(4)}, ${e.lon.toFixed(4)}`:"Lokasi tidak tersedia"}
                  </span>
                </address>
                <time class="added-date" datetime="${e.addedAt||""}">
                  Ditambahkan: ${e.addedAt?new Date(e.addedAt).toLocaleDateString():"Tidak diketahui"}
                </time>
              </footer>
            </div>
          </article>
        `).join(""),this.bindFavoriteCardEvents()}}bindFavoriteCardEvents(){const t=this.getAllFavoriteCards(),a=document.getElementById("clear-favorites"),e=document.getElementById("export-favorites");t.forEach(i=>{const s=i.cloneNode(!0);i.parentNode.replaceChild(s,i)}),this.getAllFavoriteCards().forEach(i=>{i.addEventListener("click",s=>{if(s.target.closest(".favorite-remove-btn"))return;const l=i.getAttribute("data-story-id");this.storyCardClickCallback&&this.storyCardClickCallback(l)}),i.addEventListener("keydown",s=>{if(s.key==="Enter"||s.key===" "){s.preventDefault();const l=i.getAttribute("data-story-id");this.storyCardClickCallback&&this.storyCardClickCallback(l)}})}),document.querySelectorAll(".favorite-remove-btn").forEach(i=>{i.addEventListener("click",s=>{s.stopPropagation();const l=i.getAttribute("data-story-id");this.removeFromFavoritesCallback&&this.removeFromFavoritesCallback(l)})}),a&&a.addEventListener("click",()=>{this.clearFavoritesCallback&&this.clearFavoritesCallback()}),e&&e.addEventListener("click",()=>{this.exportFavoritesCallback&&this.exportFavoritesCallback()})}onStoryCardClick(t){this.storyCardClickCallback=t}onRemoveFromFavorites(t){this.removeFromFavoritesCallback=t}onClearFavorites(t){this.clearFavoritesCallback=t}onExportFavorites(t){this.exportFavoritesCallback=t}getFavoritesGrid(){return document.getElementById("favorites-grid")}getAllFavoriteCards(){return document.querySelectorAll(".favorite-card")}getFavoritesContainer(){return document.getElementById("favorites-container")}}export{v as FavoritesView};
