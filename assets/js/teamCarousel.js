// Team Carousel Functionality
class TeamCarousel {
    constructor() {
        this.currentIndex = 0;
        this.teamGrid = null;
        this.indicators = null;
        this.cards = [];
        this.cardsPerView = 3;
        this.totalCards = 0;
        this.maxIndex = 0;

        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            // DOM is already ready, setup immediately
            setTimeout(() => this.setup(), 100);
        }
    }

    setup() {
        this.teamGrid = document.getElementById('teamGrid');
        this.indicators = document.getElementById('carouselIndicators');

        if (!this.teamGrid || !this.indicators) {
            console.warn('Team carousel elements not found, retrying...');
            // Retry after a short delay
            setTimeout(() => this.setup(), 200);
            return;
        }

        this.cards = Array.from(this.teamGrid.querySelectorAll('.team-card'));
        this.totalCards = this.cards.length;
        
        if (this.totalCards === 0) {
            console.warn('No team cards found, retrying...');
            setTimeout(() => this.setup(), 200);
            return;
        }

        this.updateCardsPerView();
        this.maxIndex = Math.max(0, this.totalCards - this.cardsPerView);
        
        // Set starting index based on screen size
        if (window.innerWidth > 768) {
            // Desktop: start with index 0 to show Omar, Kamel, Yassin (Yassin in center)
            this.currentIndex = 0;
        } else {
            // Mobile/Tablet: start with Omar (index 0 - first card)  
            this.currentIndex = 0;
        }
        
        console.log('Setup - totalCards:', this.totalCards, 'cardsPerView:', this.cardsPerView, 'maxIndex:', this.maxIndex, 'currentIndex:', this.currentIndex);

        this.createIndicators();
        this.updateView();
        this.setupResponsive();
        this.setupEventListeners();

        // Force reset to start with Omar
        this.reset();

        console.log('Team carousel initialized with', this.totalCards, 'cards, starting at index 0');
    }

    reset() {
        // Always start at index 0 for both desktop and mobile
        this.currentIndex = 0;
        this.updateView();
        console.log('Carousel reset to start at index', this.currentIndex);
    }

    setupEventListeners() {
        // Setup arrow button event listeners
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.prev());
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.next());
        }

        console.log('Event listeners setup complete');
    }

    updateCardsPerView() {
        const width = window.innerWidth;
        if (width <= 480) {
            this.cardsPerView = 1;
        } else if (width <= 768) {
            this.cardsPerView = 2;
        } else {
            this.cardsPerView = 3;
        }
        this.maxIndex = Math.max(0, this.totalCards - this.cardsPerView);
    }    createIndicators() {
        if (!this.indicators) return;
        
        this.indicators.innerHTML = '';
        const indicatorCount = Math.max(1, this.totalCards - this.cardsPerView + 1);
        
        for (let i = 0; i < indicatorCount; i++) {
            const indicator = document.createElement('div');
            indicator.className = 'carousel-indicator';
            indicator.addEventListener('click', () => this.goToSlide(i));
            this.indicators.appendChild(indicator);
        }
    }    updateView() {
        if (!this.teamGrid) return;

        const cardWidth = this.cards[0]?.offsetWidth || 280;
        const gap = window.innerWidth <= 480 ? 25 : (window.innerWidth <= 768 ? 30 : 40);
        const offset = -(this.currentIndex * (cardWidth + gap));
        
        console.log('UpdateView - currentIndex:', this.currentIndex, 'offset:', offset, 'cardWidth:', cardWidth, 'gap:', gap);
        
        this.teamGrid.style.transform = `translateX(${offset}px)`;
        
        // Update indicators
        const indicators = this.indicators?.querySelectorAll('.carousel-indicator');
        indicators?.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentIndex);
        });
    }

    next() {
        console.log('Next clicked, current index:', this.currentIndex, 'max index:', this.maxIndex);
        if (this.currentIndex < this.maxIndex) {
            this.currentIndex++;
            this.updateView();
        }
    }

    prev() {
        console.log('Prev clicked, current index:', this.currentIndex);
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateView();
        }
    }

    goToSlide(index) {
        if (index >= 0 && index <= this.maxIndex) {
            this.currentIndex = index;
            this.updateView();
        }
    }

    setupResponsive() {
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                this.updateCardsPerView();
                this.maxIndex = Math.max(0, this.totalCards - this.cardsPerView);
                
                // Always start at index 0 after resize
                this.currentIndex = 0;
                
                this.createIndicators();
                this.updateView();
            }, 150);
        });
    }
}

// Initialize the carousel
const teamCarousel = new TeamCarousel();

// Export for global access
window.teamCarousel = teamCarousel;
