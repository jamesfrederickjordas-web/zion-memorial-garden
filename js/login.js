// =========================================
// LOGIN FUNCTIONALITY
// =========================================

function initLogin() {
    console.log("initLogin() called");

    // Use event delegation for opening the login modal
    document.addEventListener('click', function(e) {
        // Open Login Modal
        if (e.target && (e.target.id === 'loginBtn' || e.target.closest('#loginBtn'))) {
            e.preventDefault();
            const loginModal = document.getElementById("loginModal");
            const registerModal = document.getElementById("registerModal");

            if (loginModal) {
                loginModal.style.display = "block";
            }
            if (registerModal) {
                registerModal.style.display = "none";
            }
            // Setup password toggle when modal opens
            setTimeout(setupPasswordToggle, 100);
            return;
        }

        // Close button
        if (e.target && e.target.classList.contains('login-close')) {
            const loginModal = document.getElementById("loginModal");
            if (loginModal) loginModal.style.display = "none";
            return;
        }

        // Click outside modal
        const loginModal = document.getElementById("loginModal");
        if (e.target === loginModal) {
            loginModal.style.display = "none";
            return;
        }

        // Switch to Register
        if (e.target && e.target.id === 'showRegisterLink') {
            e.preventDefault();
            const loginModal = document.getElementById("loginModal");
            if (loginModal) loginModal.style.display = "none";

            setTimeout(() => {
                const registerBtn = document.getElementById("registerBtn");
                if (registerBtn) registerBtn.click();
            }, 100);
            return;
        }
    });

    // ====================== PASSWORD TOGGLE ======================
    function setupPasswordToggle() {
        const toggleIcons = document.querySelectorAll('.login-eye-icon, .toggle-password, .eye-icon, [class*="eye"]');

        toggleIcons.forEach(icon => {
            // Prevent multiple listeners
            if (icon.dataset.toggleReady) return;
            icon.dataset.toggleReady = "true";

            icon.style.cursor = "pointer";

            icon.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();

                // Find the password input
                let input = null;

                // Try different ways to find the input
                if (this.closest('.password-field')) {
                    input = this.closest('.password-field').querySelector('input');
                } else if (this.closest('.input-group')) {
                    input = this.closest('.input-group').querySelector('input');
                } else if (this.closest('.form-group')) {
                    input = this.closest('.form-group').querySelector('input');
                } else if (this.parentElement) {
                    input = this.parentElement.querySelector('input');
                }

                if (input) {
                    if (input.type === 'password') {
                        input.type = 'text';
                        this.classList.add('active');
                        // Optional: change icon if you have different images
                    } else {
                        input.type = 'password';
                        this.classList.remove('active');
                    }
                }
            });
        });
    }

    // Run the toggle setup
    setTimeout(setupPasswordToggle, 300);
    setTimeout(setupPasswordToggle, 800);

    // ====================== LOGIN FORM ======================
    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById("loginEmail").value.trim();
            const password = document.getElementById("loginPassword").value;
            const rememberMe = document.getElementById("rememberMe") ? document.getElementById("rememberMe").checked : false;

            if (!email || !password) {
                alert("Please fill in all fields");
                return;
            }

            try {
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    sessionStorage.clear();

                    sessionStorage.setItem("authToken", data.token);
                    sessionStorage.setItem("isLoggedIn", "true");
                    sessionStorage.setItem("userEmail", email);

                    if (rememberMe) {
                        localStorage.setItem("rememberedEmail", email);
                    } else {
                        localStorage.removeItem("rememberedEmail");
                    }

                    const userProfile = {
                        id: data.user.id,
                        fullName: data.user.full_name || '',
                        username: data.user.username || '',
                        email: email,
                        phone: data.user.phone || '',
                        profilePicture: data.user.profile_picture || '',
                        createdAt: data.user.created_at,
                        lastUpdated: data.user.updated_at 
                            ? new Date(data.user.updated_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) 
                            : 'Today',
                        isVerified: data.user.is_verified || false
                    };

                    localStorage.setItem("userProfile", JSON.stringify(userProfile));

                    // Set profile picture (Polkadot.jpg as default for new accounts)
                    if (userProfile.profilePicture) {
                        localStorage.setItem("userProfilePicture", userProfile.profilePicture);
                    } else {
                        localStorage.setItem("userProfilePicture", "Polkadot.jpg");
                    }

                    window.location.href = "dashboard.html";
                } else {
                    alert(data.error || "Invalid email or password");
                }
            } catch (error) {
                console.error("Login fetch error:", error);
                alert("Could not connect to the server.");
            }
        });
    }
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
    initLogin();
});

// Also export if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initLogin };
}
