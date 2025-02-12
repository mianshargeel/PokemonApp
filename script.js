/**
 * This a Pokemon-web-app-project
 * i have used fetch-api function here to get pokemon from Api
 * and have used Some concept of Advance JS i-e async-await, Promise.all(), chart.js, tyr-catch-block, filte() with callback arrow-function, in this Project.
 * First of all, i am fetching Pokemons from Api and showing in Dom then on-click on each pokemon user can see a pokemon-model with big screen and with the detail of that Pokemon, In Model i have used chart.js to show grafically some Abilities of Pokemon in grafical form. Durring creating this Project i have followed the Check-list from our Campus.
 */
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
 
function init() { 
  fetchPokemon();
}
/**
 * Through Api getting we are Pokemons one by one and at every response we are getting a Promise, I am using Promise.all() with await to make sure that all required Pokemon to fetch.
 * @param {*} pokemonList using to store all fetched-pokemon from Api
 * @returns 
 */
async function fetchPokemonDetails(pokemonList) {
  loadTextRef.style.display = 'block';
  loadMoreButtonRef.style.display = 'none';
  return await Promise.all(
    pokemonList.results.map(pokemon => fetch(pokemon.url).then(res => res.json()))
  );
}
/**
 * using fetchPokemonDetails(pokemonList) assinging in pokemonDetails and then through Spread-operator Pushing all Pokemon in Globally declared arrayOfAllPokemons, then i sorting ids to keeping clash of ids durring fetching data, to make sure in arrayOfAllPokemons all ids are in a sequence.Then Rendering the the Pokemon using renderPokemonCard(pokemon).
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
  }offset += limit;
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

