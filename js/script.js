let allCountries = [];
let favoriteCountries = [];

window.addEventListener('load', () => {
  fetchCountries();
});

async function fetchCountries() {
  // const response = await fetch('https://restcountries.eu/rest/v2/all');
  const response = await fetch('./js/apiCountries.json');
  const json = await response.json();
  allCountries = json
    .map(
      ({ numericCode: id, translations: { pt: name }, population, flag }) => ({
        id,
        name,
        population,
        formattedPopulation: formatNumber(population),
        flag,
      })
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  render();
}

function formatNumber(number) {
  return Intl.NumberFormat('pt-BR').format(number);
}

function render() {
  const tabCountries = document.querySelector('#tabCountries');
  const tabFavorites = document.querySelector('#tabFavorites');

  function renderCountryList() {
    let countriesHTML = '<div>';

    allCountries.forEach(({ id, name, flag, formattedPopulation }) => {
      const countryHTML = `
        <div class="country">
          <div>
            <a id="${id}" class="add-button waves-effect waves-light btn">+</a>
          </div>
          <div>
            <img src="${flag}" alt="Bandeira ${name}" />
          </div>
          <div>
            <ul>
              <li>${name}</li>
              <li>${formattedPopulation}</li>
            </ul>
          </div>
        </div>
      `;

      countriesHTML += countryHTML;
    });

    countriesHTML += '</div>';
    tabCountries.innerHTML = countriesHTML;
  }

  function renderFavoritesList() {
    let favoritesHTML = '<div>';

    favoriteCountries.forEach(({ id, name, flag, formattedPopulation }) => {
      const favoriteHTML = `
        <div class="country">
          <div>
            <a id="${id}" class="remove-button waves-effect waves-light btn red darken-4">-</a>
          </div>
          <div>
            <img src="${flag}" alt="Bandeira ${name}"/>
          </div>
          <div>
            <ul>
              <li>${name}</li>
              <li>${formattedPopulation}</li>
            </ul>
          </div>
        </div>
      `;

      favoritesHTML += favoriteHTML;
    });

    favoritesHTML += '</div>';
    tabFavorites.innerHTML = favoritesHTML;
  }

  function renderSummary() {
    const countCountries = document.querySelector('#countCountries');
    const countFavorites = document.querySelector('#countFavorites');
    const totalPopulationCountriesSpan = document.querySelector(
      '#totalPopulationList'
    );
    const totalPopulationFavoritesSpan = document.querySelector(
      '#totalPopulationFavorites'
    );

    countCountries.innerText = allCountries.length;
    countFavorites.innerText = favoriteCountries.length;

    const countriesPopulationSum = allCountries.reduce(
      (accumulator, { population }) => accumulator + population,
      0
    );

    const favoritesPopulationSum = favoriteCountries.reduce(
      (accumulator, { population }) => accumulator + population,
      0
    );

    totalPopulationCountriesSpan.innerText = formatNumber(
      countriesPopulationSum
    );
    totalPopulationFavoritesSpan.innerText = formatNumber(
      favoritesPopulationSum
    );
  }

  function handleCountryButtons() {
    let addButtons = Array.from(tabCountries.querySelectorAll('.add-button'));
    let removeButtons = Array.from(
      tabFavorites.querySelectorAll('.remove-button')
    );

    addButtons.forEach((button) =>
      button.addEventListener('click', () => addToFavorites(button.id))
    );

    removeButtons.forEach((button) =>
      button.addEventListener('click', () => removeFromFavorites(button.id))
    );

    function addToFavorites(id) {
      const countrytoAdd = allCountries.find((country) => country.id === id);

      favoriteCountries = [...favoriteCountries, countrytoAdd].sort((a, b) =>
        a.name.localeCompare(b.name)
      );

      allCountries = allCountries.filter((country) => country.id !== id);

      render();
    }

    function removeFromFavorites(id) {
      const countryToRemove = favoriteCountries.find(
        (country) => country.id === id
      );

      allCountries = [...allCountries, countryToRemove].sort((a, b) =>
        a.name.localeCompare(b.name)
      );

      favoriteCountries = favoriteCountries.filter(
        (country) => country.id !== id
      );

      render();
    }
  }

  renderCountryList();
  renderFavoritesList();
  renderSummary();
  handleCountryButtons();
}
