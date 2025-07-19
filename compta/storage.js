const storage_ID_DATE_CHANGE = "date_change";
const storage_ID_MESSAGES = "log_messages";
const storage_LAST_DATE_IMPORT_PREFIX_ID = "lastImportDate_";
const storage_DATE_IMPORT_PREFIX_ID = "date_import_";

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
}