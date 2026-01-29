import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Proxy endpoint for Ollama API with fallback to smaller models
app.post('/api/chat', async (req, res) => {
  try {
    let { prompt, model = 'tinyllama' } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Try the requested model first, then fallback to smaller models
    // Only try models that are likely to be installed based on user's system
    const modelsToTry = [model, 'orca-mini', 'mistral'].filter((m, idx, arr) => arr.indexOf(m) === idx); // Remove duplicates, preserve order
    let lastError: Error | null = null;

    for (const modelName of modelsToTry) {
      try {
        console.log(`[Chat] Trying model: ${modelName}`);
        const response = await fetch('http://localhost:11434/api/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: modelName,
            prompt,
            stream: false,
            temperature: 0.7,
          }),
        });

        if (!response.ok) {
          const errText = await response.text();
          lastError = new Error(`Ollama error: ${response.status} - ${errText}`);
          console.log(`[Chat] Model ${modelName} failed: ${lastError.message}`);
          continue;
        }

        const data = await response.json();
        const responseText = data.response?.trim() || '';
        
        if (!responseText) {
          lastError = new Error('Empty response from model');
          continue;
        }

        // Success! Append note if we used fallback
        let finalResponse = responseText;
        if (modelName !== model && modelName !== 'mistral') {
          finalResponse += `\n\n_(Used fallback model '${modelName}' - ${model} not available)_`;
        }

        console.log(`[Chat] Success with model: ${modelName}`);
        return res.json({ response: finalResponse });
      } catch (err) {
        lastError = err as Error;
        console.log(`[Chat] Exception with ${modelName}: ${lastError.message}`);
        // Try next model
      }
    }

    throw lastError || new Error('All models failed - no available models in Ollama');
  } catch (error) {
    console.error('[Chat Server Error]:', error);
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
