const actionBtn = document.getElementById('action-btn');
const sphere = document.getElementById('visualizer');
const statusText = document.getElementById('status');
const greetingText = document.getElementById('greeting');
const transcriptArea = document.getElementById('transcript');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.lang = 'pt-BR';
recognition.continuous = false;

let userName = ""; // Aqui o robô guarda o nome temporariamente
let isAskingName = false; // Para saber se o robô está esperando o nome ou um comando

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

actionBtn.addEventListener('click', async () => {
    // Se o robô ainda não sabe o nome, ele pergunta
    if (userName === "") {
        greetingText.innerText = "Identificação...";
        await speak("Olá, eu sou o Assistente Z. Como é o seu nome?");
        isAskingName = true;
        try {
            recognition.start(); // Abre o microfone para ouvir o nome
        } catch (e) { console.log(e); }
    } else {
        // Se já sabe o nome, apenas ouve o comando
        isAskingName = false;
        try {
            recognition.start();
        } catch (e) { console.log(e); }
    }
});

recognition.onstart = () => {
    sphere.className = "sphere listening";
    statusText.innerText = isAskingName ? "Diga seu nome..." : "Ouvindo comando...";
    transcriptArea.innerText = "";
};

recognition.onresult = async (event) => {
    const speechResult = event.results[0][0].transcript.toLowerCase();
    transcriptArea.innerText = "${speechResult}";

    if (isAskingName) {
        // O robô salva o nome que ouviu
        userName = speechResult;
        greetingText.innerText = Olá, ${userName};
        await speak(Olá ${userName}, em que posso lhe ajudar hoje?);
        isAskingName = false;
    } else {
        // Se já sabe o nome, processa o comando
        processCommand(speechResult);
    }
};

recognition.onerror = (event) => {
    sphere.className = "sphere idle";
    statusText.innerText = "Erro: " + event.error;
};

async function processCommand(text) {
    if (text.includes('youtube')) {
        let query = text.replace('pesquisar', '').replace('no youtube', '').trim();
        await speak(Entendido ${userName}, buscando no YouTube.);
        const baseUrl = query ? https://www.youtube.com/results?search_query=${query} : https://www.youtube.com/;
        window.open(baseUrl, '_blank');
    } 
    else if (text.includes('google') || text.includes('pesquisar')) {
        let query = text.replace('pesquisar', '').replace('no google', '').trim();
        await speak(Certo ${userName}, pesquisando no Google.);
        window.open(https://www.google.com/search?q=${query}, '_blank');
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
        await speak(Desculpe ${userName}, ainda não conheço esse comando.);
    }
}
