function AppStorage() {

    function newId() {
        return Date.now();
    }

    function get(id) {
        return JSON.parse(localStorage.getItem(id));
    }

    function add(id, newItem) {
        const array = get(id);
        array.push(newItem);
        update(id, array);
    }

    function update(id, value) {
        localStorage.removeItem(id);
        localStorage.setItem(id, JSON.stringify(value));
    }

    function recordImportDate(id) {
        localStorage.setItem("date_import_" + id, AppCommon().getDateString());
    }

    function clearSession() {
        const keeptIds = [
            AppCategories().ID,
            AppPrevisions().ID,
            "transactions",
            `date_import_${AppCategories().ID}`,
            `date_import_${AppPrevisions().ID}`,
            `date_import_transactions`,
        ];

        for (let i = 0; i < localStorage.length; i++) {
            const id = localStorage.key(i);
            if (!keeptIds.includes(id)) {
                localStorage.removeItem(id);
            }
        }
    }

    return { newId, get, update, add, recordImportDate, clearSession }
}