function Util() {
    return {
        getDateString() {
            return (new Date()).toLocaleString();
        },

        sum(array) {
            if (array.length > 0) {
                const result = array.reduce((a, b) => a + b);
                return result;
            }
            return 0;
        },

        round100(value) {
            return Math.round(value * 100) / 100;
        },

        withPrecision(decimal) {
            return Util().round100(parseFloat(decimal) * 1000);
        },

        intToDecimal(preciseInt) {
            const res = Util().round100(preciseInt / 1000);
            return res;
        },
    }
}