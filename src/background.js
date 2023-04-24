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

        for (const result of results) {
            const data = result.result;
            console.log(`data: %o`, data);
            if (!data) {
                continue
            }

            const offscreenDocumentPath = "compat/offscreen.html";
            // const text = JSON.stringify(data, null, "\t");            
            const text = `<my-card og:title="${data['title'] || data['og:title']}" og:url="${data['href'] || data['og:url']}" og:image="${data['img'] || data['og:image']}"></my-card>`
            await addToClipboard(offscreenDocumentPath, text); // TODO: using addToClipboardV2()
            break
        }
        await flashBadge("success")
        console.log("----------------------------------------");
    } catch (err) {
        console.log(`hmm: ${err}`);
        await flashBadge("fail");
    }
});


function collectOGP() {
    // copy from ./lib/ogp.js, because es-module's import is not supported in content scripts
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

    return extractPageInfo(document);
}


// // see: https://github.com/GoogleChrome/chrome-extensions-samples/blob/main/functional-samples/cookbook.offscreen-clipboard-write/background.js
// // Solution 2 – Once extension service workers can use the Clipboard API,
// // replace the offscreen document based implementation with something like this.
// async function addToClipboardV2(value) {
//     navigator.clipboard.writeText(value);
//   }
