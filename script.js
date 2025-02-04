let pokemonUrl = "https://pokeapi.co/api/v2/pokemon?limit=30";
let pokemonContainerRef = document.getElementById('pokemonContainer');

function init() {
  fetchPokemons();
}

async function fetchPokemons() {

  let response = await fetch(pokemonUrl);
  let data = await response.json();
  let results = data.results;
  // console.log(data);

  for (let i = 0; i < results.length; i++) {
    let pokemon = await fetch(results[i].url);
    let pokCards = await pokemon.json();
    let pokemonContentRef = document.createElement('div');
    pokemonContentRef.className = ('pokemon-card');
    pokemonContentRef.innerHTML = '';

      console.log(pokCards.sprites);

    // Use high-quality images if available
    let pokemonImage = pokCards.sprites.other["official-artwork"].front_default; 

    pokemonContentRef.innerHTML += `
      <h3> ${pokCards.name}</h3>
      <img class='pokemon-img' src="${pokemonImage}" alt="" />
       <p>Ability: ${pokCards.abilities[0].ability.name}</p>
       <p>Base Experience: ${pokCards.base_experience}</p>
       <p>Height: ${pokCards.height}0cm</p>
       <p>Weight: ${pokCards.weight}kg</p>
    `;
    pokemonContainerRef.appendChild(pokemonContentRef);
  }
}