import { getLiveKlant, getMandjes } from "./storageItems.js";

export function updateNavbar () {
    const curPage = window.location.pathname;
    const live_klant = getLiveKlant();
    const mandjes = getMandjes();

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
                link.classList.add('uk-active');
            });
            break;
    }

    const navLogInLinks = document.querySelectorAll('.user-login');
    const navLogOutLinks = document.querySelectorAll('.user-logout');
    const navAdminLinks = document.querySelectorAll('.user-admin');
    const badges = document.querySelectorAll('span.badge-count');

    if (live_klant) {
        navLogInLinks.forEach((link) => {
            link.classList.add('uk-hidden');
        });

        navLogOutLinks.forEach((link) => {
            link.classList.remove('uk-hidden');
        });
        document.querySelectorAll('.link-user').forEach((link) => {
            link.style.color = '#0F7AE5';
        });
        if (live_klant.admin) {
            navAdminLinks.forEach((link) => {
                link.classList.remove('uk-hidden');
            });
            document.querySelectorAll('.link-admin').forEach((link) => {
                link.style.color = 'red';
            });
        }
        if (mandjes[live_klant.naam]) {
            badges.forEach((badge) => {
                badge.innerText = mandjes[live_klant.naam].artikelen.length;
            });
        }
    }

    document.querySelectorAll('a[href="logout.html"]').forEach((link) => {
        link.style.color = 'red';
    });
}
