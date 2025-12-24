import { OPENAI_API_KEY } from "./config.js";

const promptInput = document.querySelector("#aiPrompt");
const responseDiv = document.querySelector("#aiResponse");
const processingDiv = document.querySelector("#processing");

console.log("AI JS LOADED"); // Test në console

promptInput.addEventListener("keydown", async (event) => {
    if (event.key === "Enter") {
        event.preventDefault();

        const prompt = event.target.value.trim();
        if (!prompt) return;

        processingDiv.classList.remove("hidden");

        try {
            responseDiv.innerHTML = await askOzaflixAI(prompt);
        } catch (error) {
            responseDiv.innerHTML =
                "<p class='text-red-600'>Something went wrong</p>";
            console.error(error);
        } finally {
            processingDiv.classList.add("hidden");
            event.target.value = "";
        }
    }
});

async function askOzaflixAI(prompt) {
    const content = `
You are Ozaflix AI assistant.
Answer only about movies, TV shows, actors, genres, and recommendations.

User question:
${prompt}
    `;

    const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
            model: "gpt-4.1-mini",
            messages: [{ role: "user", content }],
        },
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${OPENAI_API_KEY}`,
            },
        }
    );

    return marked.parse(response.data.choices[0].message.content);


}
