import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Proxy endpoint for Ollama API
app.post('/api/chat', async (req, res) => {
  try {
    const { prompt, model = 'mistral' } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        prompt,
        stream: false,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`);
    }

    const data = await response.json();
    res.json({ response: data.response?.trim() || '' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      error: 'Failed to communicate with Ollama',
      details: (error as Error).message,
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`🤖 URBANIX Chat Server running on http://localhost:${PORT}`);
  console.log(`📡 Proxying requests to Ollama at http://localhost:11434`);
});
