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
let allPokemons = [];
let arrayOfAllPokemons = [];
let currentPokemonIndex = 0;
 
function init() {
  fetchPokemon();
}

async function fetchPokemonDetails(url) {
  let res = await fetch(url);
  let pokemonDetails = await res.json();
  arrayOfAllPokemons.push(pokemonDetails);
  setTimeout(() => {
    renderPokemonCard(pokemonDetails);
    loadTextRef.style.display = 'none';
    loadMoreButtonRef.style.display = 'block';
  }, 2000);
}

async function fetchPokemon() {
  loadTextRef.style.display = 'block';
  loadMoreButtonRef.style.display = 'none';
  try {
    let response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
    allPokemons= await response.json();
    await Promise.all(allPokemons.results.map(pokemon => fetchPokemonDetails(pokemon.url)));  
  } catch (error) {
    loadTextRef.innerHTML = `Error Fetching Pokémon: ${error}`;
  }
  offset += limit;
}

function renderPokemonCard(pokemon) {
  let card = document.createElement('div');
  card.classList.add('pokemon-card');
  card.style.backgroundColor = colours[pokemon.types[0].type.name] || '#777';
  
  card.innerHTML = renderPokemonCardHtml(pokemon);
  card.appendChild(creatingPokemonTypes(pokemon));
  card.onclick = () => showPokemonModelAndDetails(pokemon); 
  pokemonContainerRef.appendChild(card);
}

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

function loadMorePokemon() {
  fetchPokemon();
}

