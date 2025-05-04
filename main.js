// DEBUT 
initImportListener();
load();
// FIN 

function initImportListener() {
    document.getElementById('triggerImportCSVTransactions').addEventListener('change', actionImportCSVTransactions);
    document.getElementById('triggerImportCSVCategories').addEventListener('change', actionImportCSVCategories);
    document.getElementById('triggerImportCSVPrevisions').addEventListener('change', actionImportCSVPrevision);
}

function load() {
    storage_cleanSession([
        categories_ID,
        budget_ID,
        transanctions_ID,
        `date_import_${categories_ID}`,
        `date_import_${budget_ID}`,
        `date_import_${transanctions_ID}`,
        storage_ID_DATE_CHANGE,
    ]);
    let transactions = storage_get(transanctions_ID);
    let categories = storage_get(categories_ID);

    transanctions_displayLastImportDate();
    categories_displayLastImportDate();
    budget_displayLastImportDate();

    if (!transactions) {
        display_popup("Veuillez importer des transactions!");
        return;
    }

    if (!categories) {
        display_popup("Info : Le rapport a été généré mais vous n'avez pas importer de categories!");
        categories = [{
            name: "inconnue",
            keywords: ["inconnu"]
        }];
    }

    const KEYWORDS = categories_getKeywords(categories);

    transanctions_associerKeyword(transactions, KEYWORDS);
    transanctions_associerCategory(transactions, categories);

    const INCOMES = transanctions_incomes(transactions);
    const inTable = dom_get("tableIn");
    transanctions_displayTableSimple(INCOMES, inTable);
    display_trSum(util_sum(INCOMES), inTable, 2);

    const EXPENSES = transanctions_expences(transactions);
    const outTable = dom_get("tableOut");
    transanctions_displayTableSimple(EXPENSES, outTable);
    display_trSum(util_sum(EXPENSES), outTable, 2);

    categories_afficherSumParCategory(transanctions_sumParCategory(EXPENSES, categories));
    categories_afficherSumParKeyword(transanctions_sumParKeyword(EXPENSES, KEYWORDS));

    budget_display();
    synthese_display();
    display_changeDate();
}


// UI actions import
function actionImportCSVTransactions() {
    io_importCSV(this, function (text) {
        transanctions_importCSV(text);
    });
}

function actionImportCSVCategories() {
    io_importCSV(this, function (text) {
        categories_importCSV(text);
    });
}

function actionImportCSVPrevision() {
    io_importCSV(this, function (text) {
        budget_importCSV(text);
    });
}

// actions export
function actionExportCSVTransactions() {
    io_exportCSV("transactions", function () {
        let transactions = storage_get(transanctions_ID);

        if (!transactions) return [];
        const rows = [
            ["quand", null, "quoi", null, null, null, "combien"]
        ];

        transactions.forEach(e => {
            rows.push([e.quand, null, e.quoi, null, null, null, e.combien]);
        });
        return rows;
    });
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

function actionBudgetDeleteItem(id) {
    budget_deleteItem(id);
    synthese_display();
    display_changeDate();
}

function actionBudgetAddItem() {
    budget_add();
    synthese_display();
    display_changeDate();
}