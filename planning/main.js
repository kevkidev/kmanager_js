

function events_sort(events) { // l' id est un time stamp donc suffit de sort par id
    const sorted = events.sort((a, b) => a.timestamp - b.timestamp);
    return events;
}

/** @returns {array} */
function getEvents() {
    let events = storage_get({ id: storage_ids.EVENTS });
    if (!events) return;
    events = events_sort(events);
    return events;
}

function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function mapEvent(e) {
    if (!e) return;
    const ev = clone(e);
    ev.date = date_newFromDate(new Date(ev.date));
    ev.dayName = day_getName(ev.date.day);
    ev.monthName = month_getName(ev.date.month);
    return ev;
}

/** @returns {array} */
function getEvent(id) {
    let events = storage_get({ id: storage_ids.EVENTS });
    if (!events) return;
    let event = events.find(e => e.id == id);
    if (event) event.index = events.indexOf(event);
    return mapEvent(event);
}

function events_bind(cal) {
    let events = getEvents();
    if (!events) return;
    cal.forEach(d => d.events = []); // pour vider les events deja presents et eviter les doublons
    events.forEach(e => {
        const eDate = date_newFromDate(new Date(e.date));
        const found = cal.find(i =>
            i.date.year == eDate.year
            && i.date.date == eDate.date
            && i.date.month == eDate.month
        )
        if (found) {
            found.events.push(e);
        }
    })
} tests("events_bind", function () {
    tests_todo();
})

function displayWeek(week) {
    // checker si la semaine se chevauche sur 2 mois
    let month1 = week[1].date.month;
    let month2 = week[6].date.month;
    const month1Display = month_getName(month1);
    const month2Display = month_getName(month2);
    const monthsDisplay = month1 != month2 ? `${month1Display} & ${month2Display}` : month1Display;

    $("week_month").innerText = `${monthsDisplay} ${week[6].date.year}`;
    $("week_number").innerText = `N°${week[6].weekNumber}`;

    $("week").innerHTML = null; // vider la week
    let count = 0;
    week.forEach(i => {
        count++;
        $("week").innerHTML += `<div class="form_group" id="week_day_${count}"></div>`;
        $("week").innerHTML += `<div class="week_events" id="week_events_${count}"></div>`;

        let weekDayHtml = `<span>${day_getName(i.date.day)} ${i.date.date} ${month_getName(i.date.month)}</span>`;
        weekDayHtml += `<span class="form_label">${prefixWithZero(i.date.date)}/${prefixWithZero(i.date.month)}/${i.date.year}</span>`;
        $(`week_day_${count}`).innerHTML = weekDayHtml;

        if (i.events) {
            i.events.forEach(e => {
                const h = prefixWithZero(e.hours);
                const min = prefixWithZero(e.minutes);
                const marginLeft = (e.hours * 60 + e.minutes * 1) / 23; // x1 pour caster en int
                const style = `margin-left:${marginLeft}px;`;
                let html = `<div onclick="showEditView(${e.id})">`;
                html += `<span style="${style}">${h}:${min}</span>`;
                html += `<span style="${style}" class="week_events_title">${e.title}</span>`;
                html += `<div>`;
                $(`week_events_${count}`).innerHTML += html;
            })
        }
    });
}

function displayMonth(weeks) {
    let display = `\n # ${month_getName(weeks[1][0].date.month)} ${weeks[1][0].date.year} `; // on prend fev pour etre sur d'avoir le bon mois et an
    display += `\nLu\tMa\tMe\tJe\tVe\tSa\tDi\n`;
    weeks.forEach(w => {
        w.forEach(o => {
            display += `${o.date.date} `;
            display += o.date.date < 10 ? "\xa0" : "";
            display += o.date.day == 7 ? "\n" : "";
        })
    });
    return display;
}

/** Charge les events de la semaine puis l'affiche. */
function loadWeek({ week }) {
    events_bind(week); // remplir avec les events
    storage_update({ id: storage_ids.WEEK_LIMITS, value: { day1: week[0].date, day7: week[6].date } });
    displayWeek(week);
    setWeekDateSearch(week[0].date);
    showWeek();
}



// ###########################################################################
hideAll();
display$("view_week");
$('app_version').innerText = localStorage.getItem('app_version');
document.getElementById('app_author').innerText = localStorage.getItem('app_author');

const date = date_newFromDate(new Date(Date.now()))
setWeekDateSearch(date);

let today = `${day_getName(date.day)} ${date.date} ${month_getName(date.month)} ${date.year}`;
const blankDay = date_isBankHoliday({ day: date.date, month: date.month });
today += blankDay ? ` ~ (${blankDay.reason})` : "";

document.getElementById("today").innerText = today;

let CURRENT_YEAR_CAL = cal_buildYear(date.year);

document.getElementById("current_month").innerText = displayMonth(
    cal_monthWeeks({ cal: CURRENT_YEAR_CAL, month: date.month })
)

for (let i = 1; i <= 12; i++) {
    document.getElementById("month_" + i).innerText = displayMonth(
        cal_monthWeeks({ cal: CURRENT_YEAR_CAL, month: i })
    )
}
loadWeek({ week: cal_weekFromDate({ cal: CURRENT_YEAR_CAL, date }) });


tests_stats();