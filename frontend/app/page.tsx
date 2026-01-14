'use client';
import { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, Bot, User, Sparkles } from 'lucide-react';

export default function Home() {
  const [messages, setMessages] = useState([
    { role: 'bot', text: '👋 Welcome to NexChakra! I am your digital solutions expert. Which industry can I help you transform today?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Industries from your website
  const industries = ["Education", "Healthcare", "Government", "Legal", "Hospitality"];

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleAction = async (text: string, isButton = false) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { role: 'user', text }]);
    setInputValue('');

    try {
      const res = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, is_button: isButton }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'bot', text: data.text }]);
    } catch {
      setMessages(prev => [...prev, { role: 'bot', text: "I'm having a quick recharge. Please try again in a second!" }]);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050a18] p-4 relative overflow-hidden">
      {/* Animated Background Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/20 blur-[120px] rounded-full animate-pulse" />
      
      <div className="w-full max-w-md z-10">
        {/* Cute Floating Robot Header */}
        <div className="flex flex-col items-center mb-6 animate-bounce transition-all duration-1000">
           <div className="bg-gradient-to-tr from-blue-600 to-cyan-400 p-4 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.5)] border-2 border-white/20">
              <Bot size={40} className="text-white" />
           </div>
           <div className="mt-2 bg-blue-500/10 backdrop-blur-md px-3 py-1 rounded-full border border-blue-500/20">
              <p className="text-blue-400 text-xs font-bold tracking-widest uppercase">NexChakra AI Active</p>
           </div>
        </div>

        <div className="bg-[#0f172a]/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[600px] border border-white/10">
          {/* Top Bar */}
          <div className="bg-gradient-to-r from-blue-700 to-blue-600 p-4 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-ping" />
              <h1 className="font-bold text-white tracking-tight flex items-center gap-2">
                NEXCHAKRA ASSISTANT <Sparkles size={16} />
              </h1>
            </div>
          </div>

          {/* Chat Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-blue-900">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2`}>
                {m.role === 'bot' && <div className="bg-blue-600 p-1.5 rounded-full mb-1"><Bot size={14} className="text-white"/></div>}
                <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                  m.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none shadow-blue-500/20 shadow-lg' 
                    : 'bg-[#1e293b] text-gray-100 border border-white/5 rounded-bl-none'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Industry Select Buttons */}
          <div className="px-4 py-3 bg-[#1e293b]/30 border-t border-white/5 flex gap-2 overflow-x-auto no-scrollbar">
            {industries.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => handleAction(name, true)}
                className="whitespace-nowrap bg-blue-500/10 border border-blue-400/30 text-blue-300 px-4 py-1.5 rounded-xl text-xs font-semibold hover:bg-blue-600 hover:text-white transition-all hover:scale-105 active:scale-95"
              >
                {name}
              </button>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-4 bg-[#0f172a] border-t border-white/5 flex gap-3 items-center">
            <input 
              className="flex-1 bg-[#1e293b] border border-white/10 rounded-2xl px-5 py-3 text-sm text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
              placeholder="Ask NexChakra anything..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAction(inputValue)}
            />
            <button 
              type="button"
              aria-label="Send Message"
              onClick={() => handleAction(inputValue)}
              className="bg-blue-600 text-white p-3 rounded-2xl hover:bg-blue-500 shadow-lg shadow-blue-600/20 transition-all active:scale-90"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}