
import React, { useState } from 'react';
import { Mail, Lock, User, Phone, ArrowRight, ShieldCheck, Briefcase, Users } from 'lucide-react';
import { UserRole } from '../types';

interface AuthProps {
  onLogin: (name: string, role: UserRole) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.JOB_SEEKER);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const finalName = !isLogin ? name : (email.split('@')[0] || 'User');
    
    setTimeout(() => {
        setLoading(false);
        onLogin(finalName, role);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#fcfdfe] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-700">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
        <div className="hidden lg:flex flex-col justify-between bg-slate-900 p-16 text-white relative">
            <div className="z-10">
                <h1 className="text-4xl font-black tracking-tighter mb-4 text-indigo-400">SEBENZA</h1>
                <p className="text-slate-400 text-lg max-w-sm font-medium">South Africa's pulse for employment and service provision.</p>
            </div>
            <div className="z-10 space-y-8">
                <div className="flex gap-4 items-start bg-white/5 p-6 rounded-3xl border border-white/10">
                    <ShieldCheck className="w-6 h-6 text-indigo-400 mt-1" />
                    <div>
                        <h4 className="font-bold">Two-Way Accountability</h4>
                        <p className="text-slate-400 text-sm">Verified profiles for both seekers and providers.</p>
                    </div>
                </div>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full -mr-32 -mt-32"></div>
        </div>

        <div className="p-8 md:p-16 flex flex-col justify-center">
            <div className="mb-10 text-center lg:text-left">
                <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">{isLogin ? 'Welcome Back!' : 'Join Sebenza'}</h2>
                <p className="text-slate-500 font-medium">Empowering the youth and the business ecosystem.</p>
            </div>

            {/* Role Switcher */}
            <div className="flex p-1.5 bg-slate-100 rounded-2xl mb-8">
              <button 
                onClick={() => setRole(UserRole.JOB_SEEKER)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${role === UserRole.JOB_SEEKER ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
              >
                <Briefcase className="w-4 h-4" />
                Job Seeker
              </button>
              <button 
                onClick={() => setRole(UserRole.EMPLOYER)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${role === UserRole.EMPLOYER ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
              >
                <Users className="w-4 h-4" />
                Employer
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input 
                          required 
                          type="text" 
                          placeholder="Full Name" 
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl outline-none transition-all font-bold" 
                        />
                    </div>
                )}
                <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      required 
                      type="email" 
                      placeholder="Email Address" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl outline-none transition-all font-bold" 
                    />
                </div>
                <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input required type="password" placeholder="Password" className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl outline-none transition-all font-bold" />
                </div>

                <button 
                    disabled={loading}
                    className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl hover:bg-indigo-600 transition-all active:scale-95 disabled:opacity-50 mt-4"
                >
                    {loading ? (
                        <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                        <>
                            {isLogin ? 'Login' : 'Sign Up'}
                            <ArrowRight className="w-5 h-5" />
                        </>
                    )}
                </button>
            </form>

            <div className="mt-8 text-center">
                <p className="text-slate-500 text-sm font-medium">
                    {isLogin ? "New to Sebenza?" : "Have an account?"}
                    <button onClick={() => setIsLogin(!isLogin)} className="ml-2 text-indigo-600 font-bold hover:underline">
                        {isLogin ? 'Create Account' : 'Login'}
                    </button>
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
