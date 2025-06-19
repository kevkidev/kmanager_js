
function app_reload({ viewIdToKeepOpen }) {
    const { incomes, expenses } = transactions_build();
    if (expenses || incomes) {
        transactions_display({ incomes, expenses });
        synthese_displaySumMonth({ incomes, expenses });
        categories_viewer_display(expenses);
    }
    controller_resetViewsHeaders({ viewIdToKeepOpen })
    synthese_displaySumBudget();
    budget_viewer_display();
    common_display_changeDate();
    common_display_messages();
}

storage_cleanSession({
    idsToKeep: [
        categories_controller_STORAGE_ID,
        budget_storage_ID,
        transactions_ID,
        storage_DATE_IMPORT_PREFIX_ID + categories_controller_STORAGE_ID,
        storage_DATE_IMPORT_PREFIX_ID + budget_storage_ID,
        storage_DATE_IMPORT_PREFIX_ID + transactions_ID,
        storage_ID_DATE_CHANGE,
    ]
});
app_controller_initImportListener();
app_reload({ viewIdToKeepOpen: undefined });