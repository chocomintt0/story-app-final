
import { AppView } from "../views/AppView.js"

export class App {
  constructor(model) {
    this.model = model
    this.view = new AppView()
    this.currentPresenter = null
    this.isTransitioning = false
  }

  init() {
    this.view.init()
    this.setupRouter()
    this.setupEventListeners()
    this.updateNavigation()
    this.handleInitialRoute()
  }

  setupRouter() {
    window.addEventListener("hashchange", () => {
      this.handleRouteChange()
    })
  }

  setupEventListeners() {
    
    this.view.onSkipToContent(() => this.handleSkipToContent())
    this.view.onNavLinkClick((href) => this.handleNavigation(href))
    this.view.onLogoutClick(() => this.handleLogout())
  }

  handleSkipToContent() {
    this.view.focusMainContent()
  }

  handleNavigation(href) {
    window.location.hash = href
    this.view.updateActiveNavLink(href)
  }

  updateNavigation() {
    const isAuthenticated = this.model.isAuthenticated()
    const user = this.model.getCurrentUser()
    this.view.renderNavigation(isAuthenticated, user)
  }

  handleLogout() {
    if (this.view.confirmLogout()) {
      this.model.logout()
      this.updateNavigation()
      window.location.hash = "#login"
    }
  }

  handleInitialRoute() {
    const isAuthenticated = this.model.isAuthenticated()
    let hash = window.location.hash || "#home"

    if (!isAuthenticated && hash !== "#login") {
      hash = "#login"
    }

    window.location.hash = hash
    this.handleRouteChange()
  }

  async handleRouteChange() {
    if (this.isTransitioning) return

    const hash = window.location.hash.slice(1) || "home"

    
    if (hash === "main-content") {
      return
    }

    const isAuthenticated = this.model.isAuthenticated()
    const protectedRoutes = ["home", "add-story", "favorites"]

    if (protectedRoutes.includes(hash) && !isAuthenticated) {
      window.location.hash = "#login"
      return
    }

    await this.navigateToPage(hash)
  }

  async navigateToPage(pageName) {
    if (this.isTransitioning) return

    this.isTransitioning = true
    this.view.showLoading()

    try {
      if (document.startViewTransition) {
        await document.startViewTransition(async () => {
          await this.loadPage(pageName)
        })
      } else {
        await this.loadPageWithCustomAnimation(pageName)
      }
    } catch (error) {
      console.error("Navigation error:", error)
    } finally {
      this.view.hideLoading()
      this.isTransitioning = false
    }
  }

  async loadPage(pageName) {
    try {
      
      if (this.currentPresenter && this.currentPresenter.destroy) {
        this.currentPresenter.destroy()
      }

      let pageContent = ""

      switch (pageName) {
        case "home":
          const { HomeView } = await import("../views/HomeView.js")
          const { HomePresenter } = await import("../presenters/HomePresenter.js")
          const homeView = new HomeView()
          const homePresenter = new HomePresenter(this.model, homeView)
          pageContent = homeView.render()
          this.currentPresenter = homePresenter
          break

        case "add-story":
          const { AddStoryView } = await import("../views/AddStoryView.js")
          const { AddStoryPresenter } = await import("../presenters/AddStoryPresenter.js")
          const addStoryView = new AddStoryView()
          const addStoryPresenter = new AddStoryPresenter(this.model, addStoryView)
          pageContent = addStoryView.render()
          this.currentPresenter = addStoryPresenter
          break

        case "favorites":
          const { FavoritesView } = await import("../views/FavoritesView.js")
          const { FavoritesPresenter } = await import("../presenters/FavoritesPresenter.js")
          const favoritesView = new FavoritesView()
          const favoritesPresenter = new FavoritesPresenter(this.model, favoritesView)
          pageContent = favoritesView.render()
          this.currentPresenter = favoritesPresenter
          break

        case "login":
          const { LoginView } = await import("../views/LoginView.js")
          const { LoginPresenter } = await import("../presenters/LoginPresenter.js")
          const loginView = new LoginView()
          const loginPresenter = new LoginPresenter(this.model, loginView)
          pageContent = loginView.render()
          this.currentPresenter = loginPresenter
          break

        default:
          const { NotFoundView } = await import("../views/NotFoundView.js")
          const notFoundView = new NotFoundView()
          pageContent = notFoundView.render()
          this.currentPresenter = notFoundView
      }

      this.view.renderPageContent(pageContent)

      if (this.currentPresenter && this.currentPresenter.init) {
        await this.currentPresenter.init()
      }

      
      setTimeout(() => {
        this.view.focusMainContent()
      }, 100)
    } catch (error) {
      console.error("Error loading page:", error)
      this.view.renderErrorPage()
    }
  }

  async loadPageWithCustomAnimation(pageName) {
    await this.view.animatePageTransition(async () => {
      await this.loadPage(pageName)
    })
  }

  showLoading() {
    this.view.showLoading()
  }

  hideLoading() {
    this.view.hideLoading()
  }
}
