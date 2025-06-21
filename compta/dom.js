function dom_get(id) {
    return document.getElementById(id);
}

function dom_create(type) {
    return document.createElement(type);
}

function dom_tr() {
    return dom_create("tr");
}

function dom_th(tr, value) {
    const th = dom_create("th");
    th.innerText = value;
    tr.append(th);
    return th;
}

function dom_td(tr, value, isHtml, isBold, highlight) {
    const td = dom_create("td");
    if (isHtml) {
        td.innerHTML = value;
    } else {
        td.innerText = value;
    }
    if (isBold) td.setAttribute("class", "bold");
    const clazz = td.getAttribute("class");
    if (highlight && isHtml) td.setAttribute("class", clazz + " highlight");
    if (highlight && typeof value == "number") {
        if (value >= 0) td.setAttribute("class", clazz + " highlight");
        if (value < 0) td.setAttribute("class", clazz + " highlight_danger");
    }
    tr.append(td);
    return td;
}

function dom_input(id, type, placeholder) {
    const el = dom_create("input");
    if (id) el.setAttribute("id", id);
    if (type) el.setAttribute("type", type);
    if (placeholder) el.setAttribute("placeholder", placeholder);
    return el;
}

function dom_inputFile({ id }) {
    const input = dom_input(id, "file", null);
    input.setAttribute("hidden", true);
    input.setAttribute("accept", ".csv");
    return input;
}

function dom_img({ src, id, clazz, onclick, onclickAttribute }) {
    const img = dom_create("img");
    img.setAttribute("src", src);
    if (id) img.setAttribute("id", id);
    if (clazz) img.setAttribute("class", clazz);
    if (onclickAttribute) img.setAttribute("onclick", onclickAttribute);
    if (onclick) img.onclick = onclick;
    return img;
}

function dom_img_row(action) {
    return dom_img({
        src: `../img/icons8-${action}-50.png`,
        clazz: "img_row_action",
    });
}

function dom_img_row_delete() {
    return dom_img_row("remove");
}

function dom_img_row_add() {
    return dom_img_row("add");
}

function dom_button_row({ stringCallback, img }) {
    const btn = dom_create("button");
    btn.setAttribute("class", "td_button");
    btn.setAttribute("onclick", stringCallback);
    btn.append(img);
    return btn;
}

function dom_h({ number, clazz, text }) {
    const h = dom_create("h" + number);
    if (clazz) h.setAttribute("class", clazz);
    if (text) h.innerText = text;
    return h;
}

function dom_div({ clazz, id }) {
    const div = dom_create("div");
    if (clazz) div.setAttribute("class", clazz);
    if (id) div.setAttribute("id", id);
    return div;
}

function dom_p({ clazz, id, text, html }) {
    const p = dom_create("p");
    if (clazz) p.setAttribute("class", clazz);
    if (id) p.setAttribute("id", id);
    if (text) p.innerText = text;
    if (html) p.innerHTML = html;
    return p;
}

function dom_ul({ children }) {
    const ul = dom_create("ul");
    if (children) children.forEach(ch => {
        ul.append(ch);
    });
    return ul;
}

function dom_li({ text }) {
    const li = dom_create("li");
    if (text) li.innerText = text;
    return li;
}

function dom_text({ text }) {
    return document.createTextNode(text);
}

function dom_span({ id, text, clazz }) {
    const span = dom_create("span");
    if (id) span.setAttribute("id", id);
    if (clazz) span.setAttribute("class", clazz);
    if (text) span.innerText = text;
    return span;
}

function dom_table({ id }) {
    const table = dom_create("table");
    if (id) table.setAttribute("id", id);
    return table;
}