const AdminDashboardEnhanced = (() => {
  let products = []
  let orders = []
  let users = []
  let settings = {}

  const AdminAuth = {
    isLoggedIn: () => {
      const loginData = localStorage.getItem("adminLogin")
      if (!loginData) return false
      try {
        const data = JSON.parse(loginData)
        return data.token && data.username
      } catch (e) {
        return false
      }
    },
    getLoginData: () => {
      const loginData = localStorage.getItem("adminLogin")
      if (!loginData) return null
      try {
        return JSON.parse(loginData)
      } catch (e) {
        return null
      }
    },
    logout: () => {
      localStorage.removeItem("adminLogin")
      localStorage.removeItem("adminRemember")
      window.location.href = "index.html"
    },
  }

  const init = () => {
    console.log("[v0] Initializing Enhanced Admin Dashboard...")

    // Check authentication
    if (!AdminAuth.isLoggedIn()) {
      window.location.href = "index.html"
      return
    }

    const loginData = AdminAuth.getLoginData()
    document.getElementById("adminName").textContent = loginData.username

    setupEventListeners()
    setupHomeContentForm()
    loadDashboardData()
    loadSettingsForm()
    renderDashboard()

    // Setup real-time sync
    setupRealtimeSync()

    console.log("[v0] Enhanced Admin Dashboard initialized")
  }

  const setupRealtimeSync = () => {
    // Listen for data sync events
    window.addEventListener("dataSync:productsUpdated", (e) => {
      products = e.detail.products
      renderProductsTable()
      renderDashboard()
    })

    window.addEventListener("dataSync:settingsUpdated", (e) => {
      settings = e.detail.settings
      loadSettingsForm()
    })
  }

  const setupEventListeners = () => {
    // Sidebar navigation
    document.querySelectorAll(".nav-item").forEach((item) => {
      item.addEventListener("click", (e) => {
        e.preventDefault()
        const section = item.getAttribute("data-section")
        navigateToSection(section)
      })
    })

    // Logout button
    document.getElementById("logoutBtn").addEventListener("click", () => {
      if (confirm("Are you sure you want to logout?")) {
        AdminAuth.logout()
      }
    })

    // Product management
    document.getElementById("addProductBtn").addEventListener("click", openProductModal)
    document.getElementById("productForm").addEventListener("submit", handleProductSubmit)
    document.querySelector("#productModal .modal-close").addEventListener("click", closeProductModal)

    // Settings form
    document.getElementById("settingsForm").addEventListener("submit", handleSettingsSubmit)

    // Sidebar toggle for mobile
    document.getElementById("sidebarToggle").addEventListener("click", () => {
      document.querySelector(".sidebar-nav").classList.toggle("active")
    })

    // Tab switching for settings
    document.querySelectorAll(".settings-tab-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const tabName = btn.getAttribute("data-tab")
        document.querySelectorAll(".settings-tab-btn").forEach((b) => b.classList.remove("active"))
        document.querySelectorAll(".settings-tab-content").forEach((c) => c.classList.remove("active"))
        btn.classList.add("active")
        document.getElementById(tabName + "-tab").classList.add("active")
      })
    })

    // Color picker listeners
    document.getElementById("primaryColor")?.addEventListener("change", (e) => {
      document.getElementById("primaryColorValue").textContent = e.target.value
    })
    document.getElementById("secondaryColor")?.addEventListener("change", (e) => {
      document.getElementById("secondaryColorValue").textContent = e.target.value
    })
    document.getElementById("accentColor")?.addEventListener("change", (e) => {
      document.getElementById("accentColorValue").textContent = e.target.value
    })
    document.getElementById("backgroundColor")?.addEventListener("change", (e) => {
      document.getElementById("backgroundColorValue").textContent = e.target.value
    })
  }

  const setupHomeContentForm = () => {
    const form = document.getElementById("homeContentForm")
    if (!form) return

    // Load saved home content
    const savedContent = localStorage.getItem("homeContent")
    if (savedContent) {
      const content = JSON.parse(savedContent)
      document.getElementById("heroTitle").value = content.heroTitle || ""
      document.getElementById("heroSubtitle").value = content.heroSubtitle || ""
      document.getElementById("heroCTA").value = content.heroCTA || ""
      document.getElementById("aboutTitle").value = content.aboutTitle || ""
      document.getElementById("aboutMission").value = content.aboutMission || ""
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault()

      const homeContent = {
        heroTitle: document.getElementById("heroTitle").value,
        heroSubtitle: document.getElementById("heroSubtitle").value,
        heroCTA: document.getElementById("heroCTA").value,
        aboutTitle: document.getElementById("aboutTitle").value,
        aboutMission: document.getElementById("aboutMission").value,
      }

      localStorage.setItem("homeContent", JSON.stringify(homeContent))

      // Trigger sync event
      window.dispatchEvent(new CustomEvent("homeContentUpdated", { detail: { homeContent } }))

      console.log("[v0] Home content saved:", homeContent)
      alert("Home page content updated successfully!")
    })
  }

  const loadDashboardData = () => {
    // Load products
    const savedProducts = localStorage.getItem("websiteProducts")
    products = savedProducts ? JSON.parse(savedProducts) : window.parent.PRODUCTS_DATA || []

    // Load orders
    const savedOrders = localStorage.getItem("orders")
    orders = savedOrders ? JSON.parse(savedOrders) : []

    // Load users
    const savedUsers = localStorage.getItem("adminUsers")
    users = savedUsers
      ? JSON.parse(savedUsers)
      : [{ id: 1, username: "admin", email: "admin@nexaprint.com", role: "admin", status: "active" }]

    // Load settings
    const savedSettings = localStorage.getItem("websiteSettings")
    settings = savedSettings ? JSON.parse(savedSettings) : {}

    console.log("[v0] Dashboard data loaded:", {
      products: products.length,
      orders: orders.length,
      users: users.length,
    })
  }

  const renderDashboard = () => {
    // Update stats
    document.getElementById("totalProducts").textContent = products.length
    document.getElementById("totalOrders").textContent = orders.length
    document.getElementById("totalUsers").textContent = users.length

    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0)
    document.getElementById("totalRevenue").textContent = totalRevenue.toFixed(2) + " MAD"

    // Render products table
    renderProductsTable()

    // Render categories
    renderCategories()

    // Render orders table
    renderOrdersTable()

    // Render users table
    renderUsersTable()
  }

  const renderProductsTable = () => {
    const tbody = document.getElementById("productsTableBody")
    tbody.innerHTML = ""

    products.forEach((product) => {
      const row = document.createElement("tr")
      row.innerHTML = `
        <td>${product.id}</td>
        <td>${product.name}</td>
        <td>${product.category || "N/A"}</td>
        <td>${product.price} MAD</td>
        <td>In Stock</td>
        <td>
          <button class="btn-edit" onclick="AdminDashboardEnhanced.editProduct(${product.id})">Edit</button>
          <button class="btn-delete" onclick="AdminDashboardEnhanced.deleteProduct(${product.id})">Delete</button>
        </td>
      `
      tbody.appendChild(row)
    })
  }

  const renderCategories = () => {
    const categories = [
      {
        name: "Men's Clothing",
        icon: "fa-shirt",
        count: products.filter((p) => p.category === "mens-clothing").length,
      },
      {
        name: "Women's Clothing",
        icon: "fa-dress",
        count: products.filter((p) => p.category === "womens-clothing").length,
      },
      {
        name: "Kids' Clothing",
        icon: "fa-child",
        count: products.filter((p) => p.category === "kids-clothing").length,
      },
      { name: "Hats", icon: "fa-hat-cowboy", count: products.filter((p) => p.category === "hats").length },
      { name: "Accessories", icon: "fa-ring", count: products.filter((p) => p.category === "accessories").length },
      { name: "Home & Living", icon: "fa-home", count: products.filter((p) => p.category === "home-living").length },
      { name: "Collections", icon: "fa-folder", count: products.filter((p) => p.category === "collections").length },
      { name: "Brands", icon: "fa-tag", count: products.filter((p) => p.category === "brands").length },
    ]

    const grid = document.getElementById("categoriesGrid")
    grid.innerHTML = ""

    categories.forEach((cat) => {
      const card = document.createElement("div")
      card.className = "category-card"
      card.innerHTML = `
        <div class="category-icon"><i class="fas ${cat.icon}"></i></div>
        <div class="category-name">${cat.name}</div>
        <div class="category-count">${cat.count} products</div>
      `
      grid.appendChild(card)
    })
  }

  const renderOrdersTable = () => {
    const tbody = document.getElementById("ordersTableBody")
    tbody.innerHTML = ""

    orders.forEach((order) => {
      const row = document.createElement("tr")
      row.innerHTML = `
        <td>#${order.id || "N/A"}</td>
        <td>${order.name || "N/A"}</td>
        <td>${new Date(order.date || Date.now()).toLocaleDateString()}</td>
        <td>${order.total || 0} MAD</td>
        <td><span class="status-badge">${order.status || "Pending"}</span></td>
        <td>
          <button class="btn-view" onclick="AdminDashboardEnhanced.viewOrder(${order.id})">View</button>
        </td>
      `
      tbody.appendChild(row)
    })

    if (orders.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem;">No orders yet</td></tr>'
    }
  }

  const renderUsersTable = () => {
    const tbody = document.getElementById("usersTableBody")
    tbody.innerHTML = ""

    users.forEach((user) => {
      const row = document.createElement("tr")
      row.innerHTML = `
        <td>${user.id}</td>
        <td>${user.username}</td>
        <td>${user.email}</td>
        <td>${user.role}</td>
        <td><span class="status-badge">${user.status}</span></td>
        <td>
          <button class="btn-edit" onclick="AdminDashboardEnhanced.editUser(${user.id})">Edit</button>
        </td>
      `
      tbody.appendChild(row)
    })
  }

  const openProductModal = () => {
    document.getElementById("productModal").classList.add("active")
    document.getElementById("productModalTitle").textContent = "Add New Product"
    document.getElementById("productForm").reset()
  }

  const closeProductModal = () => {
    document.getElementById("productModal").classList.remove("active")
  }

  const handleProductSubmit = (e) => {
    e.preventDefault()

    const editingProductId = document.getElementById("productForm").dataset.editingProductId

    const productData = {
      id: editingProductId ? Number.parseInt(editingProductId) : Math.max(...products.map((p) => p.id), 0) + 1,
      name: document.getElementById("productName").value,
      category: document.getElementById("productCategory").value,
      price: Number.parseFloat(document.getElementById("productPrice").value),
      originalPrice: Number.parseFloat(document.getElementById("productOriginalPrice").value) || null,
      description: document.getElementById("productDescription").value,
      fullDescription: document.getElementById("productFullDescription").value,
      sizes: document
        .getElementById("productSizes")
        .value.split(",")
        .map((s) => s.trim())
        .filter((s) => s),
      colors: document
        .getElementById("productColors")
        .value.split(",")
        .map((c) => c.trim())
        .filter((c) => c),
      images: [document.getElementById("productImages").value].filter((img) => img),
    }

    if (editingProductId) {
      const index = products.findIndex((p) => p.id === Number.parseInt(editingProductId))
      if (index !== -1) {
        products[index] = productData
        console.log("[v0] Product updated:", productData)
      }
    } else {
      products.push(productData)
      console.log("[v0] New product added:", productData)
    }

    // Save and sync
    localStorage.setItem("websiteProducts", JSON.stringify(products))
    window.dispatchEvent(new CustomEvent("productsUpdated", { detail: { products } }))

    alert(editingProductId ? "Product updated successfully!" : "Product added successfully!")

    closeProductModal()
    renderProductsTable()
    renderDashboard()

    delete document.getElementById("productForm").dataset.editingProductId
  }

  const handleSettingsSubmit = (e) => {
    e.preventDefault()

    const settings = {
      store: {
        name: document.getElementById("storeName")?.value || "NEXA Print",
        description: document.getElementById("storeDescription")?.value || "",
        phone: document.getElementById("storePhone")?.value || "+212 723 242 286",
        email: document.getElementById("storeEmail")?.value || "info@nexaprint.com",
        address: document.getElementById("storeAddress")?.value || "",
        country: document.getElementById("storeCountry")?.value || "Morocco",
      },
      theme: {
        primaryColor: document.getElementById("primaryColor")?.value || "#6a79fa",
        secondaryColor: document.getElementById("secondaryColor")?.value || "#1a1a1a",
        accentColor: document.getElementById("accentColor")?.value || "#27ae60",
        backgroundColor: document.getElementById("backgroundColor")?.value || "#f5f5f5",
      },
      seo: {
        title: document.getElementById("seoTitle")?.value || "",
        description: document.getElementById("seoDescription")?.value || "",
        keywords: document.getElementById("seoKeywords")?.value || "",
      },
      social: {
        facebook: document.getElementById("socialFacebook")?.value || "",
        instagram: document.getElementById("socialInstagram")?.value || "",
        twitter: document.getElementById("socialTwitter")?.value || "",
        linkedin: document.getElementById("socialLinkedin")?.value || "",
        whatsapp: document.getElementById("socialWhatsapp")?.value || "+212723242286",
      },
    }

    localStorage.setItem("websiteSettings", JSON.stringify(settings))
    window.dispatchEvent(new CustomEvent("settingsUpdated", { detail: { settings } }))

    alert("All settings saved successfully!")
  }

  const deleteProduct = (productId) => {
    if (confirm("Are you sure you want to delete this product?")) {
      products = products.filter((p) => p.id !== productId)
      localStorage.setItem("websiteProducts", JSON.stringify(products))
      window.dispatchEvent(new CustomEvent("productsUpdated", { detail: { products } }))
      console.log("[v0] Product deleted:", productId)
      renderProductsTable()
      renderDashboard()
    }
  }

  const editProduct = (productId) => {
    const product = products.find((p) => p.id === productId)
    if (product) {
      document.getElementById("productModalTitle").textContent = "Edit Product"
      document.getElementById("productName").value = product.name
      document.getElementById("productCategory").value = product.category
      document.getElementById("productPrice").value = product.price
      document.getElementById("productOriginalPrice").value = product.originalPrice || ""
      document.getElementById("productDescription").value = product.description
      document.getElementById("productFullDescription").value = product.fullDescription || ""
      document.getElementById("productSizes").value = product.sizes ? product.sizes.join(", ") : ""
      document.getElementById("productColors").value = product.colors ? product.colors.join(", ") : ""
      document.getElementById("productImages").value =
        product.images && product.images.length > 0 ? product.images[0] : ""

      document.getElementById("productForm").dataset.editingProductId = productId

      openProductModal()
    }
  }

  const viewOrder = (orderId) => {
    const order = orders.find((o) => o.id === orderId)
    if (order) {
      alert("Order Details:\n\n" + JSON.stringify(order, null, 2))
    }
  }

  const editUser = (userId) => {
    alert("User editing feature coming soon")
  }

  const loadSettingsForm = () => {
    const savedSettings = localStorage.getItem("websiteSettings")
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings)
        console.log("[v0] Loading saved settings:", settings)

        if (settings.store) {
          document.getElementById("storeName").value = settings.store.name || ""
          document.getElementById("storeDescription").value = settings.store.description || ""
          document.getElementById("storePhone").value = settings.store.phone || ""
          document.getElementById("storeEmail").value = settings.store.email || ""
          document.getElementById("storeAddress").value = settings.store.address || ""
          document.getElementById("storeCountry").value = settings.store.country || ""
        }

        if (settings.theme) {
          document.getElementById("primaryColor").value = settings.theme.primaryColor || "#6a79fa"
          document.getElementById("secondaryColor").value = settings.theme.secondaryColor || "#1a1a1a"
          document.getElementById("accentColor").value = settings.theme.accentColor || "#27ae60"
          document.getElementById("backgroundColor").value = settings.theme.backgroundColor || "#f5f5f5"
        }

        if (settings.seo) {
          document.getElementById("seoTitle").value = settings.seo.title || ""
          document.getElementById("seoDescription").value = settings.seo.description || ""
          document.getElementById("seoKeywords").value = settings.seo.keywords || ""
        }

        if (settings.social) {
          document.getElementById("socialFacebook").value = settings.social.facebook || ""
          document.getElementById("socialInstagram").value = settings.social.instagram || ""
          document.getElementById("socialTwitter").value = settings.social.twitter || ""
          document.getElementById("socialLinkedin").value = settings.social.linkedin || ""
          document.getElementById("socialWhatsapp").value = settings.social.whatsapp || ""
        }
      } catch (error) {
        console.error("[v0] Error loading settings:", error)
      }
    }
  }

  return {
    init,
    deleteProduct,
    editProduct,
    viewOrder,
    editUser,
  }
})()

// Initialize on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  AdminDashboardEnhanced.init()
})

// Make navigateToSection globally accessible
function navigateToSection(section) {
  document.querySelectorAll(".content-section").forEach((s) => s.classList.remove("active"))

  const selectedSection = document.getElementById(section)
  if (selectedSection) {
    selectedSection.classList.add("active")
  }

  document.querySelectorAll(".nav-item").forEach((item) => {
    item.classList.remove("active")
    if (item.getAttribute("data-section") === section) {
      item.classList.add("active")
    }
  })

  const titles = {
    dashboard: "Dashboard",
    products: "Product Management",
    categories: "Category Management",
    settings: "Website Settings",
    orders: "Orders Management",
    users: "User Management",
    "home-content": "Home Page Content",
  }

  document.getElementById("pageTitle").textContent = titles[section] || "Dashboard"
}

function resetSettings() {
  if (confirm("Are you sure you want to reset all settings to default?")) {
    document.getElementById("storeName").value = "NEXA Print"
    document.getElementById("storeDescription").value = ""
    document.getElementById("storePhone").value = "+212 723 242 286"
    document.getElementById("storeEmail").value = "info@nexaprint.com"
    document.getElementById("storeAddress").value = ""
    document.getElementById("storeCountry").value = "Morocco"
    document.getElementById("primaryColor").value = "#6a79fa"
    document.getElementById("secondaryColor").value = "#1a1a1a"
    document.getElementById("accentColor").value = "#27ae60"
    document.getElementById("backgroundColor").value = "#f5f5f5"
    document.getElementById("seoTitle").value = ""
    document.getElementById("seoDescription").value = ""
    document.getElementById("seoKeywords").value = ""
    document.getElementById("socialFacebook").value = ""
    document.getElementById("socialInstagram").value = ""
    document.getElementById("socialTwitter").value = ""
    document.getElementById("socialLinkedin").value = ""
    document.getElementById("socialWhatsapp").value = "+212723242286"

    alert("Settings reset to default!")
  }
}
