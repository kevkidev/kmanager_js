
// tests 

function runTests() {
    console.info("Begin tests ...");
    let testCounter = 0;
    let failedCounter = 0;

    const data = [
        {
            "quand": "2025-04-25",
            "quoi": "\"CARTE 24/04/25 CHLOROPHYLLE-CO CB*6819\"",
            "combien": "-25,44"
        },
        {
            "quand": "2025-04-25",
            "quoi": "\"CARTE 23/04/25 DECATHLON STHERB2 CB*6819\"",
            "combien": "-32,36"
        },
        {
            "quand": "2025-04-25",
            "quoi": "\"CARREFOUR CITY NANTES FR\"",
            "combien": "-19,24"
        },
        {
            "quand": "2025-04-25",
            "quoi": "\"LYCEE BRIACE LE LANDREAU FR\"",
            "combien": "-9,80"
        },
        {
            "quand": "2025-04-25",
            "quoi": "\"AMAZON EU SARL PARIS FR\"",
            "combien": "-21,22"
        },
        {
            "quand": "2025-04-24",
            "quoi": "\"CARTE 23/04/25 CARREFOUR CITY CB*6819\"",
            "combien": "-0,31"
        },
        {
            "quand": "2025-04-23",
            "quoi": "\"CARTE 22/04/25 CARREFOUR CITY CB*6819\"",
            "combien": "-4,50"
        },
        {
            "quand": "2025-04-23",
            "quoi": "\"CARTE 22/04/25 CARREFOUR STHERB CB*6819\"",
            "combien": "-45,83"
        },
        {
            "quand": "2025-04-23",
            "quoi": "\"AMAZON EU SARL PARIS FR\"",
            "combien": "-26,21"
        },
        {
            "quand": "2025-04-22",
            "quoi": "\"CARTE 20/04/25 PATHE HOME CB*6819\"",
            "combien": "-2,99"
        },
        {
            "quand": "2025-04-22",
            "quoi": "\"CARTE 18/04/25 CHLOROPHYLLE-CO CB*6819\"",
            "combien": "-22,16"
        },
        {
            "quand": "2025-04-22",
            "quoi": "\"CARTE 21/04/25 Dominos SAINT HER CB*6819\"",
            "combien": "-24,10"
        },
        {
            "quand": "2025-04-22",
            "quoi": "\"CARTE 17/04/25 CARREFOUR CITY CB*6819\"",
            "combien": "-20,37"
        },
        {
            "quand": "2025-04-17",
            "quoi": "\"CARTE 16/04/25 CARREFOUR CITY CB*6819\"",
            "combien": "-15,22"
        },
        {
            "quand": "2025-04-16",
            "quoi": "\"CARTE 15/04/25 CHLOROPHYLLE-CO CB*6819\"",
            "combien": "-20,29"
        },
        {
            "quand": "2025-04-16",
            "quoi": "\"CARTE 13/04/25 AMAZON PAYMENTS 2 CB*6819\"",
            "combien": "-24,74"
        },
        {
            "quand": "2025-04-15",
            "quoi": "\"CARTE 14/04/25 EMMA CB*6819\"",
            "combien": "-4,90"
        },
        {
            "quand": "2025-04-15",
            "quoi": "\"CARTE 14/04/25 CARREFOUR CITY CB*6819\"",
            "combien": "-21,54"
        },
        {
            "quand": "2025-04-15",
            "quoi": "\"PRLV SEPA SFR\"",
            "combien": "-10,99"
        },
        {
            "quand": "2025-04-14",
            "quoi": "\"CARTE 12/04/25 PIZZA COSY CB*6819\"",
            "combien": "-19,80"
        },
        {
            "quand": "2025-04-14",
            "quoi": "\"CARTE 13/04/25 Dominos SAINT HER CB*6819\"",
            "combien": "-12,49"
        },
        {
            "quand": "2025-04-14",
            "quoi": "\"CARTE 11/04/25 CHLOROPHYLLE-CO CB*6819\"",
            "combien": "-40,35"
        },
        {
            "quand": "2025-04-11",
            "quoi": "\"CARTE 09/04/25 AMAZON PAYMENTS 2 CB*6819\"",
            "combien": "-18,90"
        },
        {
            "quand": "2025-04-11",
            "quoi": "\"CARTE 08/04/25 AMAZON EU SARL 2 CB*6819\"",
            "combien": "-18,89"
        },
        {
            "quand": "2025-04-11",
            "quoi": "\"VIR INST START PEOPLE\"",
            "combien": "90,15"
        },
        {
            "quand": "2025-04-11",
            "quoi": "\"PRLV SEPA PayPal Europe S.a.r.l. et Cie\"",
            "combien": "-38,60"
        },
        {
            "quand": "2025-04-10",
            "quoi": "\"CARTE 09/04/25 CARREFOUR STHERB CB*6819\"",
            "combien": "-94,99"
        },
        {
            "quand": "2025-04-10",
            "quoi": "\"CARTE 09/04/25 MP*CARREFOUR DAC CB*6819\"",
            "combien": "-20,02"
        },
        {
            "quand": "2025-04-10",
            "quoi": "\"PRLV SEPA ALTAREA GESTION IMMOBILIERE\"",
            "combien": "-581,17"
        },
        {
            "quand": "2025-04-09",
            "quoi": "\"RETRAIT DAB 08/04/25 ST HERBLAIN CB*6819\"",
            "combien": "-50,00"
        },
        {
            "quand": "2025-04-09",
            "quoi": "\"CARTE 08/04/25 CARREFOUR CITY CB*6819\"",
            "combien": "-20,37"
        },
        {
            "quand": "2025-04-08",
            "quoi": "\"CARTE 07/04/25 CARREFOUR CITY CB*6819\"",
            "combien": "-13,36"
        },
        {
            "quand": "2025-04-08",
            "quoi": "\"PRLV SEPA ACHEEL FRANCE\"",
            "combien": "-7,33"
        },
        {
            "quand": "2025-04-08",
            "quoi": "\"PRLV SEPA GC RE ORNIKAR ASSURANCES\"",
            "combien": "-17,33"
        },
        {
            "quand": "2025-04-08",
            "quoi": "\"PRLV SEPA PayPal Europe S.a.r.l. et Cie\"",
            "combien": "-5,99"
        },
        {
            "quand": "2025-04-07",
            "quoi": "\"CARTE 04/04/25 CHLOROPHYLLE-CO CB*6819\"",
            "combien": "-10,71"
        },
        {
            "quand": "2025-04-07",
            "quoi": "\"CARTE 04/04/25 PIZZA COSY CB*6819\"",
            "combien": "-19,80"
        },
        {
            "quand": "2025-04-07",
            "quoi": "\"CARTE 03/04/25 CHLOROPHYLLE-CO CB*6819\"",
            "combien": "-11,46"
        },
        {
            "quand": "2025-04-07",
            "quoi": "\"PRLV SEPA MAIF 79038 NIORT CEDEX\"",
            "combien": "-18,05"
        },
        {
            "quand": "2025-04-04",
            "quoi": "\"VIR SEPA CAF DE LOIRE ATLANTIQUE\"",
            "combien": "765,42"
        },
        {
            "quand": "2025-04-03",
            "quoi": "\"CARTE 02/04/25 CARREFOUR CITY CB*6819\"",
            "combien": "-16,73"
        },
        {
            "quand": "2025-04-03",
            "quoi": "\"CARTE 02/04/25 PHARM QUANCARD 4 CB*6819\"",
            "combien": "-5,90"
        },
        {
            "quand": "2025-04-03",
            "quoi": "\"PRLV SEPA PayPal Europe S.a.r.l. et Cie\"",
            "combien": "-6,99"
        },
        {
            "quand": "2025-04-02",
            "quoi": "\"CARTE 01/04/25 CHLOROPHYLLE-CO CB*6819\"",
            "combien": "-40,98"
        },
        {
            "quand": "2025-04-02",
            "quoi": "\"CARTE 31/03/25 CARREFOUR CITY CB*6819\"",
            "combien": "-11,60"
        },
        {
            "quand": "2025-04-01",
            "quoi": "\"VIR INST MR KEVIN MARTINEL\"",
            "combien": "500,00"
        },
        {
            "quand": "2025-04-01",
            "quoi": "\"PRLV SEPA EDF clients particuliers\"",
            "combien": "-65,90"
        }
    ];

    const KEYWORDS = [
        "AMAZON",
        "CARREFOUR CITY",
        "MAGASIN U",
        "CARREFOUR",
        "CHLOROPHYLLE",
        "RETRAIT",
        "CARREFOUR DAC",
        "CENTRE LECLERC",
        "BREIL D'ORIENT",
        "PIZZ ALCHIMIE",
        "GOURMAND",
        "MISS TARTINE",
        "FOOD LAB",
        "LA MIE CALINE",
        "MBTE",
        "fabrik",
        "block out",
        "TRIMESTRIELLE",
        "DECOUVERT",
        "PRIXTEL",
        "SFR",
        "BOUYGUE",
        "SPEEDY",
        "BLANCO",
        "PHARM",
        "TALLET",
        "MAIF",
        "ORNIKAR",
        "acheel",
        "ELECTRICITE DE",
        "EDF",
        "ALTAREA",
        "DOMINOS",
        "PAYPAL",
        "LA BEAUJOIRE",
        "U EXPRESS",
        "HANVON",
        "GERSTAECKER",
        "LECLERC",
        "BIO",
        "LEPOUTRE",
        "BOULANGERIE",
        "K0182",
        "CAFE",
        "L ATELIER",
        "PIZZA",
        "MCDO",
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

runTests();