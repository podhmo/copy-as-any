import { HTMLDocument } from "https://deno.land/x/deno_dom/deno-dom-wasm-noinit.ts";
import { Element } from "https://deno.land/x/deno_dom/deno-dom-wasm-noinit.ts";

export function extractPageInfo(doc: HTMLDocument): Record<"title" | string, string> {

    const data: Record<string, string> = {};

    // title
    data["title"] = doc.querySelector("head > title")?.textContent.trim() || "";
    if (!data["title"]){
        data["title"] = doc.querySelector("body > title")?.textContent.trim() || "";
    }

    // OGP    
    for (const expr of ["head > meta", "body > meta"]) {
        const metaElements = Array.from(doc.querySelectorAll(expr)) as Array<Element>;
        for (const current of metaElements) {
            if (!current.hasAttribute("property")) {
                continue
            }
            const property = current.getAttribute("property")?.trim();
            if (!property) {
                continue
            }
            const content = current.getAttribute("content");
            if (!content) {
                continue
            }
            data[property] = content.trim();
        }
        if (data["og:url"]) {
            break
        }
    }
    return data
}