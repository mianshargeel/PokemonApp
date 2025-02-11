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
  if (currentPokemonIndex < allPokemons.results.length - 1) {
    currentPokemonIndex++;
    let response = await fetch(allPokemons.results[currentPokemonIndex].url);
    let nextPokemon = await response.json();
    updatePokemonModel(nextPokemon);
  } 
}

async function getLastPokemonCard() {
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
  document.querySelectorAll('.tab-pane').forEach(tab => tab.classList.remove('active')); 
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

  document.getElementById(tabId).classList.add('active');
  document.querySelector(`span[onclick="showTab('${tabId}')"]`).classList.add('active');
}

function fetchMoves(pokemon) {
  let movesList = pokemon.moves.slice(0, 10).map(move => move.move.name).join(', ');   
  document.getElementById('moves').innerHTML = `<p>${movesList}</p>`;
}

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

function renderEvolutionChart(evoChain, evolutionLevels) {
  let ctx = document.getElementById('evolutionChart').getContext('2d');
  window.evolutionChart?.destroy(); 
  window.evolutionChart = new Chart(ctx, {
    type: 'bar', data: { labels: evoChain, 
      datasets: [{ label: 'Evolution Level', data: evolutionLevels,  borderColor: 'rgba(54, 162, 235, 1)',
      backgroundColor: 'rgba(54, 162, 235, 0.2)', borderWidth: 2
      }]
    },
    options: { responsive: true, scales: { y: { beginAtZero: true } } }
  });
}