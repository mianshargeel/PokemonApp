/**
 * Displays a modal with detailed information about a Pokémon.
 * 
 * @param {Object} pokemon - The Pokémon object to display in the modal.
 */
function showPokemonModelAndDetails(pokemon) {
  currentPokemonIndex = arrayOfAllPokemons.findIndex(p => p.name === pokemon.name); 
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

/**
 * Hides the Pokémon modal when clicking outside of it.
 * 
 * @param {Event} e - The click event.
 */
function hideOverlayWhenClickBesideModel(e) {
  let overlay = document.querySelector('.pokemon-overlay')
  if (e.target === overlay) {
    overlay.remove();
    document.body.classList.remove('no-scroll');
  }
}

/**
 * Displays the next Pokémon in the modal.
 */
async function getNextPokemonCard() {
  if (currentPokemonIndex < arrayOfAllPokemons.length - 1) {
    currentPokemonIndex++;
    let nextPokemon = arrayOfAllPokemons[currentPokemonIndex];
    updatePokemonModel(nextPokemon);
    if (currentPokemonIndex === arrayOfAllPokemons.length - 1) {
      document.querySelector('#right-arrow').classList.add('d-none-arrow'); 
    }
  }
}

/**
 * Displays the previous Pokémon in the modal.
 */
async function getLastPokemonCard() {
  if (currentPokemonIndex > 0) {
    currentPokemonIndex--;
    let prevPokemon = arrayOfAllPokemons[currentPokemonIndex]; 
    updatePokemonModel(prevPokemon);
    if (currentPokemonIndex == 0) {
      document.querySelector('#left-arrow').classList.add('d-none-arrow');
    }
  } 
}

/**
 * Updates the modal with the details of the specified Pokémon.
 * 
 * @param {Object} pokemon - The Pokémon object to update the modal with.
 */
async function updatePokemonModel(pokemon) {
  let model = document.querySelector('.pokemon-model');
  model.style.backgroundColor = colours[pokemon.types[0].type.name];
  model.innerHTML = showPokemonModelAndDetailsHtml(pokemon);

  await fetchEvolutionChain(pokemon);
  fetchMoves(pokemon);
}

/**
 * Activates the specified tab and deactivates others.
 * 
 * @param {string} tabId - The ID of the tab to activate.
 */
function showTab(tabId) { 
  document.querySelectorAll('.tab-pane').forEach(tab => tab.classList.remove('active')); 
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

  document.getElementById(tabId).classList.add('active');
  document.querySelector(`span[onclick="showTab('${tabId}')"]`).classList.add('active');
}

/**
 * Fetches and displays the first 10 moves of the specified Pokémon.
 * 
 * @param {Object} pokemon - The Pokémon object to fetch moves for.
 */
function fetchMoves(pokemon) {
  let movesList = pokemon.moves.slice(0, 10).map(move => move.move.name).join(', ');   
  document.getElementById('moves').innerHTML = `<p>${movesList}</p>`;
}

/**
 * Processes the evolution chain data to extract evolution stages and levels.
 * 
 * @param {Object} evolutionData - The evolution chain data to process.
 */
function processEvolutionChain(evolutionData) {
  let evoStage = evolutionData.chain, evoChain = [], levels = [], level = 1;
  while (evoStage) {
    evoChain.push(evoStage.species.name);
    levels.push(level);
    evoStage = evoStage.evolves_to.length ? evoStage.evolves_to[0] : null;
    level += 10;
  }
  renderEvolutionChart(evoChain, levels);
}

/**
 * Fetches the evolution chain for the specified Pokémon.
 * 
 * @param {Object} pokemon - The Pokémon object to fetch the evolution chain for.
 */
async function fetchEvolutionChain(pokemon) {
  try {
    let speciesRes = await fetch(pokemon.species.url);
    let speciesData = await speciesRes.json();
    let evolutionRes = await fetch(speciesData.evolution_chain.url);
    processEvolutionChain(await evolutionRes.json());
  } catch (error) {
    console.error("Error fetching evolution chain:", error);
  }
}

/**
 * Renders a chart displaying the Pokémon's evolution stages and levels.
 * 
 * @param {Array<string>} evoChain - The names of the Pokémon's evolution stages.
 * @param {Array<number>} evolutionLevels - The levels at which the Pokémon evolves.
 */
function renderEvolutionChart(evoChain, evolutionLevels) {
  let ctx = document.getElementById('evolutionChart').getContext('2d');
  if (window.evolutionChart instanceof Chart) {
    window.evolutionChart?.destroy()
  } 
  window.evolutionChart = new Chart(ctx, {
    type: 'bar', data: { labels: evoChain, 
      datasets: [{ label: 'Evolution Level', data: evolutionLevels,  borderColor: 'rgba(54, 162, 235, 1)',
      backgroundColor: 'rgba(54, 162, 235, 0.2)', borderWidth: 2
      }]
    },
    options: { responsive: true, scales: { y: { beginAtZero: true } } }
  });
}