const getUrl = 'https://rebrickable.com/api/v3/lego/parts/?page=';

const page = 45;

window.onload = () => {

    const parts_list = document.getElementById('parts_list');

    async function getParts(url = '') {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: 'key bc4537b496eaab6056e0ce49fb54bc55',
            },
        });
        return response.json();
    }

    getParts(getUrl + page.toString())
        .then((data) => {
            localStorage.setItem('parts', JSON.stringify(data));
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
        const wrapDiv = document.createElement('div');
        const partDiv = document.createElement('div');
        const numEl = document.createElement('p');
        const nameEl = document.createElement('p');
        partDiv.classList.add('uk-card');
        partDiv.classList.add('uk-card-body');
        partDiv.classList.add('uk-card-default');
        numEl.innerText = part_num;
        nameEl.innerText = name;
        partDiv.appendChild(numEl);
        partDiv.appendChild(nameEl);
        wrapDiv.appendChild(partDiv);
        parts_list.appendChild(wrapDiv);
    }
};
