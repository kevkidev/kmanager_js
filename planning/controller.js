function resetAll() {
    document.getElementById("planning").style.display = "none";
    document.getElementById("cal").style.display = "none";
    document.getElementById("form_add_event").style.display = "none";
}

function showFormAddEvent(event) {
    document.getElementById("event_hours").value = null;
    document.getElementById("event_day").value = null;
    document.getElementById("event_title").value = null;
    document.getElementById("event_note").value = null;
    document.getElementById("event_year").value = (new Date(Date.now())).getFullYear();
    document.getElementById("event_month").value = (new Date(Date.now())).getMonth() + 1;
    document.getElementById("event_minutes").value = 0;
    resetAll();
    document.getElementById("form_add_event").style.display = "block";
}
function showWeek() {
    resetAll();
    document.getElementById("planning").style.display = "block";
}
function showCal() {
    resetAll();
    document.getElementById("cal").style.display = "block";
}

document.getElementById("search_year").value = (new Date(Date.now())).getFullYear();


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

    if (event.title && event.hours && event.minutes && day && month && year) {
        const date = date_new({ day, month, year });
        event.date = date.object;
        storage_add({ arrayId: storage_ids.EVENTS, newItem: event });

        if (date.year != CURRENT_YEAR_CAL.year) { // la week dans une autre année
            CURRENT_YEAR_CAL = cal_buildYear(date.year);
        }
        console.log(date.year);

        const week = cal_weekFromDate({ cal: CURRENT_YEAR_CAL, date });
        loadWeek({ week });
        showWeek();
    }
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
    const year = parseInt(document.getElementById("search_year").value);
    CURRENT_YEAR_CAL = cal_buildYear(year);
    const week = cal_weekFromDate({ cal: CURRENT_YEAR_CAL, date: date_new({ day: 1, month, year }) });
    loadWeek({ week });
}

function action_eventDetails() {
    const r = eventReader();
    if (!r) return;
    r.divDetails.style.display = "block";
    let display = "";
    display += `<span class="italic">Quoi:</span> <span class="bigger soon">"${r.e.title}"</span>\n`;
    display += `<span class="italic">Date:</span> ${r.weekDay} <span class="soon">${r.d.date} ${r.monthString}</span> (${r.d.date}.${r.d.month}.${r.d.year})\n`;
    display += `<span class="italic">Horaire:</span> <span class="soon">${r.e.hours}:${r.e.minutes}</span>\n`;
    display += `<span class="italic">Notes:</span>\n<span class="soon">"${r.e.note}"<span>\n`;
    r.divDetails.innerHTML = display;
}

function action_eventDelete() {
    const r = eventReader();
    if (!r) return;
    let display = "";
    display += `"${r.e.title}"\n`;
    display += `Date: ${r.weekDay} ${r.d.date} ${r.monthString} (${r.d.date}.${r.d.month}.${r.d.year})\n`;
    display += `Horaire: ${r.e.hours}:${r.e.minutes}\n`;
    display += `Notes:\n"${r.e.note}"\n`;
    // il faut confirmer 2 fois pour effectuer la suppression
    if (confirm("1/2 Comfirmer pour supprimer l'event:\n\n" + display)) {
        if (confirm("2/2 Confirmer à nouveau pour supprimer l'event.")) {
            // creer un bkp des events en cas de besoin
            storage_update({ id: storage_ids.EVENTS_BKP + Date.now(), value: r.events });
            r.events.splice(r.eventIndex, 1); // retirer l'event de la liste
            storage_update({ id: storage_ids.EVENTS, value: r.events });
            // recharger la week
            const week = cal_weekFromDate({ cal: CURRENT_YEAR_CAL, date: r.d });
            loadWeek({ week });
            // masquer les details
            r.divDetails.style.display = "none";
        }
    }
}

function eventReader() {
    const eventId = document.getElementById("select_events").value;
    const divDetails = document.getElementById("event_details");
    if (!eventId) {
        divDetails.style.display = "none";
        return;
    }
    const events = storage_get({ id: storage_ids.EVENTS });
    const eventIndex = events.findIndex(e => e.id == eventId);
    const e = events[eventIndex];
    const date = date_newFromDate(new Date(e.date));
    const weekDay = day_getName(date.day);
    const monthString = day_getName(date.month);

    return { events, eventIndex, d: date, weekDay, monthString, e, divDetails }
}