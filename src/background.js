chrome.runtime.onInstalled.addListener(() => {
    chrome.action.setBadgeText({
        text: "CaA",
    });
});

chrome.action.onClicked.addListener(async (ev) => {
    console.log(`clicked ${ev}`);
    const queryOptions = { active: true, lastFocusedWindow: true }; // currentWindow?
    const [tab] = await chrome.tabs.query(queryOptions);
    if (!tab) {
        return
    }

    console.log(`hoi ${tab}`);
    const tabId = tab.id;
    chrome.scripting.executeScript({ target: { tabId: tabId }, func: handleOGP })
        .then(() => console.log("script injected on target frames"));
    // chrome.tabs.sendMessage(tabId, "collect-info").then((data) => { console.log(data); }).catch((err) => { console.error(`hmm ${err}`);})
});

async function handleOGP() {
    const data = extractPageInfo(document)
    console.log(JSON.stringify(data, null, "\n"));
    await navigator.clipboard.writeText(JSON.stringify(data, null, "\n"));
}