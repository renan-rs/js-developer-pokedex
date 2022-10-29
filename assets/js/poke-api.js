
const pokeApi = {};

function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon();
    pokemon.number = pokeDetail.id;
    pokemon.name = pokeDetail.name;

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name);
    const [type] = types;

    pokemon.types = types;
    pokemon.type = type;

    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default;

    let totalAbilities = 0;
    pokemon.about.push(['species', pokeDetail.species.name]);
    pokemon.about.push(['height', pokeDetail.height / 10 > 0 ? `${pokeDetail.height / 10} m` : `${pokeDetail.height / 10} cm`]);
    pokemon.about.push(['weight', pokeDetail.weight / 10 > 0 ? `${pokeDetail.weight / 10} kg` : `${pokeDetail.weight / 10} g`]);
    pokemon.about.push(['abilities', pokeDetail.abilities.map((ability) => ability.ability.name).join(', ')]);
    pokemon.baseStats = pokeDetail.stats.map((baseStat) => {
        const statName = baseStat.stat.name === 'special-attack' 
                        ? 'Sp. Atk' 
                        : baseStat.stat.name === 'special-defense' 
                        ? 'Sp. Def' 
                        : baseStat.stat.name;

        totalAbilities += baseStat.base_stat;
        
        return [statName,  baseStat.base_stat]
    });
    pokemon.baseStats.push(['total', totalAbilities]);

    return pokemon;
}

pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemon);
}

pokeApi.getPokemonById = (id) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    return fetch(url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemon);
}

pokeApi.getPokemons = (offset = 0, limit = 5) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;

    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
        .then((detailRequests) => Promise.all(detailRequests))
        .then((pokemonsDetails) => pokemonsDetails);
}
