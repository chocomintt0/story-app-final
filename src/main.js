// Main Application Entry Point with PWA support
import { App } from "./app/App.js"
import { StoryModel } from "./models/StoryModel.js"
import { IndexedDBService } from "./services/IndexedDBService.js"
import { PushNotificationService } from "./services/PushNotificationService.js"
import { PWAService } from "./services/PWAService.js"

// Initialize services
const indexedDBService = new IndexedDBService()
const pushNotificationService = new PushNotificationService()
const pwaService = new PWAService()
const storyModel = new StoryModel()
const app = new App(storyModel)

// Make services globally available
window.app = app
window.storyModel = storyModel
window.indexedDBService = indexedDBService
window.pushNotificationService = pushNotificationService
window.pwaService = pwaService

// Initialize application
async function initializeApp() {
  try {
    console.log("Initializing Story Explorer PWA...")

    // Initialize IndexedDB
    await indexedDBService.init()
    console.log("IndexedDB initialized")

    // Initialize PWA features
    pwaService.init()
    console.log("PWA service initialized")

    // Initialize push notifications
    const pushInitialized = await pushNotificationService.init()
    if (pushInitialized) {
      console.log("Push notification service initialized")
      // Show notification permission banner after a delay
      setTimeout(() => {
        showNotificationBanner()
      }, 5000)
    }

    // Start the main application
    app.init()
    console.log("Application initialized successfully")
  } catch (error) {
    console.error("Error initializing application:", error)
    // Still start the app even if some services fail
    app.init()
  }
}

// Show notification permission banner
function showNotificationBanner() {
  const permission = pushNotificationService.getPermissionStatus()

  if (permission === "default") {
    const banner = document.getElementById("notification-banner")
    const enableBtn = document.getElementById("enable-notifications")
    const dismissBtn = document.getElementById("dismiss-notifications")

    if (banner) {
      banner.classList.remove("hidden")

      if (enableBtn) {
        enableBtn.addEventListener("click", async () => {
          const granted = await pushNotificationService.requestPermission()
          if (granted) {
            banner.classList.add("hidden")
            // Show test notification
            setTimeout(() => {
              pushNotificationService.showNotification("Notifications Enabled!", {
                body: "You'll now receive updates about new stories.",
                tag: "welcome-notification",
              })
            }, 1000)
          }
        })
      }

      if (dismissBtn) {
        dismissBtn.addEventListener("click", () => {
          banner.classList.add("hidden")
          localStorage.setItem("notificationPromptDismissed", Date.now().toString())
        })
      }
    }
  }
}

// Service Worker message handling
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.addEventListener("message", (event) => {
    console.log("Received message from Service Worker:", event.data)

    if (event.data.type === "SYNC_COMPLETE") {
      // Show sync success message
      const notification = document.createElement("div")
      notification.className = "sync-notification"
      notification.innerHTML = `
        <div class="notification-content">
          <span class="sync-icon">✅</span>
          <span class="sync-text">${event.data.message}</span>
        </div>
      `

      document.body.appendChild(notification)

      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification)
        }
      }, 3000)
    }
  })
}

// Start the application
initializeApp()
