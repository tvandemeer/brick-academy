import { getLiveKlant, getMandjes, getEditableCustomArtikelen } from "./storageItems.js";
import { Mandje, Artikel } from "./classes.js";
import { showMessage, showToast } from "./notify.js";

async function getParts(page, page_size) {
    const url = `https://rebrickable.com/api/v3/lego/parts/?page=${page}&page_size=${page_size}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            Authorization: 'key bc4537b496eaab6056e0ce49fb54bc55',
        },
    });
    return response.json();
}

export function buildPage (pageNum, pageSize) {
    getParts(pageNum, pageSize)
        .then((data) => {
            const wraps = document.querySelectorAll('.part_wrap');
            const navDiv = document.getElementById('pages_nav_div');
            if (wraps) {
                wraps.forEach((wrap) => {
                    wrap.remove();
                });
            }
            if (navDiv) {
                navDiv.remove();
            }
            createPartsList(data);
            pageNavListeners();
            addCartListeners();
        });
}

function createPartEl(part_num, name, img_url, part_url) {
  const wrapDiv = document.createElement('div');
  const partDiv = document.createElement('div');
  const imgDiv = document.createElement('div');
  const bodyDiv = document.createElement('div');
  const nameEl = document.createElement('p');
  const priceDiv = document.createElement('div');
  priceDiv.classList.add('uk-width-1-2');
  const buyDiv = document.createElement('div');
  buyDiv.classList.add('uk-width-1-2');
  const priceEl = document.createElement('p');
  priceEl.classList.add('price');
  const imgEl = document.createElement('img');
  const detailsDiv = document.createElement('div');
  detailsDiv.classList.add('uk-margin-bottom');
  const bottomDiv = document.createElement('div');
  bottomDiv.classList.add('uk-grid');
  bottomDiv.classList.add('uk-position-bottom');
  bottomDiv.style.left = '20px';
  const addLink = document.createElement('a');
  const cartIcon = document.createElement('span');
  const detailLink = document.createElement('a');
  cartIcon.setAttribute('uk-icon', 'icon: cart; ratio: 2');
  buyDiv.appendChild(cartIcon);
  imgEl.id = part_num;
  if (img_url) {
    imgEl.src = img_url;
  } else {
    imgEl.src = 'img/geen_afbeelding.jpg';
  }
  wrapDiv.classList.add('part_wrap');
  partDiv.classList.add('uk-card');
  partDiv.classList.add('uk-card-default');
  partDiv.classList.add('animate__animated');
  partDiv.classList.add('animate__fadeIn');
  partDiv.classList.add('animate__slow');
  imgDiv.classList.add('uk-card-media-top');
  bodyDiv.classList.add('uk-card-body');
  nameEl.classList.add('uk-card-title');
  imgDiv.appendChild(imgEl);
  partDiv.appendChild(imgDiv);
  nameEl.innerText = name;
  detailLink.classList.add('uk-button');
  detailLink.classList.add('uk-button-default');
  detailLink.classList.add('uk-button-small');
  detailLink.classList.add('part-detail');
  detailLink.href = part_url;
  detailLink.setAttribute('target', '_blank');
  detailLink.innerText = 'details';
  detailLink.type = 'button';
  const prijs = (Math.random() * 5).toFixed(2);
  priceEl.innerText = `€${prijs.toString()}`;
  priceDiv.appendChild(priceEl);
  bottomDiv.appendChild(priceDiv);
  addLink.href = '';
  addLink.innerText = '+';
  addLink.type = 'button';
  addLink.setAttribute('data-part', part_num);
  addLink.setAttribute('data-naam', name);
  addLink.setAttribute('data-prijs', prijs);
  addLink.classList.add('uk-button');
  addLink.classList.add('uk-button-primary');
  addLink.classList.add('add-button');
  addLink.classList.add('uk-button-small');
  buyDiv.appendChild(addLink);
  bottomDiv.appendChild(buyDiv)
  bodyDiv.appendChild(nameEl);
  detailsDiv.appendChild(detailLink);
  bodyDiv.appendChild(detailsDiv);
  bodyDiv.appendChild(bottomDiv);
  partDiv.appendChild(bodyDiv);
  wrapDiv.appendChild(partDiv);
  parts_list.appendChild(wrapDiv);
}

function addCartListeners() {
  const live_klant = getLiveKlant();
  const addButtons = document.querySelectorAll('.add-button');
  addButtons.forEach((btn) => {
    btn.addEventListener('click', ((event) => {
      event.preventDefault();
      if (live_klant) {
          const badges = document.querySelectorAll('span.badge-count');
          let  mandjes = getMandjes();
          const part_num = event.target.dataset.part;
          const { naam } = event.target.dataset;
          const { prijs } = event.target.dataset;
          const artikel = new Artikel(part_num, naam, prijs);
          if (mandjes[live_klant.naam]) {
              mandjes[live_klant.naam].artikelen.push(artikel);
              localStorage.setItem('mandjes', JSON.stringify(mandjes));
          } else {
              let mandje = new Mandje(live_klant);
              mandje.artikelen.push(artikel);
              mandjes[live_klant.naam] = mandje;
              localStorage.setItem('mandjes', JSON.stringify(mandjes));
          }
          badges.forEach((badge) => {
              badge.innerText = mandjes[live_klant.naam].artikelen.length;
          });
          showToast('Artikel toegevoegd', artikel.naam + ' is toegevoegd aan je mandje', 'success');
      } else {
          showMessage('Niet ingelogd',
              'Je moet ingelogd zijn om artikelen aan je mandje toe te kunnen voegen',
              'warning'
          );
      }
    }));
  });
}

export function getPage(pageUrl) {
    let page = '1';
    const hrefSplit = pageUrl.split('&');
    let page_size = 20;
    if (!hrefSplit[1] && page === '2') {
        page = '1';
    } else if (!hrefSplit[1]) {
        page = '1';
    } else {
        page = hrefSplit[0].split('=')[1];
        page_size = hrefSplit[1].split('=')[1];
    }
    sessionStorage.setItem('productPage', page);
    return [page, page_size];
}

export function pageNavListeners () {
    const links = document.querySelectorAll('.pages-nav');
    links.forEach((link) => {
        link.addEventListener('click', ((event) => {
            event.preventDefault();
            const page = getPage(event.target.href);
            window.scrollTo(0, 0);
            buildPage(page[0], page[1]);
        }));
    });
}

export function createPartsList(data) {
    const customParts = getEditableCustomArtikelen();
    customParts.forEach((part) => {
        createPartEl(part['id'], part['naam'], '', '#');
    });
  data.results.forEach((item) => {
    createPartEl(item.part_num, item.name, item.part_img_url, item.part_url);
  });
  const link_prev = data.previous;
  const link_next = data.next;
  const pagesNav = document.createElement('div');
  pagesNav.id = 'pages_nav_div';
  pagesNav.classList.add('uk-container');
  pagesNav.classList.add('uk-flex');
  pagesNav.classList.add('uk-flex-between');
  pagesNav.classList.add('uk-margin-top');
  pagesNav.classList.add('uk-margin-bottom');

  const prevDiv = document.createElement('div');
  const prevLink = document.createElement('a');
  const prevIcon = document.createElement('span');
  prevLink.classList.add('uk-button');
  prevLink.classList.add('uk-button-default');
  prevLink.classList.add('pages-nav');
  prevLink.type = 'button';
  if (link_prev) {
    prevLink.href = link_prev;
  } else {
    prevLink.href = '#';
    prevLink.style.color = '#999999';
    prevLink.style.cursor = 'not-allowed';
  }
  prevIcon.setAttribute('uk-icon', 'icon: chevron-left');
  prevLink.innerText = 'vorige';
  prevDiv.appendChild(prevIcon);
  prevDiv.appendChild(prevLink);
  pagesNav.appendChild(prevDiv);

  const nextDiv = document.createElement('div');
  const nextLink = document.createElement('a');
  const nextIcon = document.createElement('span');
  nextLink.classList.add('uk-button');
  nextLink.classList.add('uk-button-default');
  nextLink.classList.add('pages-nav');
  nextLink.type = 'button';
  if (link_next) {
    nextLink.href = link_next;
  } else {
    nextLink.href = '#';
    nextLink.style.color = '#999999';
    nextLink.style.cursor = 'not-allowed';
  }
  nextIcon.setAttribute('uk-icon', 'icon: chevron-right');
  nextLink.innerText = 'volgende';
  nextDiv.appendChild(nextLink);
  nextDiv.appendChild(nextIcon);
  pagesNav.appendChild(nextDiv);

  document.body.appendChild(pagesNav);

}
