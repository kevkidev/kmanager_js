function display$(id, display) {
    const element = document.getElementById(id);
    element.style.display = (display) ? display : "block";
    return element;
}

function $(id) {
    return document.getElementById(id);
}

function fillSelectOptions({ selectId, startIndex, endIndex, selectedValue, displayMethod, marker }) {
    let options = "";
    for (let i = startIndex; i <= endIndex; i++) {
        const selected = i == selectedValue ? "selected" : "";
        let display = (displayMethod) ? displayMethod(i) : i;
        display = (marker && marker.condition(i)) ? marker.value + display : display;
        options += `<option value="${i}" ${selected}>${display}</option>`;
    }
    $(selectId).innerHTML = options;
}

function hideAll() {
    display$("view_week", "none");
    display$("cal", "none");
    display$("event_view", "none");
    display$("view_events", "none");
    display$("event_update_nav", "none");
    display$("event_edit_nav", "none");
}

function showEditView(eventId, action) {
    hideAll();
    display$("event_view");

    let e = (eventId) ? getEvent(eventId) : null;
    let d = (e) ? e.date : null;

    fillSelectOptions({ selectId: "event_hours", startIndex: 0, endIndex: 23, selectedValue: (e ? e.hours : 9), displayMethod: prefixWithZero });
    fillSelectOptions({ selectId: "event_minutes", startIndex: 0, endIndex: 59, selectedValue: (e ? e.minutes : null), displayMethod: prefixWithZero, });
    fillSelectOptions({ selectId: "event_year", startIndex: 1970, endIndex: 2121, selectedValue: (d ? d.year : (new Date(Date.now())).getFullYear()) });
    fillSelectOptions({ selectId: "event_month", startIndex: 1, endIndex: 12, selectedValue: (d ? d.month : (new Date(Date.now())).getMonth() + 1), displayMethod: prefixWithZero });
    fillSelectOptions({ selectId: "event_day", startIndex: 1, endIndex: 31, selectedValue: (d ? d.date : ((new Date(Date.now())).getDate())), displayMethod: prefixWithZero });

    document.getElementById("event_title").value = e ? e.title : null;
    document.getElementById("event_note").value = e ? e.note : null;

    const disabled = (eventId && !action) ? "disabled" : ""; // si id renseigné sans action => readonly
    const fields = ["event_title", "event_day", "event_month", "event_year", "event_hours", "event_minutes", "event_note"];

    if (disabled) {
        fields.forEach(e => $(e).setAttribute("disabled", disabled));
        $("btn_editEventDelete").setAttribute("onclick", `action_eventDelete(${eventId})`);
        $("btn_editEventModify").setAttribute("onclick", `showEditView(${eventId}, "modify")`);
        $("btn_editEventCopy").setAttribute("onclick", `showEditView(${eventId}, "copy")`);
        display$("event_edit_nav");

    } else {
        fields.forEach(e => $(e).removeAttribute("disabled"));
        $("btn_editEventSave").onclick = action_addEvent; // par defaut ses le form d'ajout
        if (action == "copy") $("btn_editEventSave").setAttribute("onclick", `action_eventCopy()`);
        if (action == "modify") $("btn_editEventSave").setAttribute("onclick", `action_confirmEditEvent(${eventId})`);
        display$("event_update_nav");
    }
}

function showWeek() {
    hideAll();
    display$("view_week");
}

/** Set les selects de recherche par date de la vue week */
function setWeekDateSearch(date) {
    fillSelectOptions({ selectId: "search_year", startIndex: 1970, endIndex: 2121, selectedValue: date.year });
    fillSelectOptions({ selectId: "search_month", startIndex: 1, endIndex: 12, selectedValue: date.month, displayMethod: prefixWithZero });
    fillSelectOptions({ selectId: "search_date", startIndex: 1, endIndex: 28, selectedValue: date.date, displayMethod: prefixWithZero });
}

function showCal() {
    hideAll();
    document.getElementById("cal").style.display = "block";
}

function showEvents(search) {
    hideAll();
    display$("view_events");
    display$("events").innerHTML = null; // vider la div

    let events = getEvents();
    if (!events) {
        $("events").innerText = "Aucun event enregistré!";
        return;
    }

    let searchInterval;

    if (search) {// debut recherche par interval de date
        const year1 = $("events_search_startYear").value;
        const year2 = $("events_search_endYear").value;
        const month = $("events_search_month").value;
        const title = $("events_search_title").value;

        // si les années sont inversés on cherche quand meme
        const start = (year1 <= year2) ? year1 : year2;
        const end = (year1 >= year2) ? year1 : year2;

        searchInterval = `${prefixWithZero(month)}/${start} et ${end}`;

        events = events.filter(e => {
            // const r = eventReader(e);
            const ev = mapEvent(e);
            const y = ev.date.year;
            const m = ev.date.month;
            const isDate = (y == start && m >= month) || (y > start && y <= end);
            return isDate && ev.title.toLowerCase().includes(title.trim().toLowerCase());
        });
    } else { // fin recherche
        $("events_search_title").value = null; // champs de recherche par titre
    }

    if (events.length <= 0) {
        $("events").innerHTML = `Pas d'events à cette période!`;
        return;
    }

    // set les intervals avec la premiere et derniere date trouvées
    let first = mapEvent(events[0]);
    const last = mapEvent(events[events.length - 1]);

    fillSelectOptions({ selectId: "events_search_startYear", startIndex: 1970, endIndex: 2121, selectedValue: first.date.year });
    fillSelectOptions({ selectId: "events_search_endYear", startIndex: 1970, endIndex: 2121, selectedValue: last.date.year });
    fillSelectOptions({ selectId: "events_search_month", startIndex: 1, endIndex: 12, displayMethod: prefixWithZero, selectedValue: first.date.month });

    const foundInterval = `${prefixWithZero(first.date.month)}/${first.date.year} et ${last.date.year}`;

    let infos = ``;
    infos += `# Recherche entre ${searchInterval ? searchInterval : "1970 et 2121"}`;
    infos += `\n# ${events.length} events trouvés entre ${foundInterval}`;
    $("events_infos").innerHTML = infos;

    function _htmlHeader(date) {
        let html = ``;
        html += `<div class="form_group">`;
        {
            html += `<span class="">${date.year} ${month_getName(date.month)}</span>`;
            html += `<span class="form_label">${prefixWithZero(date.month)}/${date.year}</span>`;
        }
        html += `</div>`;
        return html;
    }

    function _htmlEvent(ev) {
        let html = `<div class="event" onclick="showEditView(${ev.id})">`;
        {
            html += `<div class="event_date">`;
            {
                html += `<span>${ev.dayName} ${prefixWithZero(ev.date.date)} à ${prefixWithZero(ev.hours)}:${prefixWithZero(ev.minutes)}</span>`;
                html += `<span>${prefixWithZero(ev.date.date)}/${prefixWithZero(ev.date.month)}/${prefixWithZero(ev.date.year)}</span>`;
            }
            html += `</div>`;
            html += `<span class="week_events_title">${ev.title} </span>`;
        }
        html += `</div>`;
        return html;
    }

    let array = [{ header: _htmlHeader(first.date), events: [] }];
    events.forEach(e => {
        const ev = mapEvent(e);
        if (ev.date.year != first.date.year || ev.date.month != first.date.month) { // si le mois change on affiche un nouveau groupe
            array.push({ header: _htmlHeader(ev.date), events: [] });
            first = clone(ev);
        }
        array[array.length - 1].events.push(_htmlEvent(ev));
    })

    // assembler les elements dans la vue
    array.forEach(h => {
        $("events").innerHTML += h.header;
        h.events.forEach(e => {
            $("events").innerHTML += e;
        })
    })
}

function action_addEvent() {
    const event = {
        id: Date.now(),
        title: document.getElementById("event_title").value,
        hours: document.getElementById("event_hours").value,
        minutes: document.getElementById("event_minutes").value,
        note: document.getElementById("event_note").value,
    }
    const day = document.getElementById("event_day").value;
    const month = document.getElementById("event_month").value;
    const year = document.getElementById("event_year").value;

    if (event.title && day && month && year) {
        const cal = cal_buildYear(year);

        const found = cal.dates.find(d => d.date.month == month && d.date.date == day); // vérifier que date existe
        if (!found) {
            alert("Erreur saisie:\nCette date n'existe pas!");
            return;
        }

        const dateEvent = date_new({ day, month, year });
        event.date = dateEvent.object;
        event.date.setHours(event.hours); // inclure l'heure dans l'object pour faciliter le tri par timestamp 
        event.date.setMinutes(event.minutes); // inclure les minutes dans l'object pour faciliter le tri par timestamp
        event.timestamp = dateEvent.object.getTime(); // utile pour le tri des events
        storage_add({ arrayId: storage_ids.EVENTS, newItem: event });

        // afficher la week de l'event
        if (year != CURRENT_YEAR_CAL.year) { // la week dans une autre année
            CURRENT_YEAR_CAL = cal;
        }

        const week = cal_weekFromDate({ cal: CURRENT_YEAR_CAL, date: dateEvent });
        loadWeek({ week });
    }
}

function action_currentWeek() {
    const date = date_newFromDate(new Date(Date.now()));
    CURRENT_YEAR_CAL = cal_buildYear(date.year);
    loadWeek({ week: cal_weekFromDate({ cal: CURRENT_YEAR_CAL, date }) });
}

/** Avance ou recule d'une semaine 
 * @param direction Selon si action next ou prev direction = 1 ou -1 */
function action_switchWeek(direction) {
    const currentYear = CURRENT_YEAR_CAL.year;
    const weekLimits = storage_get({ id: storage_ids.WEEK_LIMITS });
    const dateRef = direction == -1 ? weekLimits.day1.object : weekLimits.day7.object;
    const date = new Date(dateRef);
    date.setDate(date.getDate() + direction);
    const switchDate = date_newFromDate(date);
    if (switchDate.year != currentYear) { // la next/prev week est dans l'année suivante ou precedante
        CURRENT_YEAR_CAL = cal_buildYear(currentYear + direction);
    }
    const switchWeek = cal_weekFromDate({ cal: CURRENT_YEAR_CAL, date: switchDate });
    loadWeek({ week: switchWeek });
}

/** Récupere la premiere semaine du mois recherché. */
function action_search() {
    const month = parseInt(document.getElementById("search_month").value);
    let year = parseInt(document.getElementById("search_year").value);
    let day = parseInt(document.getElementById("search_date").value);
    CURRENT_YEAR_CAL = cal_buildYear(year);
    const week = cal_weekFromDate({ cal: CURRENT_YEAR_CAL, date: date_new({ day, month, year }) });
    loadWeek({ week });
}

function deleteEvent(eventIndex) {
    const events = getEvents();
    // creer un bkp des events en cas de besoin
    storage_update({ id: storage_ids.EVENTS_BKP + Date.now(), value: events });
    events.splice(eventIndex, 1); // retirer l'event de la liste
    storage_update({ id: storage_ids.EVENTS, value: events });
}

function action_eventDelete(eventId) {
    let e = getEvent(eventId);
    if (!e) return;
    let d = e.date;

    let display = "";
    display += `"${e.title}"\n`;
    display += `Date: ${e.dayName} ${prefixWithZero(d.date)} ${e.monthName} (${d.string})\n`;
    display += `Horaire: ${prefixWithZero(e.hours)}:${prefixWithZero(e.minutes)}\n`;
    display += `Note:\n"${e.note}"\n`;
    // il faut confirmer 2 fois pour effectuer la suppression
    if (confirm("Supprimer de l'event ?\n\n" + display)) {
        if (confirm("Confirmer la suppression de l'event.")) {
            const e = getEvent(eventId);
            deleteEvent(e.index);
            // recharger la week
            const week = cal_weekFromDate({ cal: CURRENT_YEAR_CAL, date: e.date });
            loadWeek({ week });
        }
    }
}

function action_confirmEditEvent(eventId) {
    const e = getEvent(eventId);
    if (confirm("Confirmer la modifiaction de l'event ?")) {
        // on ne modifie pas vraiment on va supprimer pour remplacer
        deleteEvent(e.index);
        action_addEvent();
    }
}

function action_eventCopy() {
    action_addEvent();
}
