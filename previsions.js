function AppPrevisions() {

    function importCSV(text) {

        function extractCSV(text) {
            return AppCommon().extractCSV(text, function (currentLine) {
                const previsions = {
                    id: currentLine[0],
                    quoi: currentLine[1],
                    frequence: currentLine[2],
                    combien: currentLine[3],
                };
                return previsions;
            });
        }

        AppStorage().update(ID, extractCSV(text));
        AppStorage().recordImportDate(ID);
    }

    const exportCSV = function () {
        AppCommon().exportCSV("previsions", function () {

            const array = AppStorage().get(AppPrevisions().ID);
            if (!array) {
                AppCommon().popup("Pas de données à exporter!");
                return;
            }

            const rows = [
                ["id", "quoi", "frequence", "combien"]
            ];

            array.forEach(e => {
                rows.push([e.id, e.quoi, e.frequence, e.combien]);
            });

            return rows;
        });
    }


    const ID = "previsions";

    function Controller() {

        const add = function () {
            const quoi = AppCommon().$("prevQuoi").value;
            const frequence = AppCommon().$("prevFrequence").value;
            const combien = AppCommon().$("prevCombien").value;
            const newItem = { id: AppStorage().newId(), quoi, frequence, combien };

            AppStorage().add(AppPrevisions().ID, newItem);
            AppPrevisions().View().display();
        }

        const deleteItem = function (id) {
            const array = AppStorage().get(AppPrevisions().ID);
            const index = array.findIndex(e => e.id == id);
            const confirmation = confirm(`Confirmer suppression de ${array[index].quoi} ?`);
            if (confirmation) {
                array.splice(index, 1);
                AppStorage().update(AppPrevisions().ID, array);
                AppPrevisions().View().display();
            }
        }

        return {
            add,
            delete: deleteItem
        };
    }

    const View = function () {

        const display = function () {

            const data = AppStorage().get(AppPrevisions().ID);

            const trHead = AppCommon().$create("tr");
            const th1 = AppCommon().$create("th");
            const th2 = AppCommon().$create("th");
            const th3 = AppCommon().$create("th");
            const th4 = AppCommon().$create("th");

            th1.innerText = "";
            th2.innerText = "Quoi";
            th3.innerText = "Fréquence";
            th4.innerText = "Combien";

            trHead.replaceChildren(th1, th2, th3, th4);
            AppCommon().$("tablePrevisions").replaceChildren(trHead);

            if (data) {
                data.forEach(e => {
                    const tr = document.createElement("tr");

                    const td0 = document.createElement("td");
                    td0.innerHTML = `<img class="img_row_action" src="img/icons8-remove-50.png" onclick="AppPrevisions().Controller().delete(${e.id})"/>`;
                    tr.append(td0);

                    const td1 = document.createElement("td");
                    td1.innerText = e.quoi;
                    tr.append(td1);

                    const td2 = document.createElement("td");
                    td2.innerHTML = e.frequence;
                    tr.append(td2);

                    const td3 = document.createElement("td");
                    td3.innerText = e.combien;
                    tr.append(td3);

                    AppCommon().$("tablePrevisions").append(tr);
                });
            }

            // generer la derniere ligne du tableau sont forme de formulaire pour l'ajout d'une prévision

            const trForm = AppCommon().$create("tr");

            const td1 = AppCommon().$create("td");
            td1.innerHTML = `<img class="img_row_action" src="img/icons8-add-50.png" onclick="AppPrevisions().Controller().add()"/>`;

            const td2 = AppCommon().$create("td");
            td2.innerHTML = `<input id="prevQuoi" type="text"/>`;

            const td3 = AppCommon().$create("td");
            td3.innerHTML = `<input id="prevFrequence" type="number" />`;

            const td4 = AppCommon().$create("td");
            td4.innerHTML = `<input id="prevCombien" type="number" />`;

            trForm.replaceChildren(td1, td2, td3, td4);
            AppCommon().$("tablePrevisions").append(trForm);
        }

        return { display };
    }

    return {
        Controller, View, importCSV, exportCSV, ID
    }
}