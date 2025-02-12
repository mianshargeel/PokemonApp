async function searchPokemon() {
  let value  = document.getElementById('poko-search').value.toLowerCase().trim();
  pokemonContainerRef.innerHTML = '';
  if (value.length == 0 ||value.length < 3) { return arrayOfAllPokemons.forEach(pokemon => renderPokemonCard(pokemon)) }
  try {
    let response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=1000`);
    let data = await response.json();
    let filteredPokemons = data.results.filter(pokemon => pokemon.name.toLowerCase().includes(value));
    if (!filteredPokemons.length) return showingSearchErrorMsg(value);
    for (let p of filteredPokemons) renderPokemonCard(await (await fetch(p.url)).json());
  } catch (error) {
     console.error("Error fetching Pokémon:", error);
  }
}

function showingSearchErrorMsg(value) {
  let errorMsg = document.createElement('p');
  errorMsg.classList.add('search-error-popup');
  errorMsg.innerHTML = `There is no Pokemon exit with the: "${value}"`;
  pokemonContainerRef.appendChild(errorMsg);
  setTimeout(() => {
    errorMsg.remove(); 
  }, 2000);
}