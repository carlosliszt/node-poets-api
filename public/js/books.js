let books = [];
let poets = [];
const modal = new bootstrap.Modal(document.getElementById('bookModal'));

async function loadBooks() {
    try {
        const [booksData, poetsData] = await Promise.all([
            apiCall(API_ENDPOINTS.BOOKS),
            apiCall(API_ENDPOINTS.POETS)
        ]);

        books = booksData.data;
        poets = poetsData.data;

        displayBooks(books);
        populatePoetFilter();
        populatePoetSelect();

        if (checkAuth()) {
            document.getElementById('btnCreate').style.display = 'block';
        }
    } catch (error) {
        console.error('Error loading books:', error);
        showToast('Erro ao carregar livros', 'danger');
    }
}

function displayBooks(booksToDisplay) {
    const container = document.getElementById('booksContainer');

    if (booksToDisplay.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="bi bi-search display-1 text-muted"></i>
                <p class="text-muted mt-3">Nenhum livro encontrado</p>
            </div>
        `;
        return;
    }

    container.innerHTML = booksToDisplay.map(book => `
        <div class="col-md-6 col-lg-3 animate-slide-in">
            <div class="card shadow-sm h-100">
                ${getCoverHtml(book)}
                <div class="card-body">
                    <h5 class="card-title fw-bold">${book.title}</h5>
                    <p class="text-muted mb-2">
                        <i class="bi bi-person me-1"></i>${book.poet_name || 'Autor desconhecido'}
                    </p>
                    ${book.publication_year ? `
                        <p class="text-muted mb-2">
                            <i class="bi bi-calendar me-1"></i>${book.publication_year}
                        </p>
                    ` : ''}
                    ${book.publisher ? `
                        <p class="text-muted mb-2">
                            <i class="bi bi-building me-1"></i>${book.publisher}
                        </p>
                    ` : ''}
                    ${book.pages ? `
                        <p class="text-muted mb-2">
                            <i class="bi bi-file-earmark-text me-1"></i>${book.pages} páginas
                        </p>
                    ` : ''}
                    <p class="card-text small">${truncateText(book.description, 80)}</p>
                </div>
                <div class="card-footer bg-transparent border-0 pb-3">
                    <div class="btn-group w-100" role="group">
                        <a href="book-detail.html?id=${book.id}" class="btn btn-outline-success btn-sm">
                            <i class="bi bi-eye me-1"></i>Ver
                        </a>
                        ${checkAuth() ? `
                            <button class="btn btn-outline-warning btn-sm" onclick="editBook(${book.id})">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button class="btn btn-outline-danger btn-sm" onclick="deleteBook(${book.id})">
                                <i class="bi bi-trash"></i>
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function populatePoetFilter() {
    const select = document.getElementById('filterPoet');
    select.innerHTML = '<option value="">Todos os poetas</option>' +
        poets.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
}

function populatePoetSelect() {
    const select = document.getElementById('poet_id');
    select.innerHTML = '<option value="">Selecione...</option>' +
        poets.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
}

function filterBooks() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const poetId = document.getElementById('filterPoet').value;

    const filtered = books.filter(book => {
        const matchesSearch = !searchTerm ||
            book.title.toLowerCase().includes(searchTerm) ||
            (book.description && book.description.toLowerCase().includes(searchTerm)) ||
            (book.poet_name && book.poet_name.toLowerCase().includes(searchTerm));

        const matchesPoet = !poetId || book.poet_id == poetId;

        return matchesSearch && matchesPoet;
    });

    displayBooks(filtered);
}

function showCreateModal() {
    document.getElementById('modalTitle').innerHTML = '<i class="bi bi-book-half me-2"></i>Adicionar Livro';
    document.getElementById('bookForm').reset();
    document.getElementById('bookId').value = '';
    document.getElementById('language').value = 'Português';
    document.getElementById('edition').value = '1';
    modal.show();
}

async function editBook(id) {
    try {
        const data = await apiCall(API_ENDPOINTS.BOOK_BY_ID(id));
        const book = data.data;

        document.getElementById('modalTitle').innerHTML = '<i class="bi bi-pencil me-2"></i>Editar Livro';
        document.getElementById('bookId').value = book.id;
        document.getElementById('title').value = book.title || '';
        document.getElementById('poet_id').value = book.poet_id || '';
        document.getElementById('isbn').value = book.isbn || '';
        document.getElementById('publisher').value = book.publisher || '';
        document.getElementById('publication_year').value = book.publication_year || '';
        document.getElementById('pages').value = book.pages || '';
        document.getElementById('edition').value = book.edition || '1';
        document.getElementById('language').value = book.language || 'Português';
        document.getElementById('cover_url').value = book.cover_url || '';
        document.getElementById('description').value = book.description || '';

        modal.show();
    } catch (error) {
        showToast('Erro ao carregar dados do livro', 'danger');
    }
}

async function saveBook() {
    const form = document.getElementById('bookForm');
    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
    }

    const bookId = document.getElementById('bookId').value;
    const bookData = {
        title: document.getElementById('title').value,
        poet_id: parseInt(document.getElementById('poet_id').value),
        isbn: document.getElementById('isbn').value || null,
        publisher: document.getElementById('publisher').value || null,
        publication_year: document.getElementById('publication_year').value || null,
        pages: document.getElementById('pages').value || null,
        edition: document.getElementById('edition').value || 1,
        language: document.getElementById('language').value || 'Português',
        cover_url: document.getElementById('cover_url').value || null,
        description: document.getElementById('description').value || null
    };

    showLoading();

    try {
        if (bookId) {
            await apiCall(API_ENDPOINTS.BOOK_BY_ID(bookId), {
                method: 'PUT',
                body: JSON.stringify(bookData)
            });
            showToast('Livro atualizado com sucesso!', 'success');
        } else {
            await apiCall(API_ENDPOINTS.BOOKS, {
                method: 'POST',
                body: JSON.stringify(bookData)
            });
            showToast('Livro criado com sucesso!', 'success');
        }

        modal.hide();
        loadBooks();
    } catch (error) {
        showToast(error.message || 'Erro ao salvar livro', 'danger');
    } finally {
        hideLoading();
    }
}

async function deleteBook(id) {
    if (!confirm('Tem certeza que deseja deletar este livro?')) return;

    showLoading();

    try {
        await apiCall(API_ENDPOINTS.BOOK_BY_ID(id), {
            method: 'DELETE'
        });
        showToast('Livro deletado com sucesso!', 'success');
        loadBooks();
    } catch (error) {
        showToast(error.message || 'Erro ao deletar livro', 'danger');
    } finally {
        hideLoading();
    }
}

function getCoverHtml(book) {
    if (book.cover_url && book.cover_url.trim() !== '') {
        return `
            <div style="height: 350px; overflow: hidden; background: #f8f9fa;">
                <img src="${book.cover_url}" 
                     alt="${book.title}" 
                     class="w-100 h-100" 
                     style="object-fit: cover;"
                     onload="this.style.opacity=1"
                     onerror="console.log('Erro ao carregar:', '${book.cover_url}'); this.onerror=null; this.parentElement.innerHTML='<div class=\\'book-card-img bg-gradient d-flex align-items-center justify-content-center\\' style=\\'background: linear-gradient(135deg, #10b981 0%, #059669 100%); height: 350px;\\'><div class=\\'text-center text-white p-3\\'><i class=\\'bi bi-book display-1\\'></i><p class=\\'mt-2 fw-bold\\'>${book.title}</p></div></div>';">
            </div>
        `;
    }

    return `
        <div class="book-card-img bg-gradient d-flex align-items-center justify-content-center" 
             style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); height: 350px;">
            <div class="text-center text-white p-3">
                <i class="bi bi-book display-1"></i>
                <p class="mt-2 fw-bold">${book.title}</p>
            </div>
        </div>
    `;
}

document.getElementById('searchInput').addEventListener('input', filterBooks);
document.getElementById('filterPoet').addEventListener('change', filterBooks);

document.addEventListener('DOMContentLoaded', loadBooks);
