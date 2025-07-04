/**
 * Component Loader Module
 * Handles dynamic loading of HTML sections and their associated CSS
 */

class ComponentLoader {
    constructor() {
        this.loadedComponents = new Set();
        this.loadedStyles = new Set();
    }

    /**
     * Load CSS file dynamically
     * @param {string} cssPath - Path to the CSS file
     * @returns {Promise<void>}
     */
    async loadCSS(cssPath) {
        if (this.loadedStyles.has(cssPath)) {
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = cssPath;

            link.onload = () => {
                this.loadedStyles.add(cssPath);
                resolve();
            };

            link.onerror = () => {
                reject(new Error(`Failed to load CSS: ${cssPath}`));
            };

            document.head.appendChild(link);
        });
    }

    /**
     * Load HTML component
     * @param {string} htmlPath - Path to the HTML file
     * @returns {Promise<string>}
     */
    async loadHTML(htmlPath) {
        try {
            const response = await fetch(htmlPath);

            if (!response.ok) {
                throw new Error(`Failed to load ${htmlPath}: ${response.status} ${response.statusText}`);
            }

            return await response.text();
        } catch (error) {
            console.error(`Error loading HTML component: ${htmlPath}`, error);
            throw error;
        }
    }

    /**
     * Load a complete component (HTML + CSS)
     * @param {string} componentName - Name of the component
     * @param {string} targetId - ID of the target container
     * @returns {Promise<void>}
     */
    async loadComponent(componentName, targetId) {
        if (this.loadedComponents.has(componentName)) {
            console.warn(`Component ${componentName} is already loaded`);
            return;
        }

        try {
            // Load CSS first to prevent FOUC (Flash of Unstyled Content)
            await this.loadCSS(`assets/styles/${componentName}.css`);

            // Load HTML content
            const htmlContent = await this.loadHTML(`layouts/${componentName}.html`);

            // Insert HTML into target container
            const targetElement = document.getElementById(targetId);
            if (!targetElement) {
                throw new Error(`Target element with ID '${targetId}' not found`);
            }

            targetElement.innerHTML = htmlContent;

            // Execute any scripts in the loaded HTML
            this.executeScripts(targetElement);

            this.loadedComponents.add(componentName);

            // Initialize component-specific JavaScript
            await this.initializeComponentJS(componentName);

            console.log(`✅ Component '${componentName}' loaded successfully`);
        } catch (error) {
            console.error(`❌ Failed to load component '${componentName}':`, error);
            throw error;
        }
    }

    /**
     * Load multiple components in sequence
     * @param {Array<{name: string, target: string}>} components - Array of component configs
     * @returns {Promise<void>}
     */
    async loadComponents(components) {
        const loadPromises = components.map(({ name, target }) =>
            this.loadComponent(name, target)
        );

        try {
            await Promise.all(loadPromises);
            console.log('🎉 All components loaded successfully');
        } catch (error) {
            console.error('💥 Error loading components:', error);
            throw error;
        }
    }

    /**
     * Show loading indicator
     * @param {string} targetId - ID of the target element
     */
    showLoading(targetId) {
        const target = document.getElementById(targetId);
        if (target) {
            target.innerHTML = `
        <div class="loading-spinner" style="
          display: flex;
          justify-content: center;
          align-items: center;
          height: 200px;
          font-size: 18px;
          color: #666;
        ">
          <div style="
            border: 3px solid #f3f3f3;
            border-top: 3px solid #1d849f;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin-right: 15px;
          "></div>
          Loading component...
        </div>
        <style>
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        </style>
      `;
        }
    }

    /**
     * Initialize smooth scrolling for anchor links
     */
    initSmoothScrolling() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('a[href^="#"]')) {
                e.preventDefault();
                const targetId = e.target.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    }

    /**
     * Initialize component-specific JavaScript
     * @param {string} componentName - Name of the component
     * @returns {Promise<void>}
     */
    async initializeComponentJS(componentName) {
        try {
            switch (componentName) {
                case 'team':
                    await this.initializeTeamSwiper();
                    break;
                // Add other component initializations here as needed
                default:
                    // No specific initialization needed
                    break;
            }
        } catch (error) {
            console.error(`❌ Failed to initialize JS for component '${componentName}':`, error);
            throw error;
        }
    }

    /**
     * Initialize Team Swiper after the team component is loaded
     * @returns {Promise<void>}
     */
    async initializeTeamSwiper() {
        return new Promise((resolve, reject) => {
            // Wait a bit for DOM to be ready
            setTimeout(() => {
                try {
                    // Check if Swiper is available and wrapper exists
                    if (typeof Swiper === 'undefined') {
                        console.error('Swiper library is not loaded');
                        reject(new Error('Swiper library is not loaded'));
                        return;
                    }

                    const wrapperElement = document.querySelector(".wrapper");
                    if (!wrapperElement) {
                        console.error('Swiper wrapper element not found');
                        reject(new Error('Swiper wrapper element not found'));
                        return;
                    }

                    // Initialize Swiper with the same configuration as teamCarousel.js
                    new Swiper(".wrapper", {
                        loop: true,
                        spaceBetween: 30,
                        centeredSlides: true,
                        slidesPerView: 1,
                        loopFillGroupWithBlank: false,
                        loopAdditionalSlides: 2,

                        // Autoplay
                        autoplay: {
                            delay: 2500,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true,
                        },

                        // Pagination bullets
                        pagination: {
                            el: ".swiper-pagination",
                            clickable: true,
                            dynamicBullets: true,
                        },

                        // Navigation arrows
                        navigation: {
                            nextEl: ".swiper-button-next",
                            prevEl: ".swiper-button-prev",
                        },

                        // Responsive breakpoints
                        breakpoints: {
                            0: {
                                slidesPerView: 1,
                                spaceBetween: 10,
                                centeredSlides: true,
                                loop: true,
                                navigation: false,
                            },
                            768: {
                                slidesPerView: 1,
                                spaceBetween: 30,
                                centeredSlides: false,
                                loop: false,
                                navigation: {
                                    nextEl: ".swiper-button-next",
                                    prevEl: ".swiper-button-prev",
                                },
                            },
                            1024: {
                                slidesPerView: 3,
                                spaceBetween: 30,
                                centeredSlides: false,
                                loop: true,
                                navigation: {
                                    nextEl: ".swiper-button-next",
                                    prevEl: ".swiper-button-prev",
                                },
                            },
                        },
                    });


                    console.log('✅ Team Swiper initialized successfully');
                    resolve();
                } catch (error) {
                    console.error('❌ Error initializing Team Swiper:', error);
                    reject(error);
                }
            }, 100); // Small delay to ensure DOM is ready
        });
    }

    /**
     * Execute scripts in loaded HTML content
     * @param {HTMLElement} container - Container element with loaded HTML
     */
    executeScripts(container) {
        const scripts = container.querySelectorAll('script');
        scripts.forEach(oldScript => {
            const newScript = document.createElement('script');

            // Copy attributes
            Array.from(oldScript.attributes).forEach(attr => {
                newScript.setAttribute(attr.name, attr.value);
            });

            // Copy script content
            newScript.textContent = oldScript.textContent;

            // Replace old script with new one to execute it
            oldScript.parentNode.replaceChild(newScript, oldScript);
        });
    }
}

// Export for use in other modules
window.ComponentLoader = ComponentLoader;
