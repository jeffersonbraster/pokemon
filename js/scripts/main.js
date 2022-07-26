//scripts do slider hero
var slide_hero = new Swiper(".slide-hero", {
  effect: "fade",
  pagination: {
    el: ".slide-hero .main-area .area-explore .swiper-pagination ",
  },
});

const cardPokemon = document.querySelectorAll(".js-open-details-pokemon");
const btnCloseModal = document.querySelector(".js-close-modal-details-pokemon");

cardPokemon.forEach((card) => {
  card.addEventListener("click", openDetailsPokemon);
});

if (btnCloseModal) {
  btnCloseModal.addEventListener("click", closeDetailsPokemon);
}

const btnDropDownSelect = document.querySelector(".js-open-select-custom");

btnDropDownSelect.addEventListener("click", () => {
  btnDropDownSelect.parentElement.classList.toggle("active");
});

const areaPokemons = document.getElementById("js-list-pokemons");

function primeiraLetraMaiuscula(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function createCardPokemon(code, type, nome, imagePok) {
  let card = document.createElement("button");
  card.classList = `card-pokemon js-open-details-pokemon ${type}`;
  card.setAttribute("code-pokemon", code);
  areaPokemons.appendChild(card);

  let image = document.createElement("div");
  image.classList = "image";
  card.appendChild(image);

  let imageSrc = document.createElement("img");
  imageSrc.classList = "thumb-img";
  imageSrc.setAttribute("src", imagePok);
  image.appendChild(imageSrc);

  let infoCardPokemon = document.createElement("div");
  infoCardPokemon.classList = "info";
  card.appendChild(infoCardPokemon);

  let infoTextPokemon = document.createElement("div");
  infoTextPokemon.classList = "text";
  infoCardPokemon.appendChild(infoTextPokemon);

  let codePokemon = document.createElement("span");
  codePokemon.textContent =
    code < 10 ? `#00${code}` : code < 100 ? `#0${code}` : `#${code}`;
  infoTextPokemon.appendChild(codePokemon);

  let namePokemon = document.createElement("h3");
  namePokemon.textContent = primeiraLetraMaiuscula(nome);
  infoTextPokemon.appendChild(namePokemon);

  let areaIcon = document.createElement("div");
  areaIcon.classList = "icon";
  infoCardPokemon.appendChild(areaIcon);

  let imgType = document.createElement("img");
  imgType.setAttribute("src", `img/icon-types/${type}.svg`);
  areaIcon.appendChild(imgType);
}

function listingPokemons(url) {
  axios({
    method: "GET",
    url,
  }).then((response) => {
    const countPokemons = document.getElementById("js-count-pokemons");
    const { results, count } = response.data;

    countPokemons.innerText = count;

    results.forEach((pokemon) => {
      let urlApiDetails = pokemon.url;

      axios({
        method: "GET",
        url: `${urlApiDetails}`,
      }).then((response) => {
        const { id, name, sprites, types } = response.data;

        const infoCard = {
          nome: name,
          code: id,
          image: sprites.other.dream_world.front_default,
          type: types[0].type.name,
        };

        createCardPokemon(
          infoCard.code,
          infoCard.type,
          infoCard.nome,
          infoCard.image
        );

        const cardPokemon = document.querySelectorAll(
          ".js-open-details-pokemon"
        );

        cardPokemon.forEach((card) => {
          card.addEventListener("click", openDetailsPokemon);
        });
      });
    });
  });
}

listingPokemons("https://pokeapi.co/api/v2/pokemon?limit=9&offset=0");

function openDetailsPokemon() {
  document.documentElement.classList.add("open-modal");

  let codePokemon = this.getAttribute("code-pokemon");
  let imagePokemon = this.querySelector(".thumb-img");
  let iconPokemon = this.querySelector(".info .icon img");
  let namePokemon = this.querySelector(".info h3").textContent;
  let codeStringPokemon = this.querySelector(".info span").textContent;

  const modalDetails = document.getElementById("js-modal-details");
  const imgPokemonModal = document.getElementById("js-image-pokemon-modal");
  const iconTypePokemonModal = document.getElementById("js-image-type-modal");
  const namePokemonModal = document.getElementById("js-name-pokemon-modal");
  const codePokemonModal = document.getElementById("js-code-pokemon-modal");
  const heightPokemonModal = document.getElementById("js-height-pokemon");
  const weightPokemonModal = document.getElementById("js-weight-pokemon");
  const abilityPokemonModal = document.getElementById("js-ability-pokemon");

  imgPokemonModal.setAttribute("src", imagePokemon.getAttribute("src"));
  modalDetails.setAttribute("type-pokemon-modal", this.classList[2]);
  iconTypePokemonModal.setAttribute("src", iconPokemon.getAttribute("src"));

  namePokemonModal.innerText = namePokemon;
  codePokemonModal.innerText = codeStringPokemon;

  axios({
    method: "GET",
    url: `https://pokeapi.co/api/v2/pokemon/${codePokemon}`,
  }).then((response) => {
    let data = response.data;

    let infoPokemon = {
      mainAbility: primeiraLetraMaiuscula(data.abilities[0].ability.name),
      weight: data.weight,
      height: data.height,
      abilities: data.abilities,
      stats: data.stats,
      urlType: data.types[0].type.url,
    };

    function listingTypesPokemon() {
      const areaTypesModal = document.getElementById("js-types-pokemon");

      areaTypesModal.innerHTML = "";

      response.data.types.forEach((itemType) => {
        let itemList = document.createElement("li");
        areaTypesModal.appendChild(itemList);

        let spanList = document.createElement("span");
        spanList.classList = `tag-type ${itemType.type.name}`;
        spanList.textContent = itemType.type.name;

        itemList.appendChild(spanList);
      });
    }
    listingTypesPokemon();

    function listingWeakPokemon() {
      const areaWeak = document.getElementById("js-area-weak");

      areaWeak.innerHTML = "";

      axios({
        method: "GET",
        url: `${infoPokemon.urlType}`,
      }).then((response) => {
        let weaks = response.data.damage_relations.double_damage_from;

        weaks.forEach((itemType) => {
          let itemListWeak = document.createElement("li");
          areaWeak.appendChild(itemListWeak);

          let spanList = document.createElement("span");
          spanList.classList = `tag-type ${itemType.name}`;
          spanList.textContent = itemType.name;

          itemListWeak.appendChild(spanList);
        });
      });
    }

    listingWeakPokemon();

    heightPokemonModal.textContent = `${infoPokemon.height / 10}m`;
    weightPokemonModal.textContent = `${infoPokemon.weight / 10}kg`;
    abilityPokemonModal.textContent = infoPokemon.mainAbility;

    const statsHp = document.getElementById("js-stats-hp");
    statsHp.style.width = `${infoPokemon.stats[0].base_stat}%`;

    const statsAttack = document.getElementById("js-stats-attack");
    statsAttack.style.width = `${infoPokemon.stats[1].base_stat}%`;

    const statsDefense = document.getElementById("js-stats-defense");
    statsDefense.style.width = `${infoPokemon.stats[2].base_stat}%`;

    const statsSpAttack = document.getElementById("js-stats-sp");
    statsSpAttack.style.width = `${infoPokemon.stats[3].base_stat}%`;

    const statsSpDefense = document.getElementById("js-stats-sp-defense");
    statsSpDefense.style.width = `${infoPokemon.stats[4].base_stat}%`;

    const statsSpeed = document.getElementById("js-stats-speed");
    statsSpeed.style.width = `${infoPokemon.stats[5].base_stat}%`;
  });
}

function closeDetailsPokemon() {
  document.documentElement.classList.remove("open-modal");
}

//script para listar os tipos de pokemon

const areaTypes = document.getElementById("js-type-area");
const areaTypesMobile = document.querySelector(".dropdown-select");

axios({
  method: "GET",
  url: "https://pokeapi.co/api/v2/type",
}).then((response) => {
  const { results } = response.data;

  results.forEach((type, index) => {
    if (index < 18) {
      //desktop
      let itemType = document.createElement("li");
      areaTypes.appendChild(itemType);

      let buttonType = document.createElement("button");
      buttonType.classList = `type-filter ${type.name}`;
      buttonType.setAttribute("code-type", index + 1);
      itemType.appendChild(buttonType);

      let iconType = document.createElement("div");
      iconType.classList = "icon";
      buttonType.appendChild(iconType);

      let srcType = document.createElement("img");
      srcType.setAttribute("src", `img/icon-types/${type.name}.svg`);
      iconType.appendChild(srcType);

      let nameType = document.createElement("span");
      nameType.textContent = primeiraLetraMaiuscula(type.name);
      buttonType.appendChild(nameType);

      //mobile
      let itemTypeMobile = document.createElement("li");
      areaTypesMobile.appendChild(itemTypeMobile);

      let buttonTypeMobile = document.createElement("button");
      buttonTypeMobile.classList = `type-filter ${type.name}`;
      buttonTypeMobile.setAttribute("code-type", index + 1);
      itemTypeMobile.appendChild(buttonTypeMobile);

      let iconTypeMobile = document.createElement("div");
      iconTypeMobile.classList = "icon";
      buttonTypeMobile.appendChild(iconTypeMobile);

      let srcTypeMobile = document.createElement("img");
      srcTypeMobile.setAttribute("src", `img/icon-types/${type.name}.svg`);
      iconTypeMobile.appendChild(srcTypeMobile);

      let nameTypeMobile = document.createElement("span");
      nameTypeMobile.textContent = primeiraLetraMaiuscula(type.name);
      buttonTypeMobile.appendChild(nameTypeMobile);

      const allTypes = document.querySelectorAll(".type-filter");

      allTypes.forEach((type) => {
        type.addEventListener("click", filterByTypes);
      });
    }
  });
});

//script que faz a funcionalidade do load more

const btnLoadMore = document.getElementById("js-btn-load-more");

let countPagination = 10;

function showMorePokemon() {
  listingPokemons(
    `https://pokeapi.co/api/v2/pokemon?limit=9&offset=${countPagination}`
  );

  countPagination = countPagination + 9;
}

btnLoadMore.addEventListener("click", showMorePokemon);

//script para filtrar os pokemons por tipo

function filterByTypes() {
  let idPokemon = this.getAttribute("code-type");

  const areaPokemons = document.getElementById("js-list-pokemons");

  const btnLoadMore = document.getElementById("js-btn-load-more");

  const countPokemonsType = document.getElementById("js-count-pokemons");

  const allTypes = document.querySelectorAll(".type-filter");

  areaPokemons.innerHTML = "";

  btnLoadMore.style.display = "none";

  const sectionPokemons = document.querySelector(".s-all-info-pokemons");
  const topSection = sectionPokemons.offsetTop;

  window.scrollTo({
    top: topSection + 288,
    behavior: "smooth",
  });

  allTypes.forEach((type) => {
    type.classList.remove("active");
  });

  this.classList.add("active");

  if (idPokemon) {
    axios({
      method: "GET",
      url: `https://pokeapi.co/api/v2/type/${idPokemon}`,
    }).then((response) => {
      const { pokemon } = response.data;
      countPokemonsType.textContent = pokemon.length;

      pokemon.forEach((pok) => {
        const { url } = pok.pokemon;

        axios({
          method: "GET",
          url,
        }).then((response) => {
          const { id, name, sprites, types } = response.data;

          const infoCard = {
            nome: name,
            code: id,
            image: sprites.other.dream_world.front_default,
            type: types[0].type.name,
          };

          if (infoCard.image) {
            createCardPokemon(
              infoCard.code,
              infoCard.type,
              infoCard.nome,
              infoCard.image
            );
          }

          const cardPokemon = document.querySelectorAll(
            ".js-open-details-pokemon"
          );

          cardPokemon.forEach((card) => {
            card.addEventListener("click", openDetailsPokemon);
          }),
            (btnLoadMore.style.display = "block");
        });
      });
    });
  } else {
    areaPokemons.innerHTML = "";
    listingPokemons("https://pokeapi.co/api/v2/pokemon?limit=9&offset=0");
    btnLoadMore.style.display = "block";
  }
}

//script para buscar pokemon

const inputSearch = document.getElementById("js-input-search");
const btnSearch = document.getElementById("js-btn-search");

btnSearch.addEventListener("click", searchPokemon);

inputSearch.addEventListener("keyup", (e) => {
  if (e.code === "Enter") {
    searchPokemon();
  }
});

function searchPokemon() {
  const countPokemons = document.getElementById("js-count-pokemons");
  let valueInput = inputSearch.value;
  const typeFilter = document.querySelectorAll(".type-filter");

  typeFilter.forEach((type) => {
    type.classList.remove("active");
  });

  axios({
    method: "GET",
    url: `https://pokeapi.co/api/v2/pokemon/${valueInput}`,
  })
    .then((response) => {
      areaPokemons.innerHTML = "";
      btnLoadMore.style.display = "none";
      countPokemons.textContent = 1;
      const { id, name, sprites, types } = response.data;

      const infoCard = {
        nome: name,
        code: id,
        image: sprites.other.dream_world.front_default,
        type: types[0].type.name,
      };

      if (infoCard.image) {
        createCardPokemon(
          infoCard.code,
          infoCard.type,
          infoCard.nome,
          infoCard.image
        );
      }

      const cardPokemon = document.querySelectorAll(".js-open-details-pokemon");

      cardPokemon.forEach((card) => {
        card.addEventListener("click", openDetailsPokemon);
      });
    })
    .catch((error) => {
      if (error.response) {
        areaPokemons.innerHTML = "";
        btnLoadMore.style.display = "none";
        countPokemons.textContent = 0;
        alert("Pokemon não encontrado");
      }
    });
}
