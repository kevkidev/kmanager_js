const categories_storage_ID = "categories";
const categories_storage_EDITING_ID = "categories_editing";

function categories_storage_isEditing() {
    return storage_get(categories_storage_EDITING_ID) === true;
}

function categories_storage_setEditing({ value }) {
    storage_update(categories_storage_EDITING_ID, value);
}

function categories_storage_update({ newArray }) {
    storage_update(categories_storage_ID, newArray);
}

function categories_storage_add({ newItem }) {
    storage_add(categories_storage_ID, newItem);
}

function categories_storage_get() {
    return storage_get(categories_storage_ID);
}