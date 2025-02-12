function renderPokemonCardHtml(pokemon) {
  return `
    <h5>${pokemon.name.toUpperCase()}</h5>
    <img src="${pokemon.sprites.other['official-artwork'].front_default}" alt="${pokemon.name}" width="100">
  `;
}

function showPokemonModelAndDetailsHtml(pokemon) {
  return `
    <div class="poko-header">
      <h3>${pokemon.name.toUpperCase()}</h3> <span>#${pokemon.id}</span> 
    </div>
    <div class="model-content">
      <img class='model-img' src="${pokemon.sprites.other.dream_world.front_default}" alt="${pokemon.name}" />
    </div>
      
    <div class='tabs-and-details'>
        <div class="tab-menu">
          <span class="tab-btn active" onclick="showTab('about')">About</span>
          <span class="tab-btn" onclick="showTab('stats')">Base Stats</span>
          <span class="tab-btn" onclick="showTab('evolution')">Evolutions</span>
          <span class="tab-btn" onclick="showTab('moves')">Moves</span>
        </div>
        <div class="tab-content">
          <div id="about" class="tab-pane active">
            <p><strong>Type: </strong>${pokemon.types.map(t => t.type.name).join(', ')}</p>
            <p><strong>Height:</strong> ${pokemon.height / 10} m</p>
            <p><strong>Weight:</strong> ${pokemon.weight / 10} kg</p>
            <p><strong>Abilities:</strong> ${pokemon.abilities.map(a => a.ability.name).join(', ')}</p>
          </div>
          <div id="stats" class="tab-pane">
            <p><strong>HP:</strong> ${pokemon.stats[0].base_stat}</p>
            <p><strong>Attack:</strong> ${pokemon.stats[1].base_stat}</p>
            <p><strong>Defense:</strong> ${pokemon.stats[2].base_stat}</p>
            <p><strong>Sp. Attack:</strong> ${pokemon.stats[3].base_stat}</p>
            <p><strong>Sp. Defense:</strong> ${pokemon.stats[4].base_stat}</p>
            <p><strong>Speed:</strong> ${pokemon.stats[5].base_stat}</p>
          </div>
          <div id="evolution" class="tab-pane">
            <canvas id="evolutionChart"></canvas>
          </div>
          <div id="moves" class="tab-pane">
            <p>Loading moves data...</p>
          </div>
        </div>   
        <div class='poko-arrows'>
          <img id='left-arrow' onclick='getLastPokemonCard()' class='leftRight-arrows' src="./assets/img/left.png" alt="" />
          <img id='right-arrow' onclick='getNextPokemonCard()' class='leftRight-arrows' src="./assets/img/right.png" alt="" />
        </div>   
    </div>
  `;
}