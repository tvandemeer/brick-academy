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
  const live_klant = JSON.parse(sessionStorage.getItem('live_klant'));
  return live_klant;
}

export function getBerichten() {
  let berichten = JSON.parse(localStorage.getItem('berichten'));
  if (!berichten) {
    berichten = [];
    localStorage.setItem('berichten', JSON.stringify(berichten));
  }
  return berichten;
}

export function getCustomArtikelen() {
  let customArtikelen = JSON.parse(localStorage.getItem('customArtikelen'));
  if (!customArtikelen) {
    customArtikelen = [];
    localStorage.setItem('customArtikelen', JSON.stringify(customArtikelen));
  }
  return customArtikelen;
}
