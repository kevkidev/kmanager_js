
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

function cal_build(year) {
    const cal = [];
    let weekNumber = 1;
    for (let m = 1; m <= 12; m++) {
        const maxDay = month_getNumbersOfDay({
            monthNumber: m,
            isBissextileYear: year_checkBissextile({ year })
        });

        for (let d = 1; d <= maxDay; d++) {
            const date = date_newDate({ day: d, month: m, year });
            cal.push({ weekNumber, date });
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
    if (now.getDay() > 1) {
        firstWeekDate = now.getDate() - now.getDay()
    }
    const lastWeekDate = firstWeekDate + 6;

    return cal.filter(i => {
        return (
            i.date.getMonth() == now.getMonth()
            && i.date.getDate() >= firstWeekDate
            && i.date.getDate() <= lastWeekDate
        );
    })
}

function cal_week({ cal, weekNumber }) {
    return cal.filter(i => i.weekNumber == weekNumber);
}

function displayWeek(weekArray) {
    let display = "";
    display += `\n # ${month_getName(weekArray[0].date.getMonth())} ${weekArray[0].date.getFullYear()} S.${weekArray[0].weekNumber}`;
    const space = "\xa0\xa0\xa0";
    weekArray.forEach(i => {
        display += `\n  ${day_getName(i.date.getDay())} ${i.date.getDate()} `;
        display += `\n \t >${space.repeat(10)} 10:40 aze `;
        display += `\n \t >${space.repeat(13)} 13:40 qsd `;
        display += `\n \t >______________________________________________________________________ `;
        display += `\n \t 00-01-02-03-04-05-06-07-08-09-10-11-12-13-14-15-16-17-18-19-20-21-22-23 `;
        display += `\n `;

    });
    return display;
}

function displayMonth(monthArray) {
    let display = "";
    display += `\n # ${month_getName(monthArray[0].date.getMonth())} ${monthArray[0].date.getFullYear()}`;
    const firstMonthDay = monthArray[0].date.getDay();
    const space = "\xa0\xa0\t";
    let marge = "";
    marge = space.repeat(firstMonthDay - 1);
    if (firstMonthDay == 0) {
        marge = space.repeat(6);
    }
    display += `\nLu\tMa\tMe\tJe\tVe\tSa\tDi\n`;
    display += ` ${marge}`;
    monthArray.forEach(i => {
        display += `${i.date.getDate()}\t`;
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
        date: date_newDate({
            day: document.getElementById("event_day").value,
            month: document.getElementById("event_month").value,
            year: document.getElementById("event_year").value
        })
    }

    storage_add({ arrayId: "events", newItem: event });
}

// ############################################################################

const now = new Date(Date.now());
const CAL = cal_build(now.getFullYear());
// console.log(cal);
// console.log(cal_week({ cal, weekNumber: 30 }));

const currentMonth = cal_getMonth({ cal: CAL, month: now.getMonth() });
const currentWeek = cal_currentWeek({ cal: CAL });
console.log(displayMonth(currentMonth));
console.log(displayWeek(currentWeek));

