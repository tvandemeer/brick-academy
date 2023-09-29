if (sessionStorage.getItem('loggedIn')) {
  console.log(sessionStorage.getItem('loggedIn'));
} else {
  UIkit.modal.prompt('Naam:', '')
    .then((res) => {
      if (!res) {
        window.location.reload();
      } else {
        sessionStorage.setItem('loggedIn', res);
      }
    });
}

if (localStorage.getItem('klanten')) {
  const klanten = JSON.parse(localStorage.getItem('klanten'));
} else {
  const klanten = [];
  localStorage.setItem('klanten', JSON.stringify(klanten));
}

if (localStorage.getItem('winkelmandjes')) {
  const winkelmandjes = JSON.parse(localStorage.getItem('winkelmandjes'));
} else {
  const winkelmandjes = [];
  localStorage.setItem('winkelmandjes', JSON.stringify(winkelmandjes));
}
