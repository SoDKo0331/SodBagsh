
import React from 'react';
import { Badge } from '../types';

interface BadgesViewProps {
  badges: Badge[];
  onBack: () => void;
}

const BadgesView: React.FC<BadgesViewProps> = ({ badges, onBack }) => {
  const earnedCount = badges.filter(b => b.isEarned).length;

  return (
    <div className="flex-1 overflow-y-auto p-10 bg-[#f8faf9] dark:bg-[#0d1a13] font-display">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <button onClick={onBack} className="flex items-center gap-2 text-slate-500 font-black uppercase text-xs tracking-widest mb-4 hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-sm">arrow_back</span> Буцах
          </button>
          <h1 className="text-5xl font-black tracking-tighter mb-2">Миний Цолнууд 🏆</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Чиний цуглуулсан амжилтын тэмдгүүд</p>
        </div>
        
        <div className="bg-white dark:bg-slate-900 px-8 py-6 rounded-[32px] border-2 border-slate-100 dark:border-slate-800 shadow-xl flex items-center gap-6">
           <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Нийт амжилт</p>
              <p className="text-3xl font-black text-primary">{earnedCount} / {badges.length}</p>
           </div>
           <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl text-primary font-black">workspace_premium</span>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {badges.map((badge) => (
          <div 
            key={badge.id}
            className={`relative p-8 rounded-[40px] border-4 transition-all flex flex-col items-center text-center overflow-hidden group ${
              badge.isEarned 
                ? 'bg-white dark:bg-slate-900 border-primary/20 shadow-xl hover:shadow-primary/10 hover:scale-[1.02]' 
                : 'bg-slate-50/50 dark:bg-slate-800/10 border-dashed border-slate-200 dark:border-slate-800 opacity-60'
            }`}
          >
            {!badge.isEarned && (
               <div className="absolute inset-0 flex items-center justify-center bg-slate-900/5 backdrop-blur-[2px] z-10">
                  <span className="material-symbols-outlined text-slate-400 text-4xl">lock</span>
               </div>
            )}

            <div className={`size-24 rounded-[32px] flex items-center justify-center mb-6 shadow-2xl relative transition-transform group-hover:rotate-6 ${badge.isEarned ? badge.color : 'bg-slate-200 dark:bg-slate-800 text-slate-400'}`}>
              <span className="material-symbols-outlined text-5xl font-black text-white">{badge.icon}</span>
              {badge.isEarned && (
                <div className="absolute -top-2 -right-2 size-8 bg-primary rounded-full border-4 border-white dark:border-slate-900 flex items-center justify-center">
                   <span className="material-symbols-outlined text-slate-900 text-sm font-black">check</span>
                </div>
              )}
            </div>

            <h3 className={`text-xl font-black mb-2 ${badge.isEarned ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>{badge.title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{badge.description}</p>
            
            {badge.isEarned && (
              <div className="mt-6 pt-6 border-t border-slate-100 dark:border-white/5 w-full">
                 <span className="text-[10px] font-black text-primary uppercase tracking-widest">Авсан амжилт</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BadgesView;
