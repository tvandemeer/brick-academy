class Klant {
  constructor(naam, admin, logged_in) {
    // this.klant_id = klant_id;
    this.naam = naam;
    this.admin = admin;
    this.logged_in = logged_in;
  }
}

class Mandje {
  constructor(mandje_id, klant_id) {
    this.mandje_id = mandje_id;
    this.klant_id = klant_id;
  }
}

function showMessage(msgTitle, msgText, msgIcon) {
  Swal.fire({
    title: msgTitle,
    text: msgText,
    icon: msgIcon,
    timer: 1500,
    timerProgressBar: true,
  });
}

if (!localStorage.getItem('klanten')) {
  const klanten = {};
  localStorage.setItem('klanten', JSON.stringify(klanten));
}

const loginButton = document.getElementById('button-login');
loginButton.addEventListener('click', (event) => {
  event.preventDefault();
  const naam = document.getElementById('input-naam').value;
  const admin = document.getElementById('check-admin').checked;
  if (naam) {
    if (localStorage.getItem('klanten')) {
      klanten = JSON.parse(localStorage.getItem('klanten'));
      console.log(klanten);
      if (klanten[naam]) {
        console.log('found');
        klanten[naam].admin = admin;
        localStorage.setItem('klanten', JSON.stringify(klanten));
        const live_klant = klanten[naam];
        sessionStorage.setItem('live_klant', JSON.stringify(live_klant));
        document.getElementById('input-naam').value = '';
        document.getElementById('check-admin').checked = false;
        showMessage(`Hallo ${naam}!`, 'Je bent ingelogd', 'success');
      } else {
        console.log('not found');
        const klant = new Klant(naam, admin);
        klanten[naam] = klant;
        localStorage.setItem('klanten', JSON.stringify(klanten));
        const live_klant = klant;
        sessionStorage.setItem('live_klant', JSON.stringify(live_klant));
      }
    }
  } else {
    console.log('geen naam');
    showMessage('Naam vereist!', 'Vul een naam in', 'warning');
  }
});
// let klant;
// let naam = document.getElementById('input-naam').value;
// let admin = document.getElementById('check-admin').checked;
// if (naam) {
// if (!localStorage.getItem('klanten')) {
// localStorage.setItem('klanten', JSON.stringify([]));
// }
// if (localStorage.getItem('klanten')) {
// let klanten = JSON.parse(localStorage.getItem('klanten'));
// console.log(klanten);
// if (klanten[naam]) {
// console.log('klant gevonden in localStorage');
// } else {
// console.log('klant niet in localStorage');
// klant = createKlant(naam, admin);
// console.log(klant);
// klanten[naam] = JSON.stringify(klant);
// console.log(klanten);
// localStorage.setItem('klanten', klanten);
// }
// let existing = 0;
// klanten.forEach((item) => {
// if (item.naam === naam) {
// existing = 1;
// klant = item;
// }
// });
// console.log(existing);
// console.log(klant);
// if (existing) {

// } else {

// }
// } else {
// let klanten = [];
// localStorage.setItem('klanten', JSON.stringify(klanten));
// }

// } else {
// console.log('geen naam');
// }

// if (klanten[naam]) {
// let klant = JSON.parse(localStorage.getItem('klant_' + naam));
// console.log(klanten[naam]);
// klanten[naam].admin = admin;
// klanten[naam].logged_in = true;
// let klant = klanten[naam];
// klant.admin = admin;
// klant.logged_in = true;
// localStorage.setItem(klant.klant_id, JSON.stringify(klant));
// localStorage.setItem('klanten', JSON.stringify(klanten));
// let live_klant = klant;
// sessionStorage.setItem('live_klant', JSON.stringify(live_klant));
// console.log('klant gevonden in localStorage');
// } else {
// let klant = createKlant(naam, admin);
// klanten.push(klant);
// localStorage.setItem('klanten', JSON.stringify(klanten));
// let live_klant = klant;
// sessionStorage.setItem('live_klant', JSON.stringify(live_klant));
// }
// } else {
// let klanten = [];
// let klant = createKlant(naam, admin);
// klanten.push(klant);
// localStorage.setItem('klanten', JSON.stringify(klanten));
// console.log(klant);
// let live_klant = klant;
// sessionStorage.setItem('live_klant', JSON.stringify(live_klant));
// }
// Swal.fire({
// title: "Hallo " + naam + "!",
// icon: "success",
// text: "je bent ingelogd",
// timer: 2000,
// timerProgressBar: true
// });
// const userLinks = document.querySelectorAll('.link-user');
// userLinks.forEach((link) => {
// link.style.color = "#0F7AE5";
// });
// } else {
// Swal.fire({
// title: "Vul een naam in",
// icon: "warning",
// timer: 1500,
// timerProgressBar: true
// });
// }
// });

function createKlant(naam, is_admin) {
  const logged_in = true;
  const klant = new Klant(naam, is_admin, logged_in);
  // localStorage.setItem(klant.klant_id, JSON.stringify(klant));
  console.log('klant created');
  return klant;
}

// function createMandje(klant_id) {
// mandje = new Mandje('mandje_' + naam, klant.klant_id);
// console.log(mandje);
// localStorage.setItem(mandje.mandje_id, JSON.stringify(mandje));
// }
