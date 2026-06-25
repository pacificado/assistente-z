const actionBtn = document.getElementById('action-btn');
const sphere = document.getElementById('visualizer');
const statusText = document.getElementById('status');
const greetingText = document.getElementById('greeting');
const transcriptArea = document.getElementById('transcript');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.lang = 'pt-BR';
recognition.continuous = false;

let userName = ""; 
let isAskingName = false; 

const speak = (text) => {
    return new Promise((resolve) => {
        window.speechSynthesis.cancel(); // Limpa falas anteriores
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

// Quando a página carregar, ele fica em espera silenciosa
window.onload = () => {
    greetingText.innerText = "Sistemas em Espera";
    statusText.innerText = "Toque no botão para ligar o robô";
};

actionBtn.addEventListener('click', async () => {
    // Na primeira interação, o robô desperta e pergunta o nome
    if (userName === "") {
        greetingText.innerText = "Identificação...";
        await speak("Olá, eu sou o Assistente Z. Qual é o seu nome?");
        isAskingName = true;
        try {
            recognition.start(); 
        } catch (e) { console.log("Microfone ativo"); }
    } else {
        // Nas próximas, ele apenas ouve o seu comando
        isAskingName = false;
        try {
            recognition.start();
        } catch (e) { console.log("Microfone ativo"); }
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
        userName = speechResult;
        greetingText.innerText = Olá, ${userName};
        await speak(Olá ${userName}, em que posso lhe ajudar hoje?);
        isAskingName = false;
    } else {
        processCommand(speechResult);
    }
};

recognition.onerror = () => {
    sphere.className = "sphere idle";
    statusText.innerText = "Não entendi, tente falar de novo";
};

async function processCommand(text) {
    if (text.includes('youtube')) {
        let query = text.replace('pesquisar', '').replace('no youtube', '').trim();
        await speak(Buscando no YouTube.);
        const url = query ? https://www.youtube.com/results?search_query=${query} : https://www.youtube.com/;
        window.open(url, '_blank');
    } 
    else if (text.includes('google') || text.includes('pesquisar')) {
        let query = text.replace('pesquisar', '').replace('no google', '').trim();
        await speak(Pesquisando no Google.);
        window.open(https://www.google.com/search?q=${query}, '_blank');
    }
    else if (text.includes('arquivos') || text.includes('pastas')) {
        await speak(Abrindo seletor de arquivos.);
        const input = document.createElement('input');
        input.type = 'file';
        input.click();
    }
    else if (text.includes('whatsapp') || text.includes('zap')) {
        await speak(Abrindo seu WhatsApp.);
        window.open('https://web.whatsapp.com/', '_blank');
    }
    else {
        await speak(Comando não identificado.);
    }
}
