function common_display_lastImportDate({ prefixId, suffixId }) {
    const date = storage_getLastImportDate(suffixId);
    dom_get(prefixId + suffixId).innerText = (date != "null") ? date : "inconnue";
}