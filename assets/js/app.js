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
        // Initialize email service
        this.emailService = new EmailService();

        // Wait for contact form to be loaded
        setTimeout(() => {
            const contactForm = document.getElementById('contact-form');
            if (contactForm) {
                contactForm.addEventListener('submit', this.handleContactForm.bind(this));
                console.log('📧 Contact form initialized');
            }
        }, 1000);
    }

    /**
     * Handle contact form submission with enhanced validation
     */
    async handleContactForm(event) {
        event.preventDefault();

        const form = event.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        console.log('📧 Contact form submitted:', data);

        // Clear previous validation states
        this.clearFieldErrors();

        // Show loading state
        this.setFormLoadingState(true);

        try {
            // Validate form data
            const validation = this.emailService.validateFormData(data);
            if (!validation.isValid) {
                this.showFieldErrors(validation.fieldErrors);
                this.showFormStatus('error', 'Please fix the errors above and try again.');
                return;
            }

            // Send email
            const result = await this.emailService.sendEmail(data);

            if (result.success) {
                this.showFormStatus('success', result.message);
                form.reset(); // Clear the form
                this.clearFieldErrors(); // Clear any validation states

                // Add success animation
                this.addSuccessAnimation();
            } else {
                this.showFormStatus('error', result.message || 'Failed to send message. Please try again.');
            }

        } catch (error) {
            console.error('Form submission error:', error);
            this.showFormStatus('error', 'An unexpected error occurred. Please try again or contact us directly.');
        } finally {
            this.setFormLoadingState(false);
        }
    }

    /**
     * Clear field validation errors
     */
    clearFieldErrors() {
        const formGroups = document.querySelectorAll('.form-group');
        formGroups.forEach(group => {
            group.classList.remove('error', 'success');
        });
    }

    /**
     * Show field-specific validation errors
     */
    showFieldErrors(fieldErrors) {
        Object.keys(fieldErrors).forEach(fieldName => {
            const field = document.getElementById(fieldName);
            const errorElement = document.getElementById(`${fieldName}-error`);

            if (field && errorElement) {
                const formGroup = field.closest('.form-group');
                if (formGroup) {
                    formGroup.classList.add('error');
                }
                errorElement.textContent = fieldErrors[fieldName];
            }
        });
    }

    /**
     * Add success animation to form
     */
    addSuccessAnimation() {
        const form = document.getElementById('contact-form');
        if (form) {
            form.style.transform = 'scale(0.98)';
            setTimeout(() => {
                form.style.transform = 'scale(1)';
                form.style.transition = 'transform 0.3s ease';
            }, 200);
        }
    }

    /**
     * Set form loading state with enhanced UX
     */
    setFormLoadingState(isLoading) {
        const submitBtn = document.getElementById('submit-btn');
        const submitText = document.getElementById('submit-text');
        const submitLoader = document.getElementById('submit-loader');

        if (submitBtn && submitText && submitLoader) {
            submitBtn.disabled = isLoading;
            if (isLoading) {
                submitBtn.classList.add('loading');
            } else {
                submitBtn.classList.remove('loading');
            }
            submitText.style.display = isLoading ? 'none' : 'inline';
            submitLoader.style.display = isLoading ? 'inline' : 'none';
        }
    }

    /**
     * Show form status message
     */
    showFormStatus(type, message) {
        const statusElement = document.getElementById('form-status');
        if (statusElement) {
            statusElement.className = `form-status ${type}`;
            statusElement.innerHTML = message;
            statusElement.style.display = 'block';

            // Auto-hide success messages after 5 seconds
            if (type === 'success') {
                setTimeout(() => {
                    statusElement.style.display = 'none';
                }, 5000);
            }
        }
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

// Dynamically load the loading screen
window.addEventListener('DOMContentLoaded', function () {
    fetch('layouts/loadingscreen.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('loading-screen-container').innerHTML = html;
        });
});

// Handle uncaught errors
window.addEventListener('error', (event) => {
    console.error('Uncaught error:', event.error);
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});

/**
 * Global helper function to select service type
 */
window.selectService = function (serviceType) {
    const serviceSelect = document.getElementById('service');
    if (serviceSelect) {
        serviceSelect.value = serviceType;

        // Visual feedback - highlight selected button
        const buttons = document.querySelectorAll('.contact-buttons .btn');
        buttons.forEach(btn => btn.classList.remove('selected'));

        const clickedButton = event.target;
        clickedButton.classList.add('selected');
    }
};
