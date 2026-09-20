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
});

// ====================== PASSWORD TOGGLE (CLEAN + INDEPENDENT) ======================
document.addEventListener('click', function(e) {
    const eye = e.target.closest('.login-eye-icon, .register-eye-icon, .toggle-password');
    
    if (!eye) return;

    e.preventDefault();
    e.stopPropagation();

    // ===== LOGIN EYE =====
    if (eye.classList.contains('login-eye-icon')) {
        const input = document.getElementById('loginPassword');
        if (input) {
            input.type = input.type === 'password' ? 'text' : 'password';
        }
        return;
    }

    // ===== REGISTER EYES (INDEPENDENT) =====
    // First try to find the input inside the same wrapper
    const wrapper = eye.closest('.password-input-wrapper, .input-group, .form-group, .password-field');
    
    if (wrapper) {
        const input = wrapper.querySelector('input');
        if (input) {
            input.type = input.type === 'password' ? 'text' : 'password';
        }
        return;
    }

    // Fallback by index
    const allRegisterEyes = Array.from(document.querySelectorAll('.register-eye-icon, .toggle-password'));
    const index = allRegisterEyes.indexOf(eye);

    if (index === 0) {
        const input = document.getElementById('regPassword');
        if (input) input.type = input.type === 'password' ? 'text' : 'password';
    } else if (index === 1) {
        const input = document.getElementById('regConfirmPassword');
        if (input) input.type = input.type === 'password' ? 'text' : 'password';
    }
});
