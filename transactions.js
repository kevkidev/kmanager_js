const transanctions_ID = "transactions";

function transanctions_importCSV(text) {

    const value = io_extractCSV(text, function (currentLine) {
        const transaction = {
            quand: currentLine[0],
            quoi: currentLine[2].split('"').join('').toLowerCase(),
            combien: currentLine[6].replace(",", ".")
        }
        return transaction;
    });

    storage_update(transanctions_ID, value);
    storage_recordImportDate(transanctions_ID);
}

function transanctions_incomes(transactions) {
    return transactions.filter(e => parseFloat(e.combien) > 0);
}

function transanctions_expences(transactions) {
    return transactions.filter(e => parseFloat(e.combien) < 0);
}

function transanctions_associerKeyword(transactions, keywords) {
    return transactions.forEach(e => {
        e.keyword = "inconnu";
        for (let i = 0; i < keywords.length; i++) {
            const k = keywords[i];
            if (k && e.quoi.includes(k)) {
                e.keyword = k;
                break;
            }
        }
    });
}

function transanctions_associerCategory(data, categories) {
    data.forEach(e => {
        for (let i = 0; i < categories.length; i++) {
            const c = categories[i];
            if (c.keywords.includes(e.keyword)) {
                e.category = c.name;
                break;
            }
        };
    });
}

function transanctions_sumParCategory(transactions, categories) {
    const maps = [];
    for (let i = 0; i < categories.length; i++) {
        const c = categories[i];
        const list = transactions.filter(e => c.name == e.category).sort((a, b) => a.combien - b.combien);
        c.count = list.length;
        if (list.length > 0) {
            c.sum = util_sum(list);
            maps.push({ list: list, category: c });
        }
    }
    return maps.sort((a, b) => a.category.sum - b.category.sum);
}

function transanctions_sumParKeyword(transactions, keywords) {
    const maps = [];
    keywords.forEach(k => {
        const list = transactions.filter(e => e.keyword == k);
        if (list.length > 0) {
            maps.push({ keyword: k, sum: util_sum(list) });
        }
    });
    return maps.sort((a, b) => a.sum - b.sum);
}

// display

function transanctions_displayTableSimple(array, table) {
    display_simpleTableHeader(table);
    array.forEach(e => {
        const tr = dom_tr();
        dom_td(tr, e.quand);
        dom_td(tr, ` <span class="keyword">${e.keyword}</span>&nbsp;&nbsp;&nbsp;${e.quoi}`, true);
        dom_td(tr, e.combien);
        table.append(tr);
    });
}

function transanctions_displayLastImportDate() {
    display_lastImportDate(transanctions_ID);
}

