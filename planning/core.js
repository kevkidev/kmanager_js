function year_isLeap({ year }) {
    // si divisible par 4 et pas par 100
    // ou si divisible par 400
    return (year % 4 == 0 && year % 100 !== 0) || (year % 400 == 0);
} tests("year_isLeap", function () {
    const data = [
        { value: 2020, expected: true },
        { value: 2024, expected: true },
        { value: 2028, expected: true },
        { value: 2032, expected: true },
        { value: 2036, expected: true },
        { value: 2040, expected: true },
        { value: 2021, expected: false },
        { value: 2025, expected: false },
        { value: 2033, expected: false },
        { value: 2037, expected: false },
        { value: 2048, expected: true },
    ];
    data.forEach(i => {
        it({
            condition: year_isLeap({ year: i.value }) === i.expected,
            desciption: ` ${i.value} est bissextille: ${i.expected}`
        });
    });
})

function year_countWeeks(year) {
    // regle: un an compte toujours au moins 52 au total et parfois 53
    const janv1 = date_new({ day: 1, month: 1, year });
    const dec31 = date_new({ day: 31, month: 12, year });
    // si 1/01 ou  31/12 tombent un jeudi
    const isThursdayFirst = janv1.day === 4;
    const isThursdayLast = dec31.day === 4;
    // ou si année bisextile et premier jour = mercredi (ou jeudi)
    const isLeapAndWednesday = janv1.day === 3 && year_isLeap({ year });

    return (isThursdayFirst || isThursdayLast || isLeapAndWednesday) ? 53 : 52;
} tests("year_countWeeks", function () {
    const data = [
        { value: 2020, expected: 53 },
        { value: 2021, expected: 52 },
        { value: 2022, expected: 52 },
        { value: 2023, expected: 52 },
        { value: 2025, expected: 52 },
        { value: 2026, expected: 53 },
        { value: 2030, expected: 52 },
        { value: 2032, expected: 53 },
    ];
    data.forEach(i => {
        it({
            condition: year_countWeeks(i.value) == i.expected,
            desciption: `nb semaines ${i.value} est ${i.expected}`
        })
    });
});

function month_countDays({ monthNumber, isLeap }) {
    // les mois vont de 1 à 12
    if (monthNumber == 2) { // si année bissextille => fevrier = 29 jours sinon 28
        return isLeap ? 29 : 28;
    } else if ([4, 6, 9, 11].includes(monthNumber)) {
        return 30;
    } else {
        return 31;
    }
} tests("month_countDays", function () {
    const data = [
        { year: 2023, isLeap: false, month: 2, expected: 28 }, // Février non bissextile
        { year: 2024, isLeap: true, month: 2, expected: 29 },  // Février bissextile
        { year: 2023, isLeap: false, month: 1, expected: 31 }, // Janvier
        { year: 2023, isLeap: false, month: 4, expected: 30 }, // Avril
        { year: 2024, isLeap: true, month: 3, expected: 31 },  // Mars
        { year: 2022, isLeap: false, month: 6, expected: 30 }, // Juin
        { year: 2020, isLeap: true, month: 2, expected: 29 },  // Février bissextile
        { year: 2021, isLeap: false, month: 11, expected: 30 },// Novembre
        { year: 2025, isLeap: false, month: 12, expected: 31 },// Décembre
        { year: 2028, isLeap: true, month: 2, expected: 29 },  // Février bissextile
        { year: 2028, isLeap: true, month: 9, expected: 30 }   // Septembre
    ];

    data.forEach(i => {
        it({
            condition: month_countDays({ monthNumber: i.month, isLeap: i.isLeap }) == i.expected,
            desciption: `nb jours ${i.year} ${i.month} ${i.isLeap} est ${i.expected}`
        });
    });
});

function month_getName(monthNumber) {
    return ["jan", "fév", "mars", "avr", "mai", "juin", "juil",
        "août", "sept", "oct", "nov", "déc",][monthNumber - 1];
} tests("month_getName", function () {
    const data = [
        { month: 1, expected: "jan" },
        { month: 2, expected: "fév" },
        { month: 3, expected: "mars" },
        { month: 4, expected: "avr" },
        { month: 5, expected: "mai" },
        { month: 6, expected: "juin" },
        { month: 7, expected: "juil" },
        { month: 8, expected: "août" },
        { month: 9, expected: "sept" },
        { month: 10, expected: "oct" },
        { month: 11, expected: "nov" },
        { month: 12, expected: "déc" },
    ];

    data.forEach(i => {
        let expected = i.expected;
        let result = month_getName(i.month);
        it({
            condition: result === expected,
            desciption: "Retourne le bon nom de mois",
            expected, result, args: [i.month]
        });

    });
})

function month_firstWeekNumber({ year }) {
    // regle: si 1/01 = lun,mar,mer ou jeu => S1 sinon S52 ou S53
    const jan1 = date_new({ day: 1, month: 1, year });
    if (jan1.day > 4) {  // le premier jour de l'annee tombe apres un jeudi
        return year_countWeeks(year - 1);// recuperer le numero de la derniere semaine de l'année précédente 52 ou 53
    } else {
        return 1;
    }
} tests("month_firstWeekNumber", function () {
    it({
        condition: month_firstWeekNumber({ year: 2020 }) == 1,
        desciption: "2020 commence par la semaine 1"
    })

    it({
        condition: month_firstWeekNumber({ year: 2021 }) == 53,
        desciption: "2021 commence par la semaine 53"
    })

    it({
        condition: month_firstWeekNumber({ year: 2022 }) == 52,
        desciption: "2022 commence par la semaine 52"
    })
})

function date_new({ day, month, year }) {
    const object = new Date(year, month - 1, day);
    return {
        object,
        day: (object.getDay() === 0) ? 7 : object.getDay(), // dim redevient 7 (ISO 8601) jour de 1 à 7
        month: object.getMonth() + 1, // on respect la norme ISO 8601 (mois de 1 à 12)
        date: object.getDate(),
        year: object.getFullYear(),
        string: `${object.getFullYear()}-${object.getMonth() + 1}-${object.getDate()}`,
    };
} tests("date_new", function () {
    const data = [
        { day: 1, month: 1, year: 2025, expectedDay: 3 }, // mercredi
        { day: 2, month: 2, year: 2024, expectedDay: 5 },
        { day: 3, month: 3, year: 2023, expectedDay: 5 }, // ven
        { day: 4, month: 4, year: 2023, expectedDay: 2 },
        { day: 5, month: 5, year: 2020, expectedDay: 2 },
        { day: 6, month: 6, year: 2020, expectedDay: 6 }, // sam
        { day: 12, month: 7, year: 2020, expectedDay: 7 }, // dim
        { day: 18, month: 8, year: 2025, expectedDay: 1 }, // lun
        { day: 4, month: 9, year: 2025, expectedDay: 4 }, // jeu
        { day: 5, month: 10, year: 2025, expectedDay: 7 },
        { day: 5, month: 11, year: 2025, expectedDay: 3 },
        { day: 5, month: 12, year: 2025, expectedDay: 5 },
        { day: 27, month: 7, year: 2025, expectedDay: 7 },
    ];
    data.forEach(i => {
        const value = date_new({ day: i.day, month: i.month, year: i.year });
        it({
            condition: value.day === i.expectedDay,
            desciption: `args ${i.day}/${i.month}/${i.year} expected day = ${i.expectedDay} but was ${value.day}`
        });
        it({
            condition: value.object.getDate() == i.day,
            desciption: `args ${i.day}/${i.month}/${i.year} expected date = ${i.day} but was ${value.object.getDate()}`
        })
        it({
            condition: value.object.getMonth() == i.month - 1,
            desciption: `args ${i.day}/${i.month}/${i.year} expected month = ${i.month - 1} but was ${value.object.getMonth()}`
        })
        it({
            condition: value.object.getFullYear() == i.year,
            desciption: `args ${i.day}/${i.month}/${i.year} expected year = ${i.year} but was ${value.object.getFullYear()}`
        })
    });
})

function date_newFromString(date) { // date = YYYY-MM-DD
    const d = date.split('-');
    return date_new({ year: d[0], month: d[1], day: d[2] });
} tests("date_newFromString", function () {
    tests_todo();
})

function date_newFromDate(date) { // date = YYYY-MM-DD
    return date_new({ year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() });
} tests("date_newFromDate", function () {
    tests_todo();
})

function date_isBankHoliday({ day, month }) { // férié
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
} tests("date_isBankHoliday", function () {
    const data = [
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

    data.forEach(i => {
        it({
            condition: date_isBankHoliday({ day: i.day, month: i.month }).reason === i.reason,
            desciption: `args ${i.day}, ${i.month} => reason = ${i.reason}`
        });
    });

    it({
        condition: date_isBankHoliday({ day: 2, month: 1 }) == undefined,
        desciption: `with day:2, month:1 extends => undefined`
    });

    it({
        condition: date_isBankHoliday({ day: 25, month: 10 }) == undefined,
        desciption: `with day:28, month:10 extends => undefined`
    });
});

function day_getName(dayNumber) {
    return ["lun", "mar", "mer", "jeu", "ven", "sam", "dim"][dayNumber - 1];
} tests("day_getName", function () {
    const data = [
        { number: 1, expected: "lun" },
        { number: 2, expected: "mar" },
        { number: 3, expected: "mer" },
        { number: 4, expected: "jeu" },
        { number: 5, expected: "ven" },
        { number: 6, expected: "sam" },
        { number: 7, expected: "dim" }
    ];

    data.forEach(i => {
        let expected = i.expected;
        let result = day_getName(i.number);
        it({
            condition: result === expected,
            desciption: "Retourne le bon nom de jour",
            expected, result, args: [i.number]
        });
    });
})

function cal_buildYear(year) {
    const calYear = { dates: [], year, weekCount: year_countWeeks(year) };
    // initialiser le num de la premiere semaine de l'année soit à 1, 52, 53
    let weekNumber = month_firstWeekNumber({ year });

    for (let month = 1; month <= 12; month++) {
        const monthDayCountLimit = month_countDays({ monthNumber: month, isLeap: year_isLeap({ year }) });

        for (let monthDay = 1; monthDay <= monthDayCountLimit; monthDay++) {

            // creer les jours du mois
            const date = date_new({ day: monthDay, month, year });
            calYear.dates.push({ weekNumber, date, events: [] });

            // determiner si on increment le weeknumber 
            if (date.day == 7) { // dimanche marque la fin de la semaine
                // regle : le 28/12 est toujours inclus dans la semaine 52 ou 53
                const isSecondeToLastWeek = weekNumber == 52 && month == 12 && monthDay < 28; // il reste une semaine pour terminer l'année
                const isWeek52or53 = weekNumber == 52 || weekNumber == 53;
                const isWeek1to51 = weekNumber >= 1 && weekNumber <= 51;

                if (isWeek1to51 || isSecondeToLastWeek && calYear.weekCount == 53) {
                    weekNumber++;
                } else if (isWeek52or53 && (month == 1 || calYear.weekCount == 52)) { // dans ce cas on est au debut ou fin d'année à S52
                    weekNumber = 1;
                }
            }
        }
    }
    return calYear;
} tests("cal_buildYear", function () {
    const data = [
        {// annee normal
            date: '2023-07-01', expected: {
                monthDaycount: 31, // nombre de jour du mois
                dayOfWeek: 6, // lun = 1, dim = 7
                weekNumber: 26, // numero de semaine de la date
                dayCount: 365, // nombre de jour de l'année
                fisrtWN: 52, // numero de la semaine qui contient le 1 jan
                lastWN: 52, // mumero de la semaine qui contient le 31 dec
                firstWeekDaysCount: 1, // nomdre de jour de jan inclus dans la premiere semaine de l'année
                lastWeekDaysCount: 7,// nomdre de jour de jan inclus dans la derniere semaine de l'année
                jan1WeekDay: 7, // dayofweek du 1/01
                dec31WeekDay: 7, // dayofweek du 31/12 d
            }
        },
        // // 6. Mois commençant un dimanche
        {
            date: '2023-01-01',
            expected: {
                monthDaycount: 31, dayOfWeek: 7, weekNumber: 52, dayCount: 365, fisrtWN: 52, lastWN: 52,
                firstWeekDaysCount: 1, lastWeekDaysCount: 7, jan1WeekDay: 7, dec31WeekDay: 7
            }
        },
        // // 7. Mois finissant un samedi
        {
            date: '2023-09-30',
            expected: {
                monthDaycount: 30, dayOfWeek: 6, weekNumber: 39, dayCount: 365, fisrtWN: 52, lastWN: 52,
                firstWeekDaysCount: 1, lastWeekDaysCount: 7, jan1WeekDay: 7, dec31WeekDay: 7
            }
        },
        { // bisextille
            date: '2024-02-29',
            expected: {
                monthDaycount: 29, dayOfWeek: 4, weekNumber: 9, dayCount: 366, fisrtWN: 1, lastWN: 1,
                firstWeekDaysCount: 7, lastWeekDaysCount: 2, jan1WeekDay: 1, dec31WeekDay: 2
            }
        },
        //  4. Début d'année en semaine 53
        {
            date: '2010-01-01',
            expected: {
                monthDaycount: 31, dayOfWeek: 5, weekNumber: 53, dayCount: 365, fisrtWN: 53, lastWN: 52,
                firstWeekDaysCount: 3, lastWeekDaysCount: 5, jan1WeekDay: 5, dec31WeekDay: 5
            }
        },
        { // 3. Année avec semaine 53
            date: '2015-12-31',
            expected: {
                monthDaycount: 31, dayOfWeek: 4, weekNumber: 53, dayCount: 365, fisrtWN: 1, lastWN: 53,
                firstWeekDaysCount: 4, lastWeekDaysCount: 4, jan1WeekDay: 4, dec31WeekDay: 4
            }
        },

        // // 5. Fin d'année en semaine 53
        {
            date: '2015-12-31',
            expected: {
                monthDaycount: 31, dayOfWeek: 4, weekNumber: 53, dayCount: 365, fisrtWN: 1, lastWN: 53,
                firstWeekDaysCount: 4, lastWeekDaysCount: 4, jan1WeekDay: 4, dec31WeekDay: 4
            }
        },
        {  // // 8. Février bissextile
            date: '2024-02-29',
            expected: {
                monthDaycount: 29, dayOfWeek: 4, weekNumber: 9, dayCount: 366, fisrtWN: 1, lastWN: 1,
                firstWeekDaysCount: 7, lastWeekDaysCount: 2, jan1WeekDay: 1, dec31WeekDay: 2
            }
        },
        {  // 9. 31 décembre dans semaine 1 de l’année suivante
            date: '2004-12-31',
            expected: {
                monthDaycount: 31, dayOfWeek: 5, weekNumber: 53, dayCount: 366, fisrtWN: 1, lastWN: 53,
                firstWeekDaysCount: 4, lastWeekDaysCount: 5, jan1WeekDay: 4, dec31WeekDay: 5
            }
        },
        {
            date: '2005-01-01',
            expected: {
                monthDaycount: 31, dayOfWeek: 6, weekNumber: 53, dayCount: 365, fisrtWN: 53, lastWN: 52,
                firstWeekDaysCount: 2, lastWeekDaysCount: 6, jan1WeekDay: 6, dec31WeekDay: 6
            }
        },
        { // 10. 1er janvier dans semaine 52
            date: '2005-01-01',
            expected: {
                monthDaycount: 31, dayOfWeek: 6, weekNumber: 53, dayCount: 365, fisrtWN: 53, lastWN: 52,
                firstWeekDaysCount: 2, lastWeekDaysCount: 6, jan1WeekDay: 6, dec31WeekDay: 6
            }
        },

    ];


    data.forEach(i => {
        const dateArray = i.date.split('-');
        const date = { year: dateArray[0], month: dateArray[1], day: dateArray[2] };
        const cal = cal_buildYear(date.year);

        const jan1 = cal.dates.find(d => d.date.date == 1 && d.date.month == 1);
        const dec31 = cal.dates.find(d => d.date.date == 31 && d.date.month == 12);

        let result;
        let expected;

        // tests sur l'année

        result = cal.dates.filter(d => d.date.year != date.year).length;
        expected = 0; // si 0 => toutes les dates on la meme année
        it({
            desciption: "L'annee doit etre la bonne",
            condition: result == expected,
            result, expected, args: [i.date],
        })

        result = [... new Set(cal.dates.map(d => d.date.month))].toString(); // set pour ne pas avoir de doublon
        expected = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].toString();
        it({
            desciption: "L'annee doit avoir 12 mois de 1 à 12",
            condition: result == expected,
            result, expected, args: [i.date],
        })

        result = jan1.weekNumber;
        expected = i.expected.fisrtWN;
        it({
            desciption: `1 janv à le bon Num week`,
            condition: result == expected,
            result, expected, args: [i.date],
        })

        result = dec31.weekNumber;
        expected = i.expected.lastWN;
        it({
            desciption: `31 dec à le bon Num week`,
            condition: result == expected,
            result, expected, args: [i.date],
        })

        result = cal.dates.filter(d => d.date.month == date.month).length;
        expected = i.expected.monthDaycount;
        it({
            desciption: `Le mois à le bon nombre de jour`,
            condition: result == expected,
            result, expected, args: [i.date],
        })

        result = cal.dates.length;
        expected = i.expected.dayCount;
        it({
            desciption: `L'année à le bon nombre de jours`,
            condition: result == expected,
            result, expected, args: [i.date],
        })

        // tests de la date
        const foundCalDate = cal.dates.find(d => d.date.month == date.month && d.date.date == date.day && d.date.year == date.year);

        result = foundCalDate.date.day;
        expected = i.expected.dayOfWeek;
        it({
            desciption: `Le jour de la semaine correspond à la date`,
            condition: result == expected,
            result, expected, args: [i.date],
        })

        result = foundCalDate.weekNumber;
        expected = i.expected.weekNumber;
        it({
            desciption: `Le num semaine correspond à la date`,
            condition: result == expected,
            result, expected, args: [i.date],
        })

        for (let wn = 2; wn < i.expected.lastWN; wn++) {
            result = cal.dates.filter(d => d.weekNumber == wn).length;
            expected = 7;
            it({
                desciption: "sauf premiere et derniere, chaque semaine compte 7 jours",
                condition: result == expected,
                result, expected, args: [i.date],
            })
        }

        const firstWeek = cal.dates.filter(d => d.weekNumber === i.expected.fisrtWN && d.date.date <= 7); // <= 7 pour etre sur que c'est pas la seamine 1, 52 ou 53 de la fin d'année
        const lastWeek = cal.dates.filter(d => d.weekNumber === i.expected.lastWN && d.date.date > 20); // > 20 pour etre sur que c'est pas les seamine 1, 52 ou 53 du debut d'année

        result = firstWeek.length;
        expected = i.expected.firstWeekDaysCount;
        it({
            desciption: `Le 1ere semaine de l'année contient les N premiers jours de jan`,
            condition: result == expected,
            result, expected, args: [i.date],
        })

        result = lastWeek.length;
        expected = i.expected.lastWeekDaysCount;
        it({
            desciption: `Le derniere semaine de l'année contient les N dernieres jours de déc`,
            condition: result == expected,
            result, expected, args: [i.date],
        })

        result = jan1.date.day;
        expected = i.expected.jan1WeekDay;
        it({
            desciption: `Le nom du premier jour l'annee`,
            condition: result == expected,
            result, expected, args: [i.date],
        })

        result = dec31.date.day;
        expected = i.expected.dec31WeekDay;
        it({
            desciption: `Le nom du dernier jour de l'année`,
            condition: result == expected,
            result, expected, args: [i.date],
        })
    })
})

function cal_getMonth({ cal, month }) {
    return cal.dates.filter(i => i.date.month == month);
} tests("cal_getMonth", function () {
    let result;
    let expected;
    const cal = cal_buildYear(2025);

    for (let month = 1; month <= 12; month++) {
        const months = cal_getMonth({ cal, month });
        result = months[0].date.date;
        expected = 1;
        it({
            desciption: "Le 1er du mois existe",
            condition: result == expected,
            result, expected, args: [],
        })

        result = months[27].date.date;
        expected = 28;
        it({
            desciption: "Le 28 du mois existe",
            condition: result == expected,
            result, expected, args: [],
        })
    }
})

function cal_monthWeeks({ cal, month }) {
    const dates = cal.dates.filter(i => i.date.month == month);
    const weeks = [];
    for (let i = 1; i < dates.length; i += 7) { // recuperer le num de week de chaque semaines
        weeks.push(cal_weekFromDate({ cal, date: dates[i].date }));
    }
    return weeks;
} tests("cal_monthWeeks", function () {
    tests_todo();
})

function cal_weekFromNumber({ cal, weekNumber }) {
    // ne recupere pas le reste de la semaines si coupé avec dec ou jan
    // autrement dit on ne recupere que les dates presentes dans l'annee courante
    return cal.dates.filter(i => i.weekNumber == weekNumber);
} tests("cal_weekFromNumber", function () {

    let result = cal_weekFromNumber({ cal: cal_buildYear(2021), weekNumber: 1 }).map(i => i.date.object.getDate());
    it({
        condition: result.toString() == [4, 5, 6, 7, 8, 9, 10].toString(),
        desciption: "semaine 1 de 2021 corrompue;"
    })

    result = cal_weekFromNumber({ cal: cal_buildYear(2021), weekNumber: 52 }).map(i => i.date.object.getDate());
    it({
        condition: result.toString() == [27, 28, 29, 30, 31].toString(),
        desciption: "semaine 52 de 2021 corrompue;"
    })

    result = cal_weekFromNumber({ cal: cal_buildYear(2027), weekNumber: 53 }).map(i => i.date.object.getDate());
    it({
        condition: result.toString() == [1, 2, 3].toString(),
        desciption: "semaine 53 de 2027 corrompue;"
    })

    result = cal_weekFromNumber({ cal: cal_buildYear(2022), weekNumber: 53 }).map(i => i.date.object.getDate());
    it({
        condition: result.length == 0,
        desciption: "semaine 53 de 2022 ne doit pas exister;"
    })
})

function cal_weekFromDate({ cal, date }) {
    const weekNumber = cal.dates.find(i =>
        i.date.month == date.month
        && i.date.year == date.year
        && i.date.date == date.date
    ).weekNumber;
    let week = cal_weekFromNumber({ cal, weekNumber });

    // gerer les cas ou la premiere et la derniere semaine de la meme année porte le meme numero WN = 1, 52 ou 53. 
    // Il faut eviter que les semaines du 1/1 et du 31/12 de la meme année soient melangées.
    // Attention! on ne peut verifier en se basant sur la taille de la semaine (ex: week.length > 7).
    // En effet il y a des cas ou la taille de la week sera < 7 (ex: semaine 53 en fin d'année avec seulement 2j et les 5 autres dans l'annee suivante).
    // Solution : On va donc vérifier si la date de chaque jour de la week est tres eloignée de la date en paramètre (interval > 6)

    if (weekNumber == 1 || weekNumber == 52 || weekNumber == 53) {
        // dans ce cas il faudra retirer les jours de la semaine parasite
        week = week.filter(e => Math.abs(e.date.date - date.date) <= 6);
        // maintenant il faut verifier que la semaine est complete 
        // sinon il faut recuperer le reste dans an N-1 ou N+1 selon la date en entrée
        if (week.length < 7) {
            const missingCount = 7 - week.length; // compter le nombre de jour à recuperer
            const restDates = [];
            const yearBegin = (date.date < 7); // si date < 7 on est dans la premiere semaine de l'an
            const year = week[0].date.year;
            const sharedyear = yearBegin ? year - 1 : year + 1;
            const dates = cal_buildYear(sharedyear).dates;
            const startIndex = yearBegin ? dates.length - missingCount : 0; // on commence à partir du premier jour qu'il manque
            const limit = yearBegin ? dates.length : missingCount;

            for (let i = startIndex; i < limit; i++) {
                restDates.push(dates[i]);
            }
            week = yearBegin ? restDates.concat(week) : week.concat(restDates); // la semaine est complète
        }
    }
    return week;
} tests("cal_weekFromDate", function () {
    const data = [
        // 2025
        { date: "2025-1-1", expected: { weekNumber: 1, months: ["2024-12", "2025-1"], dates: [30, 31, 1, 2, 3, 4, 5] } },
        { date: "2025-1-5", expected: { weekNumber: 1, months: ["2024-12", "2025-1"], dates: [30, 31, 1, 2, 3, 4, 5] } },
        { date: "2025-2-28", expected: { weekNumber: 9, months: ["2025-2", "2025-3"], dates: [24, 25, 26, 27, 28, 1, 2] } },
        { date: "2025-8-16", expected: { weekNumber: 33, months: ["2025-8"], dates: [11, 12, 13, 14, 15, 16, 17] } },
        { date: "2025-12-31", expected: { weekNumber: 1, months: ["2025-12", "2026-1"], dates: [29, 30, 31, 1, 2, 3, 4] } },

        // 2023
        { date: "2023-1-1", expected: { weekNumber: 52, months: ["2022-12", "2023-1"], dates: [26, 27, 28, 29, 30, 31, 1] } },
        { date: "2023-1-5", expected: { weekNumber: 1, months: ["2023-1"], dates: [2, 3, 4, 5, 6, 7, 8] } },
        { date: "2023-2-28", expected: { weekNumber: 9, months: ["2023-2", "2023-3"], dates: [27, 28, 1, 2, 3, 4, 5] } },
        { date: "2023-8-16", expected: { weekNumber: 33, months: ["2023-8"], dates: [14, 15, 16, 17, 18, 19, 20] } },
        { date: "2023-12-31", expected: { weekNumber: 52, months: ["2023-12"], dates: [25, 26, 27, 28, 29, 30, 31] } },
        // 2024
        { date: "2024-1-1", expected: { weekNumber: 1, months: ["2024-1"], dates: [1, 2, 3, 4, 5, 6, 7] } },
        { date: "2024-1-5", expected: { weekNumber: 1, months: ["2024-1"], dates: [1, 2, 3, 4, 5, 6, 7] } },
        { date: "2024-2-28", expected: { weekNumber: 9, months: ["2024-2", "2024-3"], dates: [26, 27, 28, 29, 1, 2, 3] } },
        { date: "2024-8-16", expected: { weekNumber: 33, months: ["2024-8"], dates: [12, 13, 14, 15, 16, 17, 18] } },
        { date: "2024-12-31", expected: { weekNumber: 1, months: ["2024-12", "2025-1"], dates: [30, 31, 1, 2, 3, 4, 5] } },
        // 2010
        { date: "2010-1-1", expected: { weekNumber: 53, months: ["2009-12", "2010-1"], dates: [28, 29, 30, 31, 1, 2, 3] } },
        { date: "2010-1-5", expected: { weekNumber: 1, months: ["2010-1"], dates: [4, 5, 6, 7, 8, 9, 10] } },
        { date: "2010-2-28", expected: { weekNumber: 8, months: ["2010-2"], dates: [22, 23, 24, 25, 26, 27, 28] } },
        { date: "2010-8-16", expected: { weekNumber: 33, months: ["2010-8"], dates: [16, 17, 18, 19, 20, 21, 22] } },
        { date: "2010-12-31", expected: { weekNumber: 52, months: ["2010-12", "2011-1"], dates: [27, 28, 29, 30, 31, 1, 2] } },
        // 2015
        { date: "2015-1-1", expected: { weekNumber: 1, months: ["2014-12", "2015-1"], dates: [29, 30, 31, 1, 2, 3, 4] } },
        { date: "2015-1-5", expected: { weekNumber: 2, months: ["2015-1"], dates: [5, 6, 7, 8, 9, 10, 11] } },
        { date: "2015-2-28", expected: { weekNumber: 9, months: ["2015-2", "2015-3"], dates: [23, 24, 25, 26, 27, 28, 1] } },
        { date: "2015-8-17", expected: { weekNumber: 34, months: ["2015-8"], dates: [17, 18, 19, 20, 21, 22, 23] } },
        { date: "2015-12-31", expected: { weekNumber: 53, months: ["2015-12", "2016-1"], dates: [28, 29, 30, 31, 1, 2, 3] } },
        //2004
        { date: "2004-1-1", expected: { weekNumber: 1, months: ["2003-12", "2004-1"], dates: [29, 30, 31, 1, 2, 3, 4] } },
        { date: "2004-1-5", expected: { weekNumber: 2, months: ["2004-1"], dates: [5, 6, 7, 8, 9, 10, 11] } },
        { date: "2004-2-28", expected: { weekNumber: 9, months: ["2004-2"], dates: [23, 24, 25, 26, 27, 28, 29] } },
        { date: "2004-8-16", expected: { weekNumber: 34, months: ["2004-8"], dates: [16, 17, 18, 19, 20, 21, 22] } },
        { date: "2004-12-31", expected: { weekNumber: 53, months: ["2004-12", "2005-1"], dates: [27, 28, 29, 30, 31, 1, 2] } },
        //2005
        { date: "2005-1-1", expected: { weekNumber: 53, months: ["2004-12", "2005-1"], dates: [27, 28, 29, 30, 31, 1, 2] } },
        { date: "2005-1-5", expected: { weekNumber: 1, months: ["2005-1"], dates: [3, 4, 5, 6, 7, 8, 9] } },
        { date: "2005-2-28", expected: { weekNumber: 9, months: ["2005-2", "2005-3"], dates: [28, 1, 2, 3, 4, 5, 6] } },
        { date: "2005-8-15", expected: { weekNumber: 33, months: ["2005-8"], dates: [15, 16, 17, 18, 19, 20, 21] } },
        { date: "2005-12-31", expected: { weekNumber: 52, months: ["2005-12", "2006-1"], dates: [26, 27, 28, 29, 30, 31, 1] } },
        // 2020
        { date: "2020-1-1", expected: { weekNumber: 1, months: ["2019-12", "2020-1"], dates: [30, 31, 1, 2, 3, 4, 5] } },
        { date: "2020-1-5", expected: { weekNumber: 1, months: ["2019-12", "2020-1"], dates: [30, 31, 1, 2, 3, 4, 5] } },
        { date: "2020-2-28", expected: { weekNumber: 9, months: ["2020-2", "2020-3"], dates: [24, 25, 26, 27, 28, 29, 1] } },
        { date: "2020-8-17", expected: { weekNumber: 34, months: ["2020-8"], dates: [17, 18, 19, 20, 21, 22, 23] } },
        { date: "2020-12-31", expected: { weekNumber: 53, months: ["2020-12", "2021-1"], dates: [28, 29, 30, 31, 1, 2, 3] } },
        // 2021
        { date: "2021-1-1", expected: { weekNumber: 53, months: ["2020-12", "2021-1"], dates: [28, 29, 30, 31, 1, 2, 3] } },
        { date: "2021-1-5", expected: { weekNumber: 1, months: ["2021-1"], dates: [4, 5, 6, 7, 8, 9, 10] } },
        { date: "2021-2-28", expected: { weekNumber: 8, months: ["2021-2"], dates: [22, 23, 24, 25, 26, 27, 28] } },
        { date: "2021-8-16", expected: { weekNumber: 33, months: ["2021-8"], dates: [16, 17, 18, 19, 20, 21, 22] } },
        { date: "2021-12-31", expected: { weekNumber: 52, months: ["2021-12", "2022-1"], dates: [27, 28, 29, 30, 31, 1, 2] } },
        //2000
        { date: "2000-1-1", expected: { weekNumber: 52, months: ["1999-12", "2000-1"], dates: [27, 28, 29, 30, 31, 1, 2] } },
        { date: "2000-1-5", expected: { weekNumber: 1, months: ["2000-1"], dates: [3, 4, 5, 6, 7, 8, 9] } },
        { date: "2000-2-28", expected: { weekNumber: 9, months: ["2000-2", "2000-3"], dates: [28, 29, 1, 2, 3, 4, 5] } },
        { date: "2000-8-16", expected: { weekNumber: 33, months: ["2000-8"], dates: [14, 15, 16, 17, 18, 19, 20] } },
        { date: "2000-12-31", expected: { weekNumber: 52, months: ["2000-12"], dates: [25, 26, 27, 28, 29, 30, 31] } },
        // 2100
        { date: "2100-1-1", expected: { weekNumber: 53, months: ["2099-12", "2100-1"], dates: [28, 29, 30, 31, 1, 2, 3] } },
        { date: "2100-1-5", expected: { weekNumber: 1, months: ["2100-1"], dates: [4, 5, 6, 7, 8, 9, 10] } },
        { date: "2100-2-28", expected: { weekNumber: 8, months: ["2100-2"], dates: [22, 23, 24, 25, 26, 27, 28] } },
        { date: "2100-8-16", expected: { weekNumber: 33, months: ["2100-8"], dates: [16, 17, 18, 19, 20, 21, 22] } },
        { date: "2100-12-31", expected: { weekNumber: 52, months: ["2100-12", "2101-1"], dates: [27, 28, 29, 30, 31, 1, 2] } },
    ];

    let result;
    let expected;
    data.forEach(d => {
        const date = date_newFromString(d.date);
        const cal = cal_buildYear(date.year);
        const week = cal_weekFromDate({ cal, date });

        result = week.map(w => w.date.date).toString();
        expected = d.expected.dates.toString();
        it({
            desciption: "La semaine contient les bonnes dates",
            condition: result == expected,
            result, expected, args: [d.date],
        })

        result = [...new Set(week.map(e => e.date.year + "-" + e.date.month))].toString();
        expected = d.expected.months.toString();
        it({
            desciption: "La semaine est partager entre les bons mois",
            condition: result == expected,
            result, expected, args: [d.date],
        })

        result = week[0].weekNumber;
        expected = d.expected.weekNumber;
        it({
            desciption: "La semaine porte le bon numero",
            condition: result == expected,
            result, expected, args: [d.date],
        })
    })
})