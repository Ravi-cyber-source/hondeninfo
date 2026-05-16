// netlify/functions/chat.js
import fetch from "node-fetch";

export async function handler(event) {
  try {
    const { ras, vraag } = JSON.parse(event.body);

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        // Jij vroeg om dit:
        "Authorization": "Bearer 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",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-70b-versatile",
        messages: [
          {
            role: "system",
            content: `
Je bent een vriendelijke advies-assistent.
Je geeft tips, info, advies en productlinks.
Houd rekening met het gekozen ras/soort: ${ras}.
            `
          },
          {
            role: "user",
            content: vraag
          }
        ],
        temperature: 0.6
      })
    });

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({ antwoord: data.choices[0].message.content })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
}
