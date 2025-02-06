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
let limit = 30;
let allPokemons = [];
let currentPokemonIndex = 0;
 
function init() {
  fetchPokemon();
}

async function fetchPokemon() {
  loadTextRef.style.display = 'block'; 
  loadMoreButtonRef.style.display = 'none';  
  try {
    let response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
    let data = await response.json();
    allPokemons = data;
    let results = data.results;
    for (let i = 0; i < results.length; i++) {
      let res = await fetch(results[i].url);
      let pokemonDetails = await res.json();
      setTimeout(() => {
        renderPokemonCard(pokemonDetails);
        loadTextRef.style.display = 'none';
        loadMoreButtonRef.style.display = 'block';
      }, 2000);
    }
  } catch (error) {
    loadTextRef.innerHTML = `Error Fetching Pokrmon:  ${error}`;
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
//next functionalities Overlay/Model and there details
function showPokemonModelAndDetails(pokemon) {
  currentPokemonIndex = allPokemons.results.findIndex(p => p.name === pokemon.name); //getting the index of clicked card
  // console.log(currentPokemonIndex);
  
  let overlay = document.createElement('div');
  let model = document.createElement('div');
  overlay.className = 'pokemon-overlay';
  model.className = 'pokemon-model';
  model.style.backgroundColor = colours[pokemon.types[0].type.name] || '#fff';

  model.innerHTML = showPokemonModelAndDetailsHtml(pokemon);
  overlay.appendChild(model);
  document.body.appendChild(overlay);
  document.body.classList.add('no-scroll');

  overlay.onclick = hideOverlayWhenClickBesideModel; // Assign function reference (don't call it immediately)
}

function hideOverlayWhenClickBesideModel(e) {
  let overlay = document.querySelector('.pokemon-overlay')
  if (e.target === overlay) {
    overlay.remove();
    document.body.classList.remove('no-scroll');
    }
}

function removePokemonModel() {
  let overlay = document.querySelector('.pokemon-overlay');
  if (overlay) {
    overlay.remove();
    document.body.classList.remove('no-scroll');
  }
}

async function getNextPokemonCard() {
  console.log(currentPokemonIndex);

  if (currentPokemonIndex < allPokemons.results.length - 1) {
    currentPokemonIndex++;
    let response = await fetch(allPokemons.results[currentPokemonIndex].url);
    let nextPokemon = await response.json();
    updatePokemonModel(nextPokemon);
  } 
}

async function getLastPokemonCard() {
  console.log(currentPokemonIndex);
  
  if (currentPokemonIndex > 0) {
    currentPokemonIndex--;
    let response = await fetch(allPokemons.results[currentPokemonIndex].url);
    let prevPokemon = await response.json();
    updatePokemonModel(prevPokemon);
  } 
}

function updatePokemonModel(pokemon) {
  let model = document.querySelector('.pokemon-model');
  model.style.backgroundColor = colours[pokemon.types[0].type.name];
  model.innerHTML = showPokemonModelAndDetailsHtml(pokemon);
}
