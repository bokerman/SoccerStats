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
                            background-color: #f0f0f0;
                            border-radius: 5px;
                            overflow: hidden;
                        }
                        .switcher button {
                            flex: 1;
                            padding: 0.5rem 1rem;
                            border: none;
                            background-color: transparent;
                            cursor: pointer;
                            transition: background-color 0.3s ease;
                        }
                        .switcher button.active {
                            background-color: var(--primary-color);
                            color: white;
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