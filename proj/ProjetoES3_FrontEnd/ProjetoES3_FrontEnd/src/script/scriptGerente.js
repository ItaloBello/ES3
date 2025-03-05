async function fetchUserInfo(userId, quadraId) {
    try {
        // Busca informações do usuário
        const response = await fetch(`http://localhost:8081/api/admin/info/${userId}`);
        if (!response.ok) {
            throw new Error('Erro ao buscar informações do usuário.');
        }
        const userInfo = await response.json();

        // Atualiza as informações do usuário na interface
        document.getElementById('user-name').textContent = userInfo.nome || 'Não informado';
        document.getElementById('user-email').textContent = userInfo.email || 'Não informado';
        document.getElementById('user-doc').textContent = userInfo.documento || 'Não informado';
        document.getElementById('user-address').textContent = userInfo.endereco || 'Não informado';

        // Verifica e busca informações da quadra, se disponível
        if (quadraId) {
            const quadraInfo = await fetchQuadraInfo(quadraId);
            document.getElementById('quadra-name').textContent = quadraInfo.nome || 'Não informado';
            document.getElementById('quadra-type').textContent = quadraInfo.tipo || 'Não informado';
        } else {
            document.getElementById('quadra-name').textContent = 'Nenhuma quadra associada';
            document.getElementById('quadra-type').textContent = '---';
        }
    } catch (error) {
        console.error(error.message);
        alert('Não foi possível carregar as informações do usuário ou da quadra.');
    }
}

async function fetchQuadraInfo(quadraId) {
    try {
        // Busca informações da quadra
        const response = await fetch(`http://localhost:8081/api/admin/quadra/${quadraId}`);
        if (!response.ok) {
            throw new Error('Erro ao buscar informações da quadra.');
        }
        const quadraInfo = await response.json();
        return quadraInfo;
    } catch (error) {
        console.error(error.message);
        alert('Não foi possível carregar as informações da quadra.');
    }
}

// Obtém os parâmetros da URL
function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        userId: params.get('userId'),
        quadraId: params.get('quadraId')
    };
}

// Função para alternar a visibilidade do menu "Quadras"
function toggleQuadrasMenu() {
    const menu = document.getElementById('opt-quadras');
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}

// Exibir o formulário de cadastro
function showAddQuadraForm() {
    document.getElementById('quadra-form').style.display = 'block';
    document.getElementById('form-title').textContent = 'Cadastrar Quadra';
    document.getElementById('quadra-id').value = '';
    document.getElementById('form-quadra').onsubmit = handleAddQuadra;
}

// Exibir o formulário de edição
function showEditQuadraForm() {
    document.getElementById('quadra-form').style.display = 'block';
    document.getElementById('form-title').textContent = 'Editar Quadra';
    document.getElementById('form-quadra').onsubmit = handleEditQuadra;
}

// Exibir o formulário de exclusão
function showDeleteQuadraForm() {
    document.getElementById('delete-quadra-form').style.display = 'block';
    document.getElementById('form-delete').onsubmit = handleDeleteQuadra;
}

// Função para cadastrar uma quadra
async function handleAddQuadra(event) {
    event.preventDefault();
    const nome = document.getElementById('quadra-nome').value;
    const tipo = document.getElementById('quadra-tipo').value;
    const quadra = {
        nome: nome,
        tipo: tipo,
        usuarioId: userId
    }
    try {
        const response = await fetch('http://localhost:8081/api/admin/cadastrarQuadra', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(quadra) // Ajuste o usuarioId conforme necessário
        });
        if (response.ok) {
            const data = await response.json();  // Aqui você processa a resposta como JSON
            alert('Quadra cadastrada com sucesso!');
            console.log(data);  // Agora você pode ver a resposta com a mensagem
            console.log(quadraId);  // Verifique se o ID está correto
            console.log(JSON.stringify(quadra));  // Verifique se o objeto quadra está correto
        } else {
            throw new Error('Erro ao cadastrar quadra.');
        }
    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}

// Função para editar uma quadra
async function handleEditQuadra(event) {
    event.preventDefault();
    const id = document.getElementById('quadra-id').value;
    const newNome = document.getElementById('quadra-nome').value;
    const newTipo = document.getElementById('quadra-tipo').value;
    const quadra = {
        nome: newNome,
        tipo: newTipo,
        usuarioId: userId
    }

    try {
        const response = await fetch(`http://localhost:8081/api/admin/atualizarQuadra/${quadraId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(quadra)
        });        
        if (response.ok) {
            const data = await response.json();  // Aqui você processa a resposta como JSON
            alert('Quadra atualizada com sucesso!');
            console.log(data);  // Agora você pode ver a resposta com a mensagem
            console.log(quadraId);  // Verifique se o ID está correto
            console.log(JSON.stringify(quadra));  // Verifique se o objeto quadra está correto
        } else {
            throw new Error('Erro ao editar quadra.');
        }
    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}

// Função para excluir uma quadra
async function handleDeleteQuadra(event) {
    event.preventDefault();
    const id = document.getElementById('quadra-delete-id').value;

    try {
        const response = await fetch(`http://localhost:8081/api/admin/excluirQuadra/${id}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            alert('Quadra excluída com sucesso!');
        } else {
            throw new Error('Erro ao excluir quadra.');
        }
    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}

// Executa ao carregar a página
const { userId, quadraId } = getQueryParams();
if (userId) {
    fetchUserInfo(userId, quadraId);
} else {
    alert('ID do usuário não encontrado.');
}
