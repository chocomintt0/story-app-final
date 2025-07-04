// Favorites View - Shows saved favorite stories from IndexedDB
import { Icons } from "../utils/Icons.js"

export class FavoritesView {
  constructor() {
    this.element = null
    this.storyCardClickCallback = null
    this.removeFromFavoritesCallback = null
    this.clearFavoritesCallback = null
    this.exportFavoritesCallback = null
  }

  render() {
    return `
      <article class="favorites-page">
        <header class="page-header">
          <h1 class="page-title">
            ${Icons.heart}
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
              ${Icons.trash}
              <span class="btn-text">Hapus Semua Favorit</span>
            </button>
            <button id="export-favorites" class="btn btn-primary" type="button">
              ${Icons.download}
              <span class="btn-text">Ekspor Favorit</span>
            </button>
          </div>
        </section>
      </article>
    `
  }
  
  showStoryDetail(story) {
    const locationText =
      story.lat && story.lon ? `${story.lat.toFixed(4)}, ${story.lon.toFixed(4)}` : "Lokasi tidak tersedia";
    const addedAtText = story.addedAt ? new Date(story.addedAt).toLocaleDateString() : "Tidak diketahui";

    alert(
      `Cerita: ${story.name || "Tanpa Judul"}\n\n` +
      `Deskripsi: ${story.description || "Tidak ada deskripsi"}\n\n` +
      `Lokasi: ${locationText}\n\n` +
      `Tanggal Dibuat: ${story.createdAt ? new Date(story.createdAt).toLocaleDateString() : "Tidak diketahui"}\n\n` +
      `Ditambahkan ke Favorit: ${addedAtText}`
    );
  }

  confirmAction(message) {
    return confirm(message);
  }

  showAlert(message) {
    alert(message);
  }

  showSuccessMessage(message) {
    const notification = document.createElement("div");
    notification.className = "success-notification";
    notification.innerHTML = `
      <div class="notification-content">
        <span class="success-icon">✅</span>
        <span class="success-text">${message}</span>
      </div>
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
  }

  downloadFile(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  showLoading() {
    const favoritesGrid = this.getFavoritesGrid()
    if (favoritesGrid) {
      favoritesGrid.setAttribute("aria-busy", "true")
      favoritesGrid.innerHTML = '<p class="loading-message">Memuat favorit...</p>'
    }
  }

  showError(message) {
    const favoritesGrid = this.getFavoritesGrid()
    if (favoritesGrid) {
      favoritesGrid.setAttribute("aria-busy", "false")
      favoritesGrid.innerHTML = `<div class="error-message" role="alert"><p>Error: ${message}</p></div>`
    }
  }

  showNoFavorites() {
    const favoritesGrid = this.getFavoritesGrid()
    if (favoritesGrid) {
      favoritesGrid.setAttribute("aria-busy", "false")
      favoritesGrid.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">${Icons.heart}</div>
          <h3 class="empty-title">Belum Ada Cerita Favorit</h3>
          <p class="empty-description">Cerita yang Anda tandai sebagai favorit akan muncul di sini dan tersedia secara offline.</p>
          <a href="#home" class="btn btn-primary">Lihat Cerita</a>
        </div>
      `
    }
  }

  renderFavorites(favorites) {
    const favoritesGrid = this.getFavoritesGrid()
    if (!favoritesGrid) return

    favoritesGrid.setAttribute("aria-busy", "false")

    if (favorites.length === 0) {
      this.showNoFavorites()
      return
    }

    favoritesGrid.innerHTML = favorites
      .map(
        (story, index) => `
          <article class="favorite-card" 
                   data-story-id="${story.id}" 
                   tabindex="0" 
                   role="button" 
                   aria-label="Lihat cerita favorit: ${story.name || story.title || "Cerita Tanpa Judul"}"
                   aria-posinset="${index + 1}"
                   aria-setsize="${favorites.length}">
            <figure class="story-figure">
              <img src="${story.photoUrl || "https://picsum.photos/400/300?random=" + Math.floor(Math.random() * 100)}" 
                   alt="${story.name || story.title || "Gambar cerita"}" 
                   class="story-image"
                   loading="lazy"
                   onerror="this.src='https://picsum.photos/400/300?random=1'">
              <button class="favorite-remove-btn" 
                      data-story-id="${story.id}"
                      type="button"
                      aria-label="Hapus dari favorit"
                      title="Hapus dari favorit">
                ${Icons.heartFilled}
              </button>
            </figure>
            <div class="story-content">
              <header class="story-header">
                <h3 class="story-title">${story.name || story.title || "Cerita Tanpa Judul"}</h3>
              </header>
              <div class="story-body">
                <p class="story-description">${story.description || "Tidak ada deskripsi."}</p>
              </div>
              <footer class="story-meta">
                <address class="story-location">
                  ${Icons.mapPin}
                  <span class="location-text">
                    ${story.lat && story.lon ? `${story.lat.toFixed(4)}, ${story.lon.toFixed(4)}` : "Lokasi tidak tersedia"}
                  </span>
                </address>
                <time class="added-date" datetime="${story.addedAt || ""}">
                  Ditambahkan: ${story.addedAt ? new Date(story.addedAt).toLocaleDateString() : "Tidak diketahui"}
                </time>
              </footer>
            </div>
          </article>
        `,
      )
      .join("")

    this.bindFavoriteCardEvents()
  }

  bindFavoriteCardEvents() {
    const favoriteCards = this.getAllFavoriteCards();
    const clearButton = document.getElementById("clear-favorites");
    const exportButton = document.getElementById("export-favorites");

    favoriteCards.forEach((card) => {
        const clonedCard = card.cloneNode(true);
        card.parentNode.replaceChild(clonedCard, card);
    });

    const newFavoriteCards = this.getAllFavoriteCards();
    newFavoriteCards.forEach((card) => {
        card.addEventListener("click", (e) => {
            if (e.target.closest(".favorite-remove-btn")) return;
            const storyId = card.getAttribute("data-story-id");
            if (this.storyCardClickCallback) {
                this.storyCardClickCallback(storyId);
            }
        });

        card.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                const storyId = card.getAttribute("data-story-id");
                if (this.storyCardClickCallback) {
                    this.storyCardClickCallback(storyId);
                }
            }
        });
    });

    const newRemoveButtons = document.querySelectorAll(".favorite-remove-btn");
    newRemoveButtons.forEach((button) => {
        button.addEventListener("click", (e) => {
            e.stopPropagation();
            const storyId = button.getAttribute("data-story-id");
            if (this.removeFromFavoritesCallback) {
                this.removeFromFavoritesCallback(storyId);
            }
        });
    });

    if (clearButton) {
        clearButton.addEventListener("click", () => {
            if (this.clearFavoritesCallback) this.clearFavoritesCallback();
        });
    }

    if (exportButton) {
        exportButton.addEventListener("click", () => {
            if (this.exportFavoritesCallback) this.exportFavoritesCallback();
        });
    }
  }


  onStoryCardClick(callback) {
    this.storyCardClickCallback = callback
  }

  onRemoveFromFavorites(callback) {
    this.removeFromFavoritesCallback = callback
  }

  onClearFavorites(callback) {
    this.clearFavoritesCallback = callback
  }

  onExportFavorites(callback) {
    this.exportFavoritesCallback = callback
  }

  // DOM element getters
  getFavoritesGrid() {
    return document.getElementById("favorites-grid")
  }

  getAllFavoriteCards() {
    return document.querySelectorAll(".favorite-card")
  }

  getFavoritesContainer() {
    return document.getElementById("favorites-container")
  }
}