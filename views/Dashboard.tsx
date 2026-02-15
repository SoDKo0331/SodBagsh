
import React from 'react';
import { Module, LessonStatus, Badge } from '../types';

interface DashboardProps {
  modules: (Module & { status: LessonStatus })[];
  badges: Badge[];
  onStartLesson: (moduleId: string) => void;
  activePath: 'python' | 'c' | 'cpp';
  onPathChange: (path: 'python' | 'c' | 'cpp') => void;
  onViewBadges: () => void;
  userXP?: number;
}

const Dashboard: React.FC<DashboardProps> = ({ modules, badges, onStartLesson, activePath, onPathChange, onViewBadges, userXP = 0 }) => {
  const completedCount = modules.filter(m => m.status === LessonStatus.COMPLETED).length;
  const progressPercent = Math.round((completedCount / (modules.length || 1)) * 100);

  return (
    <div className="flex-1 flex flex-col bg-[#050a07] overflow-hidden">
      <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 shrink-0 bg-black/40 backdrop-blur-xl">
        <div className="flex items-center gap-6">
          <div>
            <h2 className="text-xl font-black text-white tracking-tight italic">Миний аялал</h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Enterprise Edition v2.0</p>
          </div>
          <div className="h-10 w-px bg-white/10 hidden md:block"></div>
          <div className="hidden md:flex items-center gap-2">
             <span className="material-symbols-outlined text-primary text-sm">stars</span>
             <span className="text-sm font-black text-white">{userXP.toLocaleString()} XP</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
            {['python', 'c', 'cpp'].map(p => (
              <button 
                key={p} 
                onClick={() => onPathChange(p as any)} 
                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${activePath === p ? 'bg-primary text-slate-900 shadow-lg' : 'text-slate-500 hover:text-white'}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
        {/* Progress Overview Card */}
        <section className="mb-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 p-10 rounded-[48px] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition-transform duration-700">
              <span className="material-symbols-outlined text-[200px] text-primary">analytics</span>
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <span className="size-2 rounded-full bg-primary animate-pulse"></span>
                <p className="text-[11px] font-black text-primary uppercase tracking-[0.3em]">Learning Velocity</p>
              </div>
              <h3 className="text-5xl font-black text-white mb-8 tracking-tighter italic">Таны ахиц {progressPercent}%</h3>
              <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/5">
                <div 
                  className="h-full bg-primary shadow-[0_0_30px_rgba(19,236,128,0.5)] transition-all duration-1000 rounded-full" 
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-10 rounded-[48px] flex flex-col justify-between backdrop-blur-sm relative overflow-hidden">
             <div className="relative z-10">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Сүүлийн амжилтууд</p>
                <div className="flex -space-x-3 mb-8">
                  {badges.filter(b => b.isEarned).slice(0, 4).map(b => (
                    <div key={b.id} title={b.title} className={`size-14 rounded-3xl border-4 border-[#050a07] ${b.color} flex items-center justify-center text-white shadow-2xl transform hover:-translate-y-2 transition-transform cursor-help`}>
                      <span className="material-symbols-outlined text-xl">{b.icon}</span>
                    </div>
                  ))}
                  {badges.filter(b => b.isEarned).length > 4 && (
                    <div className="size-14 rounded-3xl border-4 border-[#050a07] bg-slate-800 flex items-center justify-center text-xs font-black">
                      +{badges.filter(b => b.isEarned).length - 4}
                    </div>
                  )}
                  {badges.filter(b => b.isEarned).length === 0 && (
                    <p className="text-[10px] text-slate-600 font-black uppercase italic">No badges yet</p>
                  )}
                </div>
             </div>
             <button onClick={onViewBadges} className="w-full py-4 bg-white/5 hover:bg-primary hover:text-slate-900 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">Бүх цол харах</button>
          </div>
        </section>

        {/* Module Grid */}
        <section>
          <div className="flex items-center justify-between mb-10 px-2">
             <div className="flex items-center gap-3">
                <span className="size-2 rounded-full bg-primary"></span>
                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 italic">Сургуулийн төлөвлөгөө</h4>
             </div>
             <div className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Нийт {modules.length} Модуль</div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {modules.map(mod => (
              <div 
                key={mod.id} 
                onClick={() => onStartLesson(mod.id)}
                className={`group p-8 rounded-[40px] border-4 transition-all cursor-pointer relative overflow-hidden flex flex-col min-h-[320px] ${
                  mod.status === LessonStatus.LOCKED 
                  ? 'bg-black/40 border-white/5 opacity-50 grayscale hover:grayscale-0' 
                  : mod.status === LessonStatus.COMPLETED 
                  ? 'bg-primary/5 border-primary/20 hover:border-primary/40' 
                  : 'bg-white/5 border-white/10 hover:border-primary hover:bg-white/[0.08] shadow-2xl'
                }`}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className={`size-16 rounded-3xl flex items-center justify-center transition-all group-hover:scale-110 ${mod.status === LessonStatus.LOCKED ? 'bg-white/5 text-slate-600' : 'bg-primary/10 text-primary'}`}>
                    <span className="material-symbols-outlined text-4xl font-bold">{mod.icon}</span>
                  </div>
                  {mod.isPremium && (
                    <div className="bg-yellow-500 text-black px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shadow-lg shadow-yellow-500/20">Pro</div>
                  )}
                </div>
                
                <h5 className="text-xl font-black mb-3 text-white italic tracking-tight">{mod.number}. {mod.title}</h5>
                <p className="text-sm text-slate-500 font-medium leading-relaxed mb-10 line-clamp-2">{mod.description}</p>
                
                <div className="mt-auto flex items-center justify-between">
                   <div className="flex flex-col">
                      <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-600">Статус</span>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${mod.status === LessonStatus.COMPLETED ? 'text-primary' : 'text-slate-400'}`}>{mod.status}</span>
                   </div>
                   <div className="size-10 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-slate-900 transition-all">
                      <span className="material-symbols-outlined text-sm font-black">arrow_forward</span>
                   </div>
                </div>
                
                {mod.status === LessonStatus.LOCKED && (
                  <div className="absolute top-4 right-4"><span className="material-symbols-outlined text-sm text-slate-700">lock</span></div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
