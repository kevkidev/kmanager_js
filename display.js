function display_lastImportDate(id) {
    const date = storage_getLastImportDate(id);
    dom_get("lastImportDate_" + id).innerText = (date != "null") ? date : "inconnue";
}

function display_trSum(sum, table, colspan, title, highlight) {
    const trSum = dom_tr();
    title = title ? title : "Total";
    const tdTitle = dom_td(trSum, title);
    tdTitle.setAttribute("colspan", colspan);
    tdTitle.setAttribute("class", "total_title");
    dom_td(trSum, `<span class="sum_value">${display_decimal(sum)}</span>`, true, true, highlight);
    table.append(trSum);
    return trSum;
}

// function display_trSub({ value, table, colspan, title }) {
//     const tr = dom_tr();
//     const tdTitle = dom_td(tr, title);
//     tdTitle.setAttribute("colspan", colspan);
//     tdTitle.setAttribute("class", "tr_sub_title");
//     dom_td(tr, `<span class="tr_sub_value">${value}</span>`, true);
//     table.append(tr);
//     return tr;
// }

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

function display_simpleTableHeader(table) {
    const tr = dom_tr();
    dom_th(tr, "Quand");
    dom_th(tr, "Quoi");
    dom_th(tr, "Combien");
    table.replaceChildren(tr);
}

function display_changeDate() {
    dom_get("changeDate").innerText = storage_getChangeDate();
}

function display_messages() {
    const messages = storage_get(storage_ID_MESSAGES);
    if (!messages) return;
    for (let i = 0; i < messages.length; i++) {
        const m = messages[i];
        alert(m);
    }
    storage_remove(storage_ID_MESSAGES);
}

function display_decimal(preciseInt) {
    const res = util_round_100(preciseInt / 1000);
    return res;
}

function display_section_title({ title, parentId, isFirst, isLast }) {
    // creer 
    const h1 = dom_create('h1');
    h1.innerText = title;

    const scrollLeft = dom_img({
        src: "img/icons8-left-48.png",
        clazz: "btn_scroll_h",
    });

    const scrollRight = dom_img({
        src: "img/icons8-right-48.png",
        clazz: "btn_scroll_h",
    });

    // configurer 
    scrollLeft.onclick = function (scrollLeft) {
        actionScrollX(scrollLeft, true);
    }
    scrollRight.onclick = function (scrollRight) {
        actionScrollX(scrollRight);
    }

    // assembler
    const div = dom_get(parentId).parentNode.querySelector("div");
    if (isFirst) {
        div.replaceChildren(h1, scrollRight);
    } else if (isLast) {
        div.replaceChildren(scrollLeft, h1);
    } else {
        div.replaceChildren(scrollLeft, h1, scrollRight);
    }
}

function display_section_titles() {
    display_section_title({ title: "Synthèse", parentId: "viewSynthese" });
    display_section_title({ title: "Notice", parentId: "viewNotice", isFirst: true });
    display_section_title({ title: "Transactions", parentId: "viewTransactions" });
    display_section_title({ title: "Catégories", parentId: "viewCategories" });
    display_section_title({ title: "Détails par catégorie", parentId: "viewDetailsCategories" });
    display_section_title({ title: "Mots-clés", parentId: "viewKeywords" });
    display_section_title({ title: "Budget", parentId: "viewBudget", isLast: true });
}
