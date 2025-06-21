




function common_display_messages() {
    const messages = storage_get({ id: storage_ID_MESSAGES });
    if (!messages) return;
    for (let i = 0; i < messages.length; i++) {
        const m = messages[i];
        alert(m);
    }
    storage_remove({ id: storage_ID_MESSAGES });
}