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
}

function categories_exportCSV() {
    let categories = storage_get(categories_ID);
    io_exportCSV("categories", function () {

        if (!categories) {
            display_popup("Pas de données à exporter!");
            return;
        }

        const rows = [
            ["name", "keywords"]
        ];

        categories.forEach(e => {
            rows.push([e.name, e.keywords]); // keywords separés par des virgules
        });

        return rows;
    });
}

function categories_getKeywords(categories) {
    return categories.map(e => e.keywords).reduce((a, b) => a.concat(b));
}

// display

function categories_afficherSumParCategory(data) {
    data.forEach(e => {
        if (e.list.length > 0) {
            const h3 = dom_create("h3");
            h3.innerText = e.category.name;
            const table = dom_create("table");
            const view = dom_get("viewDetailsCategories");
            view.append(h3);
            view.append(table);
            transanctions_displayTableSimple(e.list, table);
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
}

function categories_afficherSumParKeyword(array) {
    array.forEach(e => {
        const tr = dom_tr();
        dom_td(tr, e.keyword);
        dom_td(tr, e.sum);
        dom_get("tableResumeKeywords").append(tr);
    })

    const sum = array.map(e => e.sum * 1000).reduce((a, b) => a + b) / 1000;
    const table = dom_get("tableResumeKeywords");
    display_trSum(sum, table, 1);
}

function categories_displayLastImportDate() {
    display_lastImportDate(categories_ID);
}