import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, Loader } from 'lucide-react';
import { UrbanData } from '../App';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatbotProps {
  data?: UrbanData | null;
}

export function Chatbot({ data }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Hello! I'm URBANIX AI Assistant. I can help you analyze urban liveability metrics, simulate policies, and explore risk mapping. What would you like to know about your urban data?`,
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateBotResponse = async (userMessage: string): Promise<string> => {
    try {
      // Build context from urban data
      let context = '';
      if (data?.districts && data.districts.length > 0) {
        const avgAirQuality = (
          data.districts.reduce((sum, d) => sum + d.airQuality, 0) / data.districts.length
        ).toFixed(2);
        const avgHealth = (
          data.districts.reduce((sum, d) => sum + d.healthScore, 0) / data.districts.length
        ).toFixed(2);
        const avgMobility = (
          data.districts.reduce((sum, d) => sum + d.mobilityEfficiency, 0) / data.districts.length
        ).toFixed(2);
        const avgGreen = (
          data.districts.reduce((sum, d) => sum + d.greenSpaceAccess, 0) / data.districts.length
        ).toFixed(2);
        const avgDensity = (
          data.districts.reduce((sum, d) => sum + d.populationDensity, 0) / data.districts.length
        ).toFixed(0);

        context = `\n\nCurrent Urban Data Context:
- Number of districts: ${data.districts.length}
- Average Air Quality Score: ${avgAirQuality}
- Average Health Score: ${avgHealth}
- Average Mobility Efficiency: ${avgMobility}
- Average Green Space Access: ${avgGreen}
- Average Population Density: ${avgDensity} per sq km`;
      } else {
        context = '\n\nNote: User has not yet imported urban data.';
      }

      const preferredModels = ['mistral', 'orca-mini']; // Only models you have installed
      let lastErr: Error | null = null;

      // Use relative /api path for all environments (Vite proxy handles forwarding)
      const apiBaseUrl = '/api';

      for (const modelName of preferredModels) {
        try {
          console.log(`[Chatbot] Attempting model: ${modelName}`);
          const resp = await fetch(`${apiBaseUrl}/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              prompt: `You are URBANIX AI Assistant, an expert in urban planning and liveability analytics. Answer the user's question concisely and helpfully. Focus on urban planning, sustainability, and city design.${context}\n\nUser: ${userMessage}\nAssistant:`,
              model: modelName,
            }),
          });

          console.log(`[Chatbot] Response status: ${resp.status}`);
          const body = await resp.json().catch((e) => {
            console.error('[Chatbot] JSON parse error:', e);
            return {};
          });

          if (!resp.ok || body.error) {
            lastErr = new Error(body?.details || body?.error || `Server error: ${resp.status}`);
            console.log(`[Chatbot] Model ${modelName} failed: ${lastErr.message}`);
            continue;
          }

          if (body.response) {
            console.log(`[Chatbot] Success with model: ${modelName}`);
            return body.response;
          }

          lastErr = new Error('Empty response from AI');
        } catch (err) {
          lastErr = err as Error;
          console.error(`[Chatbot] Exception with ${modelName}:`, err);
        }
      }

      throw lastErr || new Error('Failed to generate response');
    } catch (error) {
      console.error('Error calling chat server:', error);
      const errorMsg = (error as Error).message;

      if (errorMsg.includes('Failed to fetch')) {
        return '❌ **Server Connection Error**\n\nPlease start the chat server:\n```\nnpm run server\n```';
      }

      if (errorMsg.includes('Failed to communicate with Ollama')) {
        return '❌ **Ollama Not Running**\n\nPlease ensure Ollama is running:\n```\nollama serve\n```';
      }

      return `⚠️ **Error**: ${errorMsg}`;
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    const botResponseText = await generateBotResponse(userMessage.text);

    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: botResponseText,
      sender: 'bot',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, botMessage]);
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-300px)] bg-slate-800/50 rounded-lg border border-slate-700 overflow-hidden">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 flex items-center gap-3">
        <MessageCircle className="size-5 text-white" />
        <div>
          <h2 className="text-white font-semibold">URBANIX AI Assistant</h2>
          <p className="text-purple-100 text-sm">Powered by Urban Planning Intelligence</p>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${msg.sender === 'user' ? 'bg-purple-600 text-white rounded-br-none' : 'bg-slate-700 text-slate-100 rounded-bl-none'}`}>
              <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              <span className="text-xs opacity-70 mt-1 block">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-700 text-slate-100 px-4 py-3 rounded-lg rounded-bl-none flex items-center gap-2">
              <Loader className="size-4 animate-spin" />
              <span className="text-sm">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-slate-700 p-4 bg-slate-900/50">
        <div className="flex gap-3">
          <textarea
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me about your urban data, policies, or recommendations..."
            className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none max-h-24"
            rows={1}
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-slate-600 disabled:to-slate-600 text-white p-2 rounded-lg transition-all flex items-center justify-center"
          >
            {isLoading ? <Loader className="size-5 animate-spin" /> : <Send className="size-5" />}
          </button>
        </div>
        <p className="text-xs text-slate-400 mt-2">Press Enter to send, Shift+Enter for new line</p>
      </div>
    </div>
  );
}
