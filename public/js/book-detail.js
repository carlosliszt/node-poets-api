const urlParams = new URLSearchParams(window.location.search);
const bookId = urlParams.get('id');

if (!bookId) {
    window.location.href = 'books.html';
}

function getBookCoverHtml(book) {
    if (book.cover_url && book.cover_url.trim() !== '') {
        return `
            <div style="height: 400px; overflow: hidden; background: #f8f9fa; border-radius: 15px 15px 0 0;">
                <img src="${book.cover_url}" 
                     alt="${book.title}" 
                     class="w-100 h-100" 
                     style="object-fit: cover;"
                     onload="console.log('✅ Capa carregada:', '${book.cover_url}'); this.style.opacity=1;"
                     onerror="console.error('❌ Erro ao carregar capa:', '${book.cover_url}'); this.onerror=null; this.parentElement.innerHTML='<div class=\\'book-card-img bg-gradient d-flex align-items-center justify-content-center\\' style=\\'background: linear-gradient(135deg, #10b981 0%, #059669 100%); height: 400px; border-radius: 15px 15px 0 0;\\'><div class=\\'text-center text-white p-4\\'><i class=\\'bi bi-book display-1 mb-3\\'></i><h3 class=\\'fw-bold\\'>${book.title}</h3></div></div>';">
            </div>
        `;
    }

    return `
        <div class="book-card-img bg-gradient d-flex align-items-center justify-content-center" 
             style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); height: 400px; border-radius: 15px 15px 0 0;">
            <div class="text-center text-white p-4">
                <i class="bi bi-book display-1 mb-3"></i>
                <h3 class="fw-bold">${book.title}</h3>
            </div>
        </div>
    `;
}

async function loadBookDetails() {
    try {
        const data = await apiCall(API_ENDPOINTS.BOOK_WITH_POEMS(bookId));
        const book = data.data;

        console.log('📚 Dados do livro recebidos:', book);
        console.log('🖼️ URL da capa:', book.cover_url);

        document.title = `${book.title} - Poesias`;

        document.getElementById('bookTitle').textContent = book.title;

        document.getElementById('bookPoet').innerHTML = `
            <i class="bi bi-person-fill me-2"></i>
            Por: <a href="poet-detail.html?id=${book.poet_id}" class="text-decoration-none">
                ${book.poet_name || 'Autor desconhecido'}
            </a>
        `;

        document.getElementById('bookBadges').innerHTML = `
            ${book.publication_year ? `<span class="badge bg-success me-2">
                <i class="bi bi-calendar me-1"></i>${book.publication_year}
            </span>` : ''}
            ${book.language ? `<span class="badge bg-info me-2">
                <i class="bi bi-translate me-1"></i>${book.language}
            </span>` : ''}
            ${book.edition ? `<span class="badge bg-secondary">
                ${book.edition}ª Edição
            </span>` : ''}
        `;

        document.getElementById('bookDescription').textContent = book.description || 'Sem descrição disponível.';

        const infoHtml = `
            ${book.poet_name ? `
                <p class="mb-2">
                    <i class="bi bi-person-fill me-2 text-success"></i>
                    <strong>Poeta:</strong> <a href="poet-detail.html?id=${book.poet_id}" class="text-decoration-none text-success">${book.poet_name}</a>
                </p>
            ` : ''}
            ${book.isbn ? `
                <p class="mb-2">
                    <i class="bi bi-upc-scan me-2 text-success"></i>
                    <strong>ISBN:</strong> ${book.isbn}
                </p>
            ` : ''}
            ${book.publisher ? `
                <p class="mb-2">
                    <i class="bi bi-building me-2 text-success"></i>
                    <strong>Editora:</strong> ${book.publisher}
                </p>
            ` : ''}
            ${book.pages ? `
                <p class="mb-2">
                    <i class="bi bi-file-earmark-text me-2 text-success"></i>
                    <strong>Páginas:</strong> ${book.pages}
                </p>
            ` : ''}
            ${book.publication_year ? `
                <p class="mb-2">
                    <i class="bi bi-calendar-event me-2 text-success"></i>
                    <strong>Publicação:</strong> ${book.publication_year}
                </p>
            ` : ''}
            ${book.language ? `
                <p class="mb-2">
                    <i class="bi bi-translate me-2 text-success"></i>
                    <strong>Idioma:</strong> ${book.language}
                </p>
            ` : ''}
            ${book.edition ? `
                <p class="mb-0">
                    <i class="bi bi-hash me-2 text-success"></i>
                    <strong>Edição:</strong> ${book.edition}ª
                </p>
            ` : ''}
        `;

        const bookCoverContainer = document.querySelector('.col-lg-4 .card');
        if (bookCoverContainer) {
            const coverHtml = getBookCoverHtml(book);
            bookCoverContainer.innerHTML = `
                ${coverHtml}
                <div class="card-body">
                    <div id="bookInfo">${infoHtml}</div>
                </div>
            `;
        }

        const poemsContainer = document.getElementById('bookPoems');
        if (book.poems && book.poems.length > 0) {
            poemsContainer.innerHTML = `
                <div class="list-group">
                    ${book.poems.map(poem => `
                        <div class="list-group-item list-group-item-action">
                            <div class="d-flex w-100 justify-content-between align-items-start">
                                <div>
                                    <h5 class="mb-1">${poem.title}</h5>
                                    <div class="mb-2">
                                        ${poem.style ? `<span class="badge bg-info me-1">${poem.style}</span>` : ''}
                                        ${poem.theme ? `<span class="badge bg-secondary me-1">${poem.theme}</span>` : ''}
                                        ${poem.page_number ? `<span class="badge bg-dark">Pág. ${poem.page_number}</span>` : ''}
                                    </div>
                                    <p class="mb-2 text-muted small" style="font-family: 'Garamond', serif;">
                                        ${truncateText(poem.content, 150)}
                                    </p>
                                    ${poem.verses_count || poem.stanzas_count ? `
                                        <small class="text-muted">
                                            ${poem.verses_count ? `<i class="bi bi-list-ol me-1"></i>${poem.verses_count} versos` : ''}
                                            ${poem.stanzas_count ? `<i class="bi bi-layout-text-window ms-2 me-1"></i>${poem.stanzas_count} estrofes` : ''}
                                        </small>
                                    ` : ''}
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="text-center mt-4">
                    <a href="poems.html?book_id=${book.id}" class="btn btn-success">
                        <i class="bi bi-eye me-2"></i>Ver Todos os Poemas
                    </a>
                </div>
            `;
        } else {
            poemsContainer.innerHTML = `
                <div class="text-center text-muted py-4">
                    <i class="bi bi-pen display-4"></i>
                    <p class="mt-2">Nenhum poema cadastrado para este livro.</p>
                </div>
            `;
        }

        document.getElementById('loading').classList.add('d-none');
        document.getElementById('bookDetails').classList.remove('d-none');

    } catch (error) {
        console.error('Error loading book details:', error);
        document.getElementById('loading').classList.add('d-none');
        document.getElementById('errorMessage').classList.remove('d-none');
    }
}

document.addEventListener('DOMContentLoaded', loadBookDetails);
