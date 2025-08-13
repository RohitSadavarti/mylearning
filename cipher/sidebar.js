        // Sidebar functionality
        function toggleSidebar() {
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('overlay');
            
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
        }

        function closeSidebar() {
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('overlay');
            
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        }

        // Profile dropdown functionality
        function toggleProfileDropdown() {
            const dropdown = document.getElementById('profileDropdown');
            dropdown.classList.toggle('active');
        }

        // Close dropdown when clicking outside
        document.addEventListener('click', function(event) {
            const profileBtn = document.querySelector('.profile-btn');
            const dropdown = document.getElementById('profileDropdown');
            
            if (!profileBtn.contains(event.target) && !dropdown.contains(event.target)) {
                dropdown.classList.remove('active');
            }
        });

        // Navigation functions
        function goToAlgorithms() {
            window.location.href = '/algosearch';
        }

        function goToCipher() {
            window.location.href = '/cipher';
        }

        // Close sidebar on escape key
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                closeSidebar();
                document.getElementById('profileDropdown').classList.remove('active');
            }
        });

        // Responsive sidebar behavior
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                closeSidebar();
            }
        });
