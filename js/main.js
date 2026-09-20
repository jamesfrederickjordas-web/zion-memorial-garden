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

// ====================== SIMPLE PASSWORD TOGGLE ======================
document.addEventListener('click', function(e) {
    // Login eye
    if (e.target.classList.contains('login-eye-icon') || e.target.closest('.login-eye-icon')) {
        const passwordInput = document.getElementById('loginPassword');
        if (passwordInput) {
            passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
        }
        return;
    }

    // Register eyes
    if (e.target.classList.contains('register-eye-icon') || 
        e.target.classList.contains('toggle-password') || 
        e.target.closest('.register-eye-icon') || 
        e.target.closest('.toggle-password')) {
        
        const wrapper = e.target.closest('.password-input-wrapper, .input-group, .form-group');
        let input = null;

        if (wrapper) {
            input = wrapper.querySelector('input');
        }

        if (!input) {
            const allEyes = document.querySelectorAll('.register-eye-icon, .toggle-password');
            const clickedEye = e.target.closest('.register-eye-icon, .toggle-password') || e.target;
            const index = Array.from(allEyes).indexOf(clickedEye);

            if (index === 0) {
                input = document.getElementById('regPassword');
            } else {
                input = document.getElementById('regConfirmPassword');
            }
        }

        if (input) {
            input.type = input.type === 'password' ? 'text' : 'password';
        }
    }
});
