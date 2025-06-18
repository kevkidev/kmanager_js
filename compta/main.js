function initImportListener() {
    util_initImportListener('triggerImportCSVTransactions', function () {
        io_importCSV(this, function (text) {
            transactions_importCSV(text);
        });
    });
    util_initImportListener('triggerImportCSVCategories', function () {
        io_importCSV(this, function (text) {
            categories_importCSV(text);
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
        categories_display(expenses);
    }
    display_resetViewsHeaders({ openViewId: viewId });
    synthese_displaySumBudget();
    budget_display();
    display_changeDate();
    display_messages();
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
    categories_exportCSV();
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
    categories_deleteKeyword({ categoryId, keyword });
    load("viewCategories");
}

function actionCategoriesDeleteItem(categoryId) {
    categories_deleteItem({ categoryId });
    load("viewCategories");

}

function actionCategoryAddItem() {
    category_add();
    load("viewCategories");

}

function actionCategoryAddKeyword() {
    category_addKeyword();
    load("viewCategories");

}

function actionCategoryAssignKeyword() {
    category_assignKeyword();
    load("viewCategories");

}

// DEBUT 
storage_cleanSession([
    categories_ID,
    budget_ID,
    transactions_ID,
    `date_import_${categories_ID}`,
    `date_import_${budget_ID}`,
    `date_import_${transactions_ID}`,
    storage_ID_DATE_CHANGE,
]);
initImportListener();
load();
// FIN 