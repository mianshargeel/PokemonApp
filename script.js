const colours = {
	normal: '#A8A77A',
	fire: '#EE8130',
	water: '#6390F0',
	electric: '#F7D02C',
	grass: '#7AC74C',
	ice: '#96D9D6',
	fighting: '#C22E28',
	poison: '#A33EA1',
	ground: '#E2BF65',
	flying: '#A98FF3',
	psychic: '#F95587',
	bug: '#A6B91A',
	rock: '#B6A136',
	ghost: '#735797',
	dragon: '#6F35FC',
	dark: '#705746',
	steel: '#B7B7CE',
	fairy: '#D685AD',
};
let pokemonContainerRef = document.getElementById('pokemonContainer');
let loadMoreButtonRef = document.getElementById('load-more');
let loadTextRef = document.getElementById('loading-text');
let offset = 0;
let limit = 20;
let arrayOfAllPokemons = [];
let currentPokemonIndex = 0;
 
/**
 * Initializes the application by fetching the initial list of Pokémon.
 */
function init() { 
  fetchPokemon();
}

/**
 * Fetches detailed information for a list of Pokémon.
 * 
 * @param {Object} pokemonList - The list of Pokémon to fetch details for.
 * @returns {Promise<Array>} A promise that resolves to an array of detailed Pokémon information.
 */
async function fetchPokemonDetails(pokemonList) {
  loadTextRef.style.display = 'block';
  loadMoreButtonRef.style.display = 'none';
  return await Promise.all(
    pokemonList.results.map(pokemon => fetch(pokemon.url).then(res => res.json()))
  );
}

/**
 * Fetches a list of Pokémon from the PokeAPI and renders their cards.
 * 
 * @async
 * @throws {Error} If there is an error fetching the Pokémon data.
 */
async function fetchPokemon() {
  try {
    let response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
    let pokemonList = await response.json();
    let pokemonDetails = await fetchPokemonDetails(pokemonList);
    arrayOfAllPokemons.push(...pokemonDetails);
    arrayOfAllPokemons.sort((a, b) => a.id - b.id);
    pokemonDetails.forEach(pokemon => renderPokemonCard(pokemon));
    loadTextRef.style.display = 'none';
    loadMoreButtonRef.style.display = 'block';
  } catch (error) {
    loadTextRef.innerHTML = `Error Fetching Pokémon: ${error}`;
  }
  offset += limit;
}

/**
 * Renders a Pokémon card and appends it to the Pokémon container.
 * 
 * @param {Object} pokemon - The Pokémon object containing details to render.
 */
function renderPokemonCard(pokemon) {
  let card = document.createElement('div');
  card.classList.add('pokemon-card');
  card.style.backgroundColor = colours[pokemon.types[0].type.name] || '#777';
  
  card.innerHTML = renderPokemonCardHtml(pokemon);
  card.appendChild(creatingPokemonTypes(pokemon));
  card.onclick = () => showPokemonModelAndDetails(pokemon); 
  pokemonContainerRef.appendChild(card);
}

/**
 * Creates and returns a container with the Pokémon's types.
 * 
 * @param {Object} pokemon - The Pokémon object containing type information.
 * @returns {HTMLElement} A div element containing the Pokémon's types.
 */
function creatingPokemonTypes(pokemon) {
  let pokemonTypesRef = document.createElement('div');
  pokemonTypesRef.classList.add('pokemon-types');

  pokemon.types.forEach(typeObj => {
    let typeSpanRef = document.createElement('span');
    typeSpanRef.classList.add('poko-type');
    typeSpanRef.innerText = typeObj.type.name;
    typeSpanRef.style.backgroundColor = colours[typeObj.type.name] || '#555'; 
    pokemonTypesRef.appendChild(typeSpanRef);
  });
  return pokemonTypesRef;
}

/**
 * Loads more Pokémon by fetching the next set of Pokémon data.
 */
function loadMorePokemon() {
  fetchPokemon();
}
