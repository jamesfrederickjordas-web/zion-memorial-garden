// =========================================

// DASHBOARD COMPONENT LOADER

// Loads dashboard HTML components dynamically

// =========================================



async function loadDashboardComponent(elementId, componentPath) {

    try {

        const response = await fetch(componentPath);

        if (!response.ok) {

            throw new Error(`Failed to load ${componentPath}`);

        }

        const html = await response.text();

        const element = document.getElementById(elementId);

        if (element) {

            element.innerHTML = html;

        }

    } catch (error) {

        console.error('Error loading dashboard component:', error);

    }

}



async function loadAllDashboardComponents() {

    // Load all dashboard components

    await Promise.all([

        loadDashboardComponent('sidebar-component', 'components/dashboard-sidebar.html'),

        loadDashboardComponent('header-component', 'components/dashboard-header.html'),

        loadDashboardComponent('content-component', 'components/dashboard-content.html'),

        loadDashboardComponent('profile-modal-component', 'components/profile-modal.html'),

        loadDashboardComponent('reservation-modal-component', 'components/reservation-modal.html'),

        loadDashboardComponent('edit-profile-page-component', 'components/edit-profile-page.html'),

        loadDashboardComponent('my-reservation-page-component', 'components/my-reservation-content.html'),

        loadDashboardComponent('deceased-family-page-component', 'components/deceased-family-content.html')

    ]);

   

    console.log('All dashboard components loaded successfully');

   

    // Initialize dashboard functionality after components are loaded

    initializeDashboard();

   

    // Initialize edit profile page

    if (typeof initEditProfilePage === 'function') {

        initEditProfilePage();

    }

   

    // Initialize my reservation page

    if (typeof initMyReservationPage === 'function') {

        initMyReservationPage();

    }

   

    // Initialize deceased family page

    if (typeof initDeceasedFamilyPage === 'function') {

        initDeceasedFamilyPage();

    }

}



function initializeDashboard() {

    // =========================================

    // SESSION CHECK - Redirect if not logged in

    // =========================================

    const isLoggedIn = sessionStorage.getItem("isLoggedIn");

   

    if (!isLoggedIn) {

        alert("Please login first");

        window.location.href = "index.html";

        return;

    }



    // =========================================

    // LOGOUT FUNCTIONALITY

    // =========================================

    const signoutBtn = document.querySelector('.signout-btn');

  if (signoutBtn) {

    signoutBtn.addEventListener('click', () => {

        if (confirm("Are you sure you want to sign out?")) {

            sessionStorage.clear();

            localStorage.removeItem("rememberedEmail");
            localStorage.removeItem("rememberedPassword");
            localStorage.removeItem("userProfilePicture"); // clear picture so next account starts clean
            localStorage.removeItem("userProfile");

            window.location.href = "index.html";

        }

    });

}



    // =========================================

    // MENU TOGGLE FUNCTIONALITY

    // =========================================

    const menuBtn = document.querySelector('.menu-btn');

    const userBtn = document.querySelector('.user-btn');

    const sidebarMenu = document.getElementById('sidebarMenu');

    const overlay = document.getElementById('overlay');

    const closeBtn = document.getElementById('closeBtn');



    if (menuBtn && sidebarMenu && overlay) {

        // Open sidebar

        menuBtn.addEventListener('click', () => {

            sidebarMenu.classList.add('active');

            overlay.classList.add('active');

        });

    }



    if (closeBtn && sidebarMenu && overlay) {

        // Close sidebar

        closeBtn.addEventListener('click', () => {

            sidebarMenu.classList.remove('active');

            overlay.classList.remove('active');

        });

    }



    if (overlay && sidebarMenu) {

        // Close sidebar when clicking overlay

        overlay.addEventListener('click', () => {

            sidebarMenu.classList.remove('active');

            overlay.classList.remove('active');

        });

    }



    if (userBtn) {

        userBtn.addEventListener('click', () => {

            openProfileModal();

        });

    }



    // Profile menu item

    const profileMenuItem = document.getElementById('profileMenuItem');

    if (profileMenuItem) {

        profileMenuItem.addEventListener('click', (e) => {

            e.preventDefault();

           

            // Close reservation modal if open

            closeReservationModal();

           

            // Open profile modal

            openProfileModal();

           

            // Update active state

            updateActiveMenuItem('profile');

           

            // Close sidebar after clicking

            if (sidebarMenu && overlay) {

                sidebarMenu.classList.remove('active');

                overlay.classList.remove('active');

            }

        });

    }



    // Dashboard menu item

    const dashboardMenuItem = document.getElementById('dashboardMenuItem');

    if (dashboardMenuItem) {

        dashboardMenuItem.addEventListener('click', (e) => {

            e.preventDefault();

           

            // Close reservation modal if open

            closeReservationModal();

           

            // Close profile modal

            closeProfileModal();

           

            // Update active state

            updateActiveMenuItem('dashboard');

           

            // Close sidebar after clicking

            if (sidebarMenu && overlay) {

                sidebarMenu.classList.remove('active');

                overlay.classList.remove('active');

            }

        });

    }



    // Function to update active menu item

    function updateActiveMenuItem(page) {

        const allMenuItems = document.querySelectorAll('.menu-item');

        allMenuItems.forEach(item => item.classList.remove('active'));

       

        if (page === 'profile' && profileMenuItem) {

            profileMenuItem.classList.add('active');

        } else if (page === 'dashboard' && dashboardMenuItem) {

            dashboardMenuItem.classList.add('active');

        } else if (page === 'reservation') {

            const reservePlotMenuItem = document.getElementById('reservePlotMenuItem');

            if (reservePlotMenuItem) {

                reservePlotMenuItem.classList.add('active');

            }

        }

    }



    // Don't set any initial active state - only activate when clicked



    // =========================================

    // PROFILE MODAL FUNCTIONALITY

    // =========================================

    const profileModal = document.querySelector('.profile-modal-overlay');

    const profileCloseBtn = document.querySelector('.profile-close-btn');

    const backToDashboardBtn = document.getElementById('backToDashboard');

    const profileMenuBtn = document.getElementById('profileMenuBtn');

    const profileUserBtn = document.getElementById('profileUserBtn');



    function openProfileModal() {

        if (profileModal) {

            // Get user data from session

            const userEmail = sessionStorage.getItem("userEmail") || "user@example.com";

           

            // Update profile modal with user data

            const emailField = document.getElementById('profileEmail');

            if (emailField) emailField.textContent = userEmail;

           

            // Load saved profile data

            loadProfilePicture();

           

            // Load profile data with dates

            const savedProfile = localStorage.getItem('userProfile');

            if (savedProfile) {

                try {

                    const profile = JSON.parse(savedProfile);

                   

                    // Update dates

                    const memberSinceEl = document.getElementById('profileMemberSince');

                    const lastUpdatedEl = document.getElementById('profileLastUpdated');

                   

                    if (memberSinceEl && profile.createdAt) {

                        const createdDate = new Date(profile.createdAt);

                        memberSinceEl.textContent = createdDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

                    }

                   

                    if (lastUpdatedEl && profile.lastUpdated) {

                        lastUpdatedEl.textContent = profile.lastUpdated;

                    }

                } catch (e) {

                    console.error('Error loading profile dates:', e);

                }

            } else {

                // If no profile exists, set creation date to now

                const now = new Date();

                const memberSinceEl = document.getElementById('profileMemberSince');

                if (memberSinceEl) {

                    memberSinceEl.textContent = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

                }

            }

           

            profileModal.classList.add('active');

           

            // Update active menu item

            updateActiveMenuItem('profile');

        }

    }



    function closeProfileModal() {

        if (profileModal) {

            profileModal.classList.remove('active');

           

            // Update active menu item

            updateActiveMenuItem('dashboard');

        }

    }



   // =========================================
// GLOBAL PROFILE PICTURE UPDATER
// Updates EVERY user avatar on the page
// =========================================
function updateAllProfilePictures(pictureUrl) {
    const defaultPicture = 'Polkadot.jpg';
    const src = pictureUrl || localStorage.getItem('userProfilePicture') || defaultPicture;

    // All known avatar selectors across the whole app
    const selectors = [
        '#profilePicture',
        '.user-btn img',
        '#profileUserBtn img',
        '#editProfileUserBtn img',
        '#editProfilePicturePreview',
        '#reservationUserBtn img',
        '#myReservationUserBtn img',
        '#deceasedFamilyUserBtn img',
        '#userIconBtn img',
        '.profile-user-btn img',
        '.reservation-user-btn img',
        '.my-reservation-user-btn img',
        '.deceased-family-user-btn img',
        '.edit-profile-user-btn img'
    ];

    selectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(img => {
            if (img) img.src = src;
        });
    });
}

function loadProfilePicture() {
    updateAllProfilePictures();

    // Also load text profile data
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
        try {
            const profile = JSON.parse(savedProfile);
            
            const profileDisplayName = document.getElementById('profileDisplayName');
            const profileUsernameDisplay = document.getElementById('profileUsernameDisplay');
            const profileFullName = document.getElementById('profileFullName');
            const profileUsername = document.getElementById('profileUsername');
            const profileEmail = document.getElementById('profileEmail');
            const profilePhone = document.getElementById('profilePhone');

            if (profileDisplayName && profile.fullName) {
                profileDisplayName.textContent = profile.fullName.toUpperCase();
            }
            if (profileUsernameDisplay && profile.username) {
                profileUsernameDisplay.textContent = profile.username;
            }
            if (profileFullName && profile.fullName) {
                profileFullName.textContent = profile.fullName;
            }
            if (profileUsername && profile.username) {
                profileUsername.textContent = profile.username;
            }
            if (profileEmail && profile.email) {
                profileEmail.textContent = profile.email;
            }
            if (profilePhone && profile.phone) {
                profilePhone.textContent = profile.phone;
            }
        } catch (e) {
            console.error('Error loading profile data:', e);
        }
    }
}

function saveProfilePicture(imageDataUrl) {
    localStorage.setItem('userProfilePicture', imageDataUrl);
    updateAllProfilePictures(imageDataUrl);
}

// Make it available globally so other scripts can call it
window.updateAllProfilePictures = updateAllProfilePictures;
window.loadProfilePicture = loadProfilePicture;
window.saveProfilePicture = saveProfilePicture;



    // Edit Profile button - opens edit profile page

    const editProfileBtn = document.getElementById('editProfileBtn');

    const editProfilePage = document.getElementById('editProfilePage');

   

    if (editProfileBtn && editProfilePage) {

        editProfileBtn.addEventListener('click', () => {

            // Close profile modal

            const profileModal = document.querySelector('.profile-modal-overlay');

            if (profileModal) {

                profileModal.classList.remove('active');

            }

            // Open edit profile page

            editProfilePage.classList.add('active');

        });

    }



    // Load profile picture on page load

    loadProfilePicture();



    // =========================================

    // RESERVATION MODAL FUNCTIONALITY

    // =========================================

    const reservationModal = document.querySelector('.reservation-modal-overlay');

    const reservationMenuBtn = document.getElementById('reservationMenuBtn');

    const reservationUserBtn = document.getElementById('reservationUserBtn');

    const backFromReservation = document.getElementById('backFromReservation');

    const makeReservationBtn = document.getElementById('makeReservationBtn');

    const reservePlotMenuItem = document.getElementById('reservePlotMenuItem');

    const proceedBtn = document.getElementById('proceedBtn');



    // Lawn descriptions

    const lawnDescriptions = {

        'condominium': {

            title: 'Condominium:',

            desc: 'A vertical interment facility featuring stacked, above-ground vaults. This section offers a structured and organized memorial space, utilizing a multi-level grid system for efficient space management and easy identification of individual niches'

        },

        'single-teired': {

            title: 'Single Teired:',

            desc: 'Traditional ground burial plots arranged in a single level. This classic option provides a peaceful resting place with individual grave sites, perfect for families seeking a traditional memorial setting'

        },

        'supreme': {

            title: 'Supreme:',

            desc: 'Premium ground burial plots with enhanced features and larger space. These plots offer superior positioning and additional amenities for families who desire an elevated memorial experience'

        },

        'special-supreme': {

            title: 'Special Supreme:',

            desc: 'Our most exclusive ground burial option, featuring the finest locations and maximum space. Special Supreme plots provide unparalleled prestige and comfort for distinguished families'

        },

        'mausoleum': {

            title: 'Mausoleum:',

            desc: 'Above-ground entombment in a permanent structure. Mausoleums offer protection from the elements and provide a dignified, lasting memorial in a climate-controlled environment'

        }

    };



  function openReservationModal() {
    if (reservationModal) {
        reservationModal.classList.add('active');
        // Always refresh every avatar (including reservation header)
        updateAllProfilePictures();
    }
}



    function closeReservationModal() {

        if (reservationModal) {

            reservationModal.classList.remove('active');

           

            // Show dashboard content again

            const dashboardContent = document.querySelector('.dashboard-content');

            if (dashboardContent) {

                dashboardContent.style.display = 'block';

            }

        }

    }



    // Open reservation modal from sidebar menu

    if (reservePlotMenuItem) {

        reservePlotMenuItem.addEventListener('click', (e) => {

            e.preventDefault();

            openReservationModal();

           

            // Update active state

            updateActiveMenuItem('reservation');

           

            // Close sidebar after clicking

            if (sidebarMenu && overlay) {

                sidebarMenu.classList.remove('active');

                overlay.classList.remove('active');

            }

        });

    }



    // My Reservation menu item

    const myReservationMenuItem = document.getElementById('myReservationMenuItem');

    if (myReservationMenuItem) {

        myReservationMenuItem.addEventListener('click', (e) => {

            e.preventDefault();

           

            // Close any open modals

            closeReservationModal();

            closeProfileModal();

           

            // Open my reservation page

            const myReservationPage = document.getElementById('myReservationPage');

            if (myReservationPage) {

                myReservationPage.classList.add('active');

            }

           

            // Update active state

            updateActiveMenuItem('myreservation');

           

            // Close sidebar after clicking

            if (sidebarMenu && overlay) {

                sidebarMenu.classList.remove('active');

                overlay.classList.remove('active');

            }

        });

    }



    // Deceased Family menu item

    const deceasedFamilyMenuItem = document.getElementById('deceasedFamilyMenuItem');

    if (deceasedFamilyMenuItem) {

        deceasedFamilyMenuItem.addEventListener('click', (e) => {

            e.preventDefault();

           

            // Close any open modals

            closeReservationModal();

            closeProfileModal();

           

            // Open deceased family page

            const deceasedFamilyPage = document.getElementById('deceasedFamilyPage');

            if (deceasedFamilyPage) {

                deceasedFamilyPage.classList.add('active');

            }

           

            // Update active state

            updateActiveMenuItem('deceasedfamily');

           

            // Close sidebar after clicking

            if (sidebarMenu && overlay) {

                sidebarMenu.classList.remove('active');

                overlay.classList.remove('active');

            }

        });

    }



    // Open reservation modal from dashboard button

    if (makeReservationBtn) {

        makeReservationBtn.addEventListener('click', () => {

            openReservationModal();

        });

    }



    // Back to Dashboard button

    if (backFromReservation) {

        backFromReservation.addEventListener('click', () => {

            closeReservationModal();

            // Remove active state from reservation menu item

            updateActiveMenuItem('dashboard');

        });

    }



    // Reservation page menu button (opens sidebar)

    if (reservationMenuBtn && sidebarMenu && overlay) {

        reservationMenuBtn.addEventListener('click', (e) => {

            e.stopPropagation();

            sidebarMenu.classList.add('active');

            overlay.classList.add('active');

        });

    }



    // Reservation page user button (opens profile)

    if (reservationUserBtn) {

        reservationUserBtn.addEventListener('click', () => {

            closeReservationModal();

            openProfileModal();

        });

    }



    // Lawn tab switching

    const lawnTabs = document.querySelectorAll('.lawn-tab');

    const lawnTitle = document.getElementById('lawnTitle');

    const lawnDesc = document.getElementById('lawnDesc');



    lawnTabs.forEach(tab => {

        tab.addEventListener('click', () => {

            // Remove active class from all tabs

            lawnTabs.forEach(t => t.classList.remove('active'));

           

            // Add active class to clicked tab

            tab.classList.add('active');

           

            // Update description

            const lawnType = tab.getAttribute('data-lawn');

            if (lawnDescriptions[lawnType]) {

                lawnTitle.textContent = lawnDescriptions[lawnType].title;

                lawnDesc.textContent = lawnDescriptions[lawnType].desc;

            }

        });

    });



    // Proceed button

    if (proceedBtn) {

        proceedBtn.addEventListener('click', () => {

            const selectedPlot = document.getElementById('selectedPlot').textContent;

            if (selectedPlot === 'None') {

                alert('Please select a plot location first');

            } else {

                alert(`Proceeding with reservation for: ${selectedPlot}\nReservation form - Coming soon!`);

            }

        });

    }



    // Back to Dashboard button

    if (backToDashboardBtn) {

        backToDashboardBtn.addEventListener('click', closeProfileModal);

    }



    // Profile page menu button (opens sidebar)

    if (profileMenuBtn && sidebarMenu && overlay) {

        profileMenuBtn.addEventListener('click', (e) => {

            e.stopPropagation();

            console.log('Profile menu button clicked');

            console.log('Sidebar:', sidebarMenu);

            console.log('Overlay:', overlay);

            sidebarMenu.classList.add('active');

            overlay.classList.add('active');

        });

    } else {

        console.log('Profile menu elements not found:', {

            profileMenuBtn,

            sidebarMenu,

            overlay

        });

    }



    // Profile page user button (already on profile page, do nothing)

    if (profileUserBtn) {

        profileUserBtn.addEventListener('click', () => {

            // Already on profile page, no action needed

        });

    }



    if (profileCloseBtn) {

        profileCloseBtn.addEventListener('click', closeProfileModal);

    }



    // Change Password button

    const passwordBtn = document.querySelector('.password-btn');

    if (passwordBtn) {

        passwordBtn.addEventListener('click', () => {

            alert('Change Password functionality - Coming soon!');

        });

    }



    // =========================================

    // PLOT INTERACTION - SVG Clickable Areas

    // =========================================

    const plots = document.querySelectorAll('.plot');



    plots.forEach(plot => {

        plot.addEventListener('click', function() {

            const plotNumber = this.getAttribute('data-plot');

            const isAvailable = this.classList.contains('available');

           

            if (isAvailable) {

                alert(`Plot ${plotNumber} is available. Would you like to make a reservation?`);

            } else {

                alert(`Plot ${plotNumber} is occupied.`);

            }

        });

    });



    // SVG Plot clickable areas

    const plotClickableAreas = document.querySelectorAll('.plot-clickable-area');

    plotClickableAreas.forEach(area => {

        area.addEventListener('click', function() {

            const plotNumber = this.getAttribute('data-plot');

            // Redirect to plot details page

            window.location.href = `plot-details.html?plot=${plotNumber}`;

        });

    });



    // Reservation button

    const reservationBtn = document.querySelector('.reservation-btn');

    if (reservationBtn) {

        reservationBtn.addEventListener('click', () => {

            openReservationModal();

        });

    }



    // Payment history link

    const paymentHistoryLink = document.querySelector('.payment-history');

    if (paymentHistoryLink) {

        paymentHistoryLink.addEventListener('click', (e) => {

            e.preventDefault();

            alert('Opening payment history...');

        });

    }



    // Add hover effect information

    plots.forEach(plot => {

        plot.addEventListener('mouseenter', function() {

            const plotNumber = this.getAttribute('data-plot');

            const isAvailable = this.classList.contains('available');

            const status = isAvailable ? 'Available' : 'Occupied';

            console.log(`Plot ${plotNumber}: ${status}`);

        });

    });



    console.log('Dashboard initialized successfully');

   

    // =========================================

    // AUTO-OPEN RESERVATION MODAL FROM URL

    // =========================================

    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.get('openReservation') === 'true') {

        // Immediately hide dashboard content

        const dashboardContent = document.querySelector('.dashboard-content');

        if (dashboardContent) {

            dashboardContent.style.display = 'none';

        }

       

        // Open reservation modal immediately

        setTimeout(() => {

            openReservationModal();

        }, 100);

    }

}



// Load components when DOM is ready

document.addEventListener('DOMContentLoaded', loadAllDashboardComponents);


