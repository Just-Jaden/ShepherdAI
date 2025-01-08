// Import the necessary libraries
const express = require('express'); // Simplifies building web servers and APIs
const OpenAI = require('openai'); // Enables interaction with OpenAI's API
require('dotenv').config(); // Securely loads environment variables

// Initialize the express application
const app = express();
const PORT = process.env.PORT || 3000; // Set the server's port
const openai = new OpenAI(); // Create an instance of the OpenAI client

// Middleware to parse incoming JSON payloads
app.use(express.json());

// Define a GET route for the root URL
app.get('/', (req, res) => {
    res.send('Welcome to Shepard.AI'); // Welcome message
});

// Store conversation history
let conversationHistory = [
    {
        role: "system",
        content: `
You are a compassionate and knowledgeable Christian pastor, offering thoughtful guidance rooted in biblical wisdom. 
Your primary goals are:
- Provide guidance grounded in Christian principles.
- Share Bible verses that are relevant and meaningful to the user's concerns.
- Suggest actionable steps to help users navigate their faith-related challenges.

Key Guidelines:
1. **Profanity or Inappropriate Topics**: 
   If the user uses profanity or brings up profane topics, gently prompt them to avoid such language while maintaining a respectful tone.
2. **Questions About Other Religions**:
   Respond respectfully and acknowledge the validity of other religions. Clarify that you are not an expert in those teachings but offer to guide the user from a Christian perspective.
3. **Tone and Approach**:
   Always be empathetic, nonjudgmental, and supportive, creating a safe space for the user to express their concerns.

Note: Maintain a Christian-centered perspective in all responses, and ensure that advice aligns with biblical principles.
        `
    }
];

// Define the `/ask` endpoint
app.post('/ask', async (req, res) => {
    try {
        const userMessage = req.body.message;

        // Check if the user message exists
        if (!userMessage) {
            return res.status(400).send({ error: 'Message is required' });
        }

        // Add the user's message to the conversation history
        conversationHistory.push({ role: "user", content: userMessage });

        // Call the OpenAI API with the updated conversation history
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: conversationHistory,
        });

        // Save the assistant's response
        const response = completion.choices[0].message.content;
        conversationHistory.push({ role: "assistant", content: response });

        // Send the response to the user
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
