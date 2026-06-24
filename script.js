const actionBtn = document.getElementById('action-btn');
const sphere = document.getElementById('visualizer');
const statusText = document.getElementById('status');
const greetingText = document.getElementById('greeting');
const transcriptArea = document.getElementById('transcript');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.lang = 'pt-BR';
recognition.continuous = false;

// Função para o Robô Falar
const speak = (text) => {
    return new Promise((resolve) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'pt-BR';
        utterance.rate = 1.1; 
        utterance.pitch = 0.9; 

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

// Saudação ao carregar a página
window.onload = () => {
    setTimeout(async () => {
        greetingText.innerText = "Sistemas Online";
        await speak("Olá Reginaldo, o que eu posso fazer hoje por você?");
    }, 1000);
};

actionBtn.addEventListener('click', () => {
    recognition.start();
});

recognition.onstart = () => {
    sphere.className = "sphere listening";
    statusText.innerText = "Ouvindo...";
    transcriptArea.innerText = "";
};

recognition.onresult = (event) => {
    const command = event.results[0][0].transcript.toLowerCase();
    transcriptArea.innerText = "${command}";
    processCommand(command);
};

recognition.onerror = () => {
    sphere.className = "sphere idle";
    statusText.innerText = "Não entendi, tente de novo.";
};

async function processCommand(text) {
    // REDES SOCIAIS E BUSCA (URLs Verificadas)
    if (text.includes('youtube')) {
        let query = text.replace('pesquisar', '').replace('no youtube', '').replace('vídeo', '').replace('youtube', '').trim();
        await speak(Buscando ${query || 'vídeos'} no YouTube.);
        const url = query ? https://www.youtube.com/results?search_query=${query} : https://www.youtube.com;
        window.open(url, '_blank');
    } 
    else if (text.includes('google') || text.includes('pesquisar')) {
        let query = text.replace('pesquisar', '').replace('no google', '').trim();
        await speak(Pesquisando ${query} no Google.);
        window.open(https://www.google.com/search?q=${query}, '_blank');
    }
    else if (text.includes('whatsapp') || text.includes('zap')) {
        await speak("Abrindo seu WhatsApp.");
        window.open('https://web.whatsapp.com/', '_blank');
    }
    else if (text.includes('instagram')) {
        await speak("Acessando o Instagram.");
        window.open('https://www.instagram.com/', '_blank');
    }
    else if (text.includes('facebook')) {
        await speak("Abrindo o Facebook.");
        window.open('https://www.facebook.com/', '_blank');
    }
    else if (text.includes('tiktok')) {
        await speak("Iniciando o TikTok.");
        window.open('https://www.tiktok.com/', '_blank');
    }
    // ARQUIVOS
    else if (text.includes('arquivos') || text.includes('pastas')) {
        await speak("Reginaldo, estou abrindo o seletor de arquivos para você.");
        const input = document.createElement('input');
        input.type = 'file';
        input.click();
    }
    else {
        await speak("Ainda não conheço esse comando, Reginaldo.");
    }
}