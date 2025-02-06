function renderPokemonCardHtml(pokemon) {
  return `
    <h5>${pokemon.name.toUpperCase()}</h5>
    <img src="${pokemon.sprites.other['official-artwork'].front_default}" alt="${pokemon.name}" width="100">
  `;
}
