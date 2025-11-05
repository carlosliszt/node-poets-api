const urlParams = new URLSearchParams(window.location.search);
const poetId = urlParams.get('id');

if (!poetId) {
    window.location.href = 'poets.html';
}

function getBookCoverHtml(book) {
    if (book.cover_url && book.cover_url.trim() !== '') {
        return `
            <div style="height: 200px; overflow: hidden; background: #f8f9fa; border-radius: 15px 15px 0 0;">
                <img src="${book.cover_url}" 
                     alt="${book.title}" 
                     class="w-100 h-100 book-cover-img" 
                     style="object-fit: cover; display: block;"
                     data-book-title="${book.title}"
                     data-book-id="${book.id}">
            </div>
        `;
    }

    return `
        <div class="book-card-img bg-gradient d-flex align-items-center justify-content-center" 
             style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); height: 200px; border-radius: 15px 15px 0 0;">
            <div class="text-center text-white p-3">
                <i class="bi bi-book display-4"></i>
                <p class="mt-2 fw-bold small">${book.title}</p>
            </div>
        </div>
    `;
}

function setupBookCoverErrorHandlers() {
    setTimeout(() => {
        document.querySelectorAll('.book-cover-img').forEach(img => {
            img.onload = function() {
                console.log('✅ Capa do livro carregada:', this.src);
            };

            img.onerror = function() {
                console.error('❌ Erro ao carregar capa do livro:', this.src);
                const title = this.getAttribute('data-book-title');

                const fallbackHtml = `
                    <div class="book-card-img bg-gradient d-flex align-items-center justify-content-center" 
                         style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); height: 200px; border-radius: 15px 15px 0 0;">
                        <div class="text-center text-white p-3">
                            <i class="bi bi-book display-4"></i>
                            <p class="mt-2 fw-bold small">${title}</p>
                        </div>
                    </div>
                `;

                this.parentElement.outerHTML = fallbackHtml;
            };
        });
    }, 100);
}

function getPoetPhotoHtml(poet) {
    if (poet.photo_url && poet.photo_url.trim() !== '') {
        return `
            <div class="poet-photo-container" style="height: 300px; overflow: hidden; border-radius: 15px 15px 0 0; background: #f8f9fa;">
                <img src="${poet.photo_url}" 
                     alt="${poet.name}" 
                     class="w-100 h-100 poet-detail-photo" 
                     style="object-fit: cover; display: block;"
                     data-poet-name="${poet.name}"
                     data-poet-pseudonym="${poet.pseudonym || ''}">
            </div>
            <div class="p-4 bg-gradient text-black" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                <h4 class="fw-bold mb-1">${poet.name}</h4>
                ${poet.pseudonym ? `<p class="mb-0"><em>"${poet.pseudonym}"</em></p>` : ''}
            </div>
        `;
    }

    return `
        <div class="poet-card-img bg-gradient" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); height: 300px; border-radius: 15px 15px 0 0;">
            <div class="text-white p-4 h-100 d-flex flex-column justify-content-end">
                <h2 class="fw-bold mb-2">${poet.name}</h2>
                ${poet.pseudonym ? `<p class="mb-0"><em>"${poet.pseudonym}"</em></p>` : ''}
            </div>
        </div>
    `;
}

function setupImageErrorHandler() {
    setTimeout(() => {
        const img = document.querySelector('.poet-detail-photo');
        if (img) {
            img.onload = function() {
                console.log('✅ Foto do poeta carregada:', this.src);
            };

            img.onerror = function() {
                console.error('❌ Erro ao carregar foto:', this.src);
                const name = this.getAttribute('data-poet-name');
                const pseudonym = this.getAttribute('data-poet-pseudonym');

                const fallbackHtml = `
                    <div class="poet-card-img bg-gradient" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); height: 300px; border-radius: 15px 15px 0 0;">
                        <div class="text-white p-4 h-100 d-flex flex-column justify-content-end">
                            <h2 class="fw-bold mb-2">${name}</h2>
                            ${pseudonym ? `<p class="mb-0"><em>"${pseudonym}"</em></p>` : ''}
                        </div>
                    </div>
                `;

                this.parentElement.outerHTML = fallbackHtml;
            };
        }
    }, 100);
}

async function loadPoetDetails() {
    try {
        const data = await apiCall(API_ENDPOINTS.POET_WITH_BOOKS(poetId));
        const poet = data.data;

        console.log('👤 Dados do poeta recebidos:', poet);
        console.log('📸 URL da foto:', poet.photo_url);

        document.title = `${poet.name} - Poesias`;

        document.getElementById('poetName').textContent = poet.name;

        const pseudonymEl = document.getElementById('poetPseudonym');
        if (poet.pseudonym) {
            pseudonymEl.innerHTML = `<em>"${poet.pseudonym}"</em>`;
        } else {
            pseudonymEl.textContent = '';
        }

        document.getElementById('poetBadges').innerHTML = `
            ${poet.nationality ? `<span class="badge bg-primary me-2">
                <i class="bi bi-flag me-1"></i>${poet.nationality}
            </span>` : ''}
            ${poet.literary_movement ? `<span class="badge bg-secondary">
                <i class="bi bi-bookmark me-1"></i>${poet.literary_movement}
            </span>` : ''}
        `;

        document.getElementById('poetInfo').innerHTML = `
            ${poet.birth_year || poet.death_year ? `
                <p class="mb-2">
                    <i class="bi bi-calendar-event me-2 text-primary"></i>
                    <strong>Período:</strong> ${poet.birth_year || '?'} - ${poet.death_year || 'presente'}
                </p>
            ` : ''}
            ${poet.nationality ? `
                <p class="mb-2">
                    <i class="bi bi-globe me-2 text-primary"></i>
                    <strong>Nacionalidade:</strong> ${poet.nationality}
                </p>
            ` : ''}
            ${poet.literary_movement ? `
                <p class="mb-0">
                    <i class="bi bi-bookmark me-2 text-primary"></i>
                    <strong>Movimento:</strong> ${poet.literary_movement}
                </p>
            ` : ''}
        `;

        const poetCardContainer = document.querySelector('.col-lg-4 .card');
        if (poetCardContainer) {
            const photoHtml = getPoetPhotoHtml(poet);
            const badgesHtml = document.getElementById('poetBadges').innerHTML;
            const infoHtml = document.getElementById('poetInfo').innerHTML;

            poetCardContainer.innerHTML = `
                ${photoHtml}
                <div class="card-body">
                    <div class="mb-3" id="poetBadges">${badgesHtml}</div>
                    <div id="poetInfo">${infoHtml}</div>
                </div>
            `;

            setupImageErrorHandler();
        }

        document.getElementById('poetBiography').textContent = poet.biography || 'Sem biografia disponível.';

        const booksContainer = document.getElementById('poetBooks');
        if (poet.books && poet.books.length > 0) {
            booksContainer.innerHTML = poet.books.map(book => `
                <div class="col-md-6">
                    <div class="card h-100 shadow-sm">
                        ${getBookCoverHtml(book)}
                        <div class="card-body">
                            <h5 class="card-title">${book.title}</h5>
                            ${book.publication_year ? `<p class="text-muted mb-2">
                                <i class="bi bi-calendar me-1"></i>${book.publication_year}
                            </p>` : ''}
                            ${book.publisher ? `<p class="text-muted mb-2">
                                <i class="bi bi-building me-1"></i>${book.publisher}
                            </p>` : ''}
                            ${book.pages ? `<p class="text-muted mb-2">
                                <i class="bi bi-file-earmark-text me-1"></i>${book.pages} páginas
                            </p>` : ''}
                            ${book.description ? `<p class="card-text small">${book.description}</p>` : ''}
                            <a href="book-detail.html?id=${book.id}" class="btn btn-sm btn-outline-primary mt-2">
                                <i class="bi bi-eye me-1"></i>Ver Detalhes
                            </a>
                        </div>
                    </div>
                </div>
            `).join('');

            setupBookCoverErrorHandlers();
        } else {
            booksContainer.innerHTML = `
                <div class="col-12 text-center text-muted py-4">
                    <i class="bi bi-book display-4"></i>
                    <p class="mt-2">Nenhum livro cadastrado para este poeta.</p>
                </div>
            `;
        }

        document.getElementById('loading').classList.add('d-none');
        document.getElementById('poetDetails').classList.remove('d-none');

    } catch (error) {
        console.error('Error loading poet details:', error);
        document.getElementById('loading').classList.add('d-none');
        document.getElementById('errorMessage').classList.remove('d-none');
    }
}

document.addEventListener('DOMContentLoaded', loadPoetDetails);
