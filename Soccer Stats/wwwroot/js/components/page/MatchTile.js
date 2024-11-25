export class MatchTile extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    formatDateTime(dateTimeString) {
        const gameDate = new Date(dateTimeString);
        const now = new Date();

        // Check if the game is today
        if (gameDate.toDateString() === now.toDateString()) {
            const currentHour = now.getHours();
            if (currentHour < 18) {
                return 'Today';
            } else {
                return 'Tonight';
            }
        }

        // For games not today, return the formatted date and time
        return gameDate.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    }

    connectedCallback() {
        const match = JSON.parse(this.getAttribute('match'));

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    background: linear-gradient(135deg, #ff3e1d 0%, #ff4d4d 100%);
                    border-radius: 16px;
                    padding: 1rem;
                    color: white;
                    position: relative;
                    overflow: hidden;
                    min-height: 110px;
                }
                .match-info {
                    position: relative;
                    z-index: 1;
                }
                .match-time {
                    font-size: 0.9rem;
                    margin-bottom: 0.5rem;
                }
                .team-names {
                    font-size: 1.2rem;
                    font-weight: bold;
                    line-height: 1.4;
                }
                .odds-container {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 1rem;
                }
                .odd-box {
                    background-color: white;
                    border-radius: 8px;
                    padding: 0.5rem;
                    display: flex;
                    align-items: center;
                    min-width: 60px;
                }
                .odd-type {
                    color: #8f8686;
                    font-size: 1.2rem;
                    margin-right: 1.8rem;
                    font-weight: 700;
                }
                .odd-value {
                    color: #4CAF50;
                    font-weight: bold;
                    font-size: 1.1rem;
                }
            </style>
            <div class="match-info">
                <div class="match-time">${this.formatDateTime(match.gameTime)}</div>
                <div class="team-names">
                    <div>${match.homeTeamName}</div>
                    <div>${match.awayTeamName}</div>
                </div>
            </div>
            <div class="odds-container">
                <div class="odd-box">
                    <span class="odd-type">1</span>
                    <span class="odd-value">${match.homeTeamWinOdds}</span>
                </div>
                <div class="odd-box">
                    <span class="odd-type">X</span>
                    <span class="odd-value">${match.drawOdds}</span>
                </div>
                <div class="odd-box">
                    <span class="odd-type">2</span>
                    <span class="odd-value">${match.awayTeamWinOdds}</span>
                </div>
            </div>
        `;
    }
}


customElements.define('match-tile', MatchTile);