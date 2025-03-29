// Your Gemini API key
const API_KEY = "AIzaSyCkDdVhBOgEj1ZKDn_DaNgod_m37oWoZAc";
// Updated endpoint for Gemini 1.5 Flash (more likely to work)
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

const chatBox = document.getElementById("chatBox");
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");

// Function to add a message to the chat box
function addMessage(text, isUser = false) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message");
    messageDiv.classList.add(isUser ? "user-message" : "bot-message");
    messageDiv.textContent = text;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to bottom
}

// Function to call Gemini API
async function getGeminiResponse(prompt) {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            { text: prompt }
                        ]
                    }
                ]
            }),
        });

        if (!response.ok) {
            throw new Error(`API request failed with status: ${response.status}`);
        }

        const data = await response.json();
        if (!data.candidates || !data.candidates[0].content.parts[0].text) {
            throw new Error("Invalid response from API");
        }

        const botResponse = data.candidates[0].content.parts[0].text;
        return botResponse;
    } catch (error) {
        console.error("Error:", error);
        return `Sorry, bhai! Error: ${error.message}. Check your API key or endpoint!`;
    }
}

// Handle form submission
chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const userMessage = userInput.value.trim();
    if (!userMessage) return;

    // Add user message
    addMessage(userMessage, true);
    userInput.value = ""; // Clear input

    // Show typing indicator
    addMessage("Typing...");

    // Get and display bot response
    const botResponse = await getGeminiResponse(userMessage);
    chatBox.lastChild.remove(); // Remove typing indicator
    addMessage(botResponse);
});