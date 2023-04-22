const offscreenDocumentPath = "offscreen.html";


chrome.runtime.onInstalled.addListener(() => {
    chrome.action.setBadgeText({
        text: "CaA",
    });
});

chrome.action.onClicked.addListener(async (tab) => {
    const tabId = tab.id;
    console.log("----------------------------------------");
    console.log(`current tab: %o ${tab.id}`, tab);
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
            return addToClipboard(JSON.stringify(data, null, "\t"));
        }
        console.log("----------------------------------------");
    } catch (err) {
        console.log(`hmm: ${err}`);
    }
});


function collectOGP() {
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

    const data = extractPageInfo(document);
    // console.log("ogp: %o", data);
    return data
}

// see: https://github.com/GoogleChrome/chrome-extensions-samples/blob/main/functional-samples/cookbook.offscreen-clipboard-write/background.js
// see: https://developer.chrome.com/docs/extensions/reference/offscreen/
async function addToClipboard(value) {
    if (!(await hasOffscreenDocument(offscreenDocumentPath))) {
        await chrome.offscreen.createDocument({
            url: offscreenDocumentPath,
            reasons: ["CLIPBOARD"],
            justification: 'Write text to the clipboard.'
        });
    }

    // Now that we have an offscreen document, we can dispatch the
    // message.
    const got = await chrome.runtime.sendMessage({
        type: 'copy-data-to-clipboard',
        target: 'offscreen-doc',
        data: value
    });
    console.log("!! %o", got);
}

async function hasOffscreenDocument(path) {
    // Check all windows controlled by the service worker to see if one 
    // of them is the offscreen document with the given path
    const offscreenUrl = chrome.runtime.getURL(path);
    const matchedClients = await clients.matchAll();
    for (const client of matchedClients) {
        if (client.url === offscreenUrl) {
            return true;
        }
    }
    return false;
}

// // see: https://github.com/GoogleChrome/chrome-extensions-samples/blob/main/functional-samples/cookbook.offscreen-clipboard-write/background.js
// // Solution 2 – Once extension service workers can use the Clipboard API,
// // replace the offscreen document based implementation with something like this.
// async function addToClipboardV2(value) {
//     navigator.clipboard.writeText(value);
//   }


// ----------------------------------------
// see: https://github.com/yorkxin/copy-as-markdown
// const COLOR_GREEN = '#738a05';
// const COLOR_RED = '#d11b24';
// const COLOR_OPAQUE = [0, 0, 0, 255];

// const TEXT_OK = '✓';
// const TEXT_ERROR = '×';
// const TEXT_EMPTY = '';

// const FLASH_BADGE_TIMEOUT = 3000; // ms

// async function flashBadge(type) {
//   const entrypoint = chrome.action /* MV3 */ || chrome.browserAction; /* Firefox MV2 */

//   switch (type) {
//     case 'success':
//       await entrypoint.setBadgeText({ text: TEXT_OK });
//       await entrypoint.setBadgeBackgroundColor({ color: COLOR_GREEN });
//       break;
//     case 'fail':
//       await entrypoint.setBadgeText({ text: TEXT_ERROR });
//       await entrypoint.setBadgeBackgroundColor({ color: COLOR_RED });
//       break;
//     default:
//       return; // don't know what it is. quit.
//   }

//   chrome.alarms.create('clear', { when: Date.now() + FLASH_BADGE_TIMEOUT });
// }

// chrome.alarms.onAlarm.addListener((alarm) => {
//     const entrypoint = chrome.action /* MV3 */ || chrome.browserAction; /* Firefox MV2 */
  
//     if (alarm.name === 'clear') {
//       Promise.all([
//         entrypoint.setBadgeText({ text: TEXT_EMPTY }),
//         entrypoint.setBadgeBackgroundColor({ color: COLOR_OPAQUE }),
//       ])
//         .then(() => { /* NOP */ });
//     }
//   });