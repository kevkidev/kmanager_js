function TransactionStorage() {
    return {
        keys: {
            ALL: "transactions",
        },

        update: function ({ array }) {
            storage_update({
                id: TransactionStorage().keys.ALL,
                value: array
            });
        },

        get: function () {
            return storage_get({ id: TransactionStorage().keys.ALL });
        },
    }
}