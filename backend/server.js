const express = require('express');
const cors = require('cors');
const path = require('path');
const Anthropic = require('@anthropic-ai/sdk');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Initialize Anthropic
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Serve index.html at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// AI Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, systemPrompt } = req.body;

    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1000,
      system: systemPrompt,
      messages: messages,
    });

    res.json({ response: response.content[0].text });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to get AI response' });
  }
});

// Generate Quiz endpoint
app.post('/api/generate-quiz', async (req, res) => {
  try {
    const { subject, topic, grade, numQuestions = 5 } = req.body;

    const prompt = `Generate a quiz with ${numQuestions} multiple-choice questions on ${subject} topic: ${topic} for grade ${grade} Thai students. Each question should have 4 options (A, B, C, D) with one correct answer. Format as a JSON array of objects with keys: question, options (array of strings like "A) option text"), correct (0-based index), explanation. Return ONLY the JSON array with no extra text or markdown.`;

    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    });

    const quizText = response.content[0].text;
    // Strip any markdown fences just in case
    const clean = quizText.replace(/```json|```/g, '').trim();
    const quiz = JSON.parse(clean);

    res.json({ quiz });
  } catch (error) {
    console.error('Quiz generation error:', error);
    res.status(500).json({ error: 'Failed to generate quiz' });
  }
});

// Generate Content endpoint
app.post('/api/generate-content', async (req, res) => {
  try {
    const { topic, subject, grade, lang = 'en' } = req.body;

    const prompt = `Generate educational content about ${topic} in ${subject} for grade ${grade} Thai students. Include explanations, examples, and key points. Respond in ${lang === 'en' ? 'English' : 'Thai'}.`;

    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    });

    res.json({ content: response.content[0].text });
  } catch (error) {
    console.error('Content generation error:', error);
    res.status(500).json({ error: 'Failed to generate content' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});