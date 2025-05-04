

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

    const trSumIncomes = dom_tr();
    dom_td(trSumIncomes, "Entrees externes mois");
    dom_td(trSumIncomes, display_decimal(budget_sumMonthIncomes));
    table.append(trSumIncomes);

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

function synthese_displaySumMonth() {
    // function _trSub({ title, value }) {
    //     display_trSub({
    //         value,
    //         table,
    //         colapse: 1,
    //         title
    //     });
    // }

    const trans = storage_get(transactions_ID);

    const expenses = util_sum(transactions_expences(trans));
    const incomes = util_sum(transactions_incomes(trans));
    const table = dom_get("tableSynthese2");

    const tr2 = dom_tr();
    dom_td(tr2, "Sorties", false);
    dom_td(tr2, display_decimal(expenses), false, true);

    const tr1 = dom_tr();
    dom_td(tr1, "Entrées", false);
    dom_td(tr1, display_decimal(incomes), false, true);

    const diffExpenses = expenses + budget_sumMonth();
    const tr3 = dom_tr();
    dom_td(tr3, "Différence", false);
    dom_td(tr3, display_decimal(diffExpenses), false, true, true);

    table.replaceChildren(tr2, tr1, tr3);
}