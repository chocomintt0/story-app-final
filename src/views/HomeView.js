import { Icons } from "../utils/Icons.js"

export class HomeView {
  constructor() {
    this.element = null
    this.storyCardClickCallback = null
    this.addToFavoritesCallback = null
  }

  render() {
    return `
      <article class="home-page">
        <header class="page-header">
          <h1 class="page-title">
            ${Icons.map}
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
    `
  }
  
  createPopupContent(story) {
    return `
      <div style="max-width: 200px;">
        <img src="${story.photoUrl || 'https://picsum.photos/200/100'}" 
             alt="${story.name || 'Gambar Cerita'}" 
             style="width: 100%; height: 100px; object-fit: cover; border-radius: 4px; margin-bottom: 8px;"
             onerror="this.src='https://picsum.photos/200/100?random=1'">
        <h4 style="margin: 0 0 8px 0; font-size: 14px;">${story.name || "Cerita Tanpa Judul"}</h4>
        <p style="margin: 0; font-size: 12px; color: #666;">${(story.description || "Tidak ada deskripsi").substring(0, 100)}...</p>
      </div>
    `;
  }

  showSuccessMessage(message) {
    const notification = document.createElement("div");
    notification.className = "success-notification";
    notification.innerHTML = `
      <div class="notification-content">
        <span class="success-icon">⭐</span>
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
  
  updateFavoriteButton(storyId, isFavorite) {
    const button = document.querySelector(`[data-story-id="${storyId}"] .favorite-btn`);
    if (button) {
      if (isFavorite) {
        button.innerHTML = Icons.heartFilled;
        button.setAttribute("aria-label", "Hapus dari favorit");
        button.classList.add("favorited");
      } else {
        button.innerHTML = Icons.heart;
        button.setAttribute("aria-label", "Tambahkan ke favorit");
        button.classList.remove("favorited");
      }
    }
  }

  showStoryDetail(story) {
    const locationText =
      story.lat && story.lon ? `${story.lat.toFixed(4)}, ${story.lon.toFixed(4)}` : "Lokasi tidak tersedia";

    alert(
      `Cerita: ${story.name || "Tanpa Judul"}\n\n` +
      `Deskripsi: ${story.description || "Tidak ada deskripsi"}\n\n` +
      `Lokasi: ${locationText}\n\n` +
      `Tanggal: ${story.createdAt ? new Date(story.createdAt).toLocaleDateString() : "Tanggal tidak diketahui"}`
    );
  }
  
  showAlert(message) {
    alert(message);
  }

  showLoading() {
    const storiesGrid = this.getStoriesGrid()
    if (storiesGrid) {
      storiesGrid.setAttribute("aria-busy", "true")
      storiesGrid.innerHTML = '<p class="loading-message">Memuat cerita...</p>'
    }
  }

  showError(message) {
    const storiesGrid = this.getStoriesGrid()
    if (storiesGrid) {
      storiesGrid.setAttribute("aria-busy", "false")
      storiesGrid.innerHTML = `<div class="error-message" role="alert"><p>Error: ${message}</p></div>`
    }
  }

  showNoStories() {
    const storiesGrid = this.getStoriesGrid()
    if (storiesGrid) {
      storiesGrid.setAttribute("aria-busy", "false")
      storiesGrid.innerHTML = '<div class="empty-state"><p>Tidak ada cerita yang ditemukan.</p></div>'
    }
  }

  renderStories(stories) {
    const storiesGrid = this.getStoriesGrid()
    if (!storiesGrid) return

    storiesGrid.setAttribute("aria-busy", "false")

    if (stories.length === 0) {
      this.showNoStories()
      return
    }

    storiesGrid.innerHTML = stories
      .map(
        (story, index) => `
        <article class="story-card" 
                 data-story-id="${story.id}" 
                 tabindex="0" 
                 role="button" 
                 aria-label="Lihat cerita: ${story.name || story.title || "Cerita Tanpa Judul"}"
                 aria-posinset="${index + 1}"
                 aria-setsize="${stories.length}">
          <figure class="story-figure">
            <img src="${story.photoUrl || "https://picsum.photos/400/300?random=" + Math.floor(Math.random() * 100)}" 
                 alt="${story.name || story.title || "Gambar cerita"}" 
                 class="story-image"
                 loading="lazy"
                 onerror="this.src='https://picsum.photos/400/300?random=1'">
            <button class="favorite-btn" 
                    data-story-id="${story.id}"
                    type="button"
                    aria-label="Tambahkan ke favorit"
                    title="Tambahkan ke favorit">
              ${Icons.heart}
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
              <time class="story-date" datetime="${story.createdAt || ""}">
                ${story.createdAt ? new Date(story.createdAt).toLocaleDateString() : "Tanggal tidak diketahui"}
              </time>
            </footer>
          </div>
        </article>
      `,
      )
      .join("")

    this.bindStoryCardEvents()
  }

  bindStoryCardEvents() {
    document.querySelectorAll(".story-card").forEach(card => {
        const clonedCard = card.cloneNode(true);
        card.parentNode.replaceChild(clonedCard, card);
    });

    document.querySelectorAll(".story-card").forEach(card => {
        card.addEventListener("click", (e) => {
            if (e.target.closest(".favorite-btn")) return;
            const storyId = card.getAttribute("data-story-id");
            if (this.storyCardClickCallback) this.storyCardClickCallback(storyId);
        });

        card.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                const storyId = card.getAttribute("data-story-id");
                if (this.storyCardClickCallback) this.storyCardClickCallback(storyId);
            }
        });
    });

    document.querySelectorAll(".favorite-btn").forEach(button => {
        button.addEventListener("click", async (e) => {
            e.stopPropagation();
            const storyId = button.getAttribute("data-story-id");
            if (this.addToFavoritesCallback) await this.addToFavoritesCallback(storyId);
        });
    });
  }


  onStoryCardClick(callback) {
    this.storyCardClickCallback = callback
  }

  onAddToFavorites(callback) {
    this.addToFavoritesCallback = callback
  }

  getMapContainer() {
    return document.getElementById("home-map")
  }

  getStoriesGrid() {
    return document.getElementById("stories-grid")
  }

  getAllStoryCards() {
    return document.querySelectorAll(".story-card")
  }

  getStoriesContainer() {
    return document.getElementById("stories-container")
  }
}