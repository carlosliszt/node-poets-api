document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!username || !password) {
        showToast('Por favor, preencha todos os campos', 'warning');
        return;
    }

    showLoading();

    try {
        const data = await apiCall(API_ENDPOINTS.LOGIN, {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });

        // Save token and user info
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('username', data.data.user.username);

        hideLoading();
        showToast('Login realizado com sucesso!', 'success');

        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    } catch (error) {
        hideLoading();
        showToast(error.message || 'Erro ao fazer login', 'danger');
    }
});


