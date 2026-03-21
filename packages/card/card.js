export class Card extends HTMLElement {
    constructor() {
        super();

        let img = "https://raw.githubusercontent.com/podhmo/copy-as-any/main/packages/card/images/notfound.jpg"; // default
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

        let description = ""
        if (this.hasAttribute("description")) {
            description = this.getAttribute("description")
        } else if (this.hasAttribute("og:description")) {
            description = this.getAttribute("og:description")
        }

        let domain = ""
        let faviconHTML = ""
        if (url) {
            try {
                domain = new URL(url).hostname
                faviconHTML = `<img class="favicon" src="https://www.google.com/s2/favicons?domain=${domain}&sz=16" alt="">`
            } catch (_) {}
        }

        const shadow = this.attachShadow({ mode: 'open' });
        const style = document.createElement("style")
        shadow.innerHTML = `
    <div class="card">
      <div class="content">
        <div class="title">${title}</div>
        ${description ? `<div class="description">${description}</div>` : ''}
        ${domain ? `<div class="site">${faviconHTML}<span class="domain">${domain}</span></div>` : ''}
      </div>
      <div class="thumbnail">
        <img src="${img}" alt="">
      </div>
    </div>
        `
        style.textContent = `
    .card {
        display: flex;
        flex-direction: row;
        align-items: stretch;
        border: 1px solid #e0e0e0;
        border-radius: 12px;
        overflow: hidden;
        cursor: pointer;
        background: #fff;
        transition: box-shadow 0.2s;
        max-width: 100%;
        box-sizing: border-box;
    }
    .card:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    }
    .content {
        flex: 1;
        min-width: 0;
        padding: 12px;
        display: flex;
        flex-direction: column;
        gap: 4px;
        justify-content: center;
    }
    .title {
        font-size: 15px;
        font-weight: bold;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
        color: #1a1a1a;
        line-height: 1.4;
    }
    .description {
        font-size: 13px;
        color: #888;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .site {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 12px;
        color: #888;
        margin-top: 2px;
    }
    .favicon {
        width: 16px;
        height: 16px;
        flex-shrink: 0;
    }
    .domain {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .thumbnail {
        flex-shrink: 0;
        width: 120px;
    }
    .thumbnail img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
    }
    @media (min-width: 600px) {
        .title { font-size: 16px; }
        .thumbnail { width: 150px; }
    }
        `;
        shadow.appendChild(style);

        if (url) {
            this.style.cursor = "pointer";
            this.addEventListener("click", () => {
                window.open(url, '_blank', 'noopener,noreferrer');
            })
        }
    }
}
