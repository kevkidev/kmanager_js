function components_editButton({ onclick, isEditing }) {
    const editBtn = dom_create("button");
    if (isEditing) {
        editBtn.innerText = "Terminer";
    } else {
        editBtn.innerText = "Modifier";
    }
    editBtn.onclick = onclick;
    return editBtn;
}

function components_trSum(sum, table, colspan, title, highlight) {
    const trSum = dom_tr();
    title = title ? title : "Total";
    const tdTitle = dom_td(trSum, title);
    tdTitle.setAttribute("colspan", colspan);
    tdTitle.setAttribute("class", "total_title");
    dom_td(trSum, `<span class="sum_value">${util_intToDecimal(sum)}</span>`, true, true, highlight);
    table.append(trSum);
    return trSum;
}

function components_sectionHeader({ title, id: viewIdToKeepOpen, isOpen, imgSrc }) {
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
        onclickAttribute: `${app_controller_toggleHeader.name}(event, '${viewIdToKeepOpen}')`
    });

    const goTopImg = dom_img({
        src: `../img/icons8-double-up-64.png`,
        clazz: "view_header_toggle_img",
        onclick: function () {
            window.scrollTo(window.pageXOffset, 0);
        }
    });

    const divBtn = dom_create("div");
    divBtn.append(toggleImg, goTopImg);

    return { divTitle, divBtn }
}
