const API_BASE_URL = 'http://localhost:3000/api'; //mudar em prod

const API_ENDPOINTS = {
    // autenticação
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    ME: `${API_BASE_URL}/auth/me`,

    // poeta
    POETS: `${API_BASE_URL}/poets`,
    POET_BY_ID: (id) => `${API_BASE_URL}/poets/${id}`,
    POET_WITH_BOOKS: (id) => `${API_BASE_URL}/poets/${id}/books`,

    // livros
    BOOKS: `${API_BASE_URL}/books`,
    BOOK_BY_ID: (id) => `${API_BASE_URL}/books/${id}`,
    BOOK_WITH_POEMS: (id) => `${API_BASE_URL}/books/${id}/poems`,

    // poemas
    POEMS: `${API_BASE_URL}/poems`,
    POEM_BY_ID: (id) => `${API_BASE_URL}/poems/${id}`,
};

function getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
}

async function apiCall(url, options = {}) {
    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                ...getAuthHeaders(),
                ...options.headers
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Erro na requisição');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

