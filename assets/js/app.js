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
        // Initialize smooth scrolling
        this.loader.initSmoothScrolling();

        // Initialize form handling
        this.initializeContactForm();

        // Initialize performance monitoring
        this.initializePerformanceMonitoring();

        // Initialize accessibility features
        this.initializeAccessibility();

        console.log('🔧 Application features initialized');
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
