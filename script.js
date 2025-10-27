document.addEventListener('DOMContentLoaded', () => {
    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');

    // ✅ Webhook do Impacto AI
    const webhookURL = 'https://n8nbot.ngrok.app/webhook/6d9fabcd-3748-458f-a5ab-eca6f2d03170/chat';

    // Gera um ID de sessão único para a memória do chat no n8n
    const sessionId = 'impacto_' + Math.random().toString(36).substring(2, 9);

    // Função para adicionar mensagens no chat
    function addMessage(text, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', isUser ? 'user-message' : 'bot-message');
        messageDiv.textContent = text;
        chatBox.appendChild(messageDiv);

        // Rolagem automática para a última mensagem
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // Função principal para enviar a mensagem
    async function sendMessage() {
        const message = userInput.value.trim();
        if (message === '') return;

        addMessage(message, true);
        userInput.value = '';

        try {
            const response = await fetch(webhookURL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chatInput: message,
                    sessionId: sessionId
                })
            });

            if (!response.ok) {
                throw new Error(`Erro HTTP! Status: ${response.status}`);
            }

            const data = await response.json();

            if (data && data.output) {
                addMessage(data.output, false);
            } else {
                addMessage("Desculpe, não consegui obter uma resposta. Tente novamente.", false);
            }
        } catch (error) {
            console.error('Erro ao conectar ao n8n:', error);
            addMessage("Ocorreu um erro na comunicação. Verifique a URL e a conexão do n8n.", false);
        }
    }

    // Eventos
    sendButton.addEventListener('click', sendMessage);

    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage();
        }
    });

    // Mensagem inicial do bot
    addMessage("Olá! Eu sou Impacto AI, como posso te ajudar hoje?", false);
});
