// Enhanced Product Manager with Multi-Image Support and Full CRUD
const ProductManagerEnhanced = (() => {
  let products = []
  let inventory = {}
  let productHistory = []
  let currentEditingProductId = null

  const init = () => {
    console.log("[v0] Initializing Enhanced Product Manager...")
    loadProductData()
    setupProductManagementUI()
    setupInventoryTracking()
    setupBulkOperations()
    setupEventListeners()
  }

  const loadProductData = () => {
    const savedProducts = localStorage.getItem("websiteProducts")
    products = savedProducts ? JSON.parse(savedProducts) : []

    const savedInventory = localStorage.getItem("productInventory")
    inventory = savedInventory ? JSON.parse(savedInventory) : {}

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

    saveProducts()
    saveInventory()
    console.log("[v0] Product data loaded:", { products: products.length, inventory: Object.keys(inventory).length })
  }

  const setupProductManagementUI = () => {
    const productsSection = document.getElementById("products")
    if (!productsSection) return

    const formHTML = `
      <div class="product-form-container">
        <h3><i class="fas fa-plus-circle"></i> Add/Edit Product</h3>
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
                <option value="apparel">Apparel</option>
                <option value="drinkware">Drinkware</option>
                <option value="accessories">Accessories</option>
                <option value="bags">Bags</option>
                <option value="tech">Tech</option>
                <option value="stickers">Stickers</option>
                <option value="home">Home</option>
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

          <!-- Multi-image support for product variants -->
          <div class="form-group">
            <label>Product Images (Multiple Images for Variants) *</label>
            <div id="imageUploadArea" class="image-upload-area">
              <input type="text" id="imageUrlInput" placeholder="Paste image URL and click Add Image" style="width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 4px;">
              <button type="button" id="addImageBtn" class="btn btn-secondary">
                <i class="fas fa-link"></i> Add Image URL
              </button>
              <p style="font-size: 12px; color: #666; margin-top: 8px;">Paste image URLs from Imgur, Cloudinary, or any image hosting service. Maximum 10 images.</p>
            </div>
            <div id="imagePreviewContainer" class="image-preview-container"></div>
          </div>

          <!-- Variant management section -->
          <div class="form-group">
            <label>Product Variants</label>
            <div id="variantsContainer" class="variants-container">
              <p style="color: #999; font-size: 12px;">Variants will be created based on sizes and colors</p>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" id="cancelProductBtn" class="btn btn-secondary">Cancel</button>
            <button type="submit" class="btn btn-primary">Save Product</button>
          </div>
        </form>
      </div>

      <!-- Products table with full management controls -->
      <div class="products-management-section">
        <div class="section-header">
          <h3><i class="fas fa-list"></i> Products List</h3>
          <div class="management-controls">
            <button id="bulkEditBtn" class="btn btn-secondary"><i class="fas fa-edit"></i> Bulk Edit</button>
            <button id="bulkDeleteBtn" class="btn btn-danger"><i class="fas fa-trash"></i> Bulk Delete</button>
            <button id="exportProductsBtn" class="btn btn-secondary"><i class="fas fa-download"></i> Export</button>
            <button id="importProductsBtn" class="btn btn-secondary"><i class="fas fa-upload"></i> Import</button>
          </div>
        </div>

        <div class="products-table-wrapper">
          <table class="products-table">
            <thead>
              <tr>
                <th><input type="checkbox" id="selectAllCheckbox"></th>
                <th>ID</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Images</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="productsTableBody">
              <!-- Products will be loaded here -->
            </tbody>
          </table>
        </div>
      </div>
    `

    const existingForm = productsSection.querySelector(".product-form-container")
    if (existingForm) {
      existingForm.remove()
    }

    const formContainer = document.createElement("div")
    formContainer.innerHTML = formHTML
    productsSection.appendChild(formContainer.firstElementChild)

    setupProductFormListeners()
    renderProductsTable()
  }

  const setupProductFormListeners = () => {
    const form = document.getElementById("productForm")
    if (!form) return

    document.getElementById("addImageBtn")?.addEventListener("click", (e) => {
      e.preventDefault()
      const urlInput = document.getElementById("imageUrlInput")
      const imageUrl = urlInput.value.trim()

      if (!imageUrl) {
        alert("Please enter an image URL")
        return
      }

      // Validate URL format
      try {
        new URL(imageUrl)
      } catch {
        alert("Please enter a valid image URL")
        return
      }

      const container = document.getElementById("imagePreviewContainer")
      const currentImages = JSON.parse(form.dataset.uploadedImages || "[]")

      if (currentImages.length >= 10) {
        alert("Maximum 10 images allowed")
        return
      }

      currentImages.push(imageUrl)
      form.dataset.uploadedImages = JSON.stringify(currentImages)

      // Add preview
      const preview = document.createElement("div")
      preview.className = "image-preview-item"
      const index = currentImages.length - 1
      preview.innerHTML = `
        <img src="${imageUrl}" alt="Preview ${index + 1}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Crect fill=%22%23e0e0e0%22 width=%22200%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23999%22 font-size=%2214%22%3EImage Error%3C/text%3E%3C/svg%3E'">
        <div class="image-info">
          <span class="image-number">${index + 1}</span>
        </div>
        <button type="button" class="remove-image-btn" data-index="${index}">
          <i class="fas fa-trash"></i>
        </button>
      `
      container.appendChild(preview)

      preview.querySelector(".remove-image-btn").addEventListener("click", (e) => {
        e.preventDefault()
        currentImages.splice(index, 1)
        form.dataset.uploadedImages = JSON.stringify(currentImages)
        preview.remove()
      })

      urlInput.value = ""
    })

    // Allow Enter key to add image
    document.getElementById("imageUrlInput")?.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault()
        document.getElementById("addImageBtn").click()
      }
    })

    document.getElementById("cancelProductBtn")?.addEventListener("click", (e) => {
      e.preventDefault()
      resetProductForm()
    })

    form.addEventListener("submit", (e) => {
      e.preventDefault()
      saveProduct()
    })

    document.getElementById("selectAllCheckbox")?.addEventListener("change", (e) => {
      document.querySelectorAll(".product-checkbox").forEach((cb) => {
        cb.checked = e.target.checked
      })
    })

    document.getElementById("bulkEditBtn")?.addEventListener("click", openBulkEditModal)
    document.getElementById("bulkDeleteBtn")?.addEventListener("click", openBulkDeleteModal)
    document.getElementById("exportProductsBtn")?.addEventListener("click", exportProducts)
    document.getElementById("importProductsBtn")?.addEventListener("click", () => {
      document.getElementById("importFile").click()
    })

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

  const setupEventListeners = () => {
    // Listen for product updates from landing page
    window.addEventListener("productsUpdated", (e) => {
      if (e.detail && e.detail.products) {
        products = e.detail.products
        renderProductsTable()
      }
    })
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    const container = document.getElementById("imagePreviewContainer")

    if (files.length > 10) {
      alert("Maximum 10 images allowed")
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
          <div class="image-info">
            <span class="image-number">${index + 1}</span>
          </div>
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

    document.getElementById("productForm").dataset.uploadedImages = JSON.stringify(uploadedImages)
  }

  const saveProduct = () => {
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

    const colors = document
      .getElementById("productColors")
      .value.split(",")
      .map((c) => c.trim())
      .filter(Boolean)

    const originalPrice = Number.parseFloat(document.getElementById("productOriginalPrice").value) || null
    const sku = document.getElementById("productSKU").value

    const imagesData = JSON.parse(form.dataset.uploadedImages || "[]")

    if (!name || !price || !description || imagesData.length === 0) {
      alert("Please fill in all required fields and add at least one image URL")
      return
    }

    const productData = {
      id: currentEditingProductId || Date.now(),
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
      createdAt: currentEditingProductId ? undefined : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    if (currentEditingProductId) {
      const index = products.findIndex((p) => p.id === currentEditingProductId)
      if (index !== -1) {
        products[index] = { ...products[index], ...productData }
        recordProductHistory(currentEditingProductId, "updated", productData)
        alert("Product updated successfully!")
        console.log("[v0] Product updated:", productData)
      }
    } else {
      products.push(productData)
      inventory[productData.id] = {
        stock,
        reserved: 0,
        sold: 0,
        lastUpdated: new Date().toISOString(),
      }
      recordProductHistory(productData.id, "created", productData)
      alert("Product added successfully!")
      console.log("[v0] New product added:", productData)
    }

    saveProducts()
    saveInventory()
    resetProductForm()
    renderProductsTable()
    window.dispatchEvent(new CustomEvent("productsUpdated", { detail: { products } }))
  }

  const resetProductForm = () => {
    const form = document.getElementById("productForm")
    if (form) {
      form.reset()
      document.getElementById("imagePreviewContainer").innerHTML = ""
      document.getElementById("imageUrlInput").value = ""
      form.dataset.uploadedImages = "[]"
      currentEditingProductId = null
      document.querySelector(".product-form-container h3").textContent = "Add/Edit Product"
    }
  }

  const renderProductsTable = () => {
    const tbody = document.getElementById("productsTableBody")
    if (!tbody) return

    tbody.innerHTML = ""

    products.forEach((product) => {
      const row = document.createElement("tr")
      row.innerHTML = `
        <td><input type="checkbox" class="product-checkbox" data-product-id="${product.id}"></td>
        <td>${product.id}</td>
        <td>${product.name}</td>
        <td>${product.category || "N/A"}</td>
        <td>${product.price} MAD</td>
        <td>${inventory[product.id]?.stock || 0}</td>
        <td><span class="badge">${product.images?.length || 0} images</span></td>
        <td>
          <button class="btn-action btn-edit" onclick="ProductManagerEnhanced.editProduct(${product.id})" title="Edit">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn-action btn-delete" onclick="ProductManagerEnhanced.deleteProduct(${product.id})" title="Delete">
            <i class="fas fa-trash"></i>
          </button>
          <button class="btn-action btn-view" onclick="ProductManagerEnhanced.viewProduct(${product.id})" title="View">
            <i class="fas fa-eye"></i>
          </button>
        </td>
      `
      tbody.appendChild(row)
    })

    if (products.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="8" style="text-align: center; padding: 2rem;">No products yet. Add your first product!</td></tr>'
    }
  }

  const editProduct = (productId) => {
    const product = products.find((p) => p.id === productId)
    if (!product) return

    currentEditingProductId = productId
    document.querySelector(".product-form-container h3").textContent = "Edit Product"
    document.getElementById("productName").value = product.name
    document.getElementById("productCategory").value = product.category
    document.getElementById("productPrice").value = product.price
    document.getElementById("productOriginalPrice").value = product.originalPrice || ""
    document.getElementById("productDescription").value = product.description
    document.getElementById("productFullDescription").value = product.fullDescription || ""
    document.getElementById("productAdditionalInfo").value = product.additionalInfo || ""
    document.getElementById("productSizes").value = product.sizes ? product.sizes.join(", ") : ""
    document.getElementById("productColors").value = product.colors ? product.colors.join(", ") : ""
    document.getElementById("productSKU").value = product.sku || ""
    document.getElementById("productStock").value = inventory[productId]?.stock || 100

    const container = document.getElementById("imagePreviewContainer")
    container.innerHTML = ""
    if (product.images && product.images.length > 0) {
      product.images.forEach((img, index) => {
        const preview = document.createElement("div")
        preview.className = "image-preview-item"
        preview.innerHTML = `
          <img src="${img}" alt="Product image ${index + 1}">
          <div class="image-info">
            <span class="image-number">${index + 1}</span>
          </div>
          <button type="button" class="remove-image-btn" data-index="${index}">
            <i class="fas fa-trash"></i>
          </button>
        `
        container.appendChild(preview)
      })
      document.getElementById("productForm").dataset.uploadedImages = JSON.stringify(product.images)
    }

    // Scroll to form
    document.querySelector(".product-form-container").scrollIntoView({ behavior: "smooth" })
  }

  const deleteProduct = (productId) => {
    if (confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      products = products.filter((p) => p.id !== productId)
      delete inventory[productId]
      recordProductHistory(productId, "deleted", {})
      saveProducts()
      saveInventory()
      renderProductsTable()
      window.dispatchEvent(new CustomEvent("productsUpdated", { detail: { products } }))
      alert("Product deleted successfully!")
      console.log("[v0] Product deleted:", productId)
    }
  }

  const viewProduct = (productId) => {
    const product = products.find((p) => p.id === productId)
    if (!product) return

    const details = `
Product Details:
Name: ${product.name}
Category: ${product.category}
Price: ${product.price} MAD
Original Price: ${product.originalPrice || "N/A"} MAD
Description: ${product.description}
Full Description: ${product.fullDescription || "N/A"}
Sizes: ${product.sizes?.join(", ") || "N/A"}
Colors: ${product.colors?.join(", ") || "N/A"}
Images: ${product.images?.length || 0}
Stock: ${inventory[productId]?.stock || 0}
SKU: ${product.sku}
Created: ${product.createdAt || "N/A"}
Updated: ${product.updatedAt || "N/A"}
    `
    alert(details)
  }

  const getSelectedProducts = () => {
    const checkboxes = document.querySelectorAll(".product-checkbox:checked")
    return Array.from(checkboxes).map((cb) => Number.parseInt(cb.dataset.productId))
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
          <h2>Bulk Edit Products (${selectedIds.length} selected)</h2>
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
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="document.getElementById('bulkEditModal').remove()">Cancel</button>
          <button class="btn btn-primary" onclick="ProductManagerEnhanced.applyBulkEdit()">Apply Changes</button>
        </div>
      </div>
    `

    document.body.appendChild(modal)
    modal.querySelector(".modal-close").addEventListener("click", () => modal.remove())
    modal.dataset.selectedIds = JSON.stringify(selectedIds)
  }

  const applyBulkEdit = () => {
    const modal = document.getElementById("bulkEditModal")
    const selectedIds = JSON.parse(modal.dataset.selectedIds)

    const priceAdjustment = Number.parseFloat(document.getElementById("priceAdjustment").value) || 0
    const stockAdjustment = Number.parseInt(document.getElementById("stockAdjustment").value) || 0
    const newCategory = document.getElementById("bulkCategory").value

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
    renderProductsTable()
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
      renderProductsTable()
      window.dispatchEvent(new CustomEvent("productsUpdated", { detail: { products } }))
    }
  }

  const exportProducts = () => {
    const dataToExport = {
      products,
      inventory,
      exportDate: new Date().toISOString(),
      version: "2.0",
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
          renderProductsTable()
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

    if (productHistory.length > 1000) {
      productHistory = productHistory.slice(-1000)
    }

    localStorage.setItem("productHistory", JSON.stringify(productHistory))
  }

  const saveProducts = () => {
    localStorage.setItem("websiteProducts", JSON.stringify(products))
  }

  const saveInventory = () => {
    localStorage.setItem("productInventory", JSON.stringify(inventory))
  }

  const setupInventoryTracking = () => {
    // Inventory tracking setup
  }

  const setupBulkOperations = () => {
    // Bulk operations setup
  }

  return {
    init,
    editProduct,
    deleteProduct,
    viewProduct,
    applyBulkEdit,
  }
})()

// Initialize when admin dashboard loads
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", ProductManagerEnhanced.init)
} else {
  ProductManagerEnhanced.init()
}
