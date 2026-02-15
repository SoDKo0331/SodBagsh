import React from 'react';

interface SidebarProps {
  activeItem: string;
  streak: number;
  userName: string;
  isSyncing?: boolean;
  onNavChange: (view: string) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeItem, streak, userName, isSyncing, onNavChange, onLogout }) => {
  const navItems = [
    { label: 'Хичээлүүд', id: 'dashboard', icon: 'auto_stories' },
    { label: 'Бодлогын сан', id: 'problems', icon: 'quiz' },
    { label: 'Тестүүд', id: 'quiz', icon: 'psychology' },
    { label: 'Sandbox', id: 'sandbox', icon: 'extension' },
    { label: 'Цолнууд', id: 'badges', icon: 'workspace_premium' },
    { label: 'Game Arena', id: 'game', icon: 'swords' },
  ];

  return (
    <aside className="w-72 bg-card border-r border-border flex flex-col shrink-0 z-40 h-full transition-all duration-300">
      <div className="p-6">
        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-10">
          <div className="size-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-glow">
            <span className="material-symbols-outlined text-2xl">rocket_launch</span>
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-tight leading-none">CodeQuest</h1>
            <div className="flex items-center gap-1.5 mt-1.5">
               <span className={`size-1.5 rounded-full ${isSyncing ? 'bg-primary' : 'bg-orange-500'}`}></span>
               <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                 {isSyncing ? 'Enterprise' : 'Local Mode'}
               </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavChange(item.id)}
              className={`flex w-full items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium ${
                activeItem === item.id
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <span className={`material-symbols-outlined text-[20px] ${activeItem === item.id ? 'fill-1' : ''}`}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Footer / User Profile */}
      <div className="mt-auto p-6 space-y-4 border-t border-border bg-muted/20">
        {/* Streak Card */}
        <div className="bg-card rounded-xl p-4 border border-border shadow-sm flex items-center justify-between">
          <div>
             <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Current Streak</p>
             <span className="text-lg font-bold text-foreground">{streak} Days</span>
          </div>
          <span className="material-symbols-outlined text-orange-500 text-3xl">local_fire_department</span>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-3">
          <div 
            className="size-10 rounded-full bg-muted bg-cover bg-center border border-border shrink-0"
            style={{ backgroundImage: `url('https://api.dicebear.com/7.x/notionists/svg?seed=${userName}&backgroundColor=e5e7eb')` }}
          ></div>
          <div className="flex flex-col flex-1 overflow-hidden min-w-0">
            <span className="text-sm font-semibold truncate text-foreground">{userName}</span>
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Pro Plan</span>
          </div>
          <button 
            onClick={onLogout}
            className="size-8 flex items-center justify-center rounded-lg hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-colors"
            title="Log out"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;