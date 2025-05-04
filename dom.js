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
    if (isBold) td.style.fontWeight = "bold";
    if (highlight && isHtml) td.setAttribute("class", "highlight");
    if (highlight && typeof value == "number") {
        if (value >= 0) td.setAttribute("class", "highlight");
        if (value < 0) td.setAttribute("class", "highlight_danger");
    }
    tr.append(td);
    return td;
}

function dom_input(id, type) {
    const el = dom_create("input");
    el.setAttribute("id", id);
    el.setAttribute("type", type);
    return el;
}