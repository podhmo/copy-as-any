import { HTMLDocument } from "https://deno.land/x/deno_dom/deno-dom-wasm-noinit.ts";
import { Element } from "https://deno.land/x/deno_dom/deno-dom-wasm-noinit.ts";

export function extractPageInfo(doc: HTMLDocument): Record<"title" | string, string> {

    const data: Record<string, string> = {};

    // title
    data["title"] = doc.querySelector("head > title")?.textContent.trim() || "";

    // OGP    
    const metaElements = Array.from(doc.querySelectorAll("head > meta")) as Array<Element>;
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
    return data
}