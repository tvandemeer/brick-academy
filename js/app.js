class Klant {
  constructor(klant_id, naam) {
    this.klant_id = klant_id;
    this.naam = naam;
  }
}

class Mandje {
  constructor(mandje_id, klant_id, artikelen) {
    this.mandje_id = mandje_id;
    this.klant_id = klant_id;
    this.artikelen = [];
  }
}

class Artikel {
  constructor(part_num) {
    this.part_num = part_num;
  }
}

const getUrl = 'https://rebrickable.com/api/v3/lego/parts/';
const page_size = '20';
let page = '1';

let loggedIn;

window.onload = () => {
  const parts_list = document.getElementById('parts_list');
  if (sessionStorage.getItem('logged_in')) {
    loggedIn = sessionStorage.getItem('loggedIn');
  } else {
    sessionStorage.setItem('loggedIn', false);
  }

  if (!loggedIn) {
    const loggedModal = UIkit.modal('#logged-modal');
    if (window.location.pathname != '/index.html') {
      window.location.replace('index.html');
    }
    // loggedModal.show();
  }
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

const klant1 = new Klant(1, 'Thomas');
localStorage.setItem('klant1', JSON.stringify(klant1));

const mand1 = new Mandje(1, klant1, []);
localStorage.setItem('mand1', JSON.stringify(mand1));

function createPartsList(data) {
  sessionStorage.setItem('parts', JSON.stringify(data));
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
}

function createPartEl(part_num, name, img_url, part_url) {
  const wrapDiv = document.createElement('div');
  const partDiv = document.createElement('div');
  const imgDiv = document.createElement('div');
  const bodyDiv = document.createElement('div');
  const nameEl = document.createElement('p');
  const priceEl = document.createElement('h2');
  const imgEl = document.createElement('img');
  const addLink = document.createElement('a');
  const cartIcon = document.createElement('span');
  const detailLink = document.createElement('a');
  const detailIcon = document.createElement('span');
  cartIcon.setAttribute('uk-icon', 'icon: cart');
  detailIcon.setAttribute('uk-icon', 'icon: link');
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
  nameEl.classList.add('uk-inline');
  nameEl.classList.add('uk-width-1-1');
  priceEl.classList.add('uk-position-bottom');
  priceEl.classList.add('price');
  priceEl.classList.add('uk-inline');
  imgEl.classList.add('uk-position-relative');
  imgDiv.appendChild(imgEl);
  partDiv.appendChild(imgDiv);
  nameEl.innerText = name;
  detailLink.classList.add('uk-button');
  detailLink.classList.add('uk-button-default');
  detailLink.classList.add('uk-button-small');
  detailLink.classList.add('uk-inline');
  detailLink.classList.add('part-detail');
  detailLink.classList.add('uk-width-2-3');
  detailLink.href = part_url;
  detailLink.setAttribute('target', '_blank');
  detailLink.innerText = 'details';
  detailLink.appendChild(detailIcon);
  priceEl.innerText = `€${(Math.random() * 5).toFixed(2)}`;
  addLink.id = `add_${part_num}`;
  addLink.href = '#';
  addLink.innerText = '+ ';
  addLink.type = 'button';
  addLink.classList.add('uk-button');
  addLink.classList.add('uk-button-primary');
  addLink.classList.add('uk-inline');
  addLink.classList.add('uk-position-bottom-right');
  addLink.classList.add('uk-height-1-2');
  addLink.classList.add('uk-margin-bottom');
  addLink.classList.add('uk-margin-right');
  addLink.classList.add('uk-border-rounded');
  addLink.classList.add('add_button');
  addLink.appendChild(cartIcon);
  bodyDiv.appendChild(nameEl);
  bodyDiv.appendChild(detailLink);
  bodyDiv.appendChild(priceEl);
  bodyDiv.appendChild(addLink);
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
