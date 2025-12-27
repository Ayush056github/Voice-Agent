const startBtn = document.getElementById('startBtn');
const outputDiv = document.getElementById('output');


const recognition = new(window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

const synth = window.speechSynthesis;

startBtn.addEventListener('click', () => {
    recognition.start();
    startBtn.disabled = true;
    outputDiv.textContent = 'Listening...';
});


recognition.onresult = (event) => {
    const speechToText = event.results[0][0].transcript;
    outputDiv.textContent = `You said: "${speechToText}"`;
    console.log('User said:', speechToText);


    const responseText = generateResponse(speechToText);
    speakResponse(responseText);
};


recognition.onerror = (event) => {
    outputDiv.textContent = 'Sorry, I didn\'t catch that.';
    startBtn.disabled = false;
};


let conversationContext = {
    lastTopic: '',
    lastWeatherResponse: ''
};


function generateResponse(inputText) {
    let response = '';


    if (inputText.toLowerCase().includes('hello')) {
        if (conversationContext.lastTopic === 'greeting') {
            response = 'Hello again! What would you like to talk about?';
        } else {
            response = 'Hi there! How can I assist you today?';
            conversationContext.lastTopic = 'greeting';
        }
    } else if (inputText.toLowerCase().includes('who are you')) {
        response = 'I\'m an AI Assistant';
        conversationContext.lastTopic = 'mood';
    } else if (inputText.toLowerCase().includes('how are you')) {
        response = 'I\'m doing great, thanks for asking!';
        conversationContext.lastTopic = 'mood';
    } else if (inputText.toLowerCase().includes('weather')) {
        if (conversationContext.lastWeatherResponse === 'sunny') {
            response = 'The weather is still sunny and 25°C.';
        } else {
            response = 'The weather is sunny and 25°C.';
            conversationContext.lastWeatherResponse = 'sunny';
        }
        conversationContext.lastTopic = 'weather';
    } else if (inputText.toLowerCase().includes('goodbye')) {
        response = 'Goodbye! Have a great day!';
        conversationContext.lastTopic = 'goodbye';
    } else if (inputText.toLowerCase().includes('who created you')) {
        response = 'I was created by a developer named Ayush Mathur to assist with various tasks and provide information.';
        conversationContext.lastTopic = 'creator';
    } else {
        response = 'I\'m not sure how to respond to that. Can you ask something else?';
        conversationContext.lastTopic = 'unknown';
    }

    return response;
}


function speakResponse(responseText) {
    const utterance = new SpeechSynthesisUtterance(responseText);
    synth.speak(utterance);
    utterance.onend = () => {
        startBtn.disabled = false;
    };
}