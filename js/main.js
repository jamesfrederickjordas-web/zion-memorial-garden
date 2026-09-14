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

// ====================== GLOBAL PASSWORD SHOW/HIDE ======================
document.addEventListener('click', function (e) {
    const eye = e.target.closest('.login-eye-icon, .register-eye-icon, .toggle-password, .eye-icon, [class*="eye"]');
    
    if (!eye) return;

    e.preventDefault();
    e.stopPropagation();

    // Find the password input near the eye icon
    let input = null;

    // Try different common structures
    const container = eye.closest('.password-field, .input-group, .form-group, .input-wrapper, .form-control, .password-wrapper');
    
    if (container) {
        input = container.querySelector('input[type="password"], input[type="text"]');
    }

    // Fallback methods
    if (!input) {
        input = eye.previousElementSibling;
    }
    if (!input || input.tagName !== 'INPUT') {
        input = eye.parentElement?.querySelector('input');
    }

    if (input && (input.type === 'password' || input.type === 'text')) {
        if (input.type === 'password') {
            input.type = 'text';
            eye.classList.add('active');
        } else {
            input.type = 'password';
            eye.classList.remove('active');
        }
    }
});
