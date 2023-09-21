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
                // {
                //     const text = JSON.stringify(data, null, "\t");
                //     console.log(`OK: ${text}`);
                // }
                {
                    const text = `<my-card og:title="${data["title"] || data["og:title"]}" og:url="${data["og:url"] || data["location.href"]}" og:image="${data["img"] || data["og:image"]}"></my-card>`
                    const offscreenDocumentPath = "compat/offscreen.html";
                    await addToClipboard(offscreenDocumentPath, text); // TODO: using addToClipboardV2()       
                }
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


// // see: https://github.com/GoogleChrome/chrome-extensions-samples/blob/main/functional-samples/cookbook.offscreen-clipboard-write/background.js
// // Solution 2 – Once extension service workers can use the Clipboard API,
// // replace the offscreen document based implementation with something like this.
// async function addToClipboardV2(value) {
//     navigator.clipboard.writeText(value);
//   }
