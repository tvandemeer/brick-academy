import { getKlanten } from "./storageItems.js";
import { updateNavbar } from "./navbar.js";
import { showMessage } from "./notify.js";
import { klantLogin } from "./statusChange.js";

//const live_klant = getLiveKlant();

updateNavbar();

const loginButton = document.getElementById('button-login');
loginButton.addEventListener('click', (event) => {
    event.preventDefault();
    const naam = document.getElementById('input-naam').value;
    const newUser = document.getElementById('check-new').checked;
    const klanten = getKlanten();
    console.log(newUser);
    if (naam) {
        if (newUser && klanten[naam]) {
            showMessage('Al in gebruik!', 'Deze naam is al in gebruik, kies een andere naam', 'error');
        } else {
            let loginCode = klantLogin(naam);
            if (loginCode === 1) {
                updateNavbar();
                showMessage('Welkom terug, ' + naam + '!', 'Je bent ingelogd', 'success');
            } else if (loginCode === 2) {
                showMessage('Al ingelogd', 'Je bent al ingelogd!', 'info');
            } else if (loginCode === 3) {
                showMessage('Actieve login', 'Er is al iemand ingelogd', 'info');
            } else if (loginCode === 4) {
                updateNavbar();
                showMessage('Welkom ' + naam + '!', 'Je bent ingelogd', 'success');
            }
        }
    } else {
        showMessage('Naam vereist', 'Vul een naam in!', 'warning');
    }
});

