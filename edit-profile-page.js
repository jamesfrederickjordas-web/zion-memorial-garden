// =========================================
// EDIT PROFILE PAGE MANAGEMENT
// =========================================

function initEditProfilePage() {
    // Cancel button handler
    const cancelBtn = document.getElementById('editProfileCancelBtn');
    const editProfilePage = document.getElementById('editProfilePage');
    const profileModal = document.querySelector('.profile-modal-overlay');

    if (cancelBtn) {
        cancelBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Close edit profile page
            if (editProfilePage) {
                editProfilePage.classList.remove('active');
            }
            // Reopen profile modal
            if (profileModal) {
                profileModal.classList.add('active');
            }
        });
    }

    // Form submit handler - PostgreSQL Backend version
    const editProfileForm = document.getElementById('editProfilePageForm');
    if (editProfileForm) {
        editProfileForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const updateData = {
                fullName: document.getElementById('editProfileFullName').value,
                username: document.getElementById('editProfileUsername').value,
                phone: document.getElementById('editProfilePhone').value,
                profilePicture: localStorage.getItem('userProfilePicture') || ''
            };
            
            try {
                const token = sessionStorage.getItem('authToken');
                const response = await fetch('http://localhost:5000/update-profile', {
                    method: 'PUT',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(updateData)
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
                    userProfile.fullName = data.user.full_name;
                    userProfile.username = data.user.username;
                    userProfile.phone = data.user.phone;
                    userProfile.lastUpdated = new Date(data.user.updated_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
                    
                    localStorage.setItem('userProfile', JSON.stringify(userProfile));
                    
                    updateProfileDisplay(userProfile);
                    updateHeaderProfilePicture(updateData.profilePicture);
                    
                    if (editProfilePage) {
                        editProfilePage.classList.remove('active');
                    }
                    
                    if (profileModal) {
                        profileModal.classList.add('active');
                    }
                    
                    alert('Profile updated successfully!');
                } else {
                    alert(data.error || "Failed to update profile");
                }
            } catch (error) {
                alert("Could not connect to the server.");
            }
        });
    }
    
    // Use the global updater (falls back to a local version if not yet loaded)
    function updateHeaderProfilePicture(pictureUrl) {
        if (typeof window.updateAllProfilePictures === 'function') {
            window.updateAllProfilePictures(pictureUrl);
            return;
        }
        // Fallback if global function is not ready
        if (!pictureUrl) return;
        const selectors = [
            '.user-btn img',
            '#profileUserBtn img',
            '#editProfileUserBtn img',
            '#editProfilePicturePreview',
            '#reservationUserBtn img',
            '#myReservationUserBtn img',
            '#deceasedFamilyUserBtn img',
            '#profilePicture'
        ];
        selectors.forEach(sel => {
            document.querySelectorAll(sel).forEach(img => {
                if (img) img.src = pictureUrl;
            });
        });
    }
    
    // Function to update profile display with new data
    function updateProfileDisplay(userData) {
        const fullNameEl = document.getElementById('profileFullName');
        const usernameEl = document.getElementById('profileUsername');
        const emailEl = document.getElementById('profileEmail');
        const phoneEl = document.getElementById('profilePhone');
        const displayNameEl = document.getElementById('profileDisplayName');
        const usernameDisplayEl = document.getElementById('profileUsernameDisplay');
        
        if (fullNameEl) fullNameEl.textContent = userData.fullName || '-';
        if (usernameEl) usernameEl.textContent = userData.username || '-';
        if (emailEl) emailEl.textContent = userData.email || '-';
        if (phoneEl) phoneEl.textContent = userData.phone || '-';
        if (displayNameEl) displayNameEl.textContent = (userData.fullName || 'User').toUpperCase();
        if (usernameDisplayEl) usernameDisplayEl.textContent = userData.username || '';
        
        const memberSinceEl = document.getElementById('profileMemberSince');
        const lastUpdatedEl = document.getElementById('profileLastUpdated');
        
        if (memberSinceEl && userData.createdAt) {
            const createdDate = new Date(userData.createdAt);
            memberSinceEl.textContent = createdDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        }
        
        if (lastUpdatedEl && userData.lastUpdated) {
            lastUpdatedEl.textContent = userData.lastUpdated;
        }
        
        const profilePicture = document.getElementById('profilePicture');
        if (profilePicture && userData.profilePicture) {
            profilePicture.src = userData.profilePicture;
        }
    }

    // Profile picture change handler
    const changePicBtn = document.getElementById('editProfileChangePicBtn');
    const pictureInput = document.getElementById('editProfilePictureInput');
    const picturePreview = document.getElementById('editProfilePicturePreview');

    if (changePicBtn && pictureInput) {
        changePicBtn.addEventListener('click', () => {
            pictureInput.click();
        });

        pictureInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                if (file.size > 2 * 1024 * 1024) {
                    alert('File size must be less than 2MB');
                    return;
                }

                if (!file.type.match('image.*')) {
                    alert('Please select an image file');
                    return;
                }

                const reader = new FileReader();
                reader.onload = (event) => {
                    const imageData = event.target.result;

                    // Save the picture for the current user
                    localStorage.setItem('userProfilePicture', imageData);

                    // Also save it inside the userProfile object so it stays with this account
                    const savedProfile = localStorage.getItem('userProfile');
                    if (savedProfile) {
                        try {
                            const profile = JSON.parse(savedProfile);
                            profile.profilePicture = imageData;
                            localStorage.setItem('userProfile', JSON.stringify(profile));
                        } catch (e) {}
                    }

                    // Update the preview on this page
                    if (picturePreview) {
                        picturePreview.src = imageData;
                    }

                    // Update EVERY avatar across the whole app right away
                    updateHeaderProfilePicture(imageData);
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Load existing profile data into form
    function loadProfileDataIntoForm() {
        const savedProfile = localStorage.getItem('userProfile');
        if (savedProfile) {
            try {
                const profile = JSON.parse(savedProfile);
                
                const fullNameInput = document.getElementById('editProfileFullName');
                const emailInput = document.getElementById('editProfileEmail');
                const usernameInput = document.getElementById('editProfileUsername');
                const phoneInput = document.getElementById('editProfilePhone');
                
                if (fullNameInput && profile.fullName) fullNameInput.value = profile.fullName;
                if (emailInput && profile.email) emailInput.value = profile.email;
                if (usernameInput && profile.username) usernameInput.value = profile.username;
                if (phoneInput && profile.phone) phoneInput.value = profile.phone;
                
                const savedPicture = localStorage.getItem('userProfilePicture');
                if (savedPicture && picturePreview) {
                    picturePreview.src = savedPicture;
                }
            } catch (e) {
                console.error('Error loading profile data into form:', e);
            }
        }
    }

    if (editProfilePage) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    if (editProfilePage.classList.contains('active')) {
                        loadProfileDataIntoForm();
                    }
                }
            });
        });
        
        observer.observe(editProfilePage, { attributes: true });
    }
}

// =========================================
// PROFILE MODAL DISPLAY & MANAGEMENT (EVENT DELEGATION)
// =========================================

function initProfileModal() {
    function loadProfileData() {
        const savedUser = localStorage.getItem("userProfile");
        if (savedUser) {
            try {
                const userData = JSON.parse(savedUser);
                
                const fullNameEl = document.getElementById("profileFullName");
                const usernameEl = document.getElementById("profileUsername");
                const emailEl = document.getElementById("profileEmail");
                const phoneEl = document.getElementById("profilePhone");
                const displayNameEl = document.getElementById("profileDisplayName");
                const usernameDisplayEl = document.getElementById("profileUsernameDisplay");
                const profileImgElement = document.getElementById("profilePicture");

                if (fullNameEl) fullNameEl.textContent = userData.fullName || "-";
                if (usernameEl) usernameEl.textContent = userData.username ? "@" + userData.username.replace('@','') : "-";
                if (emailEl) emailEl.textContent = userData.email || "-";
                if (phoneEl) phoneEl.textContent = userData.phone || "-";
                if (displayNameEl) displayNameEl.textContent = userData.fullName || "User";
                if (usernameDisplayEl) usernameDisplayEl.textContent = userData.username ? "@" + userData.username.replace('@','') : "";

                const profilePic = userData.profilePicture || localStorage.getItem("userProfilePicture");
                if (profilePic && profileImgElement) {
                    profileImgElement.src = profilePic;
                }
            } catch (e) {
                console.error("Error loading user profile data:", e);
            }
        }
    }

    document.addEventListener('click', (e) => {
        const profileModal = document.getElementById("profileModal");

        const userBtn = e.target.closest('#profileUserBtn');
        if (userBtn) {
            e.stopPropagation();
            loadProfileData();
            if (profileModal) {
                profileModal.style.display = "flex";
            }
            return;
        }

        const backBtn = e.target.closest('#backToDashboard');
        if (backBtn) {
            e.preventDefault();
            if (profileModal) {
                profileModal.style.display = "none";
            }
            return;
        }

        const menuBtn = e.target.closest('#profileMenuBtn, .profile-menu-btn');
        if (menuBtn) {
            e.stopPropagation();
            const navMenu = document.querySelector('.nav-menu, .sidebar, .dropdown-menu, .profile-nav');
            if (navMenu) {
                navMenu.classList.toggle('active');
            }
            return;
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initProfileModal();
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initProfileModal };
}