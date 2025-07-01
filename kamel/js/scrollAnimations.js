/**
 * Scroll Animation Controller
 * Handles reveal animations and parallax effects
 */

class ScrollAnimationController {
    constructor() {
        this.observers = [];
        this.animatedElements = new Set();
        this.parallaxElements = [];
        this.isInitialized = false;
    }

    /**
     * Initialize scroll animations
     */
    init() {
        if (this.isInitialized) return;

        this.setupIntersectionObserver();
        this.setupParallaxEffect();
        this.setupSmoothScrolling();
        this.addRevealAttributes();

        this.isInitialized = true;
        console.log('🎬 Scroll animations initialized');
    }

    /**
     * Setup intersection observer for reveal animations
     */
    setupIntersectionObserver() {
        const options = {
            threshold: 0.05, // Lower threshold for better visibility detection
            rootMargin: '50px 0px -20px 0px' // More generous margins
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.revealElement(entry.target);
                    // Don't unobserve immediately, wait for animation to complete
                    setTimeout(() => {
                        observer.unobserve(entry.target);
                    }, 500);
                }
            });
        }, options);

        // Use a delay to ensure DOM is fully loaded
        setTimeout(() => {
            // Observe all elements with data-reveal attribute
            const revealElements = document.querySelectorAll('[data-reveal]');
            console.log(`🔍 Found ${revealElements.length} elements to animate`);

            revealElements.forEach((el, index) => {
                observer.observe(el);
                console.log(`👀 Observing element ${index + 1}:`, el.tagName, el.className);
            });
        }, 100);

        this.observers.push(observer);
    }

    /**
     * Reveal an element with animation
     */
    revealElement(element) {
        if (this.animatedElements.has(element)) return;

        console.log('🎭 Revealing element:', element.tagName, element.className);

        element.classList.add('revealed');
        this.animatedElements.add(element);

        // Add staggered animation for child elements
        const children = element.querySelectorAll('[data-reveal]');
        children.forEach((child, index) => {
            setTimeout(() => {
                if (!child.classList.contains('revealed')) {
                    child.classList.add('revealed');
                    console.log(`   ↳ Child revealed: ${child.tagName}`);
                }
            }, index * 100);
        });
    }

    /**
     * Fallback function to manually reveal all sections
     */
    revealAllSections() {
        const hiddenElements = document.querySelectorAll('[data-reveal]:not(.revealed)');
        console.log(`🔧 Fallback: Revealing ${hiddenElements.length} hidden elements`);

        hiddenElements.forEach((element, index) => {
            setTimeout(() => {
                this.revealElement(element);
            }, index * 200);
        });
    }

    /**
     * Force reveal sections that are already in viewport
     */
    forceRevealVisibleSections() {
        const elements = document.querySelectorAll('[data-reveal]:not(.revealed)');

        elements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

            if (isVisible) {
                console.log('🔧 Force revealing visible element:', element.tagName);
                this.revealElement(element);
            }
        });
    }

    /**
     * Setup parallax scrolling effect
     */
    setupParallaxEffect() {
        const parallaxElements = document.querySelectorAll('.parallax');

        if (parallaxElements.length === 0) return;

        const handleScroll = () => {
            const scrolled = window.pageYOffset;

            parallaxElements.forEach(element => {
                const rate = scrolled * -0.5;
                element.style.transform = `translate3d(0, ${rate}px, 0)`;
            });
        };

        // Use requestAnimationFrame for smooth performance
        let ticking = false;
        const optimizedScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', optimizedScroll, { passive: true });
    }

    /**
     * Setup smooth scrolling for anchor links
     */
    setupSmoothScrolling() {
        document.addEventListener('click', (e) => {
            const target = e.target.closest('a[href^="#"]');
            if (!target) return;

            e.preventDefault();

            const targetId = target.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                // Add smooth scroll with easing
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Update URL without triggering scroll
                history.pushState(null, null, `#${targetId}`);
            }
        });
    }

    /**
     * Add reveal attributes to sections automatically
     */
    addRevealAttributes() {
        const sections = document.querySelectorAll('section');

        sections.forEach((section, index) => {
            if (!section.hasAttribute('data-reveal')) {
                section.setAttribute('data-reveal', 'fade');
                section.setAttribute('data-delay', Math.min(index, 5));
            }

            // Add reveal attributes to key elements within sections
            const titles = section.querySelectorAll('h1, h2, h3');
            titles.forEach((title, i) => {
                if (!title.hasAttribute('data-reveal')) {
                    title.setAttribute('data-reveal', 'slide-up');
                    title.setAttribute('data-delay', i + 1);
                }
            });

            const cards = section.querySelectorAll('.project-card, .team-card');
            cards.forEach((card, i) => {
                if (!card.hasAttribute('data-reveal')) {
                    card.setAttribute('data-reveal', 'scale');
                    card.setAttribute('data-delay', i + 1);
                }
            });

            const buttons = section.querySelectorAll('.btn');
            buttons.forEach((btn, i) => {
                if (!btn.hasAttribute('data-reveal')) {
                    btn.setAttribute('data-reveal', 'slide-up');
                    btn.setAttribute('data-delay', i + 2);
                }
            });
        });
    }

    /**
     * Add floating animation to elements
     */
    addFloatingEffect(selector) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            element.classList.add('floating');
        });
    }

    /**
     * Add hover tilt effect to cards
     */
    addTiltEffect(selector) {
        const elements = document.querySelectorAll(selector);

        elements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;

                element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });

            element.addEventListener('mouseleave', () => {
                element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
            });
        });
    }

    /**
     * Add magnetic effect to buttons
     */
    addMagneticEffect(selector) {
        const elements = document.querySelectorAll(selector);

        elements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                element.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
            });

            element.addEventListener('mouseleave', () => {
                element.style.transform = 'translate(0, 0)';
            });
        });
    }

    /**
     * Add enhanced tilt effect for team cards
     */
    addTiltEffect() {
        const tiltElements = document.querySelectorAll('[data-tilt]');

        tiltElements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                const deltaX = (e.clientX - centerX) / (rect.width / 2);
                const deltaY = (e.clientY - centerY) / (rect.height / 2);

                const rotateX = deltaY * -10; // Max 10 degrees
                const rotateY = deltaX * 10;  // Max 10 degrees

                element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
            });

            element.addEventListener('mouseleave', () => {
                element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
            });
        });
    }

    /**
     * Add team card specific animations
     */
    addTeamCardAnimations() {
        const teamCards = document.querySelectorAll('.team-card');

        teamCards.forEach((card, index) => {
            // Add entrance animation delay
            card.style.animationDelay = `${index * 0.1}s`;

            // Add hover pulse effect on random intervals
            const pulseInterval = setInterval(() => {
                if (!card.matches(':hover')) {
                    card.classList.add('pulse');
                    setTimeout(() => {
                        card.classList.remove('pulse');
                    }, 2000);
                }
            }, 8000 + Math.random() * 4000); // Random interval between 8-12 seconds

            // Store interval ID for cleanup
            card.dataset.pulseInterval = pulseInterval;
        });

        // Add staggered social icon animations
        const socialIcons = document.querySelectorAll('.social-icon');
        socialIcons.forEach((icon, index) => {
            icon.addEventListener('mouseenter', () => {
                // Add unique hover animation based on index
                const animations = ['bounce', 'pulse', 'wiggle'];
                const animation = animations[index % animations.length];
                icon.style.animation = `${animation} 0.6s ease-in-out`;
            });

            icon.addEventListener('animationend', () => {
                icon.style.animation = '';
            });
        });
    }

    /**
     * Initialize team section specific effects
     */
    initTeamEffects() {
        this.addTiltEffect();
        this.addTeamCardAnimations();
        this.addMagneticEffect('.social-icon');
    }

    /**
     * Destroy all observers and event listeners
     */
    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers = [];
        this.animatedElements.clear();

        // Clear team card intervals
        const teamCards = document.querySelectorAll('.team-card');
        teamCards.forEach(card => {
            if (card.dataset.pulseInterval) {
                clearInterval(parseInt(card.dataset.pulseInterval));
            }
        });

        this.isInitialized = false;
    }

    /**
     * Get animation statistics
     */
    getStats() {
        return {
            observersCount: this.observers.length,
            animatedElementsCount: this.animatedElements.size,
            parallaxElementsCount: this.parallaxElements.length,
            isInitialized: this.isInitialized
        };
    }
}

// Export for use in main app
window.ScrollAnimationController = ScrollAnimationController;
