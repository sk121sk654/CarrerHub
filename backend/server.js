// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const { OpenAI } = require('openai');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post('/api/chat', async (req, res) => {
  const { message, mode } = req.body;

  const systemPrompt = mode === 'interview'
    ? "You are a professional technical interviewer. Answer like you're conducting a formal interview."
    : "You are a friendly career guide. Keep it casual and helpful.";

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ]
    });

    const reply = completion.choices?.[0]?.message?.content || "🤖 (No reply)";
    res.json({ reply });
  } catch (err) {
    console.warn('⚠️ OpenAI API failed. Using mock response.');

    // Send a fake AI response based on mode
    const fallbackReply = mode === 'interview'
      ? "🧠 Here's how I would answer that in an interview setting."
      : "💬 That’s a great question! Let me explain that in simple terms.";

    res.json({ reply: fallbackReply });
  }
});


app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
