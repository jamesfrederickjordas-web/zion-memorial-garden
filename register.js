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

        phoneInput.addEventListener('keypress', (e) => {
            if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab') {
                e.preventDefault();
                alert("Numbers only! Please enter digits 0-9");
            }
        });
    }

    // Handle registration form submission - Backend version
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

            // Full Name
            if (!formData.fullName) {
                alert("Please enter your Full Name");
                return;
            }

            // Username
            if (!formData.username) {
                alert("Please enter a Username");
                return;
            }

            // Email - must contain @ and be a valid format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!formData.email) {
                alert("Please enter your Email Address");
                return;
            }
            if (!emailRegex.test(formData.email)) {
                alert("Please enter a valid Email Address (must contain @)");
                return;
            }

            // Phone - must start with 09 and be exactly 11 digits
            if (!formData.phone) {
                alert("Please enter your Phone Number");
                return;
            }
            if (!/^09\d{9}$/.test(formData.phone)) {
                alert("Phone number must start with 09 and be exactly 11 digits (example: 09123456789)");
                return;
            }

            // Password - at least 8 characters, 1 number, 1 special character
            if (!formData.password) {
                alert("Please enter a Password");
                return;
            }
            if (formData.password.length < 8) {
                alert("Password must be at least 8 characters long");
                return;
            }
            if (!/[0-9]/.test(formData.password)) {
                alert("Password must contain at least 1 number");
                return;
            }
            if (!/[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\;'/`~]/.test(formData.password)) {
                alert("Password must contain at least 1 special character (example: ! @ # $ %)");
                return;
            }

            // Confirm Password
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
                    alert("Registration successful! You can now log in.");
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

    // Toggle password visibility for both password fields
    const toggleIcons = document.querySelectorAll('.toggle-password');
    toggleIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            if (input) {
                if (input.type === 'password') {
                    input.type = 'text';
                } else {
                    input.type = 'password';
                }
            }
        });
    });
}

// Export for use in main.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initRegister };
}
