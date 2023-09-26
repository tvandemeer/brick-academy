const getUrl = 'https://rebrickable.com/api/v3/lego/parts/';
const page = 45;

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
            });
        const link_prev = data['previous'];
        const link_next = data['next'];
        if (link_prev) {
            const prevBtn = document.createElement('button');
            const prevLink = document.createElement('a');
            prevBtn.type = 'button';
            prevBtn.classList.add('uk-button');
            prevLink.href = link_prev;
            prevLink.innerText = 'vorige';
            prevBtn.appendChild(prevLink);
            parts_list.appendChild(prevBtn);
        }
        if (link_next) {
            const nextBtn = document.createElement('button');
            const nextLink = document.createElement('a');
            nextBtn.type = 'button';
            nextBtn.classList.add('uk-button');
            nextLink.href = link_next;
            nextLink.innerText = 'volgende';
            nextBtn.appendChild(nextLink);
            parts_list.appendChild(nextBtn);
        }
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

partDetails = JSON.parse(sessionStorage.getItem('details'));
partDetails['results'].forEach((item) => {
    console.log(item['part_img_url']);
});
console.log(Object.keys(partDetails['results']));
