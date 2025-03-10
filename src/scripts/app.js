// Select elements
const chatbox = document.getElementById('chatbox');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');

// Function to append a message to the chatbox
function addMessage(content, className) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${className}`;
    messageDiv.innerText = content;
    chatbox.appendChild(messageDiv);
    chatbox.scrollTop = chatbox.scrollHeight; // Scroll to the latest message
}

// Send user input to the backend
async function sendMessage() {
    const message = userInput.value.trim(); // Get and sanitize input
    if (!message) return;

    // Add user's message to the chat
    addMessage(message, 'userMessage');
    userInput.value = ''; // Clear the input field

    // Prepare the POST request
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        userId: "user123", // Replace with dynamic user ID if available
        message: message
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    try {
        // Send the request to the backend API
        const response = await fetch("http://localhost:3000/ask", requestOptions);
        console.log("Sending request to:", "http://localhost:3000/ask");
        const result = await response.json();

        // Add the bot's response to the chat
        addMessage(result.response || "Sorry, I couldn't understand that.", 'botMessage');
    } catch (error) {
        console.error('Error:', error);
        addMessage("An error occurred. Please try again later.", 'botMessage');
    }
}

// Attach the send message function to the button
sendButton.addEventListener('click', () => {

 sendMessage();

});


// Allow pressing Enter to send a message
userInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});
