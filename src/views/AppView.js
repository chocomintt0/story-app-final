import { Icons } from "../utils/Icons.js"

export class AppView {
  constructor() {
    this.skipToContentCallback = null
    this.navLinkCallback = null
    this.logoutCallback = null
  }

  init() {
    this.setupEventListeners()
  }

  setupEventListeners() {
    document.addEventListener("click", (e) => {
      if (e.target.matches(".skip-link-hidden") || e.target.matches(".skip-link")) {
        e.preventDefault()
        e.stopPropagation()
        if (this.skipToContentCallback) {
          this.skipToContentCallback()
        }
        return false
      }

      if (e.target.matches(".nav-link") || e.target.closest(".nav-link")) {
        e.preventDefault()
        const link = e.target.matches(".nav-link") ? e.target : e.target.closest(".nav-link")
        const href = link.getAttribute("href")
        if (href && this.navLinkCallback) {
          this.navLinkCallback(href)
        }
      }

      if (e.target.matches(".logout-btn") || e.target.closest(".logout-btn")) {
        if (this.logoutCallback) {
          this.logoutCallback()
        }
      }
    })

    document.addEventListener("keydown", (e) => {
      if (
        (e.target.matches(".skip-link-hidden") || e.target.matches(".skip-link")) &&
        (e.key === "Enter" || e.key === " ")
      ) {
        e.preventDefault()
        e.stopPropagation()
        if (this.skipToContentCallback) {
          this.skipToContentCallback()
        }
        return false
      }
    })
  }

  onSkipToContent(callback) {
    this.skipToContentCallback = callback
  }

  onNavLinkClick(callback) {
    this.navLinkCallback = callback
  }

  onLogoutClick(callback) {
    this.logoutCallback = callback
  }

  focusMainContent() {
    const mainContent = document.getElementById("main-content")
    if (mainContent) {
      mainContent.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })

      setTimeout(() => {
        mainContent.focus()
      }, 300)
    }
  }

  renderNavigation(isAuthenticated, user = null) {
    const nav = document.getElementById("main-nav")
    if (!nav) return

    if (isAuthenticated) {
      const userName = user?.name || "User"
      nav.innerHTML = `
      <div class="nav-brand">
        ${Icons.bookOpen}
        <h1 class="site-title">Story Explorer</h1>
      </div>
      <div class="nav-right">
        <ul class="nav-menu" role="menubar" aria-label="Main menu">
          <li role="none">
            <a href="#home" class="nav-link active" role="menuitem" aria-label="Go to home page" aria-current="page">
              ${Icons.home}
              <span class="nav-text">Home</span>
            </a>
          </li>
          <li role="none">
            <a href="#add-story" class="nav-link" role="menuitem" aria-label="Add new story">
              ${Icons.plusCircle}
              <span class="nav-text">Add Story</span>
            </a>
          </li>
          <li role="none">
            <a href="#favorites" class="nav-link" role="menuitem" aria-label="View favorite stories">
              ${Icons.heart}
              <span class="nav-text">Favorites</span>
            </a>
          </li>
        </ul>
        <div class="user-info" role="complementary" aria-label="User information">
          <span class="user-avatar" aria-hidden="true">${Icons.user}</span>
          <span class="user-name">${userName}</span>
          <button class="logout-btn" type="button" title="Logout" aria-label="Logout from account">
            ${Icons.logOut}
          </button>
        </div>
      </div>
    `
    } else {
      nav.innerHTML = `
        <div class="nav-brand">
          ${Icons.bookOpen}
          <h1 class="site-title">Story Explorer</h1>
        </div>
        <ul class="nav-menu" role="menubar" aria-label="Main menu">
          <li role="none">
            <a href="#login" class="nav-link" role="menuitem" aria-label="Go to login page">
              ${Icons.logIn}
              <span class="nav-text">Login</span>
            </a>
          </li>
        </ul>
      `
    }
  }

  updateActiveNavLink(href) {
    const allLinks = document.querySelectorAll(".nav-link")
    allLinks.forEach((link) => {
      link.classList.remove("active")
      link.removeAttribute("aria-current")
      if (link.getAttribute("href") === href) {
        link.classList.add("active")
        link.setAttribute("aria-current", "page")
      }
    })
  }

  confirmLogout() {
    return confirm("Are you sure you want to logout?")
  }

  renderPageContent(content) {
    const contentElement = document.getElementById("app-content")
    if (contentElement) {
      contentElement.innerHTML = content
    }
  }

  renderNotFoundPage() {
    return `
      <article class="error-page">
        <header class="error-header">
          <h1 class="error-title">Page Not Found</h1>
        </header>
        <div class="error-content">
          <p class="error-message">The page you are looking for does not exist.</p>
          <nav class="error-nav">
            <a href="#home" class="btn btn-primary">Go to Home</a>
          </nav>
        </div>
      </article>
    `
  }

  renderErrorPage() {
    return `
      <article class="error-page">
        <header class="error-header">
          <h1 class="error-title">Error Loading Page</h1>
        </header>
        <div class="error-content">
          <p class="error-message">There was an error loading the page. Please try again.</p>
          <nav class="error-nav">
            <a href="#home" class="btn btn-primary">Go to Home</a>
          </nav>
        </div>
      </article>
    `
  }

  showLoading() {
    const loadingElement = document.getElementById("loading")
    if (loadingElement) {
      loadingElement.classList.remove("hidden")
      loadingElement.setAttribute("aria-busy", "true")
    }
  }

  hideLoading() {
    const loadingElement = document.getElementById("loading")
    if (loadingElement) {
      loadingElement.classList.add("hidden")
      loadingElement.setAttribute("aria-busy", "false")
    }
  }

  async animatePageTransition(loadPageCallback) {
    const contentElement = document.getElementById("app-content")
    if (!contentElement) return

    if (contentElement.firstElementChild) {
      const currentElement = contentElement.firstElementChild
      const animation = currentElement.animate(
        [
          { transform: "translateX(0)", opacity: 1 },
          { transform: "translateX(-100%)", opacity: 0 },
        ],
        {
          duration: 300,
          easing: "ease-in-out",
        },
      )

      await animation.finished
    }

    await loadPageCallback()

    const newElement = contentElement.firstElementChild
    if (newElement) {
      newElement.animate(
        [
          { transform: "translateX(100%)", opacity: 0 },
          { transform: "translateX(0)", opacity: 1 },
        ],
        {
          duration: 300,
          easing: "ease-in-out",
        },
      )
    }
  }

  getContentElement() {
    return document.getElementById("app-content")
  }

  getMainContentElement() {
    return document.getElementById("main-content")
  }

  getLoadingElement() {
    return document.getElementById("loading")
  }

  getNavElement() {
    return document.getElementById("main-nav")
  }
}
