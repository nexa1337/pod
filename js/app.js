// Main Application
const App = (() => {
  let products = []
  let cart = []
  let currentProduct = null
  let currentImageIndex = 0
  let currentPage = 1
  const productsPerPage = 10
  let filteredProducts = []

  const setupScrollToTopButton = () => {
    const scrollBtn = document.getElementById("scrollToTopBtn")

    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 300) {
        scrollBtn.classList.add("show")
      } else {
        scrollBtn.classList.remove("show")
      }
    })

    scrollBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    })
  }

  const setupHomeCategories = () => {
    const categoryCards = document.querySelectorAll(".home-category-card")

    categoryCards.forEach((card) => {
      card.addEventListener("click", () => {
        const categoryValue = card.getAttribute("data-category")
        const categoryFilter = document.getElementById("categoryFilter")
        if (categoryFilter) {
          categoryFilter.value = categoryValue
          categoryFilter.dispatchEvent(new Event("change"))
          document.getElementById("products").scrollIntoView({ behavior: "smooth" })
        }
      })
    })
  }

  // Initialize app
  const init = async () => {
    console.log("[v0] Initializing app...")
    await window.I18n.init()
    await window.Currency.init()

    const savedProducts = localStorage.getItem("websiteProducts")
    if (savedProducts) {
      try {
        products = JSON.parse(savedProducts)
        console.log("[v0] ✅ Loaded", products.length, "products from localStorage (admin dashboard)")
      } catch (error) {
        console.error("[v0] Error parsing saved products:", error)
        products = window.PRODUCTS_DATA || []
      }
    } else {
      products = window.PRODUCTS_DATA || []
      console.log("[v0] Loaded", products.length, "products from hardcoded data")
    }

    window.addEventListener("productsUpdated", (event) => {
      products = event.detail.products || []
      console.log("[v0] ✅ Products updated from admin dashboard:", products.length, "products")
      renderProducts(products)
    })

    const savedSettings = localStorage.getItem("websiteSettings")
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings)
        console.log("[v0] Applying saved settings:", settings)
        applyWebsiteSettings(settings)
      } catch (error) {
        console.error("[v0] Error applying settings:", error)
      }
    }

    window.addEventListener("settingsUpdated", (event) => {
      console.log("[v0] Settings updated from admin panel:", event.detail.settings)
      applyWebsiteSettings(event.detail.settings)
    })

    setupEventListeners()
    setupModalActions()
    setupContactForm()
    setupScrollToTopButton()
    setupHomeCategories()

    init3DIcons()

    if (products.length > 0) {
      renderProducts()
    }

    window.Utils.updateLiveDateTime()

    // Update live date/time every second
    setInterval(window.Utils.updateLiveDateTime, 1000)

    // Load cart from localStorage
    loadCart()

    document.getElementById("languageSelect").value = window.I18n.getCurrentLanguage()
    document.getElementById("currencySelect").value = window.Currency.getCurrentCurrency()

    const savedTheme = localStorage.getItem("theme") || "light"
    if (savedTheme === "dark") {
      document.body.classList.add("dark-mode")
      document.body.classList.remove("light-mode")
      document.getElementById("themeToggle").querySelector(".theme-icon").textContent = "☀️"
      updateLogoForTheme("dark")
    } else {
      document.body.classList.add("light-mode")
      document.body.classList.remove("dark-mode")
      document.getElementById("themeToggle").querySelector(".theme-icon").textContent = "🌙"
      updateLogoForTheme("light")
    }

    console.log("[v0] App initialized successfully with", products.length, "products")
  }

  const init3DIcons = () => {
    console.log("[v0] Initializing 3D icons...")
    // 3D icons will be added to category showcase
    const categoryItems = document.querySelectorAll(".category-item")
    categoryItems.forEach((item, index) => {
      const iconContainer = item.querySelector(".category-icon")
      if (iconContainer && index < 3) {
        // Add 3D effect to first 3 items
        iconContainer.style.perspective = "1000px"
        iconContainer.addEventListener("mouseenter", () => {
          iconContainer.style.transform = "rotateX(10deg) rotateY(10deg) scale(1.1)"
        })
        iconContainer.addEventListener("mouseleave", () => {
          iconContainer.style.transform = "rotateX(0) rotateY(0) scale(1)"
        })
      }
    })
  }

  const updateLogoForTheme = (theme) => {
    const logoSvg = document.getElementById("customLogoDisplay")
    if (logoSvg) {
      const textElements = logoSvg.querySelectorAll(".logo-text, .logo-number")
      textElements.forEach((el) => {
        el.classList.remove("light-mode", "dark-mode")
        el.classList.add(theme + "-mode")
      })
    }
  }

  // Load products
  const loadProducts = async () => {
    try {
      const response = await fetch("data/products.json")
      if (!response.ok) throw new Error("Failed to fetch products")
      products = await response.json()
      console.log("[v0] Loaded", products.length, "products from JSON")
      return products
    } catch (error) {
      console.error("[v0] Failed to load products:", error)
      products = []
      return []
    }
  }

  // Render products grid
  const renderProducts = (productsToRender = products) => {
    const grid = document.getElementById("productsGrid")
    if (!grid) {
      console.error("[v0] Products grid not found")
      return
    }

    filteredProducts = productsToRender
    currentPage = 1
    renderProductsPage()
  }

  const renderProductsPage = () => {
    const grid = document.getElementById("productsGrid")
    grid.innerHTML = ""

    if (filteredProducts.length === 0) {
      grid.innerHTML =
        '<p style="grid-column: 1/-1; text-align: center; padding: 2rem; color: var(--text-secondary);">No products found</p>'
      renderPagination()
      return
    }

    const startIndex = (currentPage - 1) * productsPerPage
    const endIndex = startIndex + productsPerPage
    const pageProducts = filteredProducts.slice(startIndex, endIndex)

    pageProducts.forEach((product) => {
      const card = createProductCard(product)
      grid.appendChild(card)
    })

    renderPagination()
  }

  const renderPagination = () => {
    let paginationContainer = document.getElementById("paginationContainer")

    if (!paginationContainer) {
      paginationContainer = document.createElement("div")
      paginationContainer.id = "paginationContainer"
      paginationContainer.className = "pagination-container"
      document.getElementById("productsGrid").parentElement.appendChild(paginationContainer)
    }

    paginationContainer.innerHTML = ""

    if (filteredProducts.length <= productsPerPage) {
      return
    }

    const totalPages = Math.ceil(filteredProducts.length / productsPerPage)

    // Previous button
    if (currentPage > 1) {
      const prevBtn = document.createElement("button")
      prevBtn.className = "pagination-btn"
      prevBtn.textContent = "← Previous"
      prevBtn.addEventListener("click", () => {
        currentPage--
        renderProductsPage()
        document.getElementById("products").scrollIntoView({ behavior: "smooth", block: "start" })
      })
      paginationContainer.appendChild(prevBtn)
    }

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
      const pageBtn = document.createElement("button")
      pageBtn.className = `pagination-btn ${i === currentPage ? "active" : ""}`
      pageBtn.textContent = i
      pageBtn.addEventListener("click", () => {
        currentPage = i
        renderProductsPage()
        document.getElementById("products").scrollIntoView({ behavior: "smooth", block: "start" })
      })
      paginationContainer.appendChild(pageBtn)
    }

    // Next button
    if (currentPage < totalPages) {
      const nextBtn = document.createElement("button")
      nextBtn.className = "pagination-btn"
      nextBtn.textContent = "Next →"
      nextBtn.addEventListener("click", () => {
        currentPage++
        renderProductsPage()
        document.getElementById("products").scrollIntoView({ behavior: "smooth", block: "start" })
      })
      paginationContainer.appendChild(nextBtn)
    }
  }

  // Create product card
  const createProductCard = (product) => {
    const card = document.createElement("div")
    card.className = "product-card"
    const hasSale = product.originalPrice && product.originalPrice > product.price
    if (hasSale) {
      card.classList.add("sale")
    }

    const imageUrl = product.images && product.images.length > 0 ? product.images[0] : "/placeholder.svg"

    card.innerHTML = `
      <div class="product-image-wrapper">
        <img src="${imageUrl}" alt="${product.name}" class="product-image" onerror="this.src='/--encodeuricomponent-product-name--.jpg'">
        ${hasSale ? '<span class="sale-badge">Sale</span>' : ""}
      </div>
      <div class="product-info">
        <h3 class="product-name">${product.name}</h3>
        <p class="product-description">${product.description}</p>
        <div class="product-price-section">
          <span class="product-price">${window.Currency.format(product.price)}</span>
          ${product.originalPrice ? `<span class="product-original-price">${window.Currency.format(product.originalPrice)}</span>` : ""}
        </div>
        <div class="product-rating">
          ${"⭐".repeat(5)}
        </div>
        <button class="product-view-btn">View Details</button>
      </div>
    `

    card.addEventListener("click", () => openProductModal(product))
    return card
  }

  // Open product modal
  const openProductModal = (product) => {
    currentProduct = product
    currentImageIndex = 0

    document.getElementById("modalTitle").textContent = product.name
    document.getElementById("modalDescription").textContent = product.fullDescription || product.description

    document.getElementById("modalAvailability").textContent = "In stock"
    document.getElementById("modalSKU").textContent = `E-${String(product.id).padStart(5, "0")}`
    document.getElementById("modalCategory").textContent = product.category
      ? product.category.charAt(0).toUpperCase() + product.category.slice(1)
      : "General"
    document.getElementById("modalTags").textContent = product.sizes ? product.sizes.join(", ") : "Standard"

    document.getElementById("modalPrice").textContent = window.Currency.format(product.price)
    document.getElementById("modalOriginalPrice").textContent = product.originalPrice
      ? window.Currency.format(product.originalPrice)
      : ""

    const imageUrl = product.images && product.images.length > 0 ? product.images[0] : "/placeholder.svg"
    document.getElementById("mainImage").src = imageUrl
    document.getElementById("mainImage").alt = product.name

    const thumbnailsContainer = document.getElementById("imageThumbnails")
    thumbnailsContainer.innerHTML = ""
    if (product.images && product.images.length > 0) {
      product.images.forEach((img, index) => {
        const thumbnail = document.createElement("img")
        thumbnail.src = img
        thumbnail.alt = `${product.name} - Image ${index + 1}`
        thumbnail.className = `thumbnail ${index === 0 ? "active" : ""}`
        thumbnail.addEventListener("click", () => {
          currentImageIndex = index
          document.getElementById("mainImage").src = img
          document.querySelectorAll(".thumbnail").forEach((t) => t.classList.remove("active"))
          thumbnail.classList.add("active")
        })
        thumbnailsContainer.appendChild(thumbnail)
      })
    }

    const sizeSelector = document.getElementById("sizeSelector")
    sizeSelector.innerHTML = ""
    if (product.sizes && product.sizes.length > 0) {
      product.sizes.forEach((size, index) => {
        const btn = document.createElement("button")
        btn.className = `size-btn ${index === 0 ? "active" : ""}`
        btn.textContent = size
        btn.addEventListener("click", () => {
          document.querySelectorAll(".size-btn").forEach((b) => b.classList.remove("active"))
          btn.classList.add("active")
          document.getElementById("selectedSize").textContent = size
          document.getElementById("sizeSelect").value = size
        })
        sizeSelector.appendChild(btn)
      })
      document.getElementById("selectedSize").textContent = product.sizes[0]
    }

    const colorSelector = document.getElementById("colorSelector")
    colorSelector.innerHTML = ""
    if (product.colors && product.colors.length > 0) {
      const colorMap = {
        Black: "#000000",
        White: "#FFFFFF",
        Navy: "#001f3f",
        Red: "#FF4136",
        Blue: "#0074D9",
        Gray: "#AAAAAA",
        Charcoal: "#36454F",
        Cream: "#FFFDD0",
        Brown: "#8B4513",
        "Dark Brown": "#654321",
        Tan: "#D2B48C",
        Pink: "#FF69B4",
      }

      product.colors.forEach((color, index) => {
        const swatch = document.createElement("div")
        swatch.className = `color-swatch ${index === 0 ? "active" : ""}`
        swatch.style.backgroundColor = colorMap[color] || "#CCCCCC"
        swatch.title = color
        swatch.addEventListener("click", () => {
          document.querySelectorAll(".color-swatch").forEach((s) => s.classList.remove("active"))
          swatch.classList.add("active")
          document.getElementById("selectedColor").textContent = color.toUpperCase()
          const colorSelect = document.getElementById("colorSelect")
          if (colorSelect) {
            colorSelect.value = color
          }
        })
        colorSelector.appendChild(swatch)
      })
      document.getElementById("selectedColor").textContent = product.colors[0].toUpperCase()
    }

    // Reset quantity
    document.getElementById("quantityInput").value = 1

    let sizeSelect = document.getElementById("sizeSelect")
    if (!sizeSelect) {
      sizeSelect = document.createElement("select")
      sizeSelect.id = "sizeSelect"
      sizeSelect.style.display = "none"
      document.body.appendChild(sizeSelect)
    }
    sizeSelect.innerHTML = '<option value="">Choose a size</option>'
    if (product.sizes && product.sizes.length > 0) {
      product.sizes.forEach((size) => {
        const option = document.createElement("option")
        option.value = size
        option.textContent = size
        sizeSelect.appendChild(option)
      })
      sizeSelect.value = product.sizes[0]
    }

    let colorSelect = document.getElementById("colorSelect")
    if (!colorSelect) {
      colorSelect = document.createElement("select")
      colorSelect.id = "colorSelect"
      colorSelect.style.display = "none"
      document.body.appendChild(colorSelect)
    }
    colorSelect.innerHTML = '<option value="">Choose a color</option>'
    if (product.colors && product.colors.length > 0) {
      product.colors.forEach((color) => {
        const option = document.createElement("option")
        option.value = color
        option.textContent = color
        colorSelect.appendChild(option)
      })
      colorSelect.value = product.colors[0]
    }

    const checkoutButtons = document.querySelector(".checkout-buttons")
    if (checkoutButtons && !checkoutButtons.querySelector("#designNowBtn")) {
      const designNowBtn = document.createElement("button")
      designNowBtn.id = "designNowBtn"
      designNowBtn.className = "btn btn-secondary"
      designNowBtn.textContent = "🎨 DESIGN NOW"
      designNowBtn.style.background = "#ff6b35"
      designNowBtn.style.borderColor = "#ff6b35"
      designNowBtn.onclick = () => {
        // Navigate to designer page with product ID
        window.location.href = `designer.html?product_id=${currentProduct.id}`
      }
      checkoutButtons.appendChild(designNowBtn)
    }

    document.getElementById("productModal").classList.add("active")
    document.getElementById("modalOverlay").classList.add("active")
    document.body.style.overflow = "hidden"
  }

  // Close product modal
  const closeProductModal = () => {
    document.getElementById("productModal").classList.remove("active")
    document.getElementById("modalOverlay").classList.remove("active")
    document.body.style.overflow = "auto"
    currentProduct = null
  }

  // Change image in carousel
  const changeImage = (direction) => {
    if (!currentProduct) return

    if (direction === "next") {
      currentImageIndex = (currentImageIndex + 1) % currentProduct.images.length
    } else {
      currentImageIndex = (currentImageIndex - 1 + currentProduct.images.length) % currentProduct.images.length
    }

    document.getElementById("mainImage").src = currentProduct.images[currentImageIndex]
  }

  // Add to cart
  const addToCart = () => {
    if (!currentProduct) return

    const size = document.getElementById("sizeSelect").value
    const colorSelect = document.getElementById("colorSelect")
    const color = colorSelect ? colorSelect.value : "Default"
    const quantity = Number.parseInt(document.getElementById("quantityInput").value)

    if (!size) {
      alert("Please select a size")
      return
    }

    if (colorSelect && !color) {
      alert("Please select a color")
      return
    }

    const cartItem = {
      id: currentProduct.id,
      name: currentProduct.name,
      size,
      color,
      quantity,
      price: currentProduct.price,
      image: currentProduct.images[0],
    }

    cart.push(cartItem)
    saveCart()
    updateCartUI()
    closeProductModal()
    openCart()
  }

  // Order via WhatsApp
  const orderViaWhatsApp = () => {
    if (!currentProduct) return

    const size = document.getElementById("sizeSelect").value
    const colorSelect = document.getElementById("colorSelect")
    const color = colorSelect ? colorSelect.value : "Default"
    const quantity = Number.parseInt(document.getElementById("quantityInput").value)
    const currency = window.Currency.getCurrentCurrency()
    const currencySymbol = window.Currency.getCurrencySymbol()

    if (!size) {
      alert("Please select a size")
      return
    }

    if (colorSelect && !color) {
      alert("Please select a color")
      return
    }

    // Updated WhatsApp number to +2123242286
    const whatsappNumber = "+212723242286"
    const message = `Hi! I'm interested in ordering:\n\n📦 Product: ${currentProduct.name}\n📏 Size: ${size}\n🎨 Color: ${color}\n📊 Quantity: ${quantity}\n💰 Price: ${currencySymbol}${(currentProduct.price * quantity).toFixed(2)} (${currency})\n\nPlease confirm availability and provide payment details.`

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  // Open cart sidebar
  const openCart = () => {
    document.getElementById("cartSidebar").classList.add("active")
    document.getElementById("cartOverlay").classList.add("active")
    document.body.style.overflow = "hidden"
  }

  // Close cart sidebar
  const closeCart = () => {
    document.getElementById("cartSidebar").classList.remove("active")
    document.getElementById("cartOverlay").classList.remove("active")
    document.body.style.overflow = "auto"
  }

  // Update cart UI
  const updateCartUI = () => {
    const cartCount = document.getElementById("cartCount")
    const cartItemsContainer = document.getElementById("cartItems")
    const cartTotal = document.getElementById("cartTotal")

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
    cartCount.textContent = totalItems

    if (cart.length === 0) {
      cartItemsContainer.innerHTML =
        '<p style="padding: 1rem; text-align: center; color: var(--text-secondary);">Your cart is empty</p>'
      cartTotal.textContent = window.Currency.format(0)
      return
    }

    cartItemsContainer.innerHTML = cart
      .map(
        (item, index) => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" class="cart-item-image" onerror="this.src='/--encodeuricomponent-item-name--.jpg'">
        <div class="cart-item-details">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-size">Size: ${item.size}</div>
          <div class="cart-item-size">Color: ${item.color}</div>
          <div class="cart-item-size">Qty: ${item.quantity}</div>
          <div class="cart-item-price">${window.Currency.format(item.price * item.quantity)}</div>
        </div>
        <button class="cart-item-remove" onclick="App.removeFromCart(${index})">Remove</button>
      </div>
    `,
      )
      .join("")

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    cartTotal.textContent = window.Currency.format(total)
  }

  // Remove from cart
  const removeFromCart = (index) => {
    cart.splice(index, 1)
    saveCart()
    updateCartUI()
  }

  // Save cart to localStorage
  const saveCart = () => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }

  // Load cart from localStorage
  const loadCart = () => {
    const saved = localStorage.getItem("cart")
    if (saved) {
      cart = JSON.parse(saved)
      updateCartUI()
    }
  }

  // Handle search
  const handleSearch = (query) => {
    const category = document.getElementById("categoryFilter").value
    let filtered = products

    if (category !== "all") {
      filtered = filtered.filter((p) => p.category === category)
    }

    if (query) {
      filtered = window.Utils.fuzzySearch(query, filtered, "name")
    }

    renderProducts(filtered)
  }

  const handleCategoryFilter = (category) => {
    const query = document.getElementById("searchInput").value
    let filtered = products

    if (category !== "all") {
      filtered = filtered.filter((p) => p.category === category)
    }

    if (query) {
      filtered = window.Utils.fuzzySearch(query, filtered, "name")
    }

    renderProducts(filtered)
  }

  const handleFeaturedTab = (category) => {
    let filtered = products

    if (category !== "all") {
      filtered = filtered.filter((p) => p.category === category)
    }

    renderProducts(filtered)
  }

  const handleLanguageChange = (lang) => {
    console.log("[v0] Changing language to:", lang)
    window.I18n.setLanguage(lang)
    window.I18n.updateUIText()

    const htmlElement = document.documentElement
    if (lang === "ar") {
      htmlElement.setAttribute("dir", "rtl")
      htmlElement.setAttribute("lang", "ar")
    } else {
      htmlElement.setAttribute("dir", "ltr")
      htmlElement.setAttribute("lang", lang)
    }

    renderProducts(filteredProducts)
  }

  const handleCurrencyChange = (currency) => {
    console.log("[v0] Changing currency to:", currency)
    window.Currency.setCurrency(currency)

    // Update all product card prices in real-time
    document.querySelectorAll(".product-price").forEach((priceElement) => {
      const productCard = priceElement.closest(".product-card")
      const productName = productCard.querySelector(".product-name").textContent
      const product = products.find((p) => p.name === productName)

      if (product) {
        priceElement.textContent = window.Currency.format(product.price)
      }
    })

    // Update original prices
    document.querySelectorAll(".product-original-price").forEach((priceElement) => {
      const productCard = priceElement.closest(".product-card")
      const productName = productCard.querySelector(".product-name").textContent
      const product = products.find((p) => p.name === productName)

      if (product && product.originalPrice) {
        priceElement.textContent = window.Currency.format(product.originalPrice)
      }
    })

    // Update modal prices if modal is open
    if (currentProduct && document.getElementById("productModal").classList.contains("active")) {
      document.getElementById("modalPrice").textContent = window.Currency.format(currentProduct.price)
      if (currentProduct.originalPrice) {
        document.getElementById("modalOriginalPrice").textContent = window.Currency.format(currentProduct.originalPrice)
      }
    }

    updateCartUI()
  }

  // Setup event listeners
  const setupEventListeners = () => {
    const mobileMenuToggle = document.getElementById("mobileMenuToggle")
    const headerRight = document.getElementById("headerRight")

    if (mobileMenuToggle) {
      mobileMenuToggle.addEventListener("click", () => {
        headerRight.classList.toggle("active")
        mobileMenuToggle.classList.toggle("active")
      })
    }

    const productModal = document.getElementById("productModal")
    const modalOverlay = document.getElementById("modalOverlay")

    // Close product modal only when clicking the modal background, not content
    productModal.addEventListener("click", (e) => {
      if (e.target === productModal || e.target === modalOverlay) {
        closeProductModal()
      }
    })

    // Close product modal when clicking overlay
    if (modalOverlay) {
      modalOverlay.addEventListener("click", (e) => {
        e.stopPropagation()
        closeProductModal()
      })
    }

    // Close product modal with close button
    const closeBtn = productModal.querySelector(".modal-close")
    if (closeBtn) {
      closeBtn.addEventListener("click", (e) => {
        e.stopPropagation()
        closeProductModal()
      })
    }

    const tabButtons = productModal.querySelectorAll(".tab-button")
    tabButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.stopPropagation()
        const tabName = button.getAttribute("data-tab")

        // Remove active class from all buttons and content
        tabButtons.forEach((btn) => btn.classList.remove("active"))
        productModal.querySelectorAll(".tab-content").forEach((content) => content.classList.remove("active"))

        // Add active class to clicked button and corresponding content
        button.classList.add("active")
        const tabContent = productModal.querySelector(`#${tabName}`)
        if (tabContent) {
          tabContent.classList.add("active")
        }
      })
    })

    // Image carousel
    document.getElementById("prevImage").addEventListener("click", () => changeImage("prev"))
    document.getElementById("nextImage").addEventListener("click", () => changeImage("next"))

    // Quantity controls
    document.getElementById("decreaseQty").addEventListener("click", () => {
      const input = document.getElementById("quantityInput")
      if (input.value > 1) input.value--
    })

    document.getElementById("increaseQty").addEventListener("click", () => {
      const input = document.getElementById("quantityInput")
      input.value++
    })

    // Checkout buttons
    document.getElementById("addToCartBtn").addEventListener("click", addToCart)
    document.getElementById("whatsappCheckoutBtn").addEventListener("click", orderViaWhatsApp)

    // Cart controls
    document.getElementById("cartBtn").addEventListener("click", openCart)
    document.getElementById("closeCartBtn").addEventListener("click", closeCart)
    document.getElementById("cartOverlay").addEventListener("click", closeCart)

    document.getElementById("searchInput").addEventListener("input", (e) => {
      handleSearch(e.target.value)
    })

    document.getElementById("categoryFilter").addEventListener("change", (e) => {
      handleCategoryFilter(e.target.value)
    })

    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"))
        e.target.classList.add("active")
        handleFeaturedTab(e.target.dataset.category)
      })
    })

    const languageSelect = document.getElementById("languageSelect")
    if (languageSelect) {
      languageSelect.addEventListener("change", (e) => {
        console.log("[v0] Language select changed to:", e.target.value)
        handleLanguageChange(e.target.value)
      })
    } else {
      console.error("[v0] Language select element not found")
    }

    const currencySelect = document.getElementById("currencySelect")
    if (currencySelect) {
      currencySelect.addEventListener("change", (e) => {
        console.log("[v0] Currency select changed to:", e.target.value)
        handleCurrencyChange(e.target.value)
      })
    } else {
      console.error("[v0] Currency select element not found")
    }

    document.getElementById("themeToggle").addEventListener("click", () => {
      const isDark = document.body.classList.toggle("dark-mode")
      document.body.classList.toggle("light-mode")
      localStorage.setItem("theme", isDark ? "dark" : "light")
      const icon = document.getElementById("themeToggle").querySelector(".theme-icon")
      icon.textContent = isDark ? "☀️" : "🌙"

      updateLogoForTheme(isDark ? "dark" : "light")
    })

    // Logo upload
    setupLogoUpload()

    document.getElementById("checkoutBtn").addEventListener("click", () => {
      if (cart.length === 0) {
        alert("Your cart is empty")
        return
      }

      // Create checkout options modal
      const checkoutOptions = document.createElement("div")
      checkoutOptions.className = "checkout-options-modal"
      checkoutOptions.innerHTML = `
        <div class="checkout-options-content">
          <h3>Choose Checkout Method</h3>
          <div class="checkout-methods">
            <button id="whatsappCheckoutMethod" class="checkout-method-btn whatsapp-method">
              <span class="method-icon">💬</span>
              <span class="method-name">Order via WhatsApp</span>
              <span class="method-desc">Send order details to our team</span>
            </button>
            <button id="printfulCheckoutMethod" class="checkout-method-btn printful-method">
              <span class="method-icon">🖨️</span>
              <span class="method-name">Send to Printful</span>
              <span class="method-desc">Automatic order processing</span>
            </button>
          </div>
          <button id="closeCheckoutOptions" class="btn btn-secondary" style="width: 100%; margin-top: 1rem;">Cancel</button>
        </div>
      `

      document.body.appendChild(checkoutOptions)

      checkoutOptions.addEventListener("click", (e) => {
        e.stopPropagation()
        if (e.target === checkoutOptions) {
          checkoutOptions.remove()
        }
      })

      document.getElementById("whatsappCheckoutMethod").addEventListener("click", () => {
        const currency = window.Currency.getCurrentCurrency()
        const currencySymbol = window.Currency.getCurrencySymbol()
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
        const message = `Order Summary (${currency}):\n\n${cart.map((item) => `${item.name} (${item.size}, ${item.color}) x${item.quantity}: ${currencySymbol}${(item.price * item.quantity).toFixed(2)}`).join("\n")}\n\nTotal: ${currencySymbol}${total.toFixed(2)} (${currency})`

        const whatsappNumber = "+212723242286"
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
        window.open(whatsappUrl, "_blank")

        checkoutOptions.remove()
        closeCart()
      })

      document.getElementById("printfulCheckoutMethod").addEventListener("click", () => {
        // Create a form modal for customer information
        const formModal = document.createElement("div")
        formModal.className = "checkout-options-modal"
        formModal.innerHTML = `
          <div class="checkout-options-content" style="max-width: 500px;">
            <button class="modal-close" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 2rem; cursor: pointer; z-index: 10;">&times;</button>
            <h3 style="margin-bottom: 1.5rem; margin-top: 1rem;">Complete Your Order</h3>
            
            <form id="customerInfoForm" style="display: flex; flex-direction: column; gap: 1rem;">
              <div>
                <label for="customerName" style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Full Name *</label>
                <input type="text" id="customerName" name="name" required placeholder="John Doe" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border-color); border-radius: 0.5rem; font-size: 1rem;">
              </div>
              
              <div>
                <label for="customerEmail" style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Email *</label>
                <input type="email" id="customerEmail" name="email" required placeholder="john@example.com" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border-color); border-radius: 0.5rem; font-size: 1rem;">
              </div>
              
              <div>
                <label for="customerPhone" style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Phone Number *</label>
                <input type="tel" id="customerPhone" name="phone" required placeholder="+1 (555) 123-4567" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border-color); border-radius: 0.5rem; font-size: 1rem;">
              </div>
              
              <div>
                <label for="customerAddress" style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Shipping Address *</label>
                <textarea id="customerAddress" name="address" required placeholder="123 Main St, City, State, ZIP" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border-color); border-radius: 0.5rem; font-size: 1rem; min-height: 80px; resize: vertical;"></textarea>
              </div>
              
              <div>
                <label for="customerNotes" style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Special Instructions (Optional)</label>
                <textarea id="customerNotes" name="notes" placeholder="Any special requests or notes..." style="width: 100%; padding: 0.75rem; border: 1px solid var(--border-color); border-radius: 0.5rem; font-size: 1rem; min-height: 60px; resize: vertical;"></textarea>
              </div>
              
              <div style="display: flex; gap: 1rem; margin-top: 1rem;">
                <button type="submit" class="btn btn-primary" style="flex: 1;">Submit Order</button>
                <button type="button" id="cancelFormBtn" class="btn btn-secondary" style="flex: 1;">Cancel</button>
              </div>
            </form>
          </div>
        `

        document.body.appendChild(formModal)

        formModal.addEventListener("click", (e) => {
          e.stopPropagation()
          if (e.target === formModal) {
            formModal.remove()
          }
        })

        // Handle form submission
        document.getElementById("customerInfoForm").addEventListener("submit", async (e) => {
          e.preventDefault()

          const GOOGLE_SHEET_URL =
            "https://script.google.com/macros/s/AKfycbxBDYc_48nuDBi299DwvPaEelcf5JdrCK1rNidbsbxT2euvYU9iAb6_eRg5ck9I8nmT/exec"

          // Collect form data
          const formData = {
            name: document.getElementById("customerName").value,
            email: document.getElementById("customerEmail").value,
            phone: document.getElementById("customerPhone").value,
            address: document.getElementById("customerAddress").value,
            notes: document.getElementById("customerNotes").value,
            orderItems: cart.map((item) => ({
              name: item.name,
              size: item.size,
              color: item.color,
              quantity: item.quantity,
              price: item.price,
            })),
            currency: window.Currency.getCurrentCurrency(),
            total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
            orderDate: new Date().toLocaleString(),
          }

          console.log("[v0] ========== ORDER SUBMISSION START ==========")
          console.log("[v0] Customer Name:", formData.name)
          console.log("[v0] Customer Email:", formData.email)
          console.log("[v0] Customer Phone:", formData.phone)
          console.log("[v0] Shipping Address:", formData.address)
          console.log("[v0] Special Notes:", formData.notes)
          console.log("[v0] Order Items:", formData.orderItems)
          console.log("[v0] Currency:", formData.currency)
          console.log("[v0] Total Amount:", formData.total)
          console.log("[v0] Order Date:", formData.orderDate)
          console.log("[v0] Full Form Data:", JSON.stringify(formData, null, 2))
          console.log("[v0] Sending to Google Sheet URL:", GOOGLE_SHEET_URL)

          try {
            console.log("[v0] Initiating fetch request...")
            const response = await fetch(GOOGLE_SHEET_URL, {
              method: "POST",
              mode: "no-cors",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(formData),
            })

            console.log("[v0] ✅ Request sent successfully!")
            console.log("[v0] Response status:", response.status)
            console.log("[v0] Response type:", response.type)
            console.log("[v0] ========== ORDER SUBMISSION END ==========")

            alert(
              "✅ Order submitted successfully! We will process your order and send you a confirmation email shortly.",
            )

            // Clear cart and close modals
            cart = []
            saveCart()
            updateCartUI()
            formModal.remove()
            checkoutOptions.remove()
            closeCart()
          } catch (error) {
            console.error("[v0] ❌ ERROR SENDING TO GOOGLE SHEET!")
            console.error("[v0] Error message:", error.message)
            console.error("[v0] Error name:", error.name)
            console.error("[v0] Error stack:", error.stack)
            console.error("[v0] Full error object:", error)
            console.log("[v0] ========== ORDER SUBMISSION END (WITH ERROR) ==========")
            alert("❌ There was an error submitting your order. Please try again or contact support.")
          }
        })

        // Handle cancel button
        document.getElementById("cancelFormBtn").addEventListener("click", () => {
          formModal.remove()
        })
      })

      document.getElementById("closeCheckoutOptions").addEventListener("click", () => {
        checkoutOptions.remove()
      })
    })
  }

  // Setup logo upload
  const setupLogoUpload = () => {
    const uploadArea = document.getElementById("uploadArea")
    const logoFile = document.getElementById("logoFile")
    const logoUploadModal = document.getElementById("logoUploadModal")
    const previewImg = document.getElementById("previewImg")
    const logoPreview = document.getElementById("logoPreview")
    const uploadLogoBtn = document.getElementById("uploadLogoBtn")
    const modalOverlay = document.getElementById("modalOverlay")

    const savedLogo = localStorage.getItem("customLogo")
    if (savedLogo) {
      const logoImg = document.getElementById("customLogoDisplay")
      if (logoImg) {
        logoImg.src = savedLogo
        console.log("[v0] ✅ Custom logo loaded from localStorage on page load")
      }
    }

    // Open upload modal
    document.getElementById("logoUploadBtn").addEventListener("click", () => {
      logoUploadModal.classList.add("active")
      modalOverlay.classList.add("active")
    })

    // Close upload modal
    logoUploadModal.querySelector(".modal-close").addEventListener("click", () => {
      logoUploadModal.classList.remove("active")
      modalOverlay.classList.remove("active")
    })

    // Upload area click
    uploadArea.addEventListener("click", () => logoFile.click())

    // Drag and drop
    uploadArea.addEventListener("dragover", (e) => {
      e.preventDefault()
      uploadArea.style.borderColor = "var(--secondary-color)"
    })

    uploadArea.addEventListener("dragleave", () => {
      uploadArea.style.borderColor = "var(--border-color)"
    })

    uploadArea.addEventListener("drop", (e) => {
      e.preventDefault()
      uploadArea.style.borderColor = "var(--border-color)"

      const files = e.dataTransfer.files
      if (files.length > 0) {
        handleLogoUpload(files[0])
      }
    })

    // File input change
    logoFile.addEventListener("change", (e) => {
      if (e.target.files.length > 0) {
        handleLogoUpload(e.target.files[0])
      }
    })

    const handleLogoUpload = (file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const logoData = e.target.result
        previewImg.src = logoData
        logoPreview.style.display = "block"
        uploadArea.style.display = "none"
        localStorage.setItem("customLogo", logoData)
        localStorage.setItem("customLogoFileName", file.name)
        localStorage.setItem("customLogoSize", file.size)
        uploadLogoBtn.textContent = "✅ Use This Logo"
        uploadLogoBtn.disabled = false
      }
      reader.readAsDataURL(file)
    }

    uploadLogoBtn.addEventListener("click", async () => {
      const customLogo = localStorage.getItem("customLogo")
      const logoFileName = localStorage.getItem("customLogoFileName") || "custom-logo"
      const logoSize = localStorage.getItem("customLogoSize") || 0

      if (customLogo) {
        showLogoConfirmationModal(logoFileName, logoSize, customLogo)
      } else {
        alert("Please select a logo first")
      }
    })

    const showLogoConfirmationModal = (logoFileName, logoSize, customLogo) => {
      const confirmModal = document.createElement("div")
      confirmModal.className = "checkout-options-modal"
      confirmModal.innerHTML = `
        <div class="checkout-options-content" style="max-width: 500px;">
          <button class="modal-close" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 2rem; cursor: pointer; z-index: 10;">&times;</button>
          <h3 style="margin-bottom: 1.5rem; margin-top: 1rem;"><i class="fab fa-whatsapp"></i> Send Logo to WhatsApp</h3>
          
          <div style="background: var(--background-secondary); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem; text-align: center;">
            <p style="color: var(--text-secondary); margin-bottom: 1rem;">
              Click the button below to send your logo to our WhatsApp team. They will check the quality and contact you.
            </p>
            <p style="color: var(--text-secondary); font-size: 0.9rem;">
              📁 <strong>File:</strong> ${logoFileName}
            </p>
          </div>
          
          <div style="display: flex; gap: 1rem; flex-direction: column;">
            <a href="https://wa.me/212723242286?text=Hi%20NEXA%20team%2C%20I%20have%20a%20custom%20logo%20to%20upload%20for%20quality%20check.%20File%3A%20${encodeURIComponent(logoFileName)}" 
               target="_blank" 
               rel="noopener noreferrer"
               class="btn btn-primary" 
               style="text-decoration: none; display: block; padding: 0.75rem; text-align: center;">
              <i class="fab fa-whatsapp"></i> Open WhatsApp & Send Logo
            </a>
            <button id="confirmLogoSentBtn" class="btn btn-secondary" style="width: 100%; padding: 0.75rem;">
              <i class="fas fa-check"></i> I've Sent the Logo
            </button>
            <button id="cancelSendBtn" class="btn btn-secondary" style="width: 100%; padding: 0.75rem; opacity: 0.7;">
              <i class="fas fa-times"></i> Cancel
            </button>
          </div>
        </div>
      `

      document.body.appendChild(confirmModal)

      const confirmLogoSentBtn = confirmModal.querySelector("#confirmLogoSentBtn")
      const cancelSendBtn = confirmModal.querySelector("#cancelSendBtn")
      const closeBtn = confirmModal.querySelector(".modal-close")

      confirmLogoSentBtn.addEventListener("click", () => {
        confirmModal.remove()
        showLogoSuccessMessage(logoFileName, logoSize)

        const logoImg = document.getElementById("customLogoDisplay")
        if (logoImg) {
          logoImg.src = customLogo
          console.log("[v0] ✅ Logo displayed on website header")
        }

        logoUploadModal.classList.remove("active")
        modalOverlay.classList.remove("active")
        logoPreview.style.display = "none"
        uploadArea.style.display = "block"
        logoFile.value = ""
      })

      cancelSendBtn.addEventListener("click", () => {
        confirmModal.remove()
      })

      closeBtn.addEventListener("click", () => {
        confirmModal.remove()
      })

      confirmModal.addEventListener("click", (e) => {
        if (e.target === confirmModal) {
          confirmModal.remove()
        }
      })
    }

    const showLogoSuccessMessage = (logoFileName, logoSize) => {
      const successModal = document.createElement("div")
      successModal.className = "checkout-options-modal"
      successModal.innerHTML = `
        <div class="checkout-options-content" style="max-width: 500px; text-align: center;">
          <div style="font-size: 3rem; margin-bottom: 1rem;"><i class="fas fa-check-circle" style="color: #27ae60;"></i></div>
          <h3 style="margin-bottom: 1rem; color: var(--secondary-color);"><i class="fas fa-hourglass-start"></i> Logo Upload In Progress</h3>
          
          <div style="background: var(--background-secondary); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem; text-align: left;">
            <p style="margin-bottom: 1rem; color: var(--text-primary);">
              <strong><i class="fas fa-info-circle"></i> Your logo is in progress!</strong>
            </p>
            <p style="color: var(--text-secondary); margin-bottom: 1rem;">
              Our team will check the quality of your logo and contact you via WhatsApp to confirm.
            </p>
            <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 0.5rem;">
              📁 <strong>File:</strong> ${logoFileName}
            </p>
            <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1rem;">
              📱 <strong>WhatsApp:</strong> +212 723 242 286
            </p>
          </div>
          
          <button id="closeSuccessBtn" class="btn btn-primary" style="width: 100%; padding: 0.75rem;">
            <i class="fas fa-check"></i> Close
          </button>
        </div>
      `

      document.body.appendChild(successModal)

      const closeSuccessBtn = successModal.querySelector("#closeSuccessBtn")
      closeSuccessBtn.addEventListener("click", () => {
        successModal.remove()
      })

      successModal.addEventListener("click", (e) => {
        if (e.target === successModal) {
          successModal.remove()
        }
      })
    }
  }

  // Setup modal actions
  const setupModalActions = () => {
    // Share functionality
    document.addEventListener("click", (e) => {
      if (e.target.textContent.includes("SHARE")) {
        e.preventDefault()
        if (navigator.share && currentProduct) {
          navigator
            .share({
              title: currentProduct.name,
              text: currentProduct.description,
              url: window.location.href,
            })
            .catch((err) => console.log("Share cancelled"))
        } else if (currentProduct) {
          const shareText = `Check out this product: ${currentProduct.name} - ${currentProduct.description}`
          const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`
          window.open(whatsappUrl, "_blank")
        }
      }

      if (e.target.textContent.includes("FAQ")) {
        e.preventDefault()
        const faqModal = document.createElement("div")
        faqModal.className = "checkout-options-modal"
        faqModal.id = "faqModalInstance"
        faqModal.innerHTML = `
          <div class="checkout-options-content" style="max-width: 600px; max-height: 80vh; overflow-y: auto;">
            <button class="modal-close" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 2rem; cursor: pointer; z-index: 10;">&times;</button>
            <h3 style="margin-bottom: 1.5rem; margin-top: 1rem;">Frequently Asked Questions</h3>
            
            <div style="display: flex; flex-direction: column; gap: 1rem;">
              <div style="border-bottom: 1px solid var(--border-color); padding-bottom: 1rem;">
                <h4 style="margin-bottom: 0.5rem; color: var(--secondary-color);">What is your shipping time?</h4>
                <p style="color: var(--text-secondary); font-size: 0.9rem;">Orders ship within 5 to 10 business days. Expedited shipping options are available.</p>
              </div>
              
              <div style="border-bottom: 1px solid var(--border-color); padding-bottom: 1rem;">
                <h4 style="margin-bottom: 0.5rem; color: var(--secondary-color);">Do you offer returns?</h4>
                <p style="color: var(--text-secondary); font-size: 0.9rem;">Yes, we offer a 30-day return policy for unused items in original packaging.</p>
              </div>
              
              <div style="border-bottom: 1px solid var(--border-color); padding-bottom: 1rem;">
                <h4 style="margin-bottom: 0.5rem; color: var(--secondary-color);">Can I customize products?</h4>
                <p style="color: var(--text-secondary); font-size: 0.9rem;">We offer custom printing and personalization for most products.</p>
              </div>
              
              <div style="border-bottom: 1px solid var(--border-color); padding-bottom: 1rem;">
                <h4 style="margin-bottom: 0.5rem; color: var(--secondary-color);">What payment methods do you accept?</h4>
                <p style="color: var(--text-secondary); font-size: 0.9rem;">We accept all major credit cards, PayPal, and bank transfers.</p>
              </div>
              
              <div style="padding-bottom: 1rem;">
                <h4 style="margin-bottom: 0.5rem; color: var(--secondary-color);">How can I track my order?</h4>
                <p style="color: var(--text-secondary); font-size: 0.9rem;">You'll receive a tracking number via email once your order ships.</p>
              </div>
            </div>
          </div>
        `
        document.body.appendChild(faqModal)

        const closeFaqBtn = faqModal.querySelector(".modal-close")
        if (closeFaqBtn) {
          closeFaqBtn.addEventListener("click", (e) => {
            e.stopPropagation()
            faqModal.remove()
          })
        }

        faqModal.addEventListener("click", (e) => {
          if (e.target === faqModal) {
            faqModal.remove()
          }
        })
      }

      if (e.target.textContent.includes("ASK A QUESTION")) {
        e.preventDefault()
        const questionModal = document.createElement("div")
        questionModal.className = "checkout-options-modal"
        questionModal.id = "questionModalInstance"
        questionModal.innerHTML = `
          <div class="checkout-options-content" style="max-width: 500px;">
            <button class="modal-close" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 2rem; cursor: pointer; z-index: 10;">&times;</button>
            <h3 style="margin-bottom: 1.5rem; margin-top: 1rem;">Ask a Question</h3>
            
            <form id="questionForm" style="display: flex; flex-direction: column; gap: 1rem;">
              <div>
                <label for="questionName" style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Your Name *</label>
                <input type="text" id="questionName" required placeholder="John Doe" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border-color); border-radius: 0.5rem; font-size: 1rem;">
              </div>
              
              <div>
                <label for="questionEmail" style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Your Email *</label>
                <input type="email" id="questionEmail" required placeholder="john@example.com" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border-color); border-radius: 0.5rem; font-size: 1rem;">
              </div>
              
              <div>
                <label for="questionText" style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Your Question *</label>
                <textarea id="questionText" required placeholder="Ask your question here..." style="width: 100%; padding: 0.75rem; border: 1px solid var(--border-color); border-radius: 0.5rem; font-size: 1rem; min-height: 100px; resize: vertical;"></textarea>
              </div>
              
              <div style="display: flex; gap: 1rem; margin-top: 1rem;">
                <button type="submit" class="btn btn-primary" style="flex: 1;">Send Question</button>
                <button type="button" id="cancelQuestionBtn" class="btn btn-secondary" style="flex: 1;">Cancel</button>
              </div>
            </form>
          </div>
        `
        document.body.appendChild(questionModal)

        const questionForm = questionModal.querySelector("#questionForm")
        if (questionForm) {
          questionForm.addEventListener("submit", (e) => {
            e.preventDefault()
            const name = questionModal.querySelector("#questionName").value
            const email = questionModal.querySelector("#questionEmail").value
            const question = questionModal.querySelector("#questionText").value

            const whatsappNumber = "+212723242286"
            const message = `Hi! I have a question:\n\nName: ${name}\nEmail: ${email}\n\nQuestion: ${question}`
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
            window.open(whatsappUrl, "_blank")

            questionModal.remove()
          })
        }

        const closeQuestionBtn = questionModal.querySelector(".modal-close")
        if (closeQuestionBtn) {
          closeQuestionBtn.addEventListener("click", (e) => {
            e.stopPropagation()
            questionModal.remove()
          })
        }

        const cancelQuestionBtn = questionModal.querySelector("#cancelQuestionBtn")
        if (cancelQuestionBtn) {
          cancelQuestionBtn.addEventListener("click", (e) => {
            e.preventDefault()
            questionModal.remove()
          })
        }

        questionModal.addEventListener("click", (e) => {
          if (e.target === questionModal) {
            questionModal.remove()
          }
        })
      }
    })
  }

  // Setup contact form
  const setupContactForm = () => {
    const contactForm = document.getElementById("contactForm")
    if (!contactForm) return

    contactForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const name = document.getElementById("contactName").value
      const email = document.getElementById("contactEmail").value
      const phone = document.getElementById("contactPhone").value
      const subject = document.getElementById("contactSubject").value
      const message = document.getElementById("contactMessage").value

      const whatsappNumber = "+212723242286"
      const whatsappMessage = `Contact Form Submission:\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nSubject: ${subject}\n\nMessage:\n${message}`

      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`
      window.open(whatsappUrl, "_blank")

      // Show success message
      alert("Thank you for your message! We'll contact you soon via WhatsApp.")
      contactForm.reset()
    })
  }

  const applyWebsiteSettings = (settings) => {
    if (!settings) return

    // Apply store info to footer and header
    if (settings.store) {
      const storeNameElements = document.querySelectorAll(".store-name, .footer-store-name")
      storeNameElements.forEach((el) => {
        el.textContent = settings.store.name || "NEXA Print"
      })

      const storePhoneElements = document.querySelectorAll(".store-phone, .footer-phone")
      storePhoneElements.forEach((el) => {
        el.textContent = settings.store.phone || "+212 723 242 286"
      })

      const storeEmailElements = document.querySelectorAll(".store-email, .footer-email")
      storeEmailElements.forEach((el) => {
        el.textContent = settings.store.email || "info@nexaprint.com"
      })
    }

    // Apply theme colors
    if (settings.theme) {
      const root = document.documentElement
      root.style.setProperty("--primary-color", settings.theme.primaryColor || "#6a79fa")
      root.style.setProperty("--secondary-color", settings.theme.secondaryColor || "#1a1a1a")
      root.style.setProperty("--accent-color", settings.theme.accentColor || "#27ae60")
      root.style.setProperty("--background-color", settings.theme.backgroundColor || "#f5f5f5")
    }

    // Apply SEO
    if (settings.seo) {
      if (settings.seo.title) {
        document.title = settings.seo.title
      }
      if (settings.seo.description) {
        const metaDescription = document.querySelector('meta[name="description"]')
        if (metaDescription) {
          metaDescription.setAttribute("content", settings.seo.description)
        }
      }
      if (settings.seo.keywords) {
        const metaKeywords = document.querySelector('meta[name="keywords"]')
        if (metaKeywords) {
          metaKeywords.setAttribute("content", settings.seo.keywords)
        }
      }
    }

    console.log("[v0] Website settings applied successfully")
  }

  return {
    init,
    removeFromCart,
    cart,
    saveCart: saveCart,
    updateCartUI: updateCartUI,
    openCart: openCart,
  }
})()

// Start app when DOM is ready
document.addEventListener("DOMContentLoaded", App.init)

window.PRODUCTS_DATA = [
  {
    id: 1,
    name: "Classic T-Shirt",
    description: "Premium quality 100% cotton t-shirt perfect for custom printing",
    price: 449,
    originalPrice: 649,
    images: [
      "https://demo811.leotheme.com/prestashop/leo_aprin_elementor_demo/24-home_default/hummingbird-printed-t-shirt.jpg",
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Black", "White", "Navy", "Red", "Gray"],
    category: "mens-clothing",
    fullDescription: "Premium quality 100% cotton t-shirt. Perfect for any custom design or print.",
  },
  {
    id: 2,
    name: "Polo Shirt",
    description: "Professional polo shirt with embroidery options",
    price: 349,
    originalPrice: 449,
    images: [
      "https://demo811.leotheme.com/prestashop/leo_aprin_elementor_demo/24-home_default/hummingbird-printed-t-shirt.jpg",
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Black", "White", "Navy", "Red", "Gray"],
    category: "mens-clothing",
    fullDescription: "Professional polo shirt perfect for corporate branding.",
  },
  {
    id: 3,
    name: "Premium Hoodie",
    description: "Comfortable and warm hoodie ideal for branding",
    price: 799,
    originalPrice: 1099,
    images: [
      "https://demo811.leotheme.com/prestashop/leo_aprin_elementor_demo/24-home_default/hummingbird-printed-t-shirt.jpg",
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Navy", "Gray", "Charcoal"],
    category: "mens-clothing",
    fullDescription: "Stay warm and comfortable with this premium hoodie.",
  },
  {
    id: 4,
    name: "Sweatshirt",
    description: "Cozy sweatshirt perfect for casual branding",
    price: 449,
    originalPrice: 599,
    images: [
      "https://demo811.leotheme.com/prestashop/leo_aprin_elementor_demo/24-home_default/hummingbird-printed-t-shirt.jpg",
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Gray", "Navy", "Charcoal"],
    category: "mens-clothing",
    fullDescription: "Comfortable and cozy sweatshirt perfect for casual wear.",
  },
  {
    id: 5,
    name: "Pants",
    description: "Premium quality pants for everyday wear",
    price: 599,
    originalPrice: 799,
    images: [
      "https://demo811.leotheme.com/prestashop/leo_aprin_elementor_demo/24-home_default/hummingbird-printed-t-shirt.jpg",
    ],
    sizes: ["28", "30", "32", "34", "36", "38"],
    colors: ["Black", "Navy", "Gray", "Khaki"],
    category: "mens-clothing",
    fullDescription: "Premium quality pants perfect for any occasion.",
  },
  {
    id: 6,
    name: "Knitwear",
    description: "Stylish knitwear for layering",
    price: 499,
    originalPrice: 699,
    images: [
      "https://demo811.leotheme.com/prestashop/leo_aprin_elementor_demo/24-home_default/hummingbird-printed-t-shirt.jpg",
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Navy", "Gray", "Cream"],
    category: "mens-clothing",
    fullDescription: "Stylish knitwear perfect for layering and warmth.",
  },
  {
    id: 7,
    name: "Women's Crop Top",
    description: "Trendy crop top for modern style",
    price: 299,
    originalPrice: 399,
    images: [
      "https://demo811.leotheme.com/prestashop/leo_aprin_elementor_demo/24-home_default/hummingbird-printed-t-shirt.jpg",
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "White", "Pink", "Red"],
    category: "womens-clothing",
    fullDescription: "Trendy crop top perfect for modern style and comfort.",
  },
  {
    id: 8,
    name: "Tank Top",
    description: "Lightweight tank top perfect for summer",
    price: 199,
    originalPrice: 279,
    images: [
      "https://demo811.leotheme.com/prestashop/leo_aprin_elementor_demo/24-home_default/hummingbird-printed-t-shirt.jpg",
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Black", "White", "Navy", "Red"],
    category: "womens-clothing",
    fullDescription: "Lightweight and comfortable tank top perfect for summer wear.",
  },
  {
    id: 9,
    name: "Women's Polo Shirt",
    description: "Professional women's polo shirt",
    price: 349,
    originalPrice: 449,
    images: [
      "https://demo811.leotheme.com/prestashop/leo_aprin_elementor_demo/24-home_default/hummingbird-printed-t-shirt.jpg",
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Black", "White", "Navy", "Red"],
    category: "womens-clothing",
    fullDescription: "Professional women's polo shirt perfect for corporate branding.",
  },
  {
    id: 10,
    name: "Women's T-Shirt",
    description: "Premium quality women's t-shirt",
    price: 349,
    originalPrice: 449,
    images: [
      "https://demo811.leotheme.com/prestashop/leo_aprin_elementor_demo/24-home_default/hummingbird-printed-t-shirt.jpg",
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Black", "White", "Navy", "Red", "Pink"],
    category: "womens-clothing",
    fullDescription: "Premium quality women's t-shirt perfect for any custom design.",
  },
  {
    id: 11,
    name: "Women's Dress",
    description: "Elegant dress for any occasion",
    price: 699,
    originalPrice: 999,
    images: [
      "https://demo811.leotheme.com/prestashop/leo_aprin_elementor_demo/24-home_default/hummingbird-printed-t-shirt.jpg",
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "White", "Navy", "Red"],
    category: "womens-clothing",
    fullDescription: "Elegant dress perfect for any occasion.",
  },
  {
    id: 12,
    name: "Women's Knitwear",
    description: "Stylish women's knitwear",
    price: 499,
    originalPrice: 699,
    images: [
      "https://demo811.leotheme.com/prestashop/leo_aprin_elementor_demo/24-home_default/hummingbird-printed-t-shirt.jpg",
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Navy", "Gray", "Cream"],
    category: "womens-clothing",
    fullDescription: "Stylish women's knitwear perfect for layering.",
  },
  {
    id: 13,
    name: "Women's Hoodie",
    description: "Comfortable women's hoodie",
    price: 799,
    originalPrice: 1099,
    images: [
      "https://demo811.leotheme.com/prestashop/leo_aprin_elementor_demo/24-home_default/hummingbird-printed-t-shirt.jpg",
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Navy", "Gray", "Pink"],
    category: "womens-clothing",
    fullDescription: "Comfortable women's hoodie perfect for warmth and style.",
  },
  {
    id: 14,
    name: "Women's Sweatshirt",
    description: "Cozy women's sweatshirt",
    price: 449,
    originalPrice: 599,
    images: [
      "https://demo811.leotheme.com/prestashop/leo_aprin_elementor_demo/24-home_default/hummingbird-printed-t-shirt.jpg",
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Gray", "Navy", "Pink"],
    category: "womens-clothing",
    fullDescription: "Cozy women's sweatshirt perfect for casual wear.",
  },
  {
    id: 15,
    name: "Women's Bottoms",
    description: "Premium quality women's bottoms",
    price: 499,
    originalPrice: 699,
    images: [
      "https://demo811.leotheme.com/prestashop/leo_aprin_elementor_demo/24-home_default/hummingbird-printed-t-shirt.jpg",
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "Navy", "Gray", "Khaki"],
    category: "womens-clothing",
    fullDescription: "Premium quality women's bottoms for any occasion.",
  },
  {
    id: 16,
    name: "Women's Shorts",
    description: "Comfortable women's shorts",
    price: 299,
    originalPrice: 399,
    images: [
      "https://demo811.leotheme.com/prestashop/leo_aprin_elementor_demo/24-home_default/hummingbird-printed-t-shirt.jpg",
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "Navy", "Khaki", "White"],
    category: "womens-clothing",
    fullDescription: "Comfortable women's shorts perfect for summer.",
  },
  {
    id: 17,
    name: "Women's Pants",
    description: "Premium quality women's pants",
    price: 599,
    originalPrice: 799,
    images: [
      "https://demo811.leotheme.com/prestashop/leo_aprin_elementor_demo/24-home_default/hummingbird-printed-t-shirt.jpg",
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "Navy", "Gray", "Khaki"],
    category: "womens-clothing",
    fullDescription: "Premium quality women's pants perfect for any occasion.",
  },
  {
    id: 18,
    name: "Kids T-Shirt",
    description: "Comfortable kids t-shirt",
    price: 199,
    originalPrice: 279,
    images: [
      "https://demo811.leotheme.com/prestashop/leo_aprin_elementor_demo/24-home_default/hummingbird-printed-t-shirt.jpg",
    ],
    sizes: ["2T", "3T", "4T", "5T", "6T", "7T"],
    colors: ["Black", "White", "Navy", "Red", "Pink"],
    category: "kids-clothing",
    fullDescription: "Comfortable kids t-shirt perfect for everyday wear.",
  },
  {
    id: 19,
    name: "Kids All-Over Shirt",
    description: "Fun all-over printed kids shirt",
    price: 249,
    originalPrice: 349,
    images: [
      "https://demo811.leotheme.com/prestashop/leo_aprin_elementor_demo/24-home_default/hummingbird-printed-t-shirt.jpg",
    ],
    sizes: ["2T", "3T", "4T", "5T", "6T", "7T"],
    colors: ["Multi", "Navy", "White"],
    category: "kids-clothing",
    fullDescription: "Fun all-over printed kids shirt perfect for playtime.",
  },
  {
    id: 20,
    name: "Kids Hoodie",
    description: "Warm kids hoodie",
    price: 399,
    originalPrice: 549,
    images: [
      "https://demo811.leotheme.com/prestashop/leo_aprin_elementor_demo/24-home_default/hummingbird-printed-t-shirt.jpg",
    ],
    sizes: ["2T", "3T", "4T", "5T", "6T", "7T"],
    colors: ["Black", "Navy", "Gray", "Pink"],
    category: "kids-clothing",
    fullDescription: "Warm kids hoodie perfect for cold weather.",
  },
  {
    id: 21,
    name: "Kids Sweatshirt",
    description: "Cozy kids sweatshirt",
    price: 299,
    originalPrice: 399,
    images: [
      "https://demo811.leotheme.com/prestashop/leo_aprin_elementor_demo/24-home_default/hummingbird-printed-t-shirt.jpg",
    ],
    sizes: ["2T", "3T", "4T", "5T", "6T", "7T"],
    colors: ["Black", "Gray", "Navy", "Pink"],
    category: "kids-clothing",
    fullDescription: "Cozy kids sweatshirt perfect for comfort.",
  },
  {
    id: 22,
    name: "Baseball Cap",
    description: "Adjustable baseball cap",
    price: 199,
    originalPrice: 299,
    images: [
      "https://demo811.leotheme.com/prestashop/leo_aprin_elementor_demo/24-home_default/hummingbird-printed-t-shirt.jpg",
    ],
    sizes: ["One Size"],
    colors: ["Black", "White", "Navy", "Red"],
    category: "hats",
    fullDescription: "Classic baseball cap with adjustable strap.",
  },
  {
    id: 23,
    name: "Beanie Hat",
    description: "Warm and stylish beanie",
    price: 149,
    originalPrice: 199,
    images: [
      "https://demo811.leotheme.com/prestashop/leo_aprin_elementor_demo/24-home_default/hummingbird-printed-t-shirt.jpg",
    ],
    sizes: ["One Size"],
    colors: ["Black", "Navy", "Gray", "Red"],
    category: "hats",
    fullDescription: "Stay warm and stylish with this premium beanie.",
  },
  {
    id: 24,
    name: "Sunglasses",
    description: "UV protection sunglasses",
    price: 299,
    originalPrice: 399,
    images: ["https://demo811.leotheme.com/prestashop/leo_aprin_elementor_demo/56-home_default/brown-bear-cushion.jpg"],
    sizes: ["One Size"],
    colors: ["Black", "Brown", "Blue"],
    category: "accessories",
    fullDescription: "Stylish sunglasses with UV protection.",
  },
  {
    id: 25,
    name: "Tote Bag",
    description: "Eco-friendly canvas tote bag",
    price: 249,
    originalPrice: 349,
    images: ["https://demo811.leotheme.com/prestashop/leo_aprin_elementor_demo/56-home_default/brown-bear-cushion.jpg"],
    sizes: ["One Size"],
    colors: ["Natural", "Black", "Navy", "Red"],
    category: "accessories",
    fullDescription: "Eco-friendly canvas tote bag perfect for shopping.",
  },
  {
    id: 26,
    name: "Backpack",
    description: "Durable and spacious backpack",
    price: 499,
    originalPrice: 699,
    images: ["https://demo811.leotheme.com/prestashop/leo_aprin_elementor_demo/56-home_default/brown-bear-cushion.jpg"],
    sizes: ["One Size"],
    colors: ["Black", "Navy", "Gray"],
    category: "accessories",
    fullDescription: "Spacious and durable backpack perfect for travel.",
  },
  {
    id: 27,
    name: "Messenger Bag",
    description: "Professional messenger bag",
    price: 399,
    originalPrice: 549,
    images: ["https://demo811.leotheme.com/prestashop/leo_aprin_elementor_demo/56-home_default/brown-bear-cushion.jpg"],
    sizes: ["One Size"],
    colors: ["Black", "Brown", "Navy"],
    category: "accessories",
    fullDescription: "Professional messenger bag perfect for work.",
  },
  {
    id: 28,
    name: "Brown Bear Cushion",
    description: "Adorable brown bear cushion",
    price: 599,
    originalPrice: 899,
    images: ["https://demo811.leotheme.com/prestashop/leo_aprin_elementor_demo/56-home_default/brown-bear-cushion.jpg"],
    sizes: ["Small", "Medium", "Large"],
    colors: ["Brown", "Tan", "Dark Brown"],
    category: "home-living",
    fullDescription: "Cute and cuddly brown bear cushion for decoration.",
  },
  {
    id: 29,
    name: "Luxury Cushion",
    description: "Premium luxury cushion",
    price: 699,
    originalPrice: 999,
    images: ["https://demo811.leotheme.com/prestashop/leo_aprin_elementor_demo/56-home_default/brown-bear-cushion.jpg"],
    sizes: ["Small", "Medium", "Large"],
    colors: ["Brown", "Tan", "Dark Brown", "Cream"],
    category: "home-living",
    fullDescription: "Premium luxury cushion perfect for home decoration.",
  },
  {
    id: 30,
    name: "Ceramic Mug",
    description: "11oz ceramic mug",
    price: 299,
    originalPrice: 399,
    images: [
      "https://demo811.leotheme.com/prestashop/leo_aprin_elementor_demo/45-home_default/mug-the-adventure-begins.jpg",
    ],
    sizes: ["11oz", "15oz"],
    colors: ["White", "Black", "Cream"],
    category: "home-living",
    fullDescription: "Perfect for your morning coffee or tea.",
  },
  {
    id: 31,
    name: "Water Bottle",
    description: "Stainless steel water bottle",
    price: 199,
    originalPrice: 279,
    images: [
      "https://demo811.leotheme.com/prestashop/leo_aprin_elementor_demo/45-home_default/mug-the-adventure-begins.jpg",
    ],
    sizes: ["500ml", "750ml", "1L"],
    colors: ["Silver", "Black", "Blue"],
    category: "home-living",
    fullDescription: "Keep your drinks at the perfect temperature.",
  },
  {
    id: 32,
    name: "Coffee Tumbler",
    description: "Insulated coffee tumbler",
    price: 249,
    originalPrice: 349,
    images: [
      "https://demo811.leotheme.com/prestashop/leo_aprin_elementor_demo/45-home_default/mug-the-adventure-begins.jpg",
    ],
    sizes: ["12oz", "16oz"],
    colors: ["Black", "White", "Red"],
    category: "home-living",
    fullDescription: "Keep your coffee hot with this insulated tumbler.",
  },
  {
    id: 33,
    name: "Sticker Sheet",
    description: "High-quality vinyl sticker sheet",
    price: 49,
    originalPrice: 79,
    images: [
      "https://demo811.leotheme.com/prestashop/leo_aprin_elementor_demo/47-home_default/mug-today-is-a-good-day.jpg",
    ],
    sizes: ["4x6 inches", "6x8 inches"],
    colors: ["Full Color", "White", "Clear"],
    category: "collections",
    fullDescription: "High-quality vinyl stickers perfect for decoration.",
  },
  {
    id: 34,
    name: "Vinyl Stickers Pack",
    description: "Set of 10 custom vinyl stickers",
    price: 79,
    originalPrice: 129,
    images: [
      "https://demo811.leotheme.com/prestashop/leo_aprin_elementor_demo/47-home_default/mug-today-is-a-good-day.jpg",
    ],
    sizes: ["Standard"],
    colors: ["Full Color", "White", "Clear"],
    category: "collections",
    fullDescription: "Set of 10 high-quality vinyl stickers.",
  },
  {
    id: 35,
    name: "Phone Case",
    description: "Durable phone case",
    price: 99,
    originalPrice: 149,
    images: [
      "https://demo811.leotheme.com/prestashop/leo_aprin_elementor_demo/45-home_default/mug-the-adventure-begins.jpg",
    ],
    sizes: ["iPhone 13", "iPhone 14", "iPhone 15", "Samsung S21", "Samsung S22"],
    colors: ["Black", "Clear", "White"],
    category: "brands",
    fullDescription: "Protect your phone with style.",
  },
  {
    id: 36,
    name: "Laptop Sleeve",
    description: "Protective laptop sleeve",
    price: 299,
    originalPrice: 399,
    images: [
      "https://demo811.leotheme.com/prestashop/leo_aprin_elementor_demo/45-home_default/mug-the-adventure-begins.jpg",
    ],
    sizes: ["13 inch", "15 inch", "17 inch"],
    colors: ["Black", "Gray", "Navy"],
    category: "brands",
    fullDescription: "Protect your laptop with this durable sleeve.",
  },
  {
    id: 37,
    name: "Wireless Earbuds Case",
    description: "Protective case for wireless earbuds",
    price: 79,
    originalPrice: 129,
    images: [
      "https://demo811.leotheme.com/prestashop/leo_aprin_elementor_demo/45-home_default/mug-the-adventure-begins.jpg",
    ],
    sizes: ["Standard"],
    colors: ["Black", "White", "Blue"],
    category: "brands",
    fullDescription: "Protect your wireless earbuds with this durable case.",
  },
  {
    id: 38,
    name: "Amelia iPhone Case",
    description: "Premium protective iPhone case",
    price: 1190,
    originalPrice: 1590,
    images: [
      "https://demo811.leotheme.com/prestashop/leo_aprin_elementor_demo/45-home_default/mug-the-adventure-begins.jpg",
    ],
    sizes: ["iPhone 12", "iPhone 13", "iPhone 14", "iPhone 15", "iPhone 15 Pro"],
    colors: ["Black", "White", "Blue", "Red"],
    category: "brands",
    fullDescription: "Protect your iPhone with style and premium quality.",
  },
]
