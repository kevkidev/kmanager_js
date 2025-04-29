function AppCategories() {
    const ID = "categories";

    function importCSV(text) {

        const value = AppCommon().extractCSV(text, function (currentLine) {
            const categories = {
                name: currentLine[0],
                keywords: currentLine[1].split(','),
            };
            return categories;
        });

        AppStorage().update(ID, value);
        AppStorage().recordImportDate(ID);
    }

    function exportCSV() {
        AppCommon().exportCSV("categories", function () {

            if (!categories) {
                AppCommon().popup("Pas de données à exporter!");
                return;
            }

            const rows = [
                ["name", "keywords"]
            ];

            categories.forEach(e => {
                rows.push([e.name, e.keywords]); // keywords separés par des virgules
            });

            return rows;
        });
    }

    function getKeywords(categories) {
        return categories.map(e => e.keywords).reduce((a, b) => a.concat(b));
    }

    // display

    function afficherSumParCategory(data) {
        data.forEach(e => {
            if (e.list.length > 0) {
                const h3 = AppCommon().$create("h3");
                h3.innerText = e.category.name;
                const table = AppCommon().$create("table");
                AppCommon().$("vueDetailsCategories").append(h3);
                AppCommon().$("vueDetailsCategories").append(table);
                AppTransactions().afficherTableSimple(e.list, table);
                AppCommon().afficherTrSum(e.category.sum, table, 2);
                // vue resume
                const tr = AppCommon().$create("tr");
                AppCommon().$td(tr, e.category.name)
                AppCommon().$td(tr, e.category.sum)
                AppCommon().$("tableResumeCategorie").append(tr);
            }
        });

        const sum = data.map(e => e.category.sum * 1000).reduce((a, b) => a + b) / 1000;
        AppCommon().afficherTrSum(sum, AppCommon().$("tableResumeCategorie"), 1);
    }

    function afficherSumParKeyword(array) {
        array.forEach(e => {
            const tr = AppCommon().$create("tr");
            AppCommon().$td(tr, e.keyword);
            AppCommon().$td(tr, e.sum);
            AppCommon().$("tableResumeKeywords").append(tr);
        })

        const sum = array.map(e => e.sum * 1000).reduce((a, b) => a + b) / 1000;
        const table = AppCommon().$("tableResumeKeywords");
        AppCommon().afficherTrSum(sum, table, 1);
    }

    function displayLastImportDate() {
        AppCommon().displayLastImportDate(ID);
    }

    return { importCSV, exportCSV, ID, afficherSumParCategory, afficherSumParKeyword, getKeywords, displayLastImportDate }
}