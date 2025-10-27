const Currency = (() => {
  let currentCurrency = localStorage.getItem("currency") || "MAD"
  let rates = {}
  let userCurrency = null

  const init = async () => {
    try {
      rates = window.CURRENCIES_DATA || {}
      console.log("[v0] Currencies loaded:", Object.keys(rates))

      // Try to detect user's currency via IP geolocation
      detectUserCurrency()
    } catch (error) {
      console.error("[v0] Failed to load currencies:", error)
    }
  }

  const detectUserCurrency = async () => {
    try {
      const response = await fetch("https://ipapi.co/json/")
      const data = await response.json()
      const detectedCurrency = data.currency

      if (rates[detectedCurrency]) {
        userCurrency = detectedCurrency
      }
    } catch (error) {
      console.log("[v0] Could not detect user currency")
    }
  }

  const setCurrency = (currency) => {
    if (rates[currency]) {
      currentCurrency = currency
      localStorage.setItem("currency", currency)
      console.log("[v0] Currency set to:", currency)
    }
  }

  const convert = (price) => {
    const rate = rates[currentCurrency]?.rate || 1
    return Math.round(price * rate)
  }

  const format = (price) => {
    const converted = convert(price)
    const symbol = rates[currentCurrency]?.symbol || currentCurrency
    return `${symbol} ${converted}`
  }

  const getCurrencySymbol = () => rates[currentCurrency]?.symbol || currentCurrency

  const getCurrentCurrency = () => currentCurrency

  return {
    init,
    setCurrency,
    convert,
    format,
    getCurrentCurrency,
    getCurrencySymbol,
    getUserCurrency: () => userCurrency,
  }
})()

window.Currency = Currency
