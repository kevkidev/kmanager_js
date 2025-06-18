function common_display_lastImportDate({ prefixId, suffixId }) {
    const date = storage_getLastImportDate(suffixId);
    dom_get(prefixId + suffixId).innerText = (date != "null") ? date : "inconnue";
}

function common_display_changeDate() {
    dom_get("changeDate").innerText = storage_getChangeDate();
}

function common_display_messages() {
    const messages = storage_get(storage_ID_MESSAGES);
    if (!messages) return;
    for (let i = 0; i < messages.length; i++) {
        const m = messages[i];
        alert(m);
    }
    storage_remove(storage_ID_MESSAGES);
}