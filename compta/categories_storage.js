const categories_storage_ID = "categories";
const categories_storage_EDITING_ID = "categories_editing";

function categories_storage_isEditing() {
    return storage_get({ id: categories_storage_EDITING_ID }) === true;
}

function categories_storage_setEditing({ value }) {
    storage_update({ id: categories_storage_EDITING_ID, value });
}

function categories_storage_update({ newArray }) {
    storage_update({ id: categories_storage_ID, value: newArray });
}

function categories_storage_add({ newItem }) {
    storage_add({ arrayId: categories_storage_ID, newItem });
}

function categories_storage_get() {
    return storage_get({ id: categories_storage_ID });
}

function categories_storage_recordImportDate() {
    storage_recordImportDate({ id: categories_storage_ID });
}
