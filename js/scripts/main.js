//scripts do slider hero
var slide_hero = new Swiper(".slide-hero", {
  effect: "fade",
  pagination: {
    el: ".slide-hero .main-area .area-explore .swiper-pagination ",
  },
});

const cardPokemon = document.querySelectorAll(".js-open-details-pokemon");
const btnCloseModal = document.querySelector(".js-close-modal-details-pokemon");

function openDetailsPokemon() {
  document.documentElement.classList.add("open-modal");
}

cardPokemon.forEach((card) => {
  card.addEventListener("click", openDetailsPokemon);
});

function closeDetailsPokemon() {
  document.documentElement.classList.remove("open-modal");
}

if (btnCloseModal) {
  btnCloseModal.addEventListener("click", closeDetailsPokemon);
}

const btnDropDownSelect = document.querySelector(".js-open-select-custom");

btnDropDownSelect.addEventListener("click", () => {
  btnDropDownSelect.parentElement.classList.toggle("active");
});
