
import React from 'react';
import { Job, JobType } from '../types';
import { MapPin, ShieldCheck, ArrowRight, Tag, Eye, CheckCircle2, Loader2 } from 'lucide-react';

interface JobCardProps {
  job: Job & { applied?: boolean; loading?: boolean };
  onApply: () => void;
  onOpen?: () => void;
  application?: { status: 'pending' | 'accepted' | 'rejected'; resumeName?: string } | null;
}

const JobCard: React.FC<JobCardProps> = ({ job, onApply, onOpen, application }) => {
  const getTypeConfig = (type: JobType) => {
    switch (type) {
      case JobType.PEACE_JOB: return { color: 'text-emerald-600 bg-emerald-50 border-emerald-100', label: 'Peace Job' };
      case JobType.FREELANCE: return { color: 'text-blue-600 bg-blue-50 border-blue-100', label: 'Freelance' };
      case JobType.FULL_TIME: return { color: 'text-indigo-600 bg-indigo-50 border-indigo-100', label: 'Full Time' };
      default: return { color: 'text-slate-600 bg-slate-50 border-slate-100', label: 'Part Time' };
    }
  };

  const config = getTypeConfig(job.type);

  return (
    <div className={`group bg-white rounded-[2.5rem] p-7 border transition-all duration-500 bento-card flex flex-col h-full ${job.applied ? 'border-indigo-100 opacity-90' : 'border-slate-100'}`}>
      <div className="flex justify-between items-start mb-6">
        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.1em] border ${config.color}`}>
          {config.label}
        </div>
        <div className="flex items-center gap-2">
          {job.verified && (
            <div className="flex items-center gap-1.5 text-indigo-600 bg-indigo-50/50 px-3 py-1.5 rounded-2xl text-[10px] font-black border border-indigo-100/50">
              <ShieldCheck className="w-3.5 h-3.5" />
              VERIFIED
            </div>
          )}

          <button
            onClick={(e) => { e.stopPropagation(); onOpen?.(); }}
            aria-label="View details"
            title="View details"
            className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1">
        <h3 className="text-xl font-black text-slate-900 mb-2 leading-tight">
          <button onClick={(e) => { e.stopPropagation(); onOpen?.(); }} aria-label={`View details for ${job.title}`} title={`View details for ${job.title}`} className="text-left w-full text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
            {job.title}
          </button>
        </h3>
        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-6">
          {job.employer}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="flex items-center gap-2.5 text-slate-500 text-sm font-medium">
            <div className="p-2 bg-slate-50 rounded-xl">
              <MapPin className="w-4 h-4" />
            </div>
            <span className="truncate">{job.location.split(',')[0]}</span>
          </div>
          <div className="flex items-center gap-2.5 text-slate-500 text-sm font-medium">
            <div className="p-2 bg-slate-50 rounded-xl">
              <Tag className="w-4 h-4" />
            </div>
            <span className="truncate">{job.salaryRange?.split(' ')[0]}</span>
          </div>
        </div>
      </div>

      <button 
        onClick={(e) => {
            e.stopPropagation();
            if (!job.loading) onApply();
        }}
        disabled={job.loading || !!(application && (application.status === 'pending' || application.status === 'accepted'))}
        className={`relative w-full overflow-hidden group/btn py-4 rounded-2xl font-black text-sm transition-all duration-300 active:scale-95 ${
            (application && application.status === 'accepted') ? 'bg-emerald-500 text-white cursor-default shadow-lg shadow-emerald-100' : 
            (application && application.status === 'pending') ? 'bg-amber-400 text-white cursor-wait' :
            job.loading ? 'bg-indigo-400 text-white cursor-wait' :
            'bg-slate-900 text-white hover:bg-indigo-600 hover:shadow-xl hover:shadow-indigo-200'
        }`}
      >
        <div className="flex items-center justify-center gap-2 relative z-10 transition-transform">
          {job.loading ? (
            <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (application && application.status === 'accepted') ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              Accepted
            </>
          ) : (application && application.status === 'pending') ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Pending
            </>
          ) : (
            <>
              Quick Apply
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </>
          )}
        </div>
        {!((application && (application.status === 'pending' || application.status === 'accepted')) || job.loading) && (
            <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover/btn:left-[100%] transition-all duration-700"></div>
        )}
      </button>
    </div>
  );
};

export default JobCard;
