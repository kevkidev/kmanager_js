
function notice_components_view() {
    const view = components_view({
        viewId: notice_manager_getViewParams().id,
        bodyChildren: [
            dom_h({ number: 2, text: "Quick Start" }),
            dom_p({ text: "Pas d'ordre d'import :" }),
            dom_ul({
                children: [
                    dom_li({ text: "Import CSV de transactions du mois, ficher exporté depuis :" }),
                    dom_ul({
                        children: [
                            dom_li({ text: "la banque" }),
                            dom_li({ text: "cette application" }),
                        ]
                    }),
                    dom_li({ text: "Importer CSV catégories & mots-clés" }),
                    dom_li({ text: "Importer CSV budget" }),
                ]
            }),
            dom_p({ text: "Les fichiers exporté depuis l'app peuvent être reimporté" }),

            dom_h({ number: 2, text: "1. Transactions" }),
            dom_p({ text: "Fichier CSV mensuel exporté depuis la banque (ou depuis un autre rapport)." }),
            dom_p({ text: "Les données du dernier fichier importé sont chargées automatiquement depuis le local storage." }),
            dom_p({ text: "Les colonnes 1, 3 et 7 sont respectivement : quand, quoi et combien." }),
            components_dateLastImport({ date: transactions_manager_getLastImportDate() }),
            dom_inputFile({ id: transactions_controller_getDomIds().INPUT_IMPORT_CSV }),
            components_groupImpexCSVButtons({
                onImport: actionImportTransactions,
                onExport: app_controller_exportCSVTransactions
            }),

            dom_h({ number: 2, text: "2. Catégories & Mots-Clés" }),
            dom_p({ text: "Importer CSV : Catégories et mots-clés associés. Il faut le mettre à jour à chaque nouveau créancier et l'importer. MàJ possible soit :" }),
            dom_ul({
                children: [
                    dom_li({ text: "directement dans l'app" }),
                    dom_li({ text: "Soit editer le fichier CSV et importer" }),
                ]
            }),
            dom_create("br"),
            dom_inputFile({ id: categories_controller_getDomIds().INPUT_IMPORT_CSV }), // todo mettre dans cate viwer
            components_dateLastImport({ date: categories_manager_getLastImportDate() }),
            components_groupImpexCSVButtons({
                onImport: actionImportCategories,
                onExport: app_controller_exportCSVCategories
            }),

            dom_h({ number: 2, text: "3. Budget" }),
            dom_inputFile({ id: budget_controller_getDomIds().INPUT_IMPORT_CSV }), // todo mettre dans cate viwer
            components_dateLastImport({ date: budget_manager_getLastImportDate() }),
            components_groupImpexCSVButtons({
                onImport: actionImportBudget,
                onExport: app_controller_exportCSVBudget
            }),

            dom_h({ number: 2, text: "5. Sauvegarde" }),
            dom_p({ text: `Imprimer en PDF. Pour garder tous le CSS : Cocher "Plus de paramètres" > "Graphiques d'arrière plan".` }),
            components_printPDF({
                onclick: app_controller_print,
            }),
            dom_p({ html: components_dateLastChange({ date: app_manager_getChangeDate() }).outerHTML, }),
        ],
    });
    return view;
}