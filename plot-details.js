// =========================================
// PLOT DETAILS PAGE FUNCTIONALITY
// =========================================

// Get section from URL
const urlParams = new URLSearchParams(window.location.search);
const section = urlParams.get('section');

console.log('Section:', section);

// =========================================
// GENERATE LAWN CONDOMINIUM GRID
// =========================================
function generateLawnCondominiumGrid() {
    const container = document.getElementById('plotGridContainer');
    if (!container) return;

    // Grid dimensions (based on your image - approximately 30 columns x 25 rows)
    const rows = 25;
    const cols = 30;
    
    // Sample data - you can replace this with real data from Firebase
    const plotData = generateSamplePlotData(rows, cols);
    
    // Create grid
    const grid = document.createElement('div');
    grid.className = 'plot-grid';
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    grid.style.gap = '2px';
    grid.style.maxWidth = '800px';
    grid.style.margin = '0 auto';
    
    // Generate plot cells
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const plotId = `${row}-${col}`;
            const plotStatus = plotData[plotId] || 'occupied';
            
            const cell = document.createElement('div');
            cell.className = `plot-cell ${plotStatus}`;
            cell.dataset.plot = plotId;
            cell.dataset.row = row;
            cell.dataset.col = col;
            
            // Add click event
            cell.addEventListener('click', () => handlePlotClick(plotId, plotStatus));
            
            grid.appendChild(cell);
        }
    }
    
    container.appendChild(grid);
}

// Generate sample plot data (replace with real database data)
function generateSamplePlotData(rows, cols) {
    const data = {};
    
    // Randomly assign statuses for demonstration
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const plotId = `${row}-${col}`;
            const random = Math.random();
            
            if (random < 0.6) {
                data[plotId] = 'occupied'; // 60% occupied (red)
            } else if (random < 0.85) {
                data[plotId] = 'available'; // 25% available (green)
            } else {
                data[plotId] = 'reserved'; // 15% reserved (yellow)
            }
        }
    }
    
    return data;
}

// Handle plot click
function handlePlotClick(plotId, status) {
    if (status === 'available') {
        const confirm = window.confirm(`Plot ${plotId} is available. Would you like to make a reservation?`);
        if (confirm) {
            // Redirect to reservation or open modal
            alert('Opening reservation form...');
            // window.location.href = `dashboard.html?reserve=${plotId}`;
        }
    } else if (status === 'occupied') {
        alert(`Plot ${plotId} is occupied.`);
    } else if (status === 'reserved') {
        alert(`Plot ${plotId} is reserved.`);
    }
}

// =========================================
// INITIALIZE PAGE
// =========================================
if (section === 'lawn-condominium') {
    // Show Group 109 image instead of grid
    const container = document.getElementById('plotGridContainer');
    if (container) {
        container.innerHTML = '<img src="assets/images/Map/Group 109.png" alt="Lawn Condominium Plot Map" style="max-width: 100%; height: auto; display: block; margin: 0 auto;">';
    }
} else {
    // Show default message or redirect
    const container = document.getElementById('plotGridContainer');
    if (container) {
        container.innerHTML = '<p style="text-align: center; padding: 50px;">Please select a section from the map.</p>';
    }
}

// =========================================
// BACK TO MAP BUTTON
// =========================================
const backToMapBtn = document.getElementById('backToMapBtn');
if (backToMapBtn) {
    backToMapBtn.addEventListener('click', () => {
        // Go back to dashboard and automatically open reservation modal
        window.location.href = 'dashboard.html?openReservation=true';
    });
}

// =========================================
// MENU ICON BUTTON
// =========================================
const menuIconBtn = document.getElementById('menuIconBtn');
if (menuIconBtn) {
    menuIconBtn.addEventListener('click', () => {
        window.location.href = 'dashboard.html';
    });
}

// =========================================
// USER ICON BUTTON
// =========================================
const userIconBtn = document.getElementById('userIconBtn');
if (userIconBtn) {
    userIconBtn.addEventListener('click', () => {
        window.location.href = 'dashboard.html';
    });
}
