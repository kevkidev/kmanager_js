function events_bind(cal) {
    const events = storage_get({ id: storage_ids.EVENTS });
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
    const monthsDisplay = month1 != month2 ? `${month1Display}/${month2Display}` : month1Display;
    let display = `\n <span class="strong">${monthsDisplay}. ${week[6].date.year}</span> sem.${week[6].weekNumber}\n`;
    const space = "\xa0";
    week.forEach(i => {
        display += `\n ${day_getName(i.date.day)} <span class="bold">${i.date.date}.${month_getName(i.date.month)}</span>------------------------------------------------`;
        if (i.events) {
            i.events.forEach(e => {
                display += `\n ${space.repeat(parseInt(e.hours))}<span class="soon">.${e.hours}:${e.minutes} "${e.title}"</span>`;
            })
        }
    });
    return display;
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
    document.getElementById("event_details").style.display = "none";
    events_bind(week); // remplir avec les events
    document.getElementById("current_week").innerHTML = displayWeek(week);
    storage_update({ id: storage_ids.WEEK_LIMITS, value: { day1: week[0].date, day7: week[6].date } });

    // remplir les options de select du panel avec les events
    const options = [`<option value="" selected>?</option>`]; // on peut select cette valeur pour masqué les details
    week.forEach(d => {
        d.events.forEach(e => {
            const date = date_newFromDate(new Date(e.date));
            options.push(`<option value="${e.id}">${day_getName(date.day)}.${date.date} ${e.hours}:${e.minutes} "${e.title}"</option>`);
        })
    })
    document.getElementById("select_events").innerHTML = options.toString();
}

// ###########################################################################

const date = date_newFromDate(new Date(Date.now()))

let today = `Aujourd'hui : ${day_getName(date.day)} ${date.date} ${month_getName(date.month)} ${date.year}`;
const blankDay = date_isBankHoliday({ day: date.date, month: (date.month + 1) });
today += blankDay ? ` [ *${blankDay.reason}* ]` : "";

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