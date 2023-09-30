class Klant {
  constructor(klant_id, naam, admin, logged_in) {
    this.klant_id = klant_id;
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

const loginButton = document.getElementById('button-login');
loginButton.addEventListener('click', (event) => {
  event.preventDefault();
  const naam = document.getElementById('input-naam').value;
  const admin = document.getElementById('check-admin').checked;
  console.log(`naam: ${naam}`);
  console.log(`admin: ${admin}`);
  if (naam) {
    const loggedIn = true;
    klant = new Klant(`klant_${naam}`, naam, admin, loggedIn);
    console.log(klant);
    // localStorage.setItem(klant.klant_id, JSON.stringify(klant));
    mandje = new Mandje(`mandje_${naam}`, klant.klant_id);
    console.log(mandje);
    // localStorage.setItem(mandje.mandje_id, JSON.stringify(mandje));
    Swal.fire({
      title: `Hallo ${naam}!`,
      icon: 'success',
      text: 'je bent ingelogd',
      toast: true,
      timer: 2000,
      timerProgressBar: true,
    });
  }
});
