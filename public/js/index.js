async function loadStats() {
    try {
        const [poetsData, booksData, poemsData] = await Promise.all([
            apiCall(API_ENDPOINTS.POETS),
            apiCall(API_ENDPOINTS.BOOKS),
            apiCall(API_ENDPOINTS.POEMS)
        ]);

        animateCounter('poetsCount', poetsData.count || poetsData.data.length);
        animateCounter('booksCount', booksData.count || booksData.data.length);
        animateCounter('poemsCount', poemsData.count || poemsData.data.length);
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

function animateCounter(elementId, target) {
    const element = document.getElementById(elementId);
    if (!element) return;

    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 30);
}

function getPoetPhotoHtml(poet) {
    const gradient = '#667eea 0%, #764ba2 100%';

    if (poet.photo_url && poet.photo_url.trim() !== '') {
        return `
            <div class="poet-photo-container" style="height: 250px; overflow: hidden; border-radius: 15px 15px 0 0; background: #f8f9fa;">
                <img src="${poet.photo_url}" 
                     alt="${poet.name}" 
                     class="w-100 h-100 index-poet-photo" 
                     style="object-fit: cover; display: block;"
                     data-poet-name="${poet.name}"
                     data-poet-pseudonym="${poet.pseudonym || ''}"
                     data-gradient="${gradient}">
            </div>
        `;
    }

    return `
        <div class="poet-card-img bg-gradient" style="background: linear-gradient(135deg, ${gradient});">
            <div class="text-white p-4 h-100 d-flex flex-column justify-content-end">
                <h3 class="fw-bold mb-2">${poet.name}</h3>
                ${poet.pseudonym ? `<p class="mb-0"><small>"${poet.pseudonym}"</small></p>` : ''}
            </div>
        </div>
    `;
}

function setupIndexImageErrorHandlers() {
    setTimeout(() => {
        document.querySelectorAll('.index-poet-photo').forEach(img => {
            img.onload = function() {
                console.log('✅ Foto do poeta carregada (index):', this.src);
            };

            img.onerror = function() {
                console.error('❌ Erro ao carregar foto (index):', this.src);
                const name = this.getAttribute('data-poet-name');
                const pseudonym = this.getAttribute('data-poet-pseudonym');
                const gradient = this.getAttribute('data-gradient');

                const fallbackHtml = `
                    <div class="poet-card-img bg-gradient" style="background: linear-gradient(135deg, ${gradient}); border-radius: 15px 15px 0 0;">
                        <div class="text-white p-4 h-100 d-flex flex-column justify-content-end">
                            <h3 class="fw-bold mb-2">${name}</h3>
                            ${pseudonym ? `<p class="mb-0"><small>"${pseudonym}"</small></p>` : ''}
                        </div>
                    </div>
                `;

                this.parentElement.outerHTML = fallbackHtml;
            };
        });
    }, 100);
}

async function loadFeaturedPoets() {
    try {
        const data = await apiCall(API_ENDPOINTS.POETS);
        const poets = data.data.slice(0, 3);

        const container = document.getElementById('featuredPoets');
        if (!container) return;

        if (poets.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center">
                    <p class="text-muted">Nenhum poeta encontrado</p>
                </div>
            `;
            return;
        }

        container.innerHTML = poets.map(poet => `
            <div class="col-md-4 animate-slide-in">
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
                        <p class="card-text">${truncateText(poet.biography, 120)}</p>
                    </div>
                    <div class="card-footer bg-transparent border-0 pb-3">
                        <a href="poet-detail.html?id=${poet.id}" class="btn btn-outline-primary w-100">
                            <i class="bi bi-book me-2"></i>Ver Obras
                        </a>
                    </div>
                </div>
            </div>
        `).join('');

        setupIndexImageErrorHandlers();
    } catch (error) {
        console.error('Error loading featured poets:', error);
        const container = document.getElementById('featuredPoets');
        if (container) {
            container.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-danger">
                        <i class="bi bi-exclamation-triangle me-2"></i>
                        Erro ao carregar poetas. Verifique se o servidor está rodando.
                    </div>
                </div>
            `;
        }
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    loadStats();
    loadFeaturedPoets();
});
