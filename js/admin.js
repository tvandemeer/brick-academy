import { updateNavbar } from "./navbar.js";
import { getLiveKlant } from "./storageItems.js";
import { showMessage } from "./notify.js";
import { populateSelect, populateCustom, createCustomArtikel } from "./adminUi.js";

updateNavbar();

let live_klant = getLiveKlant();

if (!live_klant) {
    showMessage('Niet ingelogd', 'Je moet ingelogd zijn als admin!', 'warning');
} else if (live_klant && !live_klant.admin) {
    showMessage('Geen admin', 'Je hebt geen admin rechten!', 'error');
} else if (live_klant && live_klant.admin) {
    if (!JSON.parse(sessionStorage.getItem('admin-greet'))) {
        sessionStorage.setItem('admin-greet', 1);
        showMessage('Welkom ' + live_klant.naam + '!', 'Gebruik je admin rechten met zorg :)', 'success');
    }

    populateSelect();
    document.getElementById('add-custom-btn').addEventListener('click', createCustomArtikel);
    populateCustom();
}

