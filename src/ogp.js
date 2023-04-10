// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

function extractPageInfo(doc) {
    const data = {};
    data["title"] = doc.querySelector("head > title")?.textContent.trim() || "";
    const metaElements = Array.from(doc.querySelectorAll("head > meta"));
    for (const current of metaElements){
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
export { extractPageInfo as extractPageInfo };
