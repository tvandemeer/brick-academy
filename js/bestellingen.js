import { updateNavbar } from "./navbar.js";
import { getMandjes } from "./storageItems.js";

updateNavbar();

let mandjes = getMandjes();

const tableBody = document.getElementById('bestellingen');

for (const key in mandjes) {
    for (let i = 0; i < mandjes[key]['artikelen'].length; i++) {
        const row = document.createElement('tr');
        const klantCel = document.createElement('td');
        klantCel.innerText = key;
        const idCel = document.createElement('td');
        idCel.innerText = mandjes[key]['artikelen'][i]['id'];
        const naamCel = document.createElement('td');
        naamCel.innerText = mandjes[key]['artikelen'][i]['naam'];
        const prijsCel = document.createElement('td');
        prijsCel.innerText = '€' + mandjes[key]['artikelen'][i]['prijs'];
        const buttonCel = document.createElement('td');
        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('uk-button');
        deleteBtn.classList.add('uk-button-danger');
        deleteBtn.classList.add('uk-button-small');
        deleteBtn.type = 'button';
        deleteBtn.innerHTML = '&times;';
        deleteBtn.setAttribute('data-user', key);
        deleteBtn.setAttribute('data-artikel', mandjes[key]['artikelen'][i]['id']);
        buttonCel.appendChild(deleteBtn);
        row.appendChild(klantCel);
        row.appendChild(idCel);
        row.appendChild(naamCel);
        row.appendChild(prijsCel);
        row.appendChild(buttonCel);
        tableBody.appendChild(row);
    }
}

const deleteButtons = document.querySelectorAll('button');
deleteButtons.forEach((button) => {
    button.addEventListener('click', deleteArtikel);
});

function deleteArtikel(event) {
    const mandjes = getMandjes();
    let mandjeKlant = mandjes[event.target.dataset.user];
    for (let i = 0; i < mandjeKlant['artikelen'].length; i++) {
        if (mandjeKlant['artikelen'][i]['id'] === event.target.dataset.artikel) {
            let deleted = mandjeKlant['artikelen'].splice(i, 1);
            mandjes[event.target.dataset.user] = mandjeKlant;
            localStorage.setItem('mandjes', JSON.stringify(mandjes));
            window.location.reload();
        }
    }
}
