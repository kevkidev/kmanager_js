function BudgetManager() {
    return {
        getViewParams() {
            return {
                title: "Budget",
                id: "viewBudget",
                imgSrc: "../img/icons8-stocks-growth-64.png",
            }
        },
        importCSV: function (text) {
            BudgetStorage().update({
                value: io_extractCSV({
                    text,
                    buildObjectMethod: function (currentLine) {
                        const budget = {
                            id: currentLine[0],
                            subject: currentLine[1],
                            frequency: currentLine[2],
                            amount: Util().withPrecision(currentLine[3]),
                        };
                        console.info(budget);
                        return budget;
                    }
                })
            });

            console.warn("Budget importé avec succés!");
            location.reload();
        },
        exportCSV: function () {
            io_exportCSV("budget", function () {
                const array = BudgetStorage().get();
                if (!array) {
                    storage_addMessage({ message: "Pas de données à exporter!" });
                    return;
                }
                const rows = [
                    ["id", "subject", "frequency", "amount"]
                ];
                array.forEach(e => {
                    rows.push([e.id, e.subject, e.frequency, Util().intToDecimal(e.amount)]);
                });

                return rows;
            });
        },
        calculateSumYear: function () {
            const entier = BudgetManager().calculateSumPerFrequency(1) * 12 +
                BudgetManager().calculateSumPerFrequency(3) * 4 +
                BudgetManager().calculateSumPerFrequency(12);
            return entier;
        },
        calculateSumPerFrequency: function (frequency) {
            const array = BudgetStorage().get();
            if (!array || array.length == 0) return 0;
            const filtered = array.filter(e => e.frequency == frequency);
            if (filtered.length == 0) return 0;
            const sum = Util().sum(filtered.map(e => e.amount));
            return sum;
        },
        calulateSumMonth: function () {
            return BudgetManager().calculateSumYear() / 12;
        },
        calculateSumMonthProvision: function () {
            const sumMonthIncomes = 750 * 1000; // à recuper dans storage , import //todo
            return BudgetManager().calulateSumMonth() - sumMonthIncomes;
        },
        calculateSumYearProvision: function () {
            return BudgetManager().calculateSumMonthProvision() * 12;
        },

    }
}