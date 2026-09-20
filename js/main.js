// =========================================
// MAIN APPLICATION ENTRY POINT
// =========================================

document.addEventListener("DOMContentLoaded", () => {
    console.log("Zion Memorial Garden - Application Loaded");

    if (typeof initLogin === 'function') {
        initLogin();
    }
    if (typeof initRegister === 'function') {
        initRegister();
    }
    if (typeof initProfileModal === 'function') {
        initProfileModal();
    }

    // Remembered email
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
        const emailInput = document.getElementById("loginEmail");
        const rememberCheckbox = document.getElementById("rememberMe");
        
        if (emailInput) emailInput.value = rememberedEmail;
        if (rememberCheckbox) rememberCheckbox.checked = true;
    }

    // Setup password toggles
    setupPasswordToggles();
});

// ====================== PASSWORD SHOW / HIDE ======================
function setupPasswordToggles() {
    // Login eye
    const loginEye = document.querySelector(".login-eye-icon");
    if (loginEye) {
        loginEye.onclick = function () {
            const passwordInput = document.getElementById("loginPassword");
            if (passwordInput) {
                passwordInput.type = passwordInput.type === "password" ? "text" : "password";
            }
        };
    }

    // Register eyes
    const registerEyes = document.querySelectorAll(".register-eye-icon, .toggle-password");
    registerEyes.forEach((eye, index) => {
        eye.onclick = function () {
            // Try common IDs
            let input = document.getElementById("regPassword") || 
                        document.getElementById("regConfirmPassword");

            // If there are two eyes, first one is password, second is confirm
            if (registerEyes.length >= 2) {
                input = index === 0 
                    ? document.getElementById("regPassword") 
                    : document.getElementById("regConfirmPassword");
            }

            if (input) {
                input.type = input.type === "password" ? "text" : "password";
            }
        };
    });
}

// Run again after delays (because modals load later)
setTimeout(setupPasswordToggles, 500);
setTimeout(setupPasswordToggles, 1200);
setTimeout(setupPasswordToggles, 2000);
