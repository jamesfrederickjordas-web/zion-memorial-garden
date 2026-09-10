// =========================================
// LOGIN FUNCTIONALITY
// =========================================

function initLogin() {
    console.log("initLogin() called");
    
    // Use event delegation on document to catch clicks regardless of timing
    document.addEventListener('click', function(e) {
        // Check if the clicked element is the login button
        if (e.target && (e.target.id === 'loginBtn' || e.target.closest('#loginBtn'))) {
            e.preventDefault();
            console.log("Login button clicked via delegation!");
            const loginModal = document.getElementById("loginModal");
            const registerModal = document.getElementById("registerModal");
            
            if (loginModal) {
                loginModal.style.display = "block";
                console.log("Login modal opened");
            } else {
                console.error("Login modal not found!");
            }
            
            if (registerModal) {
                registerModal.style.display = "none";
            }
            return;
        }
        
        // Check if close button was clicked
        if (e.target && e.target.classList.contains('login-close')) {
            const loginModal = document.getElementById("loginModal");
            if (loginModal) loginModal.style.display = "none";
            return;
        }
        
        // Check if clicked outside modal
        const loginModal = document.getElementById("loginModal");
        if (e.target === loginModal) {
            loginModal.style.display = "none";
            return;
        }
        
        // Check if "Register now" link was clicked
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
    
    const loginForm = document.getElementById("loginForm");
    const loginBtn = document.getElementById("loginBtn");
    const loginModal = document.getElementById("loginModal");
    
    console.log("Login elements check - Button:", !!loginBtn, "Modal:", !!loginModal, "Form:", !!loginForm);
    
    // Toggle password visibility - ONE listener only, same as register
    setTimeout(() => {
        const toggleIcons = document.querySelectorAll('.login-eye-icon.toggle-password');
        console.log("Found", toggleIcons.length, "toggle icons");
        toggleIcons.forEach(icon => {
            icon.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const input = this.parentElement.querySelector('input');
                if (input) {
                    if (input.type === 'password') {
                        input.type = 'text';
                        console.log("Password now visible");
                    } else {
                        input.type = 'password';
                        console.log("Password now hidden");
                    }
                }
            });
        });
    }, 200);
    
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById("loginEmail").value;
            const password = document.getElementById("loginPassword").value;
            const rememberMe = document.getElementById("rememberMe").checked;

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
                        lastUpdated: data.user.updated_at ? new Date(data.user.updated_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Today',
                        isVerified: false
                    };
                    
                    localStorage.setItem("userProfile", JSON.stringify(userProfile));

                    // IMPORTANT: Always set the picture for THIS user.
                    // If the account has no picture yet → clear the old one so a new account starts blank.
                    if (userProfile.profilePicture) {
                        localStorage.setItem("userProfilePicture", userProfile.profilePicture);
                    } else {
                        localStorage.removeItem("userProfilePicture"); // new account = blank profile
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

// Export or initialize
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initLogin };
}
