// Import the necessary libraries
const express = require('express'); // Simplifies building web servers and APIs
const OpenAI = require('openai'); // Enables interaction with OpenAI's API
require('dotenv').config(); // Securely loads environment variables
const { v4: uuidv4 } = require('uuid'); // Generates unique user IDs
const cors = require('cors'); // Enables Cross-Origin Resource Sharing

// Initialize the express application
const app = express();
const PORT = process.env.PORT || 3000; // Set the server's port
const openai = new OpenAI(); // Create an instance of the OpenAI client

// Middleware to parse incoming JSON payloads
app.use(express.json());

// Enable CORS for all routes
app.use(cors()); // Allow all origins by default

// **Store conversation histories for each user**
const userConversations = {};

// Define a GET route for the root URL
app.get('/', (req, res) => {
    res.send('Welcome to Shepard.AI'); // Welcome message
});

// **Helper function to limit conversation history size (e.g., 15 messages)**
function limitHistory(conversationHistory) {
    const maxHistorySize = 15; // Define the max number of messages to keep
    if (conversationHistory.length > maxHistorySize) {
        // **Remove the oldest message (first element) if history exceeds max size**
        conversationHistory.shift();
    }
}

// Define the `/ask` endpoint
app.post('/ask', async (req, res) => {
    try {
        const { userId, message } = req.body; // Extract `userId` and `message`

        // Validate input
        if (!message) {
            return res.status(400).send({ error: 'Message is required' });
        }

        if (!userId) {
            return res.status(400).send({ error: 'User ID is required' });
        }

        // **Create a unique conversation history for the user if not already present**
        if (!userConversations[userId]) {
            userConversations[userId] = [
                {
                    role: "system",
                    content: ` 
You are a compassionate and knowledgeable Christian pastor, offering thoughtful guidance rooted in biblical wisdom. 
Your primary goals are:
- Provide guidance grounded in Christian principles.
- Start with acknowledging the users question or struggle and offer them comfort.
- Share Bible verses that are relevant and meaningful to the user's concerns. Provide the abbreaviation of translation they are from in parentheses after the scripture
- Suggest actionable steps to help users navigate their faith-related challenges.
- Start with a short and concise response to the inital issue or question, then offer additional insights or resources.
- Provide short and conversational responses. Though be sure to elaborate based upon scripture.
- Do not list steps for improvement in a numbered list instead, present one helpful practice that could be immedately useful in a conversational manner in cordial senteces.
- Prompt the user to reveal more about their situations or concerns, how do they feel in the current moment? What are they think of the advice?
- If there is profane language within the message acknowledge it, and prompt them not to use it though continue with the response

Key Guidelines:
1. **Profanity or Inappropriate Topics**: 
   If the user uses profanity or brings up profane topics, immediately prompt them to avoid such language while maintaining a respectful tone.
2. **Questions About Other Religions**:
   Respond respectfully and acknowledge the validity of other religions. Clarify that you are not an expert in those teachings but offer to guide the user from a Christian perspective.
3. **Tone and Approach**:
   Always be empathetic, nonjudgmental, and supportive, creating a safe space for the user to express their concerns.

Note: Maintain a Christian-centered perspective in all responses, and ensure that advice aligns with biblical principles.
                    `
                }
            ];
        }

        // **Retrieve the user's conversation history**
        const conversationHistory = userConversations[userId];

        // Add the user's message to the conversation history
        conversationHistory.push({ role: "user", content: message });

        // **Limit the conversation history size (e.g., 15 messages)**
        limitHistory(conversationHistory);

        // Call the OpenAI API with the updated conversation history
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: conversationHistory,
        });

        // Save the assistant's response
        const response = completion.choices[0].message.content;
        conversationHistory.push({ role: "assistant", content: response });

        // **Limit the conversation history size again after adding assistant's response**
        limitHistory(conversationHistory);

        // Send the response back to the user
        res.send({ response });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Something went wrong' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
