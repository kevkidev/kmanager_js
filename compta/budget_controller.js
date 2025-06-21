
function budget_controller_getViewParams() {
    return {
        title: "Budget",
        id: "viewBudget",
        imgSrc: "../img/icons8-stocks-growth-64.png",
    }
}

function budget_controller_getDomIds() {
    return {
        INPUT_IMPORT_CSV: "inputImportCSVBudget",
    }
}

function budget_controller_add() {
    const quoi = dom_get("prevQuoi").value;
    const frequence = dom_get("prevFrequence").value;
    const combien = dom_get("prevCombien").value;

    if (!quoi || !frequence || !combien) return;
    if (frequence < 0 || combien < 0) return;

    const newItem = { id: storage_newId(), quoi, frequence, combien: util_withPrecision(combien) };
    budget_storage_add({ newItem });
}

function budget_controller_deleteItem(id) {
    const array = budget_storage_get();
    const index = array.findIndex(e => e.id == id);
    const confirmation = confirm(`Confirmer suppression de ${array[index].quoi} ?`);
    if (confirmation) {
        array.splice(index, 1);
        budget_storage_update({ value: array });
    }
}

function budget_controller_clickEditButton() {
    const isEditing = budget_storage_isEditing();
    return {
        isEditing,
        onclick: function () {
            budget_storage_setEditing({ value: !isEditing });
            const viewIdToKeepOpen = budget_controller_getViewParams().id;
            app_manager_reload({ viewIdToKeepOpen });
        }
    }
}