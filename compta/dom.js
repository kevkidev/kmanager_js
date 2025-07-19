function Dom() {
    return {
        script: function ({ src, onload }) {
            const script = document.createElement("script");
            script.setAttribute("src", src);
            script.type = 'text/javascript';
            script.onload = onload;
            return script;
        },
        get: function ({ id }) {
            return document.getElementById(id);
        },
        show: function (id) {
            const e = Dom().get({ id });
            e.style.display = "block";
            return e;
        },
    }
}
















