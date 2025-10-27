window.DesignerCanvas = (() => {
  let canvas = null
  let ctx = null
  let elements = []
  let selectedElement = null
  let history = []
  let historyIndex = -1
  let isDragging = false
  let dragOffsetX = 0
  let dragOffsetY = 0

  const init = (canvasId) => {
    canvas = document.getElementById(canvasId)
    if (!canvas) {
      console.log("[v0] Canvas not found:", canvasId)
      return false
    }

    ctx = canvas.getContext("2d")
    setupCanvasEvents()
    saveState()
    console.log("[v0] DesignerCanvas initialized successfully")
    return true
  }

  const setupCanvasEvents = () => {
    canvas.addEventListener("mousedown", handleMouseDown)
    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("mouseup", handleMouseUp)
    canvas.addEventListener("contextmenu", handleContextMenu)
  }

  const handleMouseDown = (e) => {
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    for (let i = elements.length - 1; i >= 0; i--) {
      const el = elements[i]
      if (isPointInElement(x, y, el)) {
        selectedElement = el
        isDragging = true
        dragOffsetX = x - el.x
        dragOffsetY = y - el.y
        render()
        return
      }
    }

    selectedElement = null
    render()
  }

  const handleMouseMove = (e) => {
    if (!isDragging || !selectedElement) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    selectedElement.x = x - dragOffsetX
    selectedElement.y = y - dragOffsetY

    render()
  }

  const handleMouseUp = () => {
    if (isDragging) {
      isDragging = false
      saveState()
    }
  }

  const handleContextMenu = (e) => {
    e.preventDefault()

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    for (let i = elements.length - 1; i >= 0; i--) {
      const el = elements[i]
      if (isPointInElement(x, y, el)) {
        deleteElement(i)
        return
      }
    }
  }

  const isPointInElement = (x, y, el) => {
    if (el.type === "text") {
      const metrics = ctx.measureText(el.text)
      return x >= el.x && x <= el.x + metrics.width && y >= el.y - el.fontSize && y <= el.y + 5
    } else if (el.type === "shape") {
      return x >= el.x && x <= el.x + el.width && y >= el.y && y <= el.y + el.height
    } else if (el.type === "image") {
      return x >= el.x && x <= el.x + el.width && y >= el.y && y <= el.y + el.height
    }
    return false
  }

  const addText = (text = "Click to edit", x = 50, y = 50, fontSize = 24, color = "#000000", fontFamily = "Arial") => {
    const element = {
      type: "text",
      text,
      x,
      y,
      fontSize,
      color,
      fontFamily,
    }
    elements.push(element)
    selectedElement = element
    saveState()
    render()
    return element
  }

  const addShape = (shapeType = "rectangle", x = 50, y = 50, width = 100, height = 100, color = "#FF0000") => {
    const element = {
      type: "shape",
      shapeType,
      x,
      y,
      width,
      height,
      color,
    }
    elements.push(element)
    selectedElement = element
    saveState()
    render()
    return element
  }

  const addImage = (imageData, x = 50, y = 50, width = 150, height = 150) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      const element = {
        type: "image",
        image: img,
        x,
        y,
        width,
        height,
      }
      elements.push(element)
      selectedElement = element
      saveState()
      render()
    }
    img.src = imageData
  }

  const updateSelectedElement = (updates) => {
    if (!selectedElement) return
    Object.assign(selectedElement, updates)
    saveState()
    render()
  }

  const deleteElement = (index) => {
    elements.splice(index, 1)
    selectedElement = null
    saveState()
    render()
  }

  const deleteSelected = () => {
    if (!selectedElement) return
    const index = elements.indexOf(selectedElement)
    if (index > -1) {
      deleteElement(index)
    }
  }

  const clear = () => {
    elements = []
    selectedElement = null
    history = []
    historyIndex = -1
    saveState()
    render()
  }

  const render = () => {
    ctx.fillStyle = "#FFFFFF"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.strokeStyle = "#E0E0E0"
    ctx.lineWidth = 1
    for (let i = 0; i < canvas.width; i += 20) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, canvas.height)
      ctx.stroke()
    }
    for (let i = 0; i < canvas.height; i += 20) {
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(canvas.width, i)
      ctx.stroke()
    }

    elements.forEach((el) => {
      if (el.type === "text") {
        ctx.font = `${el.fontSize}px ${el.fontFamily}`
        ctx.fillStyle = el.color
        ctx.fillText(el.text, el.x, el.y)

        if (selectedElement === el) {
          const metrics = ctx.measureText(el.text)
          ctx.strokeStyle = "#0074D9"
          ctx.lineWidth = 2
          ctx.strokeRect(el.x - 2, el.y - el.fontSize - 2, metrics.width + 4, el.fontSize + 4)
        }
      } else if (el.type === "shape") {
        ctx.fillStyle = el.color
        if (el.shapeType === "rectangle") {
          ctx.fillRect(el.x, el.y, el.width, el.height)
        } else if (el.shapeType === "circle") {
          ctx.beginPath()
          ctx.arc(el.x + el.width / 2, el.y + el.height / 2, el.width / 2, 0, Math.PI * 2)
          ctx.fill()
        }

        if (selectedElement === el) {
          ctx.strokeStyle = "#0074D9"
          ctx.lineWidth = 2
          ctx.strokeRect(el.x - 2, el.y - 2, el.width + 4, el.height + 4)
        }
      } else if (el.type === "image") {
        ctx.drawImage(el.image, el.x, el.y, el.width, el.height)

        if (selectedElement === el) {
          ctx.strokeStyle = "#0074D9"
          ctx.lineWidth = 2
          ctx.strokeRect(el.x - 2, el.y - 2, el.width + 4, el.height + 4)
        }
      }
    })
  }

  const saveState = () => {
    historyIndex++
    history = history.slice(0, historyIndex)
    history.push(JSON.stringify(elements))
  }

  const undo = () => {
    if (historyIndex > 0) {
      historyIndex--
      elements = JSON.parse(history[historyIndex])
      selectedElement = null
      render()
    }
  }

  const redo = () => {
    if (historyIndex < history.length - 1) {
      historyIndex++
      elements = JSON.parse(history[historyIndex])
      selectedElement = null
      render()
    }
  }

  const getCanvasData = () => {
    return canvas.toDataURL("image/png")
  }

  const getElements = () => {
    return elements
  }

  const setElements = (newElements) => {
    elements = newElements
    selectedElement = null
    render()
  }

  const getCanvas = () => {
    return canvas
  }

  return {
    init,
    addText,
    addShape,
    addImage,
    updateSelectedElement,
    deleteSelected,
    clear,
    render,
    undo,
    redo,
    getCanvasData,
    getElements,
    setElements,
    getCanvas,
  }
})()

console.log("[v0] DesignerCanvas exposed to window")
