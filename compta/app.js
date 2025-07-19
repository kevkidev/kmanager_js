function App() {

    function buildView({ incomes, expenses }) {

        if (expenses && expenses.length > 0) {
            const viewS = Dom().show("view_synthese");
            viewS.innerText += `\n___SYNTHESE___ \n`;
            viewS.innerText += `Total entrées: [${Util().intToDecimal(Util().sum(incomes.map(e => e.amount)))}] \n`;
            viewS.innerText += `Total sorties: [${Util().intToDecimal(Util().sum(expenses.map(e => e.amount)))}]** \n\n`;

            viewS.innerText += `___PREVISIONS___\n`;
            viewS.innerText += `Tous les 1 mois: [ ${Util().intToDecimal(BudgetManager().calculateSumPerFrequency(1))} ] \n`;
            viewS.innerText += `Tous les 3 mois: [ ${Util().intToDecimal(BudgetManager().calculateSumPerFrequency(3))} ] \n`;
            viewS.innerText += `Tous les 12 mois: [ ${Util().intToDecimal(BudgetManager().calculateSumPerFrequency(12))} ] \n\n`;

            viewS.innerText += `>> Total mensuel: [ ${Util().intToDecimal(BudgetManager().calulateSumMonth())} ]** \n`;
            viewS.innerText += `Total annelle: [ ${Util().intToDecimal(BudgetManager().calculateSumYear())} ] \n`;
            viewS.innerText += `>> Apport mensuel: [ ${Util().intToDecimal(BudgetManager().calculateSumMonthProvision())} ]** \n`;
            viewS.innerText += `Apport annuelle: [ ${Util().intToDecimal(BudgetManager().calculateSumYearProvision())} ] \n`;

            viewS.innerText += `\n___TRESOR___\n`;
            viewS.innerText += `\n\n`;
        }

        const budgets = BudgetStorage().get();
        if (budgets && budgets.length > 0) {
            const viewB = Dom().show("view_budget");
            viewB.innerText += `\n___BUDGET___ \n`;
            budgets.forEach(e => {
                viewB.innerText += `[ ${Util().intToDecimal(e.amount)} ] <<< [ ${e.subject} ] = ${e.frequency} mois\n`;
            })
        }

        const transactionsPerCategory = CategoryManager().calculateSumPerCategory(expenses);
        if (transactionsPerCategory && transactionsPerCategory.length > 0) {
            const viewT = Dom().show("view_transactions");
            const tpc = transactionsPerCategory;
            viewT.innerText += `___TRANSACTIONS par CATEGORY___\n`;
            tpc.forEach(e => {
                viewT.innerText += `[ ${e.category.name} ] ==> [ ${Util().intToDecimal(e.category.sum)} ] \n`;
                e.list.forEach(t => {
                    const amount = Util().intToDecimal(t.amount);
                    viewT.innerText += `\t\xa0 ${amount} <==  \t ${t.subject} --- ( ${t.date} ) \n`;
                })
                viewT.innerText += `[ ${Util().intToDecimal(e.category.sum)} ] <== ${e.category.name} \n\n`;
            })
        }
    }

    return {

        start: function () {

            AppController().initImportListener();

            const transactions = TransactionStorage().get();
            if (!transactions || transactions.length < 0) {
                Dom().show("view_importTransactions");
            }

            const categories = CategoryStorage().get();
            if (!categories || categories.length < 0) {
                Dom().show("view_importCategories");
            }

            const budget = BudgetStorage().get();
            if (!budget || budget.length < 0) {
                Dom().show("view_importBudget");
            }
            const { incomes, expenses } = TransactionManager().build();
            if (expenses && expenses.length > 0) {
                buildView({ incomes, expenses });
            }
        },
        dependencies: function ({ declarations, onFinish, parent }) {
            if (declarations.length == 0) {
                onFinish();
                return;
            }
            const src = declarations.shift();
            document.head.appendChild(
                Dom().script({
                    src,
                    onload: function () {
                        App().dependencies({ declarations, onFinish, parent });
                    }
                })
            )
        },
    }
}

App().dependencies({
    declarations: [
        "../common/util.js",
        "storage.js",
        "io.js",
        "budget_storage.js",
        "budget_manager.js",
        "transaction_storage.js",
        "transaction_manager.js",
        "category_storage.js",
        "category_manager.js",
        "app_controller.js",
    ],
    parent: "compta",
    onFinish: App().start
});