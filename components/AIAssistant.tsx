
import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, X, Bot, Minimize2, Paperclip, Smile } from 'lucide-react';
import { getCareerAdvice } from '../services/geminiService';
import { UserProfile } from '../types';

interface AIAssistantProps {
  user: UserProfile;
  isVisible: boolean;
  onDismiss: () => void;
}

type MessageItem = {
    role: 'ai' | 'user';
    text: string;
    attachment?: {
      name: string;
      url: string;
      type: string;
    };
    reactions?: { emoji: string; count: number; youReacted?: boolean }[];
  };

  const AIAssistant: React.FC<AIAssistantProps> = ({ user, isVisible, onDismiss }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<MessageItem[]>([
      { role: 'ai', text: `Sawubona ${user.name.split(' ')[0]}! 🇿🇦 I'm your Sebenza Career Coach. How can I assist you today?` }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const objectUrls = useRef<string[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, [messages, isOpen]);

    useEffect(() => {
      return () => {
        // revoke any created object URLs
        objectUrls.current.forEach(u => URL.revokeObjectURL(u));
      };
    }, []);

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

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const ACCEPTED_TYPES = ['image/', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/'];

    const handleFile = async (f: File | null) => {
      if (!f) return;
      if (f.size > MAX_FILE_SIZE) {
        setMessages(prev => [...prev, { role: 'ai', text: `File ${f.name} is too large (max 5MB).` }]);
        return;
      }
      const isValid = ACCEPTED_TYPES.some(t => f.type.startsWith(t) || f.type === t);
      if (!isValid && !f.type.startsWith('image/')) {
        setMessages(prev => [...prev, { role: 'ai', text: `File type not supported: ${f.type || 'unknown'}` }]);
        return;
      }

      const url = URL.createObjectURL(f);
      objectUrls.current.push(url);

      const newMsg: MessageItem = { role: 'user', text: `Sent file: ${f.name}`, attachment: { name: f.name, url, type: f.type }, reactions: [] };
      setMessages(prev => [...prev, newMsg]);
      setLoading(true);

      // Let the AI know there's a file to review (simple approach)
      const aiResponse = await getCareerAdvice(user, `Please review the attached file: ${f.name}`);
      setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
      setLoading(false);

      if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const openFilePicker = () => fileInputRef.current?.click();

    const onDropFile = (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      const f = e.dataTransfer.files?.[0];
      handleFile(f);
    };

    const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragActive(true); };
    const onDragLeave = (e: React.DragEvent) => { e.preventDefault(); setDragActive(false); };

    const toggleReaction = (msgIndex: number, emoji: string) => {
      setMessages(prev => prev.map((m, idx) => {
        if (idx !== msgIndex) return m;
        const reactions = m.reactions || [];
        const rIndex = reactions.findIndex(r => r.emoji === emoji);
        if (rIndex === -1) {
          return { ...m, reactions: [...reactions, { emoji, count: 1, youReacted: true }] };
        }
        const r = reactions[rIndex];
        const youReacted = !r.youReacted;
        const count = youReacted ? r.count + 1 : Math.max(0, r.count - 1);
        let newReactions = [...reactions];
        if (count === 0) newReactions.splice(rIndex, 1);
        else newReactions[rIndex] = { ...r, count, youReacted };
        return { ...m, reactions: newReactions };
      }));
    };

    const emojiList = ['👍','🎉','👏','😀','💡','❤️'];

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
        <div className="bg-white dark:bg-slate-900 w-[90vw] md:w-[420px] h-[600px] rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 relative">
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

          <div ref={scrollRef} onDragOver={onDragOver} onDrop={onDropFile} onDragLeave={onDragLeave} className={`flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50 dark:bg-slate-950 custom-scrollbar ${dragActive ? 'ring-2 ring-indigo-300' : ''}`}>
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-5 rounded-[2rem] text-sm font-medium ${
                  m.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none shadow-lg' 
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-sm rounded-tl-none'
                }`}>
                  {m.attachment ? (
                    m.attachment.type.startsWith('image/') ? (
                      <img src={m.attachment.url} alt={m.attachment.name} className="max-w-full rounded-lg mb-2" />
                    ) : (
                      <div className="flex items-center gap-3 bg-slate-100 p-3 rounded-lg mb-2">
                        <div className="w-10 h-10 bg-slate-200 rounded flex items-center justify-center text-slate-500 font-bold">📎</div>
                        <div>
                          <div className="font-semibold text-sm text-slate-700 dark:text-slate-300">{m.attachment.name}</div>
                          <a href={m.attachment.url} download={m.attachment.name} className="text-indigo-600 text-xs">Download</a>
                        </div>
                      </div>
                    )
                  ) : null}

                  {m.text}

                  <div className="mt-3 flex gap-2 items-center">
                    {(m.reactions || []).map((r, idx) => (
                      <button key={idx} aria-label={`React with ${r.emoji}`} onClick={() => toggleReaction(i, r.emoji)} className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${r.youReacted ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
                        <span>{r.emoji}</span><span className="ml-1 font-semibold">{r.count}</span>
                      </button>
                    ))}

                    <div className="flex items-center gap-1 ml-1">
                      {emojiList.map((e, idx) => (
                        <button key={idx} aria-label={`React with ${e}`} onClick={() => toggleReaction(i, e)} className="p-1 text-sm hover:bg-slate-200 rounded">{e}</button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {loading && <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest flex items-center gap-2 px-2">
                <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce"></div>
                Thinking...
              </div>}

            {dragActive && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-white/80 dark:bg-slate-900/80 border-2 border-dashed border-indigo-300 rounded-lg p-6 text-indigo-600 font-semibold">Drop file to upload</div>
              </div>
            )}

          </div>

          <div className="p-4 bg-white dark:bg-slate-900 border-t dark:border-slate-800">
            <div className="flex gap-2 bg-slate-100 dark:bg-slate-800 p-2 rounded-2xl items-center relative">

              <button
                onClick={openFilePicker}
                title="Attach file"
                aria-label="Attach file"
                className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
              >
                <Paperclip className="w-5 h-5 text-slate-600 dark:text-slate-300" />
              </button>

              <input ref={fileInputRef} type="file" accept="image/*,.pdf,.doc,.docx,.txt" className="hidden" aria-label="File input" onChange={(e) => handleFile(e.target.files?.[0] ?? null)} />

              <input
                autoFocus
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask your coach anything... (or drop files into the chat)"
                className="flex-1 bg-transparent border-none px-4 py-2 text-sm outline-none dark:text-white font-medium"
              />

              <button onClick={handleSend} aria-label="Send message" className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 transition-all shadow-md active:scale-95">
                <Send className="w-4 h-4" />
              </button>

            </div>
            {dragActive && <div className="mt-2 text-xs text-slate-500">Drop file to upload</div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
