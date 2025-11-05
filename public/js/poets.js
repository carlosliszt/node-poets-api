let poets = [];
let filteredPoets = [];
const modal = new bootstrap.Modal(document.getElementById('poetModal'));

function getPoetPhotoHtml(poet) {
    const randomGradient = getRandomGradient();

    if (poet.photo_url && poet.photo_url.trim() !== '') {
        return `
            <div class="poet-photo-container" style="height: 250px; overflow: hidden; border-radius: 15px 15px 0 0; background: #f8f9fa;">
                <img src="${poet.photo_url}" 
                     alt="${poet.name}" 
                     class="w-100 h-100 poet-photo" 
                     style="object-fit: cover; display: block;"
                     data-poet-name="${poet.name}"
                     data-poet-pseudonym="${poet.pseudonym || ''}"
                     data-gradient="${randomGradient}">
            </div>
            <div class="p-3 bg-gradient text-black" style="background: linear-gradient(135deg, ${randomGradient});">
                <h5 class="fw-bold mb-0">${poet.name}</h5>
                ${poet.pseudonym ? `<p class="mb-0"><small>"${poet.pseudonym}"</small></p>` : ''}
            </div>
        `;
    }

    return `
        <div class="poet-card-img bg-gradient" style="background: linear-gradient(135deg, ${randomGradient});">
            <div class="text-white p-4 h-100 d-flex flex-column justify-content-end">
                <h4 class="fw-bold mb-1">${poet.name}</h4>
                ${poet.pseudonym ? `<p class="mb-0"><small>"${poet.pseudonym}"</small></p>` : ''}
            </div>
        </div>
    `;
}

async function loadPoets() {
    try {
        const data = await apiCall(API_ENDPOINTS.POETS);
        poets = data.data;
        filteredPoets = poets;

        displayPoets(poets);
        populateFilters();

        setupImageErrorHandlers();

        if (checkAuth()) {
            document.getElementById('btnCreate').style.display = 'block';
        }
    } catch (error) {
        console.error('Error loading poets:', error);
        showToast('Erro ao carregar poetas', 'danger');
    }
}

function setupImageErrorHandlers() {
    setTimeout(() => {
        document.querySelectorAll('.poet-photo').forEach(img => {
            img.onload = function() {
                console.log('✅ Foto carregada:', this.src);
            };

            img.onerror = function() {
                console.error('❌ Erro ao carregar foto:', this.src);
                const name = this.getAttribute('data-poet-name');
                const pseudonym = this.getAttribute('data-poet-pseudonym');
                const gradient = this.getAttribute('data-gradient');

                const fallbackHtml = `
                    <div class="poet-card-img bg-gradient" style="background: linear-gradient(135deg, ${gradient}); height: 250px; border-radius: 15px 15px 0 0;">
                        <div class="text-white p-4 h-100 d-flex flex-column justify-content-end">
                            <h4 class="fw-bold mb-1">${name}</h4>
                            ${pseudonym ? `<p class="mb-0"><small>"${pseudonym}"</small></p>` : ''}
                        </div>
                    </div>
                `;

                this.parentElement.outerHTML = fallbackHtml;
            };
        });
    }, 100);
}

function displayPoets(poetsToDisplay) {
    const container = document.getElementById('poetsContainer');

    if (poetsToDisplay.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="bi bi-search display-1 text-muted"></i>
                <p class="text-muted mt-3">Nenhum poeta encontrado</p>
            </div>
        `;
        return;
    }

    container.innerHTML = poetsToDisplay.map(poet => `
        <div class="col-md-6 col-lg-4 animate-slide-in">
            <div class="card shadow-sm h-100">
                ${getPoetPhotoHtml(poet)}
                <div class="card-body">
                    <div class="mb-3">
                        ${poet.nationality ? `<span class="badge bg-primary me-2">
                            <i class="bi bi-flag me-1"></i>${poet.nationality}
                        </span>` : ''}
                        ${poet.literary_movement ? `<span class="badge bg-secondary">
                            <i class="bi bi-bookmark me-1"></i>${poet.literary_movement}
                        </span>` : ''}
                    </div>
                    ${poet.birth_year || poet.death_year ? `
                        <p class="text-muted mb-2">
                            <i class="bi bi-calendar me-2"></i>
                            ${poet.birth_year || '?'} - ${poet.death_year || 'presente'}
                        </p>
                    ` : ''}
                    <p class="card-text">${truncateText(poet.biography, 100)}</p>
                </div>
                <div class="card-footer bg-transparent border-0 pb-3">
                    <div class="btn-group w-100" role="group">
                        <a href="poet-detail.html?id=${poet.id}" class="btn btn-outline-primary">
                            <i class="bi bi-eye me-1"></i>Ver
                        </a>
                        ${checkAuth() ? `
                            <button class="btn btn-outline-warning" onclick="editPoet(${poet.id})">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button class="btn btn-outline-danger" onclick="deletePoet(${poet.id})">
                                <i class="bi bi-trash"></i>
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function populateFilters() {
    const nationalities = [...new Set(poets.map(p => p.nationality).filter(Boolean))];
    const movements = [...new Set(poets.map(p => p.literary_movement).filter(Boolean))];

    const nationalitySelect = document.getElementById('filterNationality');
    nationalitySelect.innerHTML = '<option value="">Todas as nacionalidades</option>' +
        nationalities.map(n => `<option value="${n}">${n}</option>`).join('');

    const movementSelect = document.getElementById('filterMovement');
    movementSelect.innerHTML = '<option value="">Todos os movimentos</option>' +
        movements.map(m => `<option value="${m}">${m}</option>`).join('');
}

function filterPoets() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const nationality = document.getElementById('filterNationality').value;
    const movement = document.getElementById('filterMovement').value;

    filteredPoets = poets.filter(poet => {
        const matchesSearch = !searchTerm ||
            poet.name.toLowerCase().includes(searchTerm) ||
            (poet.pseudonym && poet.pseudonym.toLowerCase().includes(searchTerm)) ||
            (poet.biography && poet.biography.toLowerCase().includes(searchTerm));

        const matchesNationality = !nationality || poet.nationality === nationality;
        const matchesMovement = !movement || poet.literary_movement === movement;

        return matchesSearch && matchesNationality && matchesMovement;
    });

    displayPoets(filteredPoets);
}

function showCreateModal() {
    document.getElementById('modalTitle').innerHTML = '<i class="bi bi-person-plus me-2"></i>Adicionar Poeta';
    document.getElementById('poetForm').reset();
    document.getElementById('poetId').value = '';
    modal.show();
}

async function editPoet(id) {
    try {
        const data = await apiCall(API_ENDPOINTS.POET_BY_ID(id));
        const poet = data.data;

        document.getElementById('modalTitle').innerHTML = '<i class="bi bi-pencil me-2"></i>Editar Poeta';
        document.getElementById('poetId').value = poet.id;
        document.getElementById('name').value = poet.name || '';
        document.getElementById('pseudonym').value = poet.pseudonym || '';
        document.getElementById('birth_year').value = poet.birth_year || '';
        document.getElementById('death_year').value = poet.death_year || '';
        document.getElementById('nationality').value = poet.nationality || '';
        document.getElementById('literary_movement').value = poet.literary_movement || '';
        document.getElementById('biography').value = poet.biography || '';
        document.getElementById('photo_url').value = poet.photo_url || '';

        modal.show();
    } catch (error) {
        showToast('Erro ao carregar dados do poeta', 'danger');
    }
}

async function savePoet() {
    const form = document.getElementById('poetForm');
    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
    }

    const poetId = document.getElementById('poetId').value;
    const poetData = {
        name: document.getElementById('name').value,
        pseudonym: document.getElementById('pseudonym').value || null,
        birth_year: document.getElementById('birth_year').value || null,
        death_year: document.getElementById('death_year').value || null,
        nationality: document.getElementById('nationality').value || null,
        literary_movement: document.getElementById('literary_movement').value || null,
        biography: document.getElementById('biography').value || null,
        photo_url: document.getElementById('photo_url').value || null
    };

    showLoading();

    try {
        if (poetId) {
            await apiCall(API_ENDPOINTS.POET_BY_ID(poetId), {
                method: 'PUT',
                body: JSON.stringify(poetData)
            });
            showToast('Poeta atualizado com sucesso!', 'success');
        } else {
            await apiCall(API_ENDPOINTS.POETS, {
                method: 'POST',
                body: JSON.stringify(poetData)
            });
            showToast('Poeta criado com sucesso!', 'success');
        }

        modal.hide();
        loadPoets();
    } catch (error) {
        showToast(error.message || 'Erro ao salvar poeta', 'danger');
    } finally {
        hideLoading();
    }
}

async function deletePoet(id) {
    if (!confirm('Tem certeza que deseja deletar este poeta?')) return;

    showLoading();

    try {
        await apiCall(API_ENDPOINTS.POET_BY_ID(id), {
            method: 'DELETE'
        });
        showToast('Poeta deletado com sucesso!', 'success');
        loadPoets();
    } catch (error) {
        showToast(error.message || 'Erro ao deletar poeta', 'danger');
    } finally {
        hideLoading();
    }
}

function getRandomGradient() {
    const gradients = [
        '#667eea 0%, #764ba2 100%',
        '#f093fb 0%, #f5576c 100%',
        '#4facfe 0%, #00f2fe 100%',
        '#43e97b 0%, #38f9d7 100%',
        '#fa709a 0%, #fee140 100%',
        '#30cfd0 0%, #330867 100%'
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
}

document.getElementById('searchInput').addEventListener('input', filterPoets);
document.getElementById('filterNationality').addEventListener('change', filterPoets);
document.getElementById('filterMovement').addEventListener('change', filterPoets);

document.addEventListener('DOMContentLoaded', loadPoets);
