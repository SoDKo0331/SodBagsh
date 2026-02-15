
import React, { useState, useEffect, useRef } from 'react';
import type { User } from "firebase/auth";

interface GameViewProps {
  user: User;
  onBack: () => void;
}

type GameMode = 'raid' | 'bug-hunter';
type PlayerClass = 'knight' | 'mage' | 'rogue' | 'techno';

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

const BATTLE_QUESTIONS: Question[] = [
  // Existing & Basic Concepts
  { q: "print(type([])) юу буцаах вэ?", options: ["<class 'list'>", "<class 'tuple'>", "<class 'array'>", "Алдаа"], correct: 0, explanation: "[] бол Python-ийн list төрөл юм." },
  { q: "x = [1, 2] * 2; print(x) юу хэвлэх вэ?", options: ["[2, 4]", "[1, 2, 1, 2]", "[1, 1, 2, 2]", "Алдаа"], correct: 1, explanation: "List-ийг тоогоор үржихэд элементүүд нь давтагдана." },
  { q: "Python-д 2-ын 3 зэргийг яаж тооцох вэ?", options: ["2 ^ 3", "2 ** 3", "pow(2, 3)", "b ба c хоёулаа"], correct: 3, explanation: "** болон pow() функц хоёулаа зэрэг дэвшүүлнэ." },
  { q: "range(1, 5) функц ямар утгуудыг үүсгэх вэ?", options: ["1, 2, 3, 4, 5", "1, 2, 3, 4", "0, 1, 2, 3, 4", "1, 5"], correct: 1, explanation: "Range-ийн төгсгөлийн тоо орохгүй." },
  { q: "print(10 / 4) ямар хариу гаргах вэ?", options: ["2", "2.5", "2.0", "Алдаа"], correct: 1, explanation: "Python 3-т / тэмдэг нь үргэлж float буюу бутархай тоо буцаадаг." },
  { q: "print(10 // 4) ямар хариу гаргах вэ?", options: ["2", "2.5", "3", "2.0"], correct: 0, explanation: "// оператор нь бүхэл хэсгийг нь авдаг (integer division)." },
  { q: "print(7 % 3) ямар хариу гаргах вэ?", options: ["1", "2", "3", "0"], correct: 0, explanation: "% (modulo) оператор нь хуваалтын үлдэгдлийг олдог." },
  { q: "input() функц ямар төрлийн өгөгдөл буцаадаг вэ?", options: ["int", "float", "string", "bool"], correct: 2, explanation: "input() функц хэрэглэгчийн оруулсан утгыг үргэлж тэмдэгт мөр (string) болгож авдаг." },
  { q: "bool(0) юу буцаах вэ?", options: ["True", "False", "None", "0"], correct: 1, explanation: "Тоон утга 0 байх нь логик утгаараа False байдаг." },
  { q: "Python-д 'үнэн' гэсэн утгыг яаж бичдэг вэ?", options: ["true", "True", "TRUE", "1"], correct: 1, explanation: "Python-ийн Boolean утгууд том үсгээр эхэлдэг: True, False." },
  { q: "print(type(3.14)) юу хэвлэх вэ?", options: ["int", "double", "float", "decimal"], correct: 2, explanation: "Бутархай тоог Python-д float гэж нэрлэдэг." },
  { q: "x = '10'; print(int(x) + 5) юу хэвлэх вэ?", options: ["105", "15", "Алдаа", "10 + 5"], correct: 1, explanation: "int() нь тэмдэгт мөрийг бүхэл тоо болгож хөрвүүлнэ." },
  { q: "items = [10, 20, 30]; print(items[1]) юу хэвлэх вэ?", options: ["10", "20", "30", "Алдаа"], correct: 1, explanation: "List-ийн индекс 0-ээс эхэлдэг тул 1-р индекс нь 20 байна." },
  { q: "len(range(5)) хэдтэй тэнцүү вэ?", options: ["4", "5", "6", "0"], correct: 1, explanation: "range(5) нь 0, 1, 2, 3, 4 гэсэн 5 элемент үүсгэнэ." },
  { q: "print('Hi' + 5) юу болох вэ?", options: ["Hi5", "HiHiHiHiHi", "TypeError (Алдаа)", "Hi 5"], correct: 2, explanation: "String болон Integer-ийг нэмж (+) болдоггүй." },
  { q: "x = {1, 2, 3}; x.add(2); print(len(x))?", options: ["4", "2", "3", "Алдаа"], correct: 2, explanation: "Set нь давхардсан утга хадгалдаггүй тул хэмжээ нь 3 хэвээр байна." },
  { q: "isinstance(5, int) юу буцаах вэ?", options: ["True", "False", "int", "Алдаа"], correct: 0, explanation: "isinstance нь объектыг тухайн төрөл мөн эсэхийг шалгадаг." },
  { q: "str(123) ямар төрлийн утга үүсгэх вэ?", options: ["int", "string", "float", "list"], correct: 1, explanation: "str() функц утгыг тэмдэгт мөр (string) болгоно." }
];

const BUG_FIXES: BugFix[] = [
  { code: "print \"Hello World\"", options: ["Add parentheses ()", "Use single quotes", "Remove quotes", "No error in Py2"], correct: 0, description: "Python 3 requires print() as a function." },
  { code: "if x = 10:\n    print(x)", options: ["Use == for comparison", "Remove colon :", "Add indent", "Change if to while"], correct: 0, description: "Assignment '=' cannot be used inside 'if' condition." },
  { code: "for i in 10:\n    print(i)", options: ["Use range(10)", "Change in to =", "Add brackets", "Remove i"], correct: 0, description: "Integer is not iterable, range() is needed." },
  { code: "x = input(\"Age: \")\ny = x + 1", options: ["Use int(x)", "Change x to y", "Remove quotes", "Add float(y)"], correct: 0, description: "input() returns a string; you must convert it to int to add numbers." },
  { code: "def my_func:\n    pass", options: ["Add parentheses ()", "Change def to func", "Remove indent", "No error"], correct: 0, description: "Function definitions require parentheses." },
  { code: "x = (1, 2)\nx[0] = 5", options: ["Change tuple to list", "Use .set()", "Remove brackets", "Tuples are mutable"], correct: 0, description: "Tuples are immutable; they cannot be changed after creation." },
  { code: "if x > 5\n    print(x)", options: ["Add colon : after 5", "Remove indent", "Add else", "Use brackets ()"], correct: 0, description: "If statements require a colon at the end of the condition." },
  { code: "x = true\nif x:", options: ["Capitalize 'True'", "Remove if", "Change x to y", "No error"], correct: 0, description: "Python Boolean values are 'True' and 'False' with a capital first letter." },
  { code: "for i in range(5)\n    print(i)", options: ["Add colon : after (5)", "Change for to if", "Remove i", "Add brackets []"], correct: 0, description: "For loops require a colon after the iterable." },
  { code: "items = [1, 2]\nitems.append 3", options: ["Add parentheses ()", "Change .append to +", "Use brackets []", "No error"], correct: 0, description: "Method calls require parentheses: .append(3)." },
  // Fix: Renamed 'explanation' to 'description' on line 60 to match BugFix interface
  { code: "print('It's a trap')", options: ["Use double quotes \"\"", "Escape with \\", "Both A and B", "Change print"], correct: 2, description: "A single quote inside a single-quoted string needs escaping or double quotes." },
  { code: "while x < 5\n    x += 1", options: ["Add colon : after 5", "Remove indent", "Use if instead", "Add break"], correct: 0, description: "While loops require a colon at the end of the condition." },
  { code: "x = [1, 2]\nprint(x[2])", options: ["Change index to 0 or 1", "Add brackets", "Use .get()", "Add append"], correct: 0, description: "Index 2 is out of range for a list with 2 elements (0 and 1)." },
  { code: "x = 5 % 0", options: ["Division by zero error", "Change 0 to 1", "Remove %", "No error"], correct: 0, description: "You cannot perform modulo or division by zero." }
];

const CLASSES: Record<PlayerClass, { name: string; hp: number; dmg: number; icon: string; color: string; ability: string; abilityDesc: string }> = {
  knight: { name: 'Python Knight', hp: 220, dmg: 20, icon: 'shield', color: 'text-blue-400', ability: 'Hard Disk Shield', abilityDesc: 'Next boss hit deals -80% damage.' },
  mage: { name: 'Script Mage', hp: 110, dmg: 55, icon: 'magic_button', color: 'text-purple-400', ability: 'Logic Burst', abilityDesc: 'Next hit deals 2x damage.' },
  rogue: { name: 'Syntax Rogue', hp: 135, dmg: 35, icon: 'bolt', color: 'text-yellow-400', ability: 'Dodge Trace', abilityDesc: '50% chance to avoid next hit.' },
  techno: { name: 'AI Techno', hp: 165, dmg: 28, icon: 'memory', color: 'text-primary', ability: 'Self Repair', abilityDesc: 'Recover 60 HP instantly.' }
};

const BOSS = { name: 'The Global Interpreter Lock', hp: 500, maxHp: 500, dmg: 35, icon: 'token' };

const GameView: React.FC<GameViewProps> = ({ user, onBack }) => {
  const [view, setView] = useState<'mode' | 'lobby' | 'battle' | 'bug-fix' | 'result'>('mode');
  const [gameMode, setGameMode] = useState<GameMode>('raid');
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

  const [feedback, setFeedback] = useState<{msg: string, type: 'good' | 'bad'} | null>(null);
  const [logs, setLogs] = useState<string[]>(["Initializing Python environment..."]);

  useEffect(() => {
    let interval: any;
    if (view === 'bug-fix' && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    } else if (timer === 0 && view === 'bug-fix') {
      setView('result');
    }
    return () => clearInterval(interval);
  }, [view, timer]);

  const startBattle = () => {
    setPlayerHp(CLASSES[p1Class].hp);
    setPlayerMana(0);
    setBossHp(BOSS.hp);
    setTurn('player');
    setIsShieldActive(false);
    setIsBurstActive(false);
    setQIdx(Math.floor(Math.random() * BATTLE_QUESTIONS.length));
    setLogs([`Interpreter is ready for ${CLASSES[p1Class].name}.`]);
    setView('battle');
  };

  const startBugHunter = () => {
    setTimer(60);
    setScore(0);
    setBugIdx(Math.floor(Math.random() * BUG_FIXES.length));
    setView('bug-fix');
  };

  const handleBattleAnswer = (idx: number) => {
    if (turn !== 'player' || feedback) return;

    const correct = idx === BATTLE_QUESTIONS[qIdx].correct;
    let pDmg = CLASSES[p1Class].dmg;
    if (isBurstActive) {
      pDmg *= 2;
      setIsBurstActive(false);
    }

    if (correct) {
      const newBossHp = Math.max(0, bossHp - pDmg);
      setBossHp(newBossHp);
      setPlayerMana(m => Math.min(100, m + 40));
      setFeedback({ msg: `SUCCESS! -${pDmg} DMG`, type: 'good' });
      setIsShaking('boss');
      setLogs(prev => [`Success! You dealt ${pDmg} damage to GIL.`, ...prev]);
      
      if (newBossHp <= 0) {
        setTimeout(() => setView('result'), 1200);
        return;
      }

      setTimeout(() => {
        setFeedback(null);
        setIsShaking(null);
        setQIdx(Math.floor(Math.random() * BATTLE_QUESTIONS.length));
      }, 1000);

    } else {
      setFeedback({ msg: "SYNTAX ERROR!", type: 'bad' });
      setLogs(prev => [`Traceback Error: Attack intercepted by Boss!`, ...prev]);
      
      setTurn('boss');
      setTimeout(() => {
        setFeedback(null);
        setIsShaking(null);
        bossAction();
      }, 1200);
    }
  };

  const useAbility = () => {
    if (playerMana < 100 || turn !== 'player') return;
    setPlayerMana(0);
    setLogs(prev => [`Ability: ${CLASSES[p1Class].ability} triggered!`, ...prev]);

    if (p1Class === 'knight') setIsShieldActive(true);
    if (p1Class === 'mage') setIsBurstActive(true);
    if (p1Class === 'techno') setPlayerHp(h => Math.min(CLASSES.techno.hp, h + 60));
    if (p1Class === 'rogue') setLogs(prev => [`Dodge module loaded.`, ...prev]);
  };

  const bossAction = () => {
    let dmg = BOSS.dmg;
    
    if (p1Class === 'rogue' && Math.random() > 0.5) {
      setLogs(prev => [`Dodge successful! Runtime bypass.`, ...prev]);
      dmg = 0;
    } else if (isShieldActive) {
      dmg = Math.floor(dmg * 0.2);
      setIsShieldActive(false);
      setLogs(prev => [`Shield absorbed the blow.`, ...prev]);
    }

    const newPlayerHp = Math.max(0, playerHp - dmg);
    setPlayerHp(newPlayerHp);
    setIsShaking('player');
    setFeedback({ msg: `BOSS ATTACK! -${dmg} HP`, type: 'bad' });
    setLogs(prev => [`Boss throttled your process for ${dmg} HP.`, ...prev]);

    setTimeout(() => {
      setFeedback(null);
      setIsShaking(null);
      if (newPlayerHp <= 0) {
        setView('result');
      } else {
        setTurn('player');
        setQIdx(Math.floor(Math.random() * BATTLE_QUESTIONS.length));
      }
    }, 1500);
  };

  const handleBugFix = (idx: number) => {
    const correct = idx === BUG_FIXES[bugIdx].correct;
    if (correct) {
      setScore(s => s + 150);
      setTimer(t => t + 5);
      setFeedback({ msg: "FIXED! +150", type: 'good' });
    } else {
      setTimer(t => Math.max(0, t - 8));
      setFeedback({ msg: "FATAL: -8S", type: 'bad' });
    }

    setTimeout(() => {
      setFeedback(null);
      setBugIdx(Math.floor(Math.random() * BUG_FIXES.length));
    }, 600);
  };

  const playerHpPercent = `${(playerHp / (CLASSES[p1Class]?.hp || 100)) * 100}%`;
  const bossHpPercent = `${(bossHp / BOSS.maxHp) * 100}%`;
  const manaPercent = `${playerMana}%`;

  return (
    <div className="flex-1 flex flex-col bg-[#050806] text-white font-display overflow-hidden relative select-none min-h-screen">
      {/* Background Effect */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none overflow-hidden">
        <div className="grid grid-cols-6 sm:grid-cols-12 h-full gap-2">
          {Array.from({ length: 80 }).map((_, i) => (
            <div key={i} className="font-mono text-[8px] sm:text-[10px] text-primary animate-pulse whitespace-nowrap">
              {i % 2 === 0 ? 'def battle():' : '    yield dmg'}
            </div>
          ))}
        </div>
      </div>

      <header className="h-16 md:h-20 border-b border-primary/20 flex items-center justify-between px-4 md:px-10 relative z-30 bg-black/80 backdrop-blur-xl shrink-0">
        <div className="flex items-center gap-2 md:gap-6">
          <button onClick={onBack} className="size-10 md:size-12 rounded-xl bg-white/5 flex items-center justify-center hover:bg-primary/20 transition-all border border-white/10 shrink-0">
            <span className="material-symbols-outlined text-slate-400">arrow_back</span>
          </button>
          <h2 className="text-base md:text-2xl font-black italic uppercase text-primary tracking-tighter truncate">Python Arena</h2>
        </div>
        <div className="flex items-center gap-3 md:gap-6">
           {view === 'bug-fix' && (
              <div className="flex items-center gap-4">
                 <div className="text-center">
                    <p className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase">Clock</p>
                    <p className={`text-xs md:text-2xl font-black italic ${timer < 10 ? 'text-red-500 animate-ping' : 'text-primary'}`}>{timer}s</p>
                 </div>
                 <div className="text-center">
                    <p className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase">Score</p>
                    <p className="text-xs md:text-2xl font-black italic text-white">{score}</p>
                 </div>
              </div>
           )}
           <div className="flex items-center gap-2">
              <div className="hidden sm:flex flex-col items-end">
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Local Session</span>
                  <span className="text-[10px] md:text-xs font-black text-white italic truncate max-w-[80px]">{user.email?.split('@')[0]}</span>
              </div>
              <div className="size-8 md:size-12 rounded-full border-2 border-primary bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-xs md:text-xl">terminal</span>
              </div>
           </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col p-4 md:p-8 lg:p-10 relative z-20 max-w-7xl mx-auto w-full overflow-y-auto">
        
        {view === 'mode' && (
          <div className="flex-1 flex flex-col items-center justify-center animate-in zoom-in duration-500">
             <div className="text-center mb-10 md:mb-16">
                <h1 className="text-3xl sm:text-5xl md:text-7xl font-black italic mb-4 uppercase tracking-tighter">Arena Mode</h1>
                <p className="text-slate-500 font-bold uppercase tracking-[0.2em] sm:tracking-[0.6em] text-[10px] sm:text-sm">Python Skill Challenges</p>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-10 w-full max-w-4xl px-4">
                <button onClick={() => { setGameMode('raid'); setView('lobby'); }} className="group relative bg-white/5 border-2 md:border-4 border-white/10 p-6 md:p-12 rounded-[24px] md:rounded-[48px] flex flex-col items-center gap-4 hover:border-primary/50 hover:bg-primary/5 transition-all hover:-translate-y-2">
                   <div className="size-16 md:size-24 rounded-2xl md:rounded-3xl bg-primary/20 flex items-center justify-center group-hover:bg-primary group-hover:text-slate-900 transition-colors">
                      <span className="material-symbols-outlined text-3xl md:text-6xl">swords</span>
                   </div>
                   <div className="text-center">
                      <h3 className="text-lg md:text-3xl font-black italic uppercase tracking-tighter mb-1 md:mb-2">GIL Raid</h3>
                      <p className="text-[10px] md:text-sm font-bold text-slate-500">RPG Battle: Strategy & Logic</p>
                   </div>
                </button>

                <button onClick={() => { setGameMode('bug-hunter'); startBugHunter(); }} className="group relative bg-white/5 border-2 md:border-4 border-white/10 p-6 md:p-12 rounded-[24px] md:rounded-[48px] flex flex-col items-center gap-4 hover:border-red-500/50 hover:bg-red-500/5 transition-all hover:-translate-y-2">
                   <div className="size-16 md:size-24 rounded-2xl md:rounded-3xl bg-red-500/20 flex items-center justify-center group-hover:bg-red-500 group-hover:text-slate-900 transition-colors">
                      <span className="material-symbols-outlined text-3xl md:text-6xl">bug_report</span>
                   </div>
                   <div className="text-center">
                      <h3 className="text-lg md:text-3xl font-black italic uppercase tracking-tighter mb-1 md:mb-2">Debug Sprint</h3>
                      <p className="text-[10px] md:text-sm font-bold text-slate-500">Time Attack: Fix the Syntax</p>
                   </div>
                </button>
             </div>
          </div>
        )}

        {view === 'lobby' && (
          <div className="flex-1 flex flex-col items-center justify-center animate-in zoom-in duration-500">
             <div className="text-center mb-8 md:mb-16">
                <h1 className="text-3xl sm:text-5xl md:text-7xl font-black italic mb-2 md:mb-4 uppercase tracking-tighter">Select Avatar</h1>
                <p className="text-slate-500 font-bold uppercase tracking-[0.2em] md:tracking-[0.6em] text-[10px] md:text-sm">Battle Classes</p>
             </div>
             
             <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-8 md:mb-16 w-full">
                {(Object.keys(CLASSES) as PlayerClass[]).map(c => (
                   <button 
                    key={c} 
                    onClick={() => setP1Class(c)} 
                    className={`relative p-4 md:p-8 rounded-[20px] md:rounded-[40px] border-2 md:border-4 transition-all flex flex-col items-center gap-2 group ${
                      p1Class === c ? 'bg-primary border-white text-slate-900 scale-105 shadow-[0_0_30px_rgba(19,236,128,0.4)]' : 'bg-white/5 border-white/5 text-slate-400 hover:border-white/20'
                    }`}
                   >
                      <span className={`material-symbols-outlined text-3xl md:text-6xl ${p1Class === c ? 'text-slate-900' : CLASSES[c].color}`}>{CLASSES[c].icon}</span>
                      <div className="text-center">
                        <p className="font-black italic uppercase text-[10px] md:text-sm tracking-tight">{CLASSES[c].name}</p>
                        <p className={`text-[8px] md:text-[10px] font-bold ${p1Class === c ? 'text-slate-700' : 'text-slate-500'}`}>HP {CLASSES[c].hp}</p>
                      </div>
                      {p1Class === c && (
                        <div className="absolute top-full mt-2 left-0 right-0 bg-slate-900 text-white p-2 rounded-lg border border-white/10 text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-center shadow-2xl animate-in fade-in slide-in-from-top-2 z-10">
                           {CLASSES[c].ability}
                        </div>
                      )}
                   </button>
                ))}
             </div>

             <button onClick={startBattle} className="bg-primary text-slate-900 px-10 md:px-24 py-4 md:py-8 rounded-[16px] md:rounded-[40px] font-black text-lg md:text-4xl uppercase italic hover:scale-105 transition-all shadow-2xl flex items-center gap-4 mt-6">
                ENTER RAID
                <span className="material-symbols-outlined text-xl md:text-4xl font-black">flash_on</span>
             </button>
          </div>
        )}

        {view === 'battle' && (
          <div className="flex-1 flex flex-col gap-6 md:gap-10">
            {/* Health Bars & Avatars */}
            <div className="flex flex-col md:grid md:grid-cols-2 gap-10 md:gap-20 items-center relative py-2">
               <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-16 rounded-full bg-slate-900 border-4 border-primary items-center justify-center font-black italic text-2xl z-30">VS</div>

               <div className={`flex flex-col items-center w-full transition-all ${turn === 'player' ? 'scale-105' : 'opacity-40 grayscale'} ${isShaking === 'player' ? 'animate-shake' : ''}`}>
                  <div className={`size-32 sm:size-48 lg:size-64 rounded-[24px] md:rounded-[64px] bg-slate-900 border-4 md:border-8 ${turn === 'player' ? 'border-primary shadow-[0_0_30px_rgba(19,236,128,0.2)]' : 'border-white/5'} flex items-center justify-center relative`}>
                     <span className={`material-symbols-outlined text-5xl sm:text-7xl md:text-[120px] ${CLASSES[p1Class].color}`}>{CLASSES[p1Class].icon}</span>
                     {isShieldActive && <div className="absolute inset-0 border-4 md:border-8 border-blue-400 rounded-[24px] md:rounded-[64px] animate-pulse"></div>}
                     <div className="absolute -bottom-4 md:-bottom-8 left-0 right-0 h-2 md:h-4 bg-slate-800 rounded-full overflow-hidden border border-white/10 shadow-lg">
                        <div className="h-full bg-primary transition-all duration-500" style={{width: playerHpPercent}}></div>
                     </div>
                     <div className="absolute -bottom-7 md:-bottom-14 left-0 right-0 h-1 md:h-2 bg-slate-800 rounded-full overflow-hidden border border-white/10">
                        <div className="h-full bg-blue-500 transition-all duration-500" style={{width: manaPercent}}></div>
                     </div>
                  </div>
                  <div className="mt-8 md:mt-20 text-center">
                    <h4 className="text-sm md:text-2xl font-black italic uppercase">{user.email?.split('@')[0]}</h4>
                    <p className="text-[8px] md:text-xs font-black text-primary/60 uppercase">{CLASSES[p1Class].name}</p>
                  </div>
               </div>

               <div className={`flex flex-col items-center w-full transition-all ${turn === 'boss' ? 'scale-105' : 'opacity-40 grayscale'} ${isShaking === 'boss' ? 'animate-shake' : ''}`}>
                  <div className={`size-32 sm:size-48 lg:size-64 rounded-[24px] md:rounded-[64px] bg-red-950/20 border-4 md:border-8 ${turn === 'boss' ? 'border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.2)]' : 'border-white/5'} flex items-center justify-center relative`}>
                     <span className="material-symbols-outlined text-5xl sm:text-7xl md:text-[120px] text-red-500">{BOSS.icon}</span>
                     <div className="absolute -bottom-4 md:-bottom-8 left-0 right-0 h-2 md:h-4 bg-slate-800 rounded-full overflow-hidden border border-white/10 shadow-lg">
                        <div className="h-full bg-red-500 transition-all duration-500" style={{width: bossHpPercent}}></div>
                     </div>
                  </div>
                  <div className="mt-8 md:mt-20 text-center">
                    <h4 className="text-sm md:text-2xl font-black italic uppercase text-red-500">{BOSS.name}</h4>
                    <p className="text-[8px] md:text-xs font-black text-red-400/40 uppercase">CORE INTERPRETER</p>
                  </div>
               </div>
            </div>

            {/* Battle Area Responsive Layout */}
            <div className="flex flex-col lg:flex-row gap-4 md:gap-8 flex-1">
               <div className="flex-1 bg-black/60 border-2 md:border-4 border-white/5 rounded-[24px] md:rounded-[40px] p-6 md:p-10 flex flex-col shadow-2xl backdrop-blur-3xl min-h-[300px] relative">
                  {feedback ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center animate-in zoom-in">
                       <h5 className={`text-2xl md:text-5xl font-black italic mb-2 md:mb-4 ${feedback.type === 'good' ? 'text-primary' : 'text-red-500'}`}>{feedback.msg}</h5>
                       <p className="text-slate-500 font-bold uppercase tracking-widest text-[8px] md:text-xs">Processing sequence...</p>
                    </div>
                  ) : turn === 'boss' ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center">
                       <div className="size-8 md:size-12 border-2 border-red-500 border-t-transparent rounded-full animate-spin mb-4 md:mb-8"></div>
                       <h5 className="text-sm md:text-2xl font-black italic uppercase tracking-widest text-red-500/50 animate-pulse">Interpreter busy...</h5>
                    </div>
                  ) : (
                    <>
                       <div className="flex items-center justify-between mb-4 md:mb-8">
                          <div className="flex items-center gap-2">
                             <span className="size-2 rounded-full bg-primary animate-ping"></span>
                             <span className="text-[8px] md:text-[10px] font-black uppercase text-primary tracking-widest">Execute Input</span>
                          </div>
                          <button 
                            onClick={useAbility} 
                            disabled={playerMana < 100}
                            className={`px-4 md:px-8 py-2 md:py-3 rounded-xl font-black text-[8px] md:text-[10px] uppercase tracking-widest transition-all ${playerMana === 100 ? 'bg-blue-500 text-white shadow-lg active:scale-95' : 'bg-slate-800 text-slate-500 opacity-50'}`}
                          >
                             Skill: {CLASSES[p1Class].ability}
                          </button>
                       </div>
                       <h3 className="text-lg md:text-3xl font-black mb-6 md:mb-10 leading-tight tracking-tight">{BATTLE_QUESTIONS[qIdx].q}</h3>
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mt-auto">
                          {BATTLE_QUESTIONS[qIdx].options.map((opt, i) => (
                             <button 
                              key={i} 
                              onClick={() => handleBattleAnswer(i)} 
                              className="bg-white/5 border-2 border-white/10 hover:border-primary/50 p-4 rounded-xl md:rounded-[32px] text-left font-black text-xs md:text-lg transition-all hover:bg-primary/5 flex items-center justify-between group active:scale-95 shadow-md"
                             >
                                <span>{opt}</span>
                                <span className="material-symbols-outlined text-slate-700 text-xs md:text-base group-hover:text-primary transition-colors">keyboard_arrow_right</span>
                             </button>
                          ))}
                       </div>
                    </>
                  )}
               </div>

               {/* Log Box (Collapsible on Mobile) */}
               <div className="h-40 lg:h-auto lg:w-72 bg-slate-900/40 border border-white/5 rounded-[24px] p-4 md:p-6 flex flex-col overflow-hidden shrink-0">
                  <div className="flex items-center gap-2 mb-4 opacity-40">
                    <span className="material-symbols-outlined text-xs">terminal</span>
                    <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest">Battle Thread</span>
                  </div>
                  <div className="flex-1 space-y-2 md:space-y-3 font-mono text-[8px] md:text-[10px] overflow-y-auto custom-scrollbar">
                     {logs.map((log, i) => (
                        <div key={i} className={`flex gap-2 ${log.includes('damage') || log.includes('Success') ? 'text-primary' : log.includes('HP') || log.includes('Error') ? 'text-red-400' : 'text-slate-500'}`}>
                           <span className="opacity-20 select-none">>>></span>
                           <span className="leading-tight">{log}</span>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
          </div>
        )}

        {view === 'bug-fix' && (
          <div className="flex-1 flex flex-col items-center">
             <div className="text-center mb-6 md:mb-10">
                <h2 className="text-2xl md:text-5xl font-black italic uppercase tracking-tighter">Code Scanner</h2>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-[8px] md:text-xs">Find and patch the logic error</p>
             </div>

             <div className="w-full max-w-4xl bg-black/60 border-2 md:border-4 border-white/10 rounded-[20px] md:rounded-[40px] overflow-hidden flex flex-col shadow-2xl backdrop-blur-3xl min-h-[350px]">
                <div className="bg-[#1a1a1a] px-4 md:px-10 py-2 md:py-4 flex items-center justify-between border-b border-white/5">
                   <div className="flex items-center gap-2">
                      <div className="size-1.5 md:size-2 rounded-full bg-red-500 animate-pulse"></div>
                      <span className="text-[8px] md:text-[10px] font-black uppercase text-slate-500">Traceback Caught</span>
                   </div>
                   <div className="text-[8px] md:text-[10px] font-black text-slate-700 italic">0x{Math.floor(Math.random()*10000).toString(16)}</div>
                </div>

                <div className="flex-1 p-6 md:p-12 font-mono text-sm md:text-2xl text-primary bg-black/40 relative overflow-auto">
                   {feedback && (
                      <div className={`absolute inset-0 flex items-center justify-center bg-black/80 z-20 animate-in zoom-in ${feedback.type === 'good' ? 'text-primary' : 'text-red-500'} font-black italic text-xl md:text-5xl text-center p-4`}>
                         {feedback.msg}
                      </div>
                   )}
                   <pre className="whitespace-pre-wrap leading-relaxed">{BUG_FIXES[bugIdx].code}</pre>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/5 border-t border-white/5">
                   {BUG_FIXES[bugIdx].options.map((opt, i) => (
                      <button 
                        key={i} 
                        onClick={() => handleBugFix(i)} 
                        className="p-4 md:p-8 text-left font-black text-xs md:text-base uppercase transition-all hover:bg-white/5 group flex items-center justify-between active:scale-95"
                      >
                         <span className="text-slate-400 group-hover:text-white truncate pr-2">{opt}</span>
                         <span className="material-symbols-outlined text-slate-700 text-sm md:text-xl group-hover:text-primary transition-colors">memory</span>
                      </button>
                   ))}
                </div>
             </div>
          </div>
        )}

        {view === 'result' && (
          <div className="flex-1 flex flex-col items-center justify-center text-center animate-in zoom-in duration-500 py-6">
             <div className={`size-32 md:size-56 rounded-[32px] md:rounded-[60px] flex items-center justify-center text-slate-900 mb-6 md:mb-12 shadow-2xl rotate-3 ${
                (gameMode === 'raid' && bossHp <= 0) || (gameMode === 'bug-hunter' && score > 600) 
                  ? 'bg-primary shadow-primary/30' 
                  : 'bg-red-500 shadow-red-500/30'}`}>
                <span className="material-symbols-outlined text-5xl md:text-[120px] font-black">
                   {(gameMode === 'raid' && bossHp <= 0) || (gameMode === 'bug-hunter' && score > 600) ? 'rocket_launch' : 'report_problem'}
                </span>
             </div>
             <h2 className="text-3xl md:text-8xl font-black italic mb-2 md:mb-4 uppercase tracking-tighter">
                {(gameMode === 'raid' && bossHp <= 0) || (gameMode === 'bug-hunter' && score > 600) ? 'Compiled' : 'Fatal Error'}
             </h2>
             <p className="text-sm md:text-3xl text-slate-400 font-bold mb-8 md:mb-16 uppercase tracking-widest">
                {gameMode === 'bug-hunter' ? `Final XP: ${score}` : bossHp <= 0 ? 'GIL Unlocked. Process complete.' : 'Interpreter Panic. Core dumped.'}
             </p>
             <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
                <button onClick={() => setView('mode')} className="flex-1 bg-primary text-slate-900 px-6 py-4 rounded-xl md:rounded-[32px] font-black text-base md:text-2xl uppercase italic shadow-lg active:scale-95 transition-all">Retry</button>
                <button onClick={onBack} className="flex-1 bg-white/5 text-white px-6 py-4 rounded-xl md:rounded-[32px] font-black text-base md:text-2xl uppercase italic border border-white/10 hover:bg-white/10 active:scale-95 transition-all">Exit</button>
             </div>
          </div>
        )}
      </main>

      <footer className="h-10 md:h-12 bg-black/80 border-t border-white/5 px-4 md:px-10 flex items-center justify-between text-[6px] md:text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] md:tracking-[0.4em] shrink-0 overflow-hidden">
         <div className="flex gap-4 md:gap-10 truncate">
            <span>Server: CORE-PY-7</span>
            <span className="hidden sm:inline">Kernel: 5.15.0-x86_64</span>
         </div>
         <div className="flex items-center gap-2 shrink-0">
            <span className="size-1.5 md:size-2 rounded-full bg-primary animate-pulse"></span>
            <span>Security Verified</span>
         </div>
      </footer>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          50% { transform: translateX(8px); }
          75% { transform: translateX(-8px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 3;
        }
      `}</style>
    </div>
  );
};

export default GameView;
