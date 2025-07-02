/**
 * Website Configuration
 * Central configuration for the InovareSoft website
 */

const CONFIG = {
    // Application settings
    app: {
        name: 'InovareSoft',
        version: '2.0.0',
        environment: 'production', // 'development' | 'staging' | 'production'
        debug: false
    },

    // Component loading configuration
    components: {
        loadingDelay: 100, // Minimum loading time in ms
        retryAttempts: 3,
        retryDelay: 1000, // Delay between retries in ms
        fadeInDuration: 500 // Content fade-in duration in ms
    },

    // Performance settings
    performance: {
        enableMonitoring: true,
        logLoadTimes: true,
        enablePrefetch: true
    },

    // SEO and meta settings
    seo: {
        title: 'InovareSoft - Smart Custom Software Solutions',
        description: 'Renew your digital world with smart, custom software solutions from InovareSoft. Expert developers delivering cutting-edge digital solutions.',
        keywords: 'software development, custom software, web development, mobile apps, fintech, healthcare technology',
        author: 'InovareSoft',
        ogImage: 'images/og-image.jpg' // Add this image to your images folder
    },

    // Contact information
    contact: {
        email: 'inovaresoft@outlook.com',
        phone: '+20155 240 8726',
        social: {
            linkedin: '#',
            twitter: '#',
            github: '#'
        }
    },

    // Feature flags
    features: {
        smoothScrolling: true,
        formValidation: true,
        accessibilityMode: true,
        darkMode: false, // Future feature
        analytics: false, // Future feature
        chatWidget: false // Future feature
    },

    // Animation settings
    animations: {
        enableAnimations: true,
        reducedMotion: false, // Respect user preferences
        scrollTriggerOffset: 100 // Pixels before scroll animations trigger
    },

    // Error handling
    errors: {
        showUserFriendlyMessages: true,
        logToConsole: true,
        enableErrorReporting: false, // Future feature
        fallbackContent: true
    }
};

// Make config available globally
if (typeof window !== 'undefined') {
    window.CONFIG = CONFIG;
}

// Export for Node.js environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
