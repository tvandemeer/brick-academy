const getUrl = 'https://rebrickable.com/api/v3/lego/parts/';
const page = 1;

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

getParts(getUrl + '?page=' + page.toString())
    .then((data) => {
        sessionStorage.setItem('parts', JSON.stringify(data));
        let part_nums = '?part_nums=';
        data['results'].forEach((item) => {
            part_nums += item['part_num'].toString() + ',';
            createPartEl(item['part_num'], item['name']);
        });
        getDetails(url = getUrl + part_nums)
            .then((data) => {
                sessionStorage.setItem('details', JSON.stringify(data));
                data['results'].forEach((item) => {
                    let partImgEl = document.getElementById(item['part_num']);
                    if (item['part_img_url']) {
                        partImgEl.src = item['part_img_url'];
                    } else {
                        partImgEl.src = "img/geen_afbeelding.jpg";
                    }
                });
            });
        const link_prev = data['previous'];
        const link_next = data['next'];
        let pagesNav = document.createElement('div');
        pagesNav.classList.add('uk-width-1-1');

        const prevDiv = document.createElement('div');
        const prevLink = document.createElement('a');
        prevDiv.classList.add('uk-width-1-2');
        prevLink.classList.add('uk-button');
        prevLink.classList.add('uk-button-default');
        prevLink.type = 'button';
        if (link_prev) {
            prevLink.href = link_prev;
        } else {
            prevLink.href = '#';
            prevLink.style.color = '#999999';
            prevLink.style.cursor = 'not-allowed';
        }
        prevLink.innerText = 'vorige';
        prevDiv.appendChild(prevLink);
        pagesNav.appendChild(prevDiv);

        const nextDiv = document.createElement('div');
        const nextLink = document.createElement('a');
        nextDiv.classList.add('uk-width-1-2');
        nextLink.classList.add('uk-button');
        nextLink.classList.add('uk-button-default');
        nextLink.type = 'button';
        if (link_next) {
            nextLink.href = link_next;
        } else {
            nextLink.href = '#';
            nextLink.style.color = '#999999';
            nextLink.style.cursor = 'not-allowed';
        }
        nextLink.innerText = 'volgende';
        nextDiv.appendChild(nextLink);
        pagesNav.appendChild(nextDiv);

        parts_list.appendChild(pagesNav);
    });

function createPartEl (part_num, name) {
    const wrapDiv = document.createElement('div');
    const partDiv = document.createElement('div');
    const imgDiv = document.createElement('div');
    const bodyDiv = document.createElement('div');
    const numEl = document.createElement('p');
    const nameEl = document.createElement('p');
    const priceEl = document.createElement('p');
    const imgEl = document.createElement('img');
    imgEl.id = part_num;
    imgEl.src = "https://placehold.co/600x400";
    partDiv.classList.add('uk-card');
    partDiv.classList.add('uk-card-default');
    imgDiv.classList.add('uk-card-media-top');
    bodyDiv.classList.add('uk-card-body');
    nameEl.classList.add('uk-card-title');
    priceEl.classList.add('uk-position-bottom');
    priceEl.classList.add('price');
    imgDiv.appendChild(imgEl);
    partDiv.appendChild(imgDiv);
    numEl.innerText = part_num;
    nameEl.innerText = name;
    priceEl.innerText = '€' + (Math.random() * 5).toFixed(2);
    bodyDiv.appendChild(nameEl);
    bodyDiv.appendChild(numEl);
    bodyDiv.appendChild(priceEl);
    partDiv.appendChild(bodyDiv);
    wrapDiv.appendChild(partDiv);
    parts_list.appendChild(wrapDiv);
}

async function getDetails(url = '') {
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            Authorization: 'key bc4537b496eaab6056e0ce49fb54bc55',
        },
    });
    return response.json();
}
