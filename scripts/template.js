function renderPokemonCardHtml(pokemon) {
  return `
    <h5>${pokemon.name.toUpperCase()}</h5>
    <img src="${pokemon.sprites.other['official-artwork'].front_default}" alt="${pokemon.name}" width="100">
  `;
}

function showPokemonModelAndDetailsHtml(pokemon) {
  return `
    <div class="poko-header">
      <h3>${pokemon.name}</h3> <span class='close-btn' onclick='removePokemonModel()'>X</span> 
    </div>
    <div class="model-content">
      <img class='model-img' src="${pokemon.sprites.other.dream_world.front_default}" alt="${pokemon.name}" />
      <div class="model-content-details">
        <p>ID: ${pokemon.id}</p>
        <p><strong>Type:</strong> ${pokemon.types.map(t => t.type.name).join(', ')}</p>
        <p><strong>HP:</strong> ${pokemon.stats[0].base_stat}</p>
        <p><strong>Attack:</strong> ${pokemon.stats[1].base_stat}</p>
        <p><strong>Defense:</strong> ${pokemon.stats[2].base_stat}</p>
      </div>
    </div>
    <div class='poko-arrows'>
      <img onclick='getLastPokemonCard()' class='leftRight-arrows' src="./assets/img/left.png" alt="" />
      <img onclick='getNextPokemonCard()' class='leftRight-arrows' src="./assets/img/right.png" alt="" />
    </div>
  `;
}