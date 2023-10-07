import { updateNavbar } from "./navbar.js";
import { getLiveKlant, getBerichten } from "./storageItems.js";
import { plaatsBericht } from "./klantUi.js";

updateNavbar();

const live_klant = getLiveKlant();
const berichten = getBerichten();

const formBericht = document.getElementById('form-bericht');
const noUser = document.getElementById('no-user');

if (live_klant) {
    document.getElementById('button-bericht')
        .addEventListener('click', plaatsBericht);
    if (formBericht.classList.contains('uk-hidden')) {
        formBericht.classList.remove('uk-hidden');
    }
    if (!noUser.classList.contains('uk-hidden')) {
        noUser.classList.add('uk-hidden');
    }
    if (berichten.length) {
        console.log('Berichten gevonden');
    } else {
        console.log('Geen berichten');
    }
} else {
    if (!formBericht.classList.contains('uk-hidden')) {
        formBericht.classList.add('uk-hidden');
    }
    if (noUser.classList.contains('uk-hidden')) {
        noUser.classList.remove('uk-hidden');
    }
    console.log('Geen ingelogde klant');
}
