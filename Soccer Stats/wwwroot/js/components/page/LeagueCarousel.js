export class LeagueCarousel extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    connectedCallback() {
        const league = this.getAttribute('league');
        const matches = JSON.parse(this.getAttribute('matches'));

        this.shadowRoot.innerHTML = `
                    <style>
                        :host {
                            display: block;
                            margin-bottom: 2rem;
                        }
                        h3 {
                            margin-bottom: 1rem;
                            color: white;
                            font-size: 1.25rem;
                            font-weight: bold;
                            padding: 0 0.5rem;
                        }
                        .carousel-container {
                            position: relative;
                        }
                        .carousel {
                            display: flex;
                            overflow-x: auto;
                            scroll-snap-type: x mandatory;
                            -webkit-overflow-scrolling: touch;
                            scrollbar-width: none;
                            -ms-overflow-style: none;
                            padding: 0.5rem;
                            gap: 1rem;
                        }
                        .carousel::-webkit-scrollbar {
                            display: none;
                        }
                        match-tile {
                            flex: 0 0 calc(50% - 1rem);
                            scroll-snap-align: start;
                        }
                        @media (max-width: 768px) {
                            match-tile {
                                flex: 0 0 calc(100% - 1rem);
                            }
                        }
                        .nav-button {
                            position: absolute;
                            top: 50%;
                            transform: translateY(-50%);
                            background-color: rgba(255, 255, 255, 0.9);
                            color: #ff3e1d;
                            border: none;
                            width: 40px;
                            height: 40px;
                            border-radius: 50%;
                            cursor: pointer;
                            z-index: 1;
                            display: ${this.isMobile ? 'none' : 'flex'};
                            align-items: center;
                            justify-content: center;
                            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                        }
                        .nav-button:hover {
                            background-color: #fff;
                        }
                        .nav-button.prev {
                            left: 0.5rem;
                        }
                        .nav-button.next {
                            right: 0.5rem;
                        }
                    </style>
                    <h3>${league}</h3>
                    <div class="carousel-container">
                        <button class="nav-button prev" aria-label="Previous matches">←</button>
                        <div class="carousel">
                            ${matches.map(match => `<match-tile match='${JSON.stringify(match)}'"></match-tile>`).join('')}
                        </div>
                        <button class="nav-button next" aria-label="Next matches">→</button>
                    </div>
                `;

        if (!this.isMobile) {
            this.setupScrolling();
        }
    }

    setupScrolling() {
        const carousel = this.shadowRoot.querySelector('.carousel');
        const prevButton = this.shadowRoot.querySelector('.nav-button.prev');
        const nextButton = this.shadowRoot.querySelector('.nav-button.next');

        prevButton.addEventListener('click', () => this.scroll(-1));
        nextButton.addEventListener('click', () => this.scroll(1));

        this.updateNavButtons();
        carousel.addEventListener('scroll', () => this.updateNavButtons());
        window.addEventListener('resize', () => this.updateNavButtons());
    }

    scroll(direction) {
        const carousel = this.shadowRoot.querySelector('.carousel');
        const scrollAmount = carousel.offsetWidth * 0.8 * direction;
        carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }

    updateNavButtons() {
        const carousel = this.shadowRoot.querySelector('.carousel');
        const prevButton = this.shadowRoot.querySelector('.nav-button.prev');
        const nextButton = this.shadowRoot.querySelector('.nav-button.next');

        prevButton.style.display = carousel.scrollLeft > 0 ? 'flex' : 'none';
        nextButton.style.display =
            carousel.scrollLeft < carousel.scrollWidth - carousel.offsetWidth ? 'flex' : 'none';
    }
}

customElements.define('league-carousel', LeagueCarousel);