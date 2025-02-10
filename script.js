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

async function fetchPokemon() {
  loadTextRef.style.display = 'block'; 
  loadMoreButtonRef.style.display = 'none';  
  pokemonContainerRef.innerHTML = '';
  try {
    let response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
    let data = await response.json();
    allPokemons = data;
    let results = data.results;
    for (let i = 0; i < results.length; i++) {
      let res = await fetch(results[i].url);
      let pokemonDetails = await res.json();
      arrayOfAllPokemons.push(pokemonDetails);//using this array in searchPokemon()
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

function showPokemonModelAndDetails(pokemon) {
  currentPokemonIndex = allPokemons.results.findIndex(p => p.name === pokemon.name); 
  let overlay = document.createElement('div');
  let model = document.createElement('div');
  overlay.className = 'pokemon-overlay';
  model.className = 'pokemon-model';
  model.style.backgroundColor = colours[pokemon.types[0].type.name] || '#fff';
  model.innerHTML = showPokemonModelAndDetailsHtml(pokemon);
  overlay.appendChild(model);
  document.body.appendChild(overlay);
  document.body.classList.add('no-scroll');
  updatePokemonModel(pokemon); 
  overlay.onclick = hideOverlayWhenClickBesideModel; 
}

function hideOverlayWhenClickBesideModel(e) {
  let overlay = document.querySelector('.pokemon-overlay')
  if (e.target === overlay) {
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

async function updatePokemonModel(pokemon) {
  let model = document.querySelector('.pokemon-model');
  model.style.backgroundColor = colours[pokemon.types[0].type.name];
  model.innerHTML = showPokemonModelAndDetailsHtml(pokemon);

  await fetchEvolutionChain(pokemon);
  fetchMoves(pokemon);
}

function showTab(tabId) { 
  document.querySelectorAll('.tab-pane').forEach(tab => tab.classList.remove('active')); //all four tabs in Model
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

  document.getElementById(tabId).classList.add('active');
  document.querySelector(`span[onclick="showTab('${tabId}')"]`).classList.add('active');
}

async function fetchEvolutionChain(pokemon) {
  try {
    let speciesResponse = await fetch(pokemon.species.url);
    let speciesData = await speciesResponse.json();
    let evolutionResponse = await fetch(speciesData.evolution_chain.url);
    let evolutionData = await evolutionResponse.json();
    let evoChain = [];
    let evoStage = evolutionData.chain;
    while (evoStage) { 
      evoChain.push(evoStage.species.name);
      evoStage = evoStage.evolves_to.length > 0 ? evoStage.evolves_to[0] : null;
    }
    let evolutionElement = document.getElementById('evolution');
    evolutionElement.innerHTML = `<p>${evoChain.join(' → ')}</p>`;
  } catch (error) { console.error("Error fetching evolution chain:", error) }
}

function fetchMoves(pokemon) {
  let movesList = pokemon.moves.slice(0, 10).map(move => move.move.name).join(', ');   
  document.getElementById('moves').innerHTML = `<p>${movesList}</p>`;
}

function toggleMenu() {
  const menu = document.querySelector(".menu-list");
  if (menu.style.display === "none" || menu.style.display === "") {
    menu.style.display = "block";
  } else {
    menu.style.display = "none";
  }
}

async function searchPokemon() {
  let searchPokemonRef = document.getElementById('poko-search');
  let value = searchPokemonRef.value.toLowerCase().trim(); // Get the search value and convert to lowercase

  // Clear the existing cards and error message
  pokemonContainerRef.innerHTML = '';

  if (value === '') {
    // If the search bar is empty, show all Pokémon
    arrayOfAllPokemons.forEach(pokemon => {
      renderPokemonCard(pokemon);
    });
    return;
  }

  // Filter the allPokemons array based on the search value
  let filteredPokemons = arrayOfAllPokemons.filter(pokemon => pokemon.name.toLowerCase().includes(value));

  if (filteredPokemons.length > 0) {
    // Render the filtered Pokémon cards
    filteredPokemons.forEach(pokemon => {
      renderPokemonCard(pokemon);
    });
  } else {
    // Display a message if no Pokémon match the search
    pokemonContainerRef.innerHTML = `<p>No Pokémon found with the name "${value}".</p>`;
  }
}

