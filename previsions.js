function Previsions() {

    const IO = function () {

        function importData(context) {
            const file = context.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function (e) {
                const text = e.target.result;
                Storage().update(extractCSV(text));
                Storage().recordImportDate();
                location.reload();
            };
            reader.readAsText(file);
        }

        function extractCSV(text) {
            const lines = text.split('\n');
            const data = [];
            for (let i = 1; i < lines.length; i++) {
                if (lines[i].trim() === '') continue; // Ignorer les lignes vides
                const currentLine = lines[i].split(';');
                const object = {
                    id: currentLine[0],
                    quoi: currentLine[1],
                    frequence: currentLine[2],
                    combien: currentLine[3],
                };
                data.push(object);
            }
            return data;
        }

        const exportData = function () {
            const array = Previsions().Storage().get();
            if (!array) {
                popup("Pas de donnés à exporter!");
                return;
            }

            const rows = [
                ["id", "quoi", "frequence", "combien"]
            ];

            array.forEach(e => {
                rows.push([e.id, e.quoi, e.frequence, e.combien]);
            });

            const csvContent = "data:text/csv;charset=utf-8,"
                + rows.map(e => e.join(";")).join("\n");

            var link = $create("a");
            link.setAttribute("href", encodeURI(csvContent));
            link.setAttribute("download", `RDMP_previsions_${(new Date()).toLocaleString()}.csv`);
            document.body.appendChild(link);
            link.click();
        }

        return { import: importData, export: exportData }
    }

    const Storage = function () {

        const ID = "previsions";
        const DATE_IMPORT_ID = "date_import_previsions";

        const init = function () {
            if (!get()) {
                update([]);
            }
        }

        function recordImportDate() {
            localStorage.setItem(DATE_IMPORT_ID, (new Date()).toLocaleString());
        }

        const add = function (newItem) {
            const array = get();
            array.push(newItem);
            updadeStorage(this.ID, array);
        }

        const get = function () {
            return getFromStorage(ID); // array
        }

        const update = function (newArray) {
            updadeStorage(ID, newArray);
        }

        return { ID, add, get, update, init, recordImportDate }
    }

    function Controller() {

        const add = function () {
            const quoi = $("prevQuoi").value;
            const frequence = $("prevFrequence").value;
            const combien = $("prevCombien").value;
            const newItem = { id: newId(), quoi, frequence, combien };

            Previsions().Storage().add(newItem);
            Previsions().View().display();
        }

        const deleteItem = function (id) {
            const array = Previsions().Storage().get();
            const index = array.findIndex(e => e.id == id);
            const confirmation = confirm(`Confirmer suppression de ${array[index].quoi} ?`);
            if (confirmation) {
                array.splice(index, 1);
                Previsions().Storage().update(array);
                Previsions().View().display();
            }
        }

        return {
            add,
            delete: deleteItem
        };
    }

    const View = function () {

        const display = function () {

            const data = Previsions().Storage().get();

            const trHead = $create("tr");
            const th1 = $create("th");
            const th2 = $create("th");
            const th3 = $create("th");
            const th4 = $create("th");

            th1.innerText = "";
            th2.innerText = "Quoi";
            th3.innerText = "Fréquence";
            th4.innerText = "Combien";

            trHead.replaceChildren(th1, th2, th3, th4);
            $("tablePrevisions").replaceChildren(trHead);

            if (data) {
                data.forEach(e => {
                    const tr = document.createElement("tr");

                    const td0 = document.createElement("td");
                    td0.innerHTML = `<img class="img_row_action" src="img/icons8-remove-50.png" onclick="Previsions().Controller().delete(${e.id})"/>`;
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

                    $("tablePrevisions").append(tr);
                });
            }

            // generer la derniere ligne du tableau sont forme de formulaire pour l'ajout d'une prévision

            const trForm = $create("tr");

            const td1 = $create("td");
            td1.innerHTML = `<img class="img_row_action" src="img/icons8-add-50.png" onclick="Previsions().Controller().add()"/>`;

            const td2 = $create("td");
            td2.innerHTML = `<input id="prevQuoi" type="text"/>`;

            const td3 = $create("td");
            td3.innerHTML = `<input id="prevFrequence" type="number" />`;

            const td4 = $create("td");
            td4.innerHTML = `<input id="prevCombien" type="number" />`;

            trForm.replaceChildren(td1, td2, td3, td4);
            $("tablePrevisions").append(trForm);
        }

        return { display };
    }

    return {
        IO,
        Storage,
        Controller,
        View
    }
}