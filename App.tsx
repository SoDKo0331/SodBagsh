
import React, { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, onSnapshot } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut, User } from "firebase/auth";
import Sidebar from './components/Sidebar';
import Dashboard from './views/Dashboard';
import LessonView from './views/LessonView';
import Sandbox from './views/Sandbox';
import ProblemBank from './views/ProblemBank';
import ProblemSolvingView from './views/ProblemSolvingView';
import QuizView from './views/QuizView';
import GameView from './views/GameView';
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

const INITIAL_MODULES: Module[] = [
  { id: 'm1', number: 1, title: 'LEVEL 1: Эхлэл', description: 'Код гэж юу вэ? Хамгийн анхны тушаалаа компьютерт өгье.', status: LessonStatus.IN_PROGRESS, progressText: '0/2 Алхам', icon: 'campaign', badgeId: 'b1' },
  { id: 'm2', number: 2, title: 'LEVEL 1: Хувьсагч', description: 'Мэдээллийг хэрхэн хайрцаглаж хадгалах вэ?', status: LessonStatus.LOCKED, icon: 'inventory_2', badgeId: 'b2' },
  { id: 'm3', number: 3, title: 'LEVEL 1: IF/ELSE', description: 'Компьютер хэрхэн шийдвэр гаргадаг вэ? Logic сурцгаая.', status: LessonStatus.LOCKED, icon: 'alt_route', badgeId: 'b3' },
  { id: 'm4', number: 4, title: 'LEVEL 2: Давталт', description: 'Уйтгартай ажлыг 100 удаа хийх хэрэггүй боллоо.', status: LessonStatus.LOCKED, icon: 'rebase_edit' },
  { id: 'm5', number: 5, title: 'LEVEL 3: Массив', description: 'Олон өгөгдлийг нэг дор хадгалж сурна.', status: LessonStatus.LOCKED, icon: 'database' },
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
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const [modules, setModules] = useState<Module[]>(INITIAL_MODULES);
  const [badges, setBadges] = useState<Badge[]>(INITIAL_BADGES);
  const [solvedProblems, setSolvedProblems] = useState<string[]>([]);
  const [streak, setStreak] = useState(1);
  const [currentView, setCurrentView] = useState<'dashboard' | 'lesson' | 'sandbox' | 'badges' | 'problems' | 'solving-problem' | 'quiz' | 'game'>('dashboard');
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [selectedProblemId, setSelectedProblemId] = useState<string | null>(null);
  const [preferredLanguage, setPreferredLanguage] = useState<'python' | 'c' | 'cpp'>('python');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

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

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!email || !password) {
      setAuthError("И-мэйл болон нууц үгээ оруулна уу.");
      return;
    }

    try {
      if (authMode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (error: any) {
      console.error("Auth error", error);
      let msg = "Алдаа гарлаа.";
      if (error.code === 'auth/invalid-credential') {
        msg = "И-мэйл эсвэл нууц үг буруу байна.";
      } else if (error.code === 'auth/email-already-in-use') {
        msg = "Энэ и-мэйл хаяг аль хэдийн бүртгэлтэй байна. Нэвтрэх хэсгийг ашиглана уу.";
      }
      setAuthError(msg);
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
      const newModules = modules.map(m => {
        if (m.id === selectedModuleId) return { ...m, status: LessonStatus.COMPLETED };
        const finishedIdx = modules.findIndex(mod => mod.id === selectedModuleId);
        const nextIdx = finishedIdx + 1;
        if (modules[nextIdx] && modules[nextIdx].id === m.id && m.status === LessonStatus.LOCKED) {
            return { ...m, status: LessonStatus.IN_PROGRESS };
        }
        return m;
      });
      setModules(newModules);
      saveToFirebase(user.uid, newModules, badges, solvedProblems, streak);
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
    return <div className="h-screen w-full flex items-center justify-center bg-background-dark text-primary">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background-dark font-display p-6 overflow-hidden relative text-center">
        <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[48px] shadow-2xl border-4 border-primary/20 max-w-md w-full relative z-10">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tighter">CodeQuest</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mb-8">
            {authMode === 'login' ? 'Тавтай морилно уу' : 'Шинэ аялал эхлүүлцгээе'}
          </p>
          
          <form onSubmit={handleAuth} className="space-y-4">
            {authError && <div className="bg-red-500/10 text-red-500 p-4 rounded-2xl text-xs font-bold">{authError}</div>}
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border-2 rounded-2xl px-6 py-4 font-bold outline-none"
              placeholder="Email"
              required
            />
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border-2 rounded-2xl px-6 py-4 font-bold outline-none"
              placeholder="Password"
              required
            />
            <button type="submit" className="w-full bg-primary text-slate-900 py-4 rounded-2xl font-black text-lg uppercase tracking-widest">
              {authMode === 'login' ? 'Нэвтрэх' : 'Бүртгүүлэх'}
            </button>
          </form>

          <div className="mt-8">
             <button onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')} className="text-primary font-black uppercase tracking-widest text-xs">
                {authMode === 'login' ? 'Бүртгүүлэх' : 'Нэвтрэх'}
             </button>
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
        ) : currentView === 'game' ? (
          <GameView onBack={() => setCurrentView('dashboard')} />
        ) : (
          <Sandbox onBack={() => setCurrentView('dashboard')} />
        )}
      </main>
    </div>
  );
};

export default App;
