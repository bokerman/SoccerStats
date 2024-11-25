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

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                }
                .content-container {
                    min-height: 200px;
                    position: relative;
                }
                .leagues-placeholder {
                    opacity: 1;
                    transition: opacity 0.3s ease;
                }
                .leagues-placeholder.loading {
                    opacity: 0.5;
                }
                .loader-container {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background-color: rgba(0, 0, 0, 0.5);
                    z-index: 1000;
                }
                .loader {
                    border: 4px solid #f3f3f3;
                    border-top: 4px solid #3498db;
                    border-radius: 50%;
                    width: 50px;
                    height: 50px;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                .skeleton-text {
                    height: 20px;
                    background: #f0f0f0;
                    margin-bottom: 10px;
                    border-radius: 4px;
                }
                .skeleton-match {
                    height: 100px;
                    background: #f0f0f0;
                    margin-bottom: 10px;
                    border-radius: 8px;
                }
            </style>
            <match-switcher></match-switcher>
            <div class="content-container">
                <div class="loader-container" style="display: none;">
                    <div class="loader"></div>
                </div>
                <div class="leagues-placeholder">
                    <div id="leagues-container">
                        ${this.generatePlaceholderContent()}
                    </div>
                </div>
            </div>
        `;

        const switcher = this.shadowRoot.querySelector('match-switcher');
        switcher.addEventListener('switch', (event) => {
            this.currentMatchType = event.detail;
            this.fetchMatches(this.currentMatchType);
        });
    }

    generatePlaceholderContent() {
        return Array(3).fill().map(() => `
            <div class="league-placeholder">
                <div class="skeleton-text" style="width: 60%;"></div>
                <div class="skeleton-match"></div>
                <div class="skeleton-match"></div>
            </div>
        `).join('');
    }

    async fetchMatches(matchType) {
        this.isLoading = true;
        this.showLoader();

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
            this.hideLoader();
        }
    }

    showLoader() {
        const loader = this.shadowRoot.querySelector('.loader-container');
        loader.style.display = 'flex';
        const leaguesPlaceholder = this.shadowRoot.querySelector('.leagues-placeholder');
        leaguesPlaceholder.classList.add('loading');
    }

    hideLoader() {
        const loader = this.shadowRoot.querySelector('.loader-container');
        loader.style.display = 'none';
        const leaguesPlaceholder = this.shadowRoot.querySelector('.leagues-placeholder');
        leaguesPlaceholder.classList.remove('loading');
    }

    renderLeagues() {
        const container = this.shadowRoot.querySelector('#leagues-container');
        container.innerHTML = this.leagues.map(league => `
            <league-carousel league='${JSON.stringify(league).replace(/'/g, "") }'></league-carousel>
        `).join('');
    }

    renderError() {
        const container = this.shadowRoot.querySelector('#leagues-container');
        container.innerHTML = `
            <div class="error-message">
                Failed to load matches. Please try again later.
            </div>
        `;
    }
}

customElements.define('native-stats-app', NativeStatsApp);
