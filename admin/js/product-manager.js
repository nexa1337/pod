const ProductManager = (() => {
  let products = []
  let inventory = {}
  let productHistory = []

  const init = () => {
    console.log("[v0] Initializing Product Manager...")
    loadProductData()
    setupProductManagementUI()
    setupInventoryTracking()
    setupBulkOperations()
  }

  const loadProductData = () => {
    const savedProducts = localStorage.getItem("websiteProducts")
    products = savedProducts ? JSON.parse(savedProducts) : []

    const savedInventory = localStorage.getItem("productInventory")
    inventory = savedInventory ? JSON.parse(savedInventory) : {}

    // Initialize inventory for all products
    products.forEach((product) => {
      if (!inventory[product.id]) {
        inventory[product.id] = {
          stock: 100,
          reserved: 0,
          sold: 0,
          lastUpdated: new Date().toISOString(),
        }
      }
    })

    saveInventory()
    console.log("[v0] Product data loaded:", { products: products.length, inventory: Object.keys(inventory).length })
  }

  const setupProductManagementUI = () => {
    // Create product management section if it doesn't exist
    const productsSection = document.getElementById("products")
    if (!productsSection) return

    const formHTML = `
      <div class="product-form-container">
        <h3>Add New Product</h3>
        <form id="productForm" class="product-form">
          <div class="form-row">
            <div class="form-group">
              <label>Product Name *</label>
              <input type="text" id="productName" required>
            </div>
            <div class="form-group">
              <label>SKU</label>
              <input type="text" id="productSKU">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Category *</label>
              <select id="productCategory" required>
                <option value="">Select Category</option>
                <option value="Mens-clothing">Mens Clothing</option>
                <option value="Womens-clothing">Womens Clothing</option>
                <option value="Accessories">Accessories</option>
                <option value="Shoes">Shoes</option>
                <option value="Electronics">Electronics</option>
                <option value="Home">Home</option>
              </select>
            </div>
            <div class="form-group">
              <label>Stock</label>
              <input type="number" id="productStock" value="100" min="0">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Price (MAD) *</label>
              <input type="number" id="productPrice" step="0.01" required min="0">
            </div>
            <div class="form-group">
              <label>Original Price (MAD)</label>
              <input type="number" id="productOriginalPrice" step="0.01" min="0">
            </div>
          </div>

          <div class="form-group">
            <label>Description *</label>
            <textarea id="productDescription" rows="3" required placeholder="Short product description"></textarea>
          </div>

          <div class="form-group">
            <label>Full Description</label>
            <textarea id="productFullDescription" rows="4" placeholder="Detailed product description"></textarea>
          </div>

          <div class="form-group">
            <label>Additional Information</label>
            <textarea id="productAdditionalInfo" rows="3" placeholder="Material, care instructions, specifications, etc."></textarea>
          </div>

          <div class="form-group">
            <label>Available Sizes (comma-separated)</label>
            <input type="text" id="productSizes" placeholder="S, M, L, XL">
          </div>

          <div class="form-group">
            <label>Available Colors (comma-separated)</label>
            <input type="text" id="productColors" placeholder="Black, White, Navy">
          </div>

          <div class="form-group">
            <label>Product Images (up to 5 images) *</label>
            <div id="imageUploadArea" class="image-upload-area">
              <input type="file" id="imageInput" multiple accept="image/*" style="display:none;">
              <button type="button" id="uploadImageBtn" class="btn btn-secondary">
                <i class="fas fa-cloud-upload"></i> Upload Images
              </button>
            </div>
            <div id="imagePreviewContainer" class="image-preview-container"></div>
          </div>

          <div class="form-actions">
            <button type="button" id="cancelProductBtn" class="btn btn-secondary">Cancel</button>
            <button type="submit" class="btn btn-primary">Save Product</button>
          </div>
        </form>
      </div>
    `

    const existingForm = productsSection.querySelector(".product-form-container")
    if (existingForm) {
      existingForm.remove()
    }

    const formContainer = document.createElement("div")
    formContainer.innerHTML = formHTML
    productsSection.insertBefore(formContainer.firstElementChild, productsSection.firstChild)

    setupProductFormListeners()
  }

  const setupProductFormListeners = () => {
    const form = document.getElementById("productForm")
    if (!form) return

    document.getElementById("uploadImageBtn")?.addEventListener("click", (e) => {
      e.preventDefault()
      document.getElementById("imageInput").click()
    })

    document.getElementById("imageInput")?.addEventListener("change", handleImageUpload)

    document.getElementById("cancelProductBtn")?.addEventListener("click", (e) => {
      e.preventDefault()
      closeProductModal()
    })

    form.addEventListener("submit", (e) => {
      e.preventDefault()
      addNewProduct()
    })
  }

  const closeProductModal = () => {
    const form = document.getElementById("productForm")
    if (form) {
      form.reset()
      document.getElementById("imagePreviewContainer").innerHTML = ""
      document.getElementById("imageInput").value = ""
      console.log("[v0] Product form cleared")
    }
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    const container = document.getElementById("imagePreviewContainer")

    // Limit to 5 images
    if (files.length > 5) {
      alert("Maximum 5 images allowed")
      return
    }

    container.innerHTML = ""
    const uploadedImages = []

    files.forEach((file, index) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        uploadedImages.push(event.target.result)

        const preview = document.createElement("div")
        preview.className = "image-preview-item"
        preview.innerHTML = `
          <img src="${event.target.result}" alt="Preview ${index + 1}">
          <button type="button" class="remove-image-btn" data-index="${index}">
            <i class="fas fa-trash"></i>
          </button>
        `
        container.appendChild(preview)

        preview.querySelector(".remove-image-btn").addEventListener("click", (e) => {
          e.preventDefault()
          uploadedImages.splice(index, 1)
          preview.remove()
        })
      }
      reader.readAsDataURL(file)
    })

    // Store images for form submission
    document.getElementById("productForm").dataset.uploadedImages = JSON.stringify(uploadedImages)
  }

  const addNewProduct = () => {
    const form = document.getElementById("productForm")
    const name = document.getElementById("productName").value
    const price = Number.parseFloat(document.getElementById("productPrice").value)
    const description = document.getElementById("productDescription").value
    const fullDescription = document.getElementById("productFullDescription").value
    const additionalInfo = document.getElementById("productAdditionalInfo").value
    const category = document.getElementById("productCategory").value
    const stock = Number.parseInt(document.getElementById("productStock").value) || 100
    const sizes = document
      .getElementById("productSizes")
      .value.split(",")
      .map((s) => s.trim())
      .filter(Boolean)

    const colorsInput = document.getElementById("productColors").value
    const colors = colorsInput
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean)
      .map((colorName) => {
        // Map color names to hex values
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
          Green: "#2ECC71",
          Orange: "#FF8C00",
          Purple: "#9B59B6",
        }
        return {
          name: colorName,
          hex: colorMap[colorName] || "#000000",
        }
      })

    const originalPrice = Number.parseFloat(document.getElementById("productOriginalPrice").value) || null
    const sku = document.getElementById("productSKU").value

    const imagesData =
      document.getElementById("imageInput").files.length > 0
        ? Array.from(document.getElementById("imageInput").files).map((file) => URL.createObjectURL(file))
        : JSON.parse(form.dataset.uploadedImages || "[]")

    if (!name || !price || !description || imagesData.length === 0) {
      alert("Please fill in all required fields and upload at least one image")
      return
    }

    const newProduct = {
      id: Date.now(),
      name,
      price,
      originalPrice,
      description,
      fullDescription,
      additionalInfo,
      category,
      sizes,
      colors,
      images: imagesData,
      sku: sku || `E-${String(Date.now()).slice(-5)}`,
      createdAt: new Date().toISOString(),
    }

    products.push(newProduct)
    inventory[newProduct.id] = {
      stock,
      reserved: 0,
      sold: 0,
      lastUpdated: new Date().toISOString(),
    }

    saveProducts()
    saveInventory()

    // Reset form
    form.reset()
    document.getElementById("imagePreviewContainer").innerHTML = ""
    document.getElementById("imageInput").value = ""

    alert("Product added successfully!")
    window.dispatchEvent(new CustomEvent("productsUpdated", { detail: { products } }))
    console.log("[v0] New product added:", newProduct)
  }

  const setupProductControlListeners = () => {
    document.getElementById("bulkEditBtn")?.addEventListener("click", openBulkEditModal)
    document.getElementById("bulkDeleteBtn")?.addEventListener("click", openBulkDeleteModal)
    document.getElementById("exportProductsBtn")?.addEventListener("click", exportProducts)
    document.getElementById("importProductsBtn")?.addEventListener("click", () => {
      document.getElementById("importFile").click()
    })

    // File input for import
    let importInput = document.getElementById("importFile")
    if (!importInput) {
      importInput = document.createElement("input")
      importInput.id = "importFile"
      importInput.type = "file"
      importInput.accept = ".json"
      importInput.style.display = "none"
      document.body.appendChild(importInput)
      importInput.addEventListener("change", handleImportProducts)
    }
  }

  const setupInventoryTracking = () => {
    // Add inventory column to products table
    const tableHeader = document.querySelector("#productsTableBody")?.parentElement?.querySelector("thead tr")
    if (tableHeader && !tableHeader.querySelector("th:contains('Stock')")) {
      const stockHeader = document.createElement("th")
      stockHeader.textContent = "Stock"
      tableHeader.appendChild(stockHeader)
    }
  }

  const setupBulkOperations = () => {
    // Add checkboxes to product rows for bulk operations
    const observer = new MutationObserver(() => {
      const rows = document.querySelectorAll("#productsTableBody tr")
      rows.forEach((row) => {
        if (!row.querySelector(".product-checkbox")) {
          const checkbox = document.createElement("input")
          checkbox.type = "checkbox"
          checkbox.className = "product-checkbox"
          const td = document.createElement("td")
          td.appendChild(checkbox)
          row.insertBefore(td, row.firstChild)
        }
      })
    })

    const tbody = document.getElementById("productsTableBody")
    if (tbody) {
      observer.observe(tbody, { childList: true })
    }
  }

  const updateInventorySummary = () => {
    let totalStock = 0
    let lowStockCount = 0
    let totalSold = 0

    Object.values(inventory).forEach((inv) => {
      totalStock += inv.stock || 0
      totalSold += inv.sold || 0
      if ((inv.stock || 0) < 10) {
        lowStockCount++
      }
    })

    document.getElementById("totalProductsCount").textContent = products.length
    document.getElementById("totalStockCount").textContent = totalStock
    document.getElementById("lowStockCount").textContent = lowStockCount
    document.getElementById("totalSoldCount").textContent = totalSold
  }

  const getSelectedProducts = () => {
    const checkboxes = document.querySelectorAll(".product-checkbox:checked")
    const selectedIds = Array.from(checkboxes).map((cb) => {
      const row = cb.closest("tr")
      return Number.parseInt(row.querySelector("td:nth-child(2)").textContent)
    })
    return selectedIds
  }

  const openBulkEditModal = () => {
    const selectedIds = getSelectedProducts()
    if (selectedIds.length === 0) {
      alert("Please select at least one product to edit")
      return
    }

    const modal = document.createElement("div")
    modal.className = "modal active"
    modal.id = "bulkEditModal"
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h2>Bulk Edit Products</h2>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Price Adjustment (%)</label>
            <input type="number" id="priceAdjustment" placeholder="e.g., 10 for +10%, -5 for -5%">
          </div>
          <div class="form-group">
            <label>Stock Adjustment</label>
            <input type="number" id="stockAdjustment" placeholder="e.g., 50 to add 50 units">
          </div>
          <div class="form-group">
            <label>Category</label>
            <input type="text" id="bulkCategory" placeholder="New category">
          </div>
          <div class="form-group">
            <label>Add Tag</label>
            <input type="text" id="bulkTag" placeholder="e.g., featured, sale">
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="document.getElementById('bulkEditModal').remove()">Cancel</button>
          <button class="btn btn-primary" onclick="ProductManager.applyBulkEdit()">Apply Changes</button>
        </div>
      </div>
    `

    document.body.appendChild(modal)
    modal.querySelector(".modal-close").addEventListener("click", () => modal.remove())

    // Store selected IDs for later use
    modal.dataset.selectedIds = JSON.stringify(selectedIds)
  }

  const applyBulkEdit = () => {
    const modal = document.getElementById("bulkEditModal")
    const selectedIds = JSON.parse(modal.dataset.selectedIds)

    const priceAdjustment = Number.parseFloat(document.getElementById("priceAdjustment").value) || 0
    const stockAdjustment = Number.parseInt(document.getElementById("stockAdjustment").value) || 0
    const newCategory = document.getElementById("bulkCategory").value
    const newTag = document.getElementById("bulkTag").value

    selectedIds.forEach((productId) => {
      const product = products.find((p) => p.id === productId)
      if (product) {
        if (priceAdjustment !== 0) {
          const adjustment = (product.price * priceAdjustment) / 100
          product.price = Math.max(0, product.price + adjustment)
        }
        if (newCategory) {
          product.category = newCategory
        }
        if (newTag) {
          product.tags = product.tags || []
          if (!product.tags.includes(newTag)) {
            product.tags.push(newTag)
          }
        }

        // Update inventory
        if (stockAdjustment !== 0) {
          inventory[productId].stock = Math.max(0, (inventory[productId].stock || 0) + stockAdjustment)
          inventory[productId].lastUpdated = new Date().toISOString()
        }

        recordProductHistory(productId, "bulk_edit", { priceAdjustment, stockAdjustment, newCategory })
      }
    })

    saveProducts()
    saveInventory()
    modal.remove()
    alert(`Successfully updated ${selectedIds.length} products!`)
    window.dispatchEvent(new CustomEvent("productsUpdated", { detail: { products } }))
  }

  const openBulkDeleteModal = () => {
    const selectedIds = getSelectedProducts()
    if (selectedIds.length === 0) {
      alert("Please select at least one product to delete")
      return
    }

    if (confirm(`Are you sure you want to delete ${selectedIds.length} products? This action cannot be undone.`)) {
      products = products.filter((p) => !selectedIds.includes(p.id))
      selectedIds.forEach((id) => {
        delete inventory[id]
        recordProductHistory(id, "deleted", {})
      })

      saveProducts()
      saveInventory()
      alert(`Successfully deleted ${selectedIds.length} products!`)
      window.dispatchEvent(new CustomEvent("productsUpdated", { detail: { products } }))
    }
  }

  const exportProducts = () => {
    const dataToExport = {
      products,
      inventory,
      exportDate: new Date().toISOString(),
      version: "1.0",
    }

    const dataStr = JSON.stringify(dataToExport, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `products-export-${new Date().getTime()}.json`
    link.click()
    URL.revokeObjectURL(url)

    console.log("[v0] Products exported successfully")
  }

  const handleImportProducts = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result)
        if (data.products && Array.isArray(data.products)) {
          products = data.products
          if (data.inventory) {
            inventory = data.inventory
          }
          saveProducts()
          saveInventory()
          alert("Products imported successfully!")
          window.dispatchEvent(new CustomEvent("productsUpdated", { detail: { products } }))
          console.log("[v0] Products imported:", products.length)
        }
      } catch (error) {
        alert("Error importing products: " + error.message)
        console.error("[v0] Import error:", error)
      }
    }
    reader.readAsText(file)
  }

  const recordProductHistory = (productId, action, details) => {
    productHistory.push({
      productId,
      action,
      details,
      timestamp: new Date().toISOString(),
    })

    // Keep only last 1000 records
    if (productHistory.length > 1000) {
      productHistory = productHistory.slice(-1000)
    }

    localStorage.setItem("productHistory", JSON.stringify(productHistory))
  }

  const updateProductStock = (productId, quantity, reason = "manual") => {
    if (inventory[productId]) {
      inventory[productId].stock = Math.max(0, (inventory[productId].stock || 0) + quantity)
      inventory[productId].lastUpdated = new Date().toISOString()
      saveInventory()
      recordProductHistory(productId, "stock_update", { quantity, reason })
      window.dispatchEvent(
        new CustomEvent("inventoryUpdated", {
          detail: { productId, stock: inventory[productId].stock },
        }),
      )
    }
  }

  const saveProducts = () => {
    localStorage.setItem("websiteProducts", JSON.stringify(products))
  }

  const saveInventory = () => {
    localStorage.setItem("productInventory", JSON.stringify(inventory))
  }

  const getProductStats = () => {
    return {
      totalProducts: products.length,
      totalStock: Object.values(inventory).reduce((sum, inv) => sum + (inv.stock || 0), 0),
      totalSold: Object.values(inventory).reduce((sum, inv) => sum + (inv.sold || 0), 0),
      lowStockItems: Object.entries(inventory).filter(([_, inv]) => (inv.stock || 0) < 10).length,
    }
  }

  return {
    init,
    closeProductModal,
    updateProductStock,
    getProductStats,
    exportProducts,
  }
})()

// Initialize when admin dashboard loads
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", ProductManager.init)
} else {
  ProductManager.init()
}
