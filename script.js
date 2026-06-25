const actionBtn = document.getElementById('action-btn');
const sphere = document.getElementById('visualizer');
const statusText = document.getElementById('status');
const greetingText = document.getElementById('greeting');
const transcriptArea = document.getElementById('transcript');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;

if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
}

let userName = ""; 
let isAskingName = false; 

function speak(text) {
    return new Promise((resolve) => {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'pt-BR';
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
}

// Isso aqui muda o texto NA HORA que o site abre, provando que o código carregou
window.onload = () => {
    greetingText.innerText = "SISTEMA PRONTO";
    statusText.innerText = "CLIQUE NO BOTÃO PARA LIGAR";
};

actionBtn.addEventListener('click', async () => {
    if (userName === "") {
        greetingText.innerText = "IDENTIFICAÇÃO";
        await speak("Olá! Eu sou o Assistente Z. Qual é o seu nome?");
        isAskingName = true;
        try { recognition.start(); } catch (e) {}
    } else {
        isAskingName = false;
        try { recognition.start(); } catch (e) {}
    }
});

if (recognition) {
    recognition.onstart = () => {
        sphere.className = "sphere listening";
        statusText.innerText = isAskingName ? "DIGA SEU NOME..." : "OUVINDO...";
    };

    recognition.onresult = async (event) => {
        const result = event.results[0][0].transcript.toLowerCase();
        transcriptArea.innerText = "${result}";
        if (isAskingName) {
            userName = result;
            greetingText.innerText = OLÁ, ${userName.toUpperCase()};
            await speak(Olá ${userName}, em que posso ajudar?);
            isAskingName = false;
        } else {
            // Comandos de busca usando caminhos verificados
            if (result.includes('youtube')) {
                let q = result.replace('youtube', '').replace('pesquisar', '').trim();
                window.open(https://www.youtube.com/results?search_query=${q}, "_blank");
            }
            else if (result.includes('google') || result.includes('pesquisar')) {
                let q = result.replace('google', '').replace('pesquisar', '').trim();
                window.open(https://www.google.com/search?q=${q}, "_blank");
            }
            else { 
                await speak("Comando recebido."); 
            }
        }
    };
}
