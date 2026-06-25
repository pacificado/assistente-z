const actionBtn = document.getElementById('action-btn');
const sphere = document.getElementById('visualizer');
const statusText = document.getElementById('status');
const greetingText = document.getElementById('greeting');
const transcriptArea = document.getElementById('transcript');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.lang = 'pt-BR';
recognition.continuous = false;
recognition.interimResults = false; // Garante que só processa o resultado final

let userName = ""; // Aqui o robô guarda o nome temporariamente
let isAskingName = false; // Para saber se o robô está esperando o nome ou um comando
let isListening = false; // Flag para evitar duplicidade ao ligar o microfone

const speak = (text) => {
    return new Promise((resolve) => {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'pt-BR';
        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        utterance.onstart = () => {
            sphere.className = "sphere speaking";
            statusText.innerText = "Falando...";
        };

        utterance.onend = () => {
            sphere.className = "sphere idle";
            statusText.innerText = "Toque para falar";
            resolve();
        };

        window.speechSynthesis.speak(utterance);
    });
};

window.onload = () => {
    greetingText.innerText = "Sistemas Prontos";
    statusText.innerText = "Toque no botão para iniciar";
};

// Função segura para iniciar o reconhecimento de voz
const startRecognition = () => {
    if (!isListening) {
        try {
            recognition.start();
        } catch (e) { 
            console.log("Erro ao iniciar reconhecimento:", e); 
        }
    }
};

actionBtn.addEventListener('click', async () => {
    // Se estiver ouvindo, para. Se não, inicia o fluxo.
    if (isListening) {
        recognition.stop();
        return;
    }

    if (userName === "") {
        greetingText.innerText = "Identificação...";
        isAskingName = true;
        await speak("Olá, eu sou o Assistente Z. Como é o seu nome?");
        startRecognition();
    } else {
        isAskingName = false;
        startRecognition();
    }
});

recognition.onstart = () => {
    isListening = true;
    sphere.className = "sphere listening";
    statusText.innerText = isAskingName ? "Diga seu nome..." : "Ouvindo comando...";
    transcriptArea.innerText = "";
};

recognition.onend = () => {
    isListening = false;
    if (statusText.innerText !== "Falando...") {
        sphere.className = "sphere idle";
        statusText.innerText = "Toque para falar";
    }
};

recognition.onerror = (event) => {
    isListening = false;
    sphere.className = "sphere idle";
    statusText.innerText = "Erro: " + event.error;
    console.error("Erro no SpeechRecognition:", event.error);
};

recognition.onresult = async (event) => {
    const speechResult = event.results[0][0].transcript.trim();
    transcriptArea.innerText = "${speechResult}";

    if (isAskingName) {
        // Salva o nome (primeira letra maiúscula para ficar bonito na tela)
        userName = speechResult.charAt(0).toUpperCase() + speechResult.slice(1);
        greetingText.innerText = Olá, ${userName};
        isAskingName = false;
        await speak(Olá ${userName}, em que posso lhe ajudar hoje?);
    } else {
        processCommand(speechResult.toLowerCase());
    }
};

async function processCommand(text) {
    if (text.includes('youtube')) {
        // Limpa termos comuns para isolar a pesquisa
        let query = text.replace(/pesquisar/g, '').replace(/no youtube/g, '').replace(/youtube/g, '').trim();
        await speak(Entendido ${userName}, buscando no YouTube.);
        const baseUrl = query ? https://www.youtube.com/results?search_query=${encodeURIComponent(query)} : https://www.youtube.com/;
        window.open(baseUrl, '_blank');
    } 
    else if (text.includes('google') || text.includes('pesquisar')) {
        let query = text.replace(/pesquisar/g, '').replace(/no google/g, '').replace(/google/g, '').trim();
        await speak(Certo ${userName}, pesquisando no Google.);
        window.open(https://www.google.com/search?q=${encodeURIComponent(query)}, '_blank');
    }
    else if (text.includes('arquivos') || text.includes('pastas')) {
        await speak(Com certeza ${userName}, abrindo o seletor de arquivos.);
        const input = document.createElement('input');
        input.type = 'file';
        input.click();
    }
    else if (text.includes('whatsapp') || text.includes('zap')) {
        await speak(${userName}, abrindo seu WhatsApp.);
        window.open('https://web.whatsapp.com/', '_blank');
    }
    else {
        await speak(Desculpe ${userName}, ainda não conheço o comando: ${text});
    }
}
