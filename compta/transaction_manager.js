function TransactionManager() {
    return {
        importCSV: function ({ text }) {
            let lines = "";
            const transactions = io_extractCSV({
                text,
                buildObjectMethod: function (currentLine) {
                    const transaction = {
                        date: currentLine[0],
                        subject: currentLine[2].split('"').join('').toLowerCase(),
                        amount: Util().withPrecision(currentLine[6].replace(",", ".")), // x1000 pour plus de precision dans les futurs calculs
                    }
                    console.info(transaction);
                    return transaction;
                }
            });

            TransactionStorage().update({
                id: TransactionStorage().keys.ALL,
                array: transactions,
            })
            console.warn("Transactions importées avec succés!");
            location.reload();

        },

        build: function () {
            let transactions = TransactionStorage().get();

            if (!transactions) {
                return {};
            }

            const categories = CategoryManager().get();
            const keywords = CategoryManager().getKeywords(categories);

            // associer le mot cle à chauqe transaction

            transactions.map(t => {
                t.keyword = CategoryManager().DEFAULT_KEYWORD;
                for (let i = 0; i < keywords.length; i++) {
                    const k = keywords[i];
                    if (k && t.subject.includes(k)) {
                        t.keyword = k;
                        return t;
                    }
                }
            });

            // associer la categorie à chauqe transaction
            transactions.map(t => {
                for (let i = 0; i < categories.length; i++) {
                    const c = categories[i];
                    if (c.keywords.includes(t.keyword)) {
                        t.category = c.name;
                        return t;
                    }
                };
            });

            const incomes = transactions.filter(e => e.amount > 0);
            const expenses = transactions.filter(e => e.amount < 0);

            return { incomes, expenses };
        },
    }
}