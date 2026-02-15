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
    <div className="flex-1 flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <header className="h-16 border-b border-border flex items-center justify-between px-8 bg-background/80 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center gap-6">
          <h2 className="text-lg font-semibold text-foreground tracking-tight">Learning Path</h2>
          <div className="h-6 w-px bg-border hidden md:block"></div>
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50 border border-border">
             <span className="material-symbols-outlined text-primary text-[18px]">stars</span>
             <span className="text-xs font-bold text-foreground">{userXP.toLocaleString()} XP</span>
          </div>
        </div>
        
        {/* Language Toggle */}
        <div className="flex bg-muted p-1 rounded-lg border border-border">
          {['python', 'c', 'cpp'].map(p => (
            <button 
              key={p} 
              onClick={() => onPathChange(p as any)} 
              className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase transition-all ${
                activePath === p 
                ? 'bg-background text-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-7xl mx-auto space-y-10">
          
          {/* Hero / Stats Section */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Progress Card */}
            <div className="lg:col-span-2 bg-gradient-to-br from-card to-muted border border-border p-8 rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                <span className="material-symbols-outlined text-[180px]">analytics</span>
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="size-2 rounded-full bg-primary animate-pulse"></span>
                  <p className="text-xs font-bold text-primary uppercase tracking-wider">Active Session</p>
                </div>
                
                <h3 className="text-3xl font-bold text-foreground mb-6 tracking-tight">
                  You've completed {progressPercent}% of the {activePath === 'cpp' ? 'C++' : activePath.charAt(0).toUpperCase() + activePath.slice(1)} course.
                </h3>
                
                <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
                <p className="mt-3 text-sm text-muted-foreground font-medium">Keep going! You're 2 modules away from the next certificate.</p>
              </div>
            </div>

            {/* Badges Widget */}
            <div className="bg-card border border-border p-6 rounded-2xl flex flex-col h-full">
               <div className="flex justify-between items-center mb-6">
                  <h4 className="text-sm font-bold text-foreground">Recent Achievements</h4>
                  <button onClick={onViewBadges} className="text-xs font-semibold text-primary hover:text-primary-hover">View All</button>
               </div>
               
               <div className="flex-1 flex items-center justify-center gap-3">
                  {badges.filter(b => b.isEarned).length > 0 ? (
                    badges.filter(b => b.isEarned).slice(0, 3).map(b => (
                      <div key={b.id} title={b.title} className={`size-16 rounded-xl border-2 border-border ${b.color} flex items-center justify-center text-white shadow-sm`}>
                        <span className="material-symbols-outlined text-2xl">{b.icon}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6">
                      <div className="size-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                         <span className="material-symbols-outlined text-muted-foreground">lock</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Complete lessons to earn badges</p>
                    </div>
                  )}
               </div>
            </div>
          </section>

          {/* Modules Grid */}
          <section>
            <div className="flex items-center justify-between mb-6">
               <h3 className="text-xl font-bold text-foreground tracking-tight">Core Modules</h3>
               <span className="px-3 py-1 rounded-full bg-muted border border-border text-xs font-semibold text-muted-foreground">
                 {modules.length} Units
               </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {modules.map(mod => (
                <div 
                  key={mod.id} 
                  onClick={() => onStartLesson(mod.id)}
                  className={`group relative p-6 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col h-full ${
                    mod.status === LessonStatus.LOCKED 
                    ? 'bg-muted/30 border-border opacity-60' 
                    : 'bg-card border-border hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5'
                  }`}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className={`size-12 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110 ${
                      mod.status === LessonStatus.LOCKED 
                        ? 'bg-muted text-muted-foreground' 
                        : 'bg-primary/10 text-primary'
                    }`}>
                      <span className="material-symbols-outlined text-2xl">{mod.icon}</span>
                    </div>
                    {mod.isPremium && (
                      <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                        Pro
                      </div>
                    )}
                  </div>
                  
                  <div className="mb-8 flex-1">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1 block">Level {mod.number}</span>
                    <h5 className="text-lg font-bold text-foreground mb-2 leading-tight">{mod.title}</h5>
                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">{mod.description}</p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
                     <span className={`text-xs font-bold uppercase tracking-wider ${
                       mod.status === LessonStatus.COMPLETED ? 'text-primary' : 'text-muted-foreground'
                     }`}>
                       {mod.status === LessonStatus.IN_PROGRESS ? 'Resume' : mod.status}
                     </span>
                     
                     {mod.status === LessonStatus.LOCKED ? (
                       <span className="material-symbols-outlined text-sm text-muted-foreground">lock</span>
                     ) : (
                       <span className="material-symbols-outlined text-sm text-primary group-hover:translate-x-1 transition-transform">arrow_forward</span>
                     )}
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;