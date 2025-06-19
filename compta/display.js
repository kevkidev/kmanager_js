const display_STORAGE_VIEWS_ID = "views";
const display_VIEW_STATUS_OPEN = "1";
const display_VIEW_STATUS_CLOSED = "0";

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

function display_decimal(preciseInt) {
    const res = util_round_100(preciseInt / 1000);
    return res;
}

function display_sectionHeader({ title, id: viewId, isOpen, imgSrc }) {

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
        src: `../img/${imgName}.png`,
        clazz: "view_header_toggle_img",
    });
    toggleImg.setAttribute("onclick", `actionToggle(event, '${viewId}')`);

    const goTopImg = dom_img({
        src: `../img/icons8-double-up-64.png`,
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

function display_resetViewHeader({ view, display }) {
    dom_get(view.id).style.display = display;
    display_sectionHeader(view);
}


function display_createEditButton({ controller }) {
    const editBtn = dom_create("button");
    editBtn.innerText = "Mofidier";
    const control = controller();
    editBtn.onclick = control.onclick;
    if (control.isEditing) {
        editBtn.innerText = "Terminer";
    }
    return editBtn;
}