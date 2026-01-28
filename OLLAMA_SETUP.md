# Ollama AI Setup Guide

The URBANIX chatbot now uses **Ollama** - a local AI service that runs on your machine for free!

## ✅ What's Already Done

- Ollama is installed
- Ollama server is running
- Mistral model is being downloaded

## 🚀 Getting Started

### 1. Wait for Model Download
The Mistral model (~4GB) is downloading. You can check progress:
```bash
ps aux | grep ollama
```

### 2. Start Your App
Once the model finishes downloading, run your app:
```bash
npm run dev
```

### 3. Use the Chatbot
- Open the "AI Chatbot" tab
- Ask questions about urban planning!
- The chatbot will have access to your imported data

## 💡 How It Works

- **Local Processing**: Everything runs on your machine - no data sent to external servers
- **Context-Aware**: The chatbot receives your urban data and provides relevant insights
- **Free**: No API keys or subscriptions needed
- **Fast**: Runs offline after model is cached

## 🛠️ Troubleshooting

### Model not downloaded yet?
Wait a bit longer and check:
```bash
ollama list
```

### Ollama not running?
Restart it:
```bash
ollama serve
```

### Want a different model?
Pull alternatives:
```bash
ollama pull llama2          # More powerful but slower
ollama pull neural-chat     # Smaller and faster
```

## 📝 Available Models

- **mistral** (default) - Fast, good for general use
- **llama2** - More powerful, better reasoning
- **neural-chat** - Smaller, fastest responses
- **orca-mini** - Lightweight alternative

Switch models by editing the `generateBotResponse` function in [Chatbot.tsx](src/components/Chatbot.tsx) and changing `model: 'mistral'` to your preferred model.

## 🌐 API Endpoint
The chatbot calls `http://localhost:11434/api/generate` - make sure Ollama stays running!

---

Enjoy your AI-powered urban planning assistant! 🏙️✨
