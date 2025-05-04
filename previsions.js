const budget_ID = "previsions";
const budget_sumMonthIncomes = 750 * 1000; // à recuper dans storage , import //todo

function budget_importCSV(text) {
    function extractCSV(text) {
        return io_extractCSV(text, function (currentLine) {
            const previsions = {
                id: currentLine[0],
                quoi: currentLine[1],
                frequence: currentLine[2],
                combien: util_withPrecision(currentLine[3]),
            };
            return previsions;
        });
    }

    storage_update(budget_ID, extractCSV(text));
    storage_recordImportDate(budget_ID);
    storage_addMessage("Budget importé avec succès!");
}

function budget_exportCSV() {
    io_exportCSV("previsions", function () {
        const array = storage_get(budget_ID);
        if (!array) {
            storage_addMessage("Pas de données à exporter!");
            return;
        }
        const rows = [
            ["id", "quoi", "frequence", "combien"]
        ];
        array.forEach(e => {
            rows.push([e.id, e.quoi, e.frequence, display_decimal(e.combien)]);
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

    const newItem = { id: storage_newId(), quoi, frequence, combien: util_withPrecision(combien) };
    storage_add(budget_ID, newItem);
}

function budget_deleteItem(id) {
    const array = storage_get(budget_ID);
    const index = array.findIndex(e => e.id == id);
    const confirmation = confirm(`Confirmer suppression de ${array[index].quoi} ?`);
    if (confirmation) {
        array.splice(index, 1);
        storage_update(budget_ID, array);
    }
}

function budget_display() {
    const data = storage_get(budget_ID);
    const trHead = dom_tr();
    dom_th(trHead, "");
    dom_th(trHead, "Quoi");
    dom_th(trHead, "Fréquence (mois)");
    dom_th(trHead, "Combien (€)");
    dom_get("tablePrevisions").replaceChildren(trHead);

    if (data) {
        data.forEach(e => {
            const tr = dom_tr();
            dom_td(tr, `<img class="img_row_action" src="img/icons8-remove-50.png" onclick="actionBudgetDeleteItem(${e.id})"/>`, true);
            dom_td(tr, e.quoi);
            dom_td(tr, e.frequence);
            dom_td(tr, display_decimal(e.combien));
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

    display_lastImportDate(budget_ID);
}

function budget_sumYear() {
    const entier = budget_sumPerFrequence(1) * 12 +
        budget_sumPerFrequence(3) * 4 +
        budget_sumPerFrequence(12);
    return entier;
}

function budget_sumPerFrequence(frequence) {
    const array = storage_get(budget_ID);
    if (!array || array.length == 0) return 0;
    const filtered = array.filter(e => e.frequence == frequence);
    if (filtered.length == 0) return 0;
    const sum = util_sum(filtered);
    return sum;
}

function budget_sumMonth() {
    return budget_sumYear() / 12;
}

function budget_sumMonthProvision() {
    return budget_sumMonth() - budget_sumMonthIncomes;
}

function budget_sumYearProvision() {
    return budget_sumMonthProvision() * 12;
}