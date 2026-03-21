export async function addToClipboard(_offscreenDocumentPath, value) {
    await navigator.clipboard.writeText(value);
}
