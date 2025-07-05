export class PWAService {
    constructor() {
      this.deferredPrompt = null
      this.isInstalled = false
      this.isOnline = navigator.onLine
      this.installButton = null
      this.installBanner = null
    }
  
    init() {
      this.setupInstallPrompt()
      this.setupOfflineDetection()
      this.checkIfInstalled()
      this.setupInstallBanner()
    }
  
    setupInstallPrompt() {
      window.addEventListener("beforeinstallprompt", (e) => {
        console.log("PWA install prompt available")
        e.preventDefault()
        this.deferredPrompt = e
        this.showInstallBanner()
      })
  
      window.addEventListener("appinstalled", () => {
        console.log("PWA was installed")
        this.isInstalled = true
        this.hideInstallBanner()
        this.deferredPrompt = null
  
        this.showInstallSuccess()
      })
    }
  
    setupOfflineDetection() {
      window.addEventListener("online", () => {
        console.log("App is online")
        this.isOnline = true
        this.hideOfflineIndicator()
        this.syncOfflineData()
      })
  
      window.addEventListener("offline", () => {
        console.log("App is offline")
        this.isOnline = false
        this.showOfflineIndicator()
      })
  
      if (!this.isOnline) {
        this.showOfflineIndicator()
      }
    }
  
    checkIfInstalled() {
      if (window.matchMedia("(display-mode: standalone)").matches) {
        this.isInstalled = true
        console.log("PWA is running in standalone mode")
      }
  
      if (window.navigator.standalone === true) {
        this.isInstalled = true
        console.log("PWA is running in iOS standalone mode")
      }
    }
  
    setupInstallBanner() {
      this.installBanner = document.getElementById("install-banner")
      this.installButton = document.getElementById("install-button")
      const dismissButton = document.getElementById("dismiss-install")
  
      if (this.installButton) {
        this.installButton.addEventListener("click", () => {
          this.promptInstall()
        })
      }
  
      if (dismissButton) {
        dismissButton.addEventListener("click", () => {
          this.hideInstallBanner()
          localStorage.setItem("installPromptDismissed", Date.now().toString())
        })
      }
    }
  
    showInstallBanner() {
      const dismissedTime = localStorage.getItem("installPromptDismissed")
      if (dismissedTime) {
        const daysSinceDismissed = (Date.now() - Number.parseInt(dismissedTime)) / (1000 * 60 * 60 * 24)
        if (daysSinceDismissed < 7) {
          return
        }
      }
  
      if (this.isInstalled) {
        return
      }
  
      if (this.installBanner) {
        this.installBanner.classList.remove("hidden")
        this.installBanner.setAttribute("aria-hidden", "false")
      }
    }
  
    hideInstallBanner() {
      if (this.installBanner) {
        this.installBanner.classList.add("hidden")
        this.installBanner.setAttribute("aria-hidden", "true")
      }
    }
  
    async promptInstall() {
      if (!this.deferredPrompt) {
        console.log("Install prompt not available")
        return false
      }
  
      try {
        this.deferredPrompt.prompt()
  
        const { outcome } = await this.deferredPrompt.userChoice
        console.log(`User response to install prompt: ${outcome}`)
  
        if (outcome === "accepted") {
          console.log("User accepted the install prompt")
        } else {
          console.log("User dismissed the install prompt")
        }
  
        this.deferredPrompt = null
        this.hideInstallBanner()
  
        return outcome === "accepted"
      } catch (error) {
        console.error("Error showing install prompt:", error)
        return false
      }
    }
  
    showOfflineIndicator() {
      const indicator = document.getElementById("offline-indicator")
      if (indicator) {
        indicator.classList.remove("hidden")
        indicator.setAttribute("aria-hidden", "false")
      }
    }
  
    hideOfflineIndicator() {
      const indicator = document.getElementById("offline-indicator")
      if (indicator) {
        indicator.classList.add("hidden")
        indicator.setAttribute("aria-hidden", "true")
      }
    }
  
    showInstallSuccess() {
      const notification = document.createElement("div")
      notification.className = "install-success-notification"
      notification.innerHTML = `
        <div class="notification-content">
          <span class="success-icon">✅</span>
          <span class="success-text">Story Explorer installed successfully!</span>
        </div>
      `
  
      document.body.appendChild(notification)
  
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification)
        }
      }, 3000)
    }
  
    async syncOfflineData() {
      if (!this.isOnline) return
  
      try {
        const offlineQueue = await window.indexedDBService.getOfflineQueue()
  
        if (offlineQueue.length === 0) return
  
        console.log(`Syncing ${offlineQueue.length} offline actions`)
  
        for (const action of offlineQueue) {
          try {
            if (action.type === "addStory") {
              await window.storyModel.addStory(action.data)
              await window.indexedDBService.removeFromOfflineQueue(action.id)
              console.log("Synced offline story:", action.id)
            }
          } catch (error) {
            console.error("Failed to sync offline action:", error)
          }
        }
  
        this.showSyncSuccess(offlineQueue.length)
      } catch (error) {
        console.error("Error syncing offline data:", error)
      }
    }
  
    showSyncSuccess(count) {
      const notification = document.createElement("div")
      notification.className = "sync-success-notification"
      notification.innerHTML = `
        <div class="notification-content">
          <span class="sync-icon">🔄</span>
          <span class="sync-text">Synced ${count} offline ${count === 1 ? "action" : "actions"}</span>
        </div>
      `
  
      document.body.appendChild(notification)
  
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification)
        }
      }, 3000)
    }
  
    isInstallable() {
      return !!this.deferredPrompt
    }
  
    isStandalone() {
      return this.isInstalled
    }
  
    getInstallationStatus() {
      return {
        isInstalled: this.isInstalled,
        isInstallable: this.isInstallable(),
        isOnline: this.isOnline,
      }
    }
  }
  