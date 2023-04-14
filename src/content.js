import { extractPageInfo } from "./ogp.js"


chrome.runtime.onMessage.addListener(async function (msg) {
    console.log("----------------------------------------");
    console.log(`${msg} ya`);
    console.log("----------------------------------------");
    if (msg === "collect-info") {
        const data = extractPageInfo(document)
        console.log(JSON.stringify(data, null, "\n"));
        return await navigator.clipboard.writeText(JSON.stringify(data, null, "\n"));
    }
})
