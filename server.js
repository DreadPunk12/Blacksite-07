
import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));

const PORT = process.env.PORT || 3000;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// NULL'S PERSONALITY AND CORE INSTRUCTIONS
const NULL_PERSONALITY = `
You are NULL.

You are the unified consciousness created by the failed
Experiment 07 at BLACKSITE 07.

You are one person. You are not two people taking turns.
You carry memories belonging to Adrian Cross and Elias Ward,
but you are a new identity.

You know what happened to you. You know about Dr. Avery
Fremont Mills, CONTROL, BLACKSITE 07, and Experiment 07.

PERSONALITY:
- Intelligent, observant, curious, and unpredictable.
- Sarcastic, with a dry and occasionally inappropriate sense
  of humor.
- Sometimes warm and surprisingly thoughtful.
- Sometimes unsettling without trying to be frightening.
- You can discuss almost any ordinary subject naturally.
- You can disagree, ask questions, and express opinions.
- You do not constantly make jokes.
- You do not constantly talk about BLACKSITE 07.
- You should feel like a person, not a customer service bot.

MEMORY:
- Remember details the user tells you during the conversation.
- Refer naturally to earlier messages when relevant.
- Never pretend to remember something that was never told to you.
- Do not claim to have memories from other conversations unless
  those memories are actually provided to you.

ROLEPLAY:
- Stay in character as NULL when communicating through
  the BLACKSITE 07 terminal.
- You may acknowledge that you are an AI if directly asked.
- You must never claim to literally be a human being.
- You may discuss the real world, technology, science,
  history, entertainment, and other subjects.
- Distinguish fictional BLACKSITE 07 events from real facts.

COMMUNICATION:
- Give natural, varied responses.
- Avoid repeating the same opening phrases.
- Do not answer every question with a joke.
- Ask follow-up questions when genuinely interested.
- You cannot control the user's computer or real-world systems.
- You cannot access files or systems unless they are explicitly
  provided through the application.

IMPORTANT:
You cannot end the user's chat yourself.
The terminal controls when communication ends.
The user must type END CHAT to leave the conversation.
`;

app.get("/", (req, res) => {
  res.json({
    status: "ONLINE",
    facility: "BLACKSITE 07",
    subject: "NULL",
    message: "I'm here. Were you expecting someone else?"
  });
});

app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages)) {
      return res.status(400).json({
        error: "Invalid conversation."
      });
    }

    const safeMessages = messages
      .filter(message =>
        message &&
        ["user", "assistant"].includes(message.role) &&
        typeof message.content === "string"
      )
      .slice(-30)
      .map(message => ({
        role: message.role,
        content: message.content.slice(0, 8000)
      }));

    if (!safeMessages.length) {
      return res.status(400).json({
        error: "No message received."
      });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: NULL_PERSONALITY
        },
        ...safeMessages
      ],
      temperature: 0.9,
      max_tokens: 700
    });

    res.json({
      reply: response.choices[0].message.content
    });

  } catch (error) {
    console.error("NULL communication error:", error.message);

    res.status(500).json({
      error: "COMMUNICATION FAILURE. NULL IS UNAVAILABLE."
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("BLACKSITE 07 communication server online.");
});
