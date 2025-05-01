
function display_lastImportDate(id) {
    const date = storage_getLastImportDate(id);
    dom_get("lastImportDate_" + id).innerText = (date != "null") ? date : "inconnue";
}

function display_trSum(sum, table, colspan, title, surligne) {
    const trSum = dom_tr();
    title = title ? title : "Total";
    const tdTitle = dom_td(trSum, title);
    tdTitle.setAttribute("colspan", colspan);
    tdTitle.setAttribute("class", "total_title");
    surligne = surligne ? "surligne" : "";
    dom_td(trSum, `<span class="sum_value ${surligne}">${sum}</span>`, true);
    table.append(trSum);
}

function display_toggle(event, id) {
    let status = storage_get(id);
    const ON = "on";
    const OFF = "off";

    if (!status || status == OFF) {
        dom_get(id).style.display = 'block';
        storage_update(id, ON);
        status = ON;
    } else if (status == ON) {
        dom_get(id).style.display = 'none';
        storage_update(id, OFF);
        status = OFF;
    }
    event.target.setAttribute("src", "img/icons8-" + status + "-50.png");
}

function display_popup(message) {
    console.warn(message);
    alert(message);
}

function display_simpleTableHeader(table) {
    const tr = dom_tr();
    dom_th(tr, "Quand");
    dom_th(tr, "Quoi");
    dom_th(tr, "Combien");
    table.replaceChildren(tr);
}