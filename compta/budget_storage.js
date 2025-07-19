function BudgetStorage() {
    const _ID = "budget";
    const _EDITING_ID = "budget_editing";

    return {
        isEditing: function () {
            return storage_get({ id: _EDITING_ID }) === true;
        },
        setEditing: function ({ value }) {
            storage_update({ id: _EDITING_ID, value });
        },
        get: function () {
            return storage_get({ id: _ID });
        },
        update({ value }) {
            storage_update({ id: _ID, value });
        },

        add({ newItem }) {
            storage_add({ arrayId: _ID, newItem });
        },

    }
}