/**
 * Main Application Script
 * Initializes the website and loads all components
 */

class InovareSoftApp {
    constructor() {
        this.loader = new ComponentLoader();
        this.isLoaded = false;
        this.retryCount = 0;
        this.maxRetries = 3;
    }

    /**
     * Application configuration
     */
    config = {
        components: [
            { name: 'navbar', target: 'navbar-container' }, // Load navbar first
            { name: 'hero', target: 'hero-container' },
            { name: 'about', target: 'about-container' },
            { name: 'projects', target: 'projects-container' },
            { name: 'services', target: 'services-container' },
            { name: 'team', target: 'team-container' },
            { name: 'contact', target: 'contact-container' },
            { name: 'footer', target: 'footer-container' }
        ],
        loadingDelay: 100, // Minimum loading time for better UX
        fadeInDuration: 500
    };

    /**
     * Initialize the application
     */
    async init() {
        try {
            console.log('🚀 Initializing InovareSoft Application...');

            // Show loading screen
            this.showLoadingScreen();

            // Load all components
            await this.loadAllComponents();

            // Initialize features
            this.initializeFeatures();

            // Hide loading screen and show content
            await this.showMainContent();

            console.log('✅ Application initialized successfully');
            this.isLoaded = true;

        } catch (error) {
            console.error('❌ Application initialization failed:', error);
            await this.handleLoadError(error);
        }
    }

    /**
     * Load all components with error handling and retry logic
     */
    async loadAllComponents() {
        try {
            await this.loader.loadComponents(this.config.components);

            // Show navbar after loading
            this.showNavbar();

            // Reinitialize scroll animations after all components are loaded
            this.reinitializeScrollAnimations();

        } catch (error) {
            if (this.retryCount < this.maxRetries) {
                this.retryCount++;
                console.log(`🔄 Retrying component loading (${this.retryCount}/${this.maxRetries})...`);
                await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
                return this.loadAllComponents();
            }
            throw error;
        }
    }

    /**
     * Show navbar after loading
     */
    showNavbar() {
        const navbar = document.querySelector('.main-header');
        if (navbar) {
            setTimeout(() => {
                navbar.classList.add('loaded');
                console.log('🧭 Navbar revealed');
            }, 200); // Small delay to ensure smooth transition
        }
    }

    /**
     * Show loading screen
     */
    showLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        const mainContent = document.getElementById('main-content');

        if (loadingScreen) {
            loadingScreen.style.display = 'flex';
        }

        if (mainContent) {
            mainContent.style.opacity = '0';
        }
    }

    /**
     * Hide loading screen and show main content
     */
    async showMainContent() {
        // Ensure minimum loading time for better UX
        await new Promise(resolve => setTimeout(resolve, this.config.loadingDelay));

        const loadingScreen = document.getElementById('loading-screen');
        const mainContent = document.getElementById('main-content');
        const errorContainer = document.getElementById('error-container');

        // Hide error container if visible
        if (errorContainer) {
            errorContainer.style.display = 'none';
        }

        // Fade out loading screen
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, this.config.fadeInDuration);
        }

        // Fade in main content
        if (mainContent) {
            mainContent.style.opacity = '1';
        }
    }

    /**
     * Handle loading errors
     */
    async handleLoadError(error) {
        console.error('💥 Critical error occurred:', error);

        const loadingScreen = document.getElementById('loading-screen');
        const errorContainer = document.getElementById('error-container');
        const mainContent = document.getElementById('main-content');

        // Hide loading screen
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }

        // Hide main content
        if (mainContent) {
            mainContent.style.opacity = '0';
        }

        // Show error message
        if (errorContainer) {
            errorContainer.style.display = 'block';
        }

        // Log error for debugging
        this.logError(error);
    }

    /**
     * Initialize application features
     */
    initializeFeatures() {
        // Initialize scroll animations
        this.initializeScrollAnimations();

        // Initialize smooth scrolling
        this.loader.initSmoothScrolling();

        // Initialize form handling
        this.initializeContactForm();

        // Initialize performance monitoring
        this.initializePerformanceMonitoring();

        // Initialize accessibility features
        this.initializeAccessibility();

        // Initialize modern interactions
        this.initializeModernInteractions();

        // Initialize fixed navbar effects
        this.initializeNavbarEffects();

        console.log('🔧 Application features initialized');
    }

    /**
     * Initialize fixed navbar effects
     */
    initializeNavbarEffects() {
        // Initialize smooth scrolling for nav links only
        this.initializeSmoothScrolling();

        console.log('🧭 Navbar effects initialized');
    }

    /**
     * Initialize smooth scrolling for navigation links
     */
    initializeSmoothScrolling() {
        const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();

                const targetId = link.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);

                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 100; // Account for fixed navbar

                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    /**
     * Initialize scroll animations
     */
    initializeScrollAnimations() {
        if (window.ScrollAnimationController) {
            this.scrollController = new ScrollAnimationController();

            // Initialize after a short delay to ensure all components are loaded
            setTimeout(() => {
                this.scrollController.init();

                // Add special effects
                this.scrollController.addFloatingEffect('.about-icon');
                this.scrollController.addTiltEffect('.project-card, .team-card');
                this.scrollController.addMagneticEffect('.btn');

                // Initialize team-specific effects
                this.scrollController.initTeamEffects();

                // Force reveal visible sections after a delay
                setTimeout(() => {
                    this.scrollController.forceRevealVisibleSections();
                }, 1000);

                // Fallback: reveal all sections after 3 seconds if still hidden
                setTimeout(() => {
                    this.scrollController.revealAllSections();
                }, 3000);

                console.log('🎬 Scroll animations ready');
            }, 500);
        }
    }

    /**
     * Reinitialize scroll animations after components load
     */
    reinitializeScrollAnimations() {
        if (this.scrollController) {
            // Destroy existing observers
            this.scrollController.destroy();

            // Reinitialize with new DOM elements
            setTimeout(() => {
                this.scrollController = new ScrollAnimationController();
                this.scrollController.init();

                // Add special effects for newly loaded components
                this.scrollController.addFloatingEffect('.about-icon');
                this.scrollController.addTiltEffect('.project-card, .team-card');
                this.scrollController.addMagneticEffect('.btn');
                this.scrollController.initTeamEffects();

                console.log('🔄 Scroll animations reinitialized');
            }, 300);
        }
    }

    /**
     * Initialize modern interactions
     */
    initializeModernInteractions() {
        // Add loading states to buttons
        this.enhanceButtons();

        // Add hover effects to images
        this.enhanceImages();

        // Add interactive feedback
        this.addInteractiveFeedback();
    }

    /**
     * Enhance buttons with modern interactions
     */
    enhanceButtons() {
        setTimeout(() => {
            const buttons = document.querySelectorAll('.btn');
            buttons.forEach(btn => {
                btn.classList.add('btn-animated');

                // Add click ripple effect
                btn.addEventListener('click', (e) => {
                    const ripple = document.createElement('span');
                    const rect = btn.getBoundingClientRect();
                    const size = Math.max(rect.width, rect.height);
                    const x = e.clientX - rect.left - size / 2;
                    const y = e.clientY - rect.top - size / 2;

                    ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
          `;

                    btn.style.position = 'relative';
                    btn.style.overflow = 'hidden';
                    btn.appendChild(ripple);

                    setTimeout(() => ripple.remove(), 600);
                });
            });

            // Add ripple animation
            if (!document.getElementById('ripple-styles')) {
                const style = document.createElement('style');
                style.id = 'ripple-styles';
                style.textContent = `
          @keyframes ripple {
            to {
              transform: scale(2);
              opacity: 0;
            }
          }
        `;
                document.head.appendChild(style);
            }
        }, 1000);
    }

    /**
     * Enhance images with modern effects
     */
    enhanceImages() {
        setTimeout(() => {
            const images = document.querySelectorAll('.about-images, .project-img');
            images.forEach(img => {
                img.classList.add('image-zoom');
            });
        }, 1000);
    }

    /**
     * Add interactive feedback
     */
    addInteractiveFeedback() {
        setTimeout(() => {
            const interactiveElements = document.querySelectorAll('a, button, .project-card, .team-card');
            interactiveElements.forEach(el => {
                el.classList.add('interactive');
            });
        }, 1000);
    }

    /**
     * Initialize contact form handling
     */
    initializeContactForm() {
        // Wait for contact form to be loaded
        setTimeout(() => {
            const contactForm = document.querySelector('.contact-form');
            if (contactForm) {
                contactForm.addEventListener('submit', this.handleContactForm.bind(this));
            }
        }, 1000);
    }

    /**
     * Handle contact form submission
     */
    handleContactForm(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData);

        console.log('📧 Contact form submitted:', data);

        // Here you would typically send the data to your backend
        // For now, we'll just show a success message
        alert('Thank you for your message! We\'ll get back to you soon.');
    }

    /**
     * Initialize performance monitoring
     */
    initializePerformanceMonitoring() {
        // Monitor page load performance
        window.addEventListener('load', () => {
            const loadTime = performance.now();
            console.log(`⚡ Page loaded in ${loadTime.toFixed(2)}ms`);
        });

        // Monitor component load times
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.entryType === 'navigation') {
                    console.log(`🏁 Navigation completed in ${entry.loadEventEnd.toFixed(2)}ms`);
                }
            }
        });

        observer.observe({ entryTypes: ['navigation'] });
    }

    /**
     * Initialize accessibility features
     */
    initializeAccessibility() {
        // Add keyboard navigation support
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });

        // Add focus indicators
        const style = document.createElement('style');
        style.textContent = `
      .keyboard-navigation *:focus {
        outline: 2px solid #1d849f !important;
        outline-offset: 2px !important;
      }
    `;
        document.head.appendChild(style);
    }

    /**
     * Log error for debugging
     */
    logError(error) {
        const errorLog = {
            timestamp: new Date().toISOString(),
            message: error.message,
            stack: error.stack,
            userAgent: navigator.userAgent,
            url: window.location.href
        };

        console.error('Error Log:', errorLog);

        // In a real application, you would send this to your error tracking service
        // Example: sendToErrorTrackingService(errorLog);
    }

    /**
     * Reload the application
     */
    reload() {
        window.location.reload();
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new InovareSoftApp();
    app.init();

    // Make app instance available globally for debugging
    window.inovareSoftApp = app;
});

// Handle uncaught errors
window.addEventListener('error', (event) => {
    console.error('Uncaught error:', event.error);
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});
