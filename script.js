// 1. Seleciona os elementos do HTML
const apiKeyInput = document.querySelector("#api-key-input");
const fraseInput = document.querySelector("#frase-input"); // Agora é um textarea
const analisarBtn = document.querySelector("#analisar-btn");
const resultadoDiv = document.querySelector("#resultado");

// 2. Adiciona o evento de clique ao botão
analisarBtn.addEventListener("click", async () => {
    const apiKey = apiKeyInput.value.trim();
    const frase = fraseInput.value.trim();

    if (!apiKey || !frase) {
        resultadoDiv.textContent = "⚠️ Por favor, preencha a Chave da API e a frase.";
        return;
    }

    // Usamos o mesmo modelo 'flash', que é ótimo para texto também.
    const apiURL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
    
    analisarBtn.disabled = true;
    resultadoDiv.textContent = "Analisando...";
    // Limpa as classes de cor anteriores
    resultadoDiv.classList.remove("positivo", "negativo", "neutro");

    // Engenharia de Prompt: Damos uma instrução clara e específica para a IA.
    const prompt = `Analise o sentimento da seguinte frase e responda APENAS com uma das seguintes palavras: Positivo, Negativo ou Neutro. Frase: "${frase}"`;

    const requestBody = {
        "contents": [{
            "parts": [{ "text": prompt }]
        }]
    };

    try {
        const response = await fetch(apiURL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Erro da API: ${error.error.message}`);
        }

        const data = await response.json();
        // A resposta da IA será apenas uma palavra, graças ao nosso prompt.
        const sentimento = data.candidates[0].content.parts[0].text.trim();

        // Lógica para mostrar o resultado com cores e emojis
        if (sentimento.toLowerCase().includes("positivo")) {
            resultadoDiv.textContent = "Positivo 😃";
            resultadoDiv.classList.add("positivo");
        } else if (sentimento.toLowerCase().includes("negativo")) {
            resultadoDiv.textContent = "Negativo 😠";
            resultadoDiv.classList.add("negativo");
        } else {
            resultadoDiv.textContent = "Neutro 😐";
            resultadoDiv.classList.add("neutro");
        }

    } catch (error) {
        console.error("Erro:", error);
        resultadoDiv.textContent = `❌ Erro: ${error.message}`;
    } finally {
        analisarBtn.disabled = false;
    }
});
