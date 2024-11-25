export class LeagueCarousel extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const league = JSON.parse(this.getAttribute('league'));

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
            </style>
            <h3>${league.leagueName}</h3>
            <div class="carousel-container">
                <div class="carousel">
                    ${league.matches.map(match => `<match-tile match='${JSON.stringify(match)}'></match-tile>`).join('')}
                </div>
            </div>
        `;
    }
}

customElements.define('league-carousel', LeagueCarousel);