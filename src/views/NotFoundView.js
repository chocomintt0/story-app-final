import { Icons } from "../utils/Icons.js"

export class NotFoundView {
  constructor() {
    this.element = null
  }

  render() {
    return `
      <article class="not-found-page">
        <header class="error-header">
          <div class="error-icon-container">
            <span class="error-icon" aria-hidden="true">🔍</span>
          </div>
          <h1 class="error-title">Page Not Found</h1>
          <p class="error-subtitle">Error 404</p>
        </header>
        
        <section class="error-content">
          <div class="error-description">
            <p class="error-message">
              Oops! The page you're looking for doesn't exist.
            </p>
          </div>
          
          <nav class="error-navigation" aria-label="Error page navigation">
            <div class="error-actions">
              <a href="#home" class="btn btn-primary">
                ${Icons.home}
                <span class="btn-text">Go to Home</span>
              </a>
              <button id="go-back" class="btn btn-secondary" type="button">
                ${Icons.arrowLeft}
                <span class="btn-text">Go Back</span>
              </button>
            </div>
          </nav>
        </section>

        <aside class="error-suggestions">
          <h2 class="suggestions-title">You might be looking for:</h2>
          <ul class="suggestions-list">
            <li class="suggestion-item">
              <a href="#home" class="suggestion-link">
                ${Icons.map}
                <span class="suggestion-text">Browse Stories</span>
              </a>
            </li>
            <li class="suggestion-item">
              <a href="#add-story" class="suggestion-link">
                ${Icons.plusCircle}
                <span class="suggestion-text">Add New Story</span>
              </a>
            </li>
            <li class="suggestion-item">
              <a href="#favorites" class="suggestion-link">
                ${Icons.heart}
                <span class="suggestion-text">View Favorites</span>
              </a>
            </li>
          </ul>
        </aside>
      </article>
    `
  }

  init() {
    this.setupEventListeners()
  }

  setupEventListeners() {
    const goBackButton = document.getElementById("go-back")

    if (goBackButton) {
      goBackButton.addEventListener("click", () => {
        if (window.history.length > 1) {
          window.history.back()
        } else {
          window.location.hash = "#home"
        }
      })
    }
  }
}
