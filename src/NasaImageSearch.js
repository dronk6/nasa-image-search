import { html, css, LitElement } from 'lit';
import '@lrnwebcomponents/accent-card';

export class NasaImageSearch extends LitElement {
  static get tag() {
    return 'nasa-image-search';
  }

  static get styles() {
    return css`
      :host {
        display: block;
        padding: 25px;
        color: var(--nasa-image-search-text-color, #000);
      }
      .pageInput {
        margin-bottom: 20px;
      }
    `;
  }

  static get properties() {
    return {
      nasaResults: { type: Array },
      page: { type: String, reflect: true },
    };
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
  }

  async getNASAData() {
    return fetch(
      `https://images-api.nasa.gov/search?q=rocket&page=${this.page}&media_type=image`
    )
      .then(resp => {
        if (resp.ok) {
          return resp.json();
        }
        return false;
      })
      .then(data => {
        console.log(data);
        this.nasaResults = [];

        data.collection.items.forEach(element => {
          // Not every item has a links array field
          if (element.links[0].href !== undefined) {
            let photographerInfo = element.data[0].secondary_creator
              ? element.data[0].secondary_creator
              : 'unknown';
            photographerInfo = element.data[0].photographer
              ? element.data[0].photographer
              : 'unknown';
            const nasaInfo = {
              imagesrc: element.links[0].href,
              title: element.data[0].title,
              description: element.data[0].description,
              photographer: photographerInfo,
            };
            console.log(nasaInfo);
            this.nasaResults.push(nasaInfo);
          }
        });
        return data;
      });
  }

  constructor() {
    super();
    this.nasaResults = [];
    this.page = 1;
  }

  _updatePage() {
    if (this.shadowRoot.querySelector('#pageInput').value > 0) {
      this.page = this.shadowRoot.querySelector('#pageInput').value;
    }
  }

  _loadResults() {
    this.getNASAData();
    this.render();
  }

  render() {
    return html`
      <label for="page">Page Number: </label>
      <input
        type="number"
        id="pageInput"
        min="1"
        value="1"
        class="pageInput"
        @change="${this._updatePage}"
      />

      <br />

      <button id="loadResults" class="pageInput" @click="${this._loadResults}">
        Search for Rockets!
      </button>

      <br />

      ${this.nasaResults.map(
        item => html`
          <accent-card
            image-src="${item.imagesrc}"
            image-align="right"
            horizontal
            style="max-width: 80%"
          >
            <div slot="heading">${item.title}</div>
            <div slot="content">
              ${item.description}
              <br />
              <i> Photographed by: ${item.photographer} </i>
            </div>
          </accent-card>
        `
      )}
    `;
  }
}
