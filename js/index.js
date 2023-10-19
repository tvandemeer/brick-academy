import { getKlanten, getMandjes, getLiveKlant } from "./storageItems.js";
import { buildPage } from "./createPartsList.js";
import { updateNavbar } from "./navbar.js";
import { showMessage } from "./notify.js";

let klanten = getKlanten();
let mandjes = getMandjes();
let live_klant = getLiveKlant();

updateNavbar();

let page = sessionStorage.getItem('productPage');

if (!page) {
    page = 1;
}

const page_size = 20;

window.onload = (event) => {
    buildPage(page, page_size);
}

