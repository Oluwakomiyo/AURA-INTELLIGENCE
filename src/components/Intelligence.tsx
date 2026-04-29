import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Loader2, Trash2, Key } from 'lucide-react';
import Markdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { generateIntelligence, getIntelligenceHistory, clearIntelligenceHistory } from '../services/gemini';
import { cn } from '../lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function Intelligence() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadHistory = async () => {
      const history = await getIntelligenceHistory();
      if (history.length > 0) {
        setMessages(history.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        })));
      } else {
        setMessages([
          {
            id: '1',
            role: 'assistant',
            content: "Welcome to Aura Intelligence. I am your strategic advisor. How can I assist with your executive decisions today?",
            timestamp: new Date(),
          }
        ]);
      }
    };
    loadHistory();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const context = messages.slice(-5).map(m => `${m.role}: ${m.content}`).join('\n');
      const response = await generateIntelligence(input, context);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error("Intelligence handleSend Error:", error);
      
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Error: ${error.message}${error.isApiKeyError ? '\n\nAura requires a valid API key to function. Please try selecting one from your project settings.' : ''}`,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = async () => {
    await clearIntelligenceHistory();
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: "Welcome to Aura Intelligence. I am your strategic advisor. How can I assist with your executive decisions today?",
        timestamp: new Date(),
      }
    ]);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col glass-panel overflow-hidden">
      <header className="p-6 border-b border-aura-border flex justify-between items-center bg-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-aura-gold/10 flex items-center justify-center border border-aura-gold/20">
            <Sparkles className="w-5 h-5 text-aura-gold" />
          </div>
          <div>
            <h3 className="font-bold">Aura Intelligence</h3>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Neural Strategy Engine</p>
          </div>
        </div>
        <button 
          onClick={handleClear}
          className="p-2 text-zinc-500 hover:text-red-400 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </header>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
      >
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex gap-4 max-w-[85%]",
                message.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-1",
                message.role === 'assistant' ? "bg-aura-gold text-black" : "bg-white/10 text-white"
              )}>
                {message.role === 'assistant' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
              </div>
              <div className={cn(
                "p-4 rounded-2xl text-sm leading-relaxed",
                message.role === 'assistant' 
                  ? "bg-white/5 border border-white/10" 
                  : "bg-aura-gold/10 border border-aura-gold/20 text-zinc-100"
              )}>
                <div className="markdown-body">
                  <Markdown>{message.content}</Markdown>
                </div>
                {message.content.includes("API key") && window.aistudio && (
                  <button 
                    onClick={() => window.aistudio.openSelectKey()}
                    className="mt-4 px-4 py-2 bg-aura-gold text-black text-xs font-bold rounded-lg hover:bg-yellow-500 transition-all flex items-center gap-2"
                  >
                    <Key className="w-3 h-3" />
                    Select API Key
                  </button>
                )}
                <div className="mt-2 text-[10px] text-zinc-500 font-mono">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-4"
          >
            <div className="w-8 h-8 rounded-lg bg-aura-gold text-black flex items-center justify-center">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2">
              <span className="text-xs text-zinc-400 animate-pulse">Aura is analyzing...</span>
            </div>
          </motion.div>
        )}
      </div>

      <div className="p-6 bg-white/5 border-t border-aura-border">
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask Aura for strategic insights..."
            className="w-full bg-aura-black border border-aura-border rounded-xl px-4 py-4 pr-14 text-sm focus:outline-none focus:border-aura-gold/50 transition-colors resize-none h-24"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-3 bottom-3 p-2 bg-aura-gold text-black rounded-lg hover:bg-yellow-500 transition-all disabled:opacity-50 disabled:hover:bg-aura-gold"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[10px] text-zinc-600 mt-2 text-center">
          Powered by Gemini Intelligence Layer
        </p>
      </div>
    </div>
  );
}
