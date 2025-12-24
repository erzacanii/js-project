document.addEventListener("DOMContentLoaded", () => {

  const allowedDomains = ["gmail.com", "outlook.com", "yahoo.com"];

  function isValidEmail(email) {
    const parts = email.split("@");
    return parts.length === 2 && allowedDomains.includes(parts[1].toLowerCase());
  }

  function isValidPassword(pw) {
    return /^(?=.*[A-Za-z])(?=.*\d).{6,}$/.test(pw);
  }

  function handleEnter(currentInput, nextInput, isValid) {
    currentInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (isValid()) {
          nextInput.disabled = false;
          nextInput.focus();
        }
      }
    });
  }

  // ================= REGISTER =================
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const confirmInput = document.getElementById("confirmPassword");
    const submitBtn = registerForm.querySelector("button");

    const nameError = document.getElementById("nameError");
    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");
    const confirmError = document.getElementById("confirmError");

    emailInput.disabled = true;
    passwordInput.disabled = true;
    confirmInput.disabled = true;
    submitBtn.disabled = true;

    handleEnter(nameInput, emailInput, () => nameInput.value.trim() !== "");
    handleEnter(emailInput, passwordInput, () => isValidEmail(emailInput.value.trim()));
    handleEnter(passwordInput, confirmInput, () => isValidPassword(passwordInput.value));

    nameInput.addEventListener("input", () => {
      emailInput.disabled = nameInput.value.trim() === "";
    });

    emailInput.addEventListener("input", () => {
      if (isValidEmail(emailInput.value.trim())) {
        emailError.classList.add("hidden");
        passwordInput.disabled = false;
      } else {
        emailError.classList.remove("hidden");
        passwordInput.disabled = true;
      }
    });

    function checkPassword() {
      const pw = passwordInput.value;
      const cpw = confirmInput.value;

      passwordError.classList.toggle("hidden", isValidPassword(pw));
      confirmError.classList.toggle("hidden", pw === cpw);

      submitBtn.disabled = !(isValidPassword(pw) && pw === cpw);
    }

    passwordInput.addEventListener("input", checkPassword);
    confirmInput.addEventListener("input", checkPassword);

    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const users = JSON.parse(localStorage.getItem("users") || "[]");
      if (users.find(u => u.email === emailInput.value)) {
        alert("Email already registered!");
        return;
      }

      const newUser = {
        name: nameInput.value,
        email: emailInput.value,
        password: passwordInput.value
      };

      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("currentUser", JSON.stringify(newUser));

      window.location.href = "index.html";
    });
  }

  // ================= LOGIN =================
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = document.getElementById("loginEmail").value;
      const password = document.getElementById("loginPassword").value;

      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const user = users.find(u => u.email === email && u.password === password);

      if (!user) {
        alert("Invalid email or password!");
        return;
      }

      localStorage.setItem("currentUser", JSON.stringify(user));
      window.location.href = "index.html";
    });
  }

  // ================= HEADER =================
  function updateHeader() {
    const user = JSON.parse(localStorage.getItem("currentUser"));

    const nameDesktop = document.getElementById("userNameDesktop");
    const authDesktop = document.getElementById("authLinksDesktop");

    if (user) {
      nameDesktop.classList.remove("hidden");
      nameDesktop.textContent = user.name;
      authDesktop.classList.add("hidden");
    } else {
      nameDesktop.classList.add("hidden");
      authDesktop.classList.remove("hidden");
    }
  }

  updateHeader();
});
