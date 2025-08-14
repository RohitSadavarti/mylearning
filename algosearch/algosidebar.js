// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize event listeners
    initializeSidebar();
});

// Initialize sidebar functionality
function initializeSidebar() {
    // Close dropdown when clicking outside
    document.addEventListener('click', function(event) {
        const profileBtn = document.querySelector('.profile-btn');
        const dropdown = document.getElementById('profileDropdown');
        
        if (profileBtn && dropdown && !profileBtn.contains(event.target) && !dropdown.contains(event.target)) {
            dropdown.classList.remove('active');
        }
    });

    // Close sidebar on escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeSidebar();
            const dropdown = document.getElementById('profileDropdown');
            if (dropdown) {
                dropdown.classList.remove('active');
            }
        }
    });

    // Responsive sidebar behavior
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            closeSidebar();
        }
    });
}

// Sidebar functionality
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    
    if (sidebar && overlay) {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.classList.toggle('sidebar-open');
    }
}

function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    
    if (sidebar && overlay) {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.classList.remove('sidebar-open');
    }
}

// Profile dropdown functionality
function toggleProfileDropdown() {
    const dropdown = document.getElementById('profileDropdown');
    if (dropdown) {
        dropdown.classList.toggle('active');
    }
}

// Navigation functions - Match HTML function calls
function openAlgorithms() {
    showMessage('Loading Algorithm Visualizer...', 'info');
    // Add small delay for better UX
    setTimeout(() => {
         window.location.href = './algosearch/index.html';
    }, 500);
}

function openCipher() {
    showMessage('Loading Cipher Visualizer...', 'info');
    // Add small delay for better UX
    setTimeout(() => {
        window.location.href = './cipher/index.html';
    }, 500);
}



function goToHome() {
    showMessage('Going to Dashboard...', 'info');
    setTimeout(() => {
        window.location.href = '/';
    }, 500);
}

// Handle logout
function handleLogout() {
    showMessage('Logging out...', 'info');
    setTimeout(() => {
        // You can implement actual logout logic here
        alert('Logout functionality would be implemented here');
    }, 500);
}

// Set active navigation item
function setActiveNavItem(clickedItem) {
    // Remove active class from all nav items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    
    // Add active class to clicked item
    if (clickedItem) {
        clickedItem.classList.add('active');
    }
}

// Enhanced message notification system
function showMessage(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        notification.remove();
    });

    // Create new notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" style="
            background: none; 
            border: none; 
            color: white; 
            margin-left: 10px; 
            cursor: pointer;
            font-size: 16px;
        ">×</button>
    `;
    
    const bgColor = type === 'error' ? '#dc3545' : 
                   type === 'success' ? '#28a745' : 
                   type === 'warning' ? '#ffc107' : '#667eea';
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        background: ${bgColor};
        color: white;
        border-radius: 8px;
        z-index: 9999;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-width: 200px;
        animation: slideIn 0.3s ease-out;
    `;
    
    // Add animation keyframes
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Auto remove notification after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Handle navigation clicks with better feedback
document.addEventListener('click', function(event) {
    const navItem = event.target.closest('.nav-item');
    if (navItem) {
        // Remove active class from all nav items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Add active class to clicked item
        navItem.classList.add('active');
        
        // Close sidebar on mobile after navigation
        if (window.innerWidth <= 768) {
            setTimeout(() => {
                closeSidebar();
            }, 300);
        }
    }
});

// Touch support for mobile devices
let touchStartX = null;
let touchStartY = null;

document.addEventListener('touchstart', function(event) {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
});

document.addEventListener('touchend', function(event) {
    if (!touchStartX || !touchStartY) return;
    
    const touchEndX = event.changedTouches[0].clientX;
    const touchEndY = event.changedTouches[0].clientY;
    
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    
    // Swipe right to open sidebar (from left edge)
    if (deltaX > 50 && Math.abs(deltaY) < 100 && touchStartX < 50) {
        toggleSidebar();
    }
    
    // Swipe left to close sidebar
    if (deltaX < -50 && Math.abs(deltaY) < 100) {
        const sidebar = document.getElementById('sidebar');
        if (sidebar && sidebar.classList.contains('active')) {
            closeSidebar();
        }
    }
    
    touchStartX = null;
    touchStartY = null;
});
