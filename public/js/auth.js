function checkAuth() {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');

    const authNav = document.getElementById('authNav');
    const userNav = document.getElementById('userNav');
    const usernameSpan = document.getElementById('username');

    if (token && username) {
        if (authNav) authNav.classList.add('d-none');
        if (userNav) userNav.classList.remove('d-none');
        if (usernameSpan) usernameSpan.textContent = username;
        return true;
    } else {
        if (authNav) authNav.classList.remove('d-none');
        if (userNav) userNav.classList.add('d-none');
        return false;
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    showToast('Logout realizado com sucesso!', 'success');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer') || createToastContainer();

    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type} border-0`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;

    toastContainer.appendChild(toast);
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();

    toast.addEventListener('hidden.bs.toast', () => {
        toast.remove();
    });
}

function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container position-fixed top-0 end-0 p-3';
    container.style.zIndex = '9999';
    document.body.appendChild(container);
    return container;
}

function showLoading() {
    const spinner = document.createElement('div');
    spinner.id = 'loadingSpinner';
    spinner.className = 'spinner-overlay';
    spinner.innerHTML = `
        <div class="spinner-border text-light" style="width: 3rem; height: 3rem;" role="status">
            <span class="visually-hidden">Carregando...</span>
        </div>
    `;
    document.body.appendChild(spinner);
}

function hideLoading() {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) spinner.remove();
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function truncateText(text, maxLength) {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return false;
    }
    return true;
}

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();

    const scrollBtn = document.createElement('div');
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.innerHTML = '<i class="bi bi-arrow-up"></i>';
    scrollBtn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    document.body.appendChild(scrollBtn);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollBtn.classList.add('show');
        } else {
            scrollBtn.classList.remove('show');
        }
    });
});

