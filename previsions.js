const budget_ID = "previsions";

function budget_importCSV(text) {

    function extractCSV(text) {
        return io_extractCSV(text, function (currentLine) {
            const previsions = {
                id: currentLine[0],
                quoi: currentLine[1],
                frequence: currentLine[2],
                combien: currentLine[3],
            };
            return previsions;
        });
    }

    storage_update(budget_ID, extractCSV(text));
    storage_recordImportDate(budget_ID);
}

function budget_exportCSV() {
    io_exportCSV("previsions", function () {

        const array = storage_get(budget_ID);
        if (!array) {
            display_popup("Pas de données à exporter!");
            return;
        }

        const rows = [
            ["id", "quoi", "frequence", "combien"]
        ];

        array.forEach(e => {
            rows.push([e.id, e.quoi, e.frequence, e.combien]);
        });

        return rows;
    });
}

function budget_add() {
    const quoi = dom_get("prevQuoi").value;
    const frequence = dom_get("prevFrequence").value;
    const combien = dom_get("prevCombien").value;

    if (!quoi || !frequence || !combien) return;
    if (frequence < 0 || combien < 0) return;

    const newItem = { id: storage_newId(), quoi, frequence, combien };
    storage_add(budget_ID, newItem);
    budget_display();
}

function budget_deleteItem(id) {
    const array = storage_get(budget_ID);
    const index = array.findIndex(e => e.id == id);
    const confirmation = confirm(`Confirmer suppression de ${array[index].quoi} ?`);
    if (confirmation) {
        array.splice(index, 1);
        storage_update(budget_ID, array);
        budget_display();
    }
}

function budget_displayLastImportDate() {
    display_lastImportDate(budget_ID);
}

function budget_display() {
    const data = storage_get(budget_ID);
    const trHead = dom_tr();
    dom_th(trHead, "");
    dom_th(trHead, "Quoi");
    dom_th(trHead, "Fréquence");
    dom_th(trHead, "Combien");
    dom_get("tablePrevisions").replaceChildren(trHead);

    if (data) {
        data.forEach(e => {
            const tr = dom_tr();
            dom_td(tr, `<img class="img_row_action" src="img/icons8-remove-50.png" onclick="actionBudgetDeleteItem(${e.id})"/>`, true);
            dom_td(tr, e.quoi);
            dom_td(tr, e.frequence);
            dom_td(tr, e.combien);
            dom_get("tablePrevisions").append(tr);
        });
    }

    // generer la derniere ligne du tableau sont forme de formulaire pour l'ajout d'une prévision
    const trForm = dom_tr();
    dom_td(trForm, `<img class="img_row_action" src="img/icons8-add-50.png" onclick="actionBudgetAddItem()"/>`, true);
    dom_td(trForm, dom_input("prevQuoi", "text").outerHTML, true);
    dom_td(trForm, dom_input("prevFrequence", "number").outerHTML, true);
    dom_td(trForm, dom_input("prevCombien", "number").outerHTML, true);
    dom_get("tablePrevisions").append(trForm);
}


const budget_sumMonthIncomes = 750; // à recuper dans storage , import 

function budget_sumYear() {
    const entier = budget_sumPerFrequence(1) * 1000 * 12 +
        budget_sumPerFrequence(3) * 1000 * 4 +
        budget_sumPerFrequence(12) * 1000;
    return entier / 1000;
}

function budget_sumPerFrequence(frequence) {
    const array = storage_get(budget_ID);
    if (!array && array.length == 0) return 0;
    const filtered = array.filter(e => e.frequence == frequence);
    if (filtered.length == 0) return 0;
    const sum = util_sum(filtered);
    return sum;
}

function budget_sumMonth() {
    return budget_sumYear() * 1000 / 12 / 1000;
}

function budget_sumMonthProvision() {
    return (budget_sumMonth() * 1000 - budget_sumMonthIncomes * 1000) / 1000;
}

function budget_sumYearProvision() {
    return budget_sumMonthProvision() * 1000 * 12 / 1000;
}