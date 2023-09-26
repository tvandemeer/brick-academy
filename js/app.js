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
        data['results'].forEach((item) => {
            createPartEl(item['part_num'], item['name']);
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
    //getDetails(url = getUrl + part_num.toString()); TOO MANY REQUESTS!!!
    const wrapDiv = document.createElement('div');
    const partDiv = document.createElement('div');
    const headerDiv = document.createElement('div');
    const bodyDiv = document.createElement('div');
    const footerDiv = document.createElement('div');
    const numEl = document.createElement('p');
    const nameEl = document.createElement('p');
    const priceEl = document.createElement('p');
    partDiv.classList.add('uk-card');
    partDiv.classList.add('uk-card-default');
    headerDiv.classList.add('uk-card-header');
    bodyDiv.classList.add('uk-card-body');
    footerDiv.classList.add('uk-card-footer');
    nameEl.classList.add('uk-card-title');
    numEl.innerText = part_num;
    nameEl.innerText = name;
    priceEl.innerText = '€' + (Math.random() * 5).toFixed(2);
    headerDiv.appendChild(nameEl);
    bodyDiv.appendChild(numEl);
    footerDiv.appendChild(priceEl);
    partDiv.appendChild(headerDiv);
    partDiv.appendChild(bodyDiv);
    partDiv.appendChild(footerDiv);
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

//getDetails(url)
    //.then((data) => {
        ////sessionStorage.setItem(part_num.toString(), JSON.stringify(data));
        ////data['results'].forEach((item) => {
            ////createPartEl(item['part_num'], item['name']);
        //console.log(data);
    //});
