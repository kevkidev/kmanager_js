function AppController() {
    return {

        DOM_ID_IMPORT_CSV_CATEGORIES: "inputImportCSVCategories",
        DOM_ID_IMPORT_CSV_BUDGET: "inputImportCSVBudget",
        DOM_ID_IMPORT_CSV_TRANSACTIONS: "inputImportCSVTransactions",

        initImportListener: function () {
            const array = [
                {
                    domId: AppController().DOM_ID_IMPORT_CSV_BUDGET,
                    onload: function ({ text }) {
                        BudgetManager().importCSV(text);
                    }
                },
                {
                    domId: AppController().DOM_ID_IMPORT_CSV_CATEGORIES,
                    onload: function ({ text }) {
                        CategoryManager().importCSV(text);
                    }
                },
                {
                    domId: AppController().DOM_ID_IMPORT_CSV_TRANSACTIONS,
                    onload: function ({ text }) {
                        TransactionManager().importCSV({ text });
                    }
                },
            ];

            array.forEach(e => {
                Dom().get({ id: e.domId }).addEventListener('change', function () {
                    io_importCSV({
                        context: this,
                        onload: function ({ text }) {
                            e.onload({ text });
                        }
                    });
                });
            });
        },

        importTransactions: function () {
            Dom().get({ id: AppController().DOM_ID_IMPORT_CSV_TRANSACTIONS }).click();
        },

        importCategories: function () {
            Dom().get({ id: AppController().DOM_ID_IMPORT_CSV_CATEGORIES }).click();
        },

        importBudget: function () {
            Dom().get({ id: AppController().DOM_ID_IMPORT_CSV_BUDGET }).click();
        },
    }
}