// Admin Sync System - Synchronizes admin dashboard changes with website
const AdminSync = (() => {
  const init = () => {
    console.log("[v0] Initializing admin sync system...")

    // Listen for products updated event from admin
    window.addEventListener("productsUpdated", (e) => {
      console.log("[v0] Products updated from admin:", e.detail.products.length)
      window.PRODUCTS_DATA = e.detail.products
      localStorage.setItem("websiteProducts", JSON.stringify(e.detail.products))

      // Trigger app to re-render products
      if (window.App && window.App.renderProducts) {
        window.App.renderProducts()
      }
    })

    // Listen for settings updated event from admin
    window.addEventListener("settingsUpdated", (e) => {
      console.log("[v0] Settings updated from admin:", e.detail.settings)
      localStorage.setItem("websiteSettings", JSON.stringify(e.detail.settings))

      // Apply theme settings
      if (e.detail.settings.theme) {
        applyThemeSettings(e.detail.settings.theme)
      }

      // Apply store settings
      if (e.detail.settings.store) {
        applyStoreSettings(e.detail.settings.store)
      }
    })

    // Check for updates from admin every 2 seconds
    setInterval(checkForAdminUpdates, 2000)
  }

  const checkForAdminUpdates = () => {
    const savedProducts = localStorage.getItem("websiteProducts")
    if (savedProducts) {
      try {
        const products = JSON.parse(savedProducts)
        if (window.PRODUCTS_DATA && JSON.stringify(window.PRODUCTS_DATA) !== JSON.stringify(products)) {
          window.PRODUCTS_DATA = products
          console.log("[v0] Products synced from admin:", products.length)
          if (window.App && window.App.renderProducts) {
            window.App.renderProducts()
          }
        }
      } catch (e) {
        console.error("[v0] Error syncing products:", e)
      }
    }
  }

  const applyThemeSettings = (theme) => {
    if (theme.primaryColor) {
      document.documentElement.style.setProperty("--primary-color", theme.primaryColor)
    }
    if (theme.secondaryColor) {
      document.documentElement.style.setProperty("--secondary-color", theme.secondaryColor)
    }
    if (theme.accentColor) {
      document.documentElement.style.setProperty("--accent-color", theme.accentColor)
    }
    if (theme.backgroundColor) {
      document.documentElement.style.setProperty("--background-color", theme.backgroundColor)
    }
  }

  const applyStoreSettings = (store) => {
    // Update store name in footer
    const footerStore = document.querySelector(".footer-section h4")
    if (footerStore && store.name) {
      footerStore.textContent = store.name
    }
  }

  return {
    init,
  }
})()

// Initialize on page load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", AdminSync.init)
} else {
  AdminSync.init()
}
