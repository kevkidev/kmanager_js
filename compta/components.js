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

function components_viewHeader() {
    const viewHeader = dom_div({
        clazz: "view_header"
    });
    return viewHeader;
}

function components_viewBody({ viewId, bodyChildren }) {
    const viewBody = dom_div({
        id: viewId,
        clazz: "view_body"
    });
    if (bodyChildren) viewBody.replaceChildren(...bodyChildren);
    return viewBody;
}

function components_dateInfo({ date, text1, text2 }) {
    const text = (date != null) ? `${text1} ${date}.` : text2;
    return dom_span({ text, clazz: "bold" });
}

function components_dateLastImport({ date }) {
    return components_dateInfo({ date, text1: "Dernier import le", text2: "Pas d'importation." });
}

function components_dateLastChange({ date }) {
    return components_dateInfo({ date, text1: "Dernière modification le", text2: "" });
}

function _components_imgImpexCSV({ src, onclick }) {
    return dom_img({
        src,
        clazz: "impex",
        onclick,
    })
}

function components_printPDF({ onclick }) {
    const div = dom_div({ clazz: "impex" });
    div.append(
        _components_imgImpexCSV({
            src: "../img/icons8-export-pdf-64.png",
            onclick,
        })
    );
    return div;
}

function components_groupImpexCSVButtons({ onImport, onExport }) {
    function _importCSVButton({ onclick }) {
        return _components_imgImpexCSV({ src: "../img/icons8-import-csv-64.png", onclick });
    }
    function _exportCSVButton({ onclick }) {
        return _components_imgImpexCSV({ src: "../img/icons8-export-64.png", onclick });
    }
    const group = dom_div({ clazz: "impex" });
    const importBtn = _importCSVButton({ onclick: onImport });
    const exportBtn = _exportCSVButton({ onclick: onExport });
    group.replaceChildren(importBtn, exportBtn);
    return group;
}

function components_view({ viewId, bodyChildren }) {
    const section = dom_create("section");
    section.replaceChildren(
        components_viewHeader(),
        components_viewBody({ viewId, bodyChildren }),
    );
    return section;
}