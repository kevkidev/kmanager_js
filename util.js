function util_getDateString() {
    return (new Date()).toLocaleString();
}

function util_sum(array) {
    if (!array || array.length < 0) return 0;
    const map = array.map(e => parseFloat(e.combien) * 1000);
    if (map.length > 0) {
        const result = map.reduce((a, b) => a + b) / 1000;
        return result;
    }
    return 0;
}

function util_round_100(value) {
    return Math.round(value * 100) / 100;
}

function util_initImportListener(id, action) {
    document.getElementById(id).addEventListener('change', action);
}