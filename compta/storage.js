const storage_ID_DATE_CHANGE = "date_change";
const storage_ID_MESSAGES = "log_messages";
const storage_LAST_DATE_IMPORT_PREFIX_ID = "lastImportDate_";
const storage_DATE_IMPORT_PREFIX_ID = "date_import_";

function storage_newId() {
    return Date.now();
}

function storage_get({ id }) {
    const found = localStorage.getItem(id);
    return JSON.parse(found);
}

function storage_add({ arrayId, newItem }) {
    let array = storage_get({ id: arrayId });
    if (!array) {
        array = [];
    }
    array.push(newItem);
    storage_update({ id: arrayId, value: array });
}

function storage_update({ id, value }) {
    localStorage.removeItem(id);
    localStorage.setItem(id, JSON.stringify(value));
    storage_updateChangeDate();
}

function storage_remove({ id }) {
    localStorage.removeItem(id);
}

function storage_recordImportDate({ id }) {
    storage_update({ id: storage_DATE_IMPORT_PREFIX_ID + id, value: util_getDateString() });
}

function storage_cleanSession({ idsToKeep }) {
    for (let i = 0; i < localStorage.length; i++) {
        const id = localStorage.key(i);
        if (!idsToKeep.includes(id)) {
            localStorage.removeItem(id);
        }
    }
}

function storage_getLastImportDate({ subject }) {
    return storage_get({ id: storage_DATE_IMPORT_PREFIX_ID + subject });
}

function storage_updateChangeDate() {
    return localStorage.setItem(storage_ID_DATE_CHANGE, JSON.stringify(util_getDateString()));
}

function storage_getChangeDate() {
    return storage_get({ id: storage_ID_DATE_CHANGE });
}

function storage_addMessage({ message }) {
    let messages = storage_get({ id: storage_ID_MESSAGES });
    if (!messages) messages = [];
    if (messages.includes(message)) return; // on ajoute pas de doublon
    storage_add({ arrayId: storage_ID_MESSAGES, newItem: message });
    console.warn(message);
}