
import React, { useState, useEffect, useRef, useMemo } from 'react';

interface GameViewProps {
  user: { uid: string; email: string | null };
  onBack: () => void;
  onEarnBadge: (badgeId: string) => void;
  initialLanguage?: 'python' | 'cpp';
}

type GameMode = 'raid' | 'bug-hunter';
type PlayerClass = 'knight' | 'mage' | 'rogue' | 'techno';
type ProgrammingLanguage = 'python' | 'cpp';
type LogType = 'player' | 'boss' | 'system' | 'success' | 'ability' | 'error';

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
  category: 'data-type' | 'io' | 'list' | 'range' | 'logic';
}

const BATTLE_QUESTIONS: Record<ProgrammingLanguage, Question[]> = {
  python: [
    // I. Өгөгдлийн төрөл (data-type) - Knight Preferred
    { q: "type(10) ямар төрөл вэ?", options: ["float", "int", "str", "bool"], correct: 1, explanation: "Бүхэл тоо бол int (integer) төрөл юм.", category: 'data-type' },
    { q: "type(\"15\") ямар төрөл вэ?", options: ["int", "float", "str", "bool"], correct: 2, explanation: "Хашилтанд байгаа утга бол str (string) юм.", category: 'data-type' },
    { q: "type(3.14) ямар төрөл вэ?", options: ["int", "float", "str", "bool"], correct: 1, explanation: "Бутархай тоо бол float төрөл юм.", category: 'data-type' },
    { q: "type(True) ямар төрөл вэ?", options: ["int", "float", "str", "bool"], correct: 3, explanation: "True/False утга бол bool (boolean) юм.", category: 'data-type' },
    { q: "\"5\" + \"3\" ямар үр дүн өгөх вэ?", options: ["8", "53", "error", "5 3"], correct: 1, explanation: "Тэмдэгт мөрүүдийг залгахад 53 гарна.", category: 'data-type' },
    { q: "int(\"7\") + 3 ямар үр дүн өгөх вэ?", options: ["10", "73", "error", "7"], correct: 0, explanation: "Тэмдэгт мөрийг тоо болгож нэмж байна.", category: 'data-type' },
    { q: "float(5) ямар утга буцаах вэ?", options: ["5", "5.0", "\"5.0\"", "error"], correct: 1, explanation: "Бүхэл тоог бутархай болгож байна.", category: 'data-type' },
    { q: "bool(0) ямар утга вэ?", options: ["True", "False", "0", "error"], correct: 1, explanation: "Тэг утга логик төрөлд False болдог.", category: 'data-type' },
    
    // II. Input / Output (io) - Techno Preferred
    { q: "name = \"Sodoo\"; print(\"Hello\", name) юу хэвлэх вэ?", options: ["Hello", "HelloSodoo", "Hello Sodoo", "Sodoo Hello"], correct: 2, explanation: "Таслалаар заагласан утгууд зайтай хэвлэгдэнэ.", category: 'io' },
    { q: "a = input(\"Enter number: \"); print(type(a)) -> 5 гэж оруулбал?", options: ["int", "float", "str", "bool"], correct: 2, explanation: "input() үргэлж тэмдэгт мөр (str) буцаана.", category: 'io' },
    { q: "a=int(input()); b=int(input()); print(a+b) -> 2 ба 3-ыг оруулбал?", options: ["23", "5", "error", "6"], correct: 1, explanation: "Тоон төрөл рүү шилжүүлж нэмж байна.", category: 'io' },
    { q: "x = 4; print(\"x =\", x) юу хэвлэх вэ?", options: ["x4", "x = 4", "4 = x", "error"], correct: 1, explanation: "Текст болон хувьсагчийг зэрэг хэвлэж байна.", category: 'io' },
    { q: "print(5, 6, 7) ямар гаралт өгөх вэ?", options: ["567", "5 6 7", "5,6,7", "error"], correct: 1, explanation: "Зайтай хэвлэгдэнэ.", category: 'io' },
    { q: "input() функц ямар төрлийн утга буцаадаг вэ?", options: ["int", "str", "float", "bool"], correct: 1, explanation: "input() нь үргэлж тэмдэгт мөр (str) буцаадаг.", category: 'io' },

    // III. List (list) - Rogue Preferred
    { q: "a = [1, 2, 3] энэ ямар төрөл вэ?", options: ["int", "list", "tuple", "str"], correct: 1, explanation: "Дөрвөлжин хаалтанд жагсаалт хадгалагддаг.", category: 'list' },
    { q: "a = [10, 20, 30]; a[1] ямар утга вэ?", options: ["10", "20", "30", "error"], correct: 1, explanation: "Индекс 0-ээс эхэлдэг тул 1-р элемент нь 20.", category: 'list' },
    { q: "a = [1,2,3]; a.append(4) хийвэл list ямар болно?", options: ["[1,2,3]", "[1,2,3,4]", "[4,1,2,3]", "error"], correct: 1, explanation: "append() ард нь элемент нэмдэг.", category: 'list' },
    { q: "len([5,6,7,8]) хэд вэ?", options: ["3", "4", "5", "error"], correct: 1, explanation: "Нийт 4 элементтэй байна.", category: 'list' },
    { q: "a = [1,2,3]; a[0] = 10; a ямар болно?", options: ["[1,2,3]", "[10,2,3]", "[1,10,3]", "error"], correct: 1, explanation: "Эхний элементийг сольж байна.", category: 'list' },
    { q: "a = [1,2,3]; a.pop() хийвэл юу устах вэ?", options: ["1", "2", "3", "бүхэл list"], correct: 2, explanation: "pop() сүүлийн элементийг устгана.", category: 'list' },
    { q: "a = [1,2] + [3,4] ямар үр дүн вэ?", options: ["[1,2,3,4]", "[4,6]", "error", "[1,2][3,4]"], correct: 0, explanation: "Жагсаалтуудыг нэмэхэд залгагдана.", category: 'list' },
    { q: "a = [1,2,3,4]; a[1:3] ямар үр дүн вэ?", options: ["[1,2]", "[2,3]", "[3,4]", "error"], correct: 1, explanation: "1-ээс 3 хүртэл (3 орохгүй) буюу 2, 3.", category: 'list' },

    // IV. Range (range) - Mage Preferred
    { q: "range(5) хэдэн тоо үүсгэнэ?", options: ["4", "5", "6", "0"], correct: 1, explanation: "0, 1, 2, 3, 4 буюу 5 тоо.", category: 'range' },
    { q: "list(range(3)) ямар үр дүн вэ?", options: ["[1,2,3]", "[0,1,2]", "[0,1,2,3]", "error"], correct: 1, explanation: "0-ээс эхлээд 3 хүртэл (3 орохгүй).", category: 'range' },
    { q: "list(range(2,6)) ямар вэ?", options: ["[2,3,4,5]", "[2,3,4,5,6]", "[3,4,5]", "error"], correct: 0, explanation: "2-оос эхлээд 6 хүртэл (6 орохгүй).", category: 'range' },
    { q: "list(range(1,10,2)) ямар вэ?", options: ["[1,3,5,7,9]", "[2,4,6,8]", "[1,2,3,4,5]", "error"], correct: 0, explanation: "1-ээс 10 хүртэл 2-ын алхамтай.", category: 'range' },
    { q: "for i in range(3): print(i) юу хэвлэх вэ?", options: ["1 2 3", "0 1 2", "0 1 2 3", "error"], correct: 1, explanation: "0-ээс эхэлнэ.", category: 'range' },
    { q: "range(5,0,-1) ямар дараалал вэ?", options: ["5 4 3 2 1", "0 1 2 3 4", "5 4 3 2", "error"], correct: 0, explanation: "5-аас 0 хүртэл (0 орохгүй) буурна.", category: 'range' },
    { q: "for i in range(1,4): print(i*2) гаралт?", options: ["2 4 6", "1 2 3", "2 3 4", "error"], correct: 0, explanation: "1*2, 2*2, 3*2 = 2 4 6.", category: 'range' },
    { q: "sum(range(1,5)) хэд вэ?", options: ["10", "15", "5", "error"], correct: 0, explanation: "1+2+3+4 = 10.", category: 'range' }
  ],
  cpp: [
    { q: "int* p; гэж юуг зарлаж байна вэ?", options: ["Integer", "Array", "Pointer", "Reference"], correct: 2, explanation: "Pointer variables store memory addresses.", category: 'data-type' },
    { q: "std::vector<int> v; v.size() initial value?", options: ["1", "0", "NULL", "Error"], correct: 1, explanation: "A new vector is empty by default.", category: 'list' },
    { q: "What is the result of 10 / 3 in C++ (int)?", options: ["3.33", "3", "4", "0"], correct: 1, explanation: "Integer division truncates decimal parts.", category: 'logic' },
    { q: "Which symbol is used for logical AND?", options: ["&", "&&", "and", "||"], correct: 1, explanation: "&& is the logical AND operator in C++.", category: 'logic' }
  ]
};

const CLASSES: Record<PlayerClass, { name: string; hp: number; dmg: number; icon: string; color: string; ability: string; abilityDesc: string, preferredCategory: string }> = {
  knight: { name: 'Code Knight', hp: 220, dmg: 20, icon: 'shield', color: 'text-blue-400', ability: 'Hard Disk Shield', abilityDesc: 'Next boss hit deals -80% damage.', preferredCategory: 'data-type' },
  mage: { name: 'Logic Mage', hp: 110, dmg: 55, icon: 'magic_button', color: 'text-purple-400', ability: 'Logic Burst', abilityDesc: 'Next hit deals 2x damage.', preferredCategory: 'range' },
  rogue: { name: 'Syntax Rogue', hp: 135, dmg: 35, icon: 'bolt', color: 'text-yellow-400', ability: 'Dodge Trace', abilityDesc: '50% chance to avoid next hit.', preferredCategory: 'list' },
  techno: { name: 'AI Techno', hp: 165, dmg: 28, icon: 'memory', color: 'text-primary', ability: 'Self Repair', abilityDesc: 'Recover 60 HP instantly.', preferredCategory: 'io' }
};

const BOSS = { name: 'The System Architect', hp: 1000, maxHp: 1000, dmg: 40, icon: 'token' };

const GameView: React.FC<GameViewProps> = ({ user, onBack, onEarnBadge, initialLanguage = 'python' }) => {
  const [view, setView] = useState<'setup' | 'hero' | 'battle' | 'result'>('setup');
  const [selectedLang, setSelectedLang] = useState<ProgrammingLanguage>(initialLanguage);
  const [p1Class, setP1Class] = useState<PlayerClass>('knight');
  
  const [playerHp, setPlayerHp] = useState(100);
  const [playerMaxHp, setPlayerMaxHp] = useState(100);
  const [playerMana, setPlayerMana] = useState(0);
  const [bossHp, setBossHp] = useState(BOSS.hp);
  const [turn, setTurn] = useState<'player' | 'boss'>('player');
  const [logs, setLogs] = useState<GameLog[]>([]);
  const [qIdx, setQIdx] = useState(0);
  const [isShieldActive, setIsShieldActive] = useState(false);
  const [isBurstActive, setIsBurstActive] = useState(false);
  const [isShaking, setIsShaking] = useState<'player' | 'boss' | null>(null);
  const [battleQuestions, setBattleQuestions] = useState<Question[]>([]);

  const addLog = (msg: string, type: LogType) => {
    setLogs(prev => [{ id: Math.random().toString(), msg, type, timestamp: new Date().toLocaleTimeString() }, ...prev].slice(0, 10));
  };

  const startBattle = () => {
    const hero = CLASSES[p1Class];
    setPlayerHp(hero.hp);
    setPlayerMaxHp(hero.hp);
    setPlayerMana(0);
    setBossHp(BOSS.hp);
    setTurn('player');
    const shuffled = [...BATTLE_QUESTIONS[selectedLang]].sort(() => Math.random() - 0.5);
    setBattleQuestions(shuffled);
    setQIdx(0);
    setLogs([]);
    addLog("Battle started! Defeat The System Architect.", 'system');
    setView('battle');
  };

  const handleAnswer = (optionIdx: number) => {
    if (turn !== 'player') return;
    const currentQ = battleQuestions[qIdx];
    const isCorrect = optionIdx === currentQ.correct;
    const hero = CLASSES[p1Class];

    if (isCorrect) {
      let damage = hero.dmg;
      if (isBurstActive) {
        damage *= 2;
        setIsBurstActive(false);
        addLog("Critical Burst! Double damage.", 'ability');
      }
      
      // Category Bonus
      if (currentQ.category === hero.preferredCategory) {
        damage = Math.floor(damage * 1.5);
        addLog(`Category Mastery! Extra damage from ${currentQ.category}.`, 'success');
      }

      setBossHp(prev => Math.max(0, prev - damage));
      setIsShaking('boss');
      addLog(`You used ${currentQ.category} knowledge! Dealt ${damage} damage.`, 'player');
      setPlayerMana(prev => Math.min(100, prev + 25));
    } else {
      addLog("Logic Error! Your attack failed.", 'error');
    }

    setTimeout(() => setIsShaking(null), 500);
    
    // Check win condition
    if (bossHp <= 0) {
      setView('result');
      return;
    }

    setTurn('boss');
    setTimeout(bossTurn, 1000);
  };

  const bossTurn = () => {
    let damage = BOSS.dmg + Math.floor(Math.random() * 20);
    
    if (isShieldActive) {
      damage = Math.floor(damage * 0.2);
      setIsShieldActive(false);
      addLog("Shield held! Blocked 80% damage.", 'ability');
    }

    // Rogue Dodge Chance
    if (p1Class === 'rogue' && Math.random() > 0.5) {
      addLog("Syntax Rogue dodged the trace!", 'ability');
      damage = 0;
    }

    setPlayerHp(prev => Math.max(0, prev - damage));
    setIsShaking('player');
    addLog(`The System Architect executed an interrupt! Dealt ${damage} damage.`, 'boss');
    
    setTimeout(() => {
      setIsShaking(null);
      setTurn('player');
      setQIdx(prev => (prev + 1) % battleQuestions.length);
    }, 500);
  };

  const useAbility = () => {
    if (playerMana < 100 || turn !== 'player') return;
    const hero = CLASSES[p1Class];
    setPlayerMana(0);
    
    switch (p1Class) {
      case 'knight': setIsShieldActive(true); break;
      case 'mage': setIsBurstActive(true); break;
      case 'techno': setPlayerHp(prev => Math.min(playerMaxHp, prev + 60)); break;
      case 'rogue': addLog("Rogue agility increased!", 'ability'); break;
    }
    addLog(`Special Ability Activated: ${hero.ability}!`, 'ability');
  };

  if (view === 'setup') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-background-dark text-white font-display relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        <div className="relative z-10 text-center max-w-2xl">
          <h1 className="text-6xl font-black italic tracking-tighter mb-4 uppercase text-primary drop-shadow-[0_0_15px_rgba(19,236,128,0.5)]">Architect Raid</h1>
          <p className="text-slate-400 font-bold uppercase tracking-[0.3em] mb-12">The Ultimate RPG Battle for Coders</p>
          
          <div className="bg-slate-900/80 p-10 rounded-[48px] border-4 border-primary/20 backdrop-blur-xl">
            <h3 className="text-sm font-black uppercase text-slate-500 mb-8">Select Learning Path</h3>
            <div className="flex gap-4 mb-12">
              {(['python', 'cpp'] as const).map(l => (
                <button key={l} onClick={() => setSelectedLang(l)} className={`flex-1 py-4 rounded-2xl font-black uppercase transition-all border-4 ${selectedLang === l ? 'bg-primary text-slate-900 border-primary' : 'bg-white/5 border-white/5 text-slate-500 hover:text-white'}`}>
                  {l === 'cpp' ? 'C++' : l}
                </button>
              ))}
            </div>
            <button onClick={() => setView('hero')} className="w-full bg-primary text-slate-900 py-5 rounded-2xl font-black uppercase tracking-widest text-lg shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">Choose Your Hero</button>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'hero') {
    return (
      <div className="flex-1 flex flex-col p-10 bg-background-dark font-display text-white overflow-y-auto custom-scrollbar">
        <header className="mb-12 flex justify-between items-end">
          <div>
            <button onClick={() => setView('setup')} className="text-xs font-black uppercase text-slate-500 hover:text-primary mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">arrow_back</span> Back
            </button>
            <h2 className="text-4xl font-black uppercase tracking-tighter">Choose Your Character</h2>
          </div>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Active Path: {selectedLang.toUpperCase()}</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {(Object.keys(CLASSES) as PlayerClass[]).map(key => {
            const c = CLASSES[key];
            const isSelected = p1Class === key;
            return (
              <div 
                key={key} 
                onClick={() => setP1Class(key)}
                className={`p-8 rounded-[40px] border-4 cursor-pointer transition-all flex flex-col relative overflow-hidden group ${isSelected ? 'bg-primary/10 border-primary shadow-[0_0_30px_rgba(19,236,128,0.2)]' : 'bg-white/5 border-white/5 hover:border-white/20'}`}
              >
                <div className={`size-20 rounded-3xl mb-6 flex items-center justify-center bg-white/5 ${c.color} group-hover:scale-110 transition-transform`}>
                  <span className="material-symbols-outlined text-5xl font-black">{c.icon}</span>
                </div>
                <h3 className="text-xl font-black italic mb-2">{c.name}</h3>
                <div className="flex gap-4 mb-6">
                  <div className="flex items-center gap-1 text-[10px] font-black text-red-400">
                    <span className="material-symbols-outlined text-sm">favorite</span> {c.hp}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-black text-orange-400">
                    <span className="material-symbols-outlined text-sm">swords</span> {c.dmg}
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Ability</p>
                <p className="text-xs font-medium text-slate-300 mb-6">{c.abilityDesc}</p>
                <div className="mt-auto pt-4 border-t border-white/5">
                  <span className="text-[9px] font-black uppercase text-primary">Mastery: {c.preferredCategory}</span>
                </div>
              </div>
            );
          })}
        </div>
        
        <button onClick={startBattle} className="bg-primary text-slate-900 py-5 rounded-[32px] font-black uppercase tracking-[0.2em] text-xl shadow-2xl hover:scale-[1.02] active:scale-95 transition-all w-full md:w-auto md:px-20 mx-auto">Enter The Arena</button>
      </div>
    );
  }

  if (view === 'battle') {
    const hero = CLASSES[p1Class];
    const currentQ = battleQuestions[qIdx];
    
    return (
      <div className="flex-1 flex flex-col bg-slate-950 font-display text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>
        
        {/* Battle Stage */}
        <div className="h-[45%] relative flex items-center justify-between px-20 overflow-hidden">
           <div className="absolute inset-0 opacity-10 grayscale pointer-events-none bg-[url('https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=2000')] bg-center bg-cover"></div>
           
           {/* Player Hero */}
           <div className={`flex flex-col items-center gap-6 transition-transform duration-300 ${isShaking === 'player' ? 'animate-bounce' : ''}`}>
              <div className="relative">
                 <div className={`size-32 rounded-[40px] bg-slate-900 border-4 border-white/10 flex items-center justify-center ${hero.color} relative z-10 overflow-hidden shadow-2xl`}>
                    <span className="material-symbols-outlined text-7xl font-black">{hero.icon}</span>
                    {isShieldActive && <div className="absolute inset-0 bg-blue-500/30 animate-pulse"></div>}
                 </div>
                 <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-2 bg-black/40 blur-md rounded-full"></div>
              </div>
              <div className="w-48">
                 <div className="flex justify-between items-center mb-1 text-[10px] font-black uppercase">
                    <span>{hero.name}</span>
                    <span className="text-red-400">{playerHp}/{playerMaxHp}</span>
                 </div>
                 <div className="h-3 bg-white/5 rounded-full p-0.5 border border-white/10 overflow-hidden">
                    <div className="h-full bg-red-500 rounded-full transition-all duration-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]" style={{ width: `${(playerHp/playerMaxHp)*100}%` }}></div>
                 </div>
                 {/* Mana Bar */}
                 <div className="h-1.5 bg-white/5 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-primary transition-all duration-300" style={{ width: `${playerMana}%` }}></div>
                 </div>
              </div>
           </div>

           {/* VS Divider */}
           <div className="flex flex-col items-center gap-2 opacity-20">
              <span className="text-6xl font-black italic tracking-tighter">VS</span>
              <div className="h-px w-20 bg-white"></div>
           </div>

           {/* Boss */}
           <div className={`flex flex-col items-center gap-6 transition-transform duration-300 ${isShaking === 'boss' ? 'animate-ping' : ''}`}>
              <div className="relative">
                 <div className="size-48 rounded-full bg-slate-900 border-8 border-red-500/20 flex items-center justify-center text-red-500 relative z-10 shadow-[0_0_100px_rgba(239,68,68,0.1)]">
                    <span className="material-symbols-outlined text-9xl font-black">{BOSS.icon}</span>
                 </div>
                 <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-full h-4 bg-black/40 blur-lg rounded-full"></div>
              </div>
              <div className="w-64">
                 <div className="flex justify-between items-center mb-1 text-[10px] font-black uppercase">
                    <span className="text-red-500">{BOSS.name}</span>
                    <span className="text-red-500">{bossHp}/{BOSS.maxHp}</span>
                 </div>
                 <div className="h-4 bg-white/5 rounded-full p-1 border border-white/10 overflow-hidden">
                    <div className="h-full bg-red-600 rounded-full transition-all duration-500 shadow-[0_0_20px_rgba(239,68,68,0.6)]" style={{ width: `${(bossHp/BOSS.maxHp)*100}%` }}></div>
                 </div>
              </div>
           </div>
        </div>

        {/* Action Panel */}
        <div className="flex-1 bg-slate-900 border-t-4 border-white/5 p-10 flex gap-10">
           {/* Question Section */}
           <div className="flex-1 flex flex-col">
              <div className="flex items-center gap-4 mb-8">
                 <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${currentQ.category === hero.preferredCategory ? 'bg-primary text-slate-900' : 'bg-white/10 text-slate-400'}`}>
                    {currentQ.category}
                 </span>
                 {currentQ.category === hero.preferredCategory && (
                   <span className="text-[10px] font-black text-primary uppercase animate-pulse">Bonus Active!</span>
                 )}
              </div>
              <h3 className="text-2xl font-black mb-8 leading-tight italic">"{currentQ.q}"</h3>
              <div className="grid grid-cols-2 gap-4">
                 {currentQ.options.map((opt, i) => (
                    <button 
                      key={i} 
                      onClick={() => handleAnswer(i)}
                      disabled={turn !== 'player'}
                      className="p-6 rounded-3xl bg-white/5 border-2 border-white/5 hover:border-primary/50 text-left font-bold transition-all disabled:opacity-50"
                    >
                       <div className="flex gap-4 items-center">
                          <span className="size-8 rounded-lg bg-black/40 flex items-center justify-center text-xs font-black text-slate-500">{String.fromCharCode(65 + i)}</span>
                          <span>{opt}</span>
                       </div>
                    </button>
                 ))}
              </div>
           </div>

           {/* Sidebar Controls & Logs */}
           <div className="w-80 flex flex-col gap-6">
              <button 
                onClick={useAbility}
                disabled={playerMana < 100 || turn !== 'player'}
                className={`w-full py-6 rounded-[32px] border-4 font-black uppercase tracking-widest text-sm flex flex-col items-center gap-2 transition-all ${playerMana >= 100 ? 'bg-primary border-primary text-slate-900 shadow-lg shadow-primary/20' : 'bg-white/5 border-white/5 text-slate-600 cursor-not-allowed'}`}
              >
                 <span className="material-symbols-outlined text-4xl">{hero.icon}</span>
                 <span>Special Ability</span>
              </button>

              <div className="flex-1 bg-black/40 rounded-[32px] p-6 font-mono text-xs overflow-y-auto custom-scrollbar border border-white/5">
                 <p className="text-[9px] font-black uppercase text-slate-600 mb-4 tracking-widest">System Logs</p>
                 <div className="space-y-3">
                    {logs.map(log => (
                       <div key={log.id} className={`flex flex-col gap-1 ${log.type === 'boss' ? 'text-red-400' : log.type === 'player' ? 'text-blue-400' : log.type === 'ability' ? 'text-purple-400 font-bold' : log.type === 'success' ? 'text-primary' : 'text-slate-500'}`}>
                          <span className="text-[8px] opacity-30">{log.timestamp}</span>
                          <p className="leading-relaxed">{log.msg}</p>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>

        {/* Turn Indicator */}
        <div className={`absolute top-10 left-1/2 -translate-x-1/2 px-10 py-3 rounded-full font-black uppercase tracking-[0.4em] text-xs backdrop-blur-xl border-2 transition-all duration-500 ${turn === 'player' ? 'bg-primary/20 border-primary text-primary' : 'bg-red-500/20 border-red-500 text-red-500'}`}>
           {turn === 'player' ? 'Your Execution Turn' : 'System Architect Interrupting...'}
        </div>
      </div>
    );
  }

  if (view === 'result') {
    const win = bossHp <= 0;
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-10 bg-background-dark text-white font-display text-center">
         <div className={`size-48 rounded-[56px] flex items-center justify-center mb-10 rotate-6 shadow-2xl ${win ? 'bg-primary text-slate-900 shadow-primary/30' : 'bg-red-500 text-white shadow-red-500/30'}`}>
            <span className="material-symbols-outlined text-8xl font-black">{win ? 'workspace_premium' : 'heart_broken'}</span>
         </div>
         <h2 className="text-6xl font-black italic tracking-tighter mb-4 uppercase">{win ? 'Victory!' : 'Defeat'}</h2>
         <p className="text-xl text-slate-400 font-medium mb-12 max-w-md mx-auto">
            {win 
              ? `You have successfully dismantled The System Architect using ${selectedLang.toUpperCase()} logic. You earned 500 XP!` 
              : "The System Architect found a bug in your logic. Don't give up, refine your code and try again!"}
         </p>
         <div className="flex gap-4">
            <button onClick={onBack} className="bg-primary text-slate-900 px-12 py-5 rounded-2xl font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">Return To Base</button>
            <button onClick={() => setView('setup')} className="bg-white/5 border-2 border-white/5 px-12 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-white/10 transition-all">Try Again</button>
         </div>
      </div>
    );
  }

  return null;
};

export default GameView;
