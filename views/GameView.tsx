
import React, { useState, useEffect, useRef } from 'react';
import type { User } from "firebase/auth";

interface GameViewProps {
  user: User;
  onBack: () => void;
  onEarnBadge: (badgeId: string) => void;
  initialLanguage?: 'python' | 'cpp';
}

type GameMode = 'raid' | 'bug-hunter';
type PlayerClass = 'knight' | 'mage' | 'rogue' | 'techno';
type ProgrammingLanguage = 'python' | 'cpp';
type LogType = 'player' | 'boss' | 'system' | 'success' | 'ability';

interface GameLog {
  id: string;
  msg: string;
  type: LogType;
  timestamp: string;
}

interface Question {
  q: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface BugFix {
  code: string;
  options: string[];
  correct: number;
  description: string;
}

const BATTLE_QUESTIONS: Record<ProgrammingLanguage, Question[]> = {
  python: [
    { q: "print(type([])) юу буцаах вэ?", options: ["<class 'list'>", "<class 'tuple'>", "<class 'array'>", "Алдаа"], correct: 0, explanation: "[] бол Python-ийн list төрөл юм." },
    { q: "x = [1, 2] * 2; print(x) юу хэвлэх вэ?", options: ["[2, 4]", "[1, 2, 1, 2]", "[1, 1, 2, 2]", "Алдаа"], correct: 1, explanation: "List-ийг тоогоор үржихэд элементүүд нь давтагдана." },
    { q: "Python-д 2-ын 3 зэргийг яаж тооцох вэ?", options: ["2 ^ 3", "2 ** 3", "pow(2, 3)", "b ба c хоёулаа"], correct: 3, explanation: "** болон pow() функц хоёулаа зэрэг дэвшүүлнэ." },
    { q: "range(1, 5) функц ямар утгуудыг үүсгэх вэ?", options: ["1, 2, 3, 4, 5", "1, 2, 3, 4", "0, 1, 2, 3, 4", "1, 5"], correct: 1, explanation: "Range-ийн төгсгөлийн тоо орохгүй." },
    { q: "input() функц ямар төрлийн өгөгдөл буцаадаг вэ?", options: ["int", "float", "string", "bool"], correct: 2, explanation: "input() функц хэрэглэгчийн оруулсан утгыг үргэлж тэмдэгт мөр (string) болгож авдаг." }
  ],
  cpp: [
    { q: "C++ хэлэнд дэлгэц рүү хэвлэх стандарт объект аль нь вэ?", options: ["printf", "std::cout", "print", "console.log"], correct: 1, explanation: "iostream сангийн std::cout нь стандарт гаралт юм." },
    { q: "int* p; гэж юуг зарлаж байна вэ?", options: ["Бүхэл тоо", "Зангилаа", "Хаяг заагч (Pointer)", "Массив"], correct: 2, explanation: "* тэмдэг нь заагч хувьсагвч зарлахад ашиглагддаг." },
    { q: "std::vector<int> v; v.push_back(5); v.size() хэд вэ?", options: ["0", "1", "5", "Алдаа"], correct: 1, explanation: "push_back нь нэг элемент нэмэх тул хэмжээ нь 1 болно." },
    { q: "C++-д мөрийн төгсгөлд юу бичих ёстой вэ?", options: [".", ":", ";", "Enter"], correct: 2, explanation: "Statement бүрийн ард цэгтэй таслал (;) заавал байх ёстой." },
    { q: "bool b = (10 > 5); b-ийн утга юу vэ?", options: ["1", "0", "true", "A ба C хоёулаа"], correct: 3, explanation: "10 > 5 нь true (эсвэл 1) утгатай." }
  ]
};

const BUG_FIXES: Record<ProgrammingLanguage, BugFix[]> = {
  python: [
    { code: "print \"Hello World\"", options: ["Add parentheses ()", "Use single quotes", "Remove quotes", "No error"], correct: 0, description: "Python 3 requires print() as a function." },
    { code: "if x = 10:\n    print(x)", options: ["Remove colon :", "Use == for comparison", "Add indent", "Change if to while"], correct: 1, description: "Assignment '=' cannot be used inside 'if' condition." },
    { code: "for i in 10:\n    print(i)", options: ["Change in to =", "Remove i", "Use range(10)", "Add brackets"], correct: 2, description: "Integer is not iterable, range() is needed." }
  ],
  cpp: [
    { code: "#include <iostream>\n\nint main() {\n    cout << \"Hello\";\n    return 0;\n}", options: ["Add using namespace std;", "Change cout to print", "Add ; after main()", "Remove return"], correct: 0, description: "cout resides in the std namespace." },
    { code: "int x = 5\nstd::cout << x;", options: ["Add quotes to x", "Add ; after 5", "Change x to string", "Add include <string>"], correct: 1, description: "C++ statements must end with a semicolon." },
    { code: "int x = \"5\";", options: ["Change int to string", "Remove quotes", "Add ;", "Both A and B"], correct: 3, description: "Cannot assign a string literal to an integer variable." },
    { code: "#include <iostream>\n\nint main() {\n    int v = {1, 2};\n    return 0;\n}", options: ["Change int to std::vector<int>", "Remove braces {}", "Add std::list", "No error"], correct: 0, description: "Initializer lists require collection types like vector." },
    { code: "void main() {\n    std::cout << \"Test\";\n}", options: ["Change void to int", "Add return 0;", "Add #include <stdio.h>", "A and B"], correct: 3, description: "Standard C++ requires main to return int." }
  ]
};

const CLASSES: Record<PlayerClass, { name: string; hp: number; dmg: number; icon: string; color: string; ability: string; abilityDesc: string }> = {
  knight: { name: 'Code Knight', hp: 220, dmg: 20, icon: 'shield', color: 'text-blue-400', ability: 'Hard Disk Shield', abilityDesc: 'Next boss hit deals -80% damage.' },
  mage: { name: 'Logic Mage', hp: 110, dmg: 55, icon: 'magic_button', color: 'text-purple-400', ability: 'Logic Burst', abilityDesc: 'Next hit deals 2x damage.' },
  rogue: { name: 'Syntax Rogue', hp: 135, dmg: 35, icon: 'bolt', color: 'text-yellow-400', ability: 'Dodge Trace', abilityDesc: '50% chance to avoid next hit.' },
  techno: { name: 'AI Techno', hp: 165, dmg: 28, icon: 'memory', color: 'text-primary', ability: 'Self Repair', abilityDesc: 'Recover 60 HP instantly.' }
};

const BOSS = { name: 'The System Architect', hp: 600, maxHp: 600, dmg: 40, icon: 'token' };

const GameView: React.FC<GameViewProps> = ({ user, onBack, onEarnBadge, initialLanguage = 'python' }) => {
  const [view, setView] = useState<'setup' | 'hero' | 'battle' | 'bug-fix' | 'result'>('setup');
  const [gameMode, setGameMode] = useState<GameMode>('raid');
  const [selectedLang, setSelectedLang] = useState<ProgrammingLanguage>(initialLanguage);
  const [p1Class, setP1Class] = useState<PlayerClass>('knight');
  
  const [playerHp, setPlayerHp] = useState(100);
  const [playerMana, setPlayerMana] = useState(0);
  const [bossHp, setBossHp] = useState(BOSS.hp);
  const [turn, setTurn] = useState<'player' | 'boss'>('player');
  const [qIdx, setQIdx] = useState(0);
  const [isShieldActive, setIsShieldActive] = useState(false);
  const [isBurstActive, setIsBurstActive] = useState(false);
  const [isShaking, setIsShaking] = useState<'player' | 'boss' | null>(null);

  const [timer, setTimer] = useState(60);
  const [bugIdx, setBugIdx] = useState(0);
  const [score, setScore] = useState(0);

  const [feedback, setFeedback] = useState<{msg: string, type: 'good' | 'bad' | 'ability'} | null>(null);
  const [logs, setLogs] = useState<GameLog[]>([]);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  useEffect(() => {
    let interval: any;
    if (view === 'bug-fix' && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    } else if (timer === 0 && view === 'bug-fix') {
      setView('result');
      addLog("⚠️ SYSTEM: Scan timeout. Integrity check failed.", "system");
    }
    return () => clearInterval(interval);
  }, [view, timer]);

  const addLog = (msg: string, type: LogType) => {
    setLogs(prev => [
      ...prev,
      {
        id: Math.random().toString(36).substring(7),
        msg,
        type,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      }
    ].slice(-50));
  };

  const handleInitializeArena = () => {
    setLogs([]);
    addLog(`[SYS] Initializing ${gameMode.toUpperCase()} | STACK: ${selectedLang.toUpperCase()}`, "system");
    if (gameMode === 'raid') {
      setView('hero');
    } else {
      startBugHunter();
    }
  };

  const startBattle = () => {
    const hero = CLASSES[p1Class];
    setPlayerHp(hero.hp);
    setPlayerMana(0);
    setBossHp(BOSS.hp);
    setTurn('player');
    setIsShieldActive(false);
    setIsBurstActive(false);
    setQIdx(Math.floor(Math.random() * BATTLE_QUESTIONS[selectedLang].length));
    addLog(`[USER] ${hero.name.toUpperCase()} HAS ENTERED THE MAIN FRAME.`, "player");
    addLog(`[BOSS] ${BOSS.name.toUpperCase()} IS ONLINE. FIREWALLS ACTIVE.`, "boss");
    setView('battle');
  };

  const startBugHunter = () => {
    setTimer(60);
    setScore(0);
    setBugIdx(Math.floor(Math.random() * BUG_FIXES[selectedLang].length));
    setFeedback(null);
    addLog("[SYS] DEBUGGER ATTACHED. COMMENCING VULNERABILITY SCAN.", "system");
    setView('bug-fix');
  };

  const handleBattleAnswer = (idx: number) => {
    if (turn !== 'player' || feedback) return;

    const currentQuestion = BATTLE_QUESTIONS[selectedLang][qIdx];
    const correct = idx === currentQuestion.correct;
    let pDmg = CLASSES[p1Class].dmg;
    
    if (correct) {
      if (isBurstActive) {
        pDmg *= 2;
        setIsBurstActive(false);
        addLog("[ABILITY] LOGIC BURST: OVERCLOCKING SYSTEM. 200% DAMAGE OUTPUT.", "ability");
      }

      const newBossHp = Math.max(0, bossHp - pDmg);
      setBossHp(newBossHp);
      setPlayerMana(m => Math.min(100, m + 40));
      setFeedback({ msg: `SUCCESS! -${pDmg} DMG`, type: 'good' });
      setIsShaking('boss');
      addLog(`[USER] EXECUTING ATTACK: ${pDmg} DAMAGE DEALT. [BOSS HP: ${newBossHp}/${BOSS.maxHp}]`, "player");
      
      if (newBossHp <= 0) {
        addLog("[SUCCESS] CORE BREACH SUCCESSFUL. SYSTEM ARCHITECT TERMINATED.", "success");
        onEarnBadge(`raid_${p1Class}_${selectedLang}`);
        setTimeout(() => setView('result'), 1200);
        return;
      }

      setTimeout(() => {
        setFeedback(null);
        setIsShaking(null);
        setQIdx(Math.floor(Math.random() * BATTLE_QUESTIONS[selectedLang].length));
      }, 1000);

    } else {
      setFeedback({ msg: "COMPILE ERROR!", type: 'bad' });
      addLog("[SYS] SYNTAX ERROR DETECTED. HERO STUNNED DURING RE-COMPILATION.", "system");
      setTurn('boss');
      setTimeout(() => {
        setFeedback(null);
        setIsShaking(null);
        bossAction();
      }, 1500);
    }
  };

  const useAbility = () => {
    if (playerMana < 100 || turn !== 'player' || feedback) return;
    setPlayerMana(0);
    const hero = CLASSES[p1Class];
    addLog(`[ABILITY] ACTIVATING PROTOCOL: ${hero.ability.toUpperCase()}`, "ability");
    setFeedback({ msg: hero.ability.toUpperCase(), type: 'ability' });
    
    if (p1Class === 'knight') {
      setIsShieldActive(true);
      addLog("[ABILITY] DEFENSIVE STACK INITIALIZED: 80% DAMAGE REDUCTION.", "ability");
    }
    if (p1Class === 'mage') {
      setIsBurstActive(true);
      addLog("[ABILITY] LOGIC CACHE READY: NEXT HIT DAMAGE x2.", "ability");
    }
    if (p1Class === 'techno') {
      const heal = 60;
      setPlayerHp(h => Math.min(CLASSES.techno.hp, h + heal));
      addLog(`[ABILITY] REPAIR BOT ACTIVE: +${heal} HP RESTORED. [HP: ${Math.min(CLASSES.techno.hp, playerHp + heal)}/${hero.hp}]`, "ability");
    }
    setTimeout(() => setFeedback(null), 1000);
  };

  const bossAction = () => {
    let dmg = BOSS.dmg;
    const hero = CLASSES[p1Class];
    
    if (isShieldActive) {
      const mitigated = Math.floor(dmg * 0.8);
      dmg = dmg - mitigated;
      setIsShieldActive(false);
      addLog(`[ABILITY] HARD DISK SHIELD ABSORBED ${mitigated} DAMAGE.`, "ability");
    }

    const newPlayerHp = Math.max(0, playerHp - dmg);
    setPlayerHp(newPlayerHp);
    setIsShaking('player');
    setFeedback({ msg: `HIT! -${dmg} HP`, type: 'bad' });
    addLog(`[BOSS] ${BOSS.name.toUpperCase()} USED SYSTEM FLUSH: ${dmg} DAMAGE DEALT. [PLAYER HP: ${newPlayerHp}/${hero.hp}]`, "boss");

    setTimeout(() => {
      setFeedback(null);
      setIsShaking(null);
      if (newPlayerHp <= 0) {
        addLog("[BOSS] SESSION CLOSED. HERO CORE DELETED.", "boss");
        setView('result');
      } else {
        setTurn('player');
        setQIdx(Math.floor(Math.random() * BATTLE_QUESTIONS[selectedLang].length));
      }
    }, 1500);
  };

  const handleBugFix = (idx: number) => {
    if (feedback) return;
    const currentBug = BUG_FIXES[selectedLang][bugIdx];
    const correct = idx === currentBug.correct;
    
    if (correct) {
      const scoreGain = 200;
      setScore(s => s + scoreGain);
      setTimer(t => t + 4);
      setFeedback({ msg: "FIXED!", type: 'good' });
      addLog(`[SUCCESS] PATCH APPLIED: Fixed ${currentBug.description}. +${scoreGain} PTS.`, "success");
    } else {
      const penalty = 6;
      setTimer(t => Math.max(0, t - penalty));
      setFeedback({ msg: "CRASH!", type: 'bad' });
      addLog(`[SYS] FATAL ERROR: UNSTABLE PATCH. LOSS OF ${penalty} SECONDS.`, "system");
    }

    setTimeout(() => {
      setFeedback(null);
      setBugIdx(Math.floor(Math.random() * BUG_FIXES[selectedLang].length));
    }, 800);
  };

  const playerHpPercent = `${(playerHp / (CLASSES[p1Class]?.hp || 100)) * 100}%`;
  const bossHpPercent = `${(bossHp / BOSS.maxHp) * 100}%`;

  const getLogColor = (type: LogType) => {
    switch(type) {
      case 'player': return 'text-emerald-300 font-bold drop-shadow-[0_0_3px_rgba(16,185,129,0.5)]'; 
      case 'boss': return 'text-rose-400 font-bold drop-shadow-[0_0_3px_rgba(244,63,94,0.5)]'; 
      case 'ability': return 'text-cyan-200 italic drop-shadow-[0_0_3px_rgba(34,211,238,0.5)]'; 
      case 'success': return 'text-amber-300 font-black drop-shadow-[0_0_3px_rgba(251,191,36,0.5)]'; 
      case 'system': return 'text-slate-300 font-mono opacity-90'; 
      default: return 'text-slate-100';
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#050806] text-white font-display overflow-hidden relative select-none min-h-screen">
      <header className="h-16 md:h-20 border-b border-primary/20 flex items-center justify-between px-6 bg-black/80 backdrop-blur-xl shrink-0 z-30">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-primary/20 rounded-xl transition-all border border-white/10">
            <span className="material-symbols-outlined text-slate-400">arrow_back</span>
          </button>
          <h2 className="text-xl font-black italic uppercase text-primary tracking-tighter">Code Arena</h2>
        </div>
        <div className="flex items-center gap-6">
           {view === 'bug-fix' && (
              <div className="flex items-center gap-4">
                 <div className="text-center">
                    <p className="text-[10px] font-black text-slate-500 uppercase">Timer</p>
                    <p className={`text-xl font-black italic ${timer < 10 ? 'text-rose-500 animate-ping' : 'text-primary'}`}>{timer}s</p>
                 </div>
                 <div className="text-center">
                    <p className="text-[10px] font-black text-slate-500 uppercase">Score</p>
                    <p className="text-xl font-black italic text-white">{score}</p>
                 </div>
              </div>
           )}
           <div className="size-10 rounded-full border-2 border-primary bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">terminal</span>
           </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col p-8 relative z-20 max-w-7xl mx-auto w-full overflow-y-auto custom-scrollbar">
        {view === 'setup' && (
          <div className="flex-1 flex flex-col items-center justify-center animate-in zoom-in duration-500">
             <div className="text-center mb-12">
                <h1 className="text-6xl font-black italic mb-4 uppercase tracking-tighter">Mission Control</h1>
                <p className="text-slate-500 font-bold uppercase tracking-[0.6em] text-sm italic">Prepare your technology stack</p>
             </div>
             
             <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                   <h3 className="text-xs font-black uppercase text-primary tracking-[0.3em] ml-4 italic">Mission Type</h3>
                   <div className="grid grid-cols-1 gap-4">
                      <button 
                        onClick={() => setGameMode('raid')}
                        className={`p-10 rounded-[40px] border-4 transition-all text-left relative overflow-hidden group ${gameMode === 'raid' ? 'bg-primary/10 border-primary text-white shadow-[0_0_50px_rgba(19,236,128,0.2)]' : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/10'}`}
                      >
                         <div className="flex items-center gap-6 relative z-10">
                            <span className="material-symbols-outlined text-5xl">swords</span>
                            <div>
                               <h4 className="text-2xl font-black italic uppercase">Architect Raid</h4>
                               <p className="text-xs font-bold opacity-60">Strategic RPG combat</p>
                            </div>
                         </div>
                      </button>
                      <button 
                        onClick={() => setGameMode('bug-hunter')}
                        className={`p-10 rounded-[40px] border-4 transition-all text-left relative overflow-hidden group ${gameMode === 'bug-hunter' ? 'bg-rose-500/10 border-rose-500 text-white shadow-[0_0_50px_rgba(244,63,94,0.2)]' : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/10'}`}
                      >
                         <div className="flex items-center gap-6 relative z-10">
                            <span className="material-symbols-outlined text-5xl">bug_report</span>
                            <div>
                               <h4 className="text-2xl font-black italic uppercase">Bug Hunter</h4>
                               <p className="text-xs font-bold opacity-60">Fast-paced syntax fixing</p>
                            </div>
                         </div>
                      </button>
                   </div>
                </div>

                <div className="space-y-6">
                   <h3 className="text-xs font-black uppercase text-primary tracking-[0.3em] ml-4 italic">Technology Stack</h3>
                   <div className="grid grid-cols-1 gap-4">
                      <button 
                        onClick={() => setSelectedLang('python')}
                        className={`p-10 rounded-[40px] border-4 transition-all text-left relative overflow-hidden group ${selectedLang === 'python' ? 'bg-primary/10 border-primary text-white shadow-[0_0_50px_rgba(19,236,128,0.2)]' : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/10'}`}
                      >
                         <div className="flex items-center gap-6 relative z-10">
                            <div className="size-12 rounded-2xl bg-white/10 flex items-center justify-center font-black text-xl italic">PY</div>
                            <div>
                               <h4 className="text-2xl font-black italic uppercase">Python</h4>
                               <p className="text-xs font-bold opacity-60">Master the snake language</p>
                            </div>
                         </div>
                      </button>
                      <button 
                        onClick={() => setSelectedLang('cpp')}
                        className={`p-10 rounded-[40px] border-4 transition-all text-left relative overflow-hidden group ${selectedLang === 'cpp' ? 'bg-sky-500/10 border-sky-500 text-white shadow-[0_0_50px_rgba(56,189,248,0.2)]' : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/10'}`}
                      >
                         <div className="flex items-center gap-6 relative z-10">
                            <div className="size-12 rounded-2xl bg-white/10 flex items-center justify-center font-black text-xl italic">C++</div>
                            <div>
                               <h4 className="text-2xl font-black italic uppercase">C++</h4>
                               <p className="text-xs font-bold opacity-60">High-performance logic</p>
                            </div>
                         </div>
                      </button>
                   </div>
                </div>
             </div>

             <button 
               onClick={handleInitializeArena}
               className="mt-16 bg-primary text-slate-900 px-24 py-6 rounded-[40px] font-black text-3xl uppercase italic hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/30 flex items-center gap-4"
             >
                <span>Initialize Arena</span>
                <span className="material-symbols-outlined text-4xl">bolt</span>
             </button>
          </div>
        )}

        {view === 'hero' && (
          <div className="flex-1 flex flex-col items-center justify-center animate-in zoom-in duration-500">
             <h1 className="text-6xl font-black italic mb-16 uppercase tracking-tighter">Choose Your Hero</h1>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 w-full">
                {(Object.keys(CLASSES) as PlayerClass[]).map(c => (
                   <button key={c} onClick={() => setP1Class(c)} className={`p-10 rounded-[48px] border-4 transition-all flex flex-col items-center gap-6 ${p1Class === c ? 'bg-primary border-white text-slate-900 scale-105 shadow-2xl' : 'bg-white/5 border-white/5 text-slate-400 hover:border-white/20'}`}>
                      <span className={`material-symbols-outlined text-7xl ${p1Class === c ? 'text-slate-900' : CLASSES[c].color}`}>{CLASSES[c].icon}</span>
                      <div className="text-center">
                         <p className="font-black italic uppercase text-lg">{CLASSES[c].name}</p>
                         <p className={`text-[10px] font-black uppercase mt-2 ${p1Class === c ? 'text-slate-700' : 'text-slate-500'}`}>HP: {CLASSES[c].hp} | DMG: {CLASSES[c].dmg}</p>
                      </div>
                   </button>
                ))}
             </div>
             <div className="flex gap-4">
                <button onClick={() => setView('setup')} className="bg-white/5 border border-white/10 px-12 py-5 rounded-[32px] font-black text-xl uppercase italic">Back</button>
                <button onClick={startBattle} className="bg-primary text-slate-900 px-20 py-5 rounded-[32px] font-black text-xl uppercase italic hover:scale-105 transition-all shadow-2xl">Enter Arena</button>
             </div>
          </div>
        )}

        {(view === 'battle' || view === 'bug-fix') && (
          <div className="flex-1 flex flex-col lg:flex-row gap-8 overflow-hidden h-full">
             <div className="flex-1 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
                {view === 'battle' ? (
                  <>
                    <div className="flex justify-between items-center relative py-6">
                       <div className="flex flex-col items-center w-1/3 transition-all">
                          <div className={`size-32 md:size-44 rounded-[48px] bg-slate-900 border-4 ${turn === 'player' ? 'border-primary' : 'border-white/5'} flex items-center justify-center relative ${isShaking === 'player' ? 'animate-shake' : ''}`}>
                             <span className={`material-symbols-outlined text-[60px] md:text-[80px] ${CLASSES[p1Class].color}`}>{CLASSES[p1Class].icon}</span>
                             <div className="absolute -bottom-6 left-0 right-0 h-3 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-primary transition-all duration-500 shadow-[0_0_10px_rgba(19,236,128,0.5)]" style={{width: playerHpPercent}}></div>
                             </div>
                          </div>
                          <p className="mt-8 font-black italic uppercase text-[10px] tracking-widest">{CLASSES[p1Class].name}</p>
                       </div>
                       <div className="text-3xl md:text-5xl font-black italic text-slate-800">VS</div>
                       <div className="flex flex-col items-center w-1/3 transition-all">
                          <div className={`size-32 md:size-44 rounded-[48px] bg-rose-950/20 border-4 ${turn === 'boss' ? 'border-rose-500' : 'border-white/5'} flex items-center justify-center relative ${isShaking === 'boss' ? 'animate-shake' : ''}`}>
                             <span className="material-symbols-outlined text-[60px] md:text-[80px] text-rose-500">{BOSS.icon}</span>
                             <div className="absolute -bottom-6 left-0 right-0 h-3 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-rose-500 transition-all duration-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]" style={{width: bossHpPercent}}></div>
                             </div>
                          </div>
                          <p className="mt-8 font-black italic uppercase text-[10px] tracking-widest text-rose-500">{BOSS.name}</p>
                       </div>
                    </div>

                    <div className="bg-black/60 border-2 border-white/5 rounded-[32px] p-8 flex flex-col flex-1 relative min-h-[300px]">
                        {feedback ? (
                          <div className="flex-1 flex flex-col items-center justify-center text-center animate-in zoom-in">
                             <h5 className={`text-4xl font-black italic uppercase drop-shadow-lg ${
                                feedback.type === 'good' ? 'text-emerald-300' : 
                                feedback.type === 'ability' ? 'text-cyan-200' : 
                                'text-rose-400'
                             }`}>{feedback.msg}</h5>
                          </div>
                        ) : turn === 'boss' ? (
                          <div className="flex-1 flex flex-col items-center justify-center">
                             <div className="size-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                             <h5 className="text-xl font-black italic text-rose-500/50 uppercase tracking-widest">Architect Analyzing...</h5>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-3 mb-6">
                               <span className="size-1.5 rounded-full bg-primary animate-pulse"></span>
                               <h3 className="text-xl font-black italic leading-tight tracking-tight text-white">{BATTLE_QUESTIONS[selectedLang][qIdx].q}</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-auto">
                               {BATTLE_QUESTIONS[selectedLang][qIdx].options.map((opt, i) => (
                                  <button 
                                    key={i} 
                                    onClick={() => handleBattleAnswer(i)} 
                                    className="bg-white/5 border border-white/10 hover:border-primary p-6 rounded-[24px] text-left font-black text-sm transition-all hover:bg-primary/5 active:scale-[0.98] text-white"
                                  >
                                     <span className="text-slate-400 mr-2 font-mono">{i+1}.</span> {opt}
                                  </button>
                               ))}
                            </div>
                            <div className="mt-8 flex items-center gap-4">
                               <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                                  <div className="h-full bg-cyan-400 transition-all duration-500 shadow-[0_0_15px_rgba(34,211,238,0.5)]" style={{width: `${playerMana}%`}}></div>
                               </div>
                               <button 
                                 onClick={useAbility}
                                 disabled={playerMana < 100}
                                 className={`px-6 py-2 rounded-xl font-black text-[10px] uppercase italic tracking-widest transition-all ${playerMana >= 100 ? 'bg-cyan-400 text-slate-900 shadow-xl hover:scale-105' : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'}`}
                               >
                                  {CLASSES[p1Class].ability}
                               </button>
                            </div>
                          </>
                        )}
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center h-full">
                     <div className="w-full bg-black/60 border-2 border-white/10 rounded-[32px] overflow-hidden flex flex-col shadow-2xl h-full min-h-[500px]">
                        <div className="bg-[#1a1a1a] px-8 py-3 flex items-center justify-between border-b border-white/5">
                           <div className="flex items-center gap-2">
                              <div className="size-2 rounded-full bg-rose-500 animate-pulse"></div>
                              <span className="text-[10px] font-black uppercase text-slate-400">Error Scanner: {selectedLang.toUpperCase()}</span>
                           </div>
                           <div className="text-[10px] font-black uppercase text-amber-300 italic">Score x2 Multiplier Active</div>
                        </div>
                        <div className="flex-1 p-10 font-mono text-xl text-emerald-300 bg-black/40 relative">
                           {feedback && (
                              <div className={`absolute inset-0 flex items-center justify-center bg-black/80 z-20 animate-in zoom-in drop-shadow-2xl ${feedback.type === 'good' ? 'text-emerald-300' : 'text-rose-400'} font-black italic text-4xl`}>
                                 {feedback.msg}
                              </div>
                           )}
                           <pre className="whitespace-pre-wrap leading-relaxed">{BUG_FIXES[selectedLang][bugIdx].code}</pre>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5">
                           {BUG_FIXES[selectedLang][bugIdx].options.map((opt, i) => (
                              <button key={i} onClick={() => handleBugFix(i)} className="p-6 text-left font-black uppercase transition-all hover:bg-white/5 text-slate-300 hover:text-white border-t border-white/5 flex items-center gap-4 text-xs">
                                 <span className="size-6 rounded-md bg-white/10 flex items-center justify-center text-[10px] text-white">{i+1}</span>
                                 {opt}
                              </button>
                           ))}
                        </div>
                     </div>
                  </div>
                )}
             </div>

             {/* SYSTEM LOGS CONSOLE */}
             <div className="w-full lg:w-80 h-[300px] lg:h-auto bg-black/80 border-2 border-white/10 rounded-[32px] flex flex-col overflow-hidden shrink-0 shadow-2xl">
                <div className="bg-[#1a1a1a] px-6 py-3 border-b border-white/5 flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <span className="size-2 rounded-full bg-primary animate-pulse"></span>
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">TACTICAL CONSOLE</span>
                   </div>
                   <span className="material-symbols-outlined text-sm text-slate-600">monitor_heart</span>
                </div>
                <div className="flex-1 overflow-y-auto p-4 font-mono text-[11px] leading-relaxed custom-scrollbar bg-black/20">
                   {logs.length === 0 && <p className="text-slate-600 italic">Waiting for environment events...</p>}
                   {logs.map((log) => (
                      <div key={log.id} className="mb-2 animate-in slide-in-from-left-2 duration-300 flex gap-2">
                         <span className="text-slate-500 opacity-40 shrink-0">[{log.timestamp}]</span>
                         <span className={`${getLogColor(log.type)}`}>{log.msg}</span>
                      </div>
                   ))}
                   <div ref={logEndRef} />
                </div>
             </div>
          </div>
        )}

        {view === 'result' && (
          <div className="flex-1 flex flex-col items-center justify-center text-center animate-in zoom-in duration-500">
             <div className={`size-32 rounded-[32px] flex items-center justify-center mb-6 rotate-3 shadow-2xl ${gameMode === 'bug-hunter' || bossHp <= 0 ? 'bg-emerald-300' : 'bg-rose-400'}`}>
                <span className="material-symbols-outlined text-5xl text-slate-900 font-black">
                   {gameMode === 'bug-hunter' || bossHp <= 0 ? 'emoji_events' : 'heart_broken'}
                </span>
             </div>
             <h2 className="text-6xl font-black text-white italic mb-3 uppercase tracking-tighter drop-shadow-md">Mission Over</h2>
             <p className="text-2xl text-slate-300 font-bold mb-12 uppercase tracking-widest">
                {gameMode === 'bug-hunter' ? `Final Score: ${score}` : bossHp <= 0 ? 'Architect Defeated' : 'System Failure'}
             </p>
             <div className="flex gap-4">
                <button onClick={() => setView('setup')} className="bg-emerald-300 text-slate-900 px-10 py-4 rounded-[32px] font-black text-xl uppercase italic hover:scale-105 transition-all shadow-lg">Try Again</button>
                <button onClick={onBack} className="bg-white/5 text-white px-10 py-4 rounded-[32px] font-black text-xl uppercase italic border border-white/10 hover:bg-white/10 transition-all">Exit Arena</button>
             </div>
          </div>
        )}
      </main>
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          50% { transform: translateX(8px); }
          75% { transform: translateX(-8px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out 3; }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(19, 236, 128, 0.2);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default GameView;
