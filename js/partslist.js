class Mandje {
  constructor(klant) {
    this.klant = klant;
    this.artikelen = [];
  }
}

class Artikel {
  constructor(part_num, naam, prijs) {
    this.part_num = part_num;
    this.naam = naam;
    this.prijs = prijs;
  }
}

const getUrl = 'https://rebrickable.com/api/v3/lego/parts/';
const page_size = '20';
let page = '1';

if (!localStorage.getItem('winkelmandjes')) {
  const winkelmandjes = {};
  localStorage.setItem('winkelmandjes', JSON.stringify(winkelmandjes));
  console.log(JSON.parse(localStorage.getItem('winkelmandjes')));
}

let live_klant;

if (sessionStorage.getItem('live_klant')) {
  console.log('Ingelogde klant');
  live_klant = JSON.parse(sessionStorage.getItem('live_klant'));
} else {
  console.log('Geen klant ingelogd');
}

console.log(live_klant);

const mandjes = JSON.parse(localStorage.getItem('winkelmandjes'));

if (mandjes[live_klant.naam]) {
  console.log('Klant heeft een mandje');
} else {
  console.log('Klant heeft nog geen mandje');
  const mandje = new Mandje(live_klant.naam);
  mandjes[live_klant.naam] = mandje;
  localStorage.setItem('winkelmandjes', JSON.stringify(mandjes));
  console.log('Mandje gemaakt voor klant');
}

window.onload = () => {
  const parts_list = document.getElementById('parts_list');
};

async function getParts(url = '') {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: 'key bc4537b496eaab6056e0ce49fb54bc55',
    },
  });
  return response.json();
}

getParts(url = `${getUrl}?page=${page}&page_size=${page_size}`)
  .then((data) => {
    createPartsList(data);
  });

function createPartsList(data) {
  // sessionStorage.setItem('parts', JSON.stringify(data));
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

  pagesNavListeners();

  addCartListeners();
}

function createPartEl(part_num, name, img_url, part_url) {
  const wrapDiv = document.createElement('div');
  const partDiv = document.createElement('div');
  const imgDiv = document.createElement('div');
  const bodyDiv = document.createElement('div');
  const nameDiv = document.createElement('div');
  const detailsDiv = document.createElement('div');
  const cartIconDiv = document.createElement('div');
  const nameEl = document.createElement('p');
  const priceAddDiv = document.createElement('div');
  const priceEl = document.createElement('span');
  const imgEl = document.createElement('img');
  const addLink = document.createElement('a');
  const cartIcon = document.createElement('span');
  const detailLink = document.createElement('a');
  const detailIcon = document.createElement('span');
  cartIcon.setAttribute('uk-icon', 'icon: cart; ratio: 2');
  detailIcon.setAttribute('uk-icon', 'icon: link');
  imgEl.id = part_num;
  if (img_url) {
    imgEl.src = img_url;
  } else {
    imgEl.src = 'img/geen_afbeelding.jpg';
  }
  wrapDiv.classList.add('part_wrap');
  wrapDiv.classList.add('uk-flex');
  partDiv.classList.add('uk-card');
  partDiv.classList.add('uk-flex');
  partDiv.classList.add('uk-flex-column');
  partDiv.classList.add('uk-card-default');
  partDiv.classList.add('animate__animated');
  partDiv.classList.add('animate__fadeIn');
  partDiv.classList.add('animate__slow');
  priceAddDiv.classList.add('uk-position-bottom');
  imgDiv.classList.add('uk-card-media-top');
  bodyDiv.classList.add('uk-card-body');
  nameEl.classList.add('uk-card-title');
  priceEl.classList.add('price');
  imgDiv.appendChild(imgEl);
  partDiv.appendChild(imgDiv);
  nameEl.innerText = name;
  nameDiv.appendChild(nameEl);
  cartIconDiv.classList.add('uk-margin-bottom');
  cartIconDiv.classList.add('uk-text-right');
  detailLink.classList.add('uk-button');
  detailLink.classList.add('uk-button-default');
  detailLink.classList.add('uk-button-small');
  priceAddDiv.classList.add('uk-text-right');
  detailLink.classList.add('part-detail');
  detailLink.href = part_url;
  detailLink.setAttribute('target', '_blank');
  detailLink.innerText = 'details';
  detailLink.appendChild(detailIcon);
  detailsDiv.appendChild(detailLink);
  const prijs = (Math.random() * 5).toFixed(2);
  priceEl.innerText = `€${prijs.toString()}`;
  addLink.href = '#';
  addLink.innerText = '+ ';
  addLink.type = 'button';
  addLink.setAttribute('data-part', part_num);
  addLink.setAttribute('data-naam', name);
  addLink.setAttribute('data-prijs', prijs);
  addLink.classList.add('uk-button');
  addLink.classList.add('uk-button-primary');
  addLink.classList.add('uk-button-primary');
  addLink.classList.add('uk-margin-bottom');
  addLink.classList.add('uk-margin-right');
  addLink.classList.add('uk-border-rounded');
  addLink.classList.add('add-button');
  addLink.classList.add('uk-button-small');
  priceAddDiv.appendChild(priceEl);
  priceAddDiv.appendChild(addLink);
  cartIconDiv.appendChild(cartIcon);
  bodyDiv.appendChild(nameDiv);
  bodyDiv.appendChild(detailsDiv);
  bodyDiv.appendChild(cartIconDiv);
  bodyDiv.appendChild(priceAddDiv);
  partDiv.appendChild(bodyDiv);
  wrapDiv.appendChild(partDiv);
  parts_list.appendChild(wrapDiv);
}

function pagesNavListeners() {
  const navButtons = document.querySelectorAll('.pages-nav');
  navButtons.forEach((btn) => {
    btn.addEventListener('click', ((event) => {
      event.preventDefault();
      const targetHref = event.target.href;
      const hrefSplit = targetHref.split('&');
      if (!hrefSplit[1] && page === '2') {
        page = '1';
      } else if (!hrefSplit[1]) {
        page = 0;
      } else {
        page = hrefSplit[0].split('=')[1];
      }
      if (page) {
        const nodes = document.querySelectorAll('.part_wrap');
        nodes.forEach((node) => {
          node.remove();
        });
        document.getElementById('pages_nav_div').remove();
        getParts(url = `${getUrl}?page=${page}&page_size=${page_size}`)
          .then((data) => {
            createPartsList(data);
          });
      }
    }));
  });
}

function addCartListeners() {
  const addButtons = document.querySelectorAll('.add-button');
  addButtons.forEach((btn) => {
    btn.addEventListener('click', ((event) => {
      const live_klant = JSON.parse(sessionStorage.getItem('live_klant'));
      const mandjesObj = JSON.parse(localStorage.getItem('winkelmandjes'));
      const part_num = event.target.dataset.part;
      const { naam } = event.target.dataset;
      const { prijs } = event.target.dataset;
      const artikel = new Artikel(part_num, naam, prijs);
      console.log(artikel);
      mandjesObj[live_klant.naam].artikelen.push(artikel);
      localStorage.setItem('winkelmandjes', JSON.stringify(mandjesObj));
      console.log('Artikel toegevoegd aan mandje');
    }));
  });
}
