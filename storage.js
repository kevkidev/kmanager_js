function AppStorage() {

    function newId() {
        return Date.now();
    }

    function get(id) {
        const found = localStorage.getItem(id);
        return JSON.parse(found);
    }

    function add(id, newItem) {
        let array = get(id);
        if (!array) {
            array = [];
        }
        array.push(newItem);
        update(id, array);
    }

    function update(id, value) {
        localStorage.removeItem(id);
        localStorage.setItem(id, JSON.stringify(value));
    }

    function recordImportDate(id) {
        update("date_import_" + id, AppCommon().getDateString());
    }

    function cleanSession() {
        const keeptIds = [
            AppCategories().ID,
            AppPrevisions().ID,
            AppTransactions().ID,
            `date_import_${AppCategories().ID}`,
            `date_import_${AppPrevisions().ID}`,
            `date_import_${AppTransactions().ID}`,
        ];

        for (let i = 0; i < localStorage.length; i++) {
            const id = localStorage.key(i);
            if (!keeptIds.includes(id)) {
                localStorage.removeItem(id);
            }
        }
    }

    return { newId, get, update, add, recordImportDate, cleanSession }
}