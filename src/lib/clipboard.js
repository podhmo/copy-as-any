// see: https://github.com/GoogleChrome/chrome-extensions-samples/blob/main/functional-samples/cookbook.offscreen-clipboard-write/background.js
// see: https://developer.chrome.com/docs/extensions/reference/offscreen/
export async function addToClipboard(offscreenDocumentPath, value) {
    if (!(await hasOffscreenDocument(offscreenDocumentPath))) {
        await chrome.offscreen.createDocument({
            url: offscreenDocumentPath,
            reasons: ["CLIPBOARD"],
            justification: 'Write text to the clipboard.'
        });
    }

    // Now that we have an offscreen document, we can dispatch the
    // message.
    chrome.runtime.sendMessage({
        type: 'copy-data-to-clipboard',
        target: 'offscreen-doc',
        data: value
    });
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
