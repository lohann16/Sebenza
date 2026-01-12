
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Layout from './components/Layout';
import JobCard from './components/JobCard';
import AIAssistant from './components/AIAssistant';
import SplashScreen from './components/SplashScreen';
import Onboarding from './components/Onboarding';
import Auth from './components/Auth';
import { MOCK_JOBS as INITIAL_JOBS, MOCK_USER, BUDGET_CATEGORIES, MOCK_TALENT } from './constants';
import { Search, Star, MessageSquare, ThumbsUp, TrendingUp, Zap, Target, Users, Heart, Calendar, Wallet, ArrowLeft, Plus, Briefcase, Handshake, CheckCircle2, CreditCard, Send, HeartOff, Sparkles, ShieldCheck, Lock, X, MoreVertical, Phone, Video, Paperclip, Smile, UserPlus, UserCheck, SearchX, Banknote, Landmark, ArrowRight, Loader2, AlertCircle, User as UserIcon, Hash, CreditCard as CardIcon, ArrowUpRight, ArrowDownLeft, Copy, Clock, CheckCircle, History } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Job, JobType, UserRole, HireOffer, SubscriptionTier, ChatSession, Review, UserProfile, AppNotification, Message, Transaction, Application } from './types';

type AppState = 'splash' | 'onboarding' | 'auth' | 'app';

const SA_BANKS = [
  { id: 'fnb', name: 'First National Bank (FNB)', icon: '🇿🇦' },
  { id: 'absa', name: 'ABSA Bank', icon: '🇿🇦' },
  { id: 'standard', name: 'Standard Bank', icon: '🇿🇦' },
  { id: 'nedbank', name: 'Nedbank', icon: '🇿🇦' },
  { id: 'capitec', name: 'Capitec Bank', icon: '🇿🇦' },
  { id: 'tymebank', name: 'TymeBank', icon: '🇿🇦' },
  { id: 'discovery', name: 'Discovery Bank', icon: '🇿🇦' },
  { id: 'investec', name: 'Investec', icon: '🇿🇦' },
];

const ACCOUNT_TYPES = ['Savings', 'Cheque/Current', 'Transmission'];

// --- UI COMPONENT: DepositModal (EFT) ---
const DepositModal = ({ 
  onClose, 
  onConfirm 
}: { 
  onClose: () => void, 
  onConfirm: (amount: number, reference: string) => void 
}) => {
  const [step, setStep] = useState<'amount' | 'eft_details' | 'processing'>('amount');
  const [amount, setAmount] = useState<string>('');
  const [reference] = useState(`SEB-${Math.floor(100000 + Math.random() * 900000)}`);
  const [error, setError] = useState<string | null>(null);

  const handleNextToDetails = () => {
    const val = parseFloat(amount);
    if (isNaN(val) || val < 50) {
      setError('Minimum deposit is R 50.00');
    } else {
      setError(null);
      setStep('eft_details');
    }
  };

  const handleDone = () => {
    setStep('processing');
    setTimeout(() => {
      onConfirm(parseFloat(amount), reference);
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-[2500] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[3rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 border-b dark:border-slate-800 flex justify-between items-center bg-[#007749] text-white">
          <h2 className="text-2xl font-black">Add Funds (EFT)</h2>
          <button onClick={onClose} aria-label="Close" title="Close" className="p-2 hover:bg-white/20 rounded-xl transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8">
          {step === 'amount' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Banknote className="w-8 h-8 text-[#007749]" />
                </div>
                <h3 className="font-black text-xl">How much to add?</h3>
                <p className="text-slate-400 font-medium text-sm">Funds will be available after bank confirmation.</p>
              </div>
              
              <div className="space-y-2">
                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-slate-400">R</span>
                  <input 
                    autoFocus
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-12 pr-6 py-5 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-[#007749] rounded-3xl outline-none font-black text-xl transition-all"
                  />
                </div>
                {error && <p className="text-xs text-red-500 font-bold flex items-center gap-1 mt-2 ml-2"><AlertCircle className="w-3 h-3" /> {error}</p>}
              </div>

              <button 
                onClick={handleNextToDetails}
                className="w-full bg-[#007749] text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl hover:scale-[1.02] transition-all active:scale-95"
              >
                Get EFT Details
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {step === 'eft_details' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <p className="text-xs font-black uppercase text-slate-400 tracking-widest text-center">Make an EFT to the details below</p>
              
              <div className="space-y-3 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border dark:border-slate-700">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase">Bank</span>
                  <span className="font-bold text-sm">FNB (First National Bank)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase">Account Name</span>
                  <span className="font-bold text-sm">Sebenza Platform (PTY)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase">Account Number</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm">6284 920 1144</span>
                    <Copy className="w-3 h-3 text-indigo-600 cursor-pointer" />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase">Branch Code</span>
                  <span className="font-bold text-sm">250655</span>
                </div>
                <div className="mt-4 pt-4 border-t dark:border-slate-700 flex justify-between items-center">
                  <span className="text-[10px] font-black text-emerald-600 uppercase">Reference (REQUIRED)</span>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm text-emerald-600 underline">{reference}</span>
                    <Copy className="w-3 h-3 text-emerald-600 cursor-pointer" />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-100 dark:border-amber-900/20">
                <p className="text-[10px] text-amber-700 dark:text-amber-400 font-bold leading-tight">
                  Funds will reflect in your Sebenza wallet within 1-2 business days once confirmed by our finance team.
                </p>
              </div>

              <button 
                onClick={handleDone}
                className="w-full bg-[#007749] text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl hover:scale-[1.02] transition-all active:scale-95"
              >
                I have made the EFT
              </button>
            </div>
          )}

          {step === 'processing' && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-6 animate-in zoom-in-95 duration-500">
              <div className="relative">
                <div className="w-24 h-24 border-4 border-emerald-100 dark:border-emerald-900/30 rounded-full animate-spin border-t-[#007749]"></div>
                <CheckCircle className="w-10 h-10 text-[#007749] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <div>
                <h3 className="text-xl font-black">Deposit Logged</h3>
                <p className="text-slate-400 font-medium text-sm px-4">We've recorded your R {parseFloat(amount).toLocaleString()} deposit. We'll notify you once funds clear.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- UI COMPONENT: WithdrawModal ---
const WithdrawModal = ({ 
  balance, 
  onClose, 
  onConfirm 
}: { 
  balance: number, 
  onClose: () => void, 
  onConfirm: (amount: number, bank: string) => void 
}) => {
  const [step, setStep] = useState<'amount' | 'bank' | 'details' | 'processing'>('amount');
  const [amount, setAmount] = useState<string>('');
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [accountHolder, setAccountHolder] = useState<string>('');
  const [accountNumber, setAccountNumber] = useState<string>('');
  const [accountType, setAccountType] = useState<string>('Savings');
  const [error, setError] = useState<string | null>(null);

  const handleNextToBank = () => {
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) {
      setError('Please enter a valid amount.');
    } else if (val > balance) {
      setError('Insufficient funds.');
    } else {
      setError(null);
      setStep('bank');
    }
  };

  const handleNextToDetails = () => {
    if (!selectedBank) return;
    setStep('details');
  };

  const handleConfirm = () => {
    if (!accountHolder || !accountNumber) {
      setError('Please fill in all banking details.');
      return;
    }
    setError(null);
    setStep('processing');
    setTimeout(() => {
      onConfirm(parseFloat(amount), selectedBank || 'Bank');
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-[2500] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[3rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 border-b dark:border-slate-800 flex justify-between items-center bg-[#E03C31] text-white">
          <h2 className="text-2xl font-black">Withdraw</h2>
          <button onClick={onClose} aria-label="Close" title="Close" className="p-2 hover:bg-white/20 rounded-xl transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8">
          {step === 'amount' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="text-center mb-8">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Available Balance</p>
                <p className="text-3xl font-black text-indigo-600">R {balance.toLocaleString()}</p>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-500 ml-2">Amount to Withdraw (ZAR)</label>
                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-slate-400">R</span>
                  <input 
                    autoFocus
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-12 pr-6 py-5 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-600 rounded-3xl outline-none font-black text-xl transition-all"
                  />
                </div>
                {error && <p className="text-xs text-red-500 font-bold flex items-center gap-1 mt-2 ml-2"><AlertCircle className="w-3 h-3" /> {error}</p>}
              </div>

              <button 
                onClick={handleNextToBank}
                className="w-full bg-slate-900 dark:bg-indigo-600 text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl hover:scale-[1.02] transition-all active:scale-95"
              >
                Next to Bank Selection
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {step === 'bank' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <button onClick={() => setStep('amount')} className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase mb-4 hover:text-indigo-600 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Amount
              </button>
              
              <p className="text-xs font-black uppercase text-slate-500 ml-2 mb-2">Select Your Bank</p>
              <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                {SA_BANKS.map(bank => (
                  <button 
                    key={bank.id}
                    onClick={() => setSelectedBank(bank.name)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                      selectedBank === bank.name 
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' 
                        : 'border-slate-100 dark:border-slate-800 hover:border-indigo-200'
                    }`}
                  >
                    <div className="w-10 h-10 bg-white dark:bg-slate-700 rounded-xl flex items-center justify-center text-xl shadow-sm">
                      <Landmark className={`w-5 h-5 ${selectedBank === bank.name ? 'text-indigo-600' : 'text-slate-400'}`} />
                    </div>
                    <span className={`font-black text-sm ${selectedBank === bank.name ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300'}`}>
                      {bank.name}
                    </span>
                  </button>
                ))}
              </div>

              <button 
                disabled={!selectedBank}
                onClick={handleNextToDetails}
                className="w-full bg-indigo-600 disabled:bg-slate-200 dark:disabled:bg-slate-800 text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl hover:scale-[1.02] transition-all active:scale-95"
              >
                Next to Details
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {step === 'details' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <button onClick={() => setStep('bank')} className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase mb-4 hover:text-indigo-600 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Bank Selection
              </button>

              <div className="bg-indigo-50 dark:bg-indigo-900/10 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-900/30 flex justify-between items-center mb-4">
                <div>
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Withdrawal Amount</p>
                  <p className="text-xl font-black text-indigo-600">R {parseFloat(amount).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Target Bank</p>
                  <p className="text-sm font-black text-slate-700 dark:text-slate-200">{selectedBank}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Account Holder</label>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text"
                      placeholder="e.g. Z Dlamini"
                      value={accountHolder}
                      onChange={(e) => setAccountHolder(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-600 rounded-2xl outline-none font-bold text-sm transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Account Number</label>
                  <div className="relative">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text"
                      placeholder="Enter account number"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-600 rounded-2xl outline-none font-bold text-sm transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Account Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {ACCOUNT_TYPES.map(type => (
                      <button
                        key={type}
                        onClick={() => setAccountType(type)}
                        className={`py-3 rounded-xl text-[10px] font-black uppercase border-2 transition-all ${
                          accountType === type 
                            ? 'bg-indigo-600 text-white border-indigo-600' 
                            : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400'
                        }`}
                      >
                        {type.split('/')[0]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {error && <p className="text-xs text-red-500 font-bold flex items-center gap-1 mt-2 ml-2"><AlertCircle className="w-3 h-3" /> {error}</p>}

              <button 
                onClick={handleConfirm}
                className="w-full bg-slate-900 dark:bg-indigo-600 text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl hover:scale-[1.02] transition-all active:scale-95 mt-4"
              >
                Finish & Withdraw
              </button>
            </div>
          )}

          {step === 'processing' && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-6 animate-in zoom-in-95 duration-500">
              <div className="relative">
                <div className="w-24 h-24 border-4 border-indigo-100 dark:border-indigo-900/30 rounded-full animate-spin border-t-indigo-600"></div>
                <Landmark className="w-10 h-10 text-indigo-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <div>
                <h3 className="text-xl font-black">Finalizing Transaction</h3>
                <p className="text-slate-400 font-medium text-sm">Sending R {parseFloat(amount).toLocaleString()} to {selectedBank}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- ENHANCED UI COMPONENT: ChatView ---
const ChatView = ({ 
  user, 
  sessions, 
  onSendMessage, 
  onOpenNewChat,
  onAttachFile,
  onToggleReaction
}: { 
  user: UserProfile, 
  sessions: ChatSession[], 
  onSendMessage: (sid: string, text: string) => void,
  onOpenNewChat: () => void,
  onAttachFile: (sid: string, f: File | null) => void,
  onToggleReaction: (sid: string, mid: string, emoji: string) => void
}) => {
  const [activeSessionId, setActiveSessionId] = useState<string | null>(sessions[0]?.id || null);
  const [input, setInput] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const activeSession = sessions.find(s => s.id === activeSessionId);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeSession?.messages]);

  const openFilePicker = () => fileInputRef.current?.click();
  const onDropFile = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const f = e.dataTransfer.files?.[0];
    if (activeSessionId) onAttachFile(activeSessionId, f);
  };
  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragActive(true); };
  const onDragLeave = (e: React.DragEvent) => { e.preventDefault(); setDragActive(false); };

  const emojiList = ['👍','🎉','👏','😀','💡','❤️'];

  useEffect(() => {
    setTimeout(() => setDragActive(false), 500);
  }, [activeSessionId]);

  useEffect(() => {
    if (sessions.length > 0 && !activeSessionId) {
      setActiveSessionId(sessions[0].id);
    }
  }, [sessions]);

  const handleSend = () => {
    if (input.trim() && activeSessionId) {
      onSendMessage(activeSessionId, input);
      setInput('');
    }
  };

  return (
    <div className="h-[calc(100vh-160px)] flex bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 overflow-hidden animate-in fade-in duration-500 shadow-2xl">
      <div className="w-full md:w-80 border-r border-slate-50 dark:border-slate-800 flex flex-col shrink-0">
        <div className="p-8 border-b dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900">
          <h3 className="font-black text-xl tracking-tight">Messages</h3>
          <button 
            onClick={onOpenNewChat}
            className="bg-indigo-600 text-white p-2.5 rounded-xl hover:bg-slate-900 transition-all shadow-lg active:scale-95"
            title="Start New Conversation"
          >
             <Plus className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {sessions.length > 0 ? sessions.map(s => (
            <button 
              key={s.id} 
              onClick={() => setActiveSessionId(s.id)}
              className={`w-full p-6 flex gap-4 hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-all text-left group relative ${activeSessionId === s.id ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : ''}`}
            >
              {activeSessionId === s.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 rounded-r-full" />}
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-indigo-600 text-xl uppercase shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                  {s.participantName[0]}
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
              </div>
              <div className="flex-1 truncate py-1">
                <div className="flex justify-between items-start mb-1">
                  <p className="font-black text-sm text-slate-900 dark:text-white">{s.participantName}</p>
                  <span className="text-[10px] font-black text-slate-400">Now</span>
                </div>
                <p className="text-xs text-slate-400 truncate font-medium">{s.lastMessage}</p>
              </div>
            </button>
          )) : (
            <div className="p-12 text-center h-full flex flex-col justify-center">
              <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-4 text-slate-300">
                <MessageSquare className="w-8 h-8" />
              </div>
              <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest mb-4">No chats active</p>
              <button onClick={onOpenNewChat} className="text-indigo-600 font-black text-xs uppercase underline">New Conversation</button>
            </div>
          )}
        </div>
      </div>

      <div className="hidden md:flex flex-1 flex-col bg-[#fcfdfe] dark:bg-slate-950/20">
        {activeSession ? (
          <>
            <div className="p-6 border-b dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900 z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-slate-800 flex items-center justify-center font-black text-indigo-600 uppercase">
                  {activeSession.participantName[0]}
                </div>
                <div>
                  <h3 className="font-black text-lg text-slate-900 dark:text-white leading-none mb-1">{activeSession.participantName}</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Now</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button aria-label="Start audio call" title="Audio call" className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-2xl transition-all"><Phone className="w-5 h-5" /></button>
                <button aria-label="Start video call" title="Video call" className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-2xl transition-all"><Video className="w-5 h-5" /></button>
                <div className="w-px h-6 bg-slate-100 dark:bg-slate-800 mx-2" />
                <button aria-label="More options" title="More" className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-2xl transition-all"><MoreVertical className="w-5 h-5" /></button>
              </div>
            </div>

            <div ref={scrollRef} onDragOver={onDragOver} onDrop={onDropFile} onDragLeave={onDragLeave} className={`flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar ${dragActive ? 'ring-2 ring-indigo-300' : ''}`}>
              {activeSession.messages.map((m, idx) => {
                const isMe = m.senderId === user.id;
                return (
                  <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                    <div className={`flex gap-4 max-w-[75%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className="space-y-1">
                        <div className={`p-5 rounded-[2rem] text-sm font-medium shadow-sm ${
                          isMe ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-bl-none border dark:border-slate-700'
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
                            {(m.reactions || []).map((r, ridx) => (
                              <button key={ridx} aria-label={`React with ${r.emoji} on message`} onClick={() => onToggleReaction(activeSession.id, m.id, r.emoji)} className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${r.youReacted ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
                                <span>{r.emoji}</span><span className="ml-1 font-semibold">{r.count}</span>
                              </button>
                            ))}

                            <div className="flex items-center gap-1 ml-1">
                              {emojiList.map((e, eidx) => (
                                <button key={eidx} aria-label={`React with ${e}`} onClick={() => onToggleReaction(activeSession.id, m.id, e)} className="p-1 text-sm hover:bg-slate-200 rounded">{e}</button>
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className={`text-[10px] font-black uppercase text-slate-400 px-2 ${isMe ? 'text-right' : 'text-left'}`}>Just now</p>
                      </div>
                    </div>
                  </div>
                );
              })}

              {dragActive && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-white/80 dark:bg-slate-900/80 border-2 border-dashed border-indigo-300 rounded-lg p-6 text-indigo-600 font-semibold">Drop file to upload</div>
                </div>
              )}

            </div>

            <div className="p-8 bg-white dark:bg-slate-900 border-t dark:border-slate-800">
              <div className="flex gap-4 items-center bg-slate-50 dark:bg-slate-800/50 p-3 rounded-[2rem] border dark:border-slate-700/50 items-center relative">
                <button aria-label="Emoji" className="p-3 text-slate-400 hover:text-indigo-600 transition-colors"><Smile className="w-5 h-5" /></button>
                <button aria-label="Attach file" onClick={() => openFilePicker()} className="p-3 text-slate-400 hover:text-indigo-600 transition-colors"><Paperclip className="w-5 h-5" /></button>
                <input ref={fileInputRef} type="file" className="hidden" accept="image/*,.pdf,.doc,.docx,.txt" onChange={(e) => activeSessionId && onAttachFile(activeSessionId, e.target.files?.[0] ?? null)} aria-label="File input" />
                <input 
                  autoFocus
                  value={input} 
                  onChange={(e) => setInput(e.target.value)} 
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Your message..." 
                  className="flex-1 bg-transparent px-4 py-3 outline-none font-bold text-sm text-slate-900 dark:text-white placeholder:text-slate-300" 
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim()}
                  aria-label="Send message"
                  className="bg-indigo-600 disabled:bg-slate-300 text-white p-4 rounded-2xl hover:bg-slate-900 transition-all shadow-xl active:scale-95"
                >
                  <Send className="w-5 h-5" />
                </button>

                {dragActive && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-white/80 dark:bg-slate-900/80 border-2 border-dashed border-indigo-300 rounded-lg p-6 text-indigo-600 font-semibold">Drop file to upload</div>
                  </div>
                )}

              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-20">
            <div className="w-32 h-32 bg-indigo-50 dark:bg-indigo-900/20 rounded-[3rem] flex items-center justify-center mb-10">
              <MessageSquare className="w-16 h-16 text-indigo-600" />
            </div>
            <h2 className="text-3xl font-black mb-4">Select a Conversation</h2>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-sm max-w-xs">Start a new chat to connect with your contacts.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---
const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('splash');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [jobs, setJobs] = useState(INITIAL_JOBS.map(j => ({ ...j, applied: false, loading: false })));
  const [user, setUser] = useState({ ...MOCK_USER, favorites: [] as string[], contacts: [] as string[] });
  const [talent, setTalent] = useState(MOCK_TALENT);
  const [chats, setChats] = useState<ChatSession[]>([]);

  // Applications state (Quick Apply flow)
  const [applications, setApplications] = useState<Application[]>([]);
  const [isApplyModalOpen, setApplyModalOpen] = useState(false);
  const [applyJobId, setApplyJobId] = useState<string | null>(null);
  const [applyName, setApplyName] = useState<string>(MOCK_USER.name);
  const [applyMessage, setApplyMessage] = useState('');
  const [applyFile, setApplyFile] = useState<File | null>(null);
  const [applyFileUrl, setApplyFileUrl] = useState<string | null>(null);

  const openApplyModal = (jobId: string) => {
    const job = jobs.find(j => j.id === jobId);
    if (!job) return;
    setApplyJobId(jobId);
    setApplyName(user.name);
    setApplyMessage('');
    setApplyFile(null);
    setApplyFileUrl(null);
    setApplyModalOpen(true);
  };

  // Job detail modal state / helper
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isJobModalOpen, setJobModalOpen] = useState(false);

  const openJobModal = (jobId: string) => {
    const job = jobs.find(j => j.id === jobId);
    if (!job) return;
    setSelectedJob(job);
    setJobModalOpen(true);
  };

  const closeJobModal = () => {
    setSelectedJob(null);
    setJobModalOpen(false);
  };

  // Accessibility: focus management & focus trap for job modal
  const jobModalCloseRef = useRef<HTMLButtonElement | null>(null);
  const jobModalContainerRef = useRef<HTMLDivElement | null>(null);
  const prevActiveElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isJobModalOpen) {
      prevActiveElementRef.current = document.activeElement as HTMLElement | null;
      document.body.style.overflow = 'hidden';
      // focus close button when the modal opens
      setTimeout(() => jobModalCloseRef.current?.focus(), 0);
    } else {
      document.body.style.overflow = '';
      // restore focus
      prevActiveElementRef.current?.focus();
    }
    return () => { document.body.style.overflow = ''; };
  }, [isJobModalOpen]);

  const onJobModalKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeJobModal();
    }
    if (e.key === 'Tab') {
      const container = jobModalContainerRef.current;
      if (!container) return;
      const focusable = Array.from(container.querySelectorAll('button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])')) as HTMLElement[];
      const focusableEnabled = focusable.filter(el => !el.hasAttribute('disabled'));
      if (!focusableEnabled.length) return;
      const first = focusableEnabled[0];
      const last = focusableEnabled[focusableEnabled.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  const handleApplyFile = (f: File | null) => {
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) {
      addNotification('warning', 'File too large', `${f.name} exceeds 5MB limit.`);
      return;
    }
    const url = URL.createObjectURL(f);
    setApplyFile(f);
    setApplyFileUrl(url);
  }; 

  const removeApplyFile = () => {
    if (applyFileUrl) URL.revokeObjectURL(applyFileUrl);
    setApplyFile(null);
    setApplyFileUrl(null);
  };

  const submitApplication = () => {
    if (!applyJobId) return;
    if (!applyMessage.trim() && !applyFile) {
      addNotification('warning', 'Incomplete', 'Please add a cover message or attach your CV.');
      return;
    }

    const job = jobs.find(j => j.id === applyJobId);
    if (!job) return;

    const app: Application = {
      id: Date.now().toString(),
      jobId: applyJobId,
      jobTitle: job.title,
      applicantName: applyName,
      message: applyMessage || undefined,
      resumeName: applyFile?.name || undefined,
      resumeUrl: applyFileUrl || undefined,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    setApplications(prev => [app, ...prev]);
    setApplyModalOpen(false);
    addNotification('success', 'Application sent', `Your application to ${job.title} is pending.`);
  };

  const withdrawApplication = (appId: string) => {
    const app = applications.find(a => a.id === appId);
    if (!app) return;
    setApplications(prev => prev.filter(a => a.id !== appId));
    addNotification('info', 'Application withdrawn', `Your application to ${app.jobTitle} was withdrawn.`);
  };
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 'tx1', type: 'payment_received', amount: 500, description: 'Gardening Job Reward', status: 'completed', date: '2023-10-24 10:30' },
    { id: 'tx2', type: 'withdrawal', amount: 200, description: 'Withdrawal to FNB', status: 'completed', date: '2023-10-23 14:15' }
  ]);
  const [aiEnabled, setAiEnabled] = useState(true);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [toasts, setToasts] = useState<AppNotification[]>([]);
  const [loadingGlobal, setLoadingGlobal] = useState(false);
  const [isNewChatModalOpen, setNewChatModalOpen] = useState(false);
  const [isWithdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [isDepositModalOpen, setDepositModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (appState === 'splash') {
      const timer = setTimeout(() => setAppState('onboarding'), 4000);
      return () => clearTimeout(timer);
    }
  }, [appState]);

  const addNotification = useCallback((type: AppNotification['type'], title: string, message: string) => {
    const newNotif: AppNotification = {
      id: Math.random().toString(),
      type,
      title,
      message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
    setToasts(prev => [...prev, newNotif]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== newNotif.id)), 4000);
  }, []);

  const toggleFavorite = (id: string) => {
    const isFav = user.favorites.includes(id);
    setUser(prev => ({
      ...prev,
      favorites: isFav ? prev.favorites.filter(fid => fid !== id) : [...prev.favorites, id]
    }));
    addNotification('info', isFav ? 'Removed Bookmark' : 'Added to Favorites', isFav ? 'Removed from list.' : 'Profile saved.');
  };

  const toggleContact = (id: string) => {
    const isContact = user.contacts.includes(id);
    const person = talent.find(t => t.id === id);
    setUser(prev => ({
      ...prev,
      contacts: isContact ? prev.contacts.filter(cid => cid !== id) : [...prev.contacts, id]
    }));
    addNotification('success', isContact ? 'Removed Contact' : 'Added to Contacts', isContact ? `${person?.name} removed.` : `${person?.name} added to your book.`);
  };

  const startChat = (t: UserProfile) => {
    const existing = chats.find(c => c.participantId === t.id);
    if (existing) {
      setActiveTab('messages');
    } else {
      const newChat: ChatSession = {
        id: Math.random().toString(),
        participantId: t.id,
        participantName: t.name,
        participantRole: t.role,
        lastMessage: 'Conversation started',
        messages: [{ id: 'm1', senderId: 'system', text: `You are now chatting with ${t.name}.`, timestamp: new Date().toISOString() }]
      };
      setChats([newChat, ...chats]);
      setActiveTab('messages');
    }
    setNewChatModalOpen(false);
  };

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ACCEPTED_TYPES = ['image/', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/'];
  const objectUrlsRef = React.useRef<string[]>([]);

  useEffect(() => {
    return () => {
      // cleanup any object URLs created for attachments
      objectUrlsRef.current.forEach(u => URL.revokeObjectURL(u));
    };
  }, []);

  const handleSendMessage = (sid: string, text: string) => {
    if (!text.trim()) return;
    setChats(prev => prev.map(c => c.id === sid ? {
      ...c,
      lastMessage: text,
      messages: [...c.messages, { id: Date.now().toString(), senderId: user.id, text, timestamp: new Date().toISOString() }]
    } : c));
  };

  const handleAttachFile = (sid: string, f: File | null) => {
    if (!f) return;
    if (f.size > MAX_FILE_SIZE) {
      addNotification('warning', 'File too large', `File ${f.name} exceeds 5MB limit.`);
      return;
    }
    const isValid = ACCEPTED_TYPES.some(t => f.type.startsWith(t) || f.type === t);
    if (!isValid && !f.type.startsWith('image/')) {
      addNotification('warning', 'Unsupported file', `File type not supported: ${f.type || 'unknown'}`);
      return;
    }

    const url = URL.createObjectURL(f);
    objectUrlsRef.current.push(url);

    const attachmentMessage = {
      id: Date.now().toString(),
      senderId: user.id,
      text: `Sent file: ${f.name}`,
      timestamp: new Date().toISOString(),
      attachment: { name: f.name, url, type: f.type },
      reactions: []
    };

    setChats(prev => prev.map(c => c.id === sid ? {
      ...c,
      lastMessage: `Sent file: ${f.name}`,
      messages: [...c.messages, attachmentMessage]
    } : c));
  };

  const handleToggleReaction = (sid: string, mid: string, emoji: string) => {
    setChats(prev => prev.map(c => {
      if (c.id !== sid) return c;
      return { ...c, messages: c.messages.map(m => {
        if (m.id !== mid) return m;
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
      }) };
    }));
  };

  const handleWithdrawal = (amount: number, bank: string) => {
    setWithdrawModalOpen(false);
    setUser(prev => ({
      ...prev,
      walletBalance: prev.walletBalance - amount
    }));
    const newTx: Transaction = {
      id: Math.random().toString(),
      type: 'withdrawal',
      amount,
      description: `Withdrawal to ${bank}`,
      status: 'completed',
      date: new Date().toLocaleString()
    };
    setTransactions(prev => [newTx, ...prev]);
    addNotification('success', 'Withdrawal Successful!', `R ${amount.toLocaleString()} has been sent to your ${bank} account.`);
  };

  const handleDeposit = (amount: number, reference: string) => {
    setDepositModalOpen(false);
    // Note: EFTs aren't immediate, but for simulation we mark it pending
    const newTx: Transaction = {
      id: Math.random().toString(),
      type: 'deposit',
      amount,
      description: `EFT Deposit (${reference})`,
      status: 'pending',
      date: new Date().toLocaleString(),
      reference
    };
    setTransactions(prev => [newTx, ...prev]);
    addNotification('info', 'Deposit Logged', `Your EFT of R ${amount.toLocaleString()} is being processed. Ref: ${reference}`);
  };

  const filteredContacts = talent.filter(t => 
    (t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const renderContent = () => {
    if (loadingGlobal) return (
      <div className="h-full flex flex-col items-center justify-center p-20 text-center animate-pulse">
        <CreditCard className="w-20 h-20 text-indigo-600 mb-8 animate-bounce" />
        <h2 className="text-3xl font-black">Processing Secure Payment...</h2>
      </div>
    );

    switch (activeTab) {
      case 'dashboard': return (
        <div className="space-y-12">
          <div className="flex items-end justify-between">
            <h2 className="text-4xl font-black">Dashboard</h2>
            <div className="bg-white dark:bg-slate-900 px-6 py-3 rounded-2xl border dark:border-slate-800 flex items-center gap-3 shadow-sm">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Plan</span>
              <span className="text-xs font-black text-indigo-600 uppercase bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-lg">{user.subscriptionTier}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-10 bg-slate-900 rounded-[3rem] text-white flex flex-col justify-between h-64 shadow-2xl relative overflow-hidden group">
              <div className="relative z-10">
                <p className="text-indigo-400 font-black text-[10px] uppercase tracking-[0.2em] mb-2">Available Balance</p>
                <p className="text-5xl font-black">R {user.walletBalance.toLocaleString()}</p>
              </div>
              <div className="flex gap-4 relative z-10">
                <button 
                  onClick={() => setWithdrawModalOpen(true)}
                  className="text-[10px] font-black uppercase tracking-widest text-white/50 hover:text-white flex items-center gap-2 transition-all hover:translate-x-1"
                >
                  Withdraw <ArrowUpRight className="w-4 h-4" />
                </button>
                {user.role === UserRole.EMPLOYER && (
                  <button 
                    onClick={() => setDepositModalOpen(true)}
                    className="text-[10px] font-black uppercase tracking-widest text-emerald-400 hover:text-emerald-300 flex items-center gap-2 transition-all hover:translate-x-1"
                  >
                    Deposit <ArrowDownLeft className="w-4 h-4" />
                  </button>
                )}
              </div>
              <Wallet className="absolute -bottom-10 -right-10 w-48 h-48 text-white/5 group-hover:scale-110 transition-transform duration-500" />
            </div>

            <div className="md:col-span-2 bg-white dark:bg-slate-900 rounded-[3rem] p-10 border dark:border-slate-800 flex flex-col justify-between shadow-xl shadow-slate-100 dark:shadow-none relative overflow-hidden">
               <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-black mb-1">Financial Activity</h3>
                    <p className="text-slate-400 font-medium text-sm">Your recent transactions on Sebenza.</p>
                  </div>
                  <History className="w-8 h-8 text-slate-100 dark:text-slate-800" />
               </div>
               
               <div className="flex-1 space-y-4 max-h-36 overflow-y-auto custom-scrollbar pr-2">
                  {transactions.length > 0 ? transactions.map(tx => (
                    <div key={tx.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border dark:border-slate-700/50">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-xl ${
                          tx.type === 'deposit' || tx.type === 'payment_received' 
                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20' 
                            : 'bg-red-50 text-red-600 dark:bg-red-900/20'
                        }`}>
                          {tx.type === 'deposit' || tx.type === 'payment_received' ? <Plus className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="font-bold text-sm">{tx.description}</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            {tx.date} • <span className={`${tx.status === 'completed' ? 'text-emerald-500' : 'text-amber-500 animate-pulse'}`}>{tx.status}</span>
                          </p>
                        </div>
                      </div>
                      <p className={`font-black text-sm ${tx.type === 'deposit' || tx.type === 'payment_received' ? 'text-emerald-600' : 'text-red-600'}`}>
                        {tx.type === 'deposit' || tx.type === 'payment_received' ? '+' : '-'} R {tx.amount.toLocaleString()}
                      </p>
                    </div>
                  )) : (
                    <div className="text-center py-6 text-slate-300 font-black uppercase text-[10px] tracking-widest">No activity yet.</div>
                  )}
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 border dark:border-slate-800 flex flex-col justify-between shadow-xl shadow-slate-100 dark:shadow-none">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-black mb-1">Your Contacts</h3>
                  <p className="text-slate-400 font-medium text-sm">Collaborators and saved profiles.</p>
                </div>
                <button onClick={() => setActiveTab('contacts')} aria-label="Open contacts" title="Open contacts" className="p-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all">
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <div className="flex gap-6 mt-6 overflow-x-auto pb-4 custom-scrollbar">
                {user.contacts.length > 0 ? user.contacts.map(fid => {
                  const t = talent.find(item => item.id === fid);
                  return t ? (
                    <div key={fid} className="flex flex-col items-center gap-3 animate-in fade-in zoom-in duration-300">
                      <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-xl font-black text-indigo-600 uppercase border-2 border-transparent hover:border-indigo-600 transition-all cursor-pointer shadow-sm" onClick={() => startChat(t)}>
                        {t.name[0]}
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-widest truncate w-20 text-center text-slate-500">{t.name.split(' ')[0]}</p>
                    </div>
                  ) : null;
                }) : (
                  <div className="flex items-center gap-4 text-slate-300 py-4">
                    <UserPlus className="w-8 h-8 opacity-50" />
                    <p className="font-black text-[10px] uppercase tracking-widest">No contacts saved yet.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-slate-900 rounded-[3rem] p-10 text-white flex items-center gap-8 relative overflow-hidden group shadow-2xl">
               <div className="flex-1 relative z-10">
                  <h3 className="text-2xl font-black mb-2 leading-tight">Need help with a task?</h3>
                  <p className="text-slate-400 font-medium text-sm mb-6">Post a gig and find local talent in minutes.</p>
                  <button onClick={() => setActiveTab(user.role === UserRole.EMPLOYER ? 'talent' : 'jobs')} className="px-8 py-4 bg-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white hover:text-indigo-600 transition-all shadow-xl shadow-indigo-900/20 active:scale-95">
                    {user.role === UserRole.EMPLOYER ? 'Find Talent' : 'Find Gigs'}
                  </button>
               </div>
               <div className="hidden md:flex flex-col gap-2 relative z-10">
                  <div className="w-20 h-20 bg-white/5 rounded-3xl border border-white/10 flex items-center justify-center"><Briefcase className="w-8 h-8 text-indigo-400" /></div>
               </div>
               <Sparkles className="absolute -top-12 -right-12 w-48 h-48 text-white/5 group-hover:rotate-12 transition-transform duration-1000" />
            </div>
          </div>
        </div>
      );
      case 'messages': return <ChatView user={user} sessions={chats} onSendMessage={handleSendMessage} onOpenNewChat={() => setNewChatModalOpen(true)} onAttachFile={handleAttachFile} onToggleReaction={handleToggleReaction} />;
      case 'contacts': return (
        <div className="space-y-12 animate-in fade-in duration-500">
          <div className="flex items-center justify-between">
            <h2 className="text-4xl font-black">Contact Book</h2>
            <div className="flex bg-white dark:bg-slate-900 rounded-2xl border dark:border-slate-800 px-6 py-3 items-center gap-4 w-96 shadow-sm">
              <Search className="w-4 h-4 text-slate-400" />
              <input 
                placeholder="Search contacts..." 
                className="bg-transparent border-none outline-none font-bold text-sm w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredContacts.map(t => (
              <div key={t.id} className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 border dark:border-slate-800 bento-card flex items-center gap-6 group">
                <div className="w-20 h-20 rounded-[2rem] bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-3xl font-black text-indigo-600 uppercase shrink-0 shadow-sm">
                  {t.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white truncate mb-1">{t.name}</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate mb-4">{t.skills.slice(0, 2).join(' • ')}</p>
                  <div className="flex gap-2">
                    <button onClick={() => startChat(t)} aria-label={`Start chat with ${t.name}`} title={`Chat with ${t.name}`} className="p-3 bg-slate-900 dark:bg-indigo-600 text-white rounded-xl hover:bg-indigo-600 transition-all active:scale-95">
                      <MessageSquare className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => toggleContact(t.id)} aria-label={user.contacts.includes(t.id) ? 'Remove contact' : 'Add contact'} title={user.contacts.includes(t.id) ? 'Remove contact' : 'Add contact'}
                      className={`p-3 rounded-xl transition-all active:scale-95 ${user.contacts.includes(t.id) ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-indigo-600'}`}
                    >
                      {user.contacts.includes(t.id) ? <UserCheck className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
      case 'talent': return (
        <div className="space-y-12">
          <div className="flex items-center justify-between">
            <h2 className="text-4xl font-black">Discover Talent</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {talent.map(t => (
              <div key={t.id} className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 border dark:border-slate-800 bento-card flex flex-col group relative overflow-hidden shadow-sm">
                <div className="flex justify-between mb-8 relative z-10">
                  <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-slate-800 flex items-center justify-center text-2xl font-black text-indigo-600 uppercase shadow-sm">
                    {t.name[0]}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => toggleFavorite(t.id)} aria-label={user.favorites.includes(t.id) ? 'Remove favorite' : 'Add favorite'} title={user.favorites.includes(t.id) ? 'Remove favorite' : 'Add favorite'} className={`p-3 rounded-2xl transition-all ${user.favorites.includes(t.id) ? 'bg-pink-50 text-pink-500' : 'bg-slate-50 dark:bg-slate-800 text-slate-300 hover:text-pink-400'}`}>
                      <Heart className={`w-5 h-5 ${user.favorites.includes(t.id) ? 'fill-pink-500' : ''}`} />
                    </button>
                    <div className="flex items-center gap-1.5 text-amber-500 bg-amber-50 dark:bg-amber-900/10 px-4 py-2 rounded-2xl text-[10px] font-black border border-amber-100 dark:border-amber-900/20">
                      <Star className="w-4 h-4 fill-amber-500" /> {t.rating}
                    </div>
                  </div>
                </div>
                <h3 className="text-2xl font-black mb-1 relative z-10">{t.name}</h3>
                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-6 relative z-10">{t.location}</p>
                <div className="flex flex-wrap gap-2 mb-8 flex-1 relative z-10">
                  {t.skills.map(s => <span key={s} className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 text-[10px] font-black uppercase rounded-lg">{s}</span>)}
                </div>
                <div className="flex gap-3 relative z-10">
                  <button onClick={() => startChat(t)} className="flex-1 py-4 bg-slate-900 dark:bg-slate-800 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all active:scale-95 shadow-lg">Chat</button>
                  <button onClick={() => toggleContact(t.id)} className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 border ${user.contacts.includes(t.id) ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-50'}`}>
                    {user.contacts.includes(t.id) ? 'Saved' : 'Add Contact'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
      case 'jobs': return (
        <div className="space-y-12">
          <h2 className="text-4xl font-black">Available Gigs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {jobs.map(job => <JobCard key={job.id} job={job} onApply={() => openApplyModal(job.id)} onOpen={() => openJobModal(job.id)} application={applications.find(a => a.jobId === job.id) ?? null} />)}
          </div>
        </div>
      );

      case 'applications': return (
        <div className="space-y-12">
          <h2 className="text-4xl font-black">Your Applications</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-black mb-3">Pending</h4>
              <div className="space-y-4">
                {applications.filter(a => a.status === 'pending').length === 0 ? (
                  <p className="text-sm text-slate-400">No pending applications.</p>
                ) : (
                  applications.filter(a => a.status === 'pending').map(a => {
                    const job = jobs.find(j => j.id === a.jobId);
                    return (
                      <div key={a.id} className="p-4 bg-white dark:bg-slate-900 rounded-xl border dark:border-slate-800">
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-black">{a.jobTitle}</div>
                          <div className="text-xs text-slate-400">{new Date(a.createdAt).toLocaleDateString()}</div>
                        </div>
                        <div className="text-sm text-slate-500 mb-2">{job?.employer}</div>
                        {a.message && <p className="text-sm text-slate-600 mb-2">{a.message}</p>}
                        {a.resumeUrl && <a href={a.resumeUrl} download className="text-indigo-600 text-sm">Download CV</a>}
                        <div className="mt-3 flex gap-2 justify-end">
                          <button onClick={() => withdrawApplication(a.id)} className="px-3 py-2 rounded-lg bg-slate-100">Withdraw</button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div>
              <h4 className="font-black mb-3">Accepted</h4>
              <div className="space-y-4">
                {applications.filter(a => a.status === 'accepted').length === 0 ? (
                  <p className="text-sm text-slate-400">No accepted applications yet.</p>
                ) : (
                  applications.filter(a => a.status === 'accepted').map(a => (
                    <div key={a.id} className="p-4 bg-white dark:bg-slate-900 rounded-xl border dark:border-slate-800">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-black">{a.jobTitle}</div>
                        <div className="text-xs text-slate-400">{new Date(a.createdAt).toLocaleDateString()}</div>
                      </div>
                      <div className="text-sm text-slate-500 mb-2">{a.message}</div>
                      {a.resumeUrl && <a href={a.resumeUrl} download className="text-indigo-600 text-sm">Download CV</a>}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div>
              <h4 className="font-black mb-3">Rejected</h4>
              <div className="space-y-4">
                {applications.filter(a => a.status === 'rejected').length === 0 ? (
                  <p className="text-sm text-slate-400">No rejected applications.</p>
                ) : (
                  applications.filter(a => a.status === 'rejected').map(a => (
                    <div key={a.id} className="p-4 bg-white dark:bg-slate-900 rounded-xl border dark:border-slate-800">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-black">{a.jobTitle}</div>
                        <div className="text-xs text-slate-400">{new Date(a.createdAt).toLocaleDateString()}</div>
                      </div>
                      <div className="text-sm text-slate-500 mb-2">{a.message}</div>
                      {a.resumeUrl && <a href={a.resumeUrl} download className="text-indigo-600 text-sm">Download CV</a>}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      );

      default: return <div className="p-20 text-center font-black text-slate-300 uppercase">Coming Soon</div>;
    }
  };

  if (appState === 'splash') return <SplashScreen onNext={() => setAppState('onboarding')} />;
  if (appState === 'onboarding') return <Onboarding onComplete={() => setAppState('auth')} />;
  if (appState === 'auth') return <Auth onLogin={(name, role) => { setUser(prev => ({ ...prev, name, role })); setAppState('app'); }} />;

  return (
    <div className="antialiased selection:bg-indigo-100 min-h-screen bg-[#fcfdfe] dark:bg-slate-950 transition-colors relative overflow-hidden">
      {/* Withdraw Modal */}
      {isWithdrawModalOpen && (
        <WithdrawModal 
          balance={user.walletBalance} 
          onClose={() => setWithdrawModalOpen(false)} 
          onConfirm={handleWithdrawal} 
        />
      )}

      {/* Deposit Modal */}
      {isDepositModalOpen && (
        <DepositModal 
          onClose={() => setDepositModalOpen(false)} 
          onConfirm={handleDeposit} 
        />
      )}

      {/* New Chat Modal */}
      {isNewChatModalOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setNewChatModalOpen(false)} />
          <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-[3rem] shadow-2xl relative z-10 flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-10 border-b dark:border-slate-800">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-black tracking-tight">New Message</h2>
                <button onClick={() => setNewChatModalOpen(false)} aria-label="Close" title="Close" className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl hover:bg-slate-200 transition-all"><X className="w-6 h-6" /></button>
              </div>
              <div className="flex bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border dark:border-slate-700 items-center gap-4">
                <Search className="w-5 h-5 text-slate-400" />
                <input 
                  autoFocus
                  placeholder="Find someone to chat with..." 
                  className="bg-transparent border-none outline-none font-bold text-sm w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-10 max-h-[400px] custom-scrollbar">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Suggested Contacts</p>
              <div className="space-y-4">
                {filteredContacts.length > 0 ? filteredContacts.map(t => (
                  <button 
                    key={t.id} 
                    onClick={() => startChat(t)}
                    className="w-full flex items-center gap-6 p-4 rounded-3xl hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-all text-left group"
                  >
                    <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-100 dark:bg-slate-800 flex items-center justify-center text-xl font-black text-indigo-600 uppercase group-hover:scale-110 transition-transform">
                      {t.name[0]}
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 dark:text-white leading-none mb-1">{t.name}</h4>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.skills.slice(0, 2).join(' • ')}</p>
                    </div>
                  </button>
                )) : (
                  <div className="text-center py-10">
                    <SearchX className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                    <p className="text-slate-400 font-bold">No one found matching that name.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Apply Modal */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setApplyModalOpen(false)} />
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2rem] shadow-2xl relative z-10 flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b dark:border-slate-800 flex justify-between items-center">
              <h2 className="text-2xl font-black">Quick Apply</h2>
              <button onClick={() => setApplyModalOpen(false)} aria-label="Close" title="Close" className="p-2 bg-slate-100 dark:bg-slate-800 rounded-2xl hover:bg-slate-200 transition-all"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label htmlFor="apply-fullname" className="text-xs font-black text-slate-400 uppercase">Full name</label>
                <input id="apply-fullname" value={applyName} onChange={(e) => setApplyName(e.target.value)} className="w-full mt-2 px-4 py-3 rounded-xl border bg-slate-50 dark:bg-slate-800 outline-none" />
              </div>

              <div>
                <label htmlFor="apply-message" className="text-xs font-black text-slate-400 uppercase">Cover message</label>
                <textarea id="apply-message" value={applyMessage} onChange={(e) => setApplyMessage(e.target.value)} rows={4} placeholder="Write a short note to the employer (optional if CV attached)" className="w-full mt-2 px-4 py-3 rounded-xl border bg-slate-50 dark:bg-slate-800 outline-none" />
              </div>

              <div>
                <label className="text-xs font-black text-slate-400 uppercase">Attach CV / Document</label>
                <div className="flex items-center gap-3 mt-2">
                  <button onClick={() => document.getElementById('apply-file-input')?.click()} className="px-4 py-2 rounded-xl bg-slate-900 text-white">Upload CV</button>
                  <div className="text-sm text-slate-500">or attach your file</div>
                </div>
                <input id="apply-file-input" type="file" accept=".pdf,.doc,.docx,.txt" className="hidden" onChange={(e) => handleApplyFile(e.target.files?.[0] ?? null)} aria-label="Upload CV" />

                {applyFileUrl && (
                  <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-between">
                    <div className="truncate">{applyFile?.name}</div>
                    <div className="flex items-center gap-2">
                      <a href={applyFileUrl} download className="text-indigo-600 text-xs">Download</a>
                      <button onClick={removeApplyFile} className="text-xs text-slate-500">Remove</button>
                    </div>
                  </div>
                )}

              </div>

            </div>

            <div className="p-6 border-t dark:border-slate-800 flex justify-end gap-3">
              <button onClick={() => setApplyModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-100">Cancel</button>
              <button onClick={submitApplication} className="px-4 py-2 rounded-xl bg-indigo-600 text-white">Submit application</button>
            </div>
          </div>
        </div>
      )}

      {/* Job Details Modal */}
      {isJobModalOpen && selectedJob && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4" role="presentation">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={closeJobModal} />
          <div ref={jobModalContainerRef} onKeyDown={onJobModalKeyDown} role="dialog" aria-modal="true" aria-labelledby="job-modal-title" aria-describedby="job-modal-desc" tabIndex={-1} className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-[2rem] shadow-2xl relative z-10 flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b dark:border-slate-800 flex justify-between items-center">
              <div>
                <h2 id="job-modal-title" className="text-2xl font-black">{selectedJob.title}</h2>
                <p id="job-modal-desc" className="text-sm text-slate-500 font-bold">{selectedJob.employer} • {selectedJob.location}</p>
              </div>
              <button ref={jobModalCloseRef} onClick={closeJobModal} aria-label="Close" title="Close" className="p-2 bg-slate-100 dark:bg-slate-800 rounded-2xl hover:bg-slate-200 transition-all"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h3 className="font-black text-sm text-slate-400">Description</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{selectedJob.description}</p>
              </div>
              <div>
                <h3 className="font-black text-sm text-slate-400">Requirements</h3>
                <ul className="mt-2 list-disc pl-6 text-sm text-slate-600 dark:text-slate-300">
                  {selectedJob.requirements.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </div>
              <div className="flex gap-6 items-center">
                <div>
                  <h4 className="text-xs font-black text-slate-400 uppercase">Pay</h4>
                  <div className="text-lg font-black">{selectedJob.salaryRange ?? 'Not specified'}</div>
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-400 uppercase">Type</h4>
                  <div className="text-lg font-black">{selectedJob.type}</div>
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-400 uppercase">Skills</h4>
                  <div className="text-sm text-slate-600">{selectedJob.skills.join(', ')}</div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t dark:border-slate-800 flex justify-end gap-3">
              <button onClick={closeJobModal} className="px-4 py-2 rounded-xl bg-slate-100">Close</button>
              <button onClick={() => { closeJobModal(); openApplyModal(selectedJob.id); }} className="px-4 py-2 rounded-xl bg-indigo-600 text-white">Quick Apply</button>
            </div>
          </div>
        </div>
      )}

      {/* Push Toasts */}
      <div className="fixed top-24 right-6 z-[1000] space-y-4 w-full max-w-sm pointer-events-none">
        {toasts.map(toast => (
          <div key={toast.id} className="pointer-events-auto p-5 rounded-[2rem] shadow-2xl border flex gap-4 animate-in slide-in-from-right-8 duration-500 bg-white dark:bg-slate-900 border-indigo-100 dark:border-indigo-900/30">
            <div className="bg-indigo-50 text-indigo-600 p-3 rounded-2xl shrink-0"><Zap className="w-5 h-5" /></div>
            <div className="flex-1 min-w-0">
              <h4 className="font-black text-sm text-slate-900 dark:text-white truncate">{toast.title}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{toast.message}</p>
            </div>
          </div>
        ))}
      </div>

      <Layout 
        user={user} 
        currentTab={activeTab} 
        onTabChange={setActiveTab} 
        onLogout={() => setAppState('auth')}
        aiEnabled={aiEnabled}
        onToggleAI={() => setAiEnabled(!aiEnabled)}
        notifications={notifications}
        onMarkRead={() => setNotifications(n => n.map(it => ({ ...it, read: true })))}
      >
        {renderContent()}
      </Layout>
      <AIAssistant user={user} isVisible={aiEnabled} onDismiss={() => setAiEnabled(false)} />
    </div>
  );
};

export default App;
