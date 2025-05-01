function util_getDateString() {
    return (new Date()).toLocaleString();
}

function util_sum(array) {
    const map = array.map(e => parseFloat(e.combien) * 1000);
    if (map.length > 0) {
        const result = map.reduce((a, b) => a + b) / 1000;
        return result;
    }
}

function util_round_100(value) {
    return Math.round(value * 100) / 100;
}