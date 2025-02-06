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
 

function init() {
  fetchPokemon();
}

async function fetchPokemon() {
  loadTextRef.style.display = 'block'; //while loading cards from api
  loadMoreButtonRef.style.display = 'none';  

  try {
    let response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
    let data = await response.json();
   
    let results = data.results;//results is an array in data-object from api

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
  offset += limit; //loading more cards
}

function renderPokemonCard(pokemon) {
  let card = document.createElement('div');
  card.classList.add('pokemon-card');
  card.style.backgroundColor = colours[pokemon.types[0].type.name] || '#777';
  
  card.innerHTML = renderPokemonCardHtml(pokemon);
  card.appendChild(creatingPokemonTypes(pokemon));
  card.onclick = () => showPokemonWithDetails(pokemon); //This means that when a user clicks on a Pokémon card, the function will be exicute
  pokemonContainerRef.appendChild(card);
}

function showPokemonWithDetails(pokemon) {
  let overlay = document.createElement('div');
  let model = document.createElement('div');
  overlay.className = 'pokemon-overlay';
  model.className = 'pokemon-model';
  model.style.backgroundColor = colours[pokemon.types[0].type.name] || '#fff';

  model.innerHTML = `
    <div class="poko-header">
      <h3>${pokemon.name}</h3> <span class='close-btn' onclick='removePokemonModel()'>X</span> 
    </div>
    <div className="model-content">
      <img class='model-img' src="${pokemon.sprites.other.dream_world.front_default}" alt="${pokemon.name}" />
      <p><strong>Type:</strong> ${pokemon.types.map(t => t.type.name).join(', ')}</p>
      <p><strong>HP:</strong> ${pokemon.stats[0].base_stat}</p>
      <p><strong>Attack:</strong> ${pokemon.stats[1].base_stat}</p>
      <p><strong>Defense:</strong> ${pokemon.stats[2].base_stat}</p>
    </div>
  `;
  
  overlay.appendChild(model);
  document.body.appendChild(overlay);
  //adding event to overlay
  overlay.onclick = (e) => {if(e.target === overlay) overlay.remove()} //if user click on beside model pokemon card will remove
}
  
function removePokemonModel() {
  let overlay = document.querySelector('.pokemon-overlay');
  if (overlay) { overlay.remove() }
}

function creatingPokemonTypes(pokemon) {
  let pokemonTypesRef = document.createElement('div');
  pokemonTypesRef.classList.add('pokemon-types');

  pokemon.types.forEach(typeObj => {
    let typeSpanRef = document.createElement('span');
    typeSpanRef.classList.add('poko-type');
    typeSpanRef.innerText = typeObj.type.name;
    typeSpanRef.style.backgroundColor = colours[typeObj.type.name] || '#555'; //color based on type
    pokemonTypesRef.appendChild(typeSpanRef);
  });
  return pokemonTypesRef;
}

function loadMorePokemon() {
  fetchPokemon();
}

