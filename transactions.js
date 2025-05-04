const transactions_ID = "transactions";

function transactions_importCSV(text) {
    const value = io_extractCSV(text, function (currentLine) {
        const transaction = {
            quand: currentLine[0],
            quoi: currentLine[2].split('"').join('').toLowerCase(),
            combien: currentLine[6].replace(",", ".")
        }
        return transaction;
    });
    storage_update(transactions_ID, value);
    storage_recordImportDate(transactions_ID);
}

function transactions_incomes(transactions) {
    return transactions.filter(e => parseFloat(e.combien) > 0);
}

function transactions_expences(transactions) {
    return transactions.filter(e => parseFloat(e.combien) < 0);
}

function _transactions_associerKeyword(transactions, keywords) {
    return transactions.map(e => {
        e.keyword = "inconnu";
        for (let i = 0; i < keywords.length; i++) {
            const k = keywords[i];
            if (k && e.quoi.includes(k)) {
                e.keyword = k;
                return e;
            }
        }
    });
}

function _transactions_associerCategory(data, categories) {
    data.map(e => {
        for (let i = 0; i < categories.length; i++) {
            const c = categories[i];
            if (c.keywords.includes(e.keyword)) {
                e.category = c.name;
                return e;
            }
        };
    });
}

function transactions_build() {
    let transactions = storage_get(transactions_ID);

    if (!transactions) {
        display_popup("Veuillez importez des transactions!");
        return { undefined, undefined };
    }

    let categories = storage_get(categories_ID);
    if (!categories) {
        display_popup("Info : Le rapport a été généré mais vous n'avez pas importer de categories!");
        categories = [{
            name: "inconnue",
            keywords: ["inconnu"]
        }];
    }
    const keywords = categories_getKeywords(categories);
    _transactions_associerKeyword(transactions, keywords); // !!! 
    _transactions_associerCategory(transactions, categories); // !!!
    const incomes = transactions_incomes(transactions);
    const expenses = transactions_expences(transactions);

    return { incomes, expenses };
}

// display

function transactions_displayTableSimple(array, table) {
    display_simpleTableHeader(table);
    array.forEach(e => {
        const tr = dom_tr();
        dom_td(tr, e.quand);
        dom_td(tr, ` <span class="keyword">${e.keyword}</span>&nbsp;&nbsp;&nbsp;${e.quoi}`, true);
        dom_td(tr, e.combien);
        table.append(tr);
    });
}

function transactions_display({ incomes, expenses }) {
    const inTable = dom_get("tableIn");
    transactions_displayTableSimple(incomes, inTable);
    display_trSum(util_sum(incomes), inTable, 2);

    const outTable = dom_get("tableOut");
    transactions_displayTableSimple(expenses, outTable);
    display_trSum(util_sum(expenses), outTable, 2);

    display_lastImportDate(transactions_ID);
}
