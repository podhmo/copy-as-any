chrome.runtime.onMessage.addListener(handleMessages);


async function handleMessages(message) {
    // Return early if this message isn't meant for the offscreen document.
    if (message.target !== 'offscreen-doc') {
        return;
    }

    // Dispatch the message to an appropriate handler.
    switch (message.type) {
        case 'copy-data-to-clipboard': {
            try {
                const textEl = document.querySelector('#text');
                textEl.value = message.data;
                textEl.select();
                textEl.focus();
                alert(textEl.value);
                await navigator.clipboard.writeText(textEl.value);
                alert(await navigator.clipboard.readText());
            } catch (err) {
                alert(err);
            }
            return message.data;
        }
        default:
            console.warn(`Unexpected message type received: '${message.type}'.`);
    }
}


