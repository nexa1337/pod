const I18n = (() => {
  let currentLanguage = localStorage.getItem("language") || "en"
  let translations = {}

  const init = async () => {
    try {
      translations = window.TRANSLATIONS_DATA || {}
      console.log("[v0] Translations loaded:", Object.keys(translations))
      applyLanguage(currentLanguage)
    } catch (error) {
      console.error("[v0] Failed to load translations:", error)
    }
  }

  const setLanguage = (lang) => {
    if (!translations[lang]) {
      console.error("[v0] Language not available:", lang)
      return
    }
    currentLanguage = lang
    localStorage.setItem("language", lang)
    applyLanguage(lang)
    document.documentElement.lang = lang
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr"

    updateUIText()
  }

  const applyLanguage = (lang) => {
    const htmlElement = document.documentElement
    htmlElement.lang = lang
    htmlElement.dir = lang === "ar" ? "rtl" : "ltr"
  }

  const updateUIText = () => {
    // Update search placeholder
    const searchInput = document.getElementById("searchInput")
    if (searchInput) {
      searchInput.placeholder = get("header.searchPlaceholder")
    }

    // Update category filter
    const categoryFilter = document.getElementById("categoryFilter")
    if (categoryFilter) {
      const options = categoryFilter.querySelectorAll("option")
      options[0].textContent = get("featured.allProducts")
      options[1].textContent = "Apparel"
      options[2].textContent = get("featured.drinkware")
      options[3].textContent = get("featured.accessories")
    }

    // Update hero section
    const heroBadge = document.querySelector(".hero-badge")
    if (heroBadge) heroBadge.textContent = get("hero.badge")

    const heroTitle = document.querySelector(".hero-title")
    if (heroTitle) heroTitle.textContent = get("hero.title")

    // Update featured section
    const featuredBadge = document.querySelector(".featured-badge")
    if (featuredBadge) featuredBadge.textContent = get("featured.badge")

    const featuredTitle = document.querySelector(".featured-title")
    if (featuredTitle) featuredTitle.textContent = get("featured.title")

    // Update tab buttons
    const tabBtns = document.querySelectorAll(".tab-btn")
    if (tabBtns.length > 0) {
      tabBtns[0].textContent = get("featured.allProducts")
      tabBtns[1].textContent = get("featured.clothingAndBags")
      tabBtns[2].textContent = get("featured.drinkware")
      tabBtns[3].textContent = get("featured.accessories")
    }

    // Update footer
    const footerSections = document.querySelectorAll(".footer-section h3")
    if (footerSections.length > 0) {
      footerSections[0].textContent = get("footer.about")
      footerSections[1].textContent = get("footer.links")
      footerSections[2].textContent = get("footer.integrations")
    }

    // Update cart header
    const cartHeader = document.querySelector(".cart-header h2")
    if (cartHeader) cartHeader.textContent = get("cart.title")

    // Update buttons
    const addToCartBtn = document.getElementById("addToCartBtn")
    if (addToCartBtn) addToCartBtn.textContent = get("products.addToCart")

    const whatsappBtn = document.getElementById("whatsappCheckoutBtn")
    if (whatsappBtn) whatsappBtn.textContent = get("products.orderViaWhatsApp")

    const checkoutBtn = document.getElementById("checkoutBtn")
    if (checkoutBtn) checkoutBtn.textContent = get("cart.checkout")
  }

  const get = (key) => {
    const keys = key.split(".")
    let value = translations[currentLanguage]

    for (const k of keys) {
      value = value?.[k]
    }

    return value || key
  }

  const getCurrentLanguage = () => currentLanguage

  return {
    init,
    setLanguage,
    get,
    getCurrentLanguage,
    updateUIText,
  }
})()

window.I18n = I18n
