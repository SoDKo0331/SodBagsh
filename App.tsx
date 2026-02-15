
import React, { useState, useEffect } from 'react';
import * as firebaseApp from "firebase/app";
import * as firestore from "firebase/firestore";
import * as firebaseAuth from "firebase/auth";

import Sidebar from './components/Sidebar';
import Dashboard from './views/Dashboard';
import LessonView from './views/LessonView';
import Sandbox from './views/Sandbox';
import ProblemBank from './views/ProblemBank';
import ProblemSolvingView from './views/ProblemSolvingView';
import QuizView from './views/QuizView';
import GameView from './views/GameView';
import BadgesView from './views/BadgesView';
import { LessonStatus, Module, Badge, UserProfile, UserProgress } from './types';
import { FirebaseService } from './services/FirebaseService';
import { PROBLEMS } from './data/problems';
import { PYTHON_QUIZ, C_QUIZ } from './data/quizzes';

const firebaseConfig = {
  apiKey: "AIzaSyBZ3yL48P81whM5OTJbsoN3YgM1mHRRXxQ",
  authDomain: "fluttershop-4c9e0.firebaseapp.com",
  projectId: "fluttershop-4c9e0",
  storageBucket: "fluttershop-4c9e0.firebasestorage.app",
  messagingSenderId: "976865178982",
  appId: "1:976865178982:web:f1022d04f08ef9dd1504a7",
};

let db: firestore.Firestore;
let auth: firebaseAuth.Auth;

try {
  const app = firebaseApp.initializeApp(firebaseConfig);
  db = firestore.getFirestore(app);
  auth = firebaseAuth.getAuth(app);
} catch (e) {
  console.warn("Firebase initialization failed, falling back to local mode.");
}

const MODULE_DEFINITIONS: Module[] = [
  { id: 'm1', number: 1, title: 'LEVEL 1: Эхлэл', description: 'Код гэж юу вэ? Хамгийн анхны тушаал.', isPremium: false, icon: 'campaign', badgeId: 'b1' },
  { id: 'm2', number: 2, title: 'LEVEL 1: Хувьсагч', description: 'Мэдээллийг хайрцаглаж хадгалах нь.', isPremium: false, icon: 'inventory_2', badgeId: 'b2' },
  { id: 'm6', number: 3, title: 'LEVEL 4: OOP', description: 'Класс ба Объект. Программчлалын шинэ ертөнц.', isPremium: true, icon: 'category', badgeId: 'b3' },
  { id: 'm9', number: 4, title: 'LEVEL 6: Data Structures', description: 'Linked Lists болон Pointer-ийн ид шид.', isPremium: true, icon: 'link', badgeId: 'b4' }
];

const INITIAL_BADGES: Badge[] = [
  { id: 'b1', title: 'Анхны алхам', description: 'Эхний хичээлийг дуусгав.', icon: 'rocket_launch', color: 'bg-blue-500', isEarned: false },
  { id: 'b2', title: 'Хайрцаглагч', description: 'Хувьсагчийн тухай сурав.', icon: 'inventory_2', color: 'bg-yellow-500', isEarned: false },
  { id: 'b3', title: 'Класс Мастер', description: 'OOP үндсийг сурав.', icon: 'category', color: 'bg-purple-500', isEarned: false },
  { id: 'b4', title: 'Холбогч', description: 'Linked List-ыг эзэмшив.', icon: 'link', color: 'bg-primary', isEarned: false },
  { id: 'b5', title: 'Асуудал шийдэгч', description: 'Анхны бодлогоо амжилттай бодов.', icon: 'task_alt', color: 'bg-emerald-500', isEarned: false },
  { id: 'b6', title: 'Кодны дайчин', description: '10 бодлого амжилттай бодов.', icon: 'military_tech', color: 'bg-orange-500', isEarned: false },
  { id: 'b7', title: 'Алгоритмч', description: '50 бодлого амжилттай бодов.', icon: 'precision_manufacturing', color: 'bg-rose-500', isEarned: false },
  { id: 'b8', title: 'Аренагийн баатар', description: 'Game Arena-д анхны ялалтаа авав.', icon: 'swords', color: 'bg-indigo-500', isEarned: false },
  { id: 'b9', title: 'Системийн Архитектор', description: 'Системийн боссыг ялж чадлаа.', icon: 'terminal', color: 'bg-slate-800', isEarned: false },
  { id: 'b10', title: 'Туршигч', description: 'Sandbox ашиглан код туршиж үзэв.', icon: 'science', color: 'bg-cyan-500', isEarned: false },
  { id: 'b11', title: '7 Хоногийн Стрик', description: 'Долоо хоног тасралтгүй суралцав.', icon: 'local_fire_department', color: 'bg-orange-600', isEarned: false },
  { id: 'b12', title: 'Сарны кодлогч', description: '30 хоног тасралтгүй суралцав.', icon: 'calendar_month', color: 'bg-blue-800', isEarned: false },
  { id: 'b13', title: 'Онц сурлагатан', description: 'Тестээс 100% оноо авав.', icon: 'school', color: 'bg-amber-400', isEarned: false },
  { id: 'b14', title: 'Python Мэргэжилтэн', description: 'Python замыг бүрэн дуусгав.', icon: 'language', color: 'bg-sky-600', isEarned: false },
  { id: 'b15', title: 'C++ Инженер', description: 'C++ замыг бүрэн дуусгав.', icon: 'settings_ethernet', color: 'bg-blue-400', isEarned: false },
  { id: 'b16', title: 'XP Баян', description: 'Нийт 5000-аас дээш XP цуглуулав.', icon: 'diamond', color: 'bg-violet-600', isEarned: false },
];

const App: React.FC = () => {
  const [user, setUser] = useState<{ uid: string; email: string | null } | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [solvedProblemIds, setSolvedProblemIds] = useState<string[]>([]);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isLocalSession, setIsLocalSession] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  
  const [currentView, setCurrentView] = useState<'dashboard' | 'lesson' | 'sandbox' | 'badges' | 'problems' | 'solving-problem' | 'quiz' | 'game'>('dashboard');
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [selectedProblemId, setSelectedProblemId] = useState<string | null>(null);
  const [preferredLanguage, setPreferredLanguage] = useState<'python' | 'c' | 'cpp'>('python');

  useEffect(() => {
    const localUser = localStorage.getItem('cq_local_user');
    if (localUser) {
      const parsed = JSON.parse(localUser);
      setUser(parsed);
      setIsLocalSession(true);
      setIsAuthLoading(false);
      return;
    }

    if (!auth) {
      setIsAuthLoading(false);
      return;
    }

    return firebaseAuth.onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser({ uid: u.uid, email: u.email });
        setIsLocalSession(false);
      } else {
        setUser(null);
      }
      setIsAuthLoading(false);
    });
  }, []);

  useEffect(() => {
    if (user) {
      const syncData = async () => {
        try {
          let p: UserProfile | null = null;
          let pr: UserProgress[] = [];
          
          if (!isLocalSession && db) {
            p = await FirebaseService.getUserProfile(db, user.uid);
            pr = await FirebaseService.getUserProgress(db, user.uid);
            const solvedSnap = await firestore.getDocs(firestore.collection(db, "users", user.uid, "solvedProblems"));
            const sIds = solvedSnap.docs.map(doc => doc.id);
            setSolvedProblemIds(sIds);
          } else {
            const savedProfile = localStorage.getItem(`cq_profile_${user.uid}`);
            const savedProgress = localStorage.getItem(`cq_progress_${user.uid}`);
            const savedSolved = localStorage.getItem(`cq_solved_${user.uid}`);
            p = savedProfile ? JSON.parse(savedProfile) : null;
            pr = savedProgress ? JSON.parse(savedProgress) : [];
            setSolvedProblemIds(savedSolved ? JSON.parse(savedSolved) : []);
          }

          if (p) {
            setProfile(p);
            setProgress(pr);
          } else {
            const newProfile: UserProfile = {
              uid: user.uid,
              email: user.email || "guest@codequest.local",
              role: 'student',
              subscriptionStatus: 'pro',
              xp: 0,
              streak: 1,
              lastActive: new Date().toISOString()
            };
            
            if (!isLocalSession && db) {
              await firestore.setDoc(firestore.doc(db, "users", user.uid), newProfile);
            } else {
              localStorage.setItem(`cq_profile_${user.uid}`, JSON.stringify(newProfile));
            }
            setProfile(newProfile);
          }
        } catch (err) {
          console.error("Sync error:", err);
        }
      };
      syncData();
    }
  }, [user, isLocalSession]);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail || !authPassword) return;
    setIsAuthLoading(true);
    setAuthError(null);

    try {
      if (authMode === 'login') {
        await firebaseAuth.signInWithEmailAndPassword(auth, authEmail, authPassword);
      } else {
        await firebaseAuth.createUserWithEmailAndPassword(auth, authEmail, authPassword);
      }
    } catch (err: any) {
      switch (err.code) {
        case 'auth/invalid-credential': setAuthError('Нэвтрэх нэр эсвэл нууц үг буруу байна.'); break;
        case 'auth/email-already-in-use': setAuthError('Энэ имэйл хаяг аль хэдийн бүртгэгдсэн байна.'); break;
        case 'auth/weak-password': setAuthError('Нууц үг хэтэрхий богино байна.'); break;
        default: setAuthError('Алдаа гарлаа. Дахин оролдоно уу.');
      }
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setIsAuthLoading(true);
    try {
      await firebaseAuth.signInAnonymously(auth);
    } catch (err: any) {
      const guestId = `guest_${Math.random().toString(36).substr(2, 9)}`;
      const guestUser = { uid: guestId, email: "local.hero@quest.com" };
      localStorage.setItem('cq_local_user', JSON.stringify(guestUser));
      setUser(guestUser);
      setIsLocalSession(true);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleLogout = () => {
    if (isLocalSession) {
      localStorage.removeItem('cq_local_user');
      setUser(null);
    } else if (auth) {
      firebaseAuth.signOut(auth);
    }
  };

  const handleStartLesson = (mid: string) => {
    setSelectedModuleId(mid);
    setCurrentView('lesson');
  };

  const handleLessonExit = async (completed?: boolean) => {
    if (completed && selectedModuleId && user && profile) {
      const xpGain = 150;
      if (!isLocalSession && db) {
        await FirebaseService.updateProgress(db, user.uid, selectedModuleId, LessonStatus.COMPLETED, xpGain, profile.email);
      } else {
        const newProgress = [...progress.filter(p => p.moduleId !== selectedModuleId), {
          moduleId: selectedModuleId,
          status: LessonStatus.COMPLETED,
          completedSteps: 10,
          lastAttempted: new Date().toISOString()
        }];
        const newProfile = { ...profile, xp: profile.xp + xpGain };
        localStorage.setItem(`cq_progress_${user.uid}`, JSON.stringify(newProgress));
        localStorage.setItem(`cq_profile_${user.uid}`, JSON.stringify(newProfile));
        setProgress(newProgress);
        setProfile(newProfile);
      }
    }
    setCurrentView('dashboard');
    setSelectedModuleId(null);
  };

  const handleProblemSelect = (pid: string) => {
    setSelectedProblemId(pid);
    setCurrentView('solving-problem');
  };

  const handleProblemSolved = async (pid: string) => {
    if (user && profile) {
      if (!isLocalSession && db) {
        await FirebaseService.recordSubmission(db, user.uid, pid, "// SOLVED", preferredLanguage, true);
      } else {
        const newSolved = [...new Set([...solvedProblemIds, pid])];
        setSolvedProblemIds(newSolved);
        localStorage.setItem(`cq_solved_${user.uid}`, JSON.stringify(newSolved));
        const newProfile = { ...profile, xp: profile.xp + 300 };
        localStorage.setItem(`cq_profile_${user.uid}`, JSON.stringify(newProfile));
        setProfile(newProfile);
      }
    }
  };

  const handleQuizComplete = async (score: number, total: number) => {
    if (user && profile) {
      const isPerfect = score === total;
      const xpGain = Math.round((score / total) * 500);
      if (!isLocalSession && db) {
        await FirebaseService.updateProgress(db, user.uid, 'quiz_attempt', LessonStatus.COMPLETED, xpGain, profile.email);
      } else {
        const newProfile = { 
          ...profile, 
          xp: profile.xp + xpGain,
          // Perfect score tracking for badge b13
          lastQuizPerfect: isPerfect 
        };
        localStorage.setItem(`cq_profile_${user.uid}`, JSON.stringify(newProfile));
        setProfile(newProfile);
      }
    }
  };

  const earnedBadges = INITIAL_BADGES.map(b => {
    let isEarned = false;
    
    // Logic for lesson badges (b1, b2, b3, b4)
    if (['b1', 'b2', 'b3', 'b4'].includes(b.id)) {
      isEarned = progress.some(p => p.status === LessonStatus.COMPLETED && MODULE_DEFINITIONS.find(m => m.id === p.moduleId)?.badgeId === b.id);
    }
    // Logic for problem solving badges
    else if (b.id === 'b5') isEarned = solvedProblemIds.length >= 1;
    else if (b.id === 'b6') isEarned = solvedProblemIds.length >= 10;
    else if (b.id === 'b7') isEarned = solvedProblemIds.length >= 50;
    // Logic for XP and Streaks
    else if (b.id === 'b11') isEarned = (profile?.streak || 0) >= 7;
    else if (b.id === 'b12') isEarned = (profile?.streak || 0) >= 30;
    else if (b.id === 'b16') isEarned = (profile?.xp || 0) >= 5000;
    // Quiz perfect score
    else if (b.id === 'b13') isEarned = (profile as any)?.lastQuizPerfect === true;

    return { ...b, isEarned };
  });

  return (
    <div className="flex h-screen overflow-hidden bg-background-dark font-display text-slate-100">
      {currentView !== 'lesson' && currentView !== 'solving-problem' && (
        <Sidebar 
          activeItem={currentView} 
          streak={profile?.streak || 0} 
          userName={profile?.email.split('@')[0] || "Hero"}
          isSyncing={!isLocalSession}
          onNavChange={(v) => setCurrentView(v as any)} 
          onLogout={handleLogout}
        />
      )}
      
      <main className="flex-1 flex flex-col overflow-hidden">
        {currentView === 'dashboard' && (
          <Dashboard 
            modules={MODULE_DEFINITIONS.map(m => ({...m, status: progress.find(p => p.moduleId === m.id)?.status || LessonStatus.LOCKED}))} 
            badges={earnedBadges}
            onStartLesson={handleStartLesson} 
            activePath={preferredLanguage}
            onPathChange={setPreferredLanguage}
            onViewBadges={() => setCurrentView('badges')}
            userXP={profile?.xp}
          />
        )}
        {currentView === 'lesson' && (
          <LessonView 
            onExit={handleLessonExit} 
            moduleId={selectedModuleId} 
            initialLanguage={preferredLanguage}
            onLanguageChange={setPreferredLanguage}
          />
        )}
        {currentView === 'sandbox' && (
          <Sandbox onBack={() => setCurrentView('dashboard')} />
        )}
        {currentView === 'problems' && (
          <ProblemBank onSelectProblem={handleProblemSelect} solvedProblems={solvedProblemIds} />
        )}
        {currentView === 'solving-problem' && PROBLEMS.find(p => p.id === selectedProblemId) && (
          <ProblemSolvingView 
            problem={PROBLEMS.find(p => p.id === selectedProblemId)!} 
            onBack={() => setCurrentView('problems')} 
            onSolve={handleProblemSolved} 
          />
        )}
        {currentView === 'quiz' && (
          <QuizView 
            user={user.uid} 
            quizData={preferredLanguage === 'python' ? PYTHON_QUIZ : C_QUIZ} 
            onBack={() => setCurrentView('dashboard')} 
            onComplete={handleQuizComplete} 
          />
        )}
        {currentView === 'game' && (
          <GameView 
            user={user as any} 
            onBack={() => setCurrentView('dashboard')} 
            onEarnBadge={(bid) => console.log("Earned badge:", bid)} 
            initialLanguage={preferredLanguage === 'c' ? 'cpp' : preferredLanguage}
          />
        )}
        {currentView === 'badges' && (
          <BadgesView badges={earnedBadges} onBack={() => setCurrentView('dashboard')} />
        )}
      </main>
    </div>
  );
};

export default App;
