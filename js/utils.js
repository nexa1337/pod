// Utility Functions
const Utils = (() => {
  // Fuzzy search implementation
  const fuzzySearch = (query, items, searchKey) => {
    if (!query) return items

    const lowerQuery = query.toLowerCase()
    const scored = items.map((item) => {
      const text = item[searchKey].toLowerCase()
      let score = 0
      let queryIndex = 0

      for (let i = 0; i < text.length && queryIndex < lowerQuery.length; i++) {
        if (text[i] === lowerQuery[queryIndex]) {
          score += 1
          queryIndex++
        }
      }

      return { item, score }
    })

    return scored
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .map(({ item }) => item)
  }

  // Format date
  const formatDate = (date) => {
    return new Intl.DateTimeFormat(
      window.I18n.getCurrentLanguage() === "ar"
        ? "ar-SA"
        : window.I18n.getCurrentLanguage() === "es"
          ? "es-ES"
          : "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      },
    ).format(date)
  }

  // Format time
  const formatTime = (date) => {
    return new Intl.DateTimeFormat(
      window.I18n.getCurrentLanguage() === "ar"
        ? "ar-SA"
        : window.I18n.getCurrentLanguage() === "es"
          ? "es-ES"
          : "en-US",
      {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      },
    ).format(date)
  }

  // Update live date and time
  const updateLiveDateTime = () => {
    const now = new Date()
    const dateEl = document.getElementById("liveDate")
    const timeEl = document.getElementById("liveTime")

    if (dateEl) dateEl.textContent = formatDate(now)
    if (timeEl) timeEl.textContent = formatTime(now)
  }

  return {
    fuzzySearch,
    formatDate,
    formatTime,
    updateLiveDateTime,
  }
})()

window.Utils = Utils
