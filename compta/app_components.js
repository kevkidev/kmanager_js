
function app_components_view() {
    const container = dom_get("container");
    const appTitle = dom_h({
        number: 1,
        clazz: "app_title",
        text: "RDMP : Rapport.Dépenses.Mensuelles.Personnelles",
    });
    container.append(appTitle);
    container.append(notice_components_view());
    container.append(dom_create("hr"));
    container.append(synthese_components_view());
    container.append(dom_create("hr"));
    container.append(categories_components_view());
    container.append(dom_create("hr"));
    container.append(categories_components_viewDetails());
    container.append(dom_create("hr"));
    container.append(transactions_components_view());
    container.append(dom_create("hr"));
    container.append(budget_components_view());
}