
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './views/Dashboard';
import LessonView from './views/LessonView';
import Sandbox from './views/Sandbox';
import { LessonStatus, Module, Badge } from './types';

const INITIAL_MODULES: Module[] = [
  { id: 'm1', number: 1, title: 'LEVEL 1: Эхлэл', description: 'Код гэж юу вэ? Хамгийн анхны тушаалаа компьютерт өгье.', status: LessonStatus.IN_PROGRESS, progressText: '0/2 Алхам', icon: 'campaign', badgeId: 'b1' },
  { id: 'm2', number: 2, title: 'LEVEL 1: Хувьсагч', description: 'Мэдээллийг хэрхэн хайрцаглаж хадгалах вэ?', status: LessonStatus.LOCKED, icon: 'inventory_2', badgeId: 'b2' },
  { id: 'm3', number: 3, title: 'LEVEL 1: IF/ELSE', description: 'Компьютер хэрхэн шийдвэр гаргадаг вэ? Logic сурцгаая.', status: LessonStatus.LOCKED, icon: 'alt_route', badgeId: 'b3' },
  { id: 'm4', number: 4, title: 'LEVEL 2: Давталт', description: 'Уйтгартай ажлыг 100 удаа хийх хэрэггүй боллоо.', status: LessonStatus.LOCKED, icon: 'rebase_edit' },
  { id: 'm5', number: 5, title: 'LEVEL 3: Функц', description: 'Өөрийн гэсэн шидэт тушаалуудыг үүсгэж сурна.', status: LessonStatus.LOCKED, icon: 'function' },
  { id: 'm6', number: 6, title: 'LEVEL 4: Sorting', description: 'Bubble Sort болон бусад эрэмбэлэх аргууд.', status: LessonStatus.LOCKED, lockedType: 'ultimate', icon: 'format_list_numbered', badgeId: 'b4' }
];

const INITIAL_BADGES: Badge[] = [
  { id: 'b1', title: 'Анхны алхам', description: 'Эхний хичээлийг амжилттай дуусгав.', icon: 'rocket_launch', color: 'bg-blue-500', isEarned: false },
  { id: 'b2', title: 'Хайрцаглагч', description: 'Хувьсагчийн тухай хичээлийг дуусгав.', icon: 'inventory_2', color: 'bg-yellow-500', isEarned: false },
  { id: 'b3', title: 'Логикч', description: 'Шийдвэр гаргах логикийг сурав.', icon: 'alt_route', color: 'bg-purple-500', isEarned: false },
  { id: 'b4', title: 'Эрэмбэлэгч', description: 'Bubble Sort-ыг бүрэн эзэмшив.', icon: 'format_list_numbered', color: 'bg-primary', isEarned: false },
  { id: 's1', title: 'Тууштай сурагч', description: '3 хоног дараалан суралцав.', icon: 'local_fire_department', color: 'bg-orange-500', isEarned: false },
];

const App: React.FC = () => {
  const [modules, setModules] = useState<Module[]>(() => {
    const saved = localStorage.getItem('codequest_progress_v4');
    return saved ? JSON.parse(saved) : INITIAL_MODULES;
  });
  
  const [badges, setBadges] = useState<Badge[]>(() => {
    const saved = localStorage.getItem('codequest_badges_v4');
    return saved ? JSON.parse(saved) : INITIAL_BADGES;
  });

  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem('codequest_streak_v4');
    return saved ? parseInt(saved) : 1;
  });

  const [currentView, setCurrentView] = useState<'dashboard' | 'lesson' | 'sandbox' | 'badges'>('dashboard');
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  
  const [preferredLanguage, setPreferredLanguage] = useState<'python' | 'c'>(() => {
    const saved = localStorage.getItem('codequest_pref_lang');
    return (saved as 'python' | 'c') || 'c';
  });

  useEffect(() => {
    localStorage.setItem('codequest_progress_v4', JSON.stringify(modules));
    localStorage.setItem('codequest_badges_v4', JSON.stringify(badges));
    localStorage.setItem('codequest_streak_v4', streak.toString());
  }, [modules, badges, streak]);

  useEffect(() => {
    localStorage.setItem('codequest_pref_lang', preferredLanguage);
  }, [preferredLanguage]);

  // Handle streak on load
  useEffect(() => {
    const lastDate = localStorage.getItem('codequest_last_active');
    const today = new Date().toDateString();
    if (lastDate && lastDate !== today) {
      const last = new Date(lastDate);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (last.toDateString() === yesterday.toDateString()) {
        const newStreak = streak + 1;
        setStreak(newStreak);
        if (newStreak >= 3) {
          earnBadge('s1');
        }
      } else if (new Date(lastDate) < yesterday) {
        setStreak(1);
      }
    }
    localStorage.setItem('codequest_last_active', today);
  }, []);

  const earnBadge = (badgeId: string) => {
    setBadges(prev => prev.map(b => b.id === badgeId ? { ...b, isEarned: true } : b));
  };

  const handleStartLesson = (moduleId: string) => {
    setSelectedModuleId(moduleId);
    setCurrentView('lesson');
  };

  const handleExitLesson = (completed?: boolean) => {
    if (completed && selectedModuleId) {
      const module = modules.find(m => m.id === selectedModuleId);
      if (module?.badgeId) {
        earnBadge(module.badgeId);
      }

      setModules(prev => prev.map(m => {
        if (m.id === selectedModuleId) return { ...m, status: LessonStatus.COMPLETED };
        
        const finishedIdx = prev.findIndex(mod => mod.id === selectedModuleId);
        const nextIdx = finishedIdx + 1;
        if (prev[nextIdx] && prev[nextIdx].id === m.id && m.status === LessonStatus.LOCKED) {
            return { ...m, status: LessonStatus.IN_PROGRESS };
        }
        return m;
      }));
    }
    setCurrentView('dashboard');
    setSelectedModuleId(null);
  };

  const handleNavChange = (view: 'dashboard' | 'sandbox' | 'badges') => {
    setCurrentView(view);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
      {currentView !== 'lesson' && <Sidebar activeItem={currentView} streak={streak} onNavChange={handleNavChange} />}
      
      <main className="flex-1 flex flex-col overflow-hidden">
        {currentView === 'dashboard' ? (
          <Dashboard 
            modules={modules} 
            badges={badges}
            onStartLesson={handleStartLesson} 
            activePath={preferredLanguage}
            onPathChange={setPreferredLanguage}
            onViewBadges={() => setCurrentView('badges')}
          />
        ) : currentView === 'lesson' ? (
          <LessonView 
            onExit={handleExitLesson} 
            moduleId={selectedModuleId} 
            initialLanguage={preferredLanguage}
            onLanguageChange={setPreferredLanguage}
          />
        ) : currentView === 'badges' ? (
          <div className="flex-1 overflow-y-auto p-10 bg-[#f8faf9] dark:bg-[#0d1a13]">
             <header className="mb-10 flex items-center justify-between">
                <div>
                  <button onClick={() => setCurrentView('dashboard')} className="flex items-center gap-2 text-slate-500 font-black uppercase text-xs tracking-widest mb-2 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-sm">arrow_back</span> Буцах
                  </button>
                  <h1 className="text-4xl font-black tracking-tighter">Миний Цолнууд (Badges)</h1>
                </div>
                <div className="bg-white dark:bg-slate-900 px-6 py-3 rounded-2xl border-2 border-slate-100 dark:border-slate-800 flex items-center gap-3">
                   <span className="material-symbols-outlined text-primary font-black">emoji_events</span>
                   <span className="font-black text-xl">{badges.filter(b => b.isEarned).length} / {badges.length}</span>
                </div>
             </header>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {badges.map(badge => (
                  <div key={badge.id} className={`p-8 rounded-[32px] border-4 transition-all flex flex-col items-center text-center ${badge.isEarned ? 'bg-white dark:bg-slate-900 border-primary/20 shadow-xl' : 'bg-slate-50 dark:bg-slate-800/20 border-slate-100 dark:border-slate-800 grayscale opacity-60'}`}>
                    <div className={`size-24 rounded-full flex items-center justify-center mb-6 shadow-2xl ${badge.isEarned ? badge.color + ' text-white' : 'bg-slate-200 text-slate-400'}`}>
                      <span className="material-symbols-outlined text-5xl font-bold">{badge.icon}</span>
                    </div>
                    <h3 className="text-xl font-black mb-2">{badge.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{badge.description}</p>
                    {badge.isEarned && (
                      <div className="mt-6 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">Авсан</div>
                    )}
                  </div>
                ))}
             </div>
          </div>
        ) : (
          <Sandbox onBack={() => setCurrentView('dashboard')} />
        )}
      </main>
    </div>
  );
};

export default App;
