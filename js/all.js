import { updateNavbar } from './navbar.js';
import { getLiveKlant } from './storageItems.js';
import { showMessage } from './notify.js';
import { populateSelect } from './adminUi.js';

updateNavbar();

const live_klant = getLiveKlant();

if (!live_klant) {
  showMessage('Niet ingelogd', 'Je moet ingelogd zijn als admin!', 'warning');
} else if (live_klant && !live_klant.admin) {
  showMessage('Geen admin', 'Je hebt geen admin rechten!', 'error');
} else if (live_klant && live_klant.admin) {
  if (!JSON.parse(sessionStorage.getItem('admin-greet'))) {
    sessionStorage.setItem('admin-greet', 1);
    showMessage(`Welkom ${live_klant.naam}!`, 'Gebruik je admin rechten met zorg :)', 'success');
  }

  populateSelect();
}

import { getKlanten, getMandjes } from './storageItems.js';
import { confirmDeleteKlant, confirmDeleteMandje, showToast } from './notify.js';
import { updateNavbar } from './navbar.js';

const { Swal } = window;

function deleteKlant(event) {
  const { klant } = event.target.dataset;
  confirmDeleteKlant(klant, 'Weet je het zeker?', 'De actie kan niet ongedaan gemaakt worden', 'warning');
}

function deleteMandje(event) {
  const { klant } = event.target.dataset;
  const mandjes = getMandjes();
  if (mandjes[klant]) {
    console.log(`Verwijder mandje van ${klant}`);
  } else {
    console.log('Klant heeft geen mandje');
  }
}

function deleteArtikel(event) {
  const { klant } = event.target.dataset;
  const index = parseInt(event.target.dataset.index);
  const mandjes = getMandjes();
  const mandje = mandjes[klant];
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
      const { artikelen } = mandjes[klant];
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

export class Klant {
  constructor(naam, admin) {
    this.naam = naam;
    this.admin = admin;
  }
}

export class Mandje {
  constructor(klant) {
    this.klant = klant;
    this.artikelen = [];
  }
}

export class Artikel {
  constructor(id, naam, prijs) {
    this.id = id;
    this.naam = naam;
    this.prijs = prijs;
  }
}

import { updateNavbar } from './navbar.js';

updateNavbar();

import { getLiveKlant, getMandjes } from './storageItems.js';
import { Mandje, Artikel } from './classes.js';
import { showMessage } from './notify.js';

async function getParts(page, page_size) {
  const url = `https://rebrickable.com/api/v3/lego/parts/?page=${page}&page_size=${page_size}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: 'key bc4537b496eaab6056e0ce49fb54bc55',
    },
  });
  return response.json();
}

export function buildPage(pageNum, pageSize) {
  getParts(pageNum, pageSize)
    .then((data) => {
      const wraps = document.querySelectorAll('.part_wrap');
      const navDiv = document.getElementById('pages_nav_div');
      if (wraps) {
        wraps.forEach((wrap) => {
          wrap.remove();
        });
      }
      if (navDiv) {
        navDiv.remove();
      }
      createPartsList(data);
      pageNavListeners();
      addCartListeners();
    });
}

function createPartEl(part_num, name, img_url, part_url) {
  const wrapDiv = document.createElement('div');
  const partDiv = document.createElement('div');
  const imgDiv = document.createElement('div');
  const bodyDiv = document.createElement('div');
  const nameEl = document.createElement('p');
  const priceDiv = document.createElement('div');
  priceDiv.classList.add('uk-width-1-2');
  const buyDiv = document.createElement('div');
  buyDiv.classList.add('uk-width-1-2');
  const priceEl = document.createElement('p');
  priceEl.classList.add('price');
  const imgEl = document.createElement('img');
  const detailsDiv = document.createElement('div');
  detailsDiv.classList.add('uk-margin-bottom');
  const bottomDiv = document.createElement('div');
  bottomDiv.classList.add('uk-grid');
  bottomDiv.classList.add('uk-position-bottom');
  bottomDiv.style.left = '20px';
  const addLink = document.createElement('a');
  const cartIcon = document.createElement('span');
  const detailLink = document.createElement('a');
  cartIcon.setAttribute('uk-icon', 'icon: cart; ratio: 2');
  buyDiv.appendChild(cartIcon);
  imgEl.id = part_num;
  if (img_url) {
    imgEl.src = img_url;
  } else {
    imgEl.src = 'img/geen_afbeelding.jpg';
  }
  wrapDiv.classList.add('part_wrap');
  partDiv.classList.add('uk-card');
  partDiv.classList.add('uk-card-default');
  partDiv.classList.add('animate__animated');
  partDiv.classList.add('animate__fadeIn');
  partDiv.classList.add('animate__slow');
  imgDiv.classList.add('uk-card-media-top');
  bodyDiv.classList.add('uk-card-body');
  nameEl.classList.add('uk-card-title');
  imgDiv.appendChild(imgEl);
  partDiv.appendChild(imgDiv);
  nameEl.innerText = name;
  detailLink.classList.add('uk-button');
  detailLink.classList.add('uk-button-default');
  detailLink.classList.add('uk-button-small');
  detailLink.classList.add('part-detail');
  detailLink.href = part_url;
  detailLink.setAttribute('target', '_blank');
  detailLink.innerText = 'details';
  detailLink.type = 'button';
  const prijs = (Math.random() * 5).toFixed(2);
  priceEl.innerText = `€${prijs.toString()}`;
  priceDiv.appendChild(priceEl);
  bottomDiv.appendChild(priceDiv);
  addLink.href = '';
  addLink.innerText = '+';
  addLink.type = 'button';
  addLink.setAttribute('data-part', part_num);
  addLink.setAttribute('data-naam', name);
  addLink.setAttribute('data-prijs', prijs);
  addLink.classList.add('uk-button');
  addLink.classList.add('uk-button-primary');
  addLink.classList.add('add-button');
  addLink.classList.add('uk-button-small');
  buyDiv.appendChild(addLink);
  bottomDiv.appendChild(buyDiv);
  bodyDiv.appendChild(nameEl);
  detailsDiv.appendChild(detailLink);
  bodyDiv.appendChild(detailsDiv);
  bodyDiv.appendChild(bottomDiv);
  partDiv.appendChild(bodyDiv);
  wrapDiv.appendChild(partDiv);
  parts_list.appendChild(wrapDiv);
}

function addCartListeners() {
  const live_klant = getLiveKlant();
  const addButtons = document.querySelectorAll('.add-button');
  addButtons.forEach((btn) => {
    btn.addEventListener('click', ((event) => {
      event.preventDefault();
      if (live_klant) {
        const badges = document.querySelectorAll('span.badge-count');
        const mandjes = getMandjes();
        const part_num = event.target.dataset.part;
        const { naam } = event.target.dataset;
        const { prijs } = event.target.dataset;
        const artikel = new Artikel(part_num, naam, prijs);
        if (mandjes[live_klant.naam]) {
          mandjes[live_klant.naam].artikelen.push(artikel);
          localStorage.setItem('mandjes', JSON.stringify(mandjes));
        } else {
          const mandje = new Mandje(live_klant);
          mandje.artikelen.push(artikel);
          mandjes[live_klant.naam] = mandje;
          localStorage.setItem('mandjes', JSON.stringify(mandjes));
        }
        badges.forEach((badge) => {
          badge.innerText = mandjes[live_klant.naam].artikelen.length;
        });
      } else {
        showMessage(
          'Niet ingelogd',
          'Je moet ingelogd zijn om artikelen aan je mandje toe te kunnen voegen',
          'warning',
        );
      }
    }));
  });
}

export function getPage(pageUrl) {
  let page = '1';
  const hrefSplit = pageUrl.split('&');
  let page_size = 20;
  if (!hrefSplit[1] && page === '2') {
    page = '1';
  } else if (!hrefSplit[1]) {
    page = '1';
  } else {
    page = hrefSplit[0].split('=')[1];
    page_size = hrefSplit[1].split('=')[1];
  }
  sessionStorage.setItem('productPage', page);
  return [page, page_size];
}

export function pageNavListeners() {
  const links = document.querySelectorAll('.pages-nav');
  links.forEach((link) => {
    link.addEventListener('click', ((event) => {
      event.preventDefault();
      const page = getPage(event.target.href);
      window.scrollTo(0, 0);
      buildPage(page[0], page[1]);
    }));
  });
}

export function createPartsList(data) {
  data.results.forEach((item) => {
    createPartEl(item.part_num, item.name, item.part_img_url, item.part_url);
  });
  const link_prev = data.previous;
  const link_next = data.next;
  const pagesNav = document.createElement('div');
  pagesNav.id = 'pages_nav_div';
  pagesNav.classList.add('uk-container');
  pagesNav.classList.add('uk-flex');
  pagesNav.classList.add('uk-flex-between');
  pagesNav.classList.add('uk-margin-top');
  pagesNav.classList.add('uk-margin-bottom');

  const prevDiv = document.createElement('div');
  const prevLink = document.createElement('a');
  const prevIcon = document.createElement('span');
  prevLink.classList.add('uk-button');
  prevLink.classList.add('uk-button-default');
  prevLink.classList.add('pages-nav');
  prevLink.type = 'button';
  if (link_prev) {
    prevLink.href = link_prev;
  } else {
    prevLink.href = '#';
    prevLink.style.color = '#999999';
    prevLink.style.cursor = 'not-allowed';
  }
  prevIcon.setAttribute('uk-icon', 'icon: chevron-left');
  prevLink.innerText = 'vorige';
  prevDiv.appendChild(prevIcon);
  prevDiv.appendChild(prevLink);
  pagesNav.appendChild(prevDiv);

  const nextDiv = document.createElement('div');
  const nextLink = document.createElement('a');
  const nextIcon = document.createElement('span');
  nextLink.classList.add('uk-button');
  nextLink.classList.add('uk-button-default');
  nextLink.classList.add('pages-nav');
  nextLink.type = 'button';
  if (link_next) {
    nextLink.href = link_next;
  } else {
    nextLink.href = '#';
    nextLink.style.color = '#999999';
    nextLink.style.cursor = 'not-allowed';
  }
  nextIcon.setAttribute('uk-icon', 'icon: chevron-right');
  nextLink.innerText = 'volgende';
  nextDiv.appendChild(nextLink);
  nextDiv.appendChild(nextIcon);
  pagesNav.appendChild(nextDiv);

  document.body.appendChild(pagesNav);
}

import { getKlanten, getMandjes, getLiveKlant } from './storageItems.js';
import { buildPage } from './createPartsList.js';
import { updateNavbar } from './navbar.js';
import { showMessage } from './notify.js';

const klanten = getKlanten();
const mandjes = getMandjes();
const live_klant = getLiveKlant();

updateNavbar();

let page = sessionStorage.getItem('productPage');

if (!page) {
  page = 1;
}

const page_size = 20;

window.onload = (event) => {
  buildPage(page, page_size);
};

import { getLiveKlant } from './storageItems.js';
import { updateNavbar } from './navbar.js';
import { showMessage } from './notify.js';
import { klantLogin } from './statusChange.js';

const live_klant = getLiveKlant();

updateNavbar();

const loginButton = document.getElementById('button-login');
loginButton.addEventListener('click', (event) => {
  event.preventDefault();
  const naam = document.getElementById('input-naam').value;
  if (naam) {
    const loginCode = klantLogin(naam);
    if (loginCode === 1) {
      updateNavbar();
      showMessage(`Welkom terug, ${naam}!`, 'Je bent ingelogd', 'success');
    } else if (loginCode === 2) {
      showMessage('Al ingelogd', 'Je bent al ingelogd!', 'info');
    } else if (loginCode === 3) {
      showMessage('Actieve login', 'Er is al iemand ingelogd', 'info');
    } else if (loginCode === 4) {
      updateNavbar();
      showMessage(`Welkom ${naam}!`, 'Je bent ingelogd', 'success');
    }
  } else {
    showMessage('Naam vereist', 'Vul een naam in!', 'warning');
  }
});

import { updateNavbar } from './navbar.js';
import { showMessage } from './notify.js';

if (sessionStorage.getItem('live_klant')) {
  sessionStorage.removeItem('live_klant');
  sessionStorage.removeItem('login-greet');
  if (sessionStorage.getItem('admin-greet')) {
    sessionStorage.removeItem('admin-greet');
  }

  updateNavbar();

  showMessage('Je bent uitgelogd', 'Tot ziens!', 'success');

  const byeDiv = document.getElementById('bye');
  byeDiv.classList.add('uk-width-1-1@s');
  byeDiv.classList.add('uk-width-1-2@m');
  byeDiv.classList.add('uk-width-1-2@l');

  const byeImg = document.createElement('img');
  byeImg.src = '../img/tot_ziens.png';
  byeImg.classList.add('animate__animated');
  byeImg.classList.add('animate__rotateIn');

  byeDiv.appendChild(byeImg);
}

import { getLiveKlant, getMandjes } from './storageItems.js';

export function updateNavbar() {
  const curPage = window.location.pathname;
  const live_klant = getLiveKlant();
  const mandjes = getMandjes();

  switch (curPage) {
    case '/index.html':
      const indexLinks = document.querySelectorAll('.link-index');
      indexLinks.forEach((link) => {
        link.classList.add('uk-active');
      });
      break;
    case '/':
      const rootLinks = document.querySelectorAll('.link-index');
      rootLinks.forEach((link) => {
        link.classList.add('uk-active');
      });
      break;
    case '/contact.html':
      const contactLinks = document.querySelectorAll('.link-contact');
      contactLinks.forEach((link) => {
        link.classList.add('uk-active');
      });
      break;
    case '/winkelmandje.html':
      const winkelmandjeLinks = document.querySelectorAll('.link-winkelmandje');
      winkelmandjeLinks.forEach((link) => {
        link.classList.add('uk-active');
      });
      break;
    case '/login.html':
      const loginLinks = document.querySelectorAll('.link-user');
      loginLinks.forEach((link) => {
        link.classList.add('uk-active');
      });
      break;
  }

  const navLogInLinks = document.querySelectorAll('.user-login');
  const navLogOutLinks = document.querySelectorAll('.user-logout');
  const navAdminLinks = document.querySelectorAll('.user-admin');
  const badges = document.querySelectorAll('span.badge-count');

  if (live_klant) {
    navLogInLinks.forEach((link) => {
      link.classList.add('uk-hidden');
    });

    navLogOutLinks.forEach((link) => {
      link.classList.remove('uk-hidden');
    });
    document.querySelectorAll('.link-user').forEach((link) => {
      link.style.color = '#0F7AE5';
    });
    if (live_klant.admin) {
      navAdminLinks.forEach((link) => {
        link.classList.remove('uk-hidden');
      });
      document.querySelectorAll('.link-admin').forEach((link) => {
        link.style.color = 'red';
      });
    }
    if (mandjes[live_klant.naam]) {
      badges.forEach((badge) => {
        badge.innerText = mandjes[live_klant.naam].artikelen.length;
      });
    }
  }

  document.querySelectorAll('a[href="logout.html"]').forEach((link) => {
    link.style.color = 'red';
  });
}

import { getKlanten, getMandjes } from './storageItems.js';
import { populateSelect } from './adminUi.js';

const { Swal } = window;

export function showMessage(msgTitle, msgText, msgIcon) {
  Swal.fire({
    title: msgTitle,
    text: msgText,
    icon: msgIcon,
    timer: 1500,
    timerProgressBar: true,
    showConfirmButton: false,
  });
}

export function confirmDeleteKlant(klant, msgTitle, msgText, msgIcon) {
  const klanten = getKlanten();
  const mandjes = getMandjes();
  Swal.fire({
    title: msgTitle,
    text: msgText,
    icon: msgIcon,
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Verwijderen',
  }).then((result) => {
    if (result.isConfirmed) {
      delete klanten[klant];
      localStorage.setItem('klanten', JSON.stringify(klanten));
      if (mandjes[klant]) {
        delete mandjes[klant];
        localStorage.setItem('mandjes', JSON.stringify(mandjes));
      }
      populateSelect();
      Swal.fire(
        'Klant verwijderd!',
        'Klant en mandje zijn verwijderd uit de opslag',
        'success',
      );
    }
  });
}

export function confirmDeleteMandje(klant, msgTitle, msgText, msgIcon) {
  const mandjes = getMandjes();
  Swal.fire({
    title: msgTitle,
    text: msgText,
    icon: msgIcon,
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Verwijderen',
  }).then((result) => {
    if (result.isConfirmed) {
      if (mandjes[klant]) {
        delete mandjes[klant];
        localStorage.setItem('mandjes', JSON.stringify(mandjes));
      }
      populateSelect();
      Swal.fire(
        'Mandje verwijderd!',
        'Het mandje is verwijderd uit de opslag',
        'success',
      );
    }
  });
}

export function showToast(msgTitle, msgText, msgIcon) {
  Swal.fire({
    title: msgTitle,
    text: msgText,
    icon: msgIcon,
    timer: 1000,
    showConfirmButton: false,
    toast: true,
    showClass: {
      popup: 'animate__animated animate__fadeInDown',
    },
    hideClass: {
      popup: 'animate__animated animate__fadeOutUp',
    },
  });
}

import { getKlanten, getLiveKlant } from './storageItems.js';
import { Klant } from './classes.js';

export function klantLogin(naam) {
  const klanten = getKlanten();
  let live_klant = getLiveKlant();
  if (live_klant) {
    if (naam === live_klant.naam) {
      return 2;
    }
    return 3;
  }
  const admin = document.getElementById('check-admin').checked;
  if (klanten[naam]) {
    live_klant = klanten[naam];
    sessionStorage.setItem('live_klant', JSON.stringify(live_klant));
    document.getElementById('input-naam').value = '';
    document.getElementById('check-admin').checked = false;
    return 1;
  }
  const klant = new Klant(naam, admin);
  klanten[naam] = klant;
  localStorage.setItem('klanten', JSON.stringify(klanten));
  live_klant = klant;
  sessionStorage.setItem('live_klant', JSON.stringify(live_klant));
  return 4;
}

export function getKlanten() {
  let klanten = JSON.parse(localStorage.getItem('klanten'));
  if (!klanten) {
    klanten = {};
    localStorage.setItem('klanten', JSON.stringify(klanten));
  }

  return klanten;
}

export function getMandjes() {
  let mandjes = JSON.parse(localStorage.getItem('mandjes'));
  if (!mandjes) {
    mandjes = {};
    localStorage.setItem('mandjes', JSON.stringify(mandjes));
  }

  return mandjes;
}

export function getLiveKlant() {
  const live_klant = JSON.parse(sessionStorage.getItem('live_klant'));

  return live_klant;
}

import { updateNavbar } from './navbar.js';

updateNavbar();
