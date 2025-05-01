function AppCommon() {

    function popup(message) {
        console.warn(message);
        alert(message);
    }

    function $(id) {
        return document.getElementById(id);
    }

    function $create(type) {
        return document.createElement(type);
    }

    function importCSV(context, handle) {
        const file = context.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function (e) {
            const text = e.target.result;
            handle(text);
            location.reload();
        };
        reader.readAsText(file);
    }

    function exportCSV(fileName, callback) {
        const rows = callback();
        if (!rows) {
            AppCommon().popup("Rien a exporter!");
            return;
        }
        const csvContent = "data:text/csv;charset=utf-8,"
            + rows.map(e => e.join(";")).join("\n");

        const link = AppCommon().$create("a");
        link.setAttribute("href", encodeURI(csvContent));
        link.setAttribute("download", `RDMP_${fileName}_${(new Date()).toLocaleString()}.csv`);
        document.body.appendChild(link);
        link.click();
    }

    function extractCSV(text, buildObject) {
        const lines = text.split('\n');
        const data = [];
        for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim() === '') continue; // Ignorer les lignes vides
            const currentLine = lines[i].split(';');
            data.push(buildObject(currentLine));
        }
        return data;
    }

    function getDateString() {
        return (new Date()).toLocaleString();
    }

    function sum(array) {
        const map = array.map(e => parseFloat(e.combien) * 1000);
        if (map.length > 0) {
            const result = map.reduce((a, b) => a + b) / 1000;
            return result;
        }
    }

    function $td(tr, value, isHtml) {
        const td = document.createElement("td");
        if (isHtml) {
            td.innerHTML = value;
        } else {
            td.innerText = value;
        }
        tr.append(td);
        return td;
    }

    function getLastImportDate(id) {
        return AppStorage().get("date_import_" + id);
    }

    function updateLastChangeDate() {
        return localStorage.setItem("date_modiditaction", getDateString());
    }

    // display

    function displayLastImportDate(id) {
        const date = getLastImportDate(id);
        AppCommon().$("lastImportDate_" + id).innerText = (date != "null") ? date : "inconnue";
    }

    function afficherTrSum(sum, table, colspan) {
        const trSum = AppCommon().$create("tr");

        const tdTitle = $td(trSum, "Total");
        tdTitle.setAttribute("colspan", colspan);
        tdTitle.setAttribute("class", "total_title");

        $td(trSum, `<span class="sum_value">${sum}</span>`, true);

        table.append(trSum);
    }

    function toggle(event, id) {
        let status = AppStorage().get(id);
        const ON = "on";
        const OFF = "off";

        if (!status || status == OFF) {
            AppCommon().$(id).style.display = 'block';
            AppStorage().update(id, ON);
            status = ON;
        } else if (status == ON) {
            AppCommon().$(id).style.display = 'none';
            AppStorage().update(id, OFF);
            status = OFF;
        }
        event.target.setAttribute("src", "img/icons8-" + status + "-50.png");
    }

    return {
        popup, $, $create, importCSV, exportCSV, extractCSV,
        getDateString, sum, $td, afficherTrSum, toggle, displayLastImportDate, updateLastChangeDate
    }
}