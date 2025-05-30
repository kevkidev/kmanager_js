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
    el.setAttribute("id", id);
    el.setAttribute("type", type);
    if (placeholder) el.setAttribute("placeholder", placeholder);
    return el;
}

function dom_img({ src, id, clazz }) {
    const img = dom_create("img");
    img.setAttribute("src", src);
    if (id) img.setAttribute("id", id);
    if (clazz) img.setAttribute("class", clazz);
    return img;
}