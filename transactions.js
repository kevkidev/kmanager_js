function AppTransactions() {
    const ID = "transactions";

    function importCSV(text) {

        const value = AppCommon().extractCSV(text, function (currentLine) {
            const transaction = {
                quand: currentLine[0],
                quoi: currentLine[2].split('"').join('').toLowerCase(),
                combien: currentLine[6].replace(",", ".")
            }
            return transaction;
        });

        AppStorage().update(ID, value);
        AppStorage().recordImportDate(ID);
    }

    function getIncomes(transactions) {
        return transactions.filter(e => parseFloat(e.combien) > 0);
    }

    function getDepenses(transactions) {
        return transactions.filter(e => parseFloat(e.combien) < 0);
    }

    function associerKeyword(transactions, keywords) {
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

    function associerCategory(data, categories) {
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

    function sumParCategory(transactions, categories) {
        const maps = [];
        for (let i = 0; i < categories.length; i++) {
            const c = categories[i];
            const list = transactions.filter(e => c.name == e.category).sort((a, b) => a.combien - b.combien);
            c.count = list.length;
            if (list.length > 0) {
                c.sum = AppCommon().sum(list);
                maps.push({ list: list, category: c });
            }
        }
        return maps.sort((a, b) => a.category.sum - b.category.sum);
    }

    function sumParKeyword(transactions, keywords) {
        const maps = [];
        keywords.forEach(k => {
            const list = transactions.filter(e => e.keyword == k);
            if (list.length > 0) {
                maps.push({ keyword: k, sum: AppCommon().sum(list) });
            }
        });
        return maps.sort((a, b) => a.sum - b.sum);
    }

    // display

    function afficherTableSimple(array, parent) {
        array.forEach(e => {
            const tr = document.createElement("tr");

            AppCommon().$td(tr, e.quand);
            AppCommon().$td(tr, ` <span class="keyword">${e.keyword}</span>&nbsp;&nbsp;&nbsp;${e.quoi}`, true);
            AppCommon().$td(tr, e.combien);
            parent.append(tr);
        });
    }

    function displayLastImportDate() {
        AppCommon().displayLastImportDate(ID);
    }

    return {
        ID, importCSV, getIncomes, getDepenses, associerKeyword,
        associerCategory, sumParKeyword, sumParCategory,
        afficherTableSimple, displayLastImportDate
    }
}