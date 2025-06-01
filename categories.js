const categories_ID = "categories";
const categories_EDITING = "categories_editing";
const categories_DEFAULT_CATEGORY = "inconnue";
const categories_DEFAULT_KEYWORD = "inconnu";

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
            name: categories_DEFAULT_CATEGORY,
            keywords: [categories_DEFAULT_KEYWORD]
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
        if (categories_isEditing() || list.length > 0) {
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
        if (categories_isEditing() || list.length > 0) {
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

function categories_deleteItem({ categoryId }) {
    const array = storage_get(categories_ID);
    const index = array.findIndex(e => e.id == categoryId);
    const confirmation = confirm(`Confirmer suppression de '${array[index].name}', mots-clés seront assignés à '${categories_DEFAULT_CATEGORY}' ?`);
    if (confirmation) {
        const defaultIndex = array.findIndex(e => e.name == categories_DEFAULT_CATEGORY);
        if (defaultIndex < 0) {
            storage_addMessage("Suppression impossible : Il faut une catégorie nommée : " + categories_DEFAULT_CATEGORY);
            return;
        }
        array[defaultIndex].keywords.push(...array[index].keywords);
        array.splice(index, 1);
        storage_update(categories_ID, array);
    }
}

function category_addKeyword() {
    const keyword = dom_get("input_keyword").value.toLowerCase();
    const categoryId = dom_get("selected_category").value;

    if (!keyword || !categoryId) return;

    const list = categories_get(categories_ID);
    list.filter(e => e.id == categoryId)[0].keywords.push(keyword);
    storage_update(categories_ID, list);
}

function category_add() {
    const name = dom_get("input_category").value.toLowerCase();

    if (!name) return;
    const newItem = { id: storage_newId(), name, keywords: [] };
    storage_add(categories_ID, newItem);
}

function categories_isEditing() {
    return storage_get(categories_EDITING) === true;
}

function category_assignKeyword() {
    const keyword = dom_get("assignKeyword_item").value;
    const categoryId = dom_get("assignKeyword_category").value;

    if (!keyword || !categoryId) return;

    const array = categories_get(categories_ID);
    // trouver la categorie qui contient le keyword
    const indexToClean = array.findIndex(e => e.keywords.includes(keyword));
    // trouver l'index du keyword en supprimer
    const indextoRemove = array[indexToClean].keywords.indexOf(keyword);
    // supprimer le keyword de la categories
    array[indexToClean].keywords.splice(indextoRemove, 1);
    // ajouter le keyword à la bonne categorie
    array.find(e => e.id == categoryId).keywords.push(keyword);
    // save
    storage_update(categories_ID, array);
}

// display

function categories_displaySumPerCategory({ transactionsPerCategory, sumPerKeyword }) {
    const viewId = "viewCategories";
    const view = dom_get(viewId);
    view.replaceChildren(); // vider la vue

    // generer form categorie
    const trForm = dom_tr();
    const img = dom_img_row_add();
    const btn = dom_button_row({ stringCallback: "actionCategoryAddItem()", img });
    dom_td(trForm, dom_input("input_category", "text", "Catégorie").outerHTML, true);
    dom_td(trForm, btn.outerHTML, true);
    const tableFormAddCategory = dom_create("table");
    tableFormAddCategory.append(trForm);

    // generer form keyword
    const trForm2 = dom_tr();
    const btn2 = dom_button_row({ stringCallback: "actionCategoryAddKeyword()", img });
    dom_td(trForm2, dom_input("input_keyword", "text", "Mot-clé").outerHTML, true);
    const select = dom_create("select");
    select.setAttribute("id", "selected_category");

    function _fillSelectWithCategories({ categories, select }) {
        categories.forEach(e => {
            // remplir les options du select
            const option = dom_create("option");
            option.text = e.name;
            option.value = e.id;
            select.add(option);
        });
    }

    const categories = categories_get().sort((a, b) => a.name.localeCompare(b.name));
    _fillSelectWithCategories({ categories, select });
    dom_td(trForm2, select.outerHTML, true); // append le select
    dom_td(trForm2, btn2.outerHTML, true);

    function _buildFormAssignKeyword() {// generer form assigner keyword à catégorie
        const keywords = sumPerKeyword.map(e => e.keyword).sort();
        const select = dom_create("select");
        select.setAttribute("id", "assignKeyword_item");
        keywords.forEach(e => {// remplir les options du select
            const option = dom_create("option");
            option.text = e;
            select.add(option);
        });

        const select2 = dom_create("select");
        select2.setAttribute("id", "assignKeyword_category");
        _fillSelectWithCategories({ categories, select: select2 });

        const btn = dom_button_row({ stringCallback: "actionCategoryAssignKeyword()", img });

        const tr = dom_tr();
        dom_td(tr, select.outerHTML, true);
        dom_td(tr, select2.outerHTML, true);
        dom_td(tr, btn.outerHTML, true);

        return tr;
    }

    const trForm3 = _buildFormAssignKeyword();

    const tableFormAddKeyword = dom_create("table");
    tableFormAddKeyword.append(trForm2);
    tableFormAddKeyword.append(trForm3);

    if (categories_isEditing()) {
        view.append(tableFormAddCategory);
        view.append(tableFormAddKeyword);
    }

    transactionsPerCategory.forEach(e => {
        // lister les categories
        const category = e.category;
        const div = dom_create("div");
        let divClass = "category_title";

        if (category.name == categories_DEFAULT_CATEGORY) {
            divClass += " highlight_danger";
        }

        div.setAttribute("class", divClass);

        const h3 = dom_create("h3");
        h3.innerText = category.name;
        div.append(h3);

        if (categories_isEditing() && category.name !== categories_DEFAULT_CATEGORY) {
            const stringCallback = `actionCategoriesDeleteItem('${category.id}')`;
            const btn = dom_button_row({ stringCallback, img: dom_img_row_delete() });
            div.append(btn);
        }

        view.append(div);

        // remplir table de keyword et somme
        const table = dom_create('table');
        sumPerKeyword.forEach(e => {
            if (category.keywords.includes(e.keyword)) {
                const tr = dom_tr();
                const img = dom_img_row_delete();
                if (categories_isEditing() && e.keyword !== categories_DEFAULT_KEYWORD) {
                    const stringCallback = `actionCategoriesDeleteKeyword('${category.id}', '${e.keyword}')`;
                    const btn = dom_button_row({ stringCallback, img });
                    dom_td(tr, btn.outerHTML, true);
                }
                dom_td(tr, e.keyword);
                dom_td(tr, display_decimal(e.sum));
                table.append(tr);
            }
        });
        display_trSum(category.sum, table, categories_isEditing() ? 2 : 1);
        view.append(table);
    });
    view.append(display_createEditButton(categories_EDITING, viewId));
}


function categories_displaySumPerCategory_details(data) {
    const view = dom_get("viewDetailsCategories");
    view.replaceChildren(); // vider la vue

    data.forEach(e => {
        if (e.list.length > 0) {
            const div = dom_create("div");
            let divClass = "category_title";
            if (e.category.name == categories_DEFAULT_CATEGORY) {
                divClass += " highlight_danger";
            }
            div.setAttribute("class", divClass);
            const h3 = dom_create("h3");
            h3.innerText = e.category.name;
            div.append(h3);
            const table = dom_create("table");
            view.append(div);
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