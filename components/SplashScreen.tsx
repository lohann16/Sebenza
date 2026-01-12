
import React from 'react';
import { ChevronRight } from 'lucide-react';

interface SplashScreenProps {
  onNext: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onNext }) => {
  return (
    <div 
      onClick={onNext}
      className="fixed inset-0 bg-indigo-700 flex flex-col items-center justify-center z-[1000] overflow-hidden px-4 cursor-pointer group"
    >
      <div className="relative flex flex-col items-center animate-in fade-in zoom-in duration-1000">
        <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-center shadow-2xl mb-8 relative group-hover:scale-110 transition-transform duration-500">
            <span className="text-indigo-700 text-4xl md:text-5xl font-black tracking-tighter">S</span>
            <div className="absolute inset-0 rounded-[2rem] md:rounded-[2.5rem] border-4 border-indigo-400/30 animate-ping"></div>
        </div>
        <h1 className="text-white text-3xl md:text-5xl font-black tracking-tighter mb-2">SEBENZA</h1>
        <p className="text-indigo-200 text-xs md:text-sm font-bold uppercase tracking-[0.3em] opacity-80 text-center">Work. Grow. Reclaim.</p>
      </div>
      
      <div className="absolute bottom-12 w-full max-w-xs flex flex-col items-center gap-8">
        <div className="flex gap-1.5">
           <div className="w-2 h-2 bg-white/20 rounded-full animate-pulse"></div>
           <div className="w-2 h-2 bg-white/40 rounded-full animate-pulse delay-150"></div>
           <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse delay-300"></div>
        </div>
        
        <button 
          className="w-full bg-white text-indigo-700 py-4 rounded-2xl font-black flex items-center justify-center gap-3 shadow-2xl hover:bg-indigo-50 transition-all active:scale-95 animate-in slide-in-from-bottom-4 duration-1000"
        >
          Explore Sebenza
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

        <p className="text-indigo-300 text-[10px] font-bold uppercase tracking-widest">Click anywhere to start</p>
      </div>
    </div>
  );
};

export default SplashScreen;
