chrome.storage.sync.get("format", ({ format = "my-card" }) => {
    const radio = document.querySelector(`input[name="format"][value="${format}"]`);
    if (radio) radio.checked = true;
});

document.getElementById("save").addEventListener("click", () => {
    const format = document.querySelector('input[name="format"]:checked')?.value ?? "my-card";
    chrome.storage.sync.set({ format }, () => {
        const status = document.getElementById("status");
        status.textContent = "Saved.";
        setTimeout(() => { status.textContent = ""; }, 1500);
    });
});
