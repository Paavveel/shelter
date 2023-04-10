import pets from '../data/pets.js';
const sliderInner = document.querySelector('.slider__inner');
const sliderButtonLeft = document.querySelector('.slider__button-left');
const sliderButtonRight = document.querySelector('.slider__button-right');
const sliderItemLeft = document.querySelector('.slider__item-left');
const sliderItemActive = document.querySelector('.slider__item-active');
const sliderItemRight = document.querySelector('.slider__item-right');

let petsCount;

const mobileWidthMediaQuery = window.matchMedia('(max-width: 767px)');
const tabletWidthMediaQuery = window.matchMedia(
  '(min-width: 768px) and (max-width: 1240px)'
);
const desktopWidthMediaQuery = window.matchMedia('(min-width: 1240px)');

switch (true) {
  case mobileWidthMediaQuery.matches:
    petsCount = 1;
    break;
  case tabletWidthMediaQuery.matches:
    petsCount = 2;
    break;
  case desktopWidthMediaQuery.matches:
    petsCount = 3;
    break;
  default:
    break;
}

mobileWidthMediaQuery.addEventListener('change', (e) => {
  if (e.matches) {
    petsCount = 1;
  }
  renderSlider();
});

tabletWidthMediaQuery.addEventListener('change', (e) => {
  if (e.matches) {
    petsCount = 2;
  }
  renderSlider();
});

desktopWidthMediaQuery.addEventListener('change', (e) => {
  if (e.matches) {
    petsCount = 3;
  }
  renderSlider();
});

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

function renderPets(arr, container) {
  container.innerHTML = '';
  let pets = '';

  const tabIndex = container.matches('.slider__item-active') ? 0 : -1;

  for (let i = 0; i < petsCount; i++) {
    const { id, name, img } = arr[i];
    pets += `<div class="pet-card" data-pet-id=${id} tabindex="${tabIndex}">
                  <img class="pet-card__img" width="270" height="270" src="${img}"
                    alt="${name}">
                  <p class="pet-card__name">${name}</p>
                  <button class="button button_secondary" tabindex="${tabIndex}">Learn more</button>
                </div>`;
  }

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

getInitPets();
renderSlider();
