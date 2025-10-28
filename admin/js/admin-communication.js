const AdminCommunication = (() => {
  let isWebsiteConnected = false
  const sentMessages = []
  let initialized = false

  const init = () => {
    if (initialized) {
      console.log("[v0] Admin Communication already initialized")
      return
    }
    initialized = true

    console.log("[v0] Initializing Admin Communication System...")
    setupCommunicationUI()
    setupMessageSending()
    setupNotificationSystem()

    setTimeout(() => {
      broadcastAdminReady()
      checkWebsiteConnection()
      initializeTabDisplay()
    }, 100)
  }

  const setupCommunicationUI = () => {
    // Create communication panel in admin dashboard
    const dashboardContent = document.querySelector(".admin-main") || document.body

    if (document.getElementById("adminCommPanel")) {
      console.log("[v0] Communication panel already exists")
      return
    }

    const commPanel = document.createElement("div")
    commPanel.id = "adminCommPanel"
    commPanel.className = "admin-comm-panel"
    commPanel.innerHTML = `
      <div class="comm-panel-header">
        <h3><i class="fas fa-comments"></i> Website Communication</h3>
        <button id="toggleCommPanel" class="toggle-btn" title="Toggle panel" type="button">
          <i class="fas fa-chevron-down"></i>
        </button>
      </div>
      <div class="comm-panel-content">
        <div class="connection-status">
          <span id="connectionStatus" class="status-indicator disconnected"></span>
          <span id="connectionText">Connecting to website...</span>
        </div>

        <div class="comm-tabs">
          <button class="comm-tab-btn active" data-tab="messages" type="button">Messages</button>
          <button class="comm-tab-btn" data-tab="notifications" type="button">Notifications</button>
          <button class="comm-tab-btn" data-tab="announcements" type="button">Announcements</button>
        </div>

        <!-- Messages Tab -->
        <div class="comm-tab-content active" data-tab="messages">
          <div class="message-form">
            <textarea id="messageInput" placeholder="Type a message to send to the website..." rows="3"></textarea>
            <button id="sendMessageBtn" class="btn btn-primary" type="button">
              <i class="fas fa-paper-plane"></i> Send Message
            </button>
          </div>
          <div id="messagesList" class="messages-list"></div>
        </div>

        <!-- Notifications Tab -->
        <div class="comm-tab-content" data-tab="notifications">
          <div class="notification-form">
            <div class="form-group">
              <label>Notification Type</label>
              <select id="notificationType">
                <option value="info">Info</option>
                <option value="success">Success</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
              </select>
            </div>
            <div class="form-group">
              <label>Title</label>
              <input type="text" id="notificationTitle" placeholder="Notification title">
            </div>
            <div class="form-group">
              <label>Message</label>
              <textarea id="notificationMessage" placeholder="Notification message" rows="3"></textarea>
            </div>
            <div class="form-group">
              <label>Duration (ms)</label>
              <input type="number" id="notificationDuration" placeholder="5000" value="5000">
            </div>
            <button id="sendNotificationBtn" class="btn btn-primary" type="button">
              <i class="fas fa-bell"></i> Send Notification
            </button>
          </div>
        </div>

        <!-- Announcements Tab -->
        <div class="comm-tab-content" data-tab="announcements">
          <div class="announcement-form">
            <div class="form-group">
              <label>Announcement Message</label>
              <textarea id="announcementMessage" placeholder="Important announcement for your website visitors..." rows="3"></textarea>
            </div>
            <div class="form-group">
              <label>Background Color</label>
              <input type="color" id="announcementColor" value="#6a79fa">
            </div>
            <div class="form-group">
              <label>
                <input type="checkbox" id="announcementCloseable" checked>
                Allow visitors to close
              </label>
            </div>
            <button id="sendAnnouncementBtn" class="btn btn-primary" type="button">
              <i class="fas fa-megaphone"></i> Broadcast Announcement
            </button>
          </div>
        </div>
      </div>
    `

    dashboardContent.appendChild(commPanel)
    setupCommPanelListeners()
  }

  const initializeTabDisplay = () => {
    const tabContents = document.querySelectorAll(".comm-tab-content")
    tabContents.forEach((content, index) => {
      if (index === 0) {
        content.classList.add("active")
      } else {
        content.classList.remove("active")
      }
    })
    console.log("[v0] Tab display initialized")
  }

  const setupCommPanelListeners = () => {
    document.querySelectorAll(".comm-tab-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault()
        e.stopPropagation()

        const tabName = btn.getAttribute("data-tab")
        console.log("[v0] Switching to tab:", tabName)

        // Remove active class from all buttons and contents
        document.querySelectorAll(".comm-tab-btn").forEach((b) => {
          b.classList.remove("active")
        })
        document.querySelectorAll(".comm-tab-content").forEach((c) => {
          c.classList.remove("active")
        })

        // Add active class to clicked button and corresponding content
        btn.classList.add("active")
        const targetContent = document.querySelector(`.comm-tab-content[data-tab="${tabName}"]`)
        if (targetContent) {
          targetContent.classList.add("active")
          console.log("[v0] Tab content displayed:", tabName)
        }
      })
    })

    const toggleBtn = document.getElementById("toggleCommPanel")
    if (toggleBtn) {
      toggleBtn.addEventListener("click", (e) => {
        e.preventDefault()
        e.stopPropagation()
        const content = document.querySelector(".comm-panel-content")
        const icon = toggleBtn.querySelector("i")

        if (content.classList.contains("collapsed")) {
          content.classList.remove("collapsed")
          icon.classList.remove("fa-chevron-up")
          icon.classList.add("fa-chevron-down")
          console.log("[v0] Communication panel expanded")
        } else {
          content.classList.add("collapsed")
          icon.classList.remove("fa-chevron-down")
          icon.classList.add("fa-chevron-up")
          console.log("[v0] Communication panel collapsed")
        }
      })
    }

    // Send message
    document.getElementById("sendMessageBtn")?.addEventListener("click", sendMessage)

    // Send notification
    document.getElementById("sendNotificationBtn")?.addEventListener("click", sendNotification)

    // Send announcement
    document.getElementById("sendAnnouncementBtn")?.addEventListener("click", sendAnnouncement)
  }

  const setupMessageSending = () => {
    // Listen for website connection
    window.addEventListener("bridgeConnectionStatus", (e) => {
      console.log("[v0] Bridge connection status received:", e.detail.connected)
      isWebsiteConnected = e.detail.connected
      updateConnectionStatus()
    })

    // Listen for website ready signal
    window.addEventListener("websiteReady", () => {
      console.log("[v0] Website ready signal received")
      isWebsiteConnected = true
      updateConnectionStatus()
    })
  }

  const setupNotificationSystem = () => {
    // Listen for website notifications
    window.addEventListener("websiteNotification", (e) => {
      console.log("[v0] Received website notification:", e.detail)
    })
  }

  const checkWebsiteConnection = () => {
    if (window.CommunicationBridge && typeof window.CommunicationBridge.isConnected === "function") {
      isWebsiteConnected = true
      console.log("[v0] Website communication bridge detected")
      updateConnectionStatus()
    } else {
      // Retry after 2 seconds
      setTimeout(checkWebsiteConnection, 2000)
    }
  }

  const sendMessage = () => {
    const input = document.getElementById("messageInput")
    const message = input.value.trim()

    if (!message) {
      alert("Please enter a message")
      return
    }

    const messageObj = {
      type: "message",
      content: message,
      timestamp: new Date().toISOString(),
      id: Math.random().toString(36).substr(2, 9),
    }

    sentMessages.push(messageObj)
    window.dispatchEvent(
      new CustomEvent("adminMessage", {
        detail: messageObj,
      }),
    )

    input.value = ""
    displaySentMessage(messageObj)
    console.log("[v0] Message sent to website:", message)
  }

  const sendNotification = () => {
    const type = document.getElementById("notificationType").value
    const title = document.getElementById("notificationTitle").value
    const message = document.getElementById("notificationMessage").value
    const duration = Number.parseInt(document.getElementById("notificationDuration").value)

    if (!title || !message) {
      alert("Please fill in all fields")
      return
    }

    const notification = {
      type,
      title,
      message,
      duration,
    }

    window.dispatchEvent(
      new CustomEvent("showNotification", {
        detail: notification,
      }),
    )

    window.dispatchEvent(
      new CustomEvent("adminNotification", {
        detail: notification,
      }),
    )

    // Reset form
    document.getElementById("notificationTitle").value = ""
    document.getElementById("notificationMessage").value = ""

    console.log("[v0] Notification sent to website:", notification)
    alert("Notification sent successfully!")
  }

  const sendAnnouncement = () => {
    const message = document.getElementById("announcementMessage").value
    const backgroundColor = document.getElementById("announcementColor").value
    const closeable = document.getElementById("announcementCloseable").checked

    if (!message) {
      alert("Please enter an announcement message")
      return
    }

    const announcement = {
      message,
      backgroundColor,
      closeable,
    }

    window.dispatchEvent(
      new CustomEvent("showAnnouncement", {
        detail: announcement,
      }),
    )

    window.dispatchEvent(
      new CustomEvent("adminAnnouncement", {
        detail: announcement,
      }),
    )

    // Reset form
    document.getElementById("announcementMessage").value = ""

    console.log("[v0] Announcement sent to website:", announcement)
    alert("Announcement broadcasted successfully!")
  }

  const displaySentMessage = (messageObj) => {
    const list = document.getElementById("messagesList")
    if (!list) return

    const messageEl = document.createElement("div")
    messageEl.className = "message-item sent"
    messageEl.innerHTML = `
      <div class="message-time">${new Date(messageObj.timestamp).toLocaleTimeString()}</div>
      <div class="message-content">${messageObj.content}</div>
    `

    list.appendChild(messageEl)
    list.scrollTop = list.scrollHeight
  }

  const updateConnectionStatus = () => {
    const statusEl = document.getElementById("connectionStatus")
    const textEl = document.getElementById("connectionText")

    if (isWebsiteConnected) {
      statusEl.classList.remove("disconnected")
      statusEl.classList.add("connected")
      textEl.textContent = "Connected to website"
      console.log("[v0] ✅ Website Communication: CONNECTED")
    } else {
      statusEl.classList.remove("connected")
      statusEl.classList.add("disconnected")
      textEl.textContent = "Disconnected from website"
      console.log("[v0] ❌ Website Communication: DISCONNECTED")
    }
  }

  const broadcastAdminReady = () => {
    window.dispatchEvent(new CustomEvent("adminDashboardReady"))
    console.log("[v0] Admin dashboard ready for communication")
  }

  return {
    init,
    sendMessage,
    sendNotification,
    sendAnnouncement,
  }
})()

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    () => {
      AdminCommunication.init()
    },
    { once: true },
  )
} else {
  AdminCommunication.init()
}
