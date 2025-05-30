const categories_ID = "categories";

function categories_importCSV(text) {
    const value = io_extractCSV(text, function (currentLine) {
        const categories = {
            name: currentLine[0],
            keywords: currentLine[1].split(','),
        };
        return categories;
    });
    storage_update(categories_ID, value);
    storage_recordImportDate(categories_ID);
    storage_addMessage("Catégories importées avec succés!");
}

function categories_exportCSV() {
    let categories = storage_get(categories_ID);
    io_exportCSV("categories", function () {
        if (!categories) {
            storage_addMessage("Pas de données à exporter!");
            return;
        }
        const rows = [["name", "keywords"]];
        categories.forEach(e => {
            rows.push([e.name, e.keywords]); // keywords separés par des virgules
        });
        return rows;
    });
}

function categories_getKeywords(categories) {
    return categories.map(e => e.keywords).reduce((a, b) => a.concat(b));
}

function categories_get() {
    let categories = storage_get(categories_ID);
    if (!categories) {
        storage_addMessage("Pas de catégories!");
        categories = [{
            name: "inconnue",
            keywords: ["inconnu"]
        }];
    }
    return categories;
}

function categories_sumPerCategory(transactions) {
    const maps = [];
    const categories = categories_get();
    for (let i = 0; i < categories.length; i++) {
        const c = categories[i];
        const list = transactions.filter(e => c.name == e.category).sort((a, b) => a.combien - b.combien);
        c.count = list.length;
        if (list.length > 0) {
            c.sum = util_sum(list);
            maps.push({ list: list, category: c });
        }
    }
    return maps.sort((a, b) => a.category.sum - b.category.sum);
}

function categories_sumPerKeyword(transactions) {
    const maps = [];
    const categories = categories_get();
    const keywords = categories_getKeywords(categories);
    keywords.forEach(k => {
        const list = transactions.filter(e => e.keyword == k);
        if (list.length > 0) {
            maps.push({ keyword: k, sum: util_sum(list) });
        }
    });
    return maps.sort((a, b) => a.sum - b.sum);
}

// display

function categories_displaySumPerCategory({ transactionsPerCategory, sumPerKeyword }) {
    dom_get("viewCategories").replaceChildren();
    transactionsPerCategory.forEach(e => {
        const category = e.category;
        const h3 = dom_create("h3");
        h3.innerText = category.name;
        const table = dom_create("table");

        sumPerKeyword.forEach(e => {
            if (category.keywords.includes(e.keyword)) {
                const tr = dom_tr();
                dom_td(tr, e.keyword);
                dom_td(tr, display_decimal(e.sum));
                table.append(tr);
            }
        });
        display_trSum(category.sum, table, 1);

        dom_get("viewCategories").append(h3, table);
    });
}


function categories_displaySumPerCategory_details(data) {
    const view = dom_get("viewDetailsCategories");
    view.replaceChildren(); // vider la vue

    data.forEach(e => {
        if (e.list.length > 0) {
            const h3 = dom_create("h3");
            h3.innerText = e.category.name;
            const table = dom_create("table");
            view.append(h3);
            view.append(table);
            transactions_displayTableSimple(e.list, table);
            display_trSum(e.category.sum, table, 2);
        }
    });
    const sum = data.map(e => e.category.sum).reduce((a, b) => a + b);
    display_lastImportDate(categories_ID);
}

function categories_displaySumPerKeyword(array) {
    const table = dom_get("tableResumeKeywords");
    table.replaceChildren(); // vider la table
    array.forEach(e => {
        const tr = dom_tr();
        dom_td(tr, e.keyword);
        dom_td(tr, display_decimal(e.sum));
        table.append(tr);
    });
    const sum = array.map(e => e.sum).reduce((a, b) => a + b);
    display_trSum(sum, table, 1);
}

function categories_display(expenses) {
    display_lastImportDate(categories_ID);
    categories_displaySumPerCategory({
        transactionsPerCategory: categories_sumPerCategory(expenses),
        sumPerKeyword: categories_sumPerKeyword(expenses)
    });
    categories_displaySumPerCategory_details(categories_sumPerCategory(expenses));
}