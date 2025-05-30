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

function load() {
    const { incomes, expenses } = transactions_build();
    if (expenses || incomes) {
        transactions_display({ incomes, expenses });
        synthese_displaySumMonth({ incomes, expenses });
        categories_display(expenses);
    }
    display_section_titles();
    synthese_displaySumBudget();
    budget_display();
    display_changeDate();
    display_messages();
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

function actionToggle(event, id) {
    display_toggle(event, id);
}

function actionScrollX(event, toLeft) {
    const padding = 30;

    let screenSize = 444;
    if (screen.width < 1500) { // sur mobile et tablette
        screenSize = screen.width;
    }

    x = window.pageXOffset + screenSize + padding;
    if (toLeft) {
        x = window.pageXOffset - screenSize - padding;
    }

    window.scrollTo(x, 0);
}

function actionBudgetDeleteItem(id) {
    budget_deleteItem(id);
    load();
}

function actionBudgetAddItem() {
    budget_add();
    load();
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