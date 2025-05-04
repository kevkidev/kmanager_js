const storage_ID_DATE_CHANGE = "date_change";
const storage_ID_MESSAGES = "log_messages";

function storage_newId() {
    return Date.now();
}

function storage_get(id) {
    const found = localStorage.getItem(id);
    return JSON.parse(found);
}

function storage_add(arrayId, newItem) {
    let array = storage_get(arrayId);
    if (!array) {
        array = [];
    }
    array.push(newItem);
    storage_update(arrayId, array);
}

function storage_update(id, value) {
    localStorage.removeItem(id);
    localStorage.setItem(id, JSON.stringify(value));
    storage_updateChangeDate();
}

function storage_remove(id) {
    localStorage.removeItem(id);
}

function storage_recordImportDate(id) {
    storage_update("date_import_" + id, util_getDateString());
}

function storage_cleanSession(idsToKeep) {
    for (let i = 0; i < localStorage.length; i++) {
        const id = localStorage.key(i);
        if (!idsToKeep.includes(id)) {
            localStorage.removeItem(id);
        }
    }
}

function storage_getLastImportDate(id) {
    return storage_get("date_import_" + id);
}

function storage_updateChangeDate() {
    return localStorage.setItem(storage_ID_DATE_CHANGE, JSON.stringify(util_getDateString()));
}

function storage_getChangeDate() {
    return storage_get(storage_ID_DATE_CHANGE);
}

function storage_addMessage(message) {
    let messages = storage_get(storage_ID_MESSAGES);
    if (!messages) messages = [];
    if (messages.includes(message)) return; // on ajoute pas de doublon
    storage_add(storage_ID_MESSAGES, message);
    console.warn(message);
}