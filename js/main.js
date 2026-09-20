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

// ====================== VERY STRONG PASSWORD TOGGLE ======================
document.addEventListener('click', function (e) {
    // If the clicked element looks like an eye icon
    const isEye = e.target.closest('i, span, button, img, svg, div') && 
                  (e.target.className.toLowerCase().includes('eye') || 
                   e.target.parentElement?.className.toLowerCase().includes('eye') ||
                   e.target.getAttribute('aria-label')?.toLowerCase().includes('password'));

    if (!isEye && !e.target.closest('[class*="eye"]')) return;

    e.preventDefault();
    e.stopPropagation();

    // Find the closest password input
    let input = e.target.closest('div, form, .form-group, .input-group')?.querySelector('input[type="password"], input[type="text"]');

    // Fallback: search common password fields
    if (!input) {
        input = document.getElementById('loginPassword') || 
                document.getElementById('regPassword') || 
                document.getElementById('regConfirmPassword');
    }

    if (input) {
        input.type = input.type === 'password' ? 'text' : 'password';
    }
});
