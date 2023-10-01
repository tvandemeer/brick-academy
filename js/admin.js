const { Swal } = window;

function showMessage(msgText, msgIcon) {
  Swal.fire({
    text: msgText,
    icon: msgIcon,
    timer: 1500,
    timerProgressBar: true,
  });
}

if (!sessionStorage.getItem('live_klant')) {
  showMessage('Je moet ingelogd zijn als admin!', 'error');
} else {
  console.log('ingelogde klant gevonden');
  const klant = JSON.parse(sessionStorage.getItem('live_klant'));
  if (!klant.admin) {
    showMessage('Alleen toegankelijk voor admins!', 'error');
  } else {
    showMessage(`Welkom ${klant.naam}!`, 'success');
  }
}
