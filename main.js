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