const categories_ID = "categories";
const categories_EDITING = "categories_editing";

function categories_importCSV(text) {
    const value = io_extractCSV(text, function (currentLine) {
        const categories = {
            id: currentLine[0],
            name: currentLine[1],
            keywords: currentLine[2].split(','),
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
        if (storage_get(categories_EDITING) === true || list.length > 0) {
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
        if (storage_get(categories_EDITING) === true || list.length > 0) {
            maps.push({ keyword: k, sum: util_sum(list) });
        }
    });
    return maps.sort((a, b) => a.sum - b.sum);
}


function categories_deleteKeyword({ categoryId, keyword }) {
    const array = storage_get(categories_ID);
    const categoryIndex = array.findIndex(e => e.id == categoryId);
    const keywordIndex = array[categoryIndex].keywords.findIndex(e => e == keyword);
    const confirmation = confirm(`Confirmer suppression de ${keyword} ?`);
    if (confirmation) {
        array[categoryIndex].keywords.splice(keywordIndex, 1);
        storage_update(categories_ID, array);
    }
}

function category_addKeyword() {
    const keyword = dom_get("input_keyword").value;
    const categoryId = dom_get("selected_category").value;

    if (!keyword || !categoryId) return;

    const list = categories_get(categories_ID);
    list.filter(e => e.id == categoryId)[0].keywords.push(keyword);
    storage_update(categories_ID, list);
}

function category_add() {
    const name = dom_get("input_category").value;

    if (!name) return;
    const newItem = { id: storage_newId(), name, keywords: [] };
    storage_add(categories_ID, newItem);
}

// display

function categories_displaySumPerCategory({ transactionsPerCategory, sumPerKeyword }) {
    const view = dom_get("viewCategories");
    view.replaceChildren(); // vider la vue

    // generer form categorie
    const trForm = dom_tr();
    dom_td(trForm, `<img class="img_row_action" src="img/icons8-add-50.png" onclick="actionCategoryAddItem()"/>`, true);
    dom_td(trForm, dom_input("input_category", "text", "Catégorie").outerHTML, true);
    const tableFormAddCategory = dom_create("table");
    tableFormAddCategory.append(trForm);

    // generer form keyword
    const trForm2 = dom_tr();
    dom_td(trForm2, `<img class="img_row_action" src="img/icons8-add-50.png" onclick="actionCategoryAddKeyword()"/>`, true);
    dom_td(trForm2, dom_input("input_keyword", "text", "Mot-clé").outerHTML, true);
    const select = dom_create("select");
    select.setAttribute("id", "selected_category");

    const categories = categories_get();

    categories.forEach(e => {
        // remplir les options du select
        const option = dom_create("option");
        option.text = e.name;
        option.value = e.id;
        select.add(option);
    });
    dom_td(trForm2, select.outerHTML, true); // append le select

    const tableFormAddKeyword = dom_create("table");
    tableFormAddKeyword.append(trForm2);

    transactionsPerCategory.forEach(e => {

        // lister les categories
        const category = e.category;
        const h3 = dom_create("h3");
        h3.innerText = category.name;
        view.append(h3);

        // remplir table de keyword et somme
        const table = dom_create('table');
        sumPerKeyword.forEach(e => {
            if (category.keywords.includes(e.keyword)) {
                const tr = dom_tr();
                const action = `actionCategoriesDeleteKeyword('${category.id}', '${e.keyword}')`;
                if (storage_get(categories_EDITING) === true) {
                    dom_td(tr, `<img class="img_row_action" src="img/icons8-remove-50.png" onclick="${action}"/>`, true);
                }
                dom_td(tr, e.keyword);
                dom_td(tr, display_decimal(e.sum));
                table.append(tr);
            }
        });
        display_trSum(category.sum, table, (storage_get(categories_EDITING) === true) ? 2 : 1);
        view.append(table);
    });

    const editBtn = dom_create("button");
    editBtn.onclick = function () {
        storage_update(categories_EDITING, true);
        load();
    }
    editBtn.innerText = "Mofidier";

    if (storage_get(categories_EDITING) === true) {
        view.append(tableFormAddCategory);
        view.append(tableFormAddKeyword);
        editBtn.innerText = "Terminer";
        editBtn.onclick = function () {
            storage_update(categories_EDITING, false);
            load();
        }
    }
    view.append(editBtn);
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

function categories_display(expenses) {
    display_lastImportDate(categories_ID);
    categories_displaySumPerCategory({
        transactionsPerCategory: categories_sumPerCategory(expenses),
        sumPerKeyword: categories_sumPerKeyword(expenses)
    });
    categories_displaySumPerCategory_details(categories_sumPerCategory(expenses));
}