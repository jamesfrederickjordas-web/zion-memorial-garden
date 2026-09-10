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
            if (editProfilePage) {
                editProfilePage.classList.remove('active');
            }
            if (profileModal) {
                profileModal.classList.add('active');
            }
        });
    }

    // Form submit handler
    const editProfileForm = document.getElementById('editProfilePageForm');
    if (editProfileForm) {
        editProfileForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const updateData = {
                fullName: document.getElementById('editProfileFullName').value,
                username: document.getElementById('editProfileUsername').value,
                phone: document.getElementById('editProfilePhone').value,
                profilePicture: localStorage.getItem('userProfilePicture') || 'Polkadot.jpg'
            };
            
            try {
                const token = sessionStorage.getItem('authToken');
                const response = await fetch('/update-profile', {   // ← relative path (important)
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
                    userProfile.profilePicture = data.user.profile_picture || updateData.profilePicture;
                    userProfile.lastUpdated = new Date(data.user.updated_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
                    
                    localStorage.setItem('userProfile', JSON.stringify(userProfile));
                    localStorage.setItem('userProfilePicture', userProfile.profilePicture);
                    
                    // Update all pictures on the page
                    if (typeof window.updateAllProfilePictures === 'function') {
                        window.updateAllProfilePictures(userProfile.profilePicture);
                    }
                    
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
                console.error("Update profile error:", error);
                alert("Could not connect to the server.");
            }
        });
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

                    // Save the picture
                    localStorage.setItem('userProfilePicture', imageData);

                    // Also update inside userProfile
                    const savedProfile = localStorage.getItem('userProfile');
                    if (savedProfile) {
                        try {
                            const profile = JSON.parse(savedProfile);
                            profile.profilePicture = imageData;
                            localStorage.setItem('userProfile', JSON.stringify(profile));
                        } catch (e) {}
                    }

                    // Update preview
                    if (picturePreview) {
                        picturePreview.src = imageData;
                    }

                    // Update all avatars immediately
                    if (typeof window.updateAllProfilePictures === 'function') {
                        window.updateAllProfilePictures(imageData);
                    }
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
                
                const savedPicture = localStorage.getItem('userProfilePicture') || 'Polkadot.jpg';
                if (picturePreview) {
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

// Initialize when the page loads
document.addEventListener("DOMContentLoaded", () => {
    initEditProfilePage();
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initEditProfilePage };
}
