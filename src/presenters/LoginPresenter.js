// Login Presenter - Menghubungkan Model dan View
export class LoginPresenter {
    constructor(model, view) {
      this.model = model
      this.view = view
    }
  
    init() {
      this.setupTabs()
      this.setupForms()
    }
  
    setupTabs() {
      const loginTab = document.getElementById("login-tab")
      const registerTab = document.getElementById("register-tab")
  
      loginTab.addEventListener("click", () => {
        this.view.switchToLoginMode()
        this.view.clearValidationErrors("login")
        this.view.clearValidationErrors("register")
      })
  
      registerTab.addEventListener("click", () => {
        this.view.switchToRegisterMode()
        this.view.clearValidationErrors("login")
        this.view.clearValidationErrors("register")
      })
    }
  
    setupForms() {
      const loginForm = document.getElementById("login-form")
      const registerForm = document.getElementById("register-form")
  
      loginForm.addEventListener("submit", async (e) => {
        e.preventDefault()
        await this.handleLogin()
      })
  
      registerForm.addEventListener("submit", async (e) => {
        e.preventDefault()
        await this.handleRegister()
      })
    }
  
    async handleLogin() {
      this.view.clearValidationErrors("login")
  
      const formData = this.view.getFormData("login")
      const credentials = {
        email: formData.get("email"),
        password: formData.get("password"),
      }
  
      // Validate using model
      const validationErrors = this.model.validateCredentials(credentials)
  
      if (validationErrors.length > 0) {
        // Show validation errors
        if (!credentials.email || !credentials.email.includes("@")) {
          this.view.showValidationError("login", "email", "Valid email is required")
        }
        if (!credentials.password || credentials.password.length < 6) {
          this.view.showValidationError("login", "password", "Password must be at least 6 characters long")
        }
        return
      }
  
      try {
        window.app.showLoading()
        await this.model.login(credentials)
        alert("Login successful!")
        window.app.updateNavigation()
        window.location.hash = "#home"
      } catch (error) {
        console.error("Login error:", error)
        this.view.showFormError("login", error.message || "Login failed. Please try again.")
      } finally {
        window.app.hideLoading()
      }
    }
  
    async handleRegister() {
      this.view.clearValidationErrors("register")
  
      const formData = this.view.getFormData("register")
      const userData = {
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
      }
  
      // Validate using model
      const validationErrors = this.model.validateRegistrationData(userData)
  
      if (validationErrors.length > 0) {
        // Show validation errors
        if (!userData.name || userData.name.trim().length < 2) {
          this.view.showValidationError("register", "name", "Name must be at least 2 characters long")
        }
        if (!userData.email || !userData.email.includes("@")) {
          this.view.showValidationError("register", "email", "Valid email is required")
        }
        if (!userData.password || userData.password.length < 6) {
          this.view.showValidationError("register", "password", "Password must be at least 6 characters long")
        }
        return
      }
  
      try {
        window.app.showLoading()
        await this.model.register(userData)
        alert("Registration successful! Please login with your credentials.")
  
        // Switch to login mode and fill credentials
        this.view.switchToLoginMode()
        this.view.fillLoginCredentials(userData.email, userData.password)
      } catch (error) {
        console.error("Registration error:", error)
        this.view.showFormError("register", error.message || "Registration failed. Please try again.")
      } finally {
        window.app.hideLoading()
      }
    }
  }
  