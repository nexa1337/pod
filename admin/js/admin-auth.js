// Admin Authentication System
const AdminAuth = (() => {
  const DEFAULT_CREDENTIALS = {
    username: "admin",
    password: "admin123",
  }

  const init = () => {
    const loginForm = document.getElementById("loginForm")
    if (loginForm) {
      loginForm.addEventListener("submit", handleLogin)
    }

    // Check if already logged in
    if (isLoggedIn()) {
      window.location.href = "dashboard.html"
    }
  }

  const handleLogin = (e) => {
    e.preventDefault()

    const username = document.getElementById("username").value
    const password = document.getElementById("password").value
    const rememberMe = document.getElementById("rememberMe").checked

    // Validate credentials
    if (username === DEFAULT_CREDENTIALS.username && password === DEFAULT_CREDENTIALS.password) {
      // Store login info
      const loginData = {
        username: username,
        loginTime: new Date().toISOString(),
        token: generateToken(),
      }

      localStorage.setItem("adminLogin", JSON.stringify(loginData))

      if (rememberMe) {
        localStorage.setItem("adminRemember", "true")
      }

      console.log("[v0] Admin login successful")
      window.location.href = "dashboard.html"
    } else {
      alert("Invalid username or password")
      console.log("[v0] Login failed - invalid credentials")
    }
  }

  const isLoggedIn = () => {
    const loginData = localStorage.getItem("adminLogin")
    if (!loginData) return false

    try {
      const data = JSON.parse(loginData)
      return data.token && data.username
    } catch (e) {
      return false
    }
  }

  const getLoginData = () => {
    const loginData = localStorage.getItem("adminLogin")
    if (!loginData) return null

    try {
      return JSON.parse(loginData)
    } catch (e) {
      return null
    }
  }

  const logout = () => {
    localStorage.removeItem("adminLogin")
    localStorage.removeItem("adminRemember")
    window.location.href = "index.html"
  }

  const generateToken = () => {
    return "token_" + Math.random().toString(36).substr(2, 9) + "_" + Date.now()
  }

  return {
    init,
    isLoggedIn,
    getLoginData,
    logout,
  }
})()

document.addEventListener("DOMContentLoaded", AdminAuth.init)
