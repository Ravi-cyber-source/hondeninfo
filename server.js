import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// API KEY KOMT UIT RENDER ENVIRONMENT VARIABLES
// In Render → Environment → Add Variable:
// Name: GROQ_API_KEY
// Value: HIER JOU KEY
const GROQ_KEY = process.env.GROQ_API_KEY;

app.post("/chat", async (req, res) => {
  try {
    const { ras, vraag } = req.body;

    if (!GROQ_KEY) {
      return res.status(500).json({ error: "API key ontbreekt op de server." });
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + GROQ_KEY,
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

    if (!data.choices) {
      return res.status(500).json({ error: "Ongeldig antwoord van Groq API", raw: data });
    }

    res.json({ antwoord: data.choices[0].message.content });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Render gebruikt een dynamische poort
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server draait op poort " + PORT));
