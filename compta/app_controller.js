
function app_controller_initImportListener() {
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
    util_initImportListener('triggerImportCSVBudget', function () {
        io_importCSV(this, function (text) {
            budget_manager_importCSV(text);
        });
    });
}

function actionImportTransactions() {
    dom_get("triggerImportCSVTransactions").click();
}

function actionImportCategories() {
    dom_get("triggerImportCSVCategories").click();
}

function actionImportBudget() {
    dom_get("triggerImportCSVBudget").click();
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
    app_manager_reload({ viewIdToKeepOpen: "viewBudget" });
}

function actionBudgetAddItem() {
    budget_controller_add();
    app_manager_reload({ viewIdToKeepOpen: "viewBudget" });
}

function actionCategoriesDeleteKeyword(categoryId, keyword) {
    categories_controller_deleteKeyword({ categoryId, keyword });
    app_manager_reload({ viewIdToKeepOpen: categories_viewer_ID });
}

function actionCategoriesDeleteItem(categoryId) {
    categories_controller_deleteItem({ categoryId });
    app_manager_reload({ viewIdToKeepOpen: categories_viewer_ID });
}

function actionCategoryAddItem() {
    category_controller_add();
    app_manager_reload({ viewIdToKeepOpen: categories_viewer_ID });
}

function actionCategoryAddKeyword() {
    category_controller_addKeyword();
    app_manager_reload({ viewIdToKeepOpen: categories_viewer_ID });
}

function actionCategoryAssignKeyword() {
    category_controller_assignKeyword();
    app_manager_reload({ viewIdToKeepOpen: categories_viewer_ID });
}

