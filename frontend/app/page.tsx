'use client';
import { useState, useEffect, useRef } from 'react';
import { Send, Bot, Sparkles } from 'lucide-react';


interface Message {
  role: 'bot' | 'user';
  text: string;
  buttons?: string[];
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: 'Namaste! 🙏 Welcome to NexChakra. How can I help transform your industry today?', buttons: [] }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const defaultIndustries = ["Healthcare", "Education", "Legal", "Hospitality", "Contact Expert ⚡"];

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const handleAction = async (text: string, isButton: boolean = false) => {
    const trimmedText = text.trim();
    if (!trimmedText) return;

    // Handle Button Redirections Immediately
    if (trimmedText === "Visit Contact Page") {
        window.location.href = "https://nexchakra.com/contact";
        return;
    }

    if (trimmedText === "Leave Email") {
        setMessages(prev => [...prev, { role: 'user', text: trimmedText, buttons: [] }]);
        setMessages(prev => [...prev, { role: 'bot', text: "Namaste! Please type your email address below, and our team will call you immediately.", buttons: [] }]);
        return;
    }

    if (trimmedText === "Main Menu") {
        setMessages(prev => [...prev, { role: 'bot', text: "Namaste! How else can I assist you?", buttons: [] }]);
        return;
    }

    // Fixed: Added empty buttons array to user message to satisfy Interface
    setMessages(prev => [...prev, { role: 'user', text: trimmedText, buttons: [] }]);
    setInputValue('');
    setIsTyping(true);

    try {
      const res = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmedText, is_button: isButton }),
      });
      const data = await res.json();
      setIsTyping(false);

      if (data.intent === "redirect_demo") {
         setMessages(prev => [...prev, { role: 'bot', text: data.text, buttons: data.buttons || [] }]);
         setTimeout(() => {
            window.location.href = "https://nexchakra.com/services";
         }, 1500);
         return;
      }

      setMessages(prev => [...prev, { role: 'bot', text: data.text, buttons: data.buttons || [] }]);

    } catch (error) {
      setIsTyping(false);
      setMessages(prev => [...prev, { role: 'bot', text: "Namaste! I'm having trouble syncing. Please try again or visit our site.", buttons: [] }]);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050a18] p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/20 blur-[120px] rounded-full animate-pulse" />
      
      <div className="w-full max-w-md z-10">
        <div className="flex flex-col items-center mb-6 animate-bounce transition-all duration-700">
           <div className="bg-gradient-to-tr from-blue-600 to-cyan-400 p-4 rounded-full shadow-[0_0_30px_rgba(37,99,235,0.4)] border-2 border-white/20">
              <Bot size={40} className="text-white" />
           </div>
           <p className="mt-2 text-blue-400 text-[10px] font-bold tracking-[0.2em] uppercase">NexChakra AI Active</p>
        </div>

        <div className="bg-[#0f172a]/90 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[600px] border border-white/10">
          <div className="bg-gradient-to-r from-blue-800 to-blue-600 p-4 shadow-lg border-b border-white/5 uppercase tracking-widest text-[11px] text-white flex items-center gap-2">
            NexChakra AI <Sparkles size={14} className="text-blue-300" />
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar scroll-smooth">
            {messages.map((m, i) => (
              <div key={i} className="space-y-3">
                <div className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2`}>
                    {m.role === 'bot' && <div className="bg-blue-600 p-1 rounded-full mb-1"><Bot size={12} className="text-white"/></div>}
                    <div className={`max-w-[85%] p-4 rounded-2xl text-[13px] shadow-sm ${
                    m.role === 'user' 
                        ? 'bg-blue-600 text-white rounded-br-none shadow-blue-500/20' 
                        : 'bg-[#1e293b] text-gray-200 border border-white/5 rounded-tl-none'
                    }`}>
                    {m.text}
                    </div>
                </div>
                {m.buttons && m.buttons.length > 0 && (
                    <div className="flex flex-wrap gap-2 ml-7">
                        {m.buttons.map((btn) => (
                            <button
                                key={btn}
                                onClick={() => handleAction(btn, true)}
                                className="bg-blue-500/10 border border-blue-400/30 text-blue-300 px-3 py-1.5 rounded-xl text-[10px] hover:bg-blue-600 hover:text-white transition-all active:scale-95"
                            >
                                {btn}
                            </button>
                        ))}
                    </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start gap-2 items-center">
                <div className="bg-blue-600 p-1 rounded-full"><Bot size={12} className="text-white"/></div>
                <div className="bg-[#1e293b] px-4 py-3 rounded-2xl rounded-tl-none flex gap-1 items-center">
                  <span className="w-1 h-1 bg-blue-400 rounded-full animate-bounce"></span>
                  <span className="w-1 h-1 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1 h-1 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
          </div>

          <div className="px-4 py-3 bg-[#1e293b]/20 border-t border-white/5 flex gap-2 overflow-x-auto no-scrollbar">
            {defaultIndustries.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => handleAction(name, true)}
                className={`whitespace-nowrap px-4 py-1.5 rounded-xl text-[11px] font-medium transition-all active:scale-90 border ${
                  name.includes("Contact") 
                  ? "bg-green-600/20 border-green-500/40 text-green-300 hover:bg-green-600" 
                  : "bg-blue-500/5 border-blue-400/20 text-blue-300 hover:bg-blue-600 hover:text-white"
                }`}
              >
                {name}
              </button>
            ))}
          </div>

          <div className="p-4 bg-[#0f172a] border-t border-white/5 flex gap-3 items-center">
            <input 
              className="flex-1 bg-[#1e293b] border border-white/10 rounded-2xl px-5 py-3 text-sm text-white placeholder-gray-500 outline-none" 
              placeholder="How can NexChakra help you?"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAction(inputValue, false)}
            />
            <button 
              type="button"
              aria-label="Send Message"
              onClick={() => handleAction(inputValue, false)}
              className="bg-blue-600 text-white p-3 rounded-2xl hover:bg-blue-500 shadow-lg"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}