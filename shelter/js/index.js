import pets from '../data/pets.json' assert { type: 'json' };

// Menu START
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

// Menu END

// Slider START
let pastArr = [];
let currArr = [];
let nextArr = [];

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getNext() {
  nextArr.length = 0;

  while (nextArr.length < 3) {
    const randomPet = pets[getRandomIntInclusive(0, 7)];

    const isExistInCurr = !!currArr.filter(
      (elem) => elem.name === randomPet.name
    ).length;

    const isExistInNext = !!nextArr.filter(
      (elem) => elem.name === randomPet.name
    ).length;

    if (!isExistInCurr && !isExistInNext) {
      nextArr.push(randomPet);
    }
  }
}

function getPast() {
  pastArr.length = 0;

  while (pastArr.length < 3) {
    const randomPet = pets[getRandomIntInclusive(0, 7)];

    const isExistInCurr = !!currArr.filter(
      (elem) => elem.name === randomPet.name
    ).length;

    const isExistInNext = !!pastArr.filter(
      (elem) => elem.name === randomPet.name
    ).length;

    if (!isExistInCurr && !isExistInNext) {
      pastArr.push(randomPet);
    }
  }
}

function getInitPets() {
  getNext();
  currArr = [...nextArr];
  getNext();
  pastArr = [...currArr];
  currArr = [...nextArr];
  getNext();
}

getInitPets();

function renderPets(arr, container) {
  container.innerHTML = '';
  let pets = '';

  arr.forEach(({ name, img }) => {
    pets += `<div class="pet-card">
                  <img class="pet-card__img" width="270" height="270" src="${img}"
                    alt="Katrine">
                  <p class="pet-card__name">${name}</p>
                  <button class="button button_secondary">Learn more</button>
                </div>`;
  });

  container.insertAdjacentHTML('afterbegin', pets);
}

function renderSlider() {
  renderPets(pastArr, sliderItemLeft);
  renderPets(currArr, sliderItemActive);
  renderPets(nextArr, sliderItemRight);
}

function forward() {
  pastArr = [...currArr];
  currArr = [...nextArr];
  getNext();
}

function changeToForward() {
  const temp = [...currArr];
  currArr = [...nextArr];
  pastArr = [...temp];
  getNext();
}

function backward() {
  nextArr = [...currArr];
  currArr = [...pastArr];
  getPast();
}

function changeToBackward() {
  const temp = [...currArr];
  currArr = [...pastArr];
  nextArr = [...temp];
  getPast();
}

const sliderInner = document.querySelector('.slider__inner');
const sliderButtonLeft = document.querySelector('.slider__button-left');
const sliderButtonRight = document.querySelector('.slider__button-right');

const sliderItemLeft = document.querySelector('.slider__item-left');
const sliderItemActive = document.querySelector('.slider__item-active');
const sliderItemRight = document.querySelector('.slider__item-right');

renderSlider();

let isMoveLeft = false;
let isMoveRight = false;

function moveLeft() {
  if (isMoveRight) {
    changeToBackward();
    isMoveRight = false;
  } else {
    backward();
  }
  isMoveLeft = true;

  sliderInner.classList.add('slider__inner_transition-left');
  sliderButtonLeft.removeEventListener('click', moveLeft);
  sliderButtonRight.removeEventListener('click', moveRight);
}

function moveRight() {
  if (isMoveLeft) {
    changeToForward();
    isMoveLeft = false;
  } else {
    forward();
  }
  isMoveRight = true;

  sliderInner.classList.add('slider__inner_transition-right');
  sliderButtonRight.removeEventListener('click', moveRight);
  sliderButtonLeft.removeEventListener('click', moveLeft);
}

sliderButtonLeft.addEventListener('click', moveLeft);
sliderButtonRight.addEventListener('click', moveRight);

sliderInner.addEventListener('animationend', (e) => {
  if (e.animationName === 'move-left') {
    sliderInner.classList.remove('slider__inner_transition-left');
  } else {
    sliderInner.classList.remove('slider__inner_transition-right');
  }

  renderSlider();
  sliderButtonLeft.addEventListener('click', moveLeft);
  sliderButtonRight.addEventListener('click', moveRight);
});

// Slider END
