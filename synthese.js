function synthese_sumIncomes() {
    const array = transanctions_incomes();
    if (!array && array.length < 0) return 0;
    const somme = util_sum(array);
    return util_round_100(somme);
}

function synthese_sumExpenses() {
    const array = transanctions_expences();
    if (!array && array.length < 0) return 0;
    const somme = util_sum(array);
    return util_round_100(somme);
}

function _synthese_displaySumBudget() {
    const table = dom_get("tableSynthese1");

    const trFre1 = dom_tr();
    dom_td(trFre1, "Recurrence mensuelle");
    dom_td(trFre1, util_round_100(budget_sumPerFrequence(1)));

    const trFre3 = dom_tr();
    dom_td(trFre3, "Recurrence trimestrielle");
    dom_td(trFre3, util_round_100(budget_sumPerFrequence(3)));

    const trFre12 = dom_tr();
    dom_td(trFre12, "Recurrence annuelle");
    dom_td(trFre12, util_round_100(budget_sumPerFrequence(12)));

    table.replaceChildren(trFre1, trFre3, trFre12);

    display_trSum(
        util_round_100(budget_sumMonth()),
        table,
        1,
        "Total Mensuel",
        true
    );

    display_trSum(
        util_round_100(budget_sumYear()),
        table,
        1,
        "Total Année"
    );

    const trSumIncomes = dom_tr();
    dom_td(trSumIncomes, "Entrees externes mois");
    dom_td(trSumIncomes, budget_sumMonthIncomes);
    table.append(trSumIncomes);

    display_trSum(
        util_round_100(budget_sumMonthProvision()),
        table,
        1,
        "Apport Mensuel",
        true
    );

    display_trSum(
        util_round_100(budget_sumYearProvision()),
        table,
        1,
        "Apport Année"
    );

}

function _synthese_displaySumMonth() {


}

function synthese_display() {
    _synthese_displaySumBudget();
    _synthese_displaySumMonth();
}