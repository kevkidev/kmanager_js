
function categories_controller_getViewParams() {
    return {
        title: "Catégories",
        id: "viewCategories",
        imgSrc: "../img/icons8-folder-tree-64.png"
    }
}

function categories_controller_getViewDetailsParams() {
    return {
        title: "Détails par catégorie",
        id: "viewDetailsCategories",
        imgSrc: "../img/icons8-tree-structure-64.png"
    }
}

function categories_controller_deleteKeyword({ categoryId, keyword }) {
    const array = categories_manager_get();
    const categoryIndex = array.findIndex(e => e.id == categoryId);
    const keywordIndex = array[categoryIndex].keywords.findIndex(e => e == keyword);
    const confirmation = confirm(`Confirmer suppression de ${keyword} ?`);
    if (confirmation) {
        array[categoryIndex].keywords.splice(keywordIndex, 1);
        categories_storage_update({ newArray: array });
    }
}

function categories_controller_deleteItem({ categoryId }) {
    const array = categories_manager_get();
    const index = array.findIndex(e => e.id == categoryId);
    const defaultCategory = categories_manager_DEFAULT_CATEGORY;
    const confirmation = confirm(`Confirmer suppression de '${array[index].name}', mots-clés seront assignés à '${defaultCategory}' ?`);
    if (confirmation) {
        const defaultIndex = array.findIndex(e => e.name == defaultCategory);
        if (defaultIndex < 0) {
            storage_addMessage({ message: "Suppression impossible : Il faut une catégorie nommée : " + defaultCategory });
            return;
        }
        array[defaultIndex].keywords.push(...array[index].keywords);
        array.splice(index, 1);
        categories_storage_update({ newArray: array });
    }
}

function category_controller_addKeyword() {
    const keyword = dom_get("input_keyword").value.toLowerCase();
    const categoryId = dom_get("selected_category").value;

    if (!keyword || !categoryId) return;

    const list = categories_manager_get();
    list.filter(e => e.id == categoryId)[0].keywords.push(keyword);
    categories_storage_update({ newArray: list });
}

function category_controller_add() {
    const name = dom_get("input_category").value.toLowerCase();

    if (!name) return;
    const newItem = { id: storage_newId(), name, keywords: [] };
    categories_storage_add({ newItem });
}

function category_controller_assignKeyword() {
    const keyword = dom_get("assignKeyword_item").value;
    const categoryId = dom_get("assignKeyword_category").value;

    if (!keyword || !categoryId) return;

    const array = categories_manager_get();
    // trouver la categorie qui contient le keyword
    const indexToClean = array.findIndex(e => e.keywords.includes(keyword));
    // trouver l'index du keyword en supprimer
    const indextoRemove = array[indexToClean].keywords.indexOf(keyword);
    // supprimer le keyword de la categories
    array[indexToClean].keywords.splice(indextoRemove, 1);
    // ajouter le keyword à la bonne categorie
    array.find(e => e.id == categoryId).keywords.push(keyword);
    // save
    categories_storage_update({ newArray: array });
}

function categories_controller_clickEditButton() {
    const isEditing = categories_storage_isEditing();
    return {
        isEditing,
        onclick: function () {
            categories_storage_setEditing({ value: !isEditing });
            app_manager_reload({ viewIdToKeepOpen: categories_controller_getViewParams().id });
        }
    };
}
