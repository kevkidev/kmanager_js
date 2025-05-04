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
    display_popup("Catégories importées avec succés!");
}

function categories_exportCSV() {
    let categories = storage_get(categories_ID);
    io_exportCSV("categories", function () {
        if (!categories) {
            display_popup("Pas de données à exporter!");
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

function categories_sumPerCategory(transactions) {
    const maps = [];
    const categories = storage_get(categories_ID);
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
    const categories = storage_get(categories_ID);
    const keywords = categories_getKeywords(categories);
    const maps = [];
    keywords.forEach(k => {
        const list = transactions.filter(e => e.keyword == k);
        if (list.length > 0) {
            maps.push({ keyword: k, sum: util_sum(list) });
        }
    });
    return maps.sort((a, b) => a.sum - b.sum);
}

// display

function categories_displaySumPerCategory(data) {
    data.forEach(e => {
        if (e.list.length > 0) {
            const h3 = dom_create("h3");
            h3.innerText = e.category.name;
            const table = dom_create("table");
            const view = dom_get("viewDetailsCategories");
            view.append(h3);
            view.append(table);
            transactions_displayTableSimple(e.list, table);
            display_trSum(e.category.sum, table, 2);
            // vue resume
            const tr = dom_tr();
            dom_td(tr, e.category.name)
            dom_td(tr, e.category.sum)
            dom_get("tableResumeCategorie").append(tr);
        }
    });
    const sum = data.map(e => e.category.sum * 1000).reduce((a, b) => a + b) / 1000;
    display_trSum(sum, dom_get("tableResumeCategorie"), 1);
    display_lastImportDate(categories_ID);
}

function categories_displaySumPerKeyword(array) {
    array.forEach(e => {
        const tr = dom_tr();
        dom_td(tr, e.keyword);
        dom_td(tr, e.sum);
        dom_get("tableResumeKeywords").append(tr);
    });
    const sum = array.map(e => e.sum * 1000).reduce((a, b) => a + b) / 1000;
    const table = dom_get("tableResumeKeywords");
    display_trSum(sum, table, 1);
}

function categories_display(expenses) {
    display_lastImportDate(categories_ID);
    categories_displaySumPerCategory(categories_sumPerCategory(expenses));
    categories_displaySumPerKeyword(categories_sumPerKeyword(expenses));
}