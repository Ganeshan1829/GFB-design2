(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const signInTab = $("#signInTab");
  const registerTab = $("#registerTab");
  const signInPanel = $("#signInPanel");
  const registerPanel = $("#registerPanel");
  const preview = $("#accountPreview");
  if (!signInTab || !registerTab) return;

  function showPanel(panel) {
    const isLogin = panel === "login";
    signInPanel.hidden = !isLogin;
    registerPanel.hidden = isLogin;
    preview.hidden = true;
    signInTab.classList.toggle("active", isLogin);
    registerTab.classList.toggle("active", !isLogin);
    signInTab.setAttribute("aria-selected", String(isLogin));
    registerTab.setAttribute("aria-selected", String(!isLogin));
  }

  signInTab.addEventListener("click", () => showPanel("login"));
  registerTab.addEventListener("click", () => showPanel("register"));
  document.querySelectorAll("[data-show-register]").forEach(button => button.addEventListener("click", () => showPanel("register")));
  document.querySelectorAll("[data-show-login]").forEach(button => button.addEventListener("click", () => showPanel("login")));

  document.querySelectorAll("[data-toggle-password]").forEach(button => {
    button.addEventListener("click", () => {
      const input = $("#" + button.dataset.togglePassword);
      const reveal = input.type === "password";
      input.type = reveal ? "text" : "password";
      button.textContent = reveal ? "Hide" : "Show";
      button.setAttribute("aria-label", reveal ? "Hide password" : "Show password");
    });
  });

  function validate(form) {
    let valid = true;
    form.querySelectorAll("[required]").forEach(input => {
      let okay = input.checkValidity();
      if (input.name === "phone") okay = /^[6-9]\d{9}$/.test(input.value.trim());
      const error = $(`[data-account-error="${input.id}"]`);
      if (error) error.textContent = okay ? "" : (input.name === "phone" ? "Enter a valid 10-digit Indian mobile number." : input.type === "email" ? "Enter a valid email address." : "Please complete this field correctly.");
      if (!okay) valid = false;
    });
    return valid;
  }

  function getInitials(name) {
    if (!name) return "GF";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  function showPreview(name, email, mode, phone = "+91 98765 43210") {
    signInPanel.hidden = true;
    registerPanel.hidden = true;
    signInTab.classList.remove("active");
    registerTab.classList.remove("active");
    signInTab.setAttribute("aria-selected", "false");
    registerTab.setAttribute("aria-selected", "false");
    preview.hidden = false;

    const firstName = (name || "Customer").trim().split(" ")[0];
    const previewHeading = $("#previewHeading");
    if (previewHeading) previewHeading.textContent = mode === "register" ? `Welcome to GFB, ${firstName}` : `Welcome back, ${firstName}`;
    
    const previewMessage = $("#previewMessage");
    if (previewMessage) previewMessage.textContent = mode === "register" 
      ? "Your demo account has been created successfully. All features are ready for prototype testing." 
      : "You are signed in to the GFB prototype customer portal.";

    const nameEl = $("#previewName");
    if (nameEl) nameEl.textContent = name || "Aditya Sharma";
    
    const emailEl = $("#previewEmail");
    if (emailEl) emailEl.textContent = email;

    const phoneEl = $("#previewPhone");
    if (phoneEl) phoneEl.textContent = phone;

    const avatarEl = $("#previewAvatar");
    if (avatarEl) avatarEl.textContent = getInitials(name || "Aditya Sharma");

    // Save user session in localStorage
    const userData = {
      name: name || "Aditya Sharma",
      email: email,
      phone: phone,
      loggedInAt: new Date().toISOString()
    };
    try {
      localStorage.setItem("gfb_user", JSON.stringify(userData));
    } catch (e) {}

    // Refresh header if available
    if (typeof window.renderHeader === "function") {
      window.renderHeader();
    }
  }

  signInPanel.addEventListener("submit", event => {
    event.preventDefault();
    if (!validate(signInPanel)) return;
    const data = new FormData(signInPanel);
    const email = data.get("email");
    const name = email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, c => c.toUpperCase());
    showPreview(name, email, "login");
  });

  registerPanel.addEventListener("submit", event => {
    event.preventDefault();
    if (!validate(registerPanel)) return;
    const data = new FormData(registerPanel);
    showPreview(data.get("name"), data.get("email"), "register", data.get("phone"));
  });

  // ==================== 1-CLICK PROTOTYPE AUTOFILL & AUTO SUBMIT ====================
  const autofillSignInBtn = $("#autofillSignInBtn");
  if (autofillSignInBtn) {
    autofillSignInBtn.addEventListener("click", () => {
      const emailInput = $("#loginEmail");
      const passInput = $("#loginPassword");
      const statusEl = $("#loginStatus");

      emailInput.value = "aditya.sharma@garbofree.in";
      passInput.value = "GfbSmart2026!";

      emailInput.classList.add("field-autofilled");
      passInput.classList.add("field-autofilled");

      if (statusEl) {
        statusEl.textContent = "⚡ Autofilling demo credentials... Logging in";
        statusEl.style.color = "var(--bronze)";
      }

      setTimeout(() => {
        showPreview("Aditya Sharma", "aditya.sharma@garbofree.in", "login", "+91 98765 43210");
        if (typeof window.toast === "function") {
          window.toast("⚡ Signed in as Aditya Sharma (Demo Session)");
        }
      }, 350);
    });
  }

  const autofillSignUpBtn = $("#autofillSignUpBtn");
  if (autofillSignUpBtn) {
    autofillSignUpBtn.addEventListener("click", () => {
      const nameInput = $("#registerName");
      const emailInput = $("#registerEmail");
      const phoneInput = $("#registerPhone");
      const passInput = $("#registerPassword");
      const consent = $("#accountConsent");
      const statusEl = $("#registerStatus");

      nameInput.value = "Aditya Sharma";
      emailInput.value = "aditya.sharma@garbofree.in";
      phoneInput.value = "9876543210";
      passInput.value = "GfbSmart2026!";
      if (consent) consent.checked = true;

      [nameInput, emailInput, phoneInput, passInput].forEach(el => el.classList.add("field-autofilled"));

      if (statusEl) {
        statusEl.textContent = "⚡ Autofilling sample details... Creating demo account";
        statusEl.style.color = "var(--bronze)";
      }

      setTimeout(() => {
        showPreview("Aditya Sharma", "aditya.sharma@garbofree.in", "register", "+91 98765 43210");
        if (typeof window.toast === "function") {
          window.toast("⚡ Demo account created for Aditya Sharma!");
        }
      }, 350);
    });
  }

  const signOutBtn = $("#accountSignOut");
  if (signOutBtn) {
    signOutBtn.addEventListener("click", () => {
      try {
        localStorage.removeItem("gfb_user");
      } catch (e) {}
      signInPanel.reset();
      registerPanel.reset();
      document.querySelectorAll(".error").forEach(error => error.textContent = "");
      document.querySelectorAll(".field-autofilled").forEach(el => el.classList.remove("field-autofilled"));
      showPanel("login");
      if (typeof window.renderHeader === "function") {
        window.renderHeader();
      }
      if (typeof window.toast === "function") {
        window.toast("Signed out of demo session.");
      }
    });
  }

  // Check if a demo session already exists
  try {
    const saved = localStorage.getItem("gfb_user");
    if (saved) {
      const u = JSON.parse(saved);
      if (u && u.email) {
        showPreview(u.name || "Aditya Sharma", u.email, "login", u.phone || "+91 98765 43210");
        return;
      }
    }
  } catch (e) {}

  // Check URL hash or query on load for direct link to register tab
  const hash = window.location.hash;
  const urlMode = new URLSearchParams(window.location.search).get("mode");
  if (hash === "#register" || hash === "#signup" || urlMode === "register" || urlMode === "signup") {
    showPanel("register");
  }
})();
