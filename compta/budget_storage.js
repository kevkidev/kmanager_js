
const budget_storage_ID = "budget";
const budget_storage_EDITING_ID = "budget_editing";

function budget_storage_isEditing() {
    return storage_get({ id: budget_storage_EDITING_ID }) === true;
}

function budget_storage_setEditing({ value }) {
    storage_update({ id: budget_storage_EDITING_ID, value });
}

function budget_storage_get() {
    return storage_get({ id: budget_storage_ID });
}

function budget_storage_update({ value }) {
    storage_update({ id: budget_storage_ID, value });
}

function budget_storage_recordImportDate() {
    storage_recordImportDate({ id: budget_storage_ID });
}

function budget_storage_add({ newItem }) {
    storage_add({ arrayId: budget_storage_ID, newItem });
}

function budget_storage_getLastImportDate() {
    return storage_getLastImportDate({ subject: budget_storage_ID });
}