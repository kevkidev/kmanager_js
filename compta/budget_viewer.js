// # budget viewer

function budget_viewer_display() {
    const data = budget_storage_get();
    const trHead = dom_tr();
    if (budget_storage_isEditing()) {
        dom_th(trHead, "");
    }
    dom_th(trHead, "Quoi");
    dom_th(trHead, "N mois");
    dom_th(trHead, "Euros");

    const table = dom_create("table");
    table.append(trHead);

    if (data) {
        data.sort((a, b) => b.combien - a.combien).forEach(e => {
            const tr = dom_tr();
            const img = dom_img_row_delete();

            if (budget_storage_isEditing()) {
                const btn = dom_button_row({ stringCallback: `actionBudgetDeleteItem(${e.id})`, img });
                dom_td(tr, btn.outerHTML, true);
            }

            dom_td(tr, e.quoi);
            dom_td(tr, e.frequence);
            dom_td(tr, util_intToDecimal(e.combien));
            table.append(tr);
        });
    }

    // generer la derniere ligne du tableau sont forme de formulaire pour l'ajout d'une prévision
    if (budget_storage_isEditing()) {
        const trForm = dom_tr();
        const img = dom_img_row_add();
        const btn = dom_button_row({ stringCallback: "actionBudgetAddItem()", img });
        dom_td(trForm, btn.outerHTML, true);
        dom_td(trForm, dom_input("prevQuoi", "text").outerHTML, true);
        dom_td(trForm, dom_input("prevFrequence", "number").outerHTML, true);
        dom_td(trForm, dom_input("prevCombien", "number").outerHTML, true);
        table.append(trForm);
    }

    const view = dom_get("viewBudget");
    const editButton = components_editButton(budget_controller_clickEditButton());
    view.replaceChildren(table, editButton);
    common_display_lastImportDate({
        prefixId: storage_LAST_DATE_IMPORT_PREFIX_ID,
        suffixId: budget_storage_ID
    });
}