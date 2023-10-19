import { updateNavbar } from "./navbar.js";
import { getMandjes } from "./storageItems.js";

let mandjes = getMandjes();

const tableBody = document.getElementById('bestellingen');

for (const key in mandjes) {
    console.log(mandjes[key]['artikelen']);
    for (let i = 0; i < mandjes[key]['artikelen'].length; i++) {
        const row = document.createElement('tr');
        const klantCel = document.createElement('td');
        klantCel.innerText = key;
        const idCel = document.createElement('td');
        idCel.innerText = mandjes[key]['artikelen'][i]['id'];
        const naamCel = document.createElement('td');
        naamCel.innerText = mandjes[key]['artikelen'][i]['naam'];
        const prijsCel = document.createElement('td');
        prijsCel.innerText = mandjes[key]['artikelen'][i]['prijs'];
        row.appendChild(klantCel);
        row.appendChild(idCel);
        row.appendChild(naamCel);
        row.appendChild(prijsCel);
        tableBody.appendChild(row);
    }
}
