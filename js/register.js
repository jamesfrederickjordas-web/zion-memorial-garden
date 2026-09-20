// =========================================
// REGISTRATION FUNCTIONALITY
// =========================================

function initRegister() {
    const registerModal = document.getElementById("registerModal");
    const registerBtn = document.getElementById("registerBtn");
    const registerClose = document.querySelector(".register-close");
    const switchToLogin = document.getElementById("switchToLogin");

    // Open Register
    if (registerBtn) {
        registerBtn.onclick = (e) => {
            e.preventDefault();
            if (registerModal) registerModal.style.display = "flex";
            const loginModal = document.getElementById("loginModal");
            if (loginModal) loginModal.style.display = "none";
        };
    }

    // Close register
    if (registerClose) {
        registerClose.onclick = () => {
            if (registerModal) registerModal.style.display = "none";
        };
    }

    // Switch to login
    if (switchToLogin) {
        switchToLogin.addEventListener('click', (e) => {
            e.preventDefault();
            if (registerModal) {
                registerModal.style.display = "none";
            }
            
            setTimeout(() => {
                const loginBtn = document.getElementById("loginBtn");
                if (loginBtn) {
                    loginBtn.click();
                }
            }, 100);
        });
    }

    // Close when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === registerModal) {
            registerModal.style.display = "none";
        }
    });

    // ====================== PASSWORD TOGGLE ======================
    // Support multiple eyes in register form
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('register-eye-icon') || 
            e.target.classList.contains('toggle-password') ||
            e.target.closest('.register-eye-icon') ||
            e.target.closest('.toggle-password')) {

            const allEyes = document.querySelectorAll('.register-eye-icon, .toggle-password');
            const clickedEye = e.target.closest('.register-eye-icon, .toggle-password') || e.target;
            const index = Array.from(allEyes).indexOf(clickedEye);

            let input;
            if (index === 0) {
                input = document.getElementById("regPassword");
            } else {
                input = document.getElementById("regConfirmPassword");
            }

            if (input) {
                input.type = input.type === 'password' ? 'text' : 'password';
            }
        }
    });

    // Phone number validation - only numbers, max 11 digits
    const phoneInput = document.getElementById("regPhone");
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) {
                value = value.slice(0, 11);
            }
            e.target.value = value;
        });
    }

    // Handle registration form submission
    const registerForm = document.getElementById("newRegisterForm");
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = {
                fullName: document.getElementById("regFullName").value.trim(),
                username: document.getElementById("regUsername").value.trim(),
                email: document.getElementById("regEmail").value.trim(),
                phone: document.getElementById("regPhone").value.trim(),
                password: document.getElementById("regPassword").value,
                confirmPassword: document.getElementById("regConfirmPassword").value
            };

            // ===== VALIDATIONS =====
            if (!formData.fullName) {
                alert("Please enter your Full Name");
                return;
            }
            if (!formData.username) {
                alert("Please enter a Username");
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!formData.email || !emailRegex.test(formData.email)) {
                alert("Please enter a valid Email Address (must contain @)");
                return;
            }

            if (!formData.phone || !/^09\d{9}$/.test(formData.phone)) {
                alert("Phone number must start with 09 and be exactly 11 digits");
                return;
            }

            if (!formData.password || formData.password.length < 8) {
                alert("Password must be at least 8 characters long");
                return;
            }
            if (!/[0-9]/.test(formData.password)) {
                alert("Password must contain at least 1 number");
                return;
            }
            if (!/[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\;'/`~]/.test(formData.password)) {
                alert("Password must contain at least 1 special character");
                return;
            }

            if (formData.password !== formData.confirmPassword) {
                alert("Passwords do not match!");
                return;
            }

            try {
                const response = await fetch('/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    alert("Registration successful! Please check your email to verify your account before logging in.");
                    if (registerModal) registerModal.style.display = "none";
                    const loginBtn = document.getElementById("loginBtn");
                    if (loginBtn) loginBtn.click();
                } else {
                    alert(data.error || "Registration failed");
                }
            } catch (error) {
                alert("Could not connect to the server.");
            }
        });
    }
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
    initRegister();
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initRegister };
}
