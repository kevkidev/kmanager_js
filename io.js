
function io_importCSV(context, handle) {
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

function io_exportCSV(fileName, callback) {
    const rows = callback();
    if (!rows) {
        display_popup("Rien a exporter!");
        return;
    }
    const csvContent = "data:text/csv;charset=utf-8,"
        + rows.map(e => e.join(";")).join("\n");

    const link = dom_create("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `RDMP_${fileName}_${(new Date()).toLocaleString()}.csv`);
    document.body.appendChild(link);
    link.click();
}

function io_extractCSV(text, buildObject) {
    const lines = text.split('\n');
    const data = [];
    for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim() === '') continue; // Ignorer les lignes vides
        const currentLine = lines[i].split(';');
        data.push(buildObject(currentLine));
    }
    return data;
}