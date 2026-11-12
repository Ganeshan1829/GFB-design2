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

  function showPreview(name, email, mode) {
    signInPanel.hidden = true;
    registerPanel.hidden = true;
    signInTab.classList.remove("active");
    registerTab.classList.remove("active");
    signInTab.setAttribute("aria-selected", "false");
    registerTab.setAttribute("aria-selected", "false");
    preview.hidden = false;
    $("#previewHeading").textContent = mode === "register" ? `Welcome, ${name}` : `Welcome back, ${name || "GFB customer"}`;
    $("#previewMessage").textContent = mode === "register" ? "Your registration form passed the front-end checks." : "Your sign-in form passed the front-end checks.";
    $("#previewEmail").textContent = email;
  }

  signInPanel.addEventListener("submit", event => {
    event.preventDefault();
    if (!validate(signInPanel)) return;
    const data = new FormData(signInPanel);
    showPreview(data.get("email").split("@")[0], data.get("email"), "login");
  });

  registerPanel.addEventListener("submit", event => {
    event.preventDefault();
    if (!validate(registerPanel)) return;
    const data = new FormData(registerPanel);
    showPreview(data.get("name"), data.get("email"), "register");
  });

  $("#accountSignOut").addEventListener("click", () => {
    signInPanel.reset();
    registerPanel.reset();
    document.querySelectorAll(".error").forEach(error => error.textContent = "");
    showPanel("login");
  });

  // Check URL hash or query on load for direct link to register tab
  const hash = window.location.hash;
  const urlMode = new URLSearchParams(window.location.search).get("mode");
  if (hash === "#register" || hash === "#signup" || urlMode === "register" || urlMode === "signup") {
    showPanel("register");
  }
})();
