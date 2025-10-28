const DataSync = (() => {
  const STORAGE_KEYS = {
    PRODUCTS: "websiteProducts",
    SETTINGS: "websiteSettings",
    HOME_CONTENT: "homeContent",
    ORDERS: "orders",
    USERS: "adminUsers",
  }

  const init = () => {
    console.log("[v0] Initializing DataSync system...")
    setupEventListeners()
    setupPeriodicSync()
  }

  const setupEventListeners = () => {
    // Listen for admin updates
    window.addEventListener("productsUpdated", (e) => {
      console.log("[v0] Products updated event received")
      broadcastUpdate("products", e.detail.products)
    })

    window.addEventListener("settingsUpdated", (e) => {
      console.log("[v0] Settings updated event received")
      broadcastUpdate("settings", e.detail.settings)
    })

    window.addEventListener("homeContentUpdated", (e) => {
      console.log("[v0] Home content updated event received")
      broadcastUpdate("homeContent", e.detail.homeContent)
    })

    window.addEventListener("ordersUpdated", (e) => {
      console.log("[v0] Orders updated event received")
      broadcastUpdate("orders", e.detail.orders)
    })
  }

  const setupPeriodicSync = () => {
    // Check for updates every 1 second for real-time sync
    setInterval(() => {
      checkForUpdates()
    }, 1000)
  }

  const checkForUpdates = () => {
    const products = getProducts()
    const settings = getSettings()
    const homeContent = getHomeContent()

    // Dispatch events if data exists
    if (products && products.length > 0) {
      window.dispatchEvent(
        new CustomEvent("dataSync:productsAvailable", {
          detail: { products },
        }),
      )
    }

    if (settings) {
      window.dispatchEvent(
        new CustomEvent("dataSync:settingsAvailable", {
          detail: { settings },
        }),
      )
    }

    if (homeContent) {
      window.dispatchEvent(
        new CustomEvent("dataSync:homeContentAvailable", {
          detail: { homeContent },
        }),
      )
    }
  }

  const broadcastUpdate = (type, data) => {
    switch (type) {
      case "products":
        saveProducts(data)
        window.dispatchEvent(
          new CustomEvent("dataSync:productsUpdated", {
            detail: { products: data },
          }),
        )
        break
      case "settings":
        saveSettings(data)
        window.dispatchEvent(
          new CustomEvent("dataSync:settingsUpdated", {
            detail: { settings: data },
          }),
        )
        break
      case "homeContent":
        saveHomeContent(data)
        window.dispatchEvent(
          new CustomEvent("dataSync:homeContentUpdated", {
            detail: { homeContent: data },
          }),
        )
        break
      case "orders":
        saveOrders(data)
        break
    }
  }

  // Product methods
  const getProducts = () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS)
      return data ? JSON.parse(data) : null
    } catch (e) {
      console.error("[v0] Error getting products:", e)
      return null
    }
  }

  const saveProducts = (products) => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products))
      console.log("[v0] Products saved to localStorage")
    } catch (e) {
      console.error("[v0] Error saving products:", e)
    }
  }

  // Settings methods
  const getSettings = () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS)
      return data ? JSON.parse(data) : null
    } catch (e) {
      console.error("[v0] Error getting settings:", e)
      return null
    }
  }

  const saveSettings = (settings) => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings))
      console.log("[v0] Settings saved to localStorage")
    } catch (e) {
      console.error("[v0] Error saving settings:", e)
    }
  }

  // Home content methods
  const getHomeContent = () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HOME_CONTENT)
      return data ? JSON.parse(data) : null
    } catch (e) {
      console.error("[v0] Error getting home content:", e)
      return null
    }
  }

  const saveHomeContent = (content) => {
    try {
      localStorage.setItem(STORAGE_KEYS.HOME_CONTENT, JSON.stringify(content))
      console.log("[v0] Home content saved to localStorage")
    } catch (e) {
      console.error("[v0] Error saving home content:", e)
    }
  }

  // Orders methods
  const getOrders = () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ORDERS)
      return data ? JSON.parse(data) : []
    } catch (e) {
      console.error("[v0] Error getting orders:", e)
      return []
    }
  }

  const saveOrders = (orders) => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders))
      console.log("[v0] Orders saved to localStorage")
    } catch (e) {
      console.error("[v0] Error saving orders:", e)
    }
  }

  const addOrder = (order) => {
    const orders = getOrders()
    orders.push({
      ...order,
      id: Math.max(...orders.map((o) => o.id || 0), 0) + 1,
      date: new Date().toISOString(),
    })
    saveOrders(orders)
    return orders
  }

  return {
    init,
    getProducts,
    saveProducts,
    getSettings,
    saveSettings,
    getHomeContent,
    saveHomeContent,
    getOrders,
    saveOrders,
    addOrder,
  }
})()

// Initialize on load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", DataSync.init)
} else {
  DataSync.init()
}
