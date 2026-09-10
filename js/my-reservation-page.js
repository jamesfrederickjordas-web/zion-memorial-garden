// =========================================
// MY RESERVATION PAGE FUNCTIONALITY
// =========================================

function initMyReservationPage() {
    const myReservationPage = document.getElementById('myReservationPage');
    const myReservationMenuBtn = document.getElementById('myReservationMenuBtn');
    const myReservationUserBtn = document.getElementById('myReservationUserBtn');
    const reservePlotBtn = document.getElementById('reservePlotBtn');

    // Always show the correct profile picture when this page is initialized
    if (typeof window.updateAllProfilePictures === 'function') {
        window.updateAllProfilePictures();
    } else {
        const savedPicture = localStorage.getItem('userProfilePicture');
        const img = document.querySelector('#myReservationUserBtn img');
        if (img && savedPicture) img.src = savedPicture;
    }

    // Also refresh the picture every time this page becomes visible
    if (myReservationPage) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    if (myReservationPage.classList.contains('active')) {
                        if (typeof window.updateAllProfilePictures === 'function') {
                            window.updateAllProfilePictures();
                        }
                    }
                }
            });
        });
        observer.observe(myReservationPage, { attributes: true });
    }

    // Menu button - toggle sidebar dropdown
    if (myReservationMenuBtn) {
        myReservationMenuBtn.addEventListener('click', () => {
            const sidebar = document.querySelector('.sidebar-menu');
            const overlay = document.getElementById('overlay');
            if (sidebar) {
                sidebar.classList.toggle('active');
            }
            if (overlay) {
                overlay.classList.toggle('active');
            }
        });
    }

    // User button - close my reservation and open profile modal
    if (myReservationUserBtn) {
        myReservationUserBtn.addEventListener('click', () => {
            myReservationPage.classList.remove('active');
            const profileModal = document.querySelector('.profile-modal-overlay');
            if (profileModal) {
                profileModal.classList.add('active');
            }
        });
    }

    // Reserve a Plot button - open reservation modal
    if (reservePlotBtn) {
        reservePlotBtn.addEventListener('click', () => {
            myReservationPage.classList.remove('active');
            const reservationModal = document.querySelector('.reservation-modal-overlay');
            if (reservationModal) {
                reservationModal.classList.add('active');
            }
        });
    }

    // Handle sidebar menu clicks when on my reservation page
    setupMyReservationSidebarNavigation();
}

function setupMyReservationSidebarNavigation() {
    const myReservationPage = document.getElementById('myReservationPage');
    const sidebar = document.querySelector('.sidebar-menu');
    const overlay = document.getElementById('overlay');

    // Profile menu item
    const profileMenuItem = document.getElementById('profileMenuItem');
    if (profileMenuItem) {
        profileMenuItem.addEventListener('click', (e) => {
            e.preventDefault();
            // Close my reservation page
            myReservationPage.classList.remove('active');
            // Open profile modal
            const profileModal = document.querySelector('.profile-modal-overlay');
            if (profileModal) {
                profileModal.classList.add('active');
            }
            // Close sidebar
            if (sidebar) sidebar.classList.remove('active');
            if (overlay) overlay.classList.remove('active');
        });
    }

    // Dashboard menu item
    const dashboardMenuItem = document.getElementById('dashboardMenuItem');
    if (dashboardMenuItem) {
        dashboardMenuItem.addEventListener('click', (e) => {
            e.preventDefault();
            // Close my reservation page
            myReservationPage.classList.remove('active');
            // Close sidebar
            if (sidebar) sidebar.classList.remove('active');
            if (overlay) overlay.classList.remove('active');
        });
    }

    // Reserve a plot menu item
    const reservePlotMenuItem = document.getElementById('reservePlotMenuItem');
    if (reservePlotMenuItem) {
        reservePlotMenuItem.addEventListener('click', (e) => {
            e.preventDefault();
            // Close my reservation page
            myReservationPage.classList.remove('active');
            // Open reservation modal
            const reservationModal = document.querySelector('.reservation-modal-overlay');
            if (reservationModal) {
                reservationModal.classList.add('active');
            }
            // Close sidebar
            if (sidebar) sidebar.classList.remove('active');
            if (overlay) overlay.classList.remove('active');
        });
    }
}

// Export for use in dashboard-loader.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initMyReservationPage };
}