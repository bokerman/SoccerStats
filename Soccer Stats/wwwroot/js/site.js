class MyCustomComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
      <style>
        p {
          color: #333;
          font-family: Arial, sans-serif;
          text-align: center;
          font-size: 1rem;
        }
        button {
          width: 90%;
          max-width: 300px;
          margin: 10px auto;
          padding: 1rem;
          font-size: 1rem;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        button:hover {
          background-color: #0056b3;
        }
        #data {
          margin-top: 10px;
          font-size: 0.9rem;
          color: #555;
          text-align: center;
        }
      </style>
      <p>Fetch Data from API:</p>
      <button id="fetchData">Fetch Data</button>
      <div id="data"></div>
    `;

        this.dataElement = this.shadowRoot.querySelector('#data');
        this.shadowRoot.querySelector('#fetchData').addEventListener('click', async () => {
            this.fetchData();
        });
    }

    async fetchData() {
        this.dataElement.textContent = 'Loading...';
        try {
            const response = await fetch('https://api.example.com/data');
            const data = await response.json();
            this.dataElement.textContent = JSON.stringify(data);
        } catch (error) {
            this.dataElement.textContent = 'Error fetching data';
            console.error(error);
        }
    }
}

customElements.define('my-custom-component', MyCustomComponent);

class MyOtherComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
      <style>
        p {
          color: #333;
          font-family: Arial, sans-serif;
          text-align: center;
          font-size: 1rem;
        }
      </style>
      <p>I am optimized for mobile!</p>
    `;
    }
}

customElements.define('my-other-component', MyOtherComponent);