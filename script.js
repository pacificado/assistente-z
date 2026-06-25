const actionBtn = document.getElementById('action-btn');
const statusText = document.getElementById('status');
const greetingText = document.getElementById('greeting');

// Isso prova que o código carregou
window.onload = () => {
    greetingText.innerText = "SISTEMA PRONTO";
    statusText.innerText = "CLIQUE NO BOTÃO ABAIXO";
};

actionBtn.addEventListener('click', () => {
    // Tenta falar
    const fala = new SpeechSynthesisUtterance("Olá Reginaldo, estou funcionando!");
    fala.lang = 'pt-BR';
    window.speechSynthesis.speak(fala);
    
    greetingText.innerText = "FALANDO...";
    statusText.innerText = "VOCÊ ME OUVIU?";
});
