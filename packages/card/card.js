export class Card extends HTMLElement {
    constructor() {
        super();

        let img = "https://raw.githubusercontent.com/podhmo/copy-as-any/main/packages/card/images/notfound.jpg"; // default
        // let img = "./images/notfound.jpg"; // default
        if (this.hasAttribute("img")) {
            img = this.getAttribute("img")
        } else if (this.hasAttribute("og:image")){
            img = this.getAttribute("og:image")
        }

        let title = ""
        if (this.hasAttribute("title")) {
            title = this.getAttribute("title")
        } else if (this.hasAttribute("og:title")) {
            title = this.getAttribute("og:title")
        }


        let url = ""
        if (this.hasAttribute("href")) {
            url = this.getAttribute("href")
        } else if (this.hasAttribute("og:url")) {
            url = this.getAttribute("og:url")
        }

        const shadow = this.attachShadow({ mode: 'open' });
        const style = document.createElement("style")
        shadow.innerHTML = `
    <div class="card">
      <img src="${img}" alt="">
      <a href="${url}">${title}</a>
      <div class="container">
        <slot></slot>
      </div>
    </div>
        `
        style.textContent = `
    .card {
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
        transition: 0.3s;
        padding: 2px 16px;
    }
    .card img {
        max-width: 400px;
        max-width: 200px;
    }

    .card:hover {
        box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
    }

    .container {
        padding: 2px 16px;
    }
        `;
        shadow.appendChild(style);

        this.addEventListener("click", (e) => {
            const el = e.currentTarget.querySelector("a");
            if (el) {
                el.click();
            }
        })
    }
}
