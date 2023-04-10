import pets from '../data/pets.js';
const petsContainer = document.querySelector('.our-friends-pets__container');
const paginationStartButton = document.querySelector('#pagination-start');
const paginationPrevButton = document.querySelector('#pagination-prev');
const currentPageButton = document.querySelector('#pagination-current-page');
const paginationNextButton = document.querySelector('#pagination-next');
const paginationEndButton = document.querySelector('#pagination-end');

const AMOUNT_OF_PETS = 48;

let petsCount;
let totalPages;
let currentPage = 1;
let petsArray = [];

const mobileWidthMediaQuery = window.matchMedia('(max-width: 767px)');
const tabletWidthMediaQuery = window.matchMedia(
  '(min-width: 768px) and (max-width: 1279px)'
);
const desktopWidthMediaQuery = window.matchMedia('(min-width: 1280px)');

switch (true) {
  case mobileWidthMediaQuery.matches:
    petsCount = 3;
    totalPages = AMOUNT_OF_PETS / petsCount;
    break;
  case tabletWidthMediaQuery.matches:
    petsCount = 6;
    totalPages = AMOUNT_OF_PETS / petsCount;
    break;
  case desktopWidthMediaQuery.matches:
    petsCount = 8;
    totalPages = AMOUNT_OF_PETS / petsCount;
    break;
  default:
    break;
}

mobileWidthMediaQuery.addEventListener('change', (e) => {
  if (e.matches) {
    petsCount = 3;
    currentPage = 1;
    totalPages = AMOUNT_OF_PETS / petsCount;
  }
  setPagination();
});

tabletWidthMediaQuery.addEventListener('change', (e) => {
  if (e.matches) {
    petsCount = 6;
    currentPage = 1;
    totalPages = AMOUNT_OF_PETS / petsCount;
  }
  setPagination();
});

desktopWidthMediaQuery.addEventListener('change', (e) => {
  if (e.matches) {
    petsCount = 8;
    currentPage = 1;
    totalPages = AMOUNT_OF_PETS / petsCount;
  }
  setPagination();
});

const shuffleArray = (array) => {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = copy[i];
    copy[i] = copy[j];
    copy[j] = temp;
  }
  return copy;
};

function getInitialPetsArr() {
  const initialArr = shuffleArray(pets);

  for (let i = 0; i < 6; i++) {
    const firstChunk = shuffleArray(initialArr.slice(0, 3));
    const secondeChunk = shuffleArray(initialArr.slice(3, 6));
    const thirdChunk = shuffleArray(initialArr.slice(6, 9));
    const arrWithNewSequence = [...firstChunk, ...secondeChunk, ...thirdChunk];

    petsArray = [...petsArray, ...arrWithNewSequence];
  }
}

function renderPets() {
  petsContainer.innerHTML = '';
  let pets = '';

  const start = (currentPage - 1) * petsCount;
  const end = start + petsCount;

  const pageArr = petsArray.slice(start, end);

  for (let i = 0; i < pageArr.length; i++) {
    const { id, name, img } = pageArr[i];
    pets += `<div class="pet-card" data-pet-id="${id}" tabindex="0">
            <img class="pet-card__img" width="270" height="270" src="${img}" alt=${name}">
            <p class="pet-card__name">${name}</p>
            <button class="button button_secondary">Learn more</button>
          </div>`;
  }

  petsContainer.insertAdjacentHTML('afterbegin', pets);
}

function setControls() {
  currentPageButton.textContent = currentPage;

  if (currentPage === 1) {
    paginationStartButton.disabled = true;
    paginationPrevButton.disabled = true;
  } else {
    paginationStartButton.disabled = false;
    paginationPrevButton.disabled = false;
  }
  if (currentPage === totalPages) {
    paginationNextButton.disabled = true;
    paginationEndButton.disabled = true;
  } else {
    paginationNextButton.disabled = false;
    paginationEndButton.disabled = false;
  }
}

function setPagination() {
  renderPets();
  setControls();
}

function nextPage() {
  currentPage++;
  setPagination();
}
function endPage() {
  currentPage = totalPages;
  setPagination();
}
function prevPage() {
  currentPage--;
  setPagination();
}
function startPage() {
  currentPage = 1;
  setPagination();
}

paginationNextButton.addEventListener('click', nextPage);
paginationEndButton.addEventListener('click', endPage);

paginationPrevButton.addEventListener('click', prevPage);
paginationStartButton.addEventListener('click', startPage);

getInitialPetsArr();
setPagination();
