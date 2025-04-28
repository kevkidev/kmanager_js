function AppCategories() {
    const ID = "categories";

    function importCSV(text) {

        function extractCSV(text) {
            return AppCommon().extractCSV(text, function (currentLine) {
                const categories = {
                    name: currentLine[0],
                    keywords: currentLine[1].split(','),
                };
                return categories;
            })
        }

        AppStorage().update(ID, extractCSV(text));
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

    return { importCSV, exportCSV, ID }
}