const transactions_ID = "transactions";

function transactions_controller_getViewParams() {
    return {
        title: "Transactions",
        id: "viewTransactions",
        imgSrc: "../img/icons8-activity-history-64.png"
    }
}

function transactions_importCSV(text) {
    storage_update({
        id: transactions_ID,
        value: io_extractCSV({
            text,
            buildObjectMethod: function (currentLine) {
                const transaction = {
                    quand: currentLine[0],
                    quoi: currentLine[2].split('"').join('').toLowerCase(),
                    combien: util_withPrecision(currentLine[6].replace(",", ".")), // x1000 pour plus de precision dans les futurs calculs
                }
                return transaction;
            }
        })
    });
    storage_recordImportDate({ id: transactions_ID });
}

function transactions_exportCSV() {
    io_exportCSV("transactions", function () {
        let transactions = storage_get({ id: transactions_ID });
        if (!transactions) return [];
        const rows = [
            ["quand", null, "quoi", null, null, null, "combien"]
        ];
        transactions.forEach(e => {
            rows.push([e.quand, null, e.quoi, null, null, null, util_intToDecimal(e.combien)]);
        });
        return rows;
    });
}

function transactions_incomes(transactions) {
    return transactions.filter(e => e.combien > 0);
}

function transactions_expences(transactions) {
    return transactions.filter(e => e.combien < 0);
}

function _transactions_associerKeyword(transactions, keywords) {
    return transactions.map(t => {
        t.keyword = categories_manager_DEFAULT_KEYWORD;
        for (let i = 0; i < keywords.length; i++) {
            const k = keywords[i];
            if (k && t.quoi.includes(k)) {
                t.keyword = k;
                return t;
            }
        }
    });
}

function _transactions_associerCategory(transactions, categories) {
    transactions.map(t => {
        for (let i = 0; i < categories.length; i++) {
            const c = categories[i];
            if (c.keywords.includes(t.keyword)) {
                t.category = c.name;
                return t;
            }
        };
    });
}

function transactions_build() {
    let transactions = storage_get({ id: transactions_ID });

    if (!transactions) {
        storage_addMessage({ message: "Veuillez importez des transactions!" });
        return { undefined, undefined };
    }

    let categories = categories_manager_get();
    const keywords = categories_manager_getKeywords(categories);
    _transactions_associerKeyword(transactions, keywords); // !!! 
    _transactions_associerCategory(transactions, categories); // !!!
    const incomes = transactions_incomes(transactions);
    const expenses = transactions_expences(transactions);

    return { incomes, expenses };
}

// display

function transactions_displayTableSimple(array, table) {
    table.replaceChildren();
    array.forEach(e => {
        const tr = dom_tr();
        dom_td(tr, e.quand);
        dom_td(tr, ` <span class="keyword">${e.keyword}</span>&nbsp;&nbsp;&nbsp;${e.quoi}`, true);
        dom_td(tr, util_intToDecimal(e.combien));
        table.append(tr);
    });
}

function transactions_display({ incomes, expenses }) {
    const inTable = dom_get("tableIn");
    transactions_displayTableSimple(incomes, inTable);
    components_trSum(util_sum(incomes), inTable, 2);

    const outTable = dom_get("tableOut");
    transactions_displayTableSimple(expenses, outTable);
    components_trSum(util_sum(expenses), outTable, 2);

    common_display_lastImportDate({
        prefixId: storage_LAST_DATE_IMPORT_PREFIX_ID,
        suffixId: transactions_ID
    });
}
