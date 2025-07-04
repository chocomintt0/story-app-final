
export class Router {
    constructor() {
      this.routes = new Map()
      this.currentRoute = null
    }
  
    addRoute(path, handler) {
      this.routes.set(path, handler)
    }
  
    navigate(path) {
      window.location.hash = path
    }
  
    getCurrentRoute() {
      return window.location.hash.slice(1) || "home"
    }
  }
  