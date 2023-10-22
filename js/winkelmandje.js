import { updateNavbar } from "./navbar.js";
import { populateResults } from "./klantUi.js";
import { getMandjes, getBestellingen } from "./storageItems.js";

updateNavbar();

populateResults();

document.getElementById('bestel').addEventListener('click', () => {
    let mandjes = getMandjes();
    let bestellingen = getBestellingen();
    const bestelling = mandjes[JSON.parse(sessionStorage.getItem("live_klant"))["naam"]];
    bestellingen.push(bestelling);
    localStorage.setItem('bestellingen', JSON.stringify(bestellingen));
    mandjes[JSON.parse(sessionStorage.getItem("live_klant"))["naam"]].artikelen = [];
    localStorage.setItem("mandjes", JSON.stringify(mandjes));
    const cells = document.querySelectorAll('td');
    const prijs = cells[cells.length - 2].innerText;
    alert(`Totaalbedrag: ${prijs}\nBedankt voor je bestelling!`);
    populateResults();
});
