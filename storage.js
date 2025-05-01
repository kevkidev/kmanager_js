function AppStorage() {

    function newId() {
        return Date.now();
    }

    function get(id) {
        const found = localStorage.getItem(id);
        return JSON.parse(found);
    }

    function add(arrayId, newItem) {
        let array = get(arrayId);
        if (!array) {
            array = [];
        }
        array.push(newItem);
        update(arrayId, array);
    }

    function update(id, value) {
        localStorage.removeItem(id);
        localStorage.setItem(id, JSON.stringify(value));
        AppCommon().updateLastChangeDate();
    }

    function recordImportDate(id) {
        update("date_import_" + id, AppCommon().getDateString());
    }

    function cleanSession() {
        const idsToKeep = [
            AppCategories().ID,
            AppPrevisions().ID,
            AppTransactions().ID,
            `date_import_${AppCategories().ID}`,
            `date_import_${AppPrevisions().ID}`,
            `date_import_${AppTransactions().ID}`,
        ];

        for (let i = 0; i < localStorage.length; i++) {
            const id = localStorage.key(i);
            if (!idsToKeep.includes(id)) {
                localStorage.removeItem(id);
            }
        }
    }

    return { newId, get, update, add, recordImportDate, cleanSession }
}