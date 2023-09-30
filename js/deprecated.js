async function getDetails(url = '') {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: 'key bc4537b496eaab6056e0ce49fb54bc55',
    },
  });
  return response.json();
}

getDetails(url = getUrl + part_nums)
  .then((data) => {
    sessionStorage.setItem('details', JSON.stringify(data));
    data.results.forEach((item) => {
      const partImgEl = document.getElementById(item.part_num);
      if (item.part_img_url) {
        partImgEl.src = item.part_img_url;
      } else {
        partImgEl.src = 'img/geen_afbeelding.jpg';
      }
    });
  });

if (sessionStorage.getItem('loggedIn')) {
  console.log(sessionStorage.getItem('loggedIn'));
} else {
  UIkit.modal.prompt('Voor testdoeleinden vraag ik je een naam in te vullen. Om de code te kunnen testen, is het goed om bij elk bezoek dezelfde naam te gebruiken', '')
    .then((res) => {
      if (!res) {
        window.location.reload();
      } else {
        sessionStorage.setItem('loggedIn', res);
      }
    });
}
