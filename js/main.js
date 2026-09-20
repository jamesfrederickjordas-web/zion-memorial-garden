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

// ====================== PASSWORD SHOW / HIDE - FIXED FOR ALL ======================
document.addEventListener('click', function(e) {
    const eye = e.target.closest('.login-eye-icon, .register-eye-icon, .toggle-password, [class*="eye"]');
    
    if (!eye) return;

    e.preventDefault();
    e.stopPropagation();

    // Find the closest input
    let input = null;

    // Method 1: Look inside the same parent wrapper
    const wrapper = eye.closest('.password-input-wrapper, .input-group, .form-group, .password-field');
    if (wrapper) {
        input = wrapper.querySelector('input[type="password"], input[type="text"]');
    }

    // Method 2: Use common IDs based on which eye was clicked
    if (!input) {
        if (eye.classList.contains('login-eye-icon')) {
            input = document.getElementById('loginPassword');
        } else {
            // For register
            const allEyes = Array.from(document.querySelectorAll('.register-eye-icon, .toggle-password'));
            const index = allEyes.indexOf(eye);

            if (index === 0) {
                input = document.getElementById('regPassword');
            } else {
                input = document.getElementById('regConfirmPassword');
            }
        }
    }

    // Method 3: Final fallback
    if (!input) {
        input = document.getElementById('loginPassword') || 
                document.getElementById('regPassword') || 
                document.getElementById('regConfirmPassword');
    }

    if (input) {
        if (input.type === 'password') {
            input.type = 'text';
            eye.style.opacity = '0.5';
        } else {
            input.type = 'password';
            eye.style.opacity = '1';
        }
    }
});
