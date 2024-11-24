﻿export class MatchTile extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
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
                            min-height: 200px;
                        }
                        .match-info {
                            position: relative;
                            z-index: 1;
                        }
                        .play-icon {
                            position: absolute;
                            top: 0;
                            left: 0;
                            background-color: rgba(0, 0, 0, 0.5);
                            color: white;
                            padding: 0.25rem 0.5rem;
                            border-radius: 0 0 8px 0;
                            font-size: 1rem;
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
                            color: #333;
                            font-size: 0.8rem;
                            margin-right: 0.5rem;
                        }
                        .odd-value {
                            color: #4CAF50;
                            font-weight: bold;
                            font-size: 1.1rem;
                        }
                    </style>
                    <div class="match-info">
                        <div class="play-icon">▶</div>
                        <div class="match-time">Tonight | 21:00</div>
                        <div class="team-names">
                            <div>${match.homeTeam}</div>
                            <div>${match.awayTeam}</div>
                        </div>
                    </div>
                    <div class="odds-container">
                        <div class="odd-box">
                            <span class="odd-type">1</span>
                            <span class="odd-value">${match.homeWin}</span>
                        </div>
                        <div class="odd-box">
                            <span class="odd-type">X</span>
                            <span class="odd-value">${match.draw}</span>
                        </div>
                        <div class="odd-box">
                            <span class="odd-type">2</span>
                            <span class="odd-value">${match.awayWin}</span>
                        </div>
                    </div>
                `;
        }
    }


customElements.define('match-tile', MatchTile);