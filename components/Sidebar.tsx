
import React from 'react';

interface SidebarProps {
  activeItem: string;
  streak: number;
  onNavChange: (view: 'dashboard' | 'sandbox' | 'badges') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeItem, streak, onNavChange }) => {
  const navItems = [
    { label: 'Хичээлүүд', id: 'dashboard', icon: 'auto_stories', view: 'dashboard' as const },
    { label: 'Sandbox', id: 'sandbox', icon: 'extension', view: 'sandbox' as const },
    { label: 'Цолнууд', id: 'badges', icon: 'workspace_premium', view: 'badges' as const },
  ];

  return (
    <aside className="w-80 bg-white dark:bg-slate-900 border-r-2 border-slate-100 dark:border-slate-800 flex flex-col shrink-0 z-40">
      <div className="p-8">
        <div className="flex items-center gap-4 mb-10 cursor-pointer" onClick={() => onNavChange('dashboard')}>
          <div className="size-14 rounded-[20px] bg-primary flex items-center justify-center text-slate-900 shadow-lg shadow-primary/30 rotate-3">
            <span className="material-symbols-outlined text-3xl font-black">rocket_launch</span>
          </div>
          <div>
            <h1 className="font-display font-black text-2xl leading-none tracking-tight">CodeQuest</h1>
            <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em] mt-1">Guest Mode</p>
          </div>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavChange(item.view)}
              className={`flex w-full items-center gap-4 px-5 py-4 rounded-2xl transition-all font-black text-sm uppercase tracking-widest ${
                activeItem === item.id
                  ? 'bg-primary text-slate-900 shadow-lg shadow-primary/20'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 border-2 border-transparent hover:border-slate-100 dark:hover:border-slate-700'
              }`}
            >
              <span className="material-symbols-outlined font-bold">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-8 space-y-6">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-primary/10 dark:to-primary/5 rounded-[24px] p-6 border-2 border-white/5 shadow-2xl relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-125 transition-transform">
             <span className="material-symbols-outlined text-[80px] text-primary">local_fire_department</span>
          </div>
          <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-3">Өнөөдрийн Стрик</p>
          <div className="flex items-center gap-3">
            <span className={`material-symbols-outlined ${streak > 0 ? 'text-orange-500 fill-1' : 'text-slate-600'} text-3xl animate-bounce`}>local_fire_department</span>
            <span className="text-2xl font-black text-white">{streak} Өдөр</span>
          </div>
        </div>

        <div className="flex items-center gap-4 px-2">
          <div 
            className="size-14 rounded-2xl bg-slate-200 bg-cover bg-center border-4 border-white shadow-xl rotate-[-2deg]"
            style={{ backgroundImage: "url('https://picsum.photos/seed/coder-kid/100/100')" }}
          ></div>
          <div className="flex flex-col">
            <span className="text-lg font-black leading-none">Kid Coder</span>
            <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">Level 4 Hero</span>
          </div>
          <button className="ml-auto p-2 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 transition-colors">
            <span className="material-symbols-outlined text-slate-400">settings</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
