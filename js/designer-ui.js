window.DesignerUI = (() => {
  let currentProduct = null
  let designerModal = null

  const openDesigner = (product) => {
    console.log("[v0] Opening designer for product:", product.name)
    currentProduct = product
    designerModal = document.getElementById("designerModal")

    if (!designerModal) {
      console.error("[v0] Designer modal not found in DOM")
      return
    }

    // Initialize canvas
    if (!window.DesignerCanvas) {
      console.error("[v0] DesignerCanvas not available")
      return
    }

    if (!window.DesignerCanvas.init("designCanvas")) {
      console.error("[v0] Failed to initialize canvas")
      return
    }

    // Update product preview
    const previewProduct = document.getElementById("previewProduct")
    if (previewProduct && product.images && product.images.length > 0) {
      previewProduct.src = product.images[0]
    }

    // Show modal
    designerModal.classList.add("active")
    const modalOverlay = document.getElementById("modalOverlay")
    if (modalOverlay) {
      modalOverlay.classList.add("active")
    }
    document.body.style.overflow = "hidden"

    setupDesignerEvents()
    console.log("[v0] Designer opened successfully")
  }

  const closeDesigner = () => {
    if (designerModal) {
      designerModal.classList.remove("active")
      const modalOverlay = document.getElementById("modalOverlay")
      if (modalOverlay) {
        modalOverlay.classList.remove("active")
      }
      document.body.style.overflow = "auto"
    }
    currentProduct = null
  }

  const setupDesignerEvents = () => {
    // Add Text
    const addTextBtn = document.getElementById("addTextBtn")
    if (addTextBtn) {
      addTextBtn.onclick = () => {
        const text = prompt("Enter text:") || "Sample Text"
        window.DesignerCanvas.addText(text)
      }
    }

    // Add Shape
    const addShapeBtn = document.getElementById("addShapeBtn")
    if (addShapeBtn) {
      addShapeBtn.onclick = () => {
        window.DesignerCanvas.addShape("rectangle")
      }
    }

    // Add Image
    const addImageBtn = document.getElementById("addImageBtn")
    if (addImageBtn) {
      addImageBtn.onclick = () => {
        const input = document.createElement("input")
        input.type = "file"
        input.accept = "image/*"
        input.onchange = (e) => {
          const file = e.target.files[0]
          if (file) {
            const reader = new FileReader()
            reader.onload = (event) => {
              window.DesignerCanvas.addImage(event.target.result)
            }
            reader.readAsDataURL(file)
          }
        }
        input.click()
      }
    }

    // Undo
    const undoBtn = document.getElementById("undoBtn")
    if (undoBtn) {
      undoBtn.onclick = () => {
        window.DesignerCanvas.undo()
      }
    }

    // Redo
    const redoBtn = document.getElementById("redoBtn")
    if (redoBtn) {
      redoBtn.onclick = () => {
        window.DesignerCanvas.redo()
      }
    }

    // Clear
    const clearBtn = document.getElementById("clearBtn")
    if (clearBtn) {
      clearBtn.onclick = () => {
        if (confirm("Clear all designs?")) {
          window.DesignerCanvas.clear()
        }
      }
    }

    // Download
    const downloadDesignBtn = document.getElementById("downloadDesignBtn")
    if (downloadDesignBtn) {
      downloadDesignBtn.onclick = () => {
        const canvas = window.DesignerCanvas.getCanvas()
        const link = document.createElement("a")
        link.href = canvas.toDataURL("image/png")
        link.download = `design-${Date.now()}.png`
        link.click()
      }
    }

    // Add to Cart
    const addToCartDesignBtn = document.getElementById("addToCartDesignBtn")
    if (addToCartDesignBtn) {
      addToCartDesignBtn.onclick = () => {
        if (currentProduct) {
          const canvas = window.DesignerCanvas.getCanvas()
          const designImage = canvas.toDataURL("image/png")

          const cartItem = {
            id: currentProduct.id,
            name: currentProduct.name,
            size: "M",
            color: "Default",
            quantity: 1,
            price: currentProduct.price,
            image: designImage,
            isCustomDesign: true,
          }

          if (window.App && window.App.cart) {
            window.App.cart.push(cartItem)
            window.App.saveCart()
            window.App.updateCartUI()
          }

          closeDesigner()
          alert("✅ Design added to cart!")
        }
      }
    }

    // Close button
    const closeBtn = designerModal.querySelector(".modal-close")
    if (closeBtn) {
      closeBtn.onclick = closeDesigner
    }
  }

  return {
    openDesigner,
    closeDesigner,
  }
})()

console.log("[v0] DesignerUI initialized and ready")
