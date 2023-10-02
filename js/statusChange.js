export function logInActions(naam) {
  sessionStorage.setItem('live_klant', naam);
}

export function logOutActions() {
  sessionStorage.removeItem('live_klant');
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
