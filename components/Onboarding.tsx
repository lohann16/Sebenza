
import React, { useState } from 'react';
import { Briefcase, Sparkles, Heart, ChevronRight } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

const slides = [
  {
    title: "Every Skill Deserves a Chance",
    description: "From gardening to accounting, Sebenza connects you to opportunities that match your potential.",
    icon: <Briefcase className="w-12 h-12 md:w-16 md:h-16" />,
    color: "bg-[#007749]" // SA Flag Green
  },
  {
    title: "Upskill While You Earn",
    description: "Access free courses and grow your career path directly within the platform.",
    icon: <Sparkles className="w-12 h-12 md:w-16 md:h-16" />,
    color: "bg-[#E03C31]" // SA Flag Red
  },
  {
    title: "A Community That Cares",
    description: "Access mental health resources and connect with peers in our supportive forums.",
    icon: <Heart className="w-12 h-12 md:w-16 md:h-16" />,
    color: "bg-[#002395]" // SA Flag Blue
  }
];

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [current, setCurrent] = useState(0);

  const next = () => {
    if (current === slides.length - 1) onComplete();
    else setCurrent(current + 1);
  };

  return (
    <div className="fixed inset-0 bg-white flex flex-col z-[900] animate-in fade-in duration-500">
      <div className={`flex-1 flex flex-col items-center justify-center p-8 transition-all duration-700 ${slides[current].color} text-white relative overflow-hidden`}>
        {/* Subtle flag-inspired design element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-black/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>
        
        <div className="bg-white/20 backdrop-blur-md p-8 rounded-[3rem] mb-12 animate-in zoom-in duration-700 shadow-2xl border border-white/20">
           {slides[current].icon}
        </div>
        <div className="max-w-md text-center animate-in slide-in-from-bottom-5 duration-700">
          <h2 className="text-3xl md:text-4xl font-black mb-6 leading-tight">{slides[current].title}</h2>
          <p className="text-white/80 md:text-lg leading-relaxed font-medium">{slides[current].description}</p>
        </div>
      </div>

      <div className="p-8 md:p-12 flex flex-col items-center bg-white dark:bg-slate-900">
        <div className="flex gap-2 mb-10">
          {slides.map((_, i) => (
            <div 
              key={i} 
              className={`h-2 rounded-full transition-all duration-500 ${i === current ? 'w-12 bg-indigo-600' : 'w-2 bg-slate-200 dark:bg-slate-700'}`}
            ></div>
          ))}
        </div>

        <div className="flex w-full max-w-md gap-4">
           <button onClick={onComplete} className="flex-1 py-4 text-slate-500 dark:text-slate-400 font-bold hover:text-indigo-600 transition-colors">Skip</button>
           <button 
             onClick={next}
             className="flex-[2] bg-indigo-600 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 shadow-xl shadow-indigo-100 dark:shadow-none hover:bg-slate-900 transition-all active:scale-95"
           >
             {current === slides.length - 1 ? "Start Journey" : "Next Step"}
             <ChevronRight className="w-5 h-5" />
           </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
