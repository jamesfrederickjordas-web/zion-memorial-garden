// =========================================
// LOGIN FUNCTIONALITY
// =========================================

function initLogin() {
    console.log("initLogin() called");

    // Open Login Modal
    document.addEventListener('click', function(e) {
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
            return;
        }

        // Close button
        if (e.target && e.target.classList.contains('login-close')) {
            const loginModal = document.getElementById("loginModal");
            if (loginModal) loginModal.style.display = "none";
            return;
        }

        // Click outside
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
    const loginEyeIcon = document.querySelector(".login-eye-icon");
    if (loginEyeIcon) {
        loginEyeIcon.addEventListener('click', function() {
            const passwordInput = document.getElementById("loginPassword");
            if (passwordInput) {
                passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
            }
        });
    }

    // Also support click on the image itself
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('login-eye-icon') || e.target.closest('.login-eye-icon')) {
            const passwordInput = document.getElementById("loginPassword");
            if (passwordInput) {
                passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
            }
        }
    });

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

                    // Default profile picture
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

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initLogin };
}
