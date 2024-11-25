export class MatchSwitcher extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = `
                <style>
                    :host {
                        display: block;
                        margin-bottom: 1rem;
                    }
                    .switcher {
                        display: flex;
                        background-color: rgba(255, 255, 255, 0.1);
                        border-radius: 0.8em;
                        overflow: hidden;
                        border: 2px solid white;
                    }
                    .switcher button {
                        flex: 1;
                        padding: 0.75rem 1.5rem;
                        border: none;
                        background-color: transparent;
                        color: white;
                        font-weight: bold;
                        text-transform: uppercase;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    }
                    .switcher button:first-child {
                        border-right: 1px solid rgba(255, 255, 255, 0.3);
                    }
                    .switcher button:last-child {
                        border-left: 1px solid rgba(255, 255, 255, 0.3);
                    }
                    .switcher button:hover {
                        background-color: rgba(255, 255, 255, 0.2);
                    }
                    .switcher button.active {
                        background-color: rgba(255, 255, 255, 0.3);
                    }
                </style>
                <div class="switcher" role="tablist">
                    <button role="tab" class="active" aria-selected="true" id="recent">Recent Matches</button>
                    <button role="tab" aria-selected="false" id="upcoming">Upcoming Matches</button>
                </div>
            `;

        this.switcherButtons = this.shadowRoot.querySelectorAll('button');
        this.switcherButtons.forEach(button => {
            button.addEventListener('click', () => this.switchTab(button));
        });
    }

    switchTab(clickedButton) {
        this.switcherButtons.forEach(button => {
            const isActive = button === clickedButton;
            button.classList.toggle('active', isActive);
            button.setAttribute('aria-selected', isActive);
        });
        this.dispatchEvent(new CustomEvent('switch', { detail: clickedButton.id }));
    }
}

customElements.define('match-switcher', MatchSwitcher);