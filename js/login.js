if (sessionStorage.getItem('loggedIn')) {
  console.log('loggedIn item gevonden in sessionStorage:');
  console.log(sessionStorage.getItem('loggedIn'));
} else {
  console.log('Geen loggedItem in sessionStorage');
  // window.location.replace('login.html');
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
