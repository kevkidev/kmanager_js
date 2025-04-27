let CATEGORIES = [];
let DATA = [];

// DEBUT 
document.getElementById('csvFileInput').addEventListener('change', importerCSV);
document.getElementById('keywordsCsvFileInput').addEventListener('change', importerKeywordsCSV);
load();
// FIN 



// functions -----------------------------------------------------------------------------

function load() {
    // netoyer les autres données du storage
    const date = localStorage.getItem("date_import_data");
    const data = localStorage.getItem("data");
    const categories = localStorage.getItem("catergorie_keywords");
    const dateImportKeywords = localStorage.getItem("date_import_cat_key");
    localStorage.clear();
    // remettre les données persistentes
    localStorage.setItem("date_import_data", date);
    localStorage.setItem("data", data);
    localStorage.setItem("catergorie_keywords", categories);
    localStorage.setItem("date_import_cat_key", dateImportKeywords);

    $("dateImportData").innerText = (date != "null") ? date : "inconnue";
    $("dateImportKeywords").innerText = (dateImportKeywords != "null") ? dateImportKeywords : "inconnue";
    DATA = JSON.parse(data);
    CATEGORIES = JSON.parse(categories);

    if (!DATA) {
        popup("Impossible de charger les données: pas de transactions!");
        return;
    }

    if (!CATEGORIES) {
        popup("Impossible de charger les données: pas de catégorie et mot-clés!");
        return;
    }

    const KEYWORDS = getKeywords(CATEGORIES);

    associerKeyword(DATA, KEYWORDS);
    associerCategory(DATA, CATEGORIES);

    const INCOMES = getIncomes(DATA);
    const inTable = $("tableIn");
    afficherTableSimple(INCOMES, inTable);
    afficherTrSum(sum(INCOMES), inTable, 2);

    const EXPENSES = getDepenses(DATA);
    const outTable = $("tableOut");
    afficherTableSimple(EXPENSES, outTable);
    afficherTrSum(sum(EXPENSES), outTable, 2);

    afficherSumParCategory(sumParCategory(EXPENSES, CATEGORIES));
    afficherSumParKeyword(sumParKeyword(EXPENSES, KEYWORDS));
}

function popup(message) {
    console.warn(message);
    alert(message);
}


function $(id) {
    return document.getElementById(id);
}

function $create(type) {
    return document.createElement(type);
}

function importerCSV() {
    const file = this.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
        const text = e.target.result;
        localStorage.setItem("data", JSON.stringify(filtrerCSV(text)));
        localStorage.setItem("date_import_data", (new Date()).toLocaleString());
        load();
        location.reload();
    };
    reader.readAsText(file);
}

function importerKeywordsCSV() {
    const file = this.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
        const text = e.target.result;
        localStorage.setItem("catergorie_keywords", JSON.stringify(filtrerKeywordsCSV(text)));
        localStorage.setItem("date_import_cat_key", (new Date()).toLocaleString());
        load();
        location.reload();
    };
    reader.readAsText(file);

}

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

function filtrerKeywordsCSV(text) {
    const lines = text.split('\n');
    const data = [];
    for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim() === '') continue; // Ignorer les lignes vides
        const currentLine = lines[i].split(';');
        const categories = {
            name: currentLine[0],
            keywords: currentLine[1].split(','),
        };
        data.push(categories);
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

function exportDataCSV() {
    const rows = [
        ["quand", null, "quoi", null, null, null, "combien"]
    ];

    DATA.forEach(e => {
        rows.push([e.quand, null, e.quoi, null, null, null, e.combien]);
    });

    const csvContent = "data:text/csv;charset=utf-8,"
        + rows.map(e => e.join(";")).join("\n");

    var link = $create("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `RDMP_data_${(new Date()).toLocaleString()}.csv`);
    document.body.appendChild(link);
    link.click();
}

function exportKeywordsCSV() {
    if (!CATEGORIES) {
        popup("Pas de donnés à exporter!");
        return;
    }

    const rows = [
        ["name", "keywords"]
    ];

    CATEGORIES.forEach(e => {
        rows.push([e.name, e.keywords]); // keywords separés par des virgules
    });

    const csvContent = "data:text/csv;charset=utf-8,"
        + rows.map(e => e.join(";")).join("\n");

    var link = $create("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `RDMP_categorie_keywords_${(new Date()).toLocaleString()}.csv`);
    document.body.appendChild(link);
    link.click();
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
            const h3 = $create("h3");
            h3.innerText = e.category.name;
            const table = $create("table");
            $("vueDetailsCategories").append(h3);
            $("vueDetailsCategories").append(table);
            afficherTableSimple(e.list, table);

            afficherTrSum(e.category.sum, table, 2);

            // vue resume

            const tr = $create("tr");
            const tdCat = $create('td');
            tdCat.innerText = e.category.name;
            tr.append(tdCat);
            const tdSum = $create('td');
            tdSum.innerText = e.category.sum;
            tr.append(tdSum);
            $("tableResumeCategorie").append(tr);

        }
    });

    const sum = data.map(e => e.category.sum * 1000).reduce((a, b) => a + b) / 1000;
    afficherTrSum(sum, $("tableResumeCategorie"), 1);
}

function afficherTrSum(sum, table, colspan) {
    const trSum = $create("tr");
    const tdTitle = $create("td");
    tdTitle.innerText = "Total";
    tdTitle.setAttribute("colspan", colspan);
    tdTitle.setAttribute("class", "total_title");
    trSum.append(tdTitle);
    const tdSum = $create("td");
    tdSum.innerHTML = `<span class="sum_value">${sum}</span>`;
    trSum.append(tdSum);
    table.append(trSum);
}

function toggle(event, id, noImage) {
    const status = localStorage.getItem(id);
    if (!status || status == "off") {
        $(id).style.display = 'block';
        if (!noImage) event.target.setAttribute("src", "img/icons8-on-50.png");
        localStorage.setItem(id, "on");
    } else if (status == "on") {
        $(id).style.display = 'none';
        if (!noImage) event.target.setAttribute("src", "img/icons8-off-50.png");
        localStorage.setItem(id, "off");
    }
}

function afficherSumParKeyword(data) {
    data.forEach(e => {
        const tr = $create("tr");
        const tdKey = $create('td');
        tdKey.innerText = e.keyword;
        tr.append(tdKey);
        const tdSum = $create('td');
        tdSum.innerText = e.sum;
        tr.append(tdSum);
        $("tableResumeKeywords").append(tr);
    })

    const sum = data.map(e => e.sum * 1000).reduce((a, b) => a + b) / 1000;
    afficherTrSum(sum, $("tableResumeKeywords"), 1);
}