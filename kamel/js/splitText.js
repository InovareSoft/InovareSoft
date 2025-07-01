/**
 * Enhanced Split Text Animation Controller
 * Creates modern character and word-based text animations inspired by ReactBits
 */

class SplitTextAnimation {
    constructor() {
        this.animatedElements = new Set();
        this.animations = {
            'fade-up': {
                initial: 'opacity: 0; transform: translateY(50px);',
                animate: 'opacity: 1; transform: translateY(0);'
            },
            'slide-up': {
                initial: 'opacity: 0; transform: translateY(100px) rotateX(90deg);',
                animate: 'opacity: 1; transform: translateY(0) rotateX(0deg);'
            },
            'scale-up': {
                initial: 'opacity: 0; transform: scale(0.8) translateY(20px);',
                animate: 'opacity: 1; transform: scale(1) translateY(0);'
            },
            'blur-in': {
                initial: 'opacity: 0; filter: blur(10px); transform: translateY(30px);',
                animate: 'opacity: 1; filter: blur(0px); transform: translateY(0);'
            },
            'rotate-in': {
                initial: 'opacity: 0; transform: rotateY(90deg) translateX(20px);',
                animate: 'opacity: 1; transform: rotateY(0deg) translateX(0);'
            },
            'elastic': {
                initial: 'opacity: 0; transform: scaleY(0) translateY(50px);',
                animate: 'opacity: 1; transform: scaleY(1) translateY(0);',
                timing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
            }
        };
    }

    /**
     * Initialize split text animations
     */
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupAnimations());
        } else {
            this.setupAnimations();
        }
    }

    /**
     * Setup all split text animations
     */
    setupAnimations() {
        // Find elements with split text classes
        const splitTextElements = document.querySelectorAll('.split-text');
        const splitWordElements = document.querySelectorAll('.split-word');

        splitTextElements.forEach(element => this.setupCharacterSplit(element));
        splitWordElements.forEach(element => this.setupWordSplit(element));

        // Auto-animate hero text after page load
        setTimeout(() => {
            this.animateHeroText();
        }, 1000); // Reduced from 1500ms to 1000ms

        console.log('🔤 Split text animations initialized');
    }

    /**
     * Split text into individual characters
     */
    setupCharacterSplit(element) {
        const text = element.textContent;
        const htmlContent = element.innerHTML;
        
        // Check if element contains HTML tags
        if (htmlContent !== text) {
            this.setupCharacterSplitWithHTML(element);
        } else {
            this.setupCharacterSplitPlain(element);
        }
    }

    /**
     * Split plain text into characters
     */
    setupCharacterSplitPlain(element) {
        const text = element.textContent;
        const chars = text.split('').map((char, index) => {
            const span = document.createElement('span');
            span.className = 'char';
            span.textContent = char === ' ' ? '\u00A0' : char; // Non-breaking space
            span.style.setProperty('--char-index', index);
            return span;
        });

        element.innerHTML = '';
        chars.forEach(char => element.appendChild(char));
    }

    /**
     * Split text with HTML tags into characters with animation support
     */
    setupCharacterSplitWithHTML(element) {
        const animationType = element.dataset.splitAnimation || 'slide-up';
        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        const textNodes = [];
        let node;
        while (node = walker.nextNode()) {
            textNodes.push(node);
        }

        let globalCharIndex = 0;
        textNodes.forEach(textNode => {
            const parent = textNode.parentNode;
            const text = textNode.textContent;
            const chars = text.split('').map((char, localIndex) => {
                const span = document.createElement('span');
                span.className = parent.classList.contains('highlight') 
                    ? `char highlight char-${animationType}` 
                    : `char char-${animationType}`;
                span.textContent = char === ' ' ? '\u00A0' : char;
                span.style.setProperty('--char-index', globalCharIndex);
                span.style.setProperty('--local-index', localIndex);
                
                // Apply initial animation state
                if (this.animations[animationType]) {
                    span.setAttribute('style', 
                        span.getAttribute('style') + ';' + this.animations[animationType].initial
                    );
                }
                
                globalCharIndex++;
                return span;
            });

            const fragment = document.createDocumentFragment();
            chars.forEach(char => fragment.appendChild(char));
            parent.replaceChild(fragment, textNode);
        });
    }

    /**
     * Split text into words
     */
    setupWordSplit(element) {
        const text = element.textContent;
        const words = text.split(' ').map((word, index) => {
            const span = document.createElement('span');
            span.className = 'word';
            span.textContent = word;
            span.style.setProperty('--word-index', index);
            return span;
        });

        element.innerHTML = '';
        words.forEach((word, index) => {
            element.appendChild(word);
            if (index < words.length - 1) {
                element.appendChild(document.createTextNode(' '));
            }
        });
    }

    /**
     * Animate hero text with enhanced effects
     */
    animateHeroText() {
        const heroTitle = document.querySelector('.hero-content h1');
        if (heroTitle && !this.animatedElements.has(heroTitle)) {
            // Set animation type for hero
            heroTitle.dataset.splitAnimation = 'blur-in';
            heroTitle.classList.add('split-text');
            this.setupCharacterSplit(heroTitle);
            
            // Trigger animation with much faster timing
            setTimeout(() => {
                heroTitle.classList.add('animate');
                this.animateCharacters(heroTitle, 'blur-in');
                this.animatedElements.add(heroTitle);
                console.log('🎭 Enhanced hero text animation started');
            }, 200); // Much faster start (was 600ms)
        }
    }

    /**
     * Animate characters with specific animation type
     */
    animateCharacters(element, animationType = 'slide-up') {
        const chars = element.querySelectorAll('.char');
        const animation = this.animations[animationType];
        
        if (!animation) return;

        chars.forEach((char, index) => {
            const delay = index * 0.015; // Much faster: 15ms stagger
            const duration = '0.4s'; // Faster duration
            const timing = animation.timing || 'cubic-bezier(0.34, 1.56, 0.64, 1)';
            
            setTimeout(() => {
                char.style.transition = `all ${duration} ${timing}`;
                // Apply animation styles directly
                if (animationType === 'blur-in') {
                    char.style.opacity = '1';
                    char.style.filter = 'blur(0px)';
                    char.style.transform = 'translateY(0)';
                } else {
                    char.setAttribute('style', 
                        char.getAttribute('style').replace(animation.initial, animation.animate)
                    );
                }
            }, delay * 1000);
        });
    }

    /**
     * Animate specific element
     */
    animateElement(element) {
        if (!this.animatedElements.has(element)) {
            element.classList.add('animate');
            this.animatedElements.add(element);
        }
    }

    /**
     * Reset animation for element
     */
    resetElement(element) {
        element.classList.remove('animate');
        this.animatedElements.delete(element);
    }

    /**
     * Setup intersection observer for scroll-triggered animations
     */
    setupScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        });

        // Observe all split text elements except hero (which auto-animates)
        const elements = document.querySelectorAll('.split-text:not(.hero-content .split-text), .split-word');
        elements.forEach(element => observer.observe(element));
    }

    /**
     * Create custom split animation with advanced options
     */
    createCustomAnimation(element, type = 'char', options = {}) {
        const defaults = {
            delay: 30,
            duration: 800,
            easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
            animation: 'slide-up',
            autoPlay: true,
            threshold: 0.1
        };

        const config = { ...defaults, ...options };

        // Set animation type
        element.dataset.splitAnimation = config.animation;

        if (type === 'char') {
            element.classList.add('split-text');
            this.setupCharacterSplit(element);
        } else {
            element.classList.add('split-word');
            this.setupWordSplit(element);
        }

        if (config.autoPlay) {
            setTimeout(() => {
                this.animateCharacters(element, config.animation);
                this.animatedElements.add(element);
            }, 100);
        }

        return element;
    }

    /**
     * Add scroll reveal animations for split text
     */
    addScrollReveal(element, animationType = 'fade-up', options = {}) {
        const config = {
            threshold: 0.2,
            delay: 30,
            ...options
        };

        element.dataset.splitAnimation = animationType;
        
        if (!element.classList.contains('split-text') && !element.classList.contains('split-word')) {
            element.classList.add('split-text');
            this.setupCharacterSplit(element);
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animatedElements.has(element)) {
                    setTimeout(() => {
                        this.animateCharacters(element, animationType);
                        this.animatedElements.add(element);
                    }, 200);
                }
            });
        }, { threshold: config.threshold });

        observer.observe(element);
        return observer;
    }

    /**
     * Reset and replay animation
     */
    replayAnimation(element) {
        if (!this.animatedElements.has(element)) return;

        const chars = element.querySelectorAll('.char');
        const animationType = element.dataset.splitAnimation || 'slide-up';
        const animation = this.animations[animationType];

        // Reset to initial state
        chars.forEach(char => {
            char.setAttribute('style', 
                char.getAttribute('style') + ';' + animation.initial
            );
        });

        // Remove from animated set
        this.animatedElements.delete(element);

        // Replay after short delay
        setTimeout(() => {
            this.animateCharacters(element, animationType);
            this.animatedElements.add(element);
        }, 100);
    }
}

// Initialize split text animations
const splitTextAnimation = new SplitTextAnimation();
splitTextAnimation.init();

// Export for global access
window.SplitTextAnimation = SplitTextAnimation;
window.splitTextAnimation = splitTextAnimation;
