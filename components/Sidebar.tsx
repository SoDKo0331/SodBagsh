
import React from 'react';

interface SidebarProps {
  activeItem: string;
  streak: number;
  userName: string;
  onNavChange: (view: string) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeItem, streak, userName, onNavChange, onLogout }) => {
  const navItems = [
    { label: 'Хичээлүүд', id: 'dashboard', icon: 'auto_stories' },
    { label: 'Бодлогын сан', id: 'problems', icon: 'quiz' },
    { label: 'Тестүүд', id: 'quiz', icon: 'psychology' },
    { label: 'Sandbox', id: 'sandbox', icon: 'extension' },
    { label: 'Цолнууд', id: 'badges', icon: 'workspace_premium' },
  ];

  return (
    <aside className="w-80 bg-white dark:bg-slate-900 border-r-2 border-slate-100 dark:border-slate-800 flex flex-col shrink-0 z-40">
      <div className="p-8">
        <div className="flex items-center gap-4 mb-10">
          <div className="size-14 rounded-[20px] bg-primary flex items-center justify-center text-slate-900 shadow-lg shadow-primary/30 rotate-3">
            <span className="material-symbols-outlined text-3xl font-black">rocket_launch</span>
          </div>
          <div>
            <h1 className="font-display font-black text-2xl leading-none tracking-tight">CodeQuest</h1>
            <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em] mt-1">Player Mode</p>
          </div>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavChange(item.id)}
              className={`flex w-full items-center gap-4 px-5 py-4 rounded-2xl transition-all font-black text-sm uppercase tracking-widest ${
                activeItem === item.id
                  ? 'bg-primary text-slate-900 shadow-lg shadow-primary/20'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <span className="material-symbols-outlined font-bold">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-8 space-y-6">
        <div className="bg-slate-900 rounded-[24px] p-6 border-2 border-white/5 shadow-2xl relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-125 transition-transform">
             <span className="material-symbols-outlined text-[80px] text-primary">local_fire_department</span>
          </div>
          <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-3">Өнөөдрийн Стрик</p>
          <div className="flex items-center gap-3 text-white">
            <span className="material-symbols-outlined text-orange-500 fill-1 text-3xl">local_fire_department</span>
            <span className="text-2xl font-black">{streak} Өдөр</span>
          </div>
        </div>

        <div className="flex items-center gap-4 px-2">
          <div 
            className="size-14 rounded-2xl bg-slate-200 bg-cover bg-center border-4 border-white shadow-xl rotate-[-2deg]"
            style={{ backgroundImage: `url('https://api.dicebear.com/7.x/pixel-art/svg?seed=${userName}')` }}
          ></div>
          <div className="flex flex-col flex-1 overflow-hidden">
            <span className="text-lg font-black leading-none truncate">{userName}</span>
            <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">Level 1 Hero</span>
          </div>
          <button 
            onClick={onLogout}
            className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 group transition-colors"
          >
            <span className="material-symbols-outlined text-slate-400 group-hover:text-red-500">logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
