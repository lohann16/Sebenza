
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
import { JobType, UserRole, HireOffer, SubscriptionTier, ChatSession, Review, UserProfile, AppNotification, Message, Transaction } from './types';

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
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-xl transition-all">
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
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-xl transition-all">
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
  onOpenNewChat 
}: { 
  user: UserProfile, 
  sessions: ChatSession[], 
  onSendMessage: (sid: string, text: string) => void,
  onOpenNewChat: () => void
}) => {
  const [activeSessionId, setActiveSessionId] = useState<string | null>(sessions[0]?.id || null);
  const [input, setInput] = useState('');
  const activeSession = sessions.find(s => s.id === activeSessionId);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeSession?.messages]);

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
                <button className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-2xl transition-all"><Phone className="w-5 h-5" /></button>
                <button className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-2xl transition-all"><Video className="w-5 h-5" /></button>
                <div className="w-px h-6 bg-slate-100 dark:bg-slate-800 mx-2" />
                <button className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-2xl transition-all"><MoreVertical className="w-5 h-5" /></button>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar">
              {activeSession.messages.map((m, idx) => {
                const isMe = m.senderId === user.id;
                return (
                  <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                    <div className={`flex gap-4 max-w-[75%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className="space-y-1">
                        <div className={`p-5 rounded-[2rem] text-sm font-medium shadow-sm ${
                          isMe ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-bl-none border dark:border-slate-700'
                        }`}>
                          {m.text}
                        </div>
                        <p className={`text-[10px] font-black uppercase text-slate-400 px-2 ${isMe ? 'text-right' : 'text-left'}`}>Just now</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-8 bg-white dark:bg-slate-900 border-t dark:border-slate-800">
              <div className="flex gap-4 items-center bg-slate-50 dark:bg-slate-800/50 p-3 rounded-[2rem] border dark:border-slate-700/50">
                <button className="p-3 text-slate-400 hover:text-indigo-600 transition-colors"><Smile className="w-5 h-5" /></button>
                <button className="p-3 text-slate-400 hover:text-indigo-600 transition-colors"><Paperclip className="w-5 h-5" /></button>
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
                  className="bg-indigo-600 disabled:bg-slate-300 text-white p-4 rounded-2xl hover:bg-slate-900 transition-all shadow-xl active:scale-95"
                >
                  <Send className="w-5 h-5" />
                </button>
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

  const handleSendMessage = (sid: string, text: string) => {
    if (!text.trim()) return;
    setChats(prev => prev.map(c => c.id === sid ? {
      ...c,
      lastMessage: text,
      messages: [...c.messages, { id: Date.now().toString(), senderId: user.id, text, timestamp: new Date().toISOString() }]
    } : c));
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
                <button onClick={() => setActiveTab('contacts')} className="p-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all">
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
      case 'messages': return <ChatView user={user} sessions={chats} onSendMessage={handleSendMessage} onOpenNewChat={() => setNewChatModalOpen(true)} />;
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
                    <button onClick={() => startChat(t)} className="p-3 bg-slate-900 dark:bg-indigo-600 text-white rounded-xl hover:bg-indigo-600 transition-all active:scale-95">
                      <MessageSquare className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => toggleContact(t.id)} 
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
                    <button onClick={() => toggleFavorite(t.id)} className={`p-3 rounded-2xl transition-all ${user.favorites.includes(t.id) ? 'bg-pink-50 text-pink-500' : 'bg-slate-50 dark:bg-slate-800 text-slate-300 hover:text-pink-400'}`}>
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
            {jobs.map(job => <JobCard key={job.id} job={job} onApply={() => {}} />)}
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
                <button onClick={() => setNewChatModalOpen(false)} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl hover:bg-slate-200 transition-all"><X className="w-6 h-6" /></button>
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
