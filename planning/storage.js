const storage_ids = {
    EVENTS: "events", // liste de tous les events
    WEEK_LIMITS: "calYearIndex", // date du premier jour de la semaine
    EVENTS_BKP: "eventsBkp_"
}

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