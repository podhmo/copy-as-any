export async function addToClipboard(tabId, value) {
    if (navigator.clipboard) {
        // Firefox service worker (clipboardWrite permission allows this)
        await navigator.clipboard.writeText(value);
    } else {
        // Chrome service worker: navigator.clipboard is undefined, use content script instead
        await chrome.scripting.executeScript({
            target: { tabId },
            func: (text) => navigator.clipboard.writeText(text),
            args: [value]
        });
    }
}
