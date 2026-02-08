
import React, { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, onSnapshot } from "firebase/firestore";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut, User } from "firebase/auth";
import Sidebar from './components/Sidebar';
import Dashboard from './views/Dashboard';
import LessonView from './views/LessonView';
import Sandbox from './views/Sandbox';
import ProblemBank from './views/ProblemBank';
import ProblemSolvingView from './views/ProblemSolvingView';
import QuizView from './views/QuizView';
import { LessonStatus, Module, Badge } from './types';
import { PROBLEMS } from './data/problems';

// --- Firebase Configuration ---
const firebaseConfig = {
  apiKey: "AIzaSyBZ3yL48P81whM5OTJbsoN3YgM1mHRRXxQ",
  authDomain: "fluttershop-4c9e0.firebaseapp.com",
  projectId: "fluttershop-4c9e0",
  storageBucket: "fluttershop-4c9e0.firebasestorage.app",
  messagingSenderId: "976865178982",
  appId: "1:976865178982:web:f1022d04f08ef9dd1504a7",
  measurementId: "G-RZ5KNH6556"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

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
  { id: 'q1', title: 'Python Master', description: 'Python-ий 30 асуултанд 100% зөв хариулж мастер болов.', icon: 'psychology', color: 'bg-red-600', isEarned: false },
];

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  const [modules, setModules] = useState<Module[]>(INITIAL_MODULES);
  const [badges, setBadges] = useState<Badge[]>(INITIAL_BADGES);
  const [solvedProblems, setSolvedProblems] = useState<string[]>([]);
  const [streak, setStreak] = useState(1);
  const [currentView, setCurrentView] = useState<'dashboard' | 'lesson' | 'sandbox' | 'badges' | 'problems' | 'solving-problem' | 'quiz'>('dashboard');
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [selectedProblemId, setSelectedProblemId] = useState<string | null>(null);
  const [preferredLanguage, setPreferredLanguage] = useState<'python' | 'c' | 'cpp'>('python');

  // Listen to Auth Changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Load from Firebase when user is logged in
  useEffect(() => {
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.modules) setModules(data.modules);
          if (data.badges) setBadges(data.badges);
          if (data.solvedProblems) setSolvedProblems(data.solvedProblems);
          if (data.streak) setStreak(data.streak);
        } else {
          saveToFirebase(user.uid, INITIAL_MODULES, INITIAL_BADGES, [], 1);
        }
      });
      return () => unsubscribe();
    }
  }, [user]);

  const saveToFirebase = async (uid: string, currentModules: Module[], currentBadges: Badge[], currentSolved: string[], currentStreak: number) => {
    setIsSyncing(true);
    try {
      await setDoc(doc(db, "users", uid), {
        email: user?.email,
        displayName: user?.displayName,
        modules: currentModules,
        badges: currentBadges,
        solvedProblems: currentSolved,
        streak: currentStreak,
        lastActive: new Date().toISOString()
      }, { merge: true });
    } catch (e) {
      console.error("Firebase sync error", e);
    }
    setIsSyncing(false);
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed", error);
      alert("Gmail-ээр нэвтрэхэд алдаа гарлаа.");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setCurrentView('dashboard');
  };

  const earnBadge = (badgeId: string) => {
    const newBadges = badges.map(b => b.id === badgeId ? { ...b, isEarned: true } : b);
    setBadges(newBadges);
    if (user) saveToFirebase(user.uid, modules, newBadges, solvedProblems, streak);
  };

  const handleSolveProblem = (pid: string) => {
    if (!solvedProblems.includes(pid)) {
      const newSolved = [...solvedProblems, pid];
      setSolvedProblems(newSolved);
      if (user) saveToFirebase(user.uid, modules, badges, newSolved, streak);
    }
  };

  const handleExitLesson = (completed?: boolean) => {
    if (completed && selectedModuleId && user) {
      const module = modules.find(m => m.id === selectedModuleId);
      const newModules = modules.map(m => {
        if (m.id === selectedModuleId) return { ...m, status: LessonStatus.COMPLETED };
        const finishedIdx = modules.findIndex(mod => mod.id === selectedModuleId);
        const nextIdx = finishedIdx + 1;
        if (modules[nextIdx] && modules[nextIdx].id === m.id && m.status === LessonStatus.LOCKED) {
            return { ...m, status: LessonStatus.IN_PROGRESS };
        }
        return m;
      });

      const updatedBadges = module?.badgeId 
        ? badges.map(b => b.id === module.badgeId ? { ...b, isEarned: true } : b)
        : badges;

      setModules(newModules);
      setBadges(updatedBadges);
      saveToFirebase(user.uid, newModules, updatedBadges, solvedProblems, streak);
    }
    setCurrentView('dashboard');
    setSelectedModuleId(null);
  };

  const handleQuizComplete = (score: number, total: number) => {
    if (score === total) {
      earnBadge('q1');
    }
  };

  if (isAuthLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background-dark">
        <div className="flex flex-col items-center">
          <div className="size-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-primary font-black uppercase tracking-widest text-xs">Loading Quest...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background-dark font-display p-6 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none overflow-hidden">
           <div className="absolute top-[10%] left-[20%] text-primary/40"><span className="material-symbols-outlined text-9xl">terminal</span></div>
           <div className="absolute bottom-[20%] right-[10%] text-primary/40"><span className="material-symbols-outlined text-[150px]">code</span></div>
           <div className="absolute top-[40%] right-[30%] text-primary/40 rotate-12"><span className="material-symbols-outlined text-[120px]">psychology</span></div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[48px] shadow-2xl border-4 border-primary/20 max-w-md w-full text-center relative z-10 animate-in zoom-in duration-500">
          <div className="size-24 rounded-[32px] bg-primary flex items-center justify-center text-slate-900 shadow-xl shadow-primary/30 mx-auto mb-10 rotate-3">
            <span className="material-symbols-outlined text-6xl font-black">rocket_launch</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tighter">CodeQuest</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mb-12">Level Up Your Coding Skills</p>
          
          <div className="space-y-4">
            <button 
              onClick={handleGoogleLogin}
              className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white py-4 px-6 rounded-2xl font-black text-lg border-2 border-slate-100 dark:border-slate-700 shadow-xl flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/pwa/google.svg" className="size-6" alt="Google" />
              Gmail-ээр нэвтрэх
            </button>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Таны бүх ахиц дэвшлийг Gmail-д тань <br/>автоматаар хадгална.</p>
          </div>
        </div>
      </div>
    );
  }

  const activeProblem = selectedProblemId ? PROBLEMS.find(p => p.id === selectedProblemId) : null;

  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
      {currentView !== 'lesson' && currentView !== 'solving-problem' && currentView !== 'quiz' && (
        <Sidebar 
          activeItem={currentView} 
          streak={streak} 
          userName={user.displayName || user.email?.split('@')[0] || "Hero"}
          isSyncing={isSyncing}
          onNavChange={(v) => setCurrentView(v as any)} 
          onLogout={handleLogout}
        />
      )}
      
      <main className="flex-1 flex flex-col overflow-hidden">
        {currentView === 'dashboard' ? (
          <Dashboard 
            modules={modules} 
            badges={badges}
            onStartLesson={(id) => { setSelectedModuleId(id); setCurrentView('lesson'); }} 
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
        ) : currentView === 'problems' ? (
          <ProblemBank 
            onSelectProblem={(id) => { setSelectedProblemId(id); setCurrentView('solving-problem'); }} 
            solvedProblems={solvedProblems} 
          />
        ) : currentView === 'solving-problem' && activeProblem ? (
          <ProblemSolvingView 
            problem={activeProblem} 
            onBack={() => setCurrentView('problems')}
            onSolve={handleSolveProblem}
          />
        ) : currentView === 'quiz' ? (
          <QuizView 
            user={user.uid}
            onBack={() => setCurrentView('dashboard')} 
            onComplete={handleQuizComplete}
          />
        ) : currentView === 'badges' ? (
          <div className="flex-1 overflow-y-auto p-10 bg-[#f8faf9] dark:bg-[#0d1a13]">
             <header className="mb-10 flex items-center justify-between">
                <div>
                  <button onClick={() => setCurrentView('dashboard')} className="flex items-center gap-2 text-slate-500 font-black uppercase text-xs tracking-widest mb-2 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-sm">arrow_back</span> Буцах
                  </button>
                  <h1 className="text-4xl font-black tracking-tighter">Миний Цолнууд</h1>
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
