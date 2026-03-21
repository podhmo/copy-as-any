import { flashBadge } from "./lib/badge.js"
import { addToClipboard } from "./lib/clipboard.js"; // work-around

// for debug
chrome.runtime.onInstalled.addListener(() => {
    chrome.action.setBadgeText({
        text: "CaA",
    });
});

chrome.action.onClicked.addListener(async (tab) => {
    const tabId = tab.id;
    console.log("----------------------------------------");
    // console.log(`current tab: %o ${tab.id}`, tab);
    try {
        const results = await chrome.scripting.executeScript({
            target: { tabId: tabId },
            func: collectOGP
        })

        for (const r of results) {
            let data = r.result;
            console.log(`data: %o`, data);
            const url = data["location.href"];
            if (url) {
                // fetch from request
                const res = await fetch(url, { "headers": { "Content-Type": "text/html", "Accept": "text/html", "User-Agent": "bot" } });
                if (res.status == 200) {
                    const text = await res.text();
                    const fetchedResults = await chrome.scripting.executeScript({
                        target: { tabId: tabId },
                        func: collectOGP,
                        args: [text]
                    })
                    for (const r of fetchedResults) {
                        if (r.result) {
                            const subdata = r.result;
                            // console.log(` subdata: %o`, subdata);
                            data = Object.assign(data, subdata);
                        }
                    }
                }
            }
            if (!data) {
                continue
            }

            // save to clipboard
            {
                const { format = "my-card" } = await chrome.storage.sync.get("format");
                let text;
                if (format === "markdown") {
                    const title = data["title"] || data["og:title"] || "";
                    const url = data["og:url"] || data["location.href"] || "";
                    text = `[${title}](${url})`;
                } else if (format === "json") {
                    text = JSON.stringify(data, null, 2);
                } else {
                    text = `<my-card og:title="${data["title"] || data["og:title"]}" og:url="${data["og:url"] || data["location.href"]}" og:image="${data["img"] || data["og:image"]}"></my-card>`;
                }
                await addToClipboard(tabId, text);
            }

            break
        }
        await flashBadge("success")
        console.log("----------------------------------------");
    } catch (err) {
        console.log(`hmm: ${err}`);
        await flashBadge("fail");
    }
});


function collectOGP(text) {
    // copy from ./lib/ogp.js, because es-module"s import is not supported in content scripts
    function extractPageInfo(doc) {
        const data = {};
        data["title"] = doc.querySelector("head > title")?.textContent.trim() || "";
        if (!data["title"]) {
            data["title"] = doc.querySelector("body > title")?.textContent.trim() || "";
        }
        for (const expr of [
            "head > meta",
            "body > meta"
        ]) {
            const metaElements = Array.from(doc.querySelectorAll(expr));
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
            if (data["og:url"]) {
                break;
            }
        }
        return data;
    }

    let doc = document;
    if (text) {
        const p = new DOMParser
        doc = p.parseFromString(text, "text/html");
    }

    const data = extractPageInfo(doc);
    data["location.href"] = location.href;
    return data;
}
