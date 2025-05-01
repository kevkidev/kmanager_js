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
    AppStorage().cleanSession();
    let transactions = AppStorage().get(AppTransactions().ID);
    let categories = AppStorage().get(AppCategories().ID);

    AppTransactions().displayLastImportDate();
    AppCategories().displayLastImportDate();
    AppPrevisions().displayLastImportDate();

    if (!transactions) {
        AppCommon().popup("Veuillez importer des transactions!");
        return;
    }

    if (!categories) {
        AppCommon().popup("Info : Le rapport a été généré mais vous n'avez pas importer de categories!");
        categories = [{
            name: "inconnue",
            keywords: ["inconnu"]
        }];
    }

    const KEYWORDS = AppCategories().getKeywords(categories);

    AppTransactions().associerKeyword(transactions, KEYWORDS);
    AppTransactions().associerCategory(transactions, categories);

    const INCOMES = AppTransactions().getIncomes(transactions);
    const inTable = AppCommon().$("tableIn");
    AppTransactions().afficherTableSimple(INCOMES, inTable);
    AppCommon().afficherTrSum(AppCommon().sum(INCOMES), inTable, 2);

    const EXPENSES = AppTransactions().getDepenses(transactions);
    const outTable = AppCommon().$("tableOut");
    AppTransactions().afficherTableSimple(EXPENSES, outTable);
    AppCommon().afficherTrSum(AppCommon().sum(EXPENSES), outTable, 2);

    AppCategories().afficherSumParCategory(AppTransactions().sumParCategory(EXPENSES, categories));
    AppCategories().afficherSumParKeyword(AppTransactions().sumParKeyword(EXPENSES, KEYWORDS));

    AppPrevisions().View().display();
    // Synthese.Vue.afficher();
}


// UI actions import
function actionImportCSVTransactions() {
    AppCommon().importCSV(this, function (text) {
        AppTransactions().importCSV(text);
    });
}

function actionImportCSVCategories() {
    AppCommon().importCSV(this, function (text) {
        AppCategories().importCSV(text);
    });
}

function actionImportCSVPrevision() {
    AppCommon().importCSV(this, function (text) {
        AppPrevisions().importCSV(text);
    });
}

// actions export
function actionExportCSVTransactions() {
    AppCommon().exportCSV("transactions", function () {
        let transactions = AppStorage().get(AppTransactions().ID);

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
    AppCategories().exportCSV();
}

function actionExportCSVPrevisions() {
    AppPrevisions().exportCSV();
}

function actionToggle(event, id) {
    AppCommon().toggle(event, id);
}
