// ========================================
// MOBILE SIDEBAR NAVIGATION
// GitHub-style enterprise UX
// ========================================

class MobileSidebar {
    constructor() {
        this.sidebar = null;
        this.overlay = null;
        this.hamburger = null;
        this.isOpen = false;
        this.init();
    }

    init() {
        // Wait for DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        this.createSidebar();
        this.attachEventListeners();
    }

    createSidebar() {
        // Create overlay
        this.overlay = document.createElement('div');
        this.overlay.className = 'sidebar-overlay';
        this.overlay.setAttribute('aria-hidden', 'true');

        // Create sidebar
        this.sidebar = document.createElement('aside');
        this.sidebar.className = 'mobile-sidebar';
        this.sidebar.setAttribute('role', 'dialog');
        this.sidebar.setAttribute('aria-label', 'Navigation menu');
        this.sidebar.setAttribute('aria-hidden', 'true');

        // Populate sidebar content
        this.sidebar.innerHTML = `
            <div class="sidebar-header">
                <div class="sidebar-logo">
                    <span class="logo-text">
                        <span class="text-atom">Atom</span><span class="text-next">Next</span>
                    </span>
                </div>
                <button class="sidebar-close" aria-label="Close navigation menu">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <nav class="sidebar-nav">
                <ul class="sidebar-links">
                    <li><a href="${this.getBasePath()}index.html" class="sidebar-link">
                        <i class="fas fa-home"></i>
                        <span>Home</span>
                    </a></li>
                    <li><a href="${this.getBasePath()}about.html" class="sidebar-link">
                        <i class="fas fa-users"></i>
                        <span>About</span>
                    </a></li>
                    <li><a href="${this.getBasePath()}order.html" class="sidebar-link">
                        <i class="fas fa-clipboard-list"></i>
                        <span>Request Service</span>
                    </a></li>
                    <li><a href="${this.getBasePath()}book-call.html" class="sidebar-link">
                        <i class="fas fa-calendar-alt"></i>
                        <span>Book a Call</span>
                    </a></li>
                </ul>
            </nav>
            <div class="sidebar-footer">
                <a href="${this.getBasePath()}book-call.html" class="sidebar-cta">
                    Get Started
                    <i class="fas fa-arrow-right"></i>
                </a>
                <p class="sidebar-copyright">© 2024 AtomNext</p>
            </div>
        `;

        // Add to DOM
        document.body.appendChild(this.overlay);
        document.body.appendChild(this.sidebar);

        // Get hamburger button
        this.hamburger = document.querySelector('.hamburger');
        if (this.hamburger) {
            // Convert to proper button
            const button = document.createElement('button');
            button.className = 'hamburger';
            button.setAttribute('type', 'button');
            button.setAttribute('aria-label', 'Open navigation menu');
            button.setAttribute('aria-expanded', 'false');
            button.innerHTML = `
                <span></span>
                <span></span>
                <span></span>
            `;
            this.hamburger.replaceWith(button);
            this.hamburger = button;
        }
    }

    getBasePath() {
        // Determine if we're on a subpage or main page
        const path = window.location.pathname;
        return path.includes('/') && !path.endsWith('/') ? '' : '';
    }

    attachEventListeners() {
        // Hamburger click
        if (this.hamburger) {
            this.hamburger.addEventListener('click', (e) => {
                e.stopPropagation();
                this.open();
            });
        }

        // Close button
        const closeBtn = this.sidebar.querySelector('.sidebar-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }

        // Overlay click
        this.overlay.addEventListener('click', () => this.close());

        // Navigation links - AUTO CLOSE
        const navLinks = this.sidebar.querySelectorAll('.sidebar-link, .sidebar-cta');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Close immediately, then navigate
                this.close();
                // Navigation will happen naturally via href
            });
        });

        // ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });

        // Prevent clicks inside sidebar from closing it
        this.sidebar.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    open() {
        this.isOpen = true;

        // Add classes
        this.sidebar.classList.add('active');
        this.overlay.classList.add('active');
        document.body.classList.add('sidebar-open');

        // Update ARIA
        this.sidebar.setAttribute('aria-hidden', 'false');
        this.overlay.setAttribute('aria-hidden', 'false');
        if (this.hamburger) {
            this.hamburger.setAttribute('aria-expanded', 'true');
        }

        // Lock scroll
        document.body.style.overflow = 'hidden';

        // Focus management
        const firstLink = this.sidebar.querySelector('.sidebar-link');
        if (firstLink) {
            setTimeout(() => firstLink.focus(), 100);
        }
    }

    close() {
        this.isOpen = false;

        // Remove classes
        this.sidebar.classList.remove('active');
        this.overlay.classList.remove('active');
        document.body.classList.remove('sidebar-open');

        // Update ARIA
        this.sidebar.setAttribute('aria-hidden', 'true');
        this.overlay.setAttribute('aria-hidden', 'true');
        if (this.hamburger) {
            this.hamburger.setAttribute('aria-expanded', 'false');
        }

        // Unlock scroll
        document.body.style.overflow = '';

        // Return focus to hamburger
        if (this.hamburger) {
            this.hamburger.focus();
        }
    }
}

// Initialize sidebar
const sidebar = new MobileSidebar();

// Export for potential external use
window.mobileSidebar = sidebar;
