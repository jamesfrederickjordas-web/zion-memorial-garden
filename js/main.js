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

// ====================== PASSWORD SHOW / HIDE (FIXED) ======================
document.addEventListener('click', function (e) {
    const eye = e.target.closest('.login-eye-icon, .toggle-password, .register-eye-icon');

    if (!eye) return;

    e.preventDefault();
    e.stopPropagation();

    // Find the closest password-input-wrapper
    const wrapper = eye.closest('.password-input-wrapper');
    if (!wrapper) return;

    const input = wrapper.querySelector('input');

    if (input) {
        if (input.type === 'password') {
            input.type = 'text';
            eye.style.opacity = '0.6';
        } else {
            input.type = 'password';
            eye.style.opacity = '1';
        }
    }
});
