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
        if (marker) {
            display = (marker.condition(i)) ? marker.value + "" + display : display;
        }
        options += `<option value="${i}" ${selected}>${display}</option>`
    }

    $(selectId).innerHTML = options;
}

function resetAll() {
    document.getElementById("planning").style.display = "none";
    document.getElementById("cal").style.display = "none";
    document.getElementById("form_add_event").style.display = "none";
    document.getElementById("btn_editEvent1").style.display = "none";
    document.getElementById("btn_editEvent0").style.display = "none";
    document.getElementById("btn_copyEvent").style.display = "none";
    display$("view_events", "none");
}

function showFormAddEvent({ editingEvent, edate }) {
    const e = editingEvent;
    const d = edate;
    fillSelectOptions({ selectId: "event_hours", startIndex: 0, endIndex: 23, selectedValue: (e ? e.hours : 10), displayMethod: prefixWithZero });
    fillSelectOptions({
        selectId: "event_minutes", startIndex: 0, endIndex: 59, selectedValue: (e ? e.minutes : null), displayMethod: prefixWithZero,
        marker: { // on marque les minutes peut commune pour un rdv pour mettre en evidence celle divisible par 5
            condition: (i) => (i % 5), // si reste => pas divisible par 5 
            value: "\xa0."
        }
    });
    fillSelectOptions({ selectId: "event_year", startIndex: 1970, endIndex: 2121, selectedValue: (d ? d.year : (new Date(Date.now())).getFullYear()) });
    fillSelectOptions({ selectId: "event_month", startIndex: 1, endIndex: 12, selectedValue: (d ? d.month : (new Date(Date.now())).getMonth() + 1), displayMethod: prefixWithZero });
    fillSelectOptions({ selectId: "event_day", startIndex: 1, endIndex: 31, selectedValue: (d ? d.date : ((new Date(Date.now())).getDate())), displayMethod: prefixWithZero });

    document.getElementById("event_title").value = e ? e.title : null;
    document.getElementById("event_note").value = e ? e.note : null;
    resetAll();
    document.getElementById("form_add_event").style.display = "block";
    document.getElementById("btn_addEvent").style.display = "inline";
}

function showWeek() {
    resetAll();
    document.getElementById("planning").style.display = "block";
    document.getElementById("search_year").value = (new Date(Date.now())).getFullYear();
}

function showCal() {
    resetAll();
    document.getElementById("cal").style.display = "block";
}

function showEvents(search) {
    resetAll();
    display$("view_events");

    let events = getEvents();
    if (!events) {
        $("events").innerText = "Aucun event enregistré!";
        return;
    }

    let searchInterval;
    if (search) {
        const year1 = $("events_search_startYear").value;
        const year2 = $("events_search_endYear").value;
        const month = $("events_search_month").value;
        const title = $("events_search_title").value;

        // si les années sont inversés on cherche quand meme
        const start = (year1 <= year2) ? year1 : year2;
        const end = (year1 >= year2) ? year1 : year2;

        searchInterval = `[${prefixWithZero(month)}.${start} ~ 12.${end}]`;

        events = events.filter(e => {
            const r = eventReader(e);
            const y = r.d.year;
            const m = r.d.month;
            const isDate = (y == start && m >= month) || (y > start && y <= end);
            return isDate && r.e.title.toLowerCase().includes(title.trim().toLowerCase());
        });
    } else {
        $("events_search_title").value = null;
    }

    if (events.length <= 0) {
        $("events").innerHTML = `Pas d'events à cette période!`;
        return;
    }
    let ref = eventReader(events[0]);
    const last = eventReader(events[events.length - 1]);

    fillSelectOptions({ selectId: "events_search_startYear", startIndex: 1970, endIndex: 2121, selectedValue: ref.d.year });
    fillSelectOptions({ selectId: "events_search_endYear", startIndex: 1970, endIndex: 2121, selectedValue: last.d.year });
    fillSelectOptions({ selectId: "events_search_month", startIndex: 1, endIndex: 12, displayMethod: prefixWithZero, selectedValue: ref.d.month });

    const foundInterval = `[${prefixWithZero(ref.d.month)}.${ref.d.year} ~ 12.${last.d.year}]`;

    let infos = ``;
    infos += ` Recherche entre ${searchInterval ? searchInterval : "[1970 ~ 2121]"}...`;
    infos += `\n ${events.length} events trouvés entre ${foundInterval}`;
    $("events_infos").innerHTML = infos;

    let display = ``;
    display += `\n <span class="bold bigger">${ref.d.year} ${month_getName(ref.d.month)}<span>`;
    events.forEach(e => {
        r = eventReader(e);
        d = r.displayElements;
        if (r.d.year != ref.d.year || r.d.month != ref.d.month) {
            display += `\n\n <span class="bold bigger">${r.d.year} ${month_getName(r.d.month)}<span>`;
            ref = r;
        }
        display += `\n .${d.title} ${d.date} ${d.time}`;
    })
    $("events").innerHTML = display;
}

function action_addEvent() {
    const event = {
        id: Date.now(),
        title: document.getElementById("event_title").value,
        hours: document.getElementById("event_hours").value,
        minutes: document.getElementById("event_minutes").value,
        note: document.getElementById("event_note").value,
    }
    event.minutes = (event.minutes) ? event.minutes : 0; // 0 si null
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
        // vérifier si heure correcte
        const wrongHours = event.hours < 0 || event.hours > 23;
        const wrongMinutes = event.minutes < 0 || event.minutes > 59;
        if (wrongHours || wrongMinutes) {
            alert("Erreur saisie:\nHoiraire incorrect !");
            return;
        }

        const dateEvent = date_new({ day, month, year });
        event.date = dateEvent.object;
        event.date.setHours(event.hours); // inclure l'heure dans l'object pour faciliter le tri par timestamp 
        event.date.setMinutes(event.minutes); // inclure les minutes dans l'object pour faciliter le tri par timestamp
        event.timestamp = dateEvent.object.getTime(); // utile pour le tri des events
        storage_add({ arrayId: storage_ids.EVENTS, newItem: event });

        if (year != CURRENT_YEAR_CAL.year) { // la week dans une autre année
            CURRENT_YEAR_CAL = cal;
        }

        const week = cal_weekFromDate({ cal: CURRENT_YEAR_CAL, date: dateEvent });
        loadWeek({ week });
        showWeek();
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
    // masquer les details
    document.getElementById("event_details").style.display = "none";
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

function eventReader(e) {
    const eventId = (e) ? null : document.getElementById("select_events").value;
    const divDetails = (e) ? null : document.getElementById("event_details");
    if (!eventId && !e) {
        divDetails.style.display = "none";
        return;
    }
    const events = (e) ? null : storage_get({ id: storage_ids.EVENTS });
    const eventIndex = (e) ? null : events.findIndex(e => e.id == eventId);
    e = (e) ? e : events[eventIndex];

    const date = date_newFromDate(new Date(e.date));
    const weekDay = day_getName(date.day);
    const monthString = month_getName(date.month);

    const displayElements = {
        title: `<span class="bold soon">"${e.title}"</span>`,
        time: `<span class="soon">${prefixWithZero(e.hours)}:${prefixWithZero(e.minutes)}</span>`,
        date: `${weekDay} <span class="soon">${prefixWithZero(date.date)} ${monthString}</span> (${date.string})`,
        note: `<span class="soon">"${e.note}"<span>`,
    }

    return { events, eventIndex, d: date, weekDay, monthString, e, divDetails, displayElements }
}

function action_eventDetails() {
    const r = eventReader();
    if (!r) return;
    r.divDetails.style.display = "block";
    let display = "";
    display += `<span class="italic">Quoi:</span> <span class="bold soon">"${r.e.title}"</span>\n`;
    display += `<span class="italic">Date:</span> ${r.weekDay} <span class="soon">${prefixWithZero(r.d.date)} ${r.monthString}</span> (${r.d.string})\n`;
    display += `<span class="italic">Horaire:</span> <span class="soon">${prefixWithZero(r.e.hours)}:${prefixWithZero(r.e.minutes)}</span>\n`;
    display += `<span class="italic">Notes:</span>\n<span class="soon">"${r.e.note}"<span>\n`;
    r.divDetails.innerHTML = display;
}

function deleteEvent({ eventReader }) {
    const r = eventReader;
    // creer un bkp des events en cas de besoin
    storage_update({ id: storage_ids.EVENTS_BKP + Date.now(), value: r.events });
    r.events.splice(r.eventIndex, 1); // retirer l'event de la liste
    storage_update({ id: storage_ids.EVENTS, value: r.events });
}

function action_eventDelete() {
    const r = eventReader();
    if (!r) return;
    let display = "";
    display += `"${r.e.title}"\n`;
    display += `Date: ${r.weekDay} ${prefixWithZero(r.d.date)} ${r.monthString} (${r.d.string})\n`;
    display += `Horaire: ${prefixWithZero(r.e.hours)}:${prefixWithZero(r.e.minutes)}\n`;
    display += `Note:\n"${r.e.note}"\n`;
    // il faut confirmer 2 fois pour effectuer la suppression
    if (confirm("Commencer la suppression de l'event ?\n\n" + display)) {
        if (confirm("Confirmer la suppression de l'event.")) {
            deleteEvent({ eventReader: r });
            // recharger la week
            const week = cal_weekFromDate({ cal: CURRENT_YEAR_CAL, date: r.d });
            loadWeek({ week });
            // masquer les details
            r.divDetails.style.display = "none";
        }
    }
}

function action_eventEdit(copy) {
    const r = eventReader();
    if (!r) return;
    if (confirm("Commencer à modifier/dupliquer l'event ?")) {
        showFormAddEvent({ editingEvent: r.e, edate: r.d });
        document.getElementById("btn_editEvent0").style.display = "inline";
        document.getElementById("btn_addEvent").style.display = "none";
        if (copy) {
            document.getElementById("btn_copyEvent").style.display = "inline";
        } else {
            document.getElementById("btn_editEvent1").style.display = "inline";
        }
    }
}

function action_confirmEditEvent() {
    const r = eventReader();
    if (!r) return;
    if (confirm("Confirmer la modifiaction de l'event ?")) {
        // on ne modifie pas vraiment on va supprimer pour remplacer
        deleteEvent({ eventReader: r });
        action_addEvent();
    }
}

function action_eventCopy() {
    const r = eventReader();
    if (!r) return;
    action_addEvent();
}
