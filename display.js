const display_STORAGE_VIEWS_ID = "views";
const display_VIEW_STATUS_OPEN = "1";
const display_VIEW_STATUS_CLOSED = "0";

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

function display_sectionHeader({ title, viewId, isFirst, isLast, isOpen, imgSrc }) {

    const divTitle = dom_create("div");
    divTitle.setAttribute("class", "view_header_title")

    if (imgSrc) {
        const img = dom_img({ src: imgSrc, clazz: "view_header_title_img" });
        divTitle.append(img);
    }

    const h1 = dom_create('h1');
    h1.innerText = title;
    divTitle.append(h1);

    const imgName = isOpen ? "expand" : "collapse";
    const toggleImg = dom_img({
        src: `img/${imgName}.png`,
        clazz: "view_header_toggle_img",
    });
    toggleImg.setAttribute("onclick", `actionToggle(event, '${viewId}')`);

    const goTopImg = dom_img({
        src: `img/icons8-double-up-64.png`,
        clazz: "view_header_toggle_img",
    });
    goTopImg.onclick = function () {
        window.scrollTo(window.pageXOffset, 0);
    }

    const divBtn = dom_create("div");
    divBtn.append(toggleImg, goTopImg);

    const div = dom_get(viewId).parentNode.querySelector("div");
    div.replaceChildren(divTitle, divBtn);
}

function display_resetViewsHeaders({ openViewId, showAll }) {
    const views = [
        { title: "Notice", viewId: "viewNotice", isFirst: true, imgSrc: "img/icons8-user-manual-64.png" },
        { title: "Synthèse", viewId: "viewSynthese", imgSrc: "img/icons8-improvement-64.png" },
        { title: "Transactions", viewId: "viewTransactions", imgSrc: "img/icons8-activity-history-64.png" },
        { title: "Catégories", viewId: "viewCategories", imgSrc: "img/icons8-folder-tree-64.png" },
        { title: "Détails par catégorie", viewId: "viewDetailsCategories", imgSrc: "img/icons8-tree-structure-64.png" },
        { title: "Budget", viewId: "viewBudget", isLast: true, imgSrc: "img/icons8-stocks-growth-64.png" },
    ];

    views.forEach(e => {
        let display = "none";
        if (showAll || openViewId && e.viewId == openViewId) {
            display = "block";
            e.isOpen = true;
        }
        dom_get(e.viewId).style.display = display;
        display_sectionHeader(e);
    });
}

function display_toggle(event, viewId) {
    event.target.getAttribute("src").includes("expand") ?
        display_resetViewsHeaders({}) : display_resetViewsHeaders({ openViewId: viewId });
}

function display_createEditButton(storageEditingId, viewId) {
    const editBtn = dom_create("button");
    const isEditing = storage_get(storageEditingId) === true;

    editBtn.onclick = function () {
        storage_update(storageEditingId, !isEditing);
        load(viewId);
    }

    editBtn.innerText = "Mofidier";
    if (isEditing) {
        editBtn.innerText = "Terminer";
    }
    return editBtn;
}