const SettingsManager = (() => {
  let currentSettings = {}
  let settingsHistory = []

  const init = () => {
    console.log("[v0] Initializing Settings Manager...")
    loadSettings()
    setupSettingsUI()
    setupSettingsSync()
    setupSettingsValidation()
  }

  const loadSettings = () => {
    const saved = localStorage.getItem("websiteSettings")
    currentSettings = saved ? JSON.parse(saved) : getDefaultSettings()
    console.log("[v0] Settings loaded:", currentSettings)
  }

  const getDefaultSettings = () => {
    return {
      store: {
        name: "NEXA Print",
        description: "Premium print-on-demand solutions",
        phone: "+212 723 242 286",
        email: "info@nexaprint.com",
        address: "Casablanca, Morocco",
        country: "Morocco",
        timezone: "Africa/Casablanca",
        currency: "MAD",
      },
      theme: {
        primaryColor: "#6a79fa",
        secondaryColor: "#1a1a1a",
        accentColor: "#27ae60",
        backgroundColor: "#f5f5f5",
        fontFamily: "Arial, sans-serif",
        borderRadius: "8px",
      },
      seo: {
        title: "NEXA Print - Premium Print-on-Demand",
        description: "Create custom merchandise with NEXA Print",
        keywords: "print on demand, custom apparel, merchandise",
        ogImage: "/placeholder.svg",
        twitterHandle: "@nexa1337",
      },
      social: {
        facebook: "https://facebook.com/nexa1337",
        instagram: "https://instagram.com/nexa1337",
        twitter: "https://twitter.com/nexa1337",
        linkedin: "https://linkedin.com/company/nexa1337",
        whatsapp: "+212723242286",
        tiktok: "https://tiktok.com/@nexa.1337",
      },
      email: {
        provider: "smtp",
        smtpHost: "smtp.gmail.com",
        smtpPort: 587,
        smtpUser: "",
        smtpPassword: "",
        fromEmail: "noreply@nexaprint.com",
        fromName: "NEXA Print",
      },
      notifications: {
        orderConfirmation: true,
        orderShipped: true,
        orderDelivered: true,
        newslatter: true,
        promotions: true,
      },
      shipping: {
        freeShippingThreshold: 500,
        defaultShippingCost: 50,
        estimatedDeliveryDays: "5-10",
        countries: ["Morocco", "USA", "EU"],
      },
      payment: {
        methods: ["credit_card", "paypal", "stripe", "bank_transfer"],
        currency: "MAD",
        taxRate: 0.2,
      },
      security: {
        enableSSL: true,
        enableTwoFactor: false,
        sessionTimeout: 3600,
        passwordMinLength: 8,
      },
      analytics: {
        googleAnalyticsId: "",
        facebookPixelId: "",
        enableTracking: true,
      },
      maintenance: {
        maintenanceMode: false,
        maintenanceMessage: "We're currently under maintenance. Please check back soon!",
      },
    }
  }

  const setupSettingsUI = () => {
    // Create advanced settings tabs if they don't exist
    const settingsSection = document.getElementById("settings")
    if (!settingsSection) return

    const advancedTabs = document.createElement("div")
    advancedTabs.className = "settings-advanced-tabs"
    advancedTabs.innerHTML = `
      <div class="tabs-navigation">
        <button class="tab-nav-btn active" data-tab="general">General</button>
        <button class="tab-nav-btn" data-tab="theme">Theme</button>
        <button class="tab-nav-btn" data-tab="seo">SEO</button>
        <button class="tab-nav-btn" data-tab="social">Social Media</button>
        <button class="tab-nav-btn" data-tab="email">Email</button>
        <button class="tab-nav-btn" data-tab="shipping">Shipping</button>
        <button class="tab-nav-btn" data-tab="payment">Payment</button>
        <button class="tab-nav-btn" data-tab="security">Security</button>
        <button class="tab-nav-btn" data-tab="analytics">Analytics</button>
      </div>

      <div class="tabs-content">
        <!-- General Settings -->
        <div class="tab-panel active" data-tab="general">
          <h3>General Settings</h3>
          <form id="generalSettingsForm" class="settings-form">
            <div class="form-row">
              <div class="form-group">
                <label>Store Name</label>
                <input type="text" id="storeName" placeholder="Your store name" value="${currentSettings.store?.name || ""}">
              </div>
              <div class="form-group">
                <label>Store Description</label>
                <textarea id="storeDescription" placeholder="Brief description">${currentSettings.store?.description || ""}</textarea>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Phone</label>
                <input type="tel" id="storePhone" placeholder="+212 XXX XXX XXX" value="${currentSettings.store?.phone || ""}">
              </div>
              <div class="form-group">
                <label>Email</label>
                <input type="email" id="storeEmail" placeholder="info@example.com" value="${currentSettings.store?.email || ""}">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Address</label>
                <input type="text" id="storeAddress" placeholder="Store address" value="${currentSettings.store?.address || ""}">
              </div>
              <div class="form-group">
                <label>Country</label>
                <input type="text" id="storeCountry" placeholder="Country" value="${currentSettings.store?.country || ""}">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Timezone</label>
                <select id="storeTimezone">
                  <option value="Africa/Casablanca" ${currentSettings.store?.timezone === "Africa/Casablanca" ? "selected" : ""}>Africa/Casablanca</option>
                  <option value="Europe/London" ${currentSettings.store?.timezone === "Europe/London" ? "selected" : ""}>Europe/London</option>
                  <option value="America/New_York" ${currentSettings.store?.timezone === "America/New_York" ? "selected" : ""}>America/New_York</option>
                  <option value="Asia/Dubai" ${currentSettings.store?.timezone === "Asia/Dubai" ? "selected" : ""}>Asia/Dubai</option>
                </select>
              </div>
              <div class="form-group">
                <label>Currency</label>
                <select id="storeCurrency">
                  <option value="MAD" ${currentSettings.store?.currency === "MAD" ? "selected" : ""}>MAD</option>
                  <option value="USD" ${currentSettings.store?.currency === "USD" ? "selected" : ""}>USD</option>
                  <option value="EUR" ${currentSettings.store?.currency === "EUR" ? "selected" : ""}>EUR</option>
                </select>
              </div>
            </div>
            <button type="submit" class="btn btn-primary">Save General Settings</button>
          </form>
        </div>

        <!-- Theme Settings -->
        <div class="tab-panel" data-tab="theme">
          <h3>Theme Settings</h3>
          <form id="themeSettingsForm" class="settings-form">
            <div class="form-row">
              <div class="form-group">
                <label>Primary Color</label>
                <div class="color-input-group">
                  <input type="color" id="primaryColor" value="${currentSettings.theme?.primaryColor || "#6a79fa"}">
                  <span id="primaryColorValue">${currentSettings.theme?.primaryColor || "#6a79fa"}</span>
                </div>
              </div>
              <div class="form-group">
                <label>Secondary Color</label>
                <div class="color-input-group">
                  <input type="color" id="secondaryColor" value="${currentSettings.theme?.secondaryColor || "#1a1a1a"}">
                  <span id="secondaryColorValue">${currentSettings.theme?.secondaryColor || "#1a1a1a"}</span>
                </div>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Accent Color</label>
                <div class="color-input-group">
                  <input type="color" id="accentColor" value="${currentSettings.theme?.accentColor || "#27ae60"}">
                  <span id="accentColorValue">${currentSettings.theme?.accentColor || "#27ae60"}</span>
                </div>
              </div>
              <div class="form-group">
                <label>Background Color</label>
                <div class="color-input-group">
                  <input type="color" id="backgroundColor" value="${currentSettings.theme?.backgroundColor || "#f5f5f5"}">
                  <span id="backgroundColorValue">${currentSettings.theme?.backgroundColor || "#f5f5f5"}</span>
                </div>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Border Radius</label>
                <input type="text" id="borderRadius" placeholder="8px" value="${currentSettings.theme?.borderRadius || "8px"}">
              </div>
              <div class="form-group">
                <label>Font Family</label>
                <select id="fontFamily">
                  <option value="Arial, sans-serif" ${currentSettings.theme?.fontFamily === "Arial, sans-serif" ? "selected" : ""}>Arial</option>
                  <option value="Georgia, serif" ${currentSettings.theme?.fontFamily === "Georgia, serif" ? "selected" : ""}>Georgia</option>
                  <option value="Courier New, monospace" ${currentSettings.theme?.fontFamily === "Courier New, monospace" ? "selected" : ""}>Courier New</option>
                </select>
              </div>
            </div>
            <button type="submit" class="btn btn-primary">Save Theme Settings</button>
          </form>
        </div>

        <!-- SEO Settings -->
        <div class="tab-panel" data-tab="seo">
          <h3>SEO Settings</h3>
          <form id="seoSettingsForm" class="settings-form">
            <div class="form-group">
              <label>Page Title</label>
              <input type="text" id="seoTitle" placeholder="Page title" value="${currentSettings.seo?.title || ""}">
              <small>Recommended: 50-60 characters</small>
            </div>
            <div class="form-group">
              <label>Meta Description</label>
              <textarea id="seoDescription" placeholder="Meta description" rows="3">${currentSettings.seo?.description || ""}</textarea>
              <small>Recommended: 150-160 characters</small>
            </div>
            <div class="form-group">
              <label>Keywords</label>
              <input type="text" id="seoKeywords" placeholder="keyword1, keyword2, keyword3" value="${currentSettings.seo?.keywords || ""}">
            </div>
            <div class="form-group">
              <label>OG Image URL</label>
              <input type="url" id="ogImage" placeholder="https://example.com/image.jpg" value="${currentSettings.seo?.ogImage || ""}">
            </div>
            <div class="form-group">
              <label>Twitter Handle</label>
              <input type="text" id="twitterHandle" placeholder="@yourhandle" value="${currentSettings.seo?.twitterHandle || ""}">
            </div>
            <button type="submit" class="btn btn-primary">Save SEO Settings</button>
          </form>
        </div>

        <!-- Social Media Settings -->
        <div class="tab-panel" data-tab="social">
          <h3>Social Media Links</h3>
          <form id="socialSettingsForm" class="settings-form">
            <div class="form-group">
              <label><i class="fab fa-facebook"></i> Facebook</label>
              <input type="url" id="socialFacebook" placeholder="https://facebook.com/yourpage" value="${currentSettings.social?.facebook || ""}">
            </div>
            <div class="form-group">
              <label><i class="fab fa-instagram"></i> Instagram</label>
              <input type="url" id="socialInstagram" placeholder="https://instagram.com/yourprofile" value="${currentSettings.social?.instagram || ""}">
            </div>
            <div class="form-group">
              <label><i class="fab fa-twitter"></i> Twitter</label>
              <input type="url" id="socialTwitter" placeholder="https://twitter.com/yourhandle" value="${currentSettings.social?.twitter || ""}">
            </div>
            <div class="form-group">
              <label><i class="fab fa-linkedin"></i> LinkedIn</label>
              <input type="url" id="socialLinkedin" placeholder="https://linkedin.com/company/yourcompany" value="${currentSettings.social?.linkedin || ""}">
            </div>
            <div class="form-group">
              <label><i class="fab fa-whatsapp"></i> WhatsApp</label>
              <input type="tel" id="socialWhatsapp" placeholder="+212 XXX XXX XXX" value="${currentSettings.social?.whatsapp || ""}">
            </div>
            <div class="form-group">
              <label><i class="fab fa-tiktok"></i> TikTok</label>
              <input type="url" id="socialTiktok" placeholder="https://tiktok.com/@yourprofile" value="${currentSettings.social?.tiktok || ""}">
            </div>
            <button type="submit" class="btn btn-primary">Save Social Media Settings</button>
          </form>
        </div>

        <!-- Email Settings -->
        <div class="tab-panel" data-tab="email">
          <h3>Email Configuration</h3>
          <form id="emailSettingsForm" class="settings-form">
            <div class="form-group">
              <label>From Email</label>
              <input type="email" id="fromEmail" placeholder="noreply@example.com" value="${currentSettings.email?.fromEmail || ""}">
            </div>
            <div class="form-group">
              <label>From Name</label>
              <input type="text" id="fromName" placeholder="Your Store Name" value="${currentSettings.email?.fromName || ""}">
            </div>
            <div class="form-group">
              <label>SMTP Host</label>
              <input type="text" id="smtpHost" placeholder="smtp.gmail.com" value="${currentSettings.email?.smtpHost || ""}">
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>SMTP Port</label>
                <input type="number" id="smtpPort" placeholder="587" value="${currentSettings.email?.smtpPort || ""}">
              </div>
              <div class="form-group">
                <label>SMTP User</label>
                <input type="email" id="smtpUser" placeholder="your-email@gmail.com" value="${currentSettings.email?.smtpUser || ""}">
              </div>
            </div>
            <div class="form-group">
              <label>SMTP Password</label>
              <input type="password" id="smtpPassword" placeholder="••••••••" value="${currentSettings.email?.smtpPassword || ""}">
            </div>
            <div class="form-group">
              <label>
                <input type="checkbox" id="orderConfirmation" ${currentSettings.notifications?.orderConfirmation ? "checked" : ""}>
                Send Order Confirmation Emails
              </label>
            </div>
            <button type="submit" class="btn btn-primary">Save Email Settings</button>
          </form>
        </div>

        <!-- Shipping Settings -->
        <div class="tab-panel" data-tab="shipping">
          <h3>Shipping Configuration</h3>
          <form id="shippingSettingsForm" class="settings-form">
            <div class="form-group">
              <label>Free Shipping Threshold (MAD)</label>
              <input type="number" id="freeShippingThreshold" placeholder="500" value="${currentSettings.shipping?.freeShippingThreshold || ""}">
            </div>
            <div class="form-group">
              <label>Default Shipping Cost (MAD)</label>
              <input type="number" id="defaultShippingCost" placeholder="50" value="${currentSettings.shipping?.defaultShippingCost || ""}">
            </div>
            <div class="form-group">
              <label>Estimated Delivery Days</label>
              <input type="text" id="estimatedDeliveryDays" placeholder="5-10" value="${currentSettings.shipping?.estimatedDeliveryDays || ""}">
            </div>
            <button type="submit" class="btn btn-primary">Save Shipping Settings</button>
          </form>
        </div>

        <!-- Payment Settings -->
        <div class="tab-panel" data-tab="payment">
          <h3>Payment Configuration</h3>
          <form id="paymentSettingsForm" class="settings-form">
            <div class="form-group">
              <label>Tax Rate (%)</label>
              <input type="number" id="taxRate" placeholder="20" step="0.1" value="${(currentSettings.payment?.taxRate || 0.2) * 100}">
            </div>
            <div class="form-group">
              <label>
                <input type="checkbox" id="creditCard" checked> Credit Card
              </label>
              <label>
                <input type="checkbox" id="paypal" checked> PayPal
              </label>
              <label>
                <input type="checkbox" id="stripe" checked> Stripe
              </label>
              <label>
                <input type="checkbox" id="bankTransfer" checked> Bank Transfer
              </label>
            </div>
            <button type="submit" class="btn btn-primary">Save Payment Settings</button>
          </form>
        </div>

        <!-- Security Settings -->
        <div class="tab-panel" data-tab="security">
          <h3>Security Settings</h3>
          <form id="securitySettingsForm" class="settings-form">
            <div class="form-group">
              <label>
                <input type="checkbox" id="enableSSL" ${currentSettings.security?.enableSSL ? "checked" : ""}>
                Enable SSL/HTTPS
              </label>
            </div>
            <div class="form-group">
              <label>
                <input type="checkbox" id="enableTwoFactor" ${currentSettings.security?.enableTwoFactor ? "checked" : ""}>
                Enable Two-Factor Authentication
              </label>
            </div>
            <div class="form-group">
              <label>Session Timeout (seconds)</label>
              <input type="number" id="sessionTimeout" placeholder="3600" value="${currentSettings.security?.sessionTimeout || ""}">
            </div>
            <div class="form-group">
              <label>Minimum Password Length</label>
              <input type="number" id="passwordMinLength" placeholder="8" value="${currentSettings.security?.passwordMinLength || ""}">
            </div>
            <button type="submit" class="btn btn-primary">Save Security Settings</button>
          </form>
        </div>

        <!-- Analytics Settings -->
        <div class="tab-panel" data-tab="analytics">
          <h3>Analytics Configuration</h3>
          <form id="analyticsSettingsForm" class="settings-form">
            <div class="form-group">
              <label>Google Analytics ID</label>
              <input type="text" id="googleAnalyticsId" placeholder="UA-XXXXXXXXX-X" value="${currentSettings.analytics?.googleAnalyticsId || ""}">
            </div>
            <div class="form-group">
              <label>Facebook Pixel ID</label>
              <input type="text" id="facebookPixelId" placeholder="123456789" value="${currentSettings.analytics?.facebookPixelId || ""}">
            </div>
            <div class="form-group">
              <label>
                <input type="checkbox" id="enableTracking" ${currentSettings.analytics?.enableTracking ? "checked" : ""}>
                Enable Tracking
              </label>
            </div>
            <button type="submit" class="btn btn-primary">Save Analytics Settings</button>
          </form>
        </div>
      </div>
    `

    const existingTabs = settingsSection.querySelector(".settings-advanced-tabs")
    if (existingTabs) {
      existingTabs.replaceWith(advancedTabs)
    } else {
      settingsSection.appendChild(advancedTabs)
    }

    setupTabNavigation()
    setupFormListeners()
  }

  const setupTabNavigation = () => {
    document.querySelectorAll(".tab-nav-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const tabName = btn.getAttribute("data-tab")
        document.querySelectorAll(".tab-nav-btn").forEach((b) => b.classList.remove("active"))
        document.querySelectorAll(".tab-panel").forEach((p) => p.classList.remove("active"))
        btn.classList.add("active")
        document.querySelector(`.tab-panel[data-tab="${tabName}"]`)?.classList.add("active")
      })
    })
  }

  const setupFormListeners = () => {
    document.getElementById("generalSettingsForm")?.addEventListener("submit", (e) => {
      e.preventDefault()
      saveGeneralSettings()
    })

    document.getElementById("themeSettingsForm")?.addEventListener("submit", (e) => {
      e.preventDefault()
      saveThemeSettings()
    })

    document.getElementById("seoSettingsForm")?.addEventListener("submit", (e) => {
      e.preventDefault()
      saveSeoSettings()
    })

    document.getElementById("socialSettingsForm")?.addEventListener("submit", (e) => {
      e.preventDefault()
      saveSocialSettings()
    })

    document.getElementById("emailSettingsForm")?.addEventListener("submit", (e) => {
      e.preventDefault()
      saveEmailSettings()
    })

    document.getElementById("shippingSettingsForm")?.addEventListener("submit", (e) => {
      e.preventDefault()
      saveShippingSettings()
    })

    document.getElementById("paymentSettingsForm")?.addEventListener("submit", (e) => {
      e.preventDefault()
      savePaymentSettings()
    })

    document.getElementById("securitySettingsForm")?.addEventListener("submit", (e) => {
      e.preventDefault()
      saveSecuritySettings()
    })

    document.getElementById("analyticsSettingsForm")?.addEventListener("submit", (e) => {
      e.preventDefault()
      saveAnalyticsSettings()
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

  const saveGeneralSettings = () => {
    currentSettings.store = {
      name: document.getElementById("storeName").value,
      description: document.getElementById("storeDescription").value,
      phone: document.getElementById("storePhone").value,
      email: document.getElementById("storeEmail").value,
      address: document.getElementById("storeAddress").value,
      country: document.getElementById("storeCountry").value,
      timezone: document.getElementById("storeTimezone").value,
      currency: document.getElementById("storeCurrency").value,
    }
    saveAndSync()
  }

  const saveThemeSettings = () => {
    currentSettings.theme = {
      primaryColor: document.getElementById("primaryColor").value,
      secondaryColor: document.getElementById("secondaryColor").value,
      accentColor: document.getElementById("accentColor").value,
      backgroundColor: document.getElementById("backgroundColor").value,
      fontFamily: document.getElementById("fontFamily").value,
      borderRadius: document.getElementById("borderRadius").value,
    }
    saveAndSync()
  }

  const saveSeoSettings = () => {
    currentSettings.seo = {
      title: document.getElementById("seoTitle").value,
      description: document.getElementById("seoDescription").value,
      keywords: document.getElementById("seoKeywords").value,
      ogImage: document.getElementById("ogImage").value,
      twitterHandle: document.getElementById("twitterHandle").value,
    }
    saveAndSync()
  }

  const saveSocialSettings = () => {
    currentSettings.social = {
      facebook: document.getElementById("socialFacebook").value,
      instagram: document.getElementById("socialInstagram").value,
      twitter: document.getElementById("socialTwitter").value,
      linkedin: document.getElementById("socialLinkedin").value,
      whatsapp: document.getElementById("socialWhatsapp").value,
      tiktok: document.getElementById("socialTiktok").value,
    }
    saveAndSync()
  }

  const saveEmailSettings = () => {
    currentSettings.email = {
      fromEmail: document.getElementById("fromEmail").value,
      fromName: document.getElementById("fromName").value,
      smtpHost: document.getElementById("smtpHost").value,
      smtpPort: Number.parseInt(document.getElementById("smtpPort").value),
      smtpUser: document.getElementById("smtpUser").value,
      smtpPassword: document.getElementById("smtpPassword").value,
    }
    currentSettings.notifications = {
      orderConfirmation: document.getElementById("orderConfirmation").checked,
    }
    saveAndSync()
  }

  const saveShippingSettings = () => {
    currentSettings.shipping = {
      freeShippingThreshold: Number.parseFloat(document.getElementById("freeShippingThreshold").value),
      defaultShippingCost: Number.parseFloat(document.getElementById("defaultShippingCost").value),
      estimatedDeliveryDays: document.getElementById("estimatedDeliveryDays").value,
    }
    saveAndSync()
  }

  const savePaymentSettings = () => {
    const taxRate = Number.parseFloat(document.getElementById("taxRate").value) / 100
    currentSettings.payment = {
      taxRate: taxRate,
      methods: [
        document.getElementById("creditCard").checked ? "credit_card" : null,
        document.getElementById("paypal").checked ? "paypal" : null,
        document.getElementById("stripe").checked ? "stripe" : null,
        document.getElementById("bankTransfer").checked ? "bank_transfer" : null,
      ].filter((m) => m !== null),
    }
    saveAndSync()
  }

  const saveSecuritySettings = () => {
    currentSettings.security = {
      enableSSL: document.getElementById("enableSSL").checked,
      enableTwoFactor: document.getElementById("enableTwoFactor").checked,
      sessionTimeout: Number.parseInt(document.getElementById("sessionTimeout").value),
      passwordMinLength: Number.parseInt(document.getElementById("passwordMinLength").value),
    }
    saveAndSync()
  }

  const saveAnalyticsSettings = () => {
    currentSettings.analytics = {
      googleAnalyticsId: document.getElementById("googleAnalyticsId").value,
      facebookPixelId: document.getElementById("facebookPixelId").value,
      enableTracking: document.getElementById("enableTracking").checked,
    }
    saveAndSync()
  }

  const saveAndSync = () => {
    localStorage.setItem("websiteSettings", JSON.stringify(currentSettings))
    recordSettingsHistory("update", currentSettings)
    window.dispatchEvent(new CustomEvent("settingsUpdated", { detail: { settings: currentSettings } }))
    alert("Settings saved successfully!")
    console.log("[v0] Settings saved and synced:", currentSettings)
  }

  const setupSettingsSync = () => {
    // Listen for settings updates from other tabs/windows
    window.addEventListener("storage", (e) => {
      if (e.key === "websiteSettings") {
        loadSettings()
        setupSettingsUI()
        console.log("[v0] Settings synced from another tab")
      }
    })
  }

  const setupSettingsValidation = () => {
    // Validate email format
    document.addEventListener("change", (e) => {
      if (e.target.type === "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (e.target.value && !emailRegex.test(e.target.value)) {
          e.target.style.borderColor = "red"
          console.warn("[v0] Invalid email format:", e.target.value)
        } else {
          e.target.style.borderColor = ""
        }
      }
    })
  }

  const recordSettingsHistory = (action, settings) => {
    settingsHistory.push({
      action,
      settings: JSON.parse(JSON.stringify(settings)),
      timestamp: new Date().toISOString(),
    })

    // Keep only last 50 records
    if (settingsHistory.length > 50) {
      settingsHistory = settingsHistory.slice(-50)
    }

    localStorage.setItem("settingsHistory", JSON.stringify(settingsHistory))
  }

  const getSettings = () => currentSettings

  const exportSettings = () => {
    const dataStr = JSON.stringify(currentSettings, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `settings-export-${new Date().getTime()}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  return {
    init,
    getSettings,
    exportSettings,
  }
})()

// Initialize when admin dashboard loads
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", SettingsManager.init)
} else {
  SettingsManager.init()
}
