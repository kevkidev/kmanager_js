
// tests 

function runTests() {
    console.info("Begin tests ...");
    let testCounter = 0;
    let failedCounter = 0;

    const data = [

    ];

    const KEYWORDS = [

    ]

    function check(name, result) {
        if (result) {
            console.info(name + " : " + result);
        } else {
            console.warn(name + " : " + result);
            failedCounter++;
        }
    }

    function tester_associerKeyword() {
        check(tester_associerKeyword.name, false);
        testCounter++;
    }
    tester_associerKeyword();

    console.info("Total : " + failedCounter + "/" + testCounter + " tests failed.\n\n");
    console.info("End tests.");


}

// runTests();


/*
Cahier de tests :
- je dois pouvoir importer un fichier csv independement des autres : budget, transactions, categories
- je dois pouvoir exporter tous les csv en meme temps
- je dois pouvoir exporter chaque csv un par un
- si pas de transaction un message s'affiche
- import des autres csv possible meme si pas de transactions importé
- apres import transaction ou categories => recharger tout mais sans recharger la page + date import à jour
- apres import de budget => regarder seuelemnt budget, date import à jour
- apres ajout, delete budjet => rechager seulement budget + date update
- toggle fonction sur tout saug sauvegarde 
- btn caapture ouvre la vue imprimer en pdf
- exporter trans possible + nom fichier avec date export
- exporte categories possible+ nom fichier avec date export
- exporter budget possible+ nom fichier avec date export
- ajouter, delete categorie possible + date modification
- ajouter, delete keyword possible + date modification
- associer keyword a categorie possible + date modification
- les vues sont toutes affiché correctement
*/