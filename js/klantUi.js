const Swal = window.Swal;
import { getKlanten, getMandjes, getLiveKlant, getBerichten } from "./storageItems.js";
import { updateNavbar } from "./navbar.js";
import { showMessage, showToast } from "./notify.js";
import { Bericht } from "./classes.js";

function deleteArtikel(event) {
    const klant = event.target.dataset.klant;
    const index = parseInt(event.target.dataset.index);
    let mandjes = getMandjes();
    let mandje = mandjes[klant];
    const deleted = mandje.artikelen.splice(index, 1);
    if (deleted[0]) {
        mandjes[klant] = mandje;
        localStorage.setItem('mandjes', JSON.stringify(mandjes));
        document.querySelector(`tr[data-row="${index}"`).remove();
        const rows = document.querySelectorAll('#results-table-body tr');
        const deleteBtns = document.querySelectorAll('#results-table-body button');
        for (let i = 0; i < mandje.artikelen.length; i++) {
            rows[i].setAttribute('data-row', i);
            deleteBtns[i].setAttribute('data-index', i);
        }
        updateNavbar();
        showToast('Verwijderd', deleted[0].naam, 'success');
    } else {
        console.log('Er ging iets mis, maar weet nog niet wat');
    }
}

export function populateResults() {
    const mandjes = getMandjes();
    const results = document.getElementById('results-table-body');
    const rows = document.querySelectorAll('#results-table-body tr');
    if (rows.length) {
        rows.forEach((node) => {
            node.remove();
        });
    }
    //const klant = event.target.value;
    const klant = getLiveKlant().naam;
    if (mandjes[klant] && mandjes[klant].artikelen.length) {
        const artikelen = mandjes[klant].artikelen;
        for (let i = 0; i < artikelen.length; i++) {
            const tableRow = document.createElement('tr');
            tableRow.setAttribute('data-row', i);
            const idCel = document.createElement('td');
            const naamCel = document.createElement('td');
            const prijsCel = document.createElement('td');
            const buttonCel = document.createElement('td');
            const deleteBtn = document.createElement('button');
            buttonCel.classList.add('uk-text-right');
            deleteBtn.classList.add('uk-button');
            deleteBtn.classList.add('uk-button-danger');
            deleteBtn.classList.add('uk-button-small');
            deleteBtn.type = 'button';
            deleteBtn.setAttribute('data-index', i);
            deleteBtn.setAttribute('data-klant', klant);
            deleteBtn.innerText = 'X';
            deleteBtn.addEventListener('click', deleteArtikel);
            idCel.innerText = artikelen[i].id;
            naamCel.innerText = artikelen[i].naam;
            prijsCel.innerText = artikelen[i].prijs;
            buttonCel.appendChild(deleteBtn);
            tableRow.appendChild(idCel);
            tableRow.appendChild(naamCel);
            tableRow.appendChild(prijsCel);
            tableRow.appendChild(buttonCel);
            results.appendChild(tableRow);
        }
    } else {
        const tableRow = document.createElement('tr');
        const idCel = document.createElement('td');
        const naamCel = document.createElement('td');
        const prijsCel = document.createElement('td');
        idCel.innerText = '---';
        naamCel.innerText = 'Geen artikelen in mandje';
        prijsCel.innerText = '---';
        tableRow.appendChild(idCel);
        tableRow.appendChild(naamCel);
        tableRow.appendChild(prijsCel);
        results.appendChild(tableRow);
    }
}

function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export function plaatsBericht(event) {
    event.preventDefault();
    const nick = document.getElementById('input-nick').value;
    const email = document.getElementById('input-email').value;
    const titel = document.getElementById('input-titel').value;
    const bericht = document.getElementById('input-bericht').value;
    if (!nick || !email || !titel || !bericht) {
        showMessage('Ontbrekende gegevens', 'Vul alle velden in!', 'error');
    } else if (!validateEmail(email)) {
        console.log('email not valid');
        showMessage('Email niet geldig', 'Vul een geldig email-adres in!', 'error');
    } else {
        const klanten = getKlanten();
        let berichten = getBerichten();
        const live_klant = getLiveKlant();
        const klant = klanten[live_klant.naam];
        const datetime = new Date();
        const date = datetime.toLocaleDateString();
        const time = datetime.toLocaleTimeString();
        const nieuwBericht = new Bericht(date, time, klant, nick, titel, bericht);
        berichten.push(nieuwBericht);
        localStorage.setItem('berichten', JSON.stringify(berichten));
        document.getElementById('input-nick').value = '';
        document.getElementById('input-email').value = '';
        document.getElementById('input-bericht').value = '';
        showMessage('Bericht geplaatst', 'Bedankt voor het plaatsen van een bericht', 'success');
    }
}

export function listBerichten () {
    const berichtenLijst = document.getElementById('berichten-lijst');
    const berichten = getBerichten();
    if (berichten.length) {
        //berichten.forEach((bericht) => {
        for (let i = berichten.length - 1; i >= 0; i--) {
            const berichtDiv = document.createElement('div');
            berichtDiv.style.backgroundColor = '#FFFEE0';
            berichtDiv.style.padding = '15px';
            berichtDiv.style.marginBottom = '15px';
            berichtDiv.style.borderRadius = '8px';
            berichtDiv.style.border = '1px solid gray';
            berichtDiv.classList.add('bericht');
            const headerDiv = document.createElement('div');
            headerDiv.classList.add('uk-grid');

            const nickDiv = document.createElement('div');
            nickDiv.classList.add('uk-width-1-2');
            const nickEl = document.createElement('p');
            nickEl.innerText = berichten[i].nickname;
            nickDiv.appendChild(nickEl);
            headerDiv.appendChild(nickDiv);

            const dtDiv = document.createElement('div');
            dtDiv.classList.add('uk-width-1-2');
            const dtEl = document.createElement('p');
            dtEl.innerText = berichten[i].date + ' ' + berichten[i].time;
            dtDiv.appendChild(dtEl);
            headerDiv.appendChild(dtDiv);

            berichtDiv.appendChild(headerDiv);

            const titelDiv = document.createElement('div');
            const titelEl = document.createElement('h3');
            titelEl.innerText = berichten[i].titel;
            titelDiv.appendChild(titelEl);
            berichtDiv.appendChild(titelDiv);

            const textDiv = document.createElement('div');
            const textEl = document.createElement('p');
            textEl.innerText = berichten[i].text;
            textDiv.appendChild(textEl);
            berichtDiv.appendChild(textDiv);

            berichtenLijst.appendChild(berichtDiv);
        }
        //});
    } else {
        console.log('Geen berichten');
    }
}
