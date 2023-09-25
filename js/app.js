const getUrl = 'https://rebrickable.com/api/v3/lego/parts/?page=';

const page = 45;

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
    // console.log(data["results"]);
    localStorage.setItem('parts', data.results);
  });
