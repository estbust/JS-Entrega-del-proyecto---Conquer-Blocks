const charactersContainer = document.getElementById('characters-container');
const searchInput = document.getElementById('search-input');
const statusFilter = document.getElementById('status-filter');
const modal = document.getElementById('character-modal');
const modalInfo = document.getElementById('modal-info');
const modalClose = document.getElementById('close-modal');
const cargarMasBtn = document.getElementById('load-more');
const cargandoMensaje = document.getElementById('loading-message');

let allCharacters = [];
let currentPage = 1;

const getCharacters = async () => { 
    cargandoMensaje.classList.remove('hidden');
    try {
        const datosPaginados = `https://rickandmortyapi.com/api/character?page=${currentPage}`;
        const respuestaPaginada = await fetch(datosPaginados);
        const dataPaginada = await respuestaPaginada.json();

        allCharacters = [...allCharacters, ...dataPaginada.results];

        aplicarFiltros();
    } catch (error) {
        console.error('Error al obtener los personajes:', error);
        charactersContainer.innerHTML = '<p class="error">¡Ups! Hubo un error al cargar los personajes. Por favor, intenta de nuevo más tarde.</p>';
    } finally {
        cargandoMensaje.classList.add('hidden');
    }
};

const renderCharacters = (charactersArray) => {
    charactersContainer.innerHTML = '';
    console.log(charactersArray);
    charactersArray.forEach(character => {
        const characterCard = document.createElement('div');
        characterCard.classList.add('card');

        characterCard.innerHTML = `
            <img src="${character.image}" alt="${character.name}">
            <div class="card-content">
                <h2>${character.name}</h2>
                <p class="status">
                    <span class="status-indicator ${character.status.toLowerCase()}"></span>
                    ${character.status} - ${character.species} - ${character.gender}
                </p>
            </div>
        `;

        characterCard.addEventListener('click', () => {

            modalInfo.innerHTML = `
                <img src="${character.image}" alt="${character.name}">
                <h2>${character.name}</h2>
                <p><strong>Estado:</strong> ${character.status}</p>
                <p><strong>Especie:</strong> ${character.species}</p>
                <p><strong>Género:</strong> ${character.gender}</p>
                <p><strong>Localización:</strong> ${character.location.name}</p>
                <p><strong>Origen:</strong> ${character.origin.name}</p>
                <p><strong>Cantidad de episodios:</strong> ${character.episode.length}</p>
                <p><strong>Creado el:</strong> ${new Date(character.created).toLocaleDateString()}</p>
                <p><strong>Lista de episodios en los que aparece:</strong> ${character.episode.map(ep => ep.split('/').pop()).join(', ')}</p>
            `;


            modal.classList.remove('hidden');
        });

        charactersContainer.appendChild(characterCard);
    });
};

const closeModal = () => {
    modal.classList.add('hidden');
};

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (event) => {
    if (event.target === modal) {
        closeModal();
    }
});

    const aplicarFiltros = () => {
        const textoBusqueda = searchInput.value.toLowerCase();
        const estadoSeleccionado = statusFilter.value.toLowerCase();

        const personajesFiltrados = allCharacters.filter(character => {
            const coincideNombre = character.name.toLowerCase().includes(textoBusqueda);
            const coincideEstado = character.status.toLowerCase() === estadoSeleccionado || estadoSeleccionado === '';
            return coincideNombre && coincideEstado;
        });
        renderCharacters(personajesFiltrados);
    };

    searchInput.addEventListener('input', aplicarFiltros);
    statusFilter.addEventListener('change', aplicarFiltros);

cargarMasBtn.addEventListener('click', () => {
    currentPage++;
    getCharacters();
});

getCharacters();