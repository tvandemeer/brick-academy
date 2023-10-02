function showMessage(msgText, msgIcon) {
  Swal.fire({
    text: msgText,
    icon: msgIcon,
    timer: 1500,
    timerProgressBar: true,
  });
}

function createAdminPage() {
  let klanten;
  let mandjes;

  if (localStorage.getItem('klanten')) {
    klanten = JSON.parse(localStorage.getItem('klanten'));
    console.log('klanten in localStorage');
  }

  if (localStorage.getItem('winkelmandjes')) {
    mandjes = JSON.parse(localStorage.getItem('winkelmandjes'));
    console.log('mandjes in localStorage');
  }

  console.log(klanten);
  console.log(mandjes);
}

if (!sessionStorage.getItem('live_klant')) {
  showMessage('Je moet ingelogd zijn als admin!', 'error');
} else {
  console.log('ingelogde klant gevonden');
  const klant = JSON.parse(sessionStorage.getItem('live_klant'));
  if (!klant.admin) {
    showMessage('Alleen toegankelijk voor admins!', 'error');
  } else if (klant.admin) {
    if (!sessionStorage.getItem('greeted')) {
      showMessage(`Welkom ${klant.naam}!`, 'success');
      sessionStorage.setItem('greeted', 1);
    }
    createAdminPage();
  }
}
