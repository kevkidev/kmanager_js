const categories_manager_DEFAULT_CATEGORY = "inconnue";
const categories_manager_DEFAULT_KEYWORD = "inconnu";

function categories_manager_getStorageIds() {
    return {
        id: categories_storage_ID,
        idDateImport: storage_DATE_IMPORT_PREFIX_ID + categories_storage_ID
    }
}

function categories_manager_importCSV(text) {
    categories_storage_update({
        newArray: io_extractCSV({
            text,
            buildObjectMethod: function (currentLine) {
                const categories = {
                    id: currentLine[0],
                    name: currentLine[1],
                    keywords: currentLine[2].split(','),
                };
                return categories;
            }
        })
    });
    categories_storage_recordImportDate();
    storage_addMessage({ message: "Catégories importées avec succés!" });
}

function categories_manager_exportCSV() {
    let categories = categories_manager_get();
    io_exportCSV("categories", function () {
        if (!categories) {
            storage_addMessage({ message: "Pas de données à exporter!" });
            return;
        }
        const rows = [["name", "keywords"]];
        categories.forEach(e => {
            rows.push([e.name, e.keywords]); // keywords separés par des virgules
        });
        return rows;
    });
}

function categories_manager_getKeywords(categories) {
    return categories.map(e => e.keywords).reduce((a, b) => a.concat(b));
}

function categories_manager_get() {
    let categories = categories_storage_get();
    if (!categories) {
        storage_addMessage({ message: "Pas de catégories!" });
        categories = [{
            name: categories_manager_DEFAULT_CATEGORY,
            keywords: [categories_manager_DEFAULT_KEYWORD]
        }];
    }
    return categories;
}

function categories_manager_calculateSumPerCategory(transactions) {
    const maps = [];
    const categories = categories_manager_get();

    for (let i = 0; i < categories.length; i++) {
        const c = categories[i];
        const list = transactions.filter(e => c.name == e.category).sort((a, b) => a.combien - b.combien);
        c.count = list.length;
        if (categories_storage_isEditing() || list.length > 0) {
            c.sum = util_sum(list);
            maps.push({ list: list, category: c });
        }
    }
    return maps.sort((a, b) => a.category.sum - b.category.sum);
}

function categories_manager_calculateSumPerKeyword(transactions) {
    const maps = [];
    const categories = categories_manager_get();
    const keywords = categories_manager_getKeywords(categories);
    keywords.forEach(k => {
        const list = transactions.filter(e => e.keyword == k);
        if (categories_storage_isEditing() || list.length > 0) {
            maps.push({ keyword: k, sum: util_sum(list) });
        }
    });
    return maps.sort((a, b) => a.sum - b.sum);
}

