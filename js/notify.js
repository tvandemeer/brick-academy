import { getKlanten, getMandjes } from './storageItems.js';
import { populateSelect } from './adminUi.js';

const { Swal } = window;

export function showMessage(msgTitle, msgText, msgIcon) {
  Swal.fire({
    title: msgTitle,
    text: msgText,
    icon: msgIcon,
    timer: 1500,
    timerProgressBar: true,
    showConfirmButton: false,
  });
}

export function confirmDeleteKlant(klant, msgTitle, msgText, msgIcon) {
  const klanten = getKlanten();
  const mandjes = getMandjes();
  Swal.fire({
    title: msgTitle,
    text: msgText,
    icon: msgIcon,
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Verwijderen',
  }).then((result) => {
    if (result.isConfirmed) {
      delete klanten[klant];
      localStorage.setItem('klanten', JSON.stringify(klanten));
      if (mandjes[klant]) {
        delete mandjes[klant];
        localStorage.setItem('mandjes', JSON.stringify(mandjes));
      }
      populateSelect();
      Swal.fire(
        'Klant verwijderd!',
        'Klant en mandje zijn verwijderd uit de opslag',
        'success',
      );
    }
  });
}

export function confirmDeleteMandje(klant, msgTitle, msgText, msgIcon) {
  const mandjes = getMandjes();
  Swal.fire({
    title: msgTitle,
    text: msgText,
    icon: msgIcon,
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Verwijderen',
  }).then((result) => {
    if (result.isConfirmed) {
      if (mandjes[klant]) {
        delete mandjes[klant];
        localStorage.setItem('mandjes', JSON.stringify(mandjes));
      }
      populateSelect();
      Swal.fire(
        'Mandje verwijderd!',
        'Het mandje is verwijderd uit de opslag',
        'success',
      );
    }
  });
}

export function showToast(msgTitle, msgText, msgIcon) {
  Swal.fire({
    title: msgTitle,
    text: msgText,
    icon: msgIcon,
    timer: 1000,
    showConfirmButton: false,
    toast: true,
    showClass: {
      popup: 'animate__animated animate__fadeInDown',
    },
    hideClass: {
      popup: 'animate__animated animate__fadeOutUp',
    },
  });
}
