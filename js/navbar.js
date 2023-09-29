window.onload = () => {
  const curPage = window.location.pathname;

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
  }
};
