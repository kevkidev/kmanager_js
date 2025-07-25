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
        event.date = date_new({ day, month, year }).object;
        storage_add({ arrayId: storage_ids.EVENTS, newItem: event });
        location.reload();
    }
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
    if (switchDate.year != currentYear) { // la semaine suivante est dans l'année suivante ou precedante
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