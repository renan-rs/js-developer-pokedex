const pokemonList = document.getElementById('pokemonList');
const loadMoreButton = document.getElementById('loadMoreButton');
const modalContent = document.getElementById('modal-content');

const maxRecords = 151;
const limit = 10;
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}" data-id="${pokemon.number}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}-flat">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `;
}
function convertPokemonToModal(pokemon) {
    return `
        <div class="detailWrapper">
            <div class="detailHeader ${pokemon.type}">
                <div class="detail-title">
                    <span class="name">${pokemon.name}</span>
                    <span class="number">#${pokemon.number}</span>
                </div>
                <div class="detail-types">
                    <ol class="types">
                        ${pokemon.types.map((type) => `<li class="type ${type}-flat">${type}</li>`).join('')}
                    </ol>
                    <img src="${pokemon.photo}"
                    alt="${pokemon.name}">
                </div>
            </div>
            <div class="detail-specs">
                <div class="tabs">
                    <span id="btn-tab-about" class="tab-title selected-tab">About</span>
                    <span id="btn-tab-basestats" class="tab-title">Base Stats</span>
                </div>
                <div class="tab-content tab-open" id="tab-about">
                    ${pokemon.about.map((elem) => {
                        return `
                            <div class="field">
                                <span class="label">${elem[0]}</span>
                                <span class="value">${elem[1]}</span>
                            </div>
                        `;
                    }).join('')}
                </div>
                <div class="tab-content" id="tab-basestats">
                    ${pokemon.baseStats.map((elem) => {
                        return `
                            <div class="field">
                                <span class="label">${elem[0]}</span>
                                <span class="value">${elem[1]}</span>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        </div>
    `;
}

function listenerBaseStatsTab(){
    document.getElementById('btn-tab-about').classList.remove('selected-tab');
    document.getElementById('tab-about').classList.remove('tab-open');

    document.getElementById('btn-tab-basestats').classList.add('selected-tab');
    document.getElementById('tab-basestats').classList.add('tab-open');
}

function listenerAboutTab(){
    document.getElementById('btn-tab-basestats').classList.remove('selected-tab');
    document.getElementById('tab-basestats').classList.remove('tab-open');

    document.getElementById('btn-tab-about').classList.add('selected-tab');
    document.getElementById('tab-about').classList.add('tab-open');
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('');
        pokemonList.innerHTML += newHtml;
    })
}

loadMoreButton.addEventListener('click', () => {
    offset += limit;
    const qtdRecordsWithNexPage = offset + limit;

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset;
        loadPokemonItens(offset, newLimit);

        loadMoreButton.parentElement.removeChild(loadMoreButton);
    } else {
        loadPokemonItens(offset, limit);
    }
});

//get pokemon by id, and call convertPokemonToModal passing the pokemon
function getPokemonDetails(id) {
    pokeApi.getPokemonById(id).then((pokemon) => {
        if(!pokemon){
            modalContent.innerHTML = '<h2>Não encontrado</h2>';
            return;
        }
        const modalPokemon = convertPokemonToModal(pokemon);
        modalContent.innerHTML = modalPokemon;

        //add listeners to tab buttons;
        const btnBaseStats = document.getElementById('btn-tab-basestats');
        const btnAbout = document.getElementById('btn-tab-about');
        btnBaseStats.addEventListener('click', listenerBaseStatsTab);
        btnAbout.addEventListener('click', listenerAboutTab);
    })
}

const ulPokemons = document.getElementById('pokemonList');
const modal = document.getElementById('modalDetail');
const closeModal = modal.querySelectorAll(".modal-exit");

// clicked element on the Pokemon List
ulPokemons.addEventListener('click', function (e) {
    e.preventDefault();
    let target = e.target; // Clicked element
    while (target && target.parentNode !== ulPokemons) {
        target = target.parentNode; // If the clicked element isn't a direct child of ulPokemons keep going to parent above
        if(!target) { return; } // If element doesn't exist
    }
    if (target.tagName === 'LI'){
        // Check if the element is a LI and get the li attribute data-id
        getPokemonDetails(target.getAttribute('data-id'));
        modal.classList.add('open');
    }
});

// close click modal
closeModal.forEach(function (exit) {
    exit.addEventListener("click", function (e) {
        e.preventDefault();
        modal.classList.remove("open");
        
        //remove listeners from tab buttons;
        const btnBaseStats = document.getElementById('btn-tab-basestats');
        const btnAbout = document.getElementById('btn-tab-about');
        btnBaseStats.removeEventListener('click', listenerBaseStatsTab);
        btnAbout.removeEventListener('click', listenerAboutTab);
    });
});


loadPokemonItens(offset, limit);