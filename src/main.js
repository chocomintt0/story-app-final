import { App } from "./app/App.js"
import { StoryModel } from "./models/StoryModel.js"
import { IndexedDBService } from "./services/IndexedDBService.js"
import { PushNotificationService } from "./services/PushNotificationService.js"
import { PWAService } from "./services/PWAService.js"

const indexedDBService = new IndexedDBService()
const pushNotificationService = new PushNotificationService()
const pwaService = new PWAService()
const storyModel = new StoryModel()
const app = new App(storyModel)

window.app = app
window.storyModel = storyModel
window.indexedDBService = indexedDBService
window.pushNotificationService = pushNotificationService
window.pwaService = pwaService

async function initializeApp() {
  try {
    console.log("Initializing Story Explorer PWA...")

    await indexedDBService.init()
    console.log("IndexedDB initialized")

    pwaService.init()
    console.log("PWA service initialized")

    const pushInitialized = await pushNotificationService.init()
    if (pushInitialized) {
      console.log("Push notification service initialized")
      setTimeout(() => {
        showNotificationBanner()
      }, 5000)
    }

    app.init()
    console.log("Application initialized successfully")
  } catch (error) {
    console.error("Error initializing application:", error)
    app.init()
  }
}

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

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.addEventListener("message", (event) => {
    console.log("Received message from Service Worker:", event.data)

    if (event.data.type === "SYNC_COMPLETE") {
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

initializeApp()
