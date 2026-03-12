// 1. Mapeia os elementos do seu HTML
const botao = document.getElementById("gerador");
const inputUsuario = document.getElementById("input-receita");
const campoResultado = document.getElementById("resultado");

// 2. Função assíncrona para chamar a API
async function gerarReceita() {
    const prato = inputUsuario.value.trim();

    if (!prato) {
        alert("Por favor, digite o nome de um alimento!");
        return;
    }

    // Feedback visual para o usuário
    botao.innerText = "Cozinhando...";
    botao.disabled = true;
    campoResultado.value = "Gerando sua receita, aguarde...";

    try {
        // Chamada para a API da Groq (sua chave gsk_ é desta API)
        const response = await fetch("https://api.groq.com", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // Importante: Manter o 'Bearer ' antes da sua chave
                "Authorization": "Bearer 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"
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    { 
                        role: "system", 
                        content: "Você é um chef experiente. Gere uma receita organizada com: Nome, Ingredientes e Passo a Passo detalhado." 
                    },
                    { 
                        role: "user", 
                        content: `Receita de: ${prato}` 
                    }
                ]
            })
        });

        const data = await response.json();

        // Verifica se a API retornou um erro (ex: chave inválida)
        if (data.error) {
            throw new Error(data.error.message);
        }

        // 3. Extrai o texto da resposta e joga no seu textarea de resultado
        const receitaFinal = data.choices[0].message.content;
        campoResultado.value = receitaFinal;

    } catch (error) {
        console.error("Erro na requisição:", error);
        campoResultado.value = "Erro: Não foi possível gerar a receita. Verifique sua chave de API ou conexão.";
    } finally {
        // Restaura o botão
        botao.innerText = "Gerar Receita";
        botao.disabled = false;
    }
}

// 4. Adiciona o evento de clique ao seu botão
botao.addEventListener("click", gerarReceita);
