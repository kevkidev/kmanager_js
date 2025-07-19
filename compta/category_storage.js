function CategoryStorage() {
    const _ALL = "categories";
    const _EDITING = "categories_editing";
    return {
        keys: function () {
            return {
                ALL: _ALL,
                DATE_IMPORT: storage_DATE_IMPORT_PREFIX_ID + _ALL,
                EDITING: _EDITING,
            }
        },

        isEditing: function () {
            return storage_get({ id: _EDITING }) === true;
        },

        setEditing: function ({ value }) {
            storage_update({ id: _EDITING, value });
        },

        update: function ({ newArray }) {
            storage_update({ id: _ALL, value: newArray });
        },

        add: function ({ newItem }) {
            storage_add({ arrayId: _ALL, newItem });
        },

        get: function () {
            return storage_get({ id: _ALL });
        },




    }
}