const app_controller_DOM_ID_IMPORT_CSV_TRANSACTIONS = "inputImportCSVTransactions";
const app_controller_DOM_ID_IMPORT_CSV_CATEGORIES = "inputImportCSVCategories";
const app_controller_DOM_ID_IMPORT_CSV_BUDGET = "inputImportCSVBudget";

function app_controller_initImportListener() {
    const array = [
        {
            domId: app_controller_DOM_ID_IMPORT_CSV_BUDGET,
            onload: function ({ text }) {
                budget_manager_importCSV(text);
            }
        },
        {
            domId: app_controller_DOM_ID_IMPORT_CSV_CATEGORIES,
            onload: function ({ text }) {
                categories_manager_importCSV(text);
            }
        },
        {
            domId: app_controller_DOM_ID_IMPORT_CSV_TRANSACTIONS,
            onload: function ({ text }) {
                transactions_importCSV(text);
            }
        },
    ];

    array.forEach(e => {
        dom_get(e.domId).addEventListener('change', function () {
            io_importCSV({
                context: this,
                onload: function ({ text }) {
                    e.onload({ text });
                    app_manager_reload({});
                }
            });
        });
    });
}

function actionImportTransactions() {
    dom_get(app_controller_DOM_ID_IMPORT_CSV_TRANSACTIONS).click();
}

function actionImportCategories() {
    dom_get(app_controller_DOM_ID_IMPORT_CSV_CATEGORIES).click();
}

function actionImportBudget() {
    dom_get(app_controller_DOM_ID_IMPORT_CSV_BUDGET).click();
}

function app_controller_exportCSVTransactions() {
    transactions_exportCSV();
}

function app_controller_exportCSVCategories() {
    categories_manager_exportCSV();
}

function app_controller_exportCSVBudget() {
    budget_manager_exportCSV();
}

function app_controller_print() {
    app_manager_resetViewsHeaders({ showAll: true });
    window.print();
}

function app_controller_toggleHeader(event, viewIdToKeepOpen) {
    if (event.target.getAttribute("src").includes("expand")) {
        viewIdToKeepOpen = undefined;
    }
    app_manager_resetViewsHeaders({ viewIdToKeepOpen });
}

function actionBudgetDeleteItem(id) {
    budget_controller_deleteItem(id);
    app_manager_reload({ viewIdToKeepOpen: budget_controller_getViewParams().id });
}

function actionBudgetAddItem() {
    budget_controller_add();
    app_manager_reload({ viewIdToKeepOpen: budget_controller_getViewParams().id });
}

function actionCategoriesDeleteKeyword(categoryId, keyword) {
    categories_controller_deleteKeyword({ categoryId, keyword });
    app_manager_reload({ viewIdToKeepOpen: categories_controller_getViewParams().id });
}

function actionCategoriesDeleteItem(categoryId) {
    categories_controller_deleteItem({ categoryId });
    app_manager_reload({ viewIdToKeepOpen: categories_controller_getViewParams().id });
}

function actionCategoryAddItem() {
    category_controller_add();
    app_manager_reload({ viewIdToKeepOpen: categories_controller_getViewParams().id });
}

function actionCategoryAddKeyword() {
    category_controller_addKeyword();
    app_manager_reload({ viewIdToKeepOpen: categories_controller_getViewParams().id });
}

function actionCategoryAssignKeyword() {
    category_controller_assignKeyword();
    app_manager_reload({ viewIdToKeepOpen: categories_controller_getViewParams().id });
}

