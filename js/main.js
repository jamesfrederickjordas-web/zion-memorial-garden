// =========================================
// MAIN APPLICATION ENTRY POINT
// =========================================

document.addEventListener("DOMContentLoaded", () => {
    console.log("Zion Memorial Garden - Application Loaded");

    // Initialize global modules if their functions exist
    if (typeof initLogin === 'function') {
        initLogin();
    }
    if (typeof initRegister === 'function') {
        initRegister();
    }
    if (typeof initProfileModal === 'function') {
        initProfileModal();
    }

    // Handle remembered email on login form if present
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
        const emailInput = document.getElementById("loginEmail");
        const rememberCheckbox = document.getElementById("rememberMe");
        
        if (emailInput) emailInput.value = rememberedEmail;
        if (rememberCheckbox) rememberCheckbox.checked = true;
    }
});

// ====================== STRONGER PASSWORD SHOW/HIDE ======================
document.addEventListener('click', function (e) {
    // Check if clicked element is an eye icon
    if (e.target.classList.contains('login-eye-icon') || 
        e.target.classList.contains('register-eye-icon') || 
        e.target.classList.contains('toggle-password') ||
        e.target.classList.contains('eye-icon') ||
        e.target.closest('[class*="eye"]')) {

        e.preventDefault();
        e.stopPropagation();

        // Login password
        const loginPassword = document.getElementById('loginPassword');
        if (loginPassword) {
            if (loginPassword.type === 'password') {
                loginPassword.type = 'text';
            } else {
                loginPassword.type = 'password';
            }
        }

        // Register password
        const regPassword = document.getElementById('regPassword');
        if (regPassword) {
            if (regPassword.type === 'password') {
                regPassword.type = 'text';
            } else {
                regPassword.type = 'password';
            }
        }

        // Confirm password
        const regConfirmPassword = document.getElementById('regConfirmPassword');
        if (regConfirmPassword) {
            if (regConfirmPassword.type === 'password') {
                regConfirmPassword.type = 'text';
            } else {
                regConfirmPassword.type = 'password';
            }
        }
    }
});
