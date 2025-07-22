
function month_getNumbersOfDay({ monthNumber, isBissextileYear }) {
    if (monthNumber == 2) { // si année bissextille => fevrier = 29 jours sinon 28
        return isBissextileYear ? 29 : 28;
    } else if ([4, 6, 9, 11].includes(monthNumber)) {
        return 30;
    } else {
        return 31;
    }
}

function year_checkBissextile({ year }) {
    // si divisible par 4 et pas par 100
    // ou si divisible par 400
    return (year % 4 == 0 && year % 100 !== 0) || (year % 400 == 0);
}

function day_checkBankHoliday({ day, month }) { // férié
    const bankHolidays = [
        { month: 1, day: 1, reason: "Jour de l'an" },
        { month: 4, day: 21, reason: "Lundi de Pâques" },
        { month: 5, day: 1, reason: "Fête du travail" },
        { month: 5, day: 8, reason: "Victoire 1945" },
        { month: 5, day: 29, reason: "Ascension" },
        { month: 6, day: 9, reason: "Lundi de Pentecôte" },
        { month: 7, day: 14, reason: "Fête nationale" },
        { month: 8, day: 15, reason: "Assomption" },
        { month: 11, day: 1, reason: "Toussaint" },
        { month: 11, day: 11, reason: "Armistice 1918" },
        { month: 12, day: 25, reason: "Jour de Noël" },
    ];

    return bankHolidays.find(e => e.month == month && e.day == day);
}

function date_newDate({ day, month, year }) {
    return new Date(year, month - 1, day);
}

function month_getName(value) {
    return ["jan", "fév", "mars", "avr", "mai", "juin", "juil",
        "août", "sept", "oct", "nov", "déc",][value];
}

function day_getName(value) {
    return ["dim", "lun", "mar", "mer", "jeu", "ven", "sam",][value];
}

function cal_buildYear(year) {
    const cal = [];
    let weekNumber = 1;
    for (let m = 1; m <= 12; m++) {
        const maxDay = month_getNumbersOfDay({
            monthNumber: m,
            isBissextileYear: year_checkBissextile({ year })
        });

        for (let d = 1; d <= maxDay; d++) {
            const date = date_newDate({ day: d, month: m, year });
            cal.push({ weekNumber, date, events: [] });
            if (date.getDay() == 0) { // 0 = dimanche
                weekNumber++;
            }
        }
    }
    return cal;
}


function cal_getMonth({ cal, month }) {
    return cal.filter(i => month == i.date.getMonth());
}

function cal_currentWeek({ cal }) {
    const now = new Date(Date.now());
    let firstWeekDate = now.getDate();
    if (now.getDay() > 1) { // si on est pas lundi ni dimache
        firstWeekDate = now.getDate() - now.getDay() + 1;
    } else if (now.getDay() == 0) { // si c'est dimanche
        firstWeekDate = now.getDate() - 6;
    }
    const lastWeekDate = firstWeekDate + 6; // lundi + les 6 autres jours

    return cal.filter(i => i.date.getMonth() == now.getMonth()
        && i.date.getDate() >= firstWeekDate
        && i.date.getDate() <= lastWeekDate
    )
}

function bind_events(cal) {
    const events = storage_get({ id: "events" });
    if (!events) return;
    events.forEach(e => {
        const eDate = new Date(e.date);
        const found = cal.find(i =>
            i.date.getFullYear() == eDate.getFullYear()
            && i.date.getDate() == eDate.getDate()
            && i.date.getMonth() == eDate.getMonth()
        )
        if (found) {
            found.events.push(e);
        }
    })

}

function cal_week({ cal, weekNumber }) {
    return cal.filter(i => i.weekNumber == weekNumber);
}

function displayWeek(weekArray) {
    let display = `\n __S.${weekArray[0].weekNumber} ${month_getName(weekArray[0].date.getMonth())}. ${weekArray[0].date.getFullYear()}__`;
    const space = "\xa0";
    weekArray.forEach(i => {
        display += `\n ${day_getName(i.date.getDay())} ${i.date.getDate()}------------------------------------------------------------`;
        if (i.events) {
            i.events.forEach(e => {
                console.log(e);
                display += `\n ${space.repeat(parseInt(e.hours))}.${e.hours}:${e.minutes} "${e.title}"`;
            })
        }

    });
    return display;
}

function displayMonth(monthArray) {
    let display = `\n # ${month_getName(monthArray[0].date.getMonth())} ${monthArray[0].date.getFullYear()} `;
    const firstMonthDay = monthArray[0].date.getDay();
    const space = "\xa0\xa0\t";
    let marge = "";
    if (firstMonthDay == 0) {
        marge = space.repeat(6);
    } else {
        marge = space.repeat(firstMonthDay - 1);
    }
    display += `\nLu\tMa\tMe\tJe\tVe\tSa\tDi\n`;
    display += ` ${marge} `;
    monthArray.forEach(i => {
        display += `${i.date.getDate()} \t`;
        display += (i.date.getDay() == 0) ? "\n" : "";
    });
    return display;
}

// #####################################################################

function storage_get({ id }) {
    const found = localStorage.getItem(id);
    return JSON.parse(found);
}
function storage_add({ arrayId, newItem }) {
    let array = storage_get({ id: arrayId });
    if (!array) {
        array = [];
    }
    array.push(newItem);
    storage_update({ id: arrayId, value: array });
}

function storage_update({ id, value }) {
    localStorage.removeItem(id);
    localStorage.setItem(id, JSON.stringify(value));
}

// #####################################################################

function cal_addEvent() {
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
        event.date = date_newDate({ day, month, year });
        storage_add({ arrayId: "events", newItem: event });
        location.reload();
    }
}

// ############################################################################

const now = new Date(Date.now());
// const now = date_newDate({ day: 14, month: 8, year: 2025 });
let today = `${day_getName(now.getDay())} ${now.getDate()} ${month_getName(now.getMonth())} ${now.getFullYear()}`;
const blankDay = day_checkBankHoliday({ day: now.getDate(), month: (now.getMonth() + 1) });
if (blankDay) today += ` [ *${blankDay.reason}* ]`;
document.getElementById("today").innerText = today;

const cal = cal_buildYear(now.getFullYear());
document.getElementById("current_month").innerText =
    displayMonth(
        cal_getMonth({ cal, month: now.getMonth() })
    )
for (let i = 0; i < 12; i++) {
    document.getElementById("month_" + (i + 1)).innerText =
        displayMonth(
            cal_getMonth({ cal, month: i })
        )
}



const currentWeek = cal_currentWeek({ cal });
bind_events(currentWeek);
document.getElementById("current_week").innerText = displayWeek(currentWeek);
