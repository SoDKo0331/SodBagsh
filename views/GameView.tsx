
import React, { useState, useEffect, useMemo, useRef } from 'react';

// --- TYPES & CONFIGURATION ---

interface GameViewProps {
  user: { uid: string; email: string | null };
  onBack: () => void;
  onEarnBadge: (badgeId: string) => void;
  initialLanguage?: 'python' | 'cpp';
}

type ViewState = 'lobby' | 'mode-select' | 'raid-briefing' | 'raid-battle' | 'blitz-briefing' | 'blitz-battle' | 'victory' | 'defeat';
type PlayerClass = 'knight' | 'mage' | 'rogue' | 'techno';
type LeagueTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Master' | 'Grandmaster';
type LogType = 'player' | 'boss' | 'system' | 'ability' | 'error' | 'loot';

interface GameLog {
  id: string;
  text: string;
  type: LogType;
}

interface FloatingText {
  id: string;
  text: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  color: string;
}

const LEAGUES: Record<LeagueTier, { minXp: number; color: string; icon: string }> = {
  Bronze: { minXp: 0, color: 'text-orange-700', icon: 'shield' },
  Silver: { minXp: 500, color: 'text-slate-300', icon: 'shield' },
  Gold: { minXp: 1500, color: 'text-yellow-400', icon: 'local_police' },
  Platinum: { minXp: 3000, color: 'text-cyan-400', icon: 'verified' },
  Diamond: { minXp: 5000, color: 'text-indigo-400', icon: 'diamond' },
  Master: { minXp: 8000, color: 'text-rose-500', icon: 'military_tech' },
  Grandmaster: { minXp: 12000, color: 'text-amber-500', icon: 'workspace_premium' },
};

// Simplified Class Names (Mongolian/Simple English)
const CLASSES: Record<PlayerClass, { name: string; hp: number; dmg: number; icon: string; color: string; ability: string; description: string }> = {
  knight: { name: 'Хамгаалагч', hp: 300, dmg: 40, icon: 'shield', color: 'text-blue-400', ability: 'Бамбай', description: 'Амь ихтэй, хамгаалалт сайтай.' },
  mage: { name: 'Шидтэн', hp: 150, dmg: 80, icon: 'auto_fix', color: 'text-purple-400', ability: 'Тэсрэлт', description: 'Маш өндөр демэж өгнө.' },
  rogue: { name: 'Ангууч', hp: 200, dmg: 60, icon: 'bug_report', color: 'text-yellow-400', ability: 'Нэвт цохих', description: 'Тэнцвэртэй, хурдан довтолгоо.' },
  techno: { name: 'Хакер', hp: 220, dmg: 50, icon: 'memory', color: 'text-emerald-400', ability: 'Сэргээх', description: 'Өөрийгөө эмчлэх чадвартай.' },
};

// --- QUESTION DATA SEPARATION ---

const QUESTIONS = {
  python: {
    // Raid: Logic & Output Prediction (Harder)
    raid: [
      { q: "x = 10; x += 5; print(x)", options: ["10", "15", "5", "Error"], correct: 1, category: "Хувьсагч" },
      { q: "if 5 > 3 and 2 < 4:", options: ["True", "False", "Error", "None"], correct: 0, category: "Логик" },
      { q: "for i in range(3): print(i)", options: ["1 2 3", "0 1 2", "0 1 2 3", "Infinite"], correct: 1, category: "Давталт" },
      { q: "list = [1, 2]; list.append(3)", options: ["[1,2]", "[1,2,3]", "[3,1,2]", "Error"], correct: 1, category: "Жагсаалт" },
      { q: "def func(x): return x*x", options: ["x", "x^2", "Square", "Function"], correct: 1, category: "Функц" },
      { q: "print(bool('False'))", options: ["True", "False", "Error", "None"], correct: 0, category: "Type Casting" },
      { q: "x=[1]; y=x; y.append(2); print(x)", options: ["[1]", "[1, 2]", "[2]", "Error"], correct: 1, category: "Reference" },
      { q: "d={'a':1}; print(d.get('b', 0))", options: ["1", "None", "0", "Error"], correct: 2, category: "Dictionary" },
      { q: "print(type(1/2))", options: ["int", "float", "double", "decimal"], correct: 1, category: "Types" },
      { q: "print('a' * 3)", options: ["aaa", "a3", "Error", "abc"], correct: 0, category: "Strings" },
      { q: "x = 10; while x > 0: x -= 3", options: ["Infinite Loop", "x becomes -2", "x becomes 1", "x becomes 0"], correct: 2, category: "Loop Logic" },
      { q: "[x for x in range(3) if x > 0]", options: ["[0, 1, 2]", "[1, 2]", "[0, 1]", "[1]"], correct: 1, category: "Comprehension" },
      { q: "len(set([1,1,2,3]))", options: ["4", "3", "2", "Error"], correct: 1, category: "Sets" },
      { q: "not (True or False)", options: ["True", "False", "None", "Error"], correct: 1, category: "Boolean" },
      { q: "print(f'{2+2=}')", options: ["4", "2+2=4", "2+2", "Error"], correct: 1, category: "Formatting" }
    ],
    // Blitz: Fast Syntax & Basics (Easier/Faster)
    blitz: [
      { q: "print('Hi')", options: ["Hi", "print", "Error", "None"], correct: 0, category: "Syntax" },
      { q: "3 + 4", options: ["34", "12", "7", "Error"], correct: 2, category: "Math" },
      { q: "int('5')", options: ["5", "'5'", "Error", "Float"], correct: 0, category: "Type" },
      { q: "True = 1", options: ["Yes", "No", "Maybe", "Error"], correct: 0, category: "Bool" },
      { q: "# Comment", options: ["Code", "Text", "Comment", "Error"], correct: 2, category: "Syntax" },
      { q: "Power operator?", options: ["^", "**", "pow", "^^"], correct: 1, category: "Operators" },
      { q: "Not equal?", options: ["<>", "!=", "==", "not="], correct: 1, category: "Operators" },
      { q: "Define function?", options: ["func", "def", "function", "lambda"], correct: 1, category: "Keywords" },
      { q: "List brackets?", options: ["()", "{}", "[]", "<>"], correct: 2, category: "Syntax" },
      { q: "Modulo operator?", options: ["/", "%", "//", "mod"], correct: 1, category: "Math" },
      { q: "input() returns?", options: ["int", "str", "bool", "float"], correct: 1, category: "IO" },
      { q: "Which is immutable?", options: ["list", "dict", "set", "tuple"], correct: 3, category: "Types" },
      { q: "Start loop?", options: ["for", "loop", "repeat", "do"], correct: 0, category: "Keywords" },
      { q: "Logical AND", options: ["&", "&&", "and", "And"], correct: 2, category: "Logic" },
      { q: "Import lib?", options: ["include", "using", "require", "import"], correct: 3, category: "Modules" }
    ]
  },
  cpp: {
    raid: [
      { q: "int x=5; x++; cout << x;", options: ["5", "6", "4", "Error"], correct: 1, category: "Operator" },
      { q: "if(10 == 10)", options: ["True", "False", "Error", "10"], correct: 0, category: "Logic" },
      { q: "int arr[3] = {1,2,3}; arr[1]?", options: ["1", "2", "3", "Error"], correct: 1, category: "Array" },
      { q: "cout << 10 % 3;", options: ["3", "1", "0", "3.33"], correct: 1, category: "Math" },
      { q: "int x=5; int *p=&x; cout<<*p;", options: ["Address", "5", "Error", "*p"], correct: 1, category: "Pointers" },
      { q: "int x=2; x = x<<1;", options: ["1", "2", "4", "8"], correct: 2, category: "Bitwise" },
      { q: "bool b = 5;", options: ["True", "False", "Error", "5"], correct: 0, category: "Types" },
      { q: "sizeof(char)", options: ["1", "2", "4", "8"], correct: 0, category: "Memory" },
      { q: "cout << (5>3 ? 10 : 20);", options: ["5", "3", "10", "20"], correct: 2, category: "Ternary" },
      { q: "int i=0; while(i<3) i++;", options: ["i is 2", "i is 3", "i is 4", "Loop forever"], correct: 1, category: "Loops" },
      { q: "string s='A'; // Valid?", options: ["Yes", "No", "Maybe", "C++11"], correct: 1, category: "Syntax" },
      { q: "if(x=0) cout<<'A'; else cout<<'B';", options: ["A", "B", "Error", "AB"], correct: 1, category: "Logic" },
      { q: "float f = 5/2;", options: ["2.5", "2.0", "2", "Error"], correct: 1, category: "Types" },
      { q: "vector<int> v; v.push_back(1);", options: ["Size 0", "Size 1", "Error", "Null"], correct: 1, category: "STL" },
      { q: "char c = 65; cout << c;", options: ["65", "A", "Error", "c"], correct: 1, category: "ASCII" }
    ],
    blitz: [
      { q: "cout << 'Hi';", options: ["Hi", "cout", "Error", "None"], correct: 0, category: "Output" },
      { q: "int a;", options: ["Integer", "Float", "String", "Void"], correct: 0, category: "Type" },
      { q: "5 * 5", options: ["10", "25", "55", "5"], correct: 1, category: "Math" },
      { q: "Terminator?", options: [":", ".", ";", ","], correct: 2, category: "Syntax" },
      { q: "Logical OR", options: ["||", "or", "OR", "|"], correct: 0, category: "Logic" },
      { q: "Include lib?", options: ["import", "#include", "using", "package"], correct: 1, category: "Preprocessor" },
      { q: "Pointer symbol?", options: ["&", "*", "->", "@"], correct: 1, category: "Pointers" },
      { q: "New line?", options: ["\\n", "/n", "\\l", "endl()"], correct: 0, category: "Strings" },
      { q: "True value?", options: ["0", "1", "-1", "null"], correct: 1, category: "Bool" },
      { q: "Comment?", options: ["#", "//", "--", "<!--"], correct: 1, category: "Syntax" },
      { q: "Input stream?", options: ["cin", "cout", "cerr", "clog"], correct: 0, category: "IO" },
      { q: "Main returns?", options: ["void", "int", "float", "char"], correct: 1, category: "Functions" },
      { q: "Address of?", options: ["*", "&", "@", "#"], correct: 1, category: "Pointers" },
      { q: "Increment?", options: ["++", "+=", "inc", "add"], correct: 0, category: "Operators" },
      { q: "String header?", options: ["<string>", "<text>", "<str>", "<s.h>"], correct: 0, category: "Headers" }
    ]
  }
};

// --- COMPONENT ---

const GameView: React.FC<GameViewProps> = ({ user, onBack, onEarnBadge, initialLanguage = 'python' }) => {
  // Global State
  const [view, setView] = useState<ViewState>('lobby');
  const [playerXp, setPlayerXp] = useState(1250); 
  const [streak, setStreak] = useState(3);
  const [selectedLang, setSelectedLang] = useState(initialLanguage);
  const [selectedClass, setSelectedClass] = useState<PlayerClass>('knight');
  
  // Battle State (Raid)
  const [hp, setHp] = useState(100);
  const [maxHp, setMaxHp] = useState(100);
  const [mana, setMana] = useState(0);
  const [bossHp, setBossHp] = useState(1000);
  const [bossMaxHp, setBossMaxHp] = useState(1000);
  const [turn, setTurn] = useState<'player' | 'boss'>('player');
  const [logs, setLogs] = useState<GameLog[]>([]);
  const [qIdx, setQIdx] = useState(0);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [shake, setShake] = useState<'player' | 'boss' | null>(null);
  
  const isGameActive = useRef(false);

  // Blitz State
  const [blitzScore, setBlitzScore] = useState(0);
  const [blitzTimeLeft, setBlitzTimeLeft] = useState(60);
  const [isBlitzActive, setIsBlitzActive] = useState(false);

  // Computed
  const currentLeague = useMemo(() => {
    const tiers = Object.keys(LEAGUES) as LeagueTier[];
    for (let i = tiers.length - 1; i >= 0; i--) {
      if (playerXp >= LEAGUES[tiers[i]].minXp) return tiers[i];
    }
    return 'Bronze';
  }, [playerXp]);

  const nextLeagueXp = useMemo(() => {
    const tiers = Object.keys(LEAGUES) as LeagueTier[];
    const idx = tiers.indexOf(currentLeague);
    return idx < tiers.length - 1 ? LEAGUES[tiers[idx + 1]].minXp : 20000;
  }, [currentLeague]);

  // --- LOGIC: VISUAL EFFECTS ---

  const spawnFloatingText = (text: string, x: number, y: number, color: string) => {
    const id = Math.random().toString();
    setFloatingTexts(prev => [...prev, { id, text, x, y, color }]);
    setTimeout(() => {
        setFloatingTexts(prev => prev.filter(ft => ft.id !== id));
    }, 1000);
  };

  const triggerShake = (target: 'player' | 'boss') => {
    setShake(target);
    setTimeout(() => setShake(null), 500);
  };

  const addLog = (text: string, type: LogType) => {
    setLogs(prev => [{
      id: Math.random().toString(36).substr(2, 9),
      text,
      type
    }, ...prev].slice(0, 8)); 
  };

  // --- LOGIC: RAID MODE (Boss Tulaan) ---

  const initRaid = () => {
    setView('raid-briefing');
  };

  const startRaidMatch = () => {
    const hero = CLASSES[selectedClass];
    setHp(hero.hp);
    setMaxHp(hero.hp);
    setBossHp(1000);
    setBossMaxHp(1000);
    setMana(50);
    setTurn('player');
    setLogs([]);
    setFloatingTexts([]);
    addLog("Систем бэлэн. Босс гарч ирлээ!", "system");
    setQIdx(0);
    isGameActive.current = true;
    setView('raid-battle');
  };

  const handleRaidAnswer = (isCorrect: boolean) => {
    if (turn !== 'player' || !isGameActive.current) return;

    const hero = CLASSES[selectedClass];

    if (isCorrect) {
      // Correct Answer: Player Deals Damage, Boss skips turn (No damage taken)
      const isCrit = Math.random() > 0.8;
      const baseDmg = hero.dmg;
      const finalDmg = Math.floor(baseDmg * (isCrit ? 2 : 1) * (1 + (Math.random() * 0.2)));
      
      const newBossHp = Math.max(0, bossHp - finalDmg);
      setBossHp(newBossHp);
      
      // Visuals
      triggerShake('boss');
      spawnFloatingText(`-${finalDmg}`, 70, 40, isCrit ? 'text-yellow-400 scale-150' : 'text-white');
      
      addLog(
        isCrit ? `🔥 ОНЦ ЦОХИЛТ! ${finalDmg} хохирол өглөө.` : `🎯 ЗӨВ! ${finalDmg} хохирол өглөө.`,
        "player"
      );
      setMana(m => Math.min(100, m + 20));

      if (newBossHp === 0) {
        isGameActive.current = false;
        setTimeout(() => handleVictory(500), 1000); // 500 XP Reward
        return;
      }

      // Skip Boss Turn on Correct Answer (Safety)
      addLog("🛡️ Хариулт зөв тул Боссын довтолгоог хаав!", "system");
      spawnFloatingText("BLOCKED", 30, 30, 'text-blue-400');
      setQIdx(prev => prev + 1); // Next question immediately
      
    } else {
      // Wrong Answer: Player Misses, Boss Attacks
      spawnFloatingText("MISS", 70, 30, 'text-slate-500');
      addLog(`⚠️ БУРУУ! Код ажилласангүй.`, "error");
      
      setTurn('boss');
      setTimeout(processBossTurn, 1000);
    }
  };

  const processBossTurn = () => {
    if (!isGameActive.current) return;

    // Boss deals damage only if player was wrong
    let dmg = 40 + Math.floor(Math.random() * 20);

    setHp(prev => {
      const newHp = Math.max(0, prev - dmg);
      if (newHp <= 0) {
        isGameActive.current = false;
        setTimeout(() => setView('defeat'), 500);
      }
      return newHp;
    });

    triggerShake('player');
    spawnFloatingText(`-${dmg}`, 30, 40, 'text-red-500 scale-125');
    addLog(`👹 БОССЫН ЦОХИЛТ! ${dmg} хохирол авлаа.`, "boss");

    setTurn('player');
    setQIdx(prev => prev + 1);
  };

  const useAbility = () => {
    if (mana < 100 || turn !== 'player') return;
    setMana(0);
    const abilityName = CLASSES[selectedClass].ability;
    addLog(`⚡ ЧАДВАР: ${abilityName} идэвхжлээ!`, "ability");
    spawnFloatingText("ULTIMATE", 30, 20, 'text-purple-400 scale-150');
    
    // Ability Logic
    if (selectedClass === 'techno') { // Hacker
        const heal = 100;
        setHp(h => Math.min(maxHp, h + heal));
        spawnFloatingText(`+${heal}`, 30, 40, 'text-green-400');
        addLog(`💚 Сэргээлт: ${heal} амь нөхөв.`, "ability");
    }
    if (selectedClass === 'mage') { // Shidten
        const dmg = 300;
        setBossHp(h => Math.max(0, h - dmg)); 
        triggerShake('boss');
        spawnFloatingText(`-${dmg}`, 70, 40, 'text-purple-500 font-black scale-150');
        addLog(`🔮 Тэсрэлт: Босст ${dmg} хохирол!`, "ability");
    }
    if (selectedClass === 'knight') { // Hamgaalagch
        setHp(h => Math.min(maxHp, h + 50));
        addLog(`🛡️ Бамбай: Хамгаалалт сайжрав.`, "ability");
    }
    if (selectedClass === 'rogue') { // Anguuch
        const dmg = 150;
        setBossHp(h => Math.max(0, h - dmg));
        spawnFloatingText(`-${dmg}`, 70, 50, 'text-red-500');
        addLog(`💨 Нэвт цохилт: ${dmg} хохирол.`, "ability");
    }

    if (bossHp <= 0) { 
       setBossHp(prev => {
          if (prev <= 0) {
             isGameActive.current = false;
             setTimeout(() => handleVictory(500), 1000);
             return 0;
          }
          return prev;
       });
    }
  };

  // --- LOGIC: BLITZ MODE (Hurdnii Gal) ---

  const initBlitz = () => {
    setView('blitz-briefing');
  };

  const startBlitzMatch = () => {
    setBlitzScore(0);
    setBlitzTimeLeft(60);
    setIsBlitzActive(true);
    setQIdx(0);
    setView('blitz-battle');
  };

  useEffect(() => {
    let interval: any;
    if (isBlitzActive && blitzTimeLeft > 0) {
      interval = setInterval(() => setBlitzTimeLeft(t => t - 1), 1000);
    } else if (isBlitzActive && blitzTimeLeft === 0) {
      setIsBlitzActive(false);
      handleVictory(blitzScore * 20); 
    }
    return () => clearInterval(interval);
  }, [isBlitzActive, blitzTimeLeft, blitzScore]);

  const handleBlitzAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setBlitzScore(s => s + 1);
    } else {
      setBlitzTimeLeft(t => Math.max(0, t - 5)); // Penalty only on time
    }
    setQIdx(prev => prev + 1);
  };

  // --- SHARED HELPERS ---

  const handleVictory = (xpGain: number) => {
    setPlayerXp(prev => prev + xpGain);
    if (xpGain > 400) onEarnBadge('b8');
    setView('victory');
  };

  const getLogStyle = (type: LogType) => {
    switch (type) {
      case 'player': return 'text-emerald-400 bg-emerald-500/10 border-l-2 border-emerald-500';
      case 'boss': return 'text-red-400 bg-red-500/10 border-l-2 border-red-500';
      case 'ability': return 'text-purple-400 bg-purple-500/10 border-l-2 border-purple-500';
      case 'error': return 'text-orange-400 bg-orange-500/10 border-l-2 border-orange-500';
      case 'system': return 'text-slate-400 bg-slate-500/10 border-l-2 border-slate-500';
      default: return 'text-slate-400';
    }
  };

  // --- RENDERERS ---

  if (view === 'lobby') {
    return (
      <div className="flex-1 bg-[#09090b] text-white font-sans overflow-hidden relative flex flex-col">
        {/* Background FX */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 blur-3xl pointer-events-none"></div>

        {/* Navbar */}
        <div className="h-20 border-b border-white/10 flex items-center justify-between px-8 z-10 bg-[#09090b]/80 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="hover:bg-white/10 p-2 rounded-full transition-colors">
              <span className="material-symbols-outlined text-slate-400">arrow_back</span>
            </button>
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="material-symbols-outlined font-bold">swords</span>
              </div>
              <div>
                <h1 className="font-bold text-lg leading-none tracking-tight">GAME ARENA</h1>
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Season 4 • Week 2</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 px-4 py-1.5 rounded-full">
               <span className="material-symbols-outlined text-orange-500 text-lg">local_fire_department</span>
               <span className="text-xs font-bold text-orange-400">{streak} Day Streak</span>
            </div>
            
            <div className="text-right">
               <div className="text-xs font-bold text-slate-400 uppercase">{user.email?.split('@')[0]}</div>
               <div className={`text-sm font-black ${LEAGUES[currentLeague].color}`}>{currentLeague} League</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-8 z-10 custom-scrollbar">
          <div className="max-w-6xl mx-auto grid grid-cols-12 gap-8">
            
            {/* Left Col: Rank Card */}
            <div className="col-span-12 md:col-span-4 space-y-6">
              <div className="bg-[#18181b] rounded-3xl p-1 border border-white/10 relative overflow-hidden group hover:border-primary/50 transition-colors">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 z-10"></div>
                <div className={`absolute inset-0 opacity-10 bg-current ${LEAGUES[currentLeague].color}`}></div>
                
                <div className="relative z-20 p-6 flex flex-col items-center text-center">
                   <span className={`material-symbols-outlined text-8xl mb-4 ${LEAGUES[currentLeague].color} drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]`}>
                     {LEAGUES[currentLeague].icon}
                   </span>
                   <h2 className={`text-3xl font-black uppercase tracking-tighter mb-1 ${LEAGUES[currentLeague].color}`}>{currentLeague}</h2>
                   <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-6">Global Ranking: #1,204</p>
                   
                   <div className="w-full bg-black/50 h-3 rounded-full overflow-hidden mb-2 border border-white/5">
                     <div 
                       className={`h-full ${LEAGUES[currentLeague].color.replace('text', 'bg')} transition-all duration-1000`} 
                       style={{ width: `${Math.min(100, (playerXp / nextLeagueXp) * 100)}%` }}
                     ></div>
                   </div>
                   <div className="flex justify-between w-full text-[10px] font-mono text-slate-500">
                     <span>{playerXp} XP</span>
                     <span>{nextLeagueXp} XP</span>
                   </div>
                </div>
              </div>
            </div>

            {/* Right Col: Game Modes */}
            <div className="col-span-12 md:col-span-8">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">sports_esports</span>
                Select Mode
              </h3>

              <div className="grid gap-4">
                {/* Raid Card */}
                <button 
                  onClick={() => setView('mode-select')}
                  className="group relative h-40 rounded-3xl overflow-hidden text-left transition-all hover:scale-[1.01]"
                >
                   <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b')] bg-cover bg-center transition-transform duration-700 group-hover:scale-110"></div>
                   <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
                   <div className="absolute inset-0 border-2 border-white/10 rounded-3xl group-hover:border-primary/50 transition-colors"></div>
                   
                   <div className="relative z-10 p-8 flex flex-col justify-center h-full">
                      <div className="flex items-center gap-3 mb-2">
                         <span className="px-2 py-1 rounded bg-red-500 text-white text-[10px] font-black uppercase">Ranked</span>
                         <h4 className="text-3xl font-black italic tracking-tighter text-white">BOSS TULAAN (Raid)</h4>
                      </div>
                      <p className="text-slate-300 text-sm max-w-md">Боссыг ялж XP цуглуул. Зөв хариулбал хохирол авахгүй.</p>
                   </div>
                </button>

                {/* Blitz Card */}
                <button 
                  onClick={initBlitz}
                  className="group relative h-40 rounded-3xl overflow-hidden text-left transition-all hover:scale-[1.01]"
                >
                   <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518770660439-4636190af475')] bg-cover bg-center transition-transform duration-700 group-hover:scale-110"></div>
                   <div className="absolute inset-0 bg-gradient-to-r from-indigo-950 via-indigo-950/80 to-transparent"></div>
                   <div className="absolute inset-0 border-2 border-white/10 rounded-3xl group-hover:border-indigo-400/50 transition-colors"></div>
                   
                   <div className="relative z-10 p-8 flex flex-col justify-center h-full">
                      <div className="flex items-center gap-3 mb-2">
                         <span className="px-2 py-1 rounded bg-cyan-500 text-black text-[10px] font-black uppercase">Speed</span>
                         <h4 className="text-3xl font-black italic tracking-tighter text-white">HURDNII GAL (Blitz)</h4>
                      </div>
                      <p className="text-slate-300 text-sm max-w-md">60 секунд. Хурдан сэтгэж, өндөр оноо ав.</p>
                   </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- BRIEFING SCREENS ---

  if (view === 'raid-briefing') {
    return (
      <div className="flex-1 bg-black flex items-center justify-center p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-red-900/20 z-0"></div>
        <div className="relative z-10 max-w-2xl w-full bg-slate-900 border border-white/10 rounded-3xl p-10 shadow-2xl">
           <h1 className="text-4xl font-black text-red-500 mb-2 uppercase tracking-tighter">Боссын Тулаан</h1>
           <p className="text-slate-400 text-lg mb-8">Мэдлэгээрээ мангасыг ялах цаг ирлээ.</p>

           <div className="space-y-4 mb-10">
              <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl">
                 <span className="material-symbols-outlined text-yellow-400 text-3xl">emoji_events</span>
                 <div>
                    <h3 className="font-bold text-white uppercase">Зорилго: Боссын амийг 0 болгох</h3>
                    <p className="text-sm text-slate-400">Боссын амь (HP) дуусах үед та ялж, 500 XP авах болно.</p>
                 </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl">
                 <span className="material-symbols-outlined text-green-400 text-3xl">check_circle</span>
                 <div>
                    <h3 className="font-bold text-white uppercase">Зөв хариулбал: Довтолно</h3>
                    <p className="text-sm text-slate-400">Таны баатар Босс руу довтолж, та ямар ч хохирол авахгүй.</p>
                 </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl">
                 <span className="material-symbols-outlined text-red-400 text-3xl">cancel</span>
                 <div>
                    <h3 className="font-bold text-white uppercase">Буруу хариулбал: Хохирол авна</h3>
                    <p className="text-sm text-slate-400">Таны довтолгоо бүтэлгүйтэж, Босс таныг цохих болно.</p>
                 </div>
              </div>
           </div>

           <div className="flex gap-4">
              <button onClick={() => setView('mode-select')} className="flex-1 py-4 rounded-xl font-bold uppercase text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                Буцах
              </button>
              <button onClick={startRaidMatch} className="flex-[2] py-4 bg-red-600 hover:bg-red-500 text-white rounded-xl font-black uppercase tracking-widest shadow-lg shadow-red-600/20 transition-all transform hover:scale-105">
                Тулааныг эхлүүлэх
              </button>
           </div>
        </div>
      </div>
    );
  }

  if (view === 'blitz-briefing') {
    return (
      <div className="flex-1 bg-black flex items-center justify-center p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-900/20 z-0"></div>
        <div className="relative z-10 max-w-2xl w-full bg-slate-900 border border-white/10 rounded-3xl p-10 shadow-2xl">
           <h1 className="text-4xl font-black text-cyan-400 mb-2 uppercase tracking-tighter">Хурдны Гал</h1>
           <p className="text-slate-400 text-lg mb-8">Хугацаатай уралдаж, рефлексээ шалга.</p>

           <div className="space-y-4 mb-10">
              <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl">
                 <span className="material-symbols-outlined text-yellow-400 text-3xl">timer</span>
                 <div>
                    <h3 className="font-bold text-white uppercase">Хугацаа: 60 секунд</h3>
                    <p className="text-sm text-slate-400">Цаг дуусахаас өмнө аль болох олон асуултанд хариул.</p>
                 </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl">
                 <span className="material-symbols-outlined text-green-400 text-3xl">add_circle</span>
                 <div>
                    <h3 className="font-bold text-white uppercase">Зөв хариулт: +1 Оноо</h3>
                    <p className="text-sm text-slate-400">Зөв хариулах бүрт оноо нэмэгдэнэ.</p>
                 </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl">
                 <span className="material-symbols-outlined text-red-400 text-3xl">remove_circle</span>
                 <div>
                    <h3 className="font-bold text-white uppercase">Буруу хариулт: -5 Секунд</h3>
                    <p className="text-sm text-slate-400">Буруу хариулбал таны хугацаанаас хасна.</p>
                 </div>
              </div>
           </div>

           <div className="flex gap-4">
              <button onClick={() => setView('lobby')} className="flex-1 py-4 rounded-xl font-bold uppercase text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                Буцах
              </button>
              <button onClick={startBlitzMatch} className="flex-[2] py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-black uppercase tracking-widest shadow-lg shadow-cyan-600/20 transition-all transform hover:scale-105">
                Эхлүүлэх
              </button>
           </div>
        </div>
      </div>
    );
  }

  // --- MODE SELECT (HERO SELECT) ---
  if (view === 'mode-select') {
    return (
      <div className="flex-1 bg-[#09090b] p-8 flex flex-col">
        <header className="mb-8">
           <button onClick={() => setView('lobby')} className="text-slate-400 hover:text-white flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-widest">
             <span className="material-symbols-outlined text-sm">arrow_back</span> Return to Lobby
           </button>
           <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Баатар Сонгох</h2>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
           {(Object.keys(CLASSES) as PlayerClass[]).map(key => {
             const c = CLASSES[key];
             const isSel = selectedClass === key;
             return (
               <div 
                 key={key}
                 onClick={() => setSelectedClass(key)}
                 className={`cursor-pointer rounded-3xl p-6 border-2 flex flex-col transition-all relative overflow-hidden group ${isSel ? 'bg-primary/10 border-primary' : 'bg-[#18181b] border-white/5 hover:border-white/20'}`}
               >
                 <div className={`size-16 rounded-2xl flex items-center justify-center mb-6 text-3xl ${c.color} bg-white/5 group-hover:scale-110 transition-transform`}>
                    <span className="material-symbols-outlined">{c.icon}</span>
                 </div>
                 <h3 className="text-xl font-black text-white uppercase italic mb-1">{c.name}</h3>
                 <p className="text-xs text-slate-400 mb-6">{c.description}</p>
                 
                 <div className="mt-auto space-y-2">
                    <div className="flex justify-between text-[10px] font-bold uppercase text-slate-500">
                      <span>Амь (HP)</span>
                      <span className="text-white">{c.hp}</span>
                    </div>
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                       <div className="h-full bg-red-500" style={{width: `${(c.hp/300)*100}%`}}></div>
                    </div>
                    <div className="flex justify-between text-[10px] font-bold uppercase text-slate-500 pt-1">
                      <span>Хүч (DMG)</span>
                      <span className="text-white">{c.dmg}</span>
                    </div>
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                       <div className="h-full bg-orange-500" style={{width: `${(c.dmg/80)*100}%`}}></div>
                    </div>
                 </div>
               </div>
             );
           })}
        </div>
        
        <div className="mt-8 flex justify-center">
           <button onClick={initRaid} className="bg-primary hover:bg-primary-hover text-black px-12 py-4 rounded-2xl font-black uppercase tracking-widest text-lg shadow-xl shadow-primary/20 hover:scale-105 transition-all">
             Үргэлжлүүлэх
           </button>
        </div>
      </div>
    );
  }

  // --- BATTLE UI (RAID) ---
  if (view === 'raid-battle') {
    const hero = CLASSES[selectedClass];
    // Use RAID questions specifically
    const qData = QUESTIONS[selectedLang].raid;
    const question = qData[Math.abs(qIdx) % qData.length];

    return (
      <div className="flex-1 bg-slate-950 flex flex-col font-sans relative overflow-hidden">
        {/* Background Atmosphere */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/20 to-black pointer-events-none"></div>

        {/* Floating Text Container (Absolute) */}
        <div className="absolute inset-0 pointer-events-none z-50">
             {floatingTexts.map(ft => (
                <div 
                   key={ft.id} 
                   className={`absolute text-2xl font-black drop-shadow-lg animate-out fade-out slide-out-to-top-10 duration-1000 ${ft.color}`}
                   style={{ left: `${ft.x}%`, top: `${ft.y}%` }}
                >
                   {ft.text}
                </div>
             ))}
        </div>

        {/* Top HUD */}
        <div className="h-24 px-8 flex items-center justify-between relative z-10">
           {/* Boss HP */}
           <div className="w-1/3">
              <div className="flex justify-between text-xs font-bold uppercase text-red-400 mb-1">
                <span>System Boss</span>
                <span>{bossHp}/{bossMaxHp}</span>
              </div>
              <div className="h-4 bg-slate-900 rounded-full border border-white/10 overflow-hidden relative">
                 <div className="absolute inset-0 bg-red-900/50"></div>
                 <div className="h-full bg-red-500 transition-all duration-300" style={{width: `${(bossHp/bossMaxHp)*100}%`}}></div>
              </div>
           </div>

           <div className="flex flex-col items-center">
              <div className="text-4xl font-black italic text-white/10 tracking-tighter select-none">VS</div>
              <div className="bg-slate-800/80 px-3 py-1 rounded-full border border-white/10 mt-1">
                 <span className="text-[10px] font-bold text-yellow-400 uppercase tracking-widest">ЗОРИЛГО: БОССЫГ УСТГА!</span>
              </div>
           </div>

           {/* Player HP */}
           <div className="w-1/3 text-right">
              <div className="flex justify-between text-xs font-bold uppercase text-blue-400 mb-1">
                <span>{hero.name}</span>
                <span>{hp}/{maxHp}</span>
              </div>
              <div className="h-4 bg-slate-900 rounded-full border border-white/10 overflow-hidden relative">
                 <div className="absolute inset-0 bg-blue-900/50"></div>
                 <div className="h-full bg-blue-500 transition-all duration-300" style={{width: `${(hp/maxHp)*100}%`}}></div>
              </div>
           </div>
        </div>

        {/* Middle: Visuals */}
        <div className="flex-1 flex items-center justify-center relative z-10 gap-32">
           {/* Boss Visual */}
           <div className={`transition-transform duration-300 ${shake === 'boss' ? 'translate-x-2' : ''} ${turn === 'boss' ? 'scale-110 drop-shadow-[0_0_50px_rgba(239,68,68,0.5)]' : 'scale-100 opacity-80'}`}>
              <div className="size-40 rounded-full bg-slate-900 border-4 border-red-500 flex items-center justify-center shadow-2xl relative">
                 <span className="material-symbols-outlined text-8xl text-red-500">token</span>
              </div>
           </div>

           {/* Player Visual */}
           <div className={`transition-transform duration-300 ${shake === 'player' ? '-translate-x-2' : ''} ${turn === 'player' ? 'scale-110 drop-shadow-[0_0_50px_rgba(59,130,246,0.5)]' : 'scale-100 opacity-80'}`}>
              <div className={`size-32 rounded-3xl bg-slate-900 border-4 ${hero.color.replace('text', 'border')} flex items-center justify-center shadow-2xl`}>
                 <span className={`material-symbols-outlined text-6xl ${hero.color}`}>{hero.icon}</span>
              </div>
           </div>
        </div>

        {/* Console Log */}
        <div className="absolute top-28 left-1/2 -translate-x-1/2 w-96 max-h-32 overflow-hidden flex flex-col-reverse gap-1 p-2 mask-linear-fade pointer-events-none">
           {logs.map((log) => (
             <div 
                key={log.id} 
                className={`text-[10px] font-mono font-bold px-3 py-1.5 rounded animate-in slide-in-from-bottom-2 fade-in shadow-sm border-l-2 ${getLogStyle(log.type)}`}
             >
                {log.text}
             </div>
           ))}
        </div>

        {/* Bottom: Controls */}
        <div className="h-[45%] bg-white/5 backdrop-blur-md border-t border-white/10 p-8 flex gap-8 relative z-20">
           {/* Question */}
           <div className="flex-1 flex flex-col justify-center">
              <span className="text-primary text-[10px] font-black uppercase tracking-widest mb-2">Төрөл: {question.category}</span>
              <h3 className="text-2xl font-mono text-white mb-8">{question.q}</h3>
              <div className="grid grid-cols-2 gap-4">
                 {question.options.map((opt, i) => (
                   <button 
                     key={i}
                     disabled={turn !== 'player'}
                     onClick={() => handleRaidAnswer(i === question.correct)}
                     className="bg-slate-900/50 border border-white/10 hover:border-primary hover:bg-primary/10 text-white py-4 px-6 rounded-xl font-bold text-left transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-4 active:scale-95"
                   >
                     <span className="bg-white/10 size-6 rounded flex items-center justify-center text-xs">{String.fromCharCode(65+i)}</span>
                     {opt}
                   </button>
                 ))}
              </div>
           </div>

           {/* Abilities */}
           <div className="w-64 border-l border-white/10 pl-8 flex flex-col justify-center gap-4">
              <div className="text-center mb-2">
                 <div className="text-[10px] font-bold uppercase text-slate-500 mb-1">Energy</div>
                 <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-400 transition-all" style={{width: `${mana}%`}}></div>
                 </div>
              </div>
              <button 
                disabled={mana < 100 || turn !== 'player'}
                onClick={useAbility}
                className={`w-full py-8 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${mana >= 100 ? 'bg-yellow-400 border-yellow-400 text-black shadow-[0_0_30px_rgba(250,204,21,0.4)] animate-pulse' : 'bg-slate-800 border-slate-700 text-slate-500 opacity-50 cursor-not-allowed'}`}
              >
                 <span className="material-symbols-outlined text-4xl">{hero.icon}</span>
                 <span className="font-black uppercase text-xs tracking-widest">{hero.ability}</span>
              </button>
              <button onClick={() => setView('lobby')} className="text-xs text-red-500 font-bold uppercase hover:underline text-center">Бууж өгөх</button>
           </div>
        </div>
      </div>
    );
  }

  // --- BLITZ MODE UI ---
  if (view === 'blitz-battle') {
    // Use BLITZ questions
    const qData = QUESTIONS[selectedLang].blitz;
    const question = qData[Math.abs(qIdx) % qData.length];

    return (
      <div className="flex-1 bg-indigo-950 flex flex-col items-center justify-center relative overflow-hidden">
         {/* Timer Background */}
         <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
            <span className="text-[20rem] font-black text-white tabular-nums">{blitzTimeLeft}</span>
         </div>

         <div className="relative z-10 w-full max-w-2xl px-6">
            <div className="flex justify-between items-end mb-8 text-white">
               <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest opacity-60">Оноо</div>
                  <div className="text-6xl font-black">{blitzScore}</div>
               </div>
               <div className="text-right">
                  <div className="text-[10px] font-bold uppercase tracking-widest opacity-60">Хугацаа</div>
                  <div className={`text-4xl font-black tabular-nums ${blitzTimeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-white'}`}>{blitzTimeLeft}s</div>
               </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-10 rounded-[40px] shadow-2xl">
               <h3 className="text-2xl font-bold text-white mb-8 text-center">{question.q}</h3>
               <div className="grid grid-cols-1 gap-3">
                  {question.options.map((opt, i) => (
                    <button 
                      key={i}
                      onClick={() => handleBlitzAnswer(i === question.correct)}
                      className="bg-black/20 hover:bg-white/20 text-white font-bold py-4 rounded-xl border border-white/10 transition-transform active:scale-95"
                    >
                      {opt}
                    </button>
                  ))}
               </div>
            </div>
         </div>
      </div>
    );
  }

  // --- VICTORY / DEFEAT ---
  if (view === 'victory' || view === 'defeat') {
    const isWin = view === 'victory';
    return (
      <div className="flex-1 bg-black flex items-center justify-center relative overflow-hidden">
        <div className={`absolute inset-0 opacity-20 bg-cover bg-center ${isWin ? 'bg-green-900' : 'bg-red-900'}`}></div>
        <div className="relative z-10 text-center text-white">
           <span className={`material-symbols-outlined text-9xl mb-6 ${isWin ? 'text-yellow-400' : 'text-red-500'}`}>
             {isWin ? 'emoji_events' : 'sentiment_broken'}
           </span>
           <h1 className="text-8xl font-black uppercase italic tracking-tighter mb-4">{isWin ? 'ЯЛАЛТ!' : 'ЯЛАГДАЛ'}</h1>
           <p className="text-xl text-slate-400 font-bold uppercase tracking-widest mb-12">
             {isWin ? '+500 XP Авсан' : 'Дараа дахин хичээгээрэй'}
           </p>
           <button onClick={() => setView('lobby')} className="bg-white text-black px-12 py-4 rounded-full font-black uppercase tracking-widest hover:scale-105 transition-transform">
             Буцах
           </button>
        </div>
      </div>
    );
  }

  return null;
};

export default GameView;
