const CommunicationBridge = (() => {
  let messages = []
  let notifications = []
  let announcements = []
  let isConnected = false
  const messageListeners = []
  let initialized = false

  const init = () => {
    if (initialized) {
      console.log("[v0] Communication Bridge already initialized")
      return
    }
    initialized = true

    console.log("[v0] Initializing Communication Bridge...")
    setupBridgeConnection()
    setupMessageListeners()
    setupNotificationSystem()
    setupAnnouncementSystem()
    loadMessagesFromStorage()
    broadcastWebsiteReady()
    setTimeout(() => {
      checkConnection()
    }, 100)
  }

  const setupBridgeConnection = () => {
    // Establish connection with admin dashboard
    window.addEventListener("adminDashboardReady", () => {
      isConnected = true
      console.log("[v0] ✅ Connected to admin dashboard")
      broadcastConnectionStatus(true)
    })

    // Listen for admin messages
    window.addEventListener("adminMessage", (e) => {
      handleAdminMessage(e.detail)
    })

    // Listen for settings updates
    window.addEventListener("settingsUpdated", (e) => {
      handleSettingsUpdate(e.detail.settings)
    })

    // Listen for product updates
    window.addEventListener("productsUpdated", (e) => {
      handleProductsUpdate(e.detail.products)
    })

    // Listen for home content updates
    window.addEventListener("homeContentUpdated", (e) => {
      handleHomeContentUpdate(e.detail.homeContent)
    })

    setInterval(() => {
      checkConnection()
    }, 10000)
  }

  const setupMessageListeners = () => {
    // Allow external code to listen for messages
    window.CommunicationBridge = {
      onMessage: (callback) => {
        messageListeners.push(callback)
      },
      sendMessage: (message) => {
        broadcastMessage(message)
      },
      getMessages: () => messages,
      getNotifications: () => notifications,
      getAnnouncements: () => announcements,
      isConnected: () => isConnected,
    }
  }

  const setupNotificationSystem = () => {
    // Create notification container
    let notificationContainer = document.getElementById("notificationContainer")
    if (!notificationContainer) {
      notificationContainer = document.createElement("div")
      notificationContainer.id = "notificationContainer"
      notificationContainer.className = "notification-container"
      document.body.appendChild(notificationContainer)
    }

    // Listen for notification events
    window.addEventListener("showNotification", (e) => {
      console.log("[v0] Showing notification:", e.detail)
      displayNotification(e.detail)
    })

    // Also listen for direct calls from admin
    window.addEventListener("adminNotification", (e) => {
      console.log("[v0] Showing admin notification:", e.detail)
      displayNotification(e.detail)
    })
  }

  const setupAnnouncementSystem = () => {
    // Create announcement banner
    let announcementBanner = document.getElementById("announcementBanner")
    if (!announcementBanner) {
      announcementBanner = document.createElement("div")
      announcementBanner.id = "announcementBanner"
      announcementBanner.className = "announcement-banner"
      document.body.insertBefore(announcementBanner, document.body.firstChild)
    }

    // Listen for announcement events
    window.addEventListener("showAnnouncement", (e) => {
      console.log("[v0] Showing announcement:", e.detail)
      displayAnnouncement(e.detail)
    })

    // Also listen for direct calls from admin
    window.addEventListener("adminAnnouncement", (e) => {
      console.log("[v0] Showing admin announcement:", e.detail)
      displayAnnouncement(e.detail)
    })
  }

  const handleAdminMessage = (message) => {
    console.log("[v0] Received admin message:", message)
    messages.push({
      ...message,
      timestamp: new Date().toISOString(),
      id: Math.random().toString(36).substr(2, 9),
    })

    // Keep only last 100 messages
    if (messages.length > 100) {
      messages = messages.slice(-100)
    }

    saveMessagesToStorage()

    // Notify all listeners
    messageListeners.forEach((listener) => listener(message))

    // Dispatch event for UI updates
    window.dispatchEvent(
      new CustomEvent("messageReceived", {
        detail: message,
      }),
    )
  }

  const handleSettingsUpdate = (settings) => {
    console.log("[v0] Settings updated from admin:", settings)

    // Apply theme settings
    if (settings.theme) {
      applyThemeSettings(settings.theme)
    }

    // Update store information
    if (settings.store) {
      updateStoreInfo(settings.store)
    }

    // Update SEO
    if (settings.seo) {
      updateSEO(settings.seo)
    }

    // Update social links
    if (settings.social) {
      updateSocialLinks(settings.social)
    }

    // Dispatch event
    window.dispatchEvent(
      new CustomEvent("bridgeSettingsApplied", {
        detail: { settings },
      }),
    )
  }

  const handleProductsUpdate = (products) => {
    console.log("[v0] Products updated from admin:", products.length)

    // Dispatch event for product grid to update
    window.dispatchEvent(
      new CustomEvent("bridgeProductsUpdated", {
        detail: { products },
      }),
    )

    // Show notification
    displayNotification({
      type: "success",
      title: "Products Updated",
      message: `${products.length} products are now available`,
      duration: 3000,
    })
  }

  const handleHomeContentUpdate = (homeContent) => {
    console.log("[v0] Home content updated from admin:", homeContent)

    // Update hero section
    if (homeContent.heroTitle) {
      const heroTitle = document.querySelector(".hero-main-title")
      if (heroTitle) {
        heroTitle.textContent = homeContent.heroTitle
      }
    }

    if (homeContent.heroSubtitle) {
      const heroSubtitle = document.querySelector(".hero-subtitle")
      if (heroSubtitle) {
        heroSubtitle.textContent = homeContent.heroSubtitle
      }
    }

    // Dispatch event
    window.dispatchEvent(
      new CustomEvent("bridgeHomeContentApplied", {
        detail: { homeContent },
      }),
    )
  }

  const applyThemeSettings = (theme) => {
    const root = document.documentElement
    if (theme.primaryColor) {
      root.style.setProperty("--primary-color", theme.primaryColor)
    }
    if (theme.secondaryColor) {
      root.style.setProperty("--secondary-color", theme.secondaryColor)
    }
    if (theme.accentColor) {
      root.style.setProperty("--accent-color", theme.accentColor)
    }
    if (theme.backgroundColor) {
      root.style.setProperty("--background-color", theme.backgroundColor)
    }
    console.log("[v0] Theme settings applied")
  }

  const updateStoreInfo = (store) => {
    // Update footer store name
    const footerStore = document.querySelector(".footer-section h4")
    if (footerStore && store.name) {
      footerStore.textContent = store.name
    }

    // Update contact information
    const phoneLink = document.querySelector('a[href^="tel:"]')
    if (phoneLink && store.phone) {
      phoneLink.href = "tel:" + store.phone.replace(/\s/g, "")
      phoneLink.textContent = store.phone
    }

    const emailLink = document.querySelector('a[href^="mailto:"]')
    if (emailLink && store.email) {
      emailLink.href = "mailto:" + store.email
      emailLink.textContent = store.email
    }

    console.log("[v0] Store information updated")
  }

  const updateSEO = (seo) => {
    if (seo.title) {
      document.title = seo.title
    }

    if (seo.description) {
      let metaDesc = document.querySelector('meta[name="description"]')
      if (!metaDesc) {
        metaDesc = document.createElement("meta")
        metaDesc.name = "description"
        document.head.appendChild(metaDesc)
      }
      metaDesc.content = seo.description
    }

    if (seo.keywords) {
      let metaKeywords = document.querySelector('meta[name="keywords"]')
      if (!metaKeywords) {
        metaKeywords = document.createElement("meta")
        metaKeywords.name = "keywords"
        document.head.appendChild(metaKeywords)
      }
      metaKeywords.content = seo.keywords
    }

    console.log("[v0] SEO settings updated")
  }

  const updateSocialLinks = (social) => {
    // Update footer social links
    const socialLinks = document.querySelectorAll(".social-links a")
    socialLinks.forEach((link) => {
      if (link.classList.contains("fa-facebook") && social.facebook) {
        link.href = social.facebook
      } else if (link.classList.contains("fa-instagram") && social.instagram) {
        link.href = social.instagram
      } else if (link.classList.contains("fa-twitter") && social.twitter) {
        link.href = social.twitter
      } else if (link.classList.contains("fa-linkedin") && social.linkedin) {
        link.href = social.linkedin
      } else if (link.classList.contains("fa-whatsapp") && social.whatsapp) {
        link.href = "https://wa.me/" + social.whatsapp.replace(/\D/g, "")
      }
    })

    console.log("[v0] Social links updated")
  }

  const displayNotification = (options) => {
    const { type = "info", title = "Notification", message = "", duration = 5000, icon = null } = options

    const notification = document.createElement("div")
    notification.className = `notification notification-${type}`
    notification.innerHTML = `
      <div class="notification-content">
        ${icon ? `<i class="notification-icon ${icon}"></i>` : ""}
        <div class="notification-text">
          <div class="notification-title">${title}</div>
          <div class="notification-message">${message}</div>
        </div>
      </div>
      <button class="notification-close">&times;</button>
    `

    const container = document.getElementById("notificationContainer")
    if (container) {
      container.appendChild(notification)

      // Auto remove after duration
      if (duration > 0) {
        setTimeout(() => {
          notification.classList.add("fade-out")
          setTimeout(() => notification.remove(), 300)
        }, duration)
      }

      // Manual close
      notification.querySelector(".notification-close").addEventListener("click", () => {
        notification.classList.add("fade-out")
        setTimeout(() => notification.remove(), 300)
      })
    }

    // Store notification
    notifications.push({
      ...options,
      timestamp: new Date().toISOString(),
      id: Math.random().toString(36).substr(2, 9),
    })

    // Keep only last 50 notifications
    if (notifications.length > 50) {
      notifications = notifications.slice(-50)
    }
  }

  const displayAnnouncement = (options) => {
    const { type = "info", message = "", closeable = true, backgroundColor = "#6a79fa" } = options

    const banner = document.getElementById("announcementBanner")
    if (banner) {
      banner.innerHTML = `
        <div class="announcement-content" style="background-color: ${backgroundColor}">
          <span class="announcement-message">${message}</span>
          ${closeable ? '<button class="announcement-close">&times;</button>' : ""}
        </div>
      `

      banner.style.display = "block"

      if (closeable) {
        banner.querySelector(".announcement-close").addEventListener("click", () => {
          banner.style.display = "none"
        })
      }
    }

    // Store announcement
    announcements.push({
      ...options,
      timestamp: new Date().toISOString(),
      id: Math.random().toString(36).substr(2, 9),
    })

    // Keep only last 20 announcements
    if (announcements.length > 20) {
      announcements = announcements.slice(-20)
    }
  }

  const broadcastMessage = (message) => {
    window.dispatchEvent(
      new CustomEvent("adminMessage", {
        detail: message,
      }),
    )
  }

  const broadcastConnectionStatus = (connected) => {
    window.dispatchEvent(
      new CustomEvent("bridgeConnectionStatus", {
        detail: { connected },
      }),
    )
  }

  const broadcastWebsiteReady = () => {
    window.dispatchEvent(new CustomEvent("websiteReady"))
    console.log("[v0] Website ready for communication")
  }

  const checkConnection = () => {
    // Check if admin dashboard is still accessible
    const adminSettings = localStorage.getItem("websiteSettings")
    if (adminSettings && !isConnected) {
      isConnected = true
      broadcastConnectionStatus(true)
      console.log("[v0] Connection established via localStorage")
    }
  }

  const saveMessagesToStorage = () => {
    localStorage.setItem("bridgeMessages", JSON.stringify(messages))
  }

  const loadMessagesFromStorage = () => {
    const saved = localStorage.getItem("bridgeMessages")
    if (saved) {
      messages = JSON.parse(saved)
      console.log("[v0] Loaded", messages.length, "messages from storage")
    }
  }

  const sendNotificationToAdmin = (notification) => {
    window.dispatchEvent(
      new CustomEvent("websiteNotification", {
        detail: notification,
      }),
    )
  }

  return {
    init,
    displayNotification,
    displayAnnouncement,
    sendNotificationToAdmin,
    getMessages: () => messages,
    getNotifications: () => notifications,
    getAnnouncements: () => announcements,
    isConnected: () => isConnected,
  }
})()

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    () => {
      CommunicationBridge.init()
    },
    { once: true },
  )
} else {
  CommunicationBridge.init()
}
