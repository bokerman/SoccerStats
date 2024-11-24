export class Loader extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
                    <style>
                        .loader {
                            border: 4px solid rgba(255, 255, 255, 0.3);
                            border-radius: 50%;
                            border-top: 4px solid #ffffff;
                            width: 40px;
                            height: 40px;
                            animation: spin 1s linear infinite;
                        }
                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }
                    </style>
                    <div class="loader"></div>
                `;
    }
}

customElements.define('loader-component', Loader);