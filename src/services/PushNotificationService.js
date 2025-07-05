export class PushNotificationService {
  constructor() {
    this.vapidPublicKey = "BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk";
    this.registration = null;
    this.subscription = null;
  }

  async init() {
    if (!("serviceWorker" in navigator)) {
      console.warn("Service Worker not supported");
      return false;
    }

    if (!("PushManager" in window)) {
      console.warn("Push messaging not supported");
      return false;
    }

    try {
      this.registration = await navigator.serviceWorker.register("/sw.js");
      console.log("Service Worker registered successfully");

      await navigator.serviceWorker.ready;
      console.log("Service Worker is ready");

      return true;
    } catch (error) {
      console.error("Service Worker registration failed:", error);
      return false;
    }
  }

  async requestPermission() {
    if (!("Notification" in window)) {
      console.warn("Notifications not supported");
      return false;
    }

    let permission = Notification.permission;

    if (permission === "default") {
      permission = await Notification.requestPermission();
    }

    if (permission === "granted") {
      console.log("Notification permission granted");
      await this.subscribeToPush();
      return true;
    } else {
      console.log("Notification permission denied");
      return false;
    }
  }

  async subscribeToPush() {
    if (!this.registration) {
      console.error("Service Worker not registered");
      return false;
    }

    try {
      this.subscription = await this.registration.pushManager.getSubscription();

      if (!this.subscription) {
        this.subscription = await this.registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: this.urlBase64ToUint8Array(this.vapidPublicKey),
        });

        console.log("Push subscription created:", this.subscription);
      }

      await this.sendSubscriptionToServer(this.subscription);
      return true;
    } catch (error) {
      console.error("Failed to subscribe to push notifications:", error);
      return false;
    }
  }

  async sendSubscriptionToServer(subscription) {
    localStorage.setItem("pushSubscription", JSON.stringify(subscription));
    console.log("Push subscription stored locally");
  }

  async unsubscribe() {
    if (this.subscription) {
      try {
        await this.subscription.unsubscribe();
        this.subscription = null;
        localStorage.removeItem("pushSubscription");
        console.log("Unsubscribed from push notifications");
        return true;
      } catch (error) {
        console.error("Failed to unsubscribe:", error);
        return false;
      }
    }
    return false;
  }

  isSubscribed() {
    return !!this.subscription;
  }

  getPermissionStatus() {
    if (!("Notification" in window)) {
      return "unsupported";
    }
    return Notification.permission;
  }

  urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  async showNotification(title, options = {}) {
    if (Notification.permission === "granted" && this.registration) {
      const defaultOptions = {
        body: "New story available!",
        icon: "/icons/notification.png",
        badge: "/icons/notification.png",
        tag: "story-notification",
        requireInteraction: false,
        actions: [
          {
            action: "view",
            title: "View Story",
          },
          {
            action: "dismiss",
            title: "Dismiss",
          },
        ],
      };

      const notificationOptions = { ...defaultOptions, ...options };

      try {
        await this.registration.showNotification(title, notificationOptions);
        console.log("Notification shown:", title);
      } catch (error) {
        console.error("Failed to show notification:", error);
      }
    }
  }
}