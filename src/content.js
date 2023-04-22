function extractPageInfo(doc) {
    const data = {};
    data["title"] = doc.querySelector("head > title")?.textContent.trim() || "";
    const metaElements = Array.from(doc.querySelectorAll("head > meta"));
    for (const current of metaElements) {
        if (!current.hasAttribute("property")) {
            continue;
        }
        const property = current.getAttribute("property")?.trim();
        if (!property) {
            continue;
        }
        const content = current.getAttribute("content");
        if (!content) {
            continue;
        }
        data[property] = content.trim();
    }
    return data;
}

const data = extractPageInfo(document)
console.log(JSON.stringify(data, null, "\n"));

navigator.clipboard.writeText(JSON.stringify(data, null, "\n")).then(() => { console.log("ok") }).catch((err) => { console.log("unexpected error: %o", err); console.warn("!!: %o", err); });

