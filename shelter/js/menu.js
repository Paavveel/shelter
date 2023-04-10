const menuOverlay = document.querySelector('.menu__overlay');
const menuBody = document.querySelector('.menu__body');
const menuButton = document.querySelector('.menu__button');

function toggleMenu() {
  menuOverlay.classList.toggle('overlay_show');
  menuBody.classList.toggle('menu__body_show');
  menuButton.classList.toggle('menu__button_open');
  document.body.classList.toggle('body_lock');

  if (menuBody.matches('.menu__body_show')) {
    menuBody.addEventListener('click', handleMenuLink);
    menuOverlay.addEventListener('click', toggleMenu);
  } else {
    menuBody.removeEventListener('click', handleMenuLink);
    menuOverlay.removeEventListener('click', toggleMenu);
  }
}

function handleMenuLink(e) {
  const link = e.target;

  if (link.matches('.menu__link') && menuBody.matches('.menu__body_show')) {
    e.preventDefault();

    const href = link.getAttribute('href');

    if (href === '#' || link.matches('.menu__link_active')) {
      toggleMenu();
      location.hash = '';
      return;
    }

    toggleMenu();

    if (href.includes('.html')) {
      const url = location.href.split('/');
      url[url.length - 1] = href;
      const newUrl = url.join('/');

      setTimeout(() => {
        location.assign(newUrl);
      }, 330);
    } else {
      const blockId = href.replace('#', '');
      const block = document.getElementById(blockId);

      setTimeout(() => {
        block.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
        location.hash = blockId;
      }, 330);
    }
  }
}

if (menuBody && menuButton) {
  menuButton.addEventListener('click', toggleMenu);
}
