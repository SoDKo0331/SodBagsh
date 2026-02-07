
import React from 'react';
import { Module, LessonStatus, Badge } from '../types';

interface DashboardProps {
  modules: Module[];
  badges: Badge[];
  onStartLesson: (moduleId: string) => void;
  activePath: 'python' | 'c' | 'cpp';
  onPathChange: (path: 'python' | 'c' | 'cpp') => void;
  onViewBadges: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ modules, badges, onStartLesson, activePath, onPathChange, onViewBadges }) => {
  const completedCount = modules.filter(m => m.status === LessonStatus.COMPLETED).length;
  const progressPercent = Math.round((completedCount / modules.length) * 100);
  const earnedBadgesCount = badges.filter(b => b.isEarned).length;

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#f8faf9] dark:bg-[#0d1a13]">
      <header className="h-24 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-10 shrink-0 sticky top-0 z-10">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Сайн уу, Сурагч аа! 👋</h2>
          <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mt-1">Өнөөдрийн аялалдаа бэлэн үү?</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700">
            <button 
              onClick={() => onPathChange('python')}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activePath === 'python' ? 'bg-white dark:bg-slate-700 shadow-lg text-slate-900 dark:text-white' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Python
            </button>
            <button 
              onClick={() => onPathChange('c')}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activePath === 'c' ? 'bg-white dark:bg-slate-700 shadow-lg text-slate-900 dark:text-white' : 'text-slate-400 hover:text-slate-600'}`}
            >
              C
            </button>
            <button 
              onClick={() => onPathChange('cpp')}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activePath === 'cpp' ? 'bg-white dark:bg-slate-700 shadow-lg text-slate-900 dark:text-white' : 'text-slate-400 hover:text-slate-600'}`}
            >
              C++
            </button>
          </div>
          <button 
            onClick={() => onStartLesson('m1')}
            className="bg-primary hover:bg-primary/90 text-slate-900 px-8 py-3.5 rounded-2xl font-black shadow-xl shadow-primary/20 transition-all flex items-center gap-3 hover:scale-105 active:scale-95 uppercase tracking-widest text-sm"
          >
            <span className="material-symbols-outlined text-2xl">play_circle</span>
            Үргэлжлүүлэх
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Progress Card */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-[32px] shadow-xl border-2 border-slate-100 dark:border-slate-800 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform duration-700">
               <span className="material-symbols-outlined text-[160px] text-primary">auto_stories</span>
            </div>
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div>
                <h3 className="font-black text-2xl mb-2">{activePath === 'c' ? 'C Language' : activePath === 'cpp' ? 'C++' : 'Python'} Сурах Явц</h3>
                <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">Нийт {modules.length} хичээлээс {completedCount}-г дуусгав.</p>
              </div>
              <div className="text-right">
                <span className="text-5xl font-black text-primary tracking-tighter">{progressPercent}%</span>
              </div>
            </div>
            <div className="w-full h-6 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-1 border border-slate-200 dark:border-slate-700">
              <div className="h-full bg-primary rounded-full shadow-[0_0_20px_rgba(19,236,128,0.6)] transition-all duration-1000 ease-out" style={{ width: `${progressPercent}%` }}></div>
            </div>
            <div className="flex justify-between mt-4 px-2 relative z-10">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Эхлэл</span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Мастер</span>
            </div>
          </div>

          {/* Badges Summary Card */}
          <div className="bg-slate-900 text-white p-8 rounded-[32px] shadow-2xl relative overflow-hidden flex flex-col justify-between">
             <div className="relative z-10">
                <h3 className="font-black text-xl mb-1">Миний Цолнууд</h3>
                <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-6">Badges Unlocked</p>
                <div className="flex -space-x-4">
                  {badges.filter(b => b.isEarned).slice(0, 4).map(badge => (
                    <div key={badge.id} className={`size-14 rounded-full border-4 border-slate-900 flex items-center justify-center ${badge.color} text-white shadow-xl`}>
                      <span className="material-symbols-outlined text-2xl">{badge.icon}</span>
                    </div>
                  ))}
                  {earnedBadgesCount > 4 && (
                    <div className="size-14 rounded-full border-4 border-slate-900 bg-slate-800 flex items-center justify-center text-xs font-black">+{earnedBadgesCount - 4}</div>
                  )}
                  {earnedBadgesCount === 0 && (
                    <p className="text-slate-500 text-xs font-medium pl-4">Одоогоор цол аваагүй байна.</p>
                  )}
                </div>
             </div>
             <button onClick={onViewBadges} className="mt-8 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all text-center border border-white/10 relative z-10">
               Бүх цолыг харах
             </button>
             <div className="absolute -bottom-10 -right-10 opacity-10 rotate-12">
               <span className="material-symbols-outlined text-[140px] text-white">workspace_premium</span>
             </div>
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
               <span className="material-symbols-outlined text-primary text-3xl font-black">map</span>
               <h3 className="text-2xl font-black tracking-tight">Хичээлийн Газрын Зураг</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {modules.map((mod) => (
              <ModuleCard key={mod.id} module={mod} onClick={() => mod.status !== LessonStatus.LOCKED && onStartLesson(mod.id)} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

const ModuleCard: React.FC<{ module: Module; onClick: () => void }> = ({ module, onClick }) => {
  const isLocked = module.status === LessonStatus.LOCKED;
  const isCompleted = module.status === LessonStatus.COMPLETED;
  const isInProgress = module.status === LessonStatus.IN_PROGRESS;

  return (
    <div 
      onClick={onClick}
      className={`group relative p-8 rounded-[32px] shadow-lg border-4 transition-all flex flex-col cursor-pointer overflow-hidden ${
        isLocked 
          ? 'bg-slate-50/50 dark:bg-slate-800/10 border-dashed border-slate-200 dark:border-slate-800 grayscale pointer-events-none' 
          : isInProgress 
          ? 'bg-white dark:bg-slate-900 border-primary shadow-primary/10 hover:shadow-2xl hover:scale-[1.02]' 
          : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-primary/40 hover:scale-[1.02]'
      }`}
    >
      {isInProgress && (
        <div className="absolute -top-3 -right-3 bg-primary text-slate-900 text-[9px] font-black px-4 py-3 rounded-bl-3xl uppercase tracking-widest shadow-lg">Идэвхтэй</div>
      )}
      
      <div className={`size-16 rounded-2xl flex items-center justify-center mb-6 shadow-inner ${isLocked ? 'bg-slate-100 dark:bg-slate-800 text-slate-400' : 'bg-primary/10 text-primary border-2 border-primary/10'}`}>
        <span className="material-symbols-outlined text-4xl font-bold">{module.icon}</span>
      </div>
      
      <h4 className={`font-black text-xl mb-3 tracking-tight ${isLocked ? 'text-slate-400' : 'text-slate-900 dark:text-white'}`}>
        {module.number}. {module.title}
      </h4>
      <p className={`text-sm mb-8 flex-1 font-medium leading-relaxed ${isLocked ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400'}`}>
        {module.description}
      </p>
      
      <div className="flex items-center justify-between mt-auto">
        {isCompleted ? (
          <span className="flex items-center gap-1.5 text-primary text-xs font-black uppercase tracking-widest">
            <span className="material-symbols-outlined text-sm font-bold fill-1">check_circle</span>
            Дууссан
          </span>
        ) : isLocked ? (
          <span className="flex items-center gap-1.5 text-slate-400 text-xs font-black uppercase tracking-widest">
            <span className="material-symbols-outlined text-sm">{module.lockedType === 'ultimate' ? 'lock_person' : 'lock'}</span>
            Цоожтой
          </span>
        ) : (
          <span className="text-[10px] font-black text-slate-400 italic uppercase tracking-widest">{module.progressText}</span>
        )}
        
        {!isLocked && (
          <button className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
            isInProgress 
              ? 'bg-primary text-slate-900 shadow-lg shadow-primary/20' 
              : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200'
          }`}>
            {isInProgress ? 'Эхлэх' : 'Дахин үзэх'}
          </button>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
