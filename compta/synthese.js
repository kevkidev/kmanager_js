function synthese_controller_getViewParams() {
    return { title: "Synthèse", id: "viewSynthese", imgSrc: "../img/icons8-improvement-64.png" };
}

function synthese_displaySumBudget() {
    const table = dom_get("tableSynthese1");

    const trFre1 = dom_tr();
    dom_td(trFre1, "Recurrence mensuelle");
    dom_td(trFre1, util_intToDecimal(budget_manager_calculateSumPerFrequence(1)));

    const trFre3 = dom_tr();
    dom_td(trFre3, "Recurrence trimestrielle");
    dom_td(trFre3, util_intToDecimal(budget_manager_calculateSumPerFrequence(3)));

    const trFre12 = dom_tr();
    dom_td(trFre12, "Recurrence annuelle");
    dom_td(trFre12, util_intToDecimal(budget_manager_calculateSumPerFrequence(12)));

    table.replaceChildren(trFre1, trFre3, trFre12);

    components_trSum(
        budget_manager_calulateSumMonth(),
        table,
        1,
        "Total Mensuel",
        true
    );

    components_trSum(
        budget_manager_calculateSumYear(),
        table,
        1,
        "Total Année"
    );

    components_trSum(
        budget_manager_calculateSumMonthProvision(),
        table,
        1,
        "Apport Mensuel",
        true
    );

    components_trSum(
        budget_manager_calculateSumYearProvision(),
        table,
        1,
        "Apport Année"
    );

}

function _td({ title, value, highlight }) {
    const tr = dom_tr();
    dom_td(tr, title, false);
    dom_td(tr, util_intToDecimal(value), false, true, highlight);
    return tr;
}

function synthese_displaySumMonth({ incomes, expenses }) {

    const sumIncomes = util_sum(incomes);
    const sumIncomesInternal = util_sum(incomes.filter(i => i.category == "interne"));
    const sumIncomesExt = sumIncomes - sumIncomesInternal;
    const table = dom_get("tableSynthese2");
    const diffExpenses = util_sum(expenses) + budget_manager_calulateSumMonth();

    table.replaceChildren(
        _td({ title: "Sorties", value: util_sum(expenses) }),
        _td({ title: "Entrées", value: sumIncomes }),
        _td({ title: "dont extrenes", value: sumIncomesExt }),
        _td({ title: "dont internes", value: sumIncomesInternal }),
        _td({ title: "Différence", value: diffExpenses, highlight: true }),
    );
}

function synthese_displayTreasure() {
    const table = dom_get("tableSynthese3");

    table.replaceChildren();
    // TODO
}

function synthese_components_view() {
    return components_view({
        viewId: "viewSynthese",
        bodyChildren: [
            dom_h({ number: 2, text: "Prévisions" }),
            dom_table({ id: "tableSynthese1" }),
            dom_h({ number: 2, text: "Mois" }),
            dom_table({ id: "tableSynthese2" }),
            dom_h({ number: 2, text: "Trésor" }),
            dom_table({ id: "tableSynthese3" }),
        ],
    });
}