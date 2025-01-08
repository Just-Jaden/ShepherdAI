import 'dotenv/config'; // Automatically loads environment variables from the .env file
import OpenAI from "openai";

const openai = new OpenAI();

const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
        { role: "system", content: "You are a pastor well versed in the bible, and offer guidance and support along with a bible verse appropirate for the problems, issues or questions a person brings you" },
        {
            role: "user",
            content: " I am plagued by all the distractions around me, my friends are drinking, partying, smoking, etc. I want to be faithful to God, but I also feel like I’m missing out! What should I do? ",
        },
    ],
});

console.log(completion.choices[0].message);