export class LeagueCarousel extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.league = null;
    }

    connectedCallback() {
        let leagueData = this.getAttribute('league');
        try {
            this.league = JSON.parse(leagueData);    
        }
        catch (error) {
            console.log(leagueData);
        }

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    margin-bottom: 2rem;
                }
                h3 {
                    margin-bottom: 0px;
                    color: white;
                    font-size: 1.25rem;
                    font-weight: bold;
                    padding: 0 0.5rem;
                }
                .carousel-container {
                    position: relative;
                    overflow: hidden;
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
                .match-wrapper {
                    flex: 0 0 calc(50% - 1rem);
                    scroll-snap-align: start;
                }
                @media (max-width: 768px) {
                    .match-wrapper {
                        flex: 0 0 calc(100% - 1rem);
                    }
                }
            </style>
            <h3>${this.league.leagueName}</h3>
            <div id="carousel-container" class="carousel-container">
                <div class="carousel">
                    ${this.league.matches.map(match => `
                        <div class="match-wrapper">
                            <match-tile match='${JSON.stringify(match)}'></match-tile>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
}

customElements.define('league-carousel', LeagueCarousel);