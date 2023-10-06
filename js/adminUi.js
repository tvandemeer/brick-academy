const Swal = window.Swal;
import { getKlanten, getMandjes, getLiveKlant } from "./storageItems.js";
import { confirmDeleteKlant, confirmDeleteMandje, showMessage, showToast } from "./notify.js";
import { updateNavbar } from "./navbar.js";

function deleteKlant(event) {
    const klant = event.target.dataset.klant;
    const live_klant = getLiveKlant();
    if (klant === live_klant.naam) {
        showMessage('Niet toegestaan!', 'Je kunt jezelf niet verwijderen', 'error');
    } else {
        confirmDeleteKlant(klant, 'Weet je het zeker?', 'De actie kan niet ongedaan gemaakt worden', 'warning');
    }
}

function deleteMandje(event) {
    const klant = event.target.dataset.klant;
    let mandjes = getMandjes();
    if (mandjes[klant]) {
        console.log('Verwijder mandje van ' + klant);
    } else {
        console.log('Klant heeft geen mandje');
    }
}

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

function populateResults(event) {
    const mandjes = getMandjes();
    const results = document.getElementById('results-table-body');
    const rows = document.querySelectorAll('#results-table-body tr');
    if (rows.length) {
        rows.forEach((node) => {
            node.remove();
        });
    }
    const klant = event.target.value;
    if (klant != 'selecteer klant ...') {
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
        document.getElementById('delete-klant-btn')
            .setAttribute('data-klant', klant);
        document.getElementById('delete-mandje-btn')
            .setAttribute('data-klant', klant);
    } else {
        console.log('geen klant geselecteerd');
    }
}

export function populateSelect() {
    const selectEl = document.getElementById('select-element');
    document.querySelectorAll('#select-element option')
        .forEach((opt) => {
            opt.remove();
        });
    const rows = document.querySelectorAll('#results-table-body tr');
    if (rows.length) {
        rows.forEach((row) => {
            row.remove();
        });
    }
    const klanten = getKlanten();
    const selectOpt = document.createElement('option');
    selectEl.appendChild(selectOpt);
    selectOpt.innerText = 'selecteer klant ...';
    for (const key in klanten) {
        const option = document.createElement('option');
        option.innerText = klanten[key].naam;
        selectEl.appendChild(option);
    }
    selectEl.addEventListener('change', populateResults);
    document.getElementById('delete-klant-btn')
        .addEventListener('click', deleteKlant);
    document.getElementById('delete-mandje-btn')
        .addEventListener('click', deleteMandje);
}
