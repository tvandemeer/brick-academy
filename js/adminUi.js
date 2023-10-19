const Swal = window.Swal;
import { getKlanten, getMandjes, getLiveKlant, getCustomArtikelen, getEditableCustomArtikelen } from "./storageItems.js";
import { confirmDeleteKlant, confirmDeleteMandje, showMessage, showToast } from "./notify.js";
import { updateNavbar } from "./navbar.js";
import { Artikel } from "./classes.js";

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
        confirmDeleteMandje(klant, 'Weet je het zeker?', 'De actie kan niet ongedaan gemaakt worden', 'warning');
    } else {
        showMessage('Geen mandje', 'Deze klant heeft geen mandje', 'error');
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

export function createCustomArtikel(event) {
    let customArtikelen = getCustomArtikelen();
    let editableCustomArtikelen = getEditableCustomArtikelen();
    const artikelID = document.getElementById('custom-id').value;
    const artikelNaam = document.getElementById('custom-naam').value;
    const artikelPrijs = parseFloat(document.getElementById('custom-prijs').value);
    if (artikelID && artikelNaam && artikelPrijs) {
        const artikel = new Artikel(artikelID, artikelNaam, artikelPrijs);
        customArtikelen.push(artikel);
        editableCustomArtikelen.push(artikel);
        localStorage.setItem('customArtikelen', JSON.stringify(customArtikelen));
        localStorage.setItem('editableCustomArtikelen', JSON.stringify(editableCustomArtikelen));
    }
    document.getElementById('custom-id').value = '';
    document.getElementById('custom-naam').value = '';
    document.getElementById('custom-prijs').value = '';
    populateCustom();
}

function deleteCustomArtikel(event) {
    const index = parseInt(event.target.dataset.index);
    let customArtikelen = getCustomArtikelen();
    let editableCustomArtikelen = getEditableCustomArtikelen();
    const deleted = customArtikelen.splice(index, 1);
    const deleted2 = editableCustomArtikelen.splice(index, 1);
    localStorage.setItem('customArtikelen', JSON.stringify(customArtikelen));
    localStorage.setItem('editableCustomArtikelen', JSON.stringify(editableCustomArtikelen));
    populateCustom();
}

function editCustomArtikel(event) {
    let editableCustomArtikelen = getEditableCustomArtikelen();
    const part_id = event.target.dataset.artikel;
    const row = event.target.parentElement.parentElement;
    const naam = row.querySelector('input.naam').value;
    const prijs = parseFloat(row.querySelector('input.prijs').value);
    editableCustomArtikelen.forEach((artikel) => {
        if (artikel['id'] === part_id) {
            artikel['naam'] = naam;
            artikel['prijs'] = prijs;
            localStorage.setItem('editableCustomArtikelen', JSON.stringify(editableCustomArtikelen));
        }
    });
    window.location.reload();
}

function resetCustomArtikel(event) {
    const customArtikelen = getCustomArtikelen();
    let editableCustomArtikelen = getEditableCustomArtikelen();
    const artikel_id = event.target.dataset.artikel;
    let artIndex;
    for (let i = 0; i < editableCustomArtikelen.length; i++) {
        if (editableCustomArtikelen[i]['id'] === artikel_id) {
            artIndex = i;
        }
    }
    for (let i = 0; i < customArtikelen.length; i++) {
        if (customArtikelen[i]['id'] === artikel_id) {
            editableCustomArtikelen[artIndex] = customArtikelen[i];
            localStorage.setItem('editableCustomArtikelen', JSON.stringify(editableCustomArtikelen));
        }
    }
    populateCustom();
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
    deleteBtn.innerHTML = '&times;';
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

function populateResults(event) {
    const mandjes = getMandjes();
    const rows = document.querySelectorAll('#results-table-body tr');
    if (rows.length) {
        rows.forEach((node) => {
            node.remove();
        });
    }
    const klant = event.target.value;
    if (klant != 'selecteer klant ...') {
        if (mandjes[klant] && mandjes[klant].artikelen.length > 0) {
            document.getElementById('delete-mandje-btn')
                .style.backgroundColor = '#F0506E';
            const artikelen = mandjes[klant].artikelen;
            let totaalPrijs = 0;
            for (let i = 0; i < artikelen.length; i++) {

                createRow(artikelen[i], i, klant);
                totaalPrijs += parseFloat(artikelen[i].prijs);

            }
            const populateResults = document.getElementById('results-table-body');
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
            populateResults.appendChild(totaalRow);
        } else if (mandjes[klant] && mandjes[klant].artikelen.length === 0) {
            const noArtResults = document.getElementById('results-table-body');
            document.getElementById('delete-mandje-btn')
                .style.backgroundColor = '#F0506E';
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
            noArtResults.appendChild(tableRow);
        } else {
            const noMandjeResults = document.getElementById('results-table-body');
            const tableRow = document.createElement('tr');
            const idCel = document.createElement('td');
            const naamCel = document.createElement('td');
            const prijsCel = document.createElement('td');
            idCel.innerText = '---';
            naamCel.innerText = 'Deze klant heeft geen mandje';
            prijsCel.innerText = '---';
            tableRow.appendChild(idCel);
            tableRow.appendChild(naamCel);
            tableRow.appendChild(prijsCel);
            noMandjeesults.appendChild(tableRow);
            document.getElementById('delete-mandje-btn')
                .style.backgroundColor = '#888';
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

export function populateCustom() {
    const customTableBody = document.getElementById('custom-table-body');
    const rows = document.querySelectorAll('#custom-table-body tr');
    if (rows.length) {
        rows.forEach((row) => {
            row.remove();
        });
    }
    const customArtikelen = getEditableCustomArtikelen();
    if (customArtikelen.length) {
        for (let i = 0; i < customArtikelen.length; i++) {
            const bodyRow = document.createElement('tr');
            const idCel = document.createElement('td');
            const naamCel = document.createElement('td');
            const prijsCel = document.createElement('td');
            const editCel = document.createElement('td');
            const resetCel = document.createElement('td');
            const buttonCel = document.createElement('td');
            const editBtn = document.createElement('button');
            const resetBtn = document.createElement('button');
            const deleteBtn = document.createElement('button');
            const naamEdit = document.createElement('input');
            const prijsEdit = document.createElement('input');
            naamEdit.type = "text";
            naamEdit.name = "naam";
            naamEdit.value = customArtikelen[i].naam;
            naamEdit.classList.add('naam');
            naamCel.appendChild(naamEdit);
            prijsEdit.type = "text";
            prijsEdit.name = "prijs";
            prijsEdit.value = customArtikelen[i].prijs;
            prijsEdit.classList.add('prijs');
            prijsCel.appendChild(prijsEdit);
            editBtn.classList.add('uk-button');
            editBtn.classList.add('uk-button-primary');
            editBtn.classList.add('uk-button-small');
            editBtn.type = 'button';
            editBtn.innerText = 'Save';
            editBtn.setAttribute('data-artikel', customArtikelen[i].id);
            editBtn.addEventListener('click', editCustomArtikel);
            resetBtn.classList.add('uk-button');
            resetBtn.classList.add('uk-button-primary');
            resetBtn.classList.add('uk-button-small');
            resetBtn.type = 'button';
            resetBtn.innerText = 'Reset';
            resetBtn.setAttribute('data-artikel', customArtikelen[i].id);
            resetBtn.addEventListener('click', resetCustomArtikel);
            deleteBtn.classList.add('uk-button');
            deleteBtn.classList.add('uk-button-danger');
            deleteBtn.classList.add('uk-button-small');
            deleteBtn.type = 'button';
            deleteBtn.innerHTML = '&times;';
            deleteBtn.setAttribute('data-index', i);
            deleteBtn.addEventListener('click', deleteCustomArtikel);
            editCel.appendChild(editBtn);
            resetCel.appendChild(resetBtn);
            buttonCel.appendChild(deleteBtn);
            idCel.innerText = customArtikelen[i].id;
            bodyRow.appendChild(idCel);
            bodyRow.appendChild(naamCel);
            bodyRow.appendChild(prijsCel);
            bodyRow.appendChild(editCel);
            bodyRow.appendChild(resetCel);
            bodyRow.appendChild(buttonCel);
            customTableBody.appendChild(bodyRow);
        }
    }
}
