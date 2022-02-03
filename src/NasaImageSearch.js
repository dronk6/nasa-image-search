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
    `;
  }

  constructor() {
    super();
    this.nasaResults = [];
    this.nasaEndpoint =
      'https://images-api.nasa.gov/search?q=rocket&page=1&media_type=image';
  }

  static get properties() {
    return {
      nasaResults: { type: Array },
    };
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    console.log('something changed');
    this.getNASAData();
  }

  async getNASAData() {
    return fetch(this.nasaEndpoint)
      .then(resp => {
        console.log(resp);
        if (resp.ok) {
          return resp.json();
        }
        return false;
      })
      .then(data => {
        console.log('ok');
        console.log(data);
        this.nasaResults = [];

        data.collection.items.forEach(element => {
          // Not every item has a links array field
          console.log(element.links[0].href);
          if (element.links[0].href !== undefined) {
            const moonInfo = {
              imagesrc: element.links[0].href,
              title: element.data[0].title,
              description: element.data[0].description,
            };
            console.log(`Moon Info: ${moonInfo.imagesrc}`);
            this.nasaResults.push(moonInfo);
          }
        });
        console.log(this.nasaResults);
        return data;
      });
  }

  render() {
    // I repaired the index.html shit but the problem is with the accent-card tag, it's not rendering properly despite other things (img, p, etc.) doing fine.
    return html`
      ${this.nasaResults.map(
        item => html`
          <accent-card
            image-src="${item.imagesrc}"
            image-align="right"
            horizontal
            style="max-width:600px;"
          >
            <div slot="heading">${item.title}</div>
            <div slot="content">${item.description}</div>
          </accent-card>
        `
      )}
    `;
  }
}
