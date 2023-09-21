// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

function extractPageInfo(doc) {
    const data = {};
    data["title"] = doc.querySelector("head > title")?.textContent.trim() || "";
    if (!data["title"]) {
        data["title"] = doc.querySelector("body > title")?.textContent.trim() || "";
    }
    for (const expr of [
        "head > meta",
        "body > meta"
    ]){
        const metaElements = Array.from(doc.querySelectorAll(expr));
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
        if (data["og:url"]) {
            break;
        }
    }
    return data;
}
export { extractPageInfo as extractPageInfo };
