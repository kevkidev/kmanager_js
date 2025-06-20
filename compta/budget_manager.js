// # budget manager
function budget_manager_getSubject() {
    return budget_storage_ID;
}

function budget_manager_importCSV(text) {
    function extractCSV(text) {
        return io_extractCSV(text, function (currentLine) {
            const budget = {
                id: currentLine[0],
                quoi: currentLine[1],
                frequence: currentLine[2],
                combien: util_withPrecision(currentLine[3]),
            };
            return budget;
        });
    }
    budget_storage_update({ value: extractCSV(text) });
    budget_storage_recordImportDate();
    storage_addMessage({ message: "Budget importé avec succès!" });
}

function budget_manager_exportCSV() {
    io_exportCSV("budget", function () {
        const array = budget_storage_get();
        if (!array) {
            storage_addMessage({ message: "Pas de données à exporter!" });
            return;
        }
        const rows = [
            ["id", "quoi", "frequence", "combien"]
        ];
        array.forEach(e => {
            rows.push([e.id, e.quoi, e.frequence, util_intToDecimal(e.combien)]);
        });

        return rows;
    });
}

function budget_manager_calculateSumYear() {
    const entier = budget_manager_calculateSumPerFrequence(1) * 12 +
        budget_manager_calculateSumPerFrequence(3) * 4 +
        budget_manager_calculateSumPerFrequence(12);
    return entier;
}

function budget_manager_calculateSumPerFrequence(frequence) {
    const array = budget_storage_get();
    if (!array || array.length == 0) return 0;
    const filtered = array.filter(e => e.frequence == frequence);
    if (filtered.length == 0) return 0;
    const sum = util_sum(filtered);
    return sum;
}

function budget_manager_calulateSumMonth() {
    return budget_manager_calculateSumYear() / 12;
}

function budget_manager_calculateSumMonthProvision() {
    const sumMonthIncomes = 750 * 1000; // à recuper dans storage , import //todo
    return budget_manager_calulateSumMonth() - sumMonthIncomes;
}

function budget_manager_calculateSumYearProvision() {
    return budget_manager_calculateSumMonthProvision() * 12;
}