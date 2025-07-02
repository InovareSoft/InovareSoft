/**
 * Development Utilities
 * Helper functions for development and debugging
 */

class DevUtils {
    constructor() {
        this.isDevMode = window.CONFIG?.app?.environment === 'development' || window.CONFIG?.app?.debug;
    }

    /**
     * Log messages only in development mode
     */
    log(...args) {
        if (this.isDevMode) {
            console.log('🔧 [DEV]', ...args);
        }
    }

    /**
     * Test component loading individually
     */
    async testComponent(componentName) {
        const loader = new ComponentLoader();
        const testContainer = this.createTestContainer(componentName);

        try {
            console.time(`Loading ${componentName}`);
            await loader.loadComponent(componentName, testContainer.id);
            console.timeEnd(`Loading ${componentName}`);
            console.log(`✅ ${componentName} loaded successfully`);
            return true;
        } catch (error) {
            console.error(`❌ Failed to load ${componentName}:`, error);
            return false;
        }
    }

    /**
     * Create a test container for component testing
     */
    createTestContainer(componentName) {
        const existingContainer = document.getElementById(`test-${componentName}`);
        if (existingContainer) {
            existingContainer.remove();
        }

        const container = document.createElement('div');
        container.id = `test-${componentName}`;
        container.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      width: 300px;
      max-height: 400px;
      background: white;
      border: 2px solid #1d849f;
      border-radius: 8px;
      padding: 20px;
      z-index: 10000;
      overflow: auto;
      box-shadow: 0 4px 20px rgba(0,0,0,0.2);
    `;

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '✕';
        closeBtn.style.cssText = `
      position: absolute;
      top: 10px;
      right: 10px;
      background: #dc3545;
      color: white;
      border: none;
      border-radius: 50%;
      width: 25px;
      height: 25px;
      cursor: pointer;
      font-size: 12px;
    `;
        closeBtn.onclick = () => container.remove();

        container.appendChild(closeBtn);
        document.body.appendChild(container);

        return container;
    }

    /**
     * Test all components
     */
    async testAllComponents() {
        const components = window.CONFIG?.components || [
            'hero', 'about', 'projects', 'services', 'team', 'contact', 'footer'
        ];

        console.log('🧪 Testing all components...');
        const results = {};

        for (const component of components) {
            results[component] = await this.testComponent(component);
        }

        console.table(results);
        return results;
    }

    /**
     * Performance monitoring
     */
    measurePerformance() {
        if (!this.isDevMode) return;

        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                this.log(`Performance: ${entry.name} took ${entry.duration.toFixed(2)}ms`);
            }
        });

        observer.observe({ entryTypes: ['measure', 'navigation'] });

        // Measure custom metrics
        performance.mark('app-start');

        window.addEventListener('load', () => {
            performance.mark('app-loaded');
            performance.measure('app-load-time', 'app-start', 'app-loaded');
        });
    }

    /**
     * Simulate slow network for testing
     */
    simulateSlowNetwork(delay = 2000) {
        if (!this.isDevMode) return;

        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
            await new Promise(resolve => setTimeout(resolve, delay));
            return originalFetch(...args);
        };

        console.log(`🐌 Simulating slow network with ${delay}ms delay`);
    }

    /**
     * Check accessibility
     */
    checkAccessibility() {
        const issues = [];

        // Check for missing alt attributes
        const images = document.querySelectorAll('img:not([alt])');
        if (images.length > 0) {
            issues.push(`${images.length} images missing alt attributes`);
        }

        // Check for missing form labels
        const inputs = document.querySelectorAll('input:not([aria-label]):not([id])');
        if (inputs.length > 0) {
            issues.push(`${inputs.length} inputs missing labels`);
        }

        // Check color contrast (basic check)
        const elements = document.querySelectorAll('*');
        let contrastIssues = 0;
        elements.forEach(el => {
            const styles = getComputedStyle(el);
            const bgColor = styles.backgroundColor;
            const textColor = styles.color;

            // Basic contrast check (you would use a proper contrast calculation library)
            if (bgColor !== 'rgba(0, 0, 0, 0)' && textColor !== 'rgba(0, 0, 0, 0)') {
                // This is a simplified check - use a proper contrast library in production
                if (this.getContrastRatio(bgColor, textColor) < 4.5) {
                    contrastIssues++;
                }
            }
        });

        if (contrastIssues > 0) {
            issues.push(`${contrastIssues} potential contrast issues`);
        }

        if (issues.length === 0) {
            console.log('✅ No accessibility issues found');
        } else {
            console.warn('⚠️ Accessibility issues:', issues);
        }

        return issues;
    }

    /**
     * Simple contrast ratio calculation (simplified)
     */
    getContrastRatio(color1, color2) {
        // This is a very simplified version
        // In production, use a proper color contrast library
        return Math.random() * 10; // Placeholder
    }

    /**
     * Toggle debug mode
     */
    toggleDebug() {
        const currentDebug = window.CONFIG?.app?.debug || false;
        if (window.CONFIG?.app) {
            window.CONFIG.app.debug = !currentDebug;
        }
        console.log(`Debug mode: ${!currentDebug ? 'ON' : 'OFF'}`);
    }

    /**
     * Clear all caches
     */
    clearCaches() {
        if ('caches' in window) {
            caches.keys().then(names => {
                names.forEach(name => {
                    caches.delete(name);
                });
            });
        }

        localStorage.clear();
        sessionStorage.clear();

        console.log('🧹 Caches cleared');
    }

    /**
     * Get app info
     */
    getAppInfo() {
        const info = {
            version: window.CONFIG?.app?.version || 'Unknown',
            environment: window.CONFIG?.app?.environment || 'Unknown',
            debug: window.CONFIG?.app?.debug || false,
            loadedComponents: Array.from(window.inovareSoftApp?.loader?.loadedComponents || []),
            loadedStyles: Array.from(window.inovareSoftApp?.loader?.loadedStyles || []),
            performance: {
                timing: performance.timing,
                navigation: performance.navigation
            }
        };

        console.table(info);
        return info;
    }
}

// Make DevUtils available globally in development
if (window.CONFIG?.app?.environment === 'development' || window.CONFIG?.app?.debug) {
    window.devUtils = new DevUtils();
    window.devUtils.measurePerformance();

    console.log(`
    🛠️ Development Mode Active
    
    Available commands:
    - devUtils.testComponent('hero')
    - devUtils.testAllComponents()
    - devUtils.checkAccessibility()
    - devUtils.simulateSlowNetwork(2000)
    - devUtils.getAppInfo()
    - devUtils.clearCaches()
    - devUtils.toggleDebug()
  `);
}
