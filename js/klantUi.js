const Swal = window.Swal;
import { getKlanten, getMandjes, getLiveKlant, getBerichten } from "./storageItems.js";
import { updateNavbar } from "./navbar.js";
import { showMessage, showToast } from "./notify.js";
import { Bericht } from "./classes.js";
import { validateEmail } from "./validate.js";

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
        let totaalPrijs = 0;
        const rows = document.querySelectorAll('#results-table-body tr');
        const deleteBtns = document.querySelectorAll('#results-table-body button');
        for (let i = 0; i < mandje.artikelen.length; i++) {
            rows[i].setAttribute('data-row', i);
            deleteBtns[i].setAttribute('data-index', i);
            totaalPrijs += parseFloat(mandje.artikelen[i].prijs);
        }
        if (document.getElementById('totaal')) {
            document.getElementById('totaal').remove();
        }
        const deleteResults = document.getElementById('results-table-body');
        const totaalRow = document.createElement('tr');
        totaalRow.id = 'totaal';
        const idCel = document.createElement('td');
        const naamCel = document.createElement('td');
        const prijsCel = document.createElement('td');
        const buttonCel = document.createElement('td');
        idCel.innerText = '';
        naamCel.innerText = 'Totaalprijs';
        prijsCel.innerText = '€' + (totaalPrijs.toFixed(2)).toString();
        buttonCel.innerText = '';
        totaalRow.appendChild(idCel);
        totaalRow.appendChild(naamCel);
        totaalRow.appendChild(prijsCel);
        totaalRow.appendChild(buttonCel);
        deleteResults.appendChild(totaalRow);
        updateNavbar();
        showToast('Verwijderd', deleted[0].naam, 'success');
        if (mandje.artikelen.length === 0) {
            console.log('Geen artikelen meer');
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
            document.getElementById('results-table-body')
                .appendChild(tableRow);
        }
    } else {
        console.log('Er ging iets mis, maar weet nog niet wat');
    }
}

function createRow(artikel, i, klant) {
    const createResults = document.getElementById('results-table-body');
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
    idCel.innerText = artikel.id;
    naamCel.innerText = artikel.naam;
    prijsCel.innerText = '€' + artikel.prijs;
    buttonCel.appendChild(deleteBtn);
    tableRow.appendChild(idCel);
    tableRow.appendChild(naamCel);
    tableRow.appendChild(prijsCel);
    tableRow.appendChild(buttonCel);
    createResults.appendChild(tableRow);
}

export function populateResults() {
    const mandjes = getMandjes();
    const popResults = document.getElementById('results-table-body');
    const rows = document.querySelectorAll('#results-table-body tr');
    if (rows.length) {
        rows.forEach((node) => {
            node.remove();
        });
    }
    const klant = getLiveKlant().naam;
    if (mandjes[klant] && mandjes[klant].artikelen.length) {
        const artikelen = mandjes[klant].artikelen;
        let totaalPrijs = 0;
        for (let i = 0; i < artikelen.length; i++) {
            createRow(artikelen[i], i, klant);
            totaalPrijs += parseFloat(artikelen[i].prijs);
        }
        const totaalRow = document.createElement('tr');
        totaalRow.id='totaal';
        const idCel = document.createElement('td');
        const naamCel = document.createElement('td');
        const prijsCel = document.createElement('td');
        const buttonCel = document.createElement('td');
        idCel.innerText = '';
        naamCel.innerText = 'Totaalprijs';
        prijsCel.innerText = '€' + (totaalPrijs.toFixed(2)).toString();
        buttonCel.innerText = '';
        totaalRow.appendChild(idCel);
        totaalRow.appendChild(naamCel);
        totaalRow.appendChild(prijsCel);
        totaalRow.appendChild(buttonCel);
        popResults.appendChild(totaalRow);
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
        popResults.appendChild(tableRow);
    }
}

function deleteBericht(event) {
    event.preventDefault();
    let berichten = getBerichten();
    let nodes = document.querySelectorAll('#berichten-lijst .bericht');
    const berichtIndex = event.target.dataset.index;
    const deleted = berichten.splice(berichtIndex, 1);
    for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].dataset.index === berichtIndex) {
            nodes[i].remove();
        }
    }
    if (deleted[0]) {
        nodes = document.querySelectorAll('#berichten-lijst .bericht');
        const links = document.querySelectorAll('#berichten-lijst .delete-link');
        for (let i = nodes.length - 1; i >= 0; i--) {
            nodes[i].setAttribute('data-index', i);
            links[i].setAttribute('data-index', i);
        }
    }
    localStorage.setItem('berichten', JSON.stringify(berichten));
    if (berichten.length === 0) {
        const berichtenLijst = document.getElementById('berichten-lijst');
        const noMsg = document.createElement('div');
        const msgEl = document.createElement('h4');
        msgEl.innerText = 'Er zijn nog geen berichten van klanten';
        noMsg.appendChild(msgEl);
        berichtenLijst.appendChild(noMsg);
    }
    showToast('Verwijderd', 'Het bericht is verwijderd', 'success');
}

function createBericht(bericht, i) {
    const live_klant = getLiveKlant();
    const berichtenLijst = document.getElementById('berichten-lijst');
    const berichtDiv = document.createElement('div');
    berichtDiv.setAttribute('data-index', i);
    berichtDiv.style.backgroundColor = '#FFFEE0';
    berichtDiv.style.padding = '15px';
    berichtDiv.style.marginBottom = '15px';
    berichtDiv.style.borderRadius = '8px';
    berichtDiv.style.border = '1px solid gray';
    berichtDiv.classList.add('bericht');
    berichtDiv.classList.add('uk-box-shadow-medium');
    const headerDiv = document.createElement('div');
    headerDiv.classList.add('uk-grid');

    const nickDiv = document.createElement('div');
    nickDiv.classList.add('uk-width-1-2');
    const nickEl = document.createElement('p');
    nickEl.innerText = bericht.nickname;
    nickDiv.appendChild(nickEl);
    headerDiv.appendChild(nickDiv);

    const dtDiv = document.createElement('div');
    dtDiv.classList.add('uk-width-1-2');
    const dtEl = document.createElement('p');
    dtEl.innerText = bericht.date + ' ' + bericht.time;
    dtDiv.appendChild(dtEl);
    headerDiv.appendChild(dtDiv);

    berichtDiv.appendChild(headerDiv);

    const titelDiv = document.createElement('div');
    const titelEl = document.createElement('h4');
    titelEl.innerText = bericht.titel;
    titelDiv.appendChild(titelEl);
    berichtDiv.appendChild(titelDiv);

    const textDiv = document.createElement('div');
    const textEl = document.createElement('p');
    textEl.innerText = bericht.text;
    textDiv.appendChild(textEl);

    berichtDiv.appendChild(textDiv);

    if (live_klant.admin) {
        const adminDiv = document.createElement('div');
        const adminLink = document.createElement('a');
        adminLink.classList.add('delete-link');
        adminLink.href = '';
        adminLink.innerText = 'Verwijder bericht';
        adminLink.setAttribute('data-index', i);
        adminDiv.appendChild(adminLink);
        adminLink.addEventListener('click', deleteBericht);

        berichtDiv.appendChild(adminDiv);
    }

    berichtenLijst.appendChild(berichtDiv);
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
        document.getElementById('input-titel').value = '';
        document.getElementById('input-bericht').value = '';
        document.getElementById('berichten-lijst').innerHTML = '';
        listBerichten();
        showMessage('Bericht geplaatst', 'Bedankt voor het plaatsen van een bericht', 'success');
    }
}

export function listBerichten () {
    const berichtenLijst = document.getElementById('berichten-lijst');
    const berichten = getBerichten();
    if (berichten.length) {
        for (let i = berichten.length - 1; i >= 0; i--) {
            createBericht(berichten[i], i);
        }
    } else {
        const noMsg = document.createElement('div');
        const msgEl = document.createElement('h4');
        msgEl.innerText = 'Er zijn nog geen berichten van klanten';
        noMsg.appendChild(msgEl);
        berichtenLijst.appendChild(noMsg);
    }
}
