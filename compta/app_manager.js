
function app_manager_start() {
    app_components_view();
    storage_cleanSession({
        idsToKeep: [
            categories_manager_getStorageIds().id,
            categories_manager_getStorageIds().idDateImport,
            budget_storage_ID,
            transactions_ID,
            storage_DATE_IMPORT_PREFIX_ID + budget_storage_ID,
            storage_DATE_IMPORT_PREFIX_ID + transactions_ID,
            storage_ID_DATE_CHANGE,
        ]
    });
    app_controller_initImportListener();
    app_manager_reload({});
}

function app_manager_reload({ viewIdToKeepOpen }) {
    const { incomes, expenses } = transactions_build();
    if (expenses || incomes) {
        transactions_display({ incomes, expenses });
        synthese_displaySumMonth({ incomes, expenses });
        categories_viewer_display(expenses);
    }
    app_manager_resetViewsHeaders({ viewIdToKeepOpen })
    synthese_displaySumBudget();
    budget_viewer_display();
    common_display_messages();
}

function app_manager_resetViewsHeaders({ viewIdToKeepOpen, showAll }) {
    const viewsParams = [
        notice_manager_getViewParams(),
        synthese_controller_getViewParams(),
        transactions_manager_getViewParams(),
        categories_controller_getViewParams(),
        categories_controller_getViewDetailsParams(),
        budget_controller_getViewParams(),
    ];

    viewsParams.forEach(viewParams => {
        let display = "none";
        if (showAll || viewIdToKeepOpen && viewParams.id == viewIdToKeepOpen) {
            display = "block";
            viewParams.isOpen = true;
        }
        dom_get(viewParams.id).style.display = display;
        const div = dom_get(viewParams.id).parentNode.querySelector("div");
        const { divTitle, divBtn } = components_sectionHeader(viewParams);
        div.replaceChildren(divTitle, divBtn);
    });
}

function app_manager_getChangeDate() {
    return storage_getChangeDate();
}