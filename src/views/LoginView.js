import { Icons } from "../utils/Icons.js"

export class LoginView {
  constructor() {
    this.element = null
  }

  showLoading() { window.app.showLoading(); }
  hideLoading() { window.app.hideLoading(); }
  showAlert(message) { alert(message); }
  navigateTo(hash) { window.location.hash = hash; }


  render() {
    return `
      <article class="auth-page">
        <header class="page-header">
          <h1 class="page-title text-center">
            ${Icons.user}
            Selamat Datang di Story Explorer
          </h1>
        </header>
        
        <section class="auth-section">
          <div class="auth-container">
            <div class="auth-card">
              <div class="auth-toggle" role="tablist">
                <button type="button" id="login-tab" class="auth-tab active" role="tab" aria-selected="true" aria-controls="login-form">Login</button>
                <button type="button" id="register-tab" class="auth-tab" role="tab" aria-selected="false" aria-controls="register-form">Register</button>
              </div>

              <section id="login-form-section" class="form-section">
                <form class="auth-form" id="login-form" role="tabpanel" aria-labelledby="login-tab" novalidate>
                  <div class="form-group">
                    <label for="login-email" class="form-label">Alamat Email *</label>
                    <input type="email" id="login-email" name="email" class="form-input" required autocomplete="email" placeholder="Masukkan email Anda">
                    <div id="login-email-error" class="form-error hidden" role="alert"></div>
                  </div>
                  <div class="form-group">
                    <label for="login-password" class="form-label">Password *</label>
                    <input type="password" id="login-password" name="password" class="form-input" required autocomplete="current-password" placeholder="Masukkan password Anda">
                    <div id="login-password-error" class="form-error hidden" role="alert"></div>
                  </div>
                  <div class="form-actions">
                    <button type="submit" class="btn btn-primary btn-full">${Icons.logIn} <span class="btn-text">Login</span></button>
                  </div>
                  <div id="login-form-error" class="form-error hidden" role="alert"></div>
                </form>
              </section>

              <section id="register-form-section" class="form-section hidden">
                <form class="auth-form" id="register-form" role="tabpanel" aria-labelledby="register-tab" novalidate>
                  <div class="form-group">
                    <label for="register-name" class="form-label">Nama Lengkap *</label>
                    <input type="text" id="register-name" name="name" class="form-input" required autocomplete="name" placeholder="Masukkan nama Anda">
                    <div id="register-name-error" class="form-error hidden" role="alert"></div>
                  </div>
                  <div class="form-group">
                    <label for="register-email" class="form-label">Alamat Email *</label>
                    <input type="email" id="register-email" name="email" class="form-input" required autocomplete="email" placeholder="Masukkan email Anda">
                    <div id="register-email-error" class="form-error hidden" role="alert"></div>
                  </div>
                  <div class="form-group">
                    <label for="register-password" class="form-label">Password *</label>
                    <input type="password" id="register-password" name="password" class="form-input" required minlength="6" autocomplete="new-password" placeholder="Minimal 6 karakter">
                    <div id="register-password-error" class="form-error hidden" role="alert"></div>
                  </div>
                  <div class="form-actions">
                    <button type="submit" class="btn btn-success btn-full">${Icons.userPlus} <span class="btn-text">Register</span></button>
                  </div>
                  <div id="register-form-error" class="form-error hidden" role="alert"></div>
                </form>
              </section>
            </div>
          </div>
        </section>
      </article>
    `
  }

  
  switchToLoginMode() {
    this.getLoginTabElement()?.classList.add("active");
    this.getLoginTabElement()?.setAttribute("aria-selected", "true");
    this.getRegisterTabElement()?.classList.remove("active");
    this.getRegisterTabElement()?.setAttribute("aria-selected", "false");
    document.getElementById("login-form-section")?.classList.remove("hidden");
    document.getElementById("register-form-section")?.classList.add("hidden");
  }

  switchToRegisterMode() {
    this.getRegisterTabElement()?.classList.add("active");
    this.getRegisterTabElement()?.setAttribute("aria-selected", "true");
    this.getLoginTabElement()?.classList.remove("active");
    this.getLoginTabElement()?.setAttribute("aria-selected", "false");
    document.getElementById("register-form-section")?.classList.remove("hidden");
    document.getElementById("login-form-section")?.classList.add("hidden");
  }

  showValidationError(formType, fieldId, message) {
    const errorElement = this.getErrorElement(formType, fieldId)
    if (errorElement) {
      errorElement.textContent = message
      errorElement.classList.remove("hidden")
    }
  }

  showFormError(formType, message) {
    const errorElement = this.getFormErrorElement(formType)
    if (errorElement) {
      errorElement.textContent = message
      errorElement.classList.remove("hidden")
    }
  }

  clearValidationErrors(formType) {
    document.querySelectorAll(`#${formType}-form .form-error`)
        .forEach(el => {
            el.classList.add("hidden");
            el.textContent = "";
        });
  }

  fillLoginCredentials(email, password) {
    this.getLoginEmailInput().value = email
    this.getLoginPasswordInput().value = password
  }

  getFormData(formType) {
    return new FormData(this.getFormElement(formType))
  }
  
  getLoginTabElement() { return document.getElementById("login-tab") }
  getRegisterTabElement() { return document.getElementById("register-tab") }
  getLoginFormElement() { return document.getElementById("login-form") }
  getRegisterFormElement() { return document.getElementById("register-form") }
  getFormElement(formType) { return document.getElementById(`${formType}-form`) }
  getErrorElement(formType, fieldId) { return document.getElementById(`${formType}-${fieldId}-error`) }
  getFormErrorElement(formType) { return document.getElementById(`${formType}-form-error`) }
  getLoginEmailInput() { return document.getElementById("login-email") }
  getLoginPasswordInput() { return document.getElementById("login-password") }
}