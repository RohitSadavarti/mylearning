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

// Navigation functions - Updated for static site
function goToAlgorithms() {
    // For static site, you might want to redirect to a different page
    // or show a message that this feature is not available
    alert('Tree Traversal Algorithms page is not available in this demo. This would redirect to /algosearch in a full application.');
}

function goToCipher() {
    // Since we're already on the cipher page, just close the sidebar
    closeSidebar();
    // You could also scroll to top or refresh the page
    // window.location.reload();
}

// Additional utility functions for better UX
function showMessage(message, type = 'info') {
    // Create a simple notification system
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        background: ${type === 'error' ? '#dc3545' : '#667eea'};
        color: white;
        border-radius: 4px;
        z-index: 9999;
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Handle navigation clicks with better feedback
document.addEventListener('click', function(event) {
    if (event.target.closest('.nav-item')) {
        const navItem = event.target.closest('.nav-item');
        
        // Remove active class from all nav items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Add active class to clicked item
        navItem.classList.add('active');
    }
});
