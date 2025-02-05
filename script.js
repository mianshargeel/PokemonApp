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
      }, 3000);
    }
  } catch (error) {
    console.log("Error Fetching Pokrmon: ", error);
  } 
  offset += limit; //loading more cards
}

function renderPokemonCard(pokemon) {
    let card = document.createElement('div');
    card.classList.add('pokemon-card');
    card.style.backgroundColor = colours[pokemon.types[0].type.name] || '#777';
    console.log(pokemon.types.map(t => t.type.name).join(` `));
    //to add types of pokemon sepperatly
  let pokemonTypesRef = document.createElement('div');
  pokemonTypesRef.classList.add('pokemon-types');

  pokemon.types.forEach(typeObj => {
    let typeSpanRef = document.createElement('span');
    typeSpanRef.classList.add('poko-type');
    typeSpanRef.innerText = typeObj.type.name;
    typeSpanRef.style.backgroundColor = colours[typeObj.type.name] || '#555'; //color based on type
    pokemonTypesRef.appendChild(typeSpanRef);
  });
  
    card.innerHTML = `
    <h5>${pokemon.name.toUpperCase()}</h5>
    <span class='poko-id'>ID: ${pokemon.id}</span>
    <img src="${pokemon.sprites.other['official-artwork'].front_default}" alt="${pokemon.name}" width="100">
  `;
  card.appendChild(pokemonTypesRef);
  pokemonContainerRef.appendChild(card);
 
}

function loadMorePokemon() {
  fetchPokemon();
}