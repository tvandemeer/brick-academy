import { getKlanten, getLiveKlant } from "./storageItems.js";
import { Klant } from "./classes.js";

export function klantLogin (naam) {
    const klanten = getKlanten();
    let live_klant = getLiveKlant();
    if (live_klant) {
        if (naam === live_klant.naam) {
            document.getElementById('input-naam').value = '';
            document.getElementById('check-admin').checked = false;
            return 2;
        } else {
            document.getElementById('input-naam').value = '';
            document.getElementById('check-admin').checked = false;
            return 3;
        }
    } else {
        const admin = document.getElementById('check-admin').checked;
        if (klanten[naam]) {
            klanten[naam].admin = admin;
            live_klant = klanten[naam];
            localStorage.setItem('klanten', JSON.stringify(klanten));
            sessionStorage.setItem('live_klant', JSON.stringify(live_klant));
            document.getElementById('input-naam').value = '';
            document.getElementById('check-admin').checked = false;
            return 1;
        } else {
            let klant = new Klant(naam, admin);
            klanten[naam] = klant;
            localStorage.setItem('klanten', JSON.stringify(klanten));
            live_klant = klant;
            sessionStorage.setItem('live_klant', JSON.stringify(live_klant));
            document.getElementById('input-naam').value = '';
            document.getElementById('check-admin').checked = false;
            return 4;
        }
    }
}
