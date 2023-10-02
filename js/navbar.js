const curPage = window.location.pathname;

const { Swal } = window;

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

switch (curPage) {
  case '/index.html':
    const indexLinks = document.querySelectorAll('.link-index');
    indexLinks.forEach((link) => {
      link.classList.add('uk-active');
    });
    break;
  case '/':
    const rootLinks = document.querySelectorAll('.link-index');
    rootLinks.forEach((link) => {
      link.classList.add('uk-active');
    });
    break;
  case '/contact.html':
    const contactLinks = document.querySelectorAll('.link-contact');
    contactLinks.forEach((link) => {
      link.classList.add('uk-active');
    });
    break;
  case '/winkelmandje.html':
    const winkelmandjeLinks = document.querySelectorAll('.link-winkelmandje');
    winkelmandjeLinks.forEach((link) => {
      link.classList.add('uk-active');
    });
    break;
  case '/login.html':
    const loginLinks = document.querySelectorAll('.link-user');
    loginLinks.forEach((link) => {
      link.style.color = 'black';
    });
    break;
}

if (sessionStorage.getItem('live_klant')) {
  const userLinks = document.querySelectorAll('.link-user');
  userLinks.forEach((link) => {
    link.style.color = '#0F7AE5';
  });
  const live_klant = JSON.parse(sessionStorage.getItem('live_klant'));
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
  });
}
