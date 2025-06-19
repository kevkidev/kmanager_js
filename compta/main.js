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
    util_initImportListener('triggerImportCSVBudget', function () {
        io_importCSV(this, function (text) {
            budget_manager_importCSV(text);
        });
    });
}

function load({ openViewId }) {
    const { incomes, expenses } = transactions_build();
    if (expenses || incomes) {
        transactions_display({ incomes, expenses });
        synthese_displaySumMonth({ incomes, expenses });
        categories_viewer_display(expenses);
    }
    controller_resetViewsHeaders({ openViewId })
    synthese_displaySumBudget();
    budget_viewer_display();
    common_display_changeDate();
    common_display_messages();
}

function controller_resetViewsHeaders({ openViewId, showAll }) {
    const views = [
        notice_controller_getViewParams(),
        synthese_controller_getViewParams(),
        transactions_controller_getViewParams(),
        categories_controller_getViewParams(),
        categories_controller_getViewDetailsParams(),
        budget_controller_getViewParams(),
    ];

    views.forEach(view => {
        let display = "none";
        if (showAll || openViewId && view.id == openViewId) {
            display = "block";
            view.isOpen = true;
        }
        display_resetViewHeader({ view, display });
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

// actions export
function actionExportCSVTransactions() {
    transactions_exportCSV();
}

function actionExportCSVCategories() {
    categories_manager_exportCSV();
}

function actionExportCSVBudget() {
    budget_manager_exportCSV();
}

function actionPrint() {
    controller_resetViewsHeaders({ showAll: true });
    window.print();
}

function actionToggle(event, id) {
    display_toggle(event, id);
}

function actionBudgetDeleteItem(id) {
    budget_controller_deleteItem(id);
    load({ openViewId: "viewBudget" });
}

function actionBudgetAddItem() {
    budget_controller_add();
    load({ openViewId: "viewBudget" });
}

function actionCategoriesDeleteKeyword(categoryId, keyword) {
    categories_controller_deleteKeyword({ categoryId, keyword });
    load({ openViewId: categories_viewer_ID });
}

function actionCategoriesDeleteItem(categoryId) {
    categories_controller_deleteItem({ categoryId });
    load({ openViewId: categories_viewer_ID });
}

function actionCategoryAddItem() {
    category_controller_add();
    load({ openViewId: categories_viewer_ID });
}

function actionCategoryAddKeyword() {
    category_controller_addKeyword();
    load({ openViewId: categories_viewer_ID });
}

function actionCategoryAssignKeyword() {
    category_controller_assignKeyword();
    load({ openViewId: categories_viewer_ID });
}

// DEBUT 
storage_cleanSession({
    idsToKeep: [
        categories_controller_STORAGE_ID,
        budget_storage_ID,
        transactions_ID,
        storage_DATE_IMPORT_PREFIX_ID + categories_controller_STORAGE_ID,
        storage_DATE_IMPORT_PREFIX_ID + budget_storage_ID,
        storage_DATE_IMPORT_PREFIX_ID + transactions_ID,
        storage_ID_DATE_CHANGE,
    ]
});
initImportListener();
load({ openViewId: undefined });
// FIN 