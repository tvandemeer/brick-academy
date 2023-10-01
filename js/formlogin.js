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

// if (localStorage.getItem('klanten')) {
// let klanten = JSON.parse(localStorage.getItem('klanten'));
// console.log('klanten: ' + klanten);
// } else {
// console.log('geen klanten array in localStorage');
// }
// if (localStorage.getItem('winkelmandjes')) {
// let winkelmandjes = JSON.parse(localStorage.getItem('winkelmandjes'));
// console.log('winkelmandjes: ' + winkelmandjes);
// } else {
// console.log('geen winkemandjes array in localStorage');
// }
// if (localStorage.getItem('artikelen')) {
// let artikelen = JSON.parse(localStorage.getItem('artikelen'));
// console.log('artikelen: ' + artikelen);
// } else {
// console.log('geen artikelen array in localStorage');
// }

const loginButton = document.getElementById('button-login');
loginButton.addEventListener('click', (event) => {
  event.preventDefault();
  let klant;
  const naam = document.getElementById('input-naam').value;
  const admin = document.getElementById('check-admin').checked;
  // console.log('naam: ' + naam);
  // console.log('admin: ' + admin);
  if (naam) {
    // if (localStorage.getItem('klant_' + naam)) {
    if (localStorage.getItem('klanten')) {
      const klanten = JSON.parse(localStorage.getItem('klanten'));
      console.log(klanten);
      let existing = 0;
      klanten.forEach((item) => {
        if (item.naam === naam) {
          existing = 1;
          klant = item;
        }
      });
      console.log(existing);
      console.log(klant);
      if (existing) {

      } else {

      }
    }
  } else {
    console.log('geen naam');
  }

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
});

function createKlant(naam, is_admin) {
  const logged_in = true;
  // const klant = new Klant('klant_' + naam, naam, is_admin, logged_in);
  const klant = new Klant(naam, is_admin, logged_in);
  // localStorage.setItem(klant.klant_id, JSON.stringify(klant));
  console.log('klant created');
  return klant;
}

function createMandje(klant_id) {
  // mandje = new Mandje('mandje_' + naam, klant.klant_id);
  // console.log(mandje);
  // localStorage.setItem(mandje.mandje_id, JSON.stringify(mandje));
}
