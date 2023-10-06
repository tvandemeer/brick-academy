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
    let live_klant = JSON.parse(sessionStorage.getItem('live_klant'));

    return live_klant;
}
