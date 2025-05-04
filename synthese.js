

function synthese_displaySumBudget() {
    const table = dom_get("tableSynthese1");

    const trFre1 = dom_tr();
    dom_td(trFre1, "Recurrence mensuelle");
    dom_td(trFre1, display_decimal(budget_sumPerFrequence(1)));

    const trFre3 = dom_tr();
    dom_td(trFre3, "Recurrence trimestrielle");
    dom_td(trFre3, display_decimal(budget_sumPerFrequence(3)));

    const trFre12 = dom_tr();
    dom_td(trFre12, "Recurrence annuelle");
    dom_td(trFre12, display_decimal(budget_sumPerFrequence(12)));

    table.replaceChildren(trFre1, trFre3, trFre12);

    display_trSum(
        budget_sumMonth(),
        table,
        1,
        "Total Mensuel",
        true
    );

    display_trSum(
        budget_sumYear(),
        table,
        1,
        "Total Année"
    );

    display_trSum(
        budget_sumMonthProvision(),
        table,
        1,
        "Apport Mensuel",
        true
    );

    display_trSum(
        budget_sumYearProvision(),
        table,
        1,
        "Apport Année"
    );

}

function _td({ title, value, highlight }) {
    const tr = dom_tr();
    dom_td(tr, title, false);
    dom_td(tr, display_decimal(value), false, true, highlight);
    return tr;
}

function synthese_displaySumMonth({ incomes, expenses }) {

    const sumIncomes = util_sum(incomes);
    const sumIncomesInternal = util_sum(incomes.filter(i => i.category == "interne"));
    const sumIncomesExt = sumIncomes - sumIncomesInternal;
    const table = dom_get("tableSynthese2");
    const diffExpenses = util_sum(expenses) + budget_sumMonth();

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