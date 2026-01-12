
import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, X, Bot, Minimize2 } from 'lucide-react';
import { getCareerAdvice } from '../services/geminiService';
import { UserProfile } from '../types';

interface AIAssistantProps {
  user: UserProfile;
  isVisible: boolean;
  onDismiss: () => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ user, isVisible, onDismiss }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'ai' | 'user', text: string }[]>([
    { role: 'ai', text: `Sawubona ${user.name.split(' ')[0]}! 🇿🇦 I'm your Sebenza Career Coach. How can I assist you today?` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    const aiResponse = await getCareerAdvice(user, userMsg);
    setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
    setLoading(false);
  };

  if (!isVisible) return null;

  return (
    // Repositioned to top-right area
    <div className="fixed top-24 right-8 z-[1000]">
      {!isOpen ? (
        <div className="flex items-center gap-3">
          <button 
            onClick={onDismiss}
            className="p-2 bg-red-500 text-white rounded-xl shadow-lg hover:bg-red-600 transition-all active:scale-95"
            title="Dismiss Assistant"
          >
            <X className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setIsOpen(true)}
            className="group relative bg-slate-900 dark:bg-indigo-600 text-white p-4 rounded-2xl shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-3"
          >
            <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
            <span className="font-black text-[10px] uppercase tracking-widest pr-2">Ask Sebenza AI</span>
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 w-[90vw] md:w-[420px] h-[600px] rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
          <div className="bg-slate-900 dark:bg-slate-800 p-6 text-white flex justify-between items-center relative">
            <div className="flex items-center gap-4">
              <div className="bg-indigo-600 p-3 rounded-2xl">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-lg">Sebenza AI</h3>
                <p className="text-[10px] text-indigo-400 uppercase tracking-widest font-black">Online Coach</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-2 hover:bg-white/10 rounded-xl transition-all"
                title="Minimize"
              >
                <Minimize2 className="w-5 h-5 text-white/50" />
              </button>
              <button 
                onClick={onDismiss} 
                className="p-2 bg-red-500 hover:bg-red-600 rounded-xl transition-all text-white"
                title="Dismiss Assistant"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50 dark:bg-slate-950 custom-scrollbar">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-5 rounded-[2rem] text-sm font-medium ${
                  m.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none shadow-lg' 
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-sm rounded-tl-none'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest flex items-center gap-2 px-2">
                <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce"></div>
                Thinking...
              </div>}
          </div>

          <div className="p-4 bg-white dark:bg-slate-900 border-t dark:border-slate-800">
            <div className="flex gap-2 bg-slate-100 dark:bg-slate-800 p-2 rounded-2xl">
              <input
                autoFocus
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask your coach anything..."
                className="flex-1 bg-transparent border-none px-4 py-2 text-sm outline-none dark:text-white font-medium"
              />
              <button onClick={handleSend} className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 transition-all shadow-md active:scale-95">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
