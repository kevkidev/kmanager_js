
function io_importCSV({ context, onload }) {
    const file = context.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
        const text = e.target.result;
        onload({ text });
    };
    reader.readAsText(file);
}

function io_extractCSV({ text, buildObjectMethod }) {
    const lines = text.split('\n');
    const array = [];
    for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim() === '') continue; // Ignorer les lignes vides
        const currentLine = lines[i].split(';');
        array.push(buildObjectMethod(currentLine));
    }
    return array;
}