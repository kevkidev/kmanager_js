const categories_viewer_ID = "viewCategories";

function _categories_viewer_displaySumPerCategory({ transactionsPerCategory, sumPerKeyword }) {
    const view = dom_get(categories_viewer_ID);
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

    const categories = categories_manager_get().sort((a, b) => a.name.localeCompare(b.name));
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

    if (categories_storage_isEditing()) {
        view.append(tableFormAddCategory);
        view.append(tableFormAddKeyword);
    }

    transactionsPerCategory.forEach(e => {
        // lister les categories
        const category = e.category;
        const div = dom_create("div");
        let divClass = "category_title";

        const defaultCategory = categories_manager_DEFAULT_CATEGORY;
        if (category.name == defaultCategory) {
            divClass += " highlight_danger";
        }

        div.setAttribute("class", divClass);

        const h3 = dom_create("h3");
        h3.innerText = category.name;
        div.append(h3);

        if (categories_storage_isEditing() && category.name !== defaultCategory) {
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
                if (categories_storage_isEditing() && e.keyword !== categories_manager_DEFAULT_KEYWORD) {
                    const stringCallback = `actionCategoriesDeleteKeyword('${category.id}', '${e.keyword}')`;
                    const btn = dom_button_row({ stringCallback, img });
                    dom_td(tr, btn.outerHTML, true);
                }
                dom_td(tr, e.keyword);
                dom_td(tr, display_decimal(e.sum));
                table.append(tr);
            }
        });
        display_trSum(category.sum, table, categories_storage_isEditing() ? 2 : 1);
        view.append(table);
    });
    view.append(_categories_viewer_createEditButton());
}


function _categories_viewer_displaySumPerCategoryDetails(data) {
    const view = dom_get("viewDetailsCategories");
    view.replaceChildren(); // vider la vue

    data.forEach(e => {
        if (e.list.length > 0) {
            const div = dom_create("div");
            let divClass = "category_title";
            if (e.category.name == categories_manager_DEFAULT_CATEGORY) {
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
    common_display_lastImportDate({
        prefixId: display_DATE_IMPORT_PREFIX_ID,
        suffixId: categories_controller_STORAGE_ID
    });
}


function categories_viewer_display(expenses) {
    common_display_lastImportDate({
        prefixId: display_DATE_IMPORT_PREFIX_ID,
        suffixId: categories_controller_STORAGE_ID
    });
    _categories_viewer_displaySumPerCategory({
        transactionsPerCategory: categories_manager_calculateSumPerCategory(expenses),
        sumPerKeyword: categories_manager_calculateSumPerKeyword(expenses)
    });
    _categories_viewer_displaySumPerCategoryDetails(categories_manager_calculateSumPerCategory(expenses));
}


function _categories_viewer_createEditButton() {
    return display_createEditButton({ controller: categories_controller_clickEditButton });
}