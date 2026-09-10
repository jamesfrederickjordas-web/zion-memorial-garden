// =========================================
// COMPONENT LOADER
// Loads HTML components dynamically
// =========================================

async function loadComponent(elementId, componentPath) {
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
        console.error('Error loading component:', error);
    }
}

async function loadAllComponents() {
    // Load all components
    await Promise.all([
        loadComponent('header-component', 'components/header.html'),
        loadComponent('hero-component', 'components/hero.html'),
        loadComponent('info-component', 'components/info-section.html'),
        loadComponent('login-modal-component', 'components/login-modal.html'),
        loadComponent('register-modal-component', 'components/register-modal.html'),
        loadComponent('about-popup-component', 'components/about-popup.html'),
        loadComponent('virtual-tours-popup-component', 'components/virtual-tours-popup.html'),
        loadComponent('contact-popup-component', 'components/contact-popup.html')
    ]);
    
    // Add a small delay to ensure DOM is fully parsed
    await new Promise(resolve => setTimeout(resolve, 50));
    
    // After components are loaded, initialize functionality
    if (typeof initLogin === 'function') {
        initLogin();
    }
    if (typeof initRegister === 'function') {
        initRegister();
    }
    
    // Initialize page popups
    initPagePopups();
    
    console.log('All components loaded successfully');
}

// Initialize page popups functionality
function initPagePopups() {
    // Get all popup elements
    const aboutPopup = document.getElementById('aboutPopup');
    const virtualToursPopup = document.getElementById('virtualToursPopup');
    const contactPopup = document.getElementById('contactPopup');
    
    // Get all navigation links from header
    const aboutLink = document.querySelector('a[href="about-page.html"]');
    const virtualToursLink = document.querySelector('a[href="virtual-tours-page.html"]');
    const contactLink = document.querySelector('a[href="contact-page.html"]');
    
    // Function to close all popups
    function closeAllPopups() {
        if (aboutPopup) aboutPopup.classList.remove('active');
        if (virtualToursPopup) virtualToursPopup.classList.remove('active');
        if (contactPopup) contactPopup.classList.remove('active');
    }
    
    // Function to open specific popup
    function openPopup(popup) {
        closeAllPopups();
        if (popup) {
            popup.classList.add('active');
        }
    }
    
    // Add click handlers to header navigation links
    if (aboutLink) {
        aboutLink.addEventListener('click', (e) => {
            e.preventDefault();
            openPopup(aboutPopup);
        });
    }
    if (virtualToursLink) {
        virtualToursLink.addEventListener('click', (e) => {
            e.preventDefault();
            openPopup(virtualToursPopup);
        });
    }
    if (contactLink) {
        contactLink.addEventListener('click', (e) => {
            e.preventDefault();
            openPopup(contactPopup);
        });
    }
    
    // Initialize navigation inside each popup
    initPopupNavigation(aboutPopup, virtualToursPopup, contactPopup);
}

// Initialize navigation inside popups
function initPopupNavigation(aboutPopup, virtualToursPopup, contactPopup) {
    // Get all popup home links
    const popupHomeLinks = document.querySelectorAll('.popup-home-link');
    popupHomeLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            // Close all popups
            if (aboutPopup) aboutPopup.classList.remove('active');
            if (virtualToursPopup) virtualToursPopup.classList.remove('active');
            if (contactPopup) contactPopup.classList.remove('active');
        });
    });
    
    // Get all popup about links
    const popupAboutLinks = document.querySelectorAll('.popup-about-link');
    popupAboutLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            // Close all and open about
            if (aboutPopup) aboutPopup.classList.remove('active');
            if (virtualToursPopup) virtualToursPopup.classList.remove('active');
            if (contactPopup) contactPopup.classList.remove('active');
            if (aboutPopup) aboutPopup.classList.add('active');
        });
    });
    
    // Get all popup virtual tours links
    const popupVirtualLinks = document.querySelectorAll('.popup-virtual-link');
    popupVirtualLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            // Close all and open virtual tours
            if (aboutPopup) aboutPopup.classList.remove('active');
            if (virtualToursPopup) virtualToursPopup.classList.remove('active');
            if (contactPopup) contactPopup.classList.remove('active');
            if (virtualToursPopup) virtualToursPopup.classList.add('active');
        });
    });
    
    // Get all popup contact links
    const popupContactLinks = document.querySelectorAll('.popup-contact-link');
    popupContactLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            // Close all and open contact
            if (aboutPopup) aboutPopup.classList.remove('active');
            if (virtualToursPopup) virtualToursPopup.classList.remove('active');
            if (contactPopup) contactPopup.classList.remove('active');
            if (contactPopup) contactPopup.classList.add('active');
        });
    });
    
    // Get all popup register buttons
    const popupRegisterBtns = document.querySelectorAll('.popup-register-btn');
    popupRegisterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            // Don't close popups - keep them open
            // Open register modal
            const registerBtn = document.getElementById('registerBtn');
            if (registerBtn) {
                registerBtn.click();
            }
        });
    });
}

// Load components when DOM is ready
document.addEventListener('DOMContentLoaded', loadAllComponents);
