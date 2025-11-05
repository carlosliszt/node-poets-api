let poems = [];
let books = [];
const modal = new bootstrap.Modal(document.getElementById('poemModal'));
const viewModal = new bootstrap.Modal(document.getElementById('viewPoemModal'));

async function loadPoems() {
    try {
        const [poemsData, booksData] = await Promise.all([
            apiCall(API_ENDPOINTS.POEMS),
            apiCall(API_ENDPOINTS.BOOKS)
        ]);

        poems = poemsData.data;
        books = booksData.data;

        displayPoems(poems);
        populateFilters();
        populateBookSelect();

        if (checkAuth()) {
            document.getElementById('btnCreate').style.display = 'block';
        }
    } catch (error) {
        console.error('Error loading poems:', error);
        showToast('Erro ao carregar poemas', 'danger');
    }
}

function displayPoems(poemsToDisplay) {
    const container = document.getElementById('poemsContainer');

    if (poemsToDisplay.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="bi bi-search display-1 text-muted"></i>
                <p class="text-muted mt-3">Nenhum poema encontrado</p>
            </div>
        `;
        return;
    }

    container.innerHTML = poemsToDisplay.map(poem => `
        <div class="col-md-6 col-lg-4 animate-slide-in">
            <div class="card shadow-sm h-100">
                <div class="card-body">
                    <h5 class="card-title fw-bold text-warning">${poem.title}</h5>
                    <p class="text-muted small mb-2">
                        <i class="bi bi-book me-1"></i>${poem.book_title || 'Livro desconhecido'}
                    </p>
                    ${poem.poet_name ? `
                        <p class="text-muted small mb-2">
                            <i class="bi bi-person me-1"></i>${poem.poet_name}
                        </p>
                    ` : ''}
                    <div class="mb-3">
                        ${poem.style ? `<span class="badge bg-info me-1">${poem.style}</span>` : ''}
                        ${poem.theme ? `<span class="badge bg-secondary">${poem.theme}</span>` : ''}
                    </div>
                    <div class="poem-preview" style="font-family: 'Garamond', serif; font-size: 0.95rem; line-height: 1.6;">
                        ${truncateText(poem.content, 150)}
                    </div>
                    ${poem.verses_count || poem.stanzas_count ? `
                        <div class="mt-3 small text-muted">
                            ${poem.verses_count ? `<i class="bi bi-list-ol me-1"></i>${poem.verses_count} versos` : ''}
                            ${poem.stanzas_count ? `<i class="bi bi-layout-text-window ms-2 me-1"></i>${poem.stanzas_count} estrofes` : ''}
                        </div>
                    ` : ''}
                </div>
                <div class="card-footer bg-transparent border-0 pb-3">
                    <div class="btn-group w-100" role="group">
                        <button class="btn btn-outline-warning btn-sm" onclick="viewPoem(${poem.id})">
                            <i class="bi bi-eye me-1"></i>Ler
                        </button>
                        ${checkAuth() ? `
                            <button class="btn btn-outline-primary btn-sm" onclick="editPoem(${poem.id})">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button class="btn btn-outline-danger btn-sm" onclick="deletePoem(${poem.id})">
                                <i class="bi bi-trash"></i>
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

async function viewPoem(id) {
    try {
        const data = await apiCall(API_ENDPOINTS.POEM_BY_ID(id));
        const poem = data.data;

        document.getElementById('viewPoemTitle').innerHTML = `
            <i class="bi bi-feather me-2"></i>${poem.title}
        `;

        document.getElementById('viewPoemContent').innerHTML = `
            <div class="mb-3">
                <p class="text-muted mb-2">
                    <i class="bi bi-book me-2"></i><strong>Livro:</strong> ${poem.book_title || 'Desconhecido'}
                </p>
                ${poem.poet_name ? `
                    <p class="text-muted mb-2">
                        <i class="bi bi-person me-2"></i><strong>Poeta:</strong> ${poem.poet_name}
                    </p>
                ` : ''}
                <div class="mb-2">
                    ${poem.style ? `<span class="badge bg-info me-2">${poem.style}</span>` : ''}
                    ${poem.theme ? `<span class="badge bg-secondary me-2">${poem.theme}</span>` : ''}
                    ${poem.page_number ? `<span class="badge bg-dark">Página ${poem.page_number}</span>` : ''}
                </div>
            </div>
            <hr>
            <div class="poem-content">
                ${poem.content}
            </div>
            ${poem.notes ? `
                <hr>
                <div class="alert alert-info">
                    <i class="bi bi-info-circle me-2"></i><strong>Notas:</strong> ${poem.notes}
                </div>
            ` : ''}
        `;

        viewModal.show();
    } catch (error) {
        showToast('Erro ao carregar poema', 'danger');
    }
}

function populateFilters() {
    const bookTitles = [...new Set(poems.map(p => p.book_title).filter(Boolean))];
    const themes = [...new Set(poems.map(p => p.theme).filter(Boolean))];
    const styles = [...new Set(poems.map(p => p.style).filter(Boolean))];

    document.getElementById('filterBook').innerHTML = '<option value="">Todos os livros</option>' +
        bookTitles.map(t => `<option value="${t}">${t}</option>`).join('');

    document.getElementById('filterTheme').innerHTML = '<option value="">Todos os temas</option>' +
        themes.map(t => `<option value="${t}">${t}</option>`).join('');

    document.getElementById('filterStyle').innerHTML = '<option value="">Todos os estilos</option>' +
        styles.map(s => `<option value="${s}">${s}</option>`).join('');
}

// Populate book select in modal
function populateBookSelect() {
    const select = document.getElementById('book_id');
    select.innerHTML = '<option value="">Selecione...</option>' +
        books.map(b => `<option value="${b.id}">${b.title} - ${b.poet_name || 'Autor desconhecido'}</option>`).join('');
}

// Filter poems
function filterPoems() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const bookTitle = document.getElementById('filterBook').value;
    const theme = document.getElementById('filterTheme').value;
    const style = document.getElementById('filterStyle').value;

    const filtered = poems.filter(poem => {
        const matchesSearch = !searchTerm ||
            poem.title.toLowerCase().includes(searchTerm) ||
            (poem.content && poem.content.toLowerCase().includes(searchTerm));

        const matchesBook = !bookTitle || poem.book_title === bookTitle;
        const matchesTheme = !theme || poem.theme === theme;
        const matchesStyle = !style || poem.style === style;

        return matchesSearch && matchesBook && matchesTheme && matchesStyle;
    });

    displayPoems(filtered);
}

// Show create modal
function showCreateModal() {
    document.getElementById('modalTitle').innerHTML = '<i class="bi bi-pen me-2"></i>Adicionar Poema';
    document.getElementById('poemForm').reset();
    document.getElementById('poemId').value = '';
    modal.show();
}

// Edit poem
async function editPoem(id) {
    try {
        const data = await apiCall(API_ENDPOINTS.POEM_BY_ID(id));
        const poem = data.data;

        document.getElementById('modalTitle').innerHTML = '<i class="bi bi-pencil me-2"></i>Editar Poema';
        document.getElementById('poemId').value = poem.id;
        document.getElementById('title').value = poem.title || '';
        document.getElementById('book_id').value = poem.book_id || '';
        document.getElementById('content').value = poem.content || '';
        document.getElementById('page_number').value = poem.page_number || '';
        document.getElementById('verses_count').value = poem.verses_count || '';
        document.getElementById('stanzas_count').value = poem.stanzas_count || '';
        document.getElementById('style').value = poem.style || '';
        document.getElementById('theme').value = poem.theme || '';
        document.getElementById('notes').value = poem.notes || '';

        modal.show();
    } catch (error) {
        showToast('Erro ao carregar dados do poema', 'danger');
    }
}

// Save poem
async function savePoem() {
    const form = document.getElementById('poemForm');
    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
    }

    const poemId = document.getElementById('poemId').value;
    const poemData = {
        title: document.getElementById('title').value,
        book_id: parseInt(document.getElementById('book_id').value),
        content: document.getElementById('content').value,
        page_number: document.getElementById('page_number').value || null,
        verses_count: document.getElementById('verses_count').value || null,
        stanzas_count: document.getElementById('stanzas_count').value || null,
        style: document.getElementById('style').value || null,
        theme: document.getElementById('theme').value || null,
        notes: document.getElementById('notes').value || null
    };

    showLoading();

    try {
        if (poemId) {
            await apiCall(API_ENDPOINTS.POEM_BY_ID(poemId), {
                method: 'PUT',
                body: JSON.stringify(poemData)
            });
            showToast('Poema atualizado com sucesso!', 'success');
        } else {
            await apiCall(API_ENDPOINTS.POEMS, {
                method: 'POST',
                body: JSON.stringify(poemData)
            });
            showToast('Poema criado com sucesso!', 'success');
        }

        modal.hide();
        loadPoems();
    } catch (error) {
        showToast(error.message || 'Erro ao salvar poema', 'danger');
    } finally {
        hideLoading();
    }
}

// Delete poem
async function deletePoem(id) {
    if (!confirm('Tem certeza que deseja deletar este poema?')) return;

    showLoading();

    try {
        await apiCall(API_ENDPOINTS.POEM_BY_ID(id), {
            method: 'DELETE'
        });
        showToast('Poema deletado com sucesso!', 'success');
        loadPoems();
    } catch (error) {
        showToast(error.message || 'Erro ao deletar poema', 'danger');
    } finally {
        hideLoading();
    }
}

// Event listeners
document.getElementById('searchInput').addEventListener('input', filterPoems);
document.getElementById('filterBook').addEventListener('change', filterPoems);
document.getElementById('filterTheme').addEventListener('change', filterPoems);
document.getElementById('filterStyle').addEventListener('change', filterPoems);

// Initialize
document.addEventListener('DOMContentLoaded', loadPoems);
