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
    showConfirmButton: false,
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
        const userLinks = document.querySelectorAll('.link-user');
        userLinks.forEach((link) => {
          link.style.color = '#0F7AE5';
        });
        if (live_klant.admin) {
          const adminLinks = document.querySelectorAll('.link-admin');
          adminLinks.forEach((link) => {
            link.style.color = 'red';
          });
        }
        const logInUitLinks = document.querySelectorAll('[href="login.html"]');
        logInUitLinks.forEach((link) => {
          link.innerText = 'Log uit';
          link.style.color = 'red';
          link.addEventListener('click', ((event) => {
            sessionStorage.removeItem('live_klant');
            showMessage('Je bent uitgelogd', 'Tot ziens!', 'success');
          }));
        });
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

function createKlant(naam, is_admin) {
  const logged_in = true;
  const klant = new Klant(naam, is_admin, logged_in);
  console.log('klant created');
  return klant;
}
