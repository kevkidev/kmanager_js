function initImportListener() {
    util_initImportListener('triggerImportCSVTransactions', function () {
        io_importCSV(this, function (text) {
            transactions_importCSV(text);
        });
    });
    util_initImportListener('triggerImportCSVCategories', function () {
        io_importCSV(this, function (text) {
            categories_manager_importCSV(text);
        });
    });
    util_initImportListener('triggerImportCSVPrevisions', function () {
        io_importCSV(this, function (text) {
            budget_importCSV(text);
        });
    });
}

function load(viewId) {
    const { incomes, expenses } = transactions_build();
    if (expenses || incomes) {
        transactions_display({ incomes, expenses });
        synthese_displaySumMonth({ incomes, expenses });
        categories_viewer_display(expenses);
    }
    display_resetViewsHeaders({ openViewId: viewId });
    synthese_displaySumBudget();
    budget_display();
    common_display_changeDate();
    common_display_messages();
}

function actionImportTransactions() {
    dom_get("triggerImportCSVTransactions").click();
}

function actionImportCategories() {
    dom_get("triggerImportCSVCategories").click();
}

function actionImportBudget() {
    dom_get("triggerImportCSVPrevisions").click();
}

// actions export
function actionExportCSVTransactions() {
    transactions_exportCSV();
}

function actionExportCSVCategories() {
    categories_manager_exportCSV();
}

function actionExportCSVPrevisions() {
    budget_exportCSV();
}

function actionPrint() {
    display_resetViewsHeaders({ showAll: true });
    window.print();
}

function actionToggle(event, id) {
    display_toggle(event, id);
}

function actionBudgetDeleteItem(id) {
    budget_deleteItem(id);
    load("viewBudget");
}

function actionBudgetAddItem() {
    budget_add();
    load("viewBudget");
}

function actionCategoriesDeleteKeyword(categoryId, keyword) {
    categories_controller_deleteKeyword({ categoryId, keyword });
    load("viewCategories");
}

function actionCategoriesDeleteItem(categoryId) {
    categories_controller_deleteItem({ categoryId });
    load("viewCategories");
}

function actionCategoryAddItem() {
    category_controller_add();
    load("viewCategories");
}

function actionCategoryAddKeyword() {
    category_controller_addKeyword();
    load("viewCategories");
}

function actionCategoryAssignKeyword() {
    category_controller_assignKeyword();
    load("viewCategories");
}

// DEBUT 
storage_cleanSession([
    categories_controller_STORAGE_ID,
    budget_ID,
    transactions_ID,
    `date_import_${categories_controller_STORAGE_ID}`,
    `date_import_${budget_ID}`,
    `date_import_${transactions_ID}`,
    storage_ID_DATE_CHANGE,
]);
initImportListener();
load();
// FIN 