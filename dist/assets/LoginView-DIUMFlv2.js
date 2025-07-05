import{I as s}from"./main-DJR8oUtS.js";class d{constructor(){this.element=null}showLoading(){window.app.showLoading()}hideLoading(){window.app.hideLoading()}showAlert(e){alert(e)}navigateTo(e){window.location.hash=e}render(){return`
      <article class="auth-page">
        <header class="page-header">
          <h1 class="page-title text-center">
            ${s.user}
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
                    <button type="submit" class="btn btn-primary btn-full">${s.logIn} <span class="btn-text">Login</span></button>
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
                    <button type="submit" class="btn btn-success btn-full">${s.userPlus} <span class="btn-text">Register</span></button>
                  </div>
                  <div id="register-form-error" class="form-error hidden" role="alert"></div>
                </form>
              </section>
            </div>
          </div>
        </section>
      </article>
    `}switchToLoginMode(){var e,t,r,a,o,i;(e=this.getLoginTabElement())==null||e.classList.add("active"),(t=this.getLoginTabElement())==null||t.setAttribute("aria-selected","true"),(r=this.getRegisterTabElement())==null||r.classList.remove("active"),(a=this.getRegisterTabElement())==null||a.setAttribute("aria-selected","false"),(o=document.getElementById("login-form-section"))==null||o.classList.remove("hidden"),(i=document.getElementById("register-form-section"))==null||i.classList.add("hidden")}switchToRegisterMode(){var e,t,r,a,o,i;(e=this.getRegisterTabElement())==null||e.classList.add("active"),(t=this.getRegisterTabElement())==null||t.setAttribute("aria-selected","true"),(r=this.getLoginTabElement())==null||r.classList.remove("active"),(a=this.getLoginTabElement())==null||a.setAttribute("aria-selected","false"),(o=document.getElementById("register-form-section"))==null||o.classList.remove("hidden"),(i=document.getElementById("login-form-section"))==null||i.classList.add("hidden")}showValidationError(e,t,r){const a=this.getErrorElement(e,t);a&&(a.textContent=r,a.classList.remove("hidden"))}showFormError(e,t){const r=this.getFormErrorElement(e);r&&(r.textContent=t,r.classList.remove("hidden"))}clearValidationErrors(e){document.querySelectorAll(`#${e}-form .form-error`).forEach(t=>{t.classList.add("hidden"),t.textContent=""})}fillLoginCredentials(e,t){this.getLoginEmailInput().value=e,this.getLoginPasswordInput().value=t}getFormData(e){return new FormData(this.getFormElement(e))}getLoginTabElement(){return document.getElementById("login-tab")}getRegisterTabElement(){return document.getElementById("register-tab")}getLoginFormElement(){return document.getElementById("login-form")}getRegisterFormElement(){return document.getElementById("register-form")}getFormElement(e){return document.getElementById(`${e}-form`)}getErrorElement(e,t){return document.getElementById(`${e}-${t}-error`)}getFormErrorElement(e){return document.getElementById(`${e}-form-error`)}getLoginEmailInput(){return document.getElementById("login-email")}getLoginPasswordInput(){return document.getElementById("login-password")}}export{d as LoginView};
