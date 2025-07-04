// Login Page Component - Pure Vanilla JavaScript
import { Icons } from "../utils/Icons.js"

export class LoginPage {
  constructor() {
    this.isLoginMode = true
  }

  async render() {
    return `
      <div class="page">
        <div class="auth-container">
          <div class="auth-card">
            <h2 class="page-title text-center">
              ${Icons.user}
              Welcome to Story Explorer
            </h2>
            
            <div class="auth-toggle">
              <button type="button" 
                      id="login-tab" 
                      class="auth-tab active">
                Login
              </button>
              <button type="button" 
                      id="register-tab" 
                      class="auth-tab">
                Register
              </button>
            </div>

            <form class="form auth-form" id="login-form">
              <div class="form-group">
                <label for="login-email" class="form-label">Email *</label>
                <input type="email" 
                       id="login-email" 
                       name="email" 
                       class="form-input" 
                       required 
                       value="test@example.com"
                       placeholder="Enter your email">
              </div>
              
              <div class="form-group">
                <label for="login-password" class="form-label">Password *</label>
                <input type="password" 
                       id="login-password" 
                       name="password" 
                       class="form-input" 
                       required 
                       value="password123"
                       placeholder="Enter your password">
              </div>
              
              <button type="submit" class="btn btn-primary btn-full">
                ${Icons.logIn}
                Login
              </button>
            </form>

            <form class="form auth-form hidden" id="register-form">
              <div class="form-group">
                <label for="register-name" class="form-label">Name *</label>
                <input type="text" 
                       id="register-name" 
                       name="name" 
                       class="form-input" 
                       required 
                       placeholder="Enter your name">
              </div>
              
              <div class="form-group">
                <label for="register-email" class="form-label">Email *</label>
                <input type="email" 
                       id="register-email" 
                       name="email" 
                       class="form-input" 
                       required 
                       placeholder="Enter your email">
              </div>
              
              <div class="form-group">
                <label for="register-password" class="form-label">Password *</label>
                <input type="password" 
                       id="register-password" 
                       name="password" 
                       class="form-input" 
                       required 
                       minlength="6"
                       placeholder="Enter your password (min 6 characters)">
              </div>
              
              <button type="submit" class="btn btn-success btn-full">
                ${Icons.userPlus}
                Register
              </button>
            </form>

            <div class="auth-demo">
              <p class="text-center" style="margin-top: 1rem; font-size: 0.9rem; color: #666;">
                Demo credentials filled in above.<br>
                Or register a new account to get started.
              </p>
            </div>
          </div>
        </div>
      </div>
    `
  }

  async init() {
    this.setupTabs()
    this.setupForms()
  }

  setupTabs() {
    const loginTab = document.getElementById("login-tab")
    const registerTab = document.getElementById("register-tab")
    const loginForm = document.getElementById("login-form")
    const registerForm = document.getElementById("register-form")

    loginTab.addEventListener("click", () => {
      this.isLoginMode = true
      loginTab.classList.add("active")
      registerTab.classList.remove("active")
      loginForm.classList.remove("hidden")
      registerForm.classList.add("hidden")
    })

    registerTab.addEventListener("click", () => {
      this.isLoginMode = false
      registerTab.classList.add("active")
      loginTab.classList.remove("active")
      registerForm.classList.remove("hidden")
      loginForm.classList.add("hidden")
    })
  }

  setupForms() {
    const loginForm = document.getElementById("login-form")
    const registerForm = document.getElementById("register-form")

    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault()
      await this.handleLogin(e)
    })

    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault()
      await this.handleRegister(e)
    })
  }

  async handleLogin(e) {
    const formData = new FormData(e.target)
    const credentials = {
      email: formData.get("email"),
      password: formData.get("password"),
    }

    try {
      window.app.showLoading()
      await window.storyService.login(credentials)
      alert("Login successful!")
      window.app.updateNavigation()
      window.location.hash = "#home"
    } catch (error) {
      console.error("Login error:", error)
      alert(error.message || "Login failed. Please try again.")
    } finally {
      window.app.hideLoading()
    }
  }

  async handleRegister(e) {
    const formData = new FormData(e.target)
    const userData = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
    }

    try {
      window.app.showLoading()
      await window.storyService.register(userData)
      alert("Registration successful! Please login with your credentials.")

      // Switch to login mode
      this.isLoginMode = true
      document.getElementById("login-tab").click()

      // Fill login form with registered credentials
      document.getElementById("login-email").value = userData.email
      document.getElementById("login-password").value = userData.password
    } catch (error) {
      console.error("Registration error:", error)
      alert(error.message || "Registration failed. Please try again.")
    } finally {
      window.app.hideLoading()
    }
  }
}
