import { updateNavbar } from './navbar.js';
import { showMessage } from './notify.js';

if (sessionStorage.getItem('live_klant')) {
  sessionStorage.removeItem('live_klant');
  sessionStorage.removeItem('login-greet');
  if (sessionStorage.getItem('admin-greet')) {
    sessionStorage.removeItem('admin-greet');
  }

  updateNavbar();

  showMessage('Je bent uitgelogd', 'Tot ziens!', 'success');

  const byeDiv = document.getElementById('bye');
  byeDiv.classList.add('uk-width-1-1@s');
  byeDiv.classList.add('uk-width-1-2@m');
  byeDiv.classList.add('uk-width-1-2@l');

  const byeImg = document.createElement('img');
  byeImg.src = '../img/tot_ziens.png';
  byeImg.classList.add('animate__animated');
  byeImg.classList.add('animate__rotateIn');

  byeDiv.appendChild(byeImg);
}
