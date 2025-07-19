function CategoryManager() {
    return {
        DEFAULT_CATEGORY: "inconnue",
        DEFAULT_KEYWORD: "inconnu",

        importCSV: function (text) {
            CategoryStorage().update({
                newArray: io_extractCSV({
                    text,
                    buildObjectMethod: function (currentLine) {
                        const categories = {
                            id: currentLine[0],
                            name: currentLine[1],
                            keywords: currentLine[2].split(','),
                        };
                        console.info(categories);
                        return categories;
                    }
                })
            });
            // Dom().hide("view_importCategories");
            console.warn("Catégories importées avec succés!");
            location.reload();
        },

        getKeywords: function (categories) {
            return categories.map(e => e.keywords).reduce((a, b) => a.concat(b));
        },

        get: function () {
            let categories = CategoryStorage().get();
            if (!categories || 0 == categories.length) {
                return [{
                    name: CategoryManager().DEFAULT_CATEGORY,
                    keywords: [CategoryManager().DEFAULT_KEYWORD]
                }];
            }
            return categories;
        },

        calculateSumPerCategory: function (transactions) {
            if (!transactions) return [];
            const maps = [];
            const categories = CategoryManager().get();
            for (let i = 0; i < categories.length; i++) {
                const c = categories[i];
                const list = transactions.filter(e => c.name == e.category).sort((a, b) => a.amount - b.amount);
                c.count = list.length;
                if (CategoryStorage().isEditing() || list.length > 0) {
                    c.sum = Util().sum(list.map(e => e.amount));
                    maps.push({ list, category: c });
                }
            }
            return maps.sort((a, b) => a.category.sum - b.category.sum);
        },

        calculateSumPerKeyword: function (transactions) {
            if (!transactions) return [];
            const maps = [];
            const categories = CategoryManager().get();
            const keywords = CategoryManager().getKeywords(categories);
            keywords.forEach(k => {
                const list = transactions.filter(e => e.keyword == k);
                if (CategoryStorage().isEditing() || list.length > 0) {
                    maps.push({ keyword: k, sum: Util().sum(list) });
                }
            });
            return maps.sort((a, b) => a.sum - b.sum);
        },
    }
}