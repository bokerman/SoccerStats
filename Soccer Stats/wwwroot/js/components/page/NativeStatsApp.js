export class NativeStatsApp extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.leagues = [];
        this.currentMatchType = 'recent';
        this.isLoading = false;
    }

    connectedCallback() {
        this.render();
        this.fetchMatches(this.currentMatchType);
    }

    async fetchMatches(matchType) {
        this.isLoading = true;
        this.renderLoader();

        try {
            const response = await fetch(`/matches/${matchType}`);
            if (!response.ok) {
                throw new Error('Failed to fetch matches');
            }
            this.leagues = await response.json();
            this.renderLeagues();
        } catch (error) {
            console.error('Error fetching matches:', error);
            this.renderError();
        } finally {
            this.isLoading = false;
        }
    }

    render() {
        this.shadowRoot.innerHTML = `
                    <style>
                        :host {
                            display: block;
                        }
                        h2 {
                            font-size: 2rem;
                            margin-bottom: 1rem;
                            color: white;
                        }
                        .error-message {
                            color: white;
                            background-color: #ff4d4d;
                            padding: 1rem;
                            border-radius: 4px;
                            margin-top: 1rem;
                        }
                        .loader-container {
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            min-height: 110px;
                        }
                    </style>
                    <match-switcher></match-switcher>
                    <div id="content-container"></div>
                `;

        const switcher = this.shadowRoot.querySelector('match-switcher');

        switcher.addEventListener('switch', (event) => {
            this.currentMatchType = event.detail;
            this.fetchMatches(this.currentMatchType);
        });
    }

    renderLoader() {
        const contentContainer = this.shadowRoot.querySelector('#content-container');
        contentContainer.innerHTML = `
                    <div class="loader-container">
                        <loader-component></loader-component>
                    </div>
                `;
    }

    renderLeagues() {
        const contentContainer = this.shadowRoot.querySelector('#content-container');
        contentContainer.innerHTML = '<div id="leagues-container"></div>';
        const leaguesContainer = this.shadowRoot.querySelector('#leagues-container');

        this.leagues.forEach((league) => {
            const carousel = document.createElement('league-carousel');
            carousel.setAttribute('league', JSON.stringify(league));
            leaguesContainer.appendChild(carousel);
        });
    }

    renderError() {
        const contentContainer = this.shadowRoot.querySelector('#content-container');
        contentContainer.innerHTML = `
                    <div class="error-message">
                        Failed to load matches. Please try again later.
                    </div>
                `;
    }
}

customElements.define('native-stats-app', NativeStatsApp);