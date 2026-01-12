
import React, { useState, useEffect } from 'react';
import { getNavItems, LANGUAGES } from '../constants';
import { 
  Bell, Menu, X, LogOut, Globe, Wallet, Search, 
  ChevronRight, AlertCircle, Settings, Info, Moon, 
  Sun, Monitor, User, Shield, BellRing, Smartphone,
  ArrowLeft, Lock, Eye, Mail, MessageSquare, History,
  Award, Heart, Share2, ArrowRight, Sparkles, CheckCheck
} from 'lucide-react';
import { UserProfile, UserRole, AppNotification } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: UserProfile;
  currentTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  aiEnabled: boolean;
  onToggleAI: () => void;
  notifications: AppNotification[];
  onMarkRead: () => void;
}

type Theme = 'light' | 'dark' | 'system';
type ModalView = 'home' | 'privacy' | 'notifications' | 'about' | 'theme';

const Layout: React.FC<LayoutProps> = ({ children, user, currentTab, onTabChange, onLogout, aiEnabled, onToggleAI, notifications, onMarkRead }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [isNotifPanelOpen, setNotifPanelOpen] = useState(false);
  const [modalView, setModalView] = useState<ModalView>('home');
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || 'light');

  const navItems = getNavItems(user.role);
  const unreadCount = notifications.filter(n => !n.read).length;

  // Theme effect
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      if (systemTheme === 'dark') root.classList.add('dark');
      else root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = (newTheme: Theme) => setTheme(newTheme);

  const Toggle = ({ active, onToggle }: { active: boolean, onToggle: () => void }) => (
    <button 
      onClick={onToggle}
      className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${active ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'}`}
    >
      <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${active ? 'translate-x-6' : 'translate-x-0'}`} />
    </button>
  );

  const renderModalContent = () => {
    switch (modalView) {
      case 'privacy':
        return (
          <div className="space-y-8 animate-in slide-in-from-right-8 duration-300">
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b dark:border-slate-800 pb-2">Visibility Settings</h4>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">Public Profile</p>
                    <p className="text-xs text-slate-400 font-medium">Allow employers to find you in search</p>
                  </div>
                  <Toggle active={true} onToggle={() => {}} />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b dark:border-slate-800 pb-2">Security</h4>
              <div className="space-y-6">
                <button className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl group transition-all">
                  <span className="font-bold text-slate-900 dark:text-white">Change Password</span>
                  <Lock className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                </button>
              </div>
            </div>
          </div>
        );
      case 'notifications':
        return (
          <div className="space-y-8 animate-in slide-in-from-right-8 duration-300">
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b dark:border-slate-800 pb-2">Alert Preferences</h4>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">Push Notifications</p>
                    <p className="text-xs text-slate-400 font-medium">In-app toasts and alerts</p>
                  </div>
                  <Toggle active={true} onToggle={() => {}} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">SMS Offline Alerts</p>
                    <p className="text-xs text-slate-400 font-medium">Get notified without mobile data</p>
                  </div>
                  <Toggle active={true} onToggle={() => {}} />
                </div>
              </div>
            </div>
          </div>
        );
      case 'theme':
        return (
          <div className="space-y-8 animate-in slide-in-from-right-8 duration-300">
             <div className="grid grid-cols-1 gap-4">
                {[
                  { id: 'light', icon: <Sun className="w-6 h-6" />, label: 'Light Mode', desc: 'Classic bright interface' },
                  { id: 'dark', icon: <Moon className="w-6 h-6" />, label: 'Dark Mode', desc: 'Easier on the eyes at night' },
                  { id: 'system', icon: <Monitor className="w-6 h-6" />, label: 'System Default', desc: 'Follow device settings' }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => toggleTheme(t.id as Theme)}
                    className={`flex items-center gap-6 p-6 rounded-3xl border-2 transition-all text-left ${theme === t.id ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/10' : 'border-slate-100 dark:border-slate-800 hover:border-indigo-200'}`}
                  >
                    <div className={`p-4 rounded-2xl ${theme === t.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                      {t.icon}
                    </div>
                    <div>
                      <p className={`font-black ${theme === t.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-900 dark:text-white'}`}>{t.label}</p>
                      <p className="text-xs text-slate-400 font-medium">{t.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
          </div>
        );
      case 'about':
          return (
            <div className="space-y-8 animate-in slide-in-from-right-8 duration-300">
              <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white relative overflow-hidden">
                <h4 className="text-2xl font-black mb-4 relative z-10">Our Mission</h4>
                <p className="text-slate-400 font-medium leading-relaxed relative z-10">Sebenza connects ambition to opportunity, rewriting South Africa's youth unemployment story.</p>
                <Share2 className="absolute -bottom-10 -right-10 w-48 h-48 text-white/5" />
              </div>
            </div>
          );
      default:
        return (
          <div className="space-y-10 animate-in fade-in duration-300">
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 rounded-[2.5rem] text-white flex items-center gap-6 shadow-xl">
              <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-indigo-600 font-black text-2xl uppercase">
                {user.name.substring(0, 2)}
              </div>
              <div>
                <h3 className="text-2xl font-black">{user.name}</h3>
                <p className="text-indigo-100 font-bold uppercase text-xs tracking-widest">{user.role.replace('_', ' ')}</p>
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b dark:border-slate-800 pb-2">Account Preferences</h4>
              <div className="grid grid-cols-1 gap-4">
                {[
                  { id: 'privacy', icon: <Shield className="w-5 h-5" />, label: 'Privacy & Security', desc: 'Visibility and safety' },
                  { id: 'notifications', icon: <BellRing className="w-5 h-5" />, label: 'Notifications', desc: 'Alerts and emails' },
                  { id: 'theme', icon: <Sun className="w-5 h-5" />, label: 'Interface Theme', desc: 'Light or Dark mode' },
                  { id: 'about', icon: <Info className="w-5 h-5" />, label: 'About Sebenza', desc: 'Mission and impact' }
                ].map(item => (
                  <button 
                    key={item.id}
                    onClick={() => setModalView(item.id as ModalView)}
                    className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-800/50 rounded-3xl group hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-100 dark:hover:border-slate-700 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm text-slate-400 group-hover:text-indigo-600 transition-colors">
                        {item.icon}
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-slate-900 dark:text-white">{item.label}</p>
                        <p className="text-xs text-slate-400 font-medium">{item.desc}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300" />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b dark:border-slate-800 pb-2">Smart Assistant</h4>
              <div className="flex items-center justify-between p-6 bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100/50 dark:border-indigo-900/20 rounded-[2rem]">
                <div className="flex items-center gap-4">
                  <div className="bg-indigo-600 p-3 rounded-2xl text-white shadow-lg">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-black text-slate-900 dark:text-white">AI Career Coach</p>
                    <p className="text-xs text-slate-400 font-medium">Repositioned for better visibility</p>
                  </div>
                </div>
                <Toggle active={aiEnabled} onToggle={onToggleAI} />
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`min-h-screen flex bg-[#fcfdfe] dark:bg-slate-950 transition-colors duration-300 overflow-hidden`}>
      {/* Persistent Notification Panel */}
      <div className={`fixed inset-0 z-[500] transition-all duration-500 ${isNotifPanelOpen ? 'visible' : 'invisible'}`}>
        <div className={`absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity duration-500 ${isNotifPanelOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setNotifPanelOpen(false)} />
        <div className={`absolute inset-y-0 right-0 w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl transition-transform duration-500 ease-in-out transform flex flex-col ${isNotifPanelOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-8 border-b dark:border-slate-800 flex items-center justify-between shrink-0">
            <h3 className="text-2xl font-black">Notifications</h3>
            <button onClick={onMarkRead} className="text-xs font-black text-indigo-600 uppercase flex items-center gap-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 p-2 rounded-xl transition-all">
              <CheckCheck className="w-4 h-4" />
              Mark all read
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {notifications.length > 0 ? notifications.map(n => (
              <div key={n.id} className={`p-6 rounded-[2rem] border transition-all ${!n.read ? 'bg-indigo-50/30 dark:bg-indigo-900/10 border-indigo-100 dark:border-indigo-900/30' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800'}`}>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-black text-sm">{n.title}</h4>
                  <span className="text-[10px] font-black text-slate-400">{n.timestamp}</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{n.message}</p>
              </div>
            )) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-300 gap-4">
                <BellRing className="w-12 h-12" />
                <p className="font-black uppercase text-xs">No alerts yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      <div className={`fixed inset-0 z-[400] transition-all duration-500 ${isProfileModalOpen ? 'visible' : 'invisible'}`}>
        <div className={`absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity duration-500 ${isProfileModalOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => { setProfileModalOpen(false); setModalView('home'); }} />
        <div className={`absolute inset-y-0 right-0 w-full max-w-xl bg-white dark:bg-slate-900 shadow-2xl transition-transform duration-500 transform flex flex-col ${isProfileModalOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-8 flex items-center justify-between border-b dark:border-slate-800 shrink-0">
            <div className="flex items-center gap-4">
              {modalView !== 'home' && <button onClick={() => setModalView('home')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"><ArrowLeft className="w-5 h-5" /></button>}
              <h2 className="text-2xl font-black capitalize">{modalView === 'home' ? 'Profile & Settings' : modalView.replace(/-/g, ' ')}</h2>
            </div>
            <button onClick={() => { setProfileModalOpen(false); setModalView('home'); }} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"><X className="w-6 h-6" /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            {renderModalContent()}
          </div>
        </div>
      </div>

      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 border-r dark:border-slate-800 transform transition-transform duration-500 md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full p-8">
          <div className="flex items-center gap-2 mb-12">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg"><span className="text-white font-black text-xl">S</span></div>
            <h1 className="text-2xl font-black tracking-tighter">SEBENZA</h1>
          </div>
          <nav className="space-y-2 flex-1">
            {navItems.map((item) => (
              <button key={item.path} onClick={() => { onTabChange(item.path); setSidebarOpen(false); }} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${currentTab === item.path ? 'bg-slate-900 dark:bg-slate-800 text-white shadow-xl' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}`}>
                {item.icon} <span className="font-bold text-sm">{item.label}</span>
              </button>
            ))}
          </nav>
          <div className="mt-auto pt-8 border-t dark:border-slate-800 space-y-4">
             <div className="p-5 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-3xl flex items-center gap-4">
                <Wallet className="w-5 h-5 text-indigo-600" />
                <div>
                   <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Balance</p>
                   <p className="font-black">R {user.walletBalance.toFixed(2)}</p>
                </div>
             </div>
             <button onClick={onLogout} className="w-full flex items-center gap-4 px-5 py-3 rounded-2xl text-slate-400 hover:text-red-500 transition-all"><LogOut className="w-5 h-5" /> <span className="font-bold text-sm">Sign Out</span></button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-20 glass-panel dark:bg-slate-900/80 border-b dark:border-slate-800 flex items-center justify-between px-6 md:px-12 shrink-0">
          <button className="md:hidden p-2" onClick={() => setSidebarOpen(true)}><Menu className="w-6 h-6" /></button>
          
          <div className="hidden md:flex items-center gap-4 bg-slate-100/50 dark:bg-slate-800/50 px-6 py-2.5 rounded-2xl border dark:border-slate-700/50 w-96">
            <Search className="w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Quick search..." className="bg-transparent border-none outline-none text-sm font-medium w-full" />
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => setNotifPanelOpen(true)} className="relative p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl transition-all">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 border-2 border-white dark:border-slate-900 rounded-full flex items-center justify-center text-[8px] font-black text-white">{unreadCount}</span>}
            </button>
            <div onClick={() => setProfileModalOpen(true)} className="flex items-center gap-4 cursor-pointer group">
              <div className="hidden md:block text-right">
                <p className="text-sm font-black group-hover:text-indigo-600 transition-colors">{user.name}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Verified {user.role === UserRole.JOB_SEEKER ? 'Sebenzer' : 'Employer'}</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black uppercase">{user.name[0]}</div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6 md:p-12 custom-scrollbar">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
