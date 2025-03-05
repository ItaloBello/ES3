// Função para obter um valor de cookie pelo nome
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

document.getElementById("form-criar-time").addEventListener("submit", async (e) => {
    e.preventDefault(); // Evita o reload da página

    const nome = document.getElementById("nome-time").value;
    const img = document.getElementById("img-time").value;
    const userId = getCookie("userId"); // Obtém o userId do cookie

    if (!userId) {
        alert("Erro: Usuário não autenticado.");
        return;
    }

    // Monta o objeto JSON
    const timeData = {
        nome,
        img,
        userId: parseInt(userId, 10) // Garante que o userId seja um número
    };

    try {
        const response = await fetch("http://localhost:8081/api/usuario/times", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(timeData),
        });

        if (response.ok) {
            alert("Time criado com sucesso!");
            window.location.href = "./tela-principal-jogador.html";
        } else {
            const error = await response.json();
            alert(`Erro ao criar time: ${error.message || "Erro desconhecido"}`);
        }
    } catch (err) {
        alert(`Erro ao conectar com o servidor: ${err.message}`);
    }
});

