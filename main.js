let categories = [];
let transactions = [];


// DEBUT 
initImportListener();
load();
// FIN 




function initImportListener() {
    document.getElementById('csvFileInput').addEventListener('change', actionImportCSVTransactions);
    document.getElementById('keywordsCsvFileInput').addEventListener('change', actionImportCSVCategories);
    document.getElementById('inputImportPrevisions').addEventListener('change', actionImportCSVPrevision);
}

function load() {

    // netoyer les autres données du storage pour le bon fonctionnement
    AppStorage().clearSession();

    transactions = AppStorage().get(AppTransactions().ID);
    categories = AppStorage().get(AppCategories().ID);
    const date = localStorage.getItem("date_import_transactions");
    const dateImportKeywords = localStorage.getItem("date_import_categories");


    AppCommon().$("dateImportData").innerText = (date != "null") ? date : "inconnue";
    AppCommon().$("dateImportKeywords").innerText = (dateImportKeywords != "null") ? dateImportKeywords : "inconnue";

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

    const KEYWORDS = getKeywords(categories);

    associerKeyword(transactions, KEYWORDS);
    associerCategory(transactions, categories);

    const INCOMES = getIncomes(transactions);
    const inTable = AppCommon().$("tableIn");
    afficherTableSimple(INCOMES, inTable);
    afficherTrSum(sum(INCOMES), inTable, 2);

    const EXPENSES = getDepenses(transactions);
    const outTable = AppCommon().$("tableOut");
    afficherTableSimple(EXPENSES, outTable);
    afficherTrSum(sum(EXPENSES), outTable, 2);

    afficherSumParCategory(sumParCategory(EXPENSES, categories));
    afficherSumParKeyword(sumParKeyword(EXPENSES, KEYWORDS));

    AppPrevisions().View().display();
}


// UI actions import
function actionImportCSVTransactions() {
    AppCommon().importCSV(this, function (text) {
        localStorage.setItem("transactions", JSON.stringify(filtrerCSV(text)));
        AppStorage().recordImportDate("transactions");
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

//


function filtrerCSV(text) {
    const lines = text.split('\n');
    const data = [];
    for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim() === '') continue; // Ignorer les lignes vides
        const currentLine = lines[i].split(';');
        const transaction = {
            quand: currentLine[0],
            quoi: currentLine[2].split('"').join('').toLowerCase(),
            combien: currentLine[6].replace(",", ".")
        }
        data.push(transaction);
    }
    return data;
}



function getIncomes(data) {
    return data.filter(e => parseFloat(e.combien) > 0);
}

function getDepenses(data) {
    return data.filter(e => parseFloat(e.combien) < 0);
}

function getKeywords(categories) {
    return categories.map(e => e.keywords).reduce((a, b) => a.concat(b));
}

function sum(data) {

    const map = data.map(e => parseFloat(e.combien) * 1000);
    if (map.length > 0)
        return map.reduce((a, b) => a + b) / 1000;
}

function associerKeyword(data, keywords) {
    return data.forEach(e => {
        e.keyword = "inconnu";
        for (let i = 0; i < keywords.length; i++) {
            const k = keywords[i];
            if (k && e.quoi.includes(k)) {
                e.keyword = k;
                break;
            }
        }
    });
}

function associerCategory(data, categories) {
    data.forEach(e => {
        for (let i = 0; i < categories.length; i++) {
            const c = categories[i];
            if (c.keywords.includes(e.keyword)) {
                e.category = c.name;
                break;
            }
        };
    });
}


function sumParCategory(data, categories) {
    const maps = [];
    for (let i = 0; i < categories.length; i++) {
        const c = categories[i];
        const list = data.filter(e => c.name == e.category).sort((a, b) => a.combien - b.combien);
        c.count = list.length;
        if (list.length > 0) {
            c.sum = sum(list);
            maps.push({ list: list, category: c });
        }
    }
    return maps.sort((a, b) => a.category.sum - b.category.sum);
}

function sumParKeyword(data, keywords) {
    const maps = [];
    keywords.forEach(k => {
        const list = data.filter(e => e.keyword == k);
        if (list.length > 0) {
            maps.push({ keyword: k, sum: sum(list) });
        }
    });
    return maps.sort((a, b) => a.sum - b.sum);
}







// DISPLAY FUNCTIONS ------------------------

function afficherTableSimple(data, parent) {
    data.forEach(e => {
        const tr = document.createElement("tr");

        const divQuand = document.createElement("td");
        divQuand.innerText = e.quand;
        tr.append(divQuand);

        const divQuoi = document.createElement("td");
        divQuoi.innerHTML = ` <span class="keyword">${e.keyword}</span>&nbsp;&nbsp;&nbsp;${e.quoi}`;
        tr.append(divQuoi);

        const divCombien = document.createElement("td");
        divCombien.innerText = e.combien;
        tr.append(divCombien);

        parent.append(tr);
    });
}

function afficherSumParCategory(data) {
    data.forEach(e => {
        if (e.list.length > 0) {
            const h3 = AppCommon().$create("h3");
            h3.innerText = e.category.name;
            const table = AppCommon().$create("table");
            AppCommon().$("vueDetailsCategories").append(h3);
            AppCommon().$("vueDetailsCategories").append(table);
            afficherTableSimple(e.list, table);

            afficherTrSum(e.category.sum, table, 2);

            // vue resume

            const tr = AppCommon().$create("tr");
            const tdCat = AppCommon().$create('td');
            tdCat.innerText = e.category.name;
            tr.append(tdCat);
            const tdSum = AppCommon().$create('td');
            tdSum.innerText = e.category.sum;
            tr.append(tdSum);
            AppCommon().$("tableResumeCategorie").append(tr);

        }
    });

    const sum = data.map(e => e.category.sum * 1000).reduce((a, b) => a + b) / 1000;
    afficherTrSum(sum, AppCommon().$("tableResumeCategorie"), 1);
}

function afficherTrSum(sum, table, colspan) {
    const trSum = AppCommon().$create("tr");
    const tdTitle = AppCommon().$create("td");
    tdTitle.innerText = "Total";
    tdTitle.setAttribute("colspan", colspan);
    tdTitle.setAttribute("class", "total_title");
    trSum.append(tdTitle);
    const tdSum = AppCommon().$create("td");
    tdSum.innerHTML = `<span class="sum_value">${sum}</span>`;
    trSum.append(tdSum);
    table.append(trSum);
}

function toggle(event, id, noImage) {
    const status = localStorage.getItem(id);
    if (!status || status == "off") {
        AppCommon().$(id).style.display = 'block';
        if (!noImage) event.target.setAttribute("src", "img/icons8-on-50.png");
        localStorage.setItem(id, "on");
    } else if (status == "on") {
        AppCommon().$(id).style.display = 'none';
        if (!noImage) event.target.setAttribute("src", "img/icons8-off-50.png");
        localStorage.setItem(id, "off");
    }
}

function afficherSumParKeyword(data) {
    data.forEach(e => {
        const tr = AppCommon().$create("tr");
        const tdKey = AppCommon().$create('td');
        tdKey.innerText = e.keyword;
        tr.append(tdKey);
        const tdSum = AppCommon().$create('td');
        tdSum.innerText = e.sum;
        tr.append(tdSum);
        AppCommon().$("tableResumeKeywords").append(tr);
    })

    const sum = data.map(e => e.sum * 1000).reduce((a, b) => a + b) / 1000;
    afficherTrSum(sum, AppCommon().$("tableResumeKeywords"), 1);
}






