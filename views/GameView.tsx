
import React, { useState, useEffect, useMemo } from 'react';

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

const LEAGUES: Record<LeagueTier, { minXp: number; color: string; icon: string }> = {
  Bronze: { minXp: 0, color: 'text-orange-700', icon: 'shield' },
  Silver: { minXp: 500, color: 'text-slate-300', icon: 'shield' },
  Gold: { minXp: 1500, color: 'text-yellow-400', icon: 'local_police' },
  Platinum: { minXp: 3000, color: 'text-cyan-400', icon: 'verified' },
  Diamond: { minXp: 5000, color: 'text-indigo-400', icon: 'diamond' },
  Master: { minXp: 8000, color: 'text-rose-500', icon: 'military_tech' },
  Grandmaster: { minXp: 12000, color: 'text-amber-500', icon: 'workspace_premium' },
};

const CLASSES: Record<PlayerClass, { name: string; hp: number; dmg: number; icon: string; color: string; ability: string; description: string }> = {
  knight: { name: 'Syntax Tank', hp: 200, dmg: 25, icon: 'shield', color: 'text-blue-400', ability: 'Firewall', description: 'Blocks 80% of incoming damage.' },
  mage: { name: 'Logic Mage', hp: 100, dmg: 60, icon: 'auto_fix', color: 'text-purple-400', ability: 'Overclock', description: 'Next attack deals 2.5x damage.' },
  rogue: { name: 'Bug Hunter', hp: 140, dmg: 40, icon: 'bug_report', color: 'text-yellow-400', ability: 'Hotfix', description: '50% chance to dodge damage.' },
  techno: { name: 'Net Runner', hp: 160, dmg: 30, icon: 'memory', color: 'text-emerald-400', ability: 'Reboot', description: 'Heals 50 HP instantly.' },
};

const QUESTIONS = {
  python: [
    { q: "type(3.14) returns?", options: ["int", "float", "str", "double"], correct: 1, category: "Data Types" },
    { q: "len('Hello')", options: ["4", "5", "6", "Error"], correct: 1, category: "Functions" },
    { q: "x = [1,2]; x.append(3)", options: ["[1,2,3]", "[3,1,2]", "[1,2]", "Error"], correct: 0, category: "Lists" },
    { q: "True and False", options: ["True", "False", "None", "Error"], correct: 1, category: "Logic" },
    { q: "5 // 2", options: ["2.5", "2", "3", "2.0"], correct: 1, category: "Math" },
    { q: "What closes a loop?", options: ["stop", "exit", "break", "end"], correct: 2, category: "Control Flow" },
    { q: "def func():", options: ["Function", "Class", "Variable", "Loop"], correct: 0, category: "Syntax" },
    { q: "'a' in 'apple'", options: ["True", "False", "Error", "None"], correct: 0, category: "Operators" },
  ],
  cpp: [
    { q: "int x = 5.5;", options: ["x is 5", "x is 6", "x is 5.5", "Error"], correct: 0, category: "Types" },
    { q: "std::cout <<", options: ["Input", "Output", "Error", "File"], correct: 1, category: "IO" },
    { q: "vector size()", options: ["Length", "Capacity", "Elements", "Bytes"], correct: 2, category: "STL" },
    { q: "&& operator", options: ["OR", "AND", "NOT", "XOR"], correct: 1, category: "Logic" },
    { q: "Pointer size (64-bit)", options: ["2 bytes", "4 bytes", "8 bytes", "16 bytes"], correct: 2, category: "Memory" },
  ]
};

// --- COMPONENT ---

const GameView: React.FC<GameViewProps> = ({ user, onBack, onEarnBadge, initialLanguage = 'python' }) => {
  // Global State
  const [view, setView] = useState<ViewState>('lobby');
  const [playerXp, setPlayerXp] = useState(1250); // Demo initial XP
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
  const [logs, setLogs] = useState<string[]>([]);
  const [qIdx, setQIdx] = useState(0);
  
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

  // --- LOGIC: RAID MODE ---

  const initRaid = () => {
    const hero = CLASSES[selectedClass];
    setHp(hero.hp);
    setMaxHp(hero.hp);
    setBossHp(1000);
    setBossMaxHp(1000);
    setMana(50);
    setTurn('player');
    setLogs(["System initialized. Boss detected."]);
    setQIdx(0);
    setView('raid-battle');
  };

  const handleRaidAnswer = (isCorrect: boolean) => {
    if (turn !== 'player') return;

    if (isCorrect) {
      const dmg = CLASSES[selectedClass].dmg * (Math.random() > 0.8 ? 2 : 1); // Crit chance
      const newBossHp = Math.max(0, bossHp - dmg);
      setBossHp(newBossHp);
      setLogs(prev => [`> HIT! Dealt ${dmg} damage.`, ...prev.slice(0, 4)]);
      setMana(m => Math.min(100, m + 20));

      if (newBossHp === 0) {
        handleVictory(500); // 500 XP for boss kill
        return;
      }
    } else {
      setLogs(prev => [`> MISS! Syntax error detected.`, ...prev.slice(0, 4)]);
    }

    setTurn('boss');
    setTimeout(processBossTurn, 800);
  };

  const processBossTurn = () => {
    // Boss Logic
    const dmg = 25 + Math.floor(Math.random() * 15);
    setHp(prev => {
      const newHp = Math.max(0, prev - dmg);
      if (newHp <= 0) {
        setTimeout(() => setView('defeat'), 100);
      }
      return newHp;
    });
    setLogs(prev => [`> WARNING! Took ${dmg} damage.`, ...prev.slice(0, 4)]);
    setTurn('player');
    setQIdx(prev => prev + 1); // Next question
  };

  const useAbility = () => {
    if (mana < 100) return;
    setMana(0);
    setLogs(prev => [`> ULTIMATE: ${CLASSES[selectedClass].ability} activated!`, ...prev]);
    
    // Ability Logic
    if (selectedClass === 'techno') setHp(h => Math.min(maxHp, h + 50));
    if (selectedClass === 'mage') setBossHp(h => Math.max(0, h - 150)); // Big nuke
    // Others handled in dmg calc logic (simplified here for brevity)
  };

  // --- LOGIC: BLITZ MODE ---

  const initBlitz = () => {
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
      handleVictory(blitzScore * 20); // 20 XP per correct answer
    }
    return () => clearInterval(interval);
  }, [isBlitzActive, blitzTimeLeft, blitzScore]);

  const handleBlitzAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setBlitzScore(s => s + 1);
    } else {
      setBlitzTimeLeft(t => Math.max(0, t - 5)); // Penalty
    }
    setQIdx(prev => prev + 1);
  };

  // --- SHARED HELPERS ---

  const handleVictory = (xpGain: number) => {
    setPlayerXp(prev => prev + xpGain);
    if (xpGain > 400) onEarnBadge('b8'); // Badge for big wins
    setView('victory');
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
            {/* Streak Widget */}
            <div className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 px-4 py-1.5 rounded-full">
               <span className="material-symbols-outlined text-orange-500 text-lg">local_fire_department</span>
               <span className="text-xs font-bold text-orange-400">{streak} Day Streak</span>
            </div>
            
            {/* Profile Widget */}
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
                   
                   {/* Progress Bar */}
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

              {/* Stats Mini */}
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-[#18181b] p-4 rounded-2xl border border-white/5">
                    <div className="text-slate-500 text-[10px] uppercase font-bold mb-1">Win Rate</div>
                    <div className="text-2xl font-bold text-white">68%</div>
                 </div>
                 <div className="bg-[#18181b] p-4 rounded-2xl border border-white/5">
                    <div className="text-slate-500 text-[10px] uppercase font-bold mb-1">Total Kills</div>
                    <div className="text-2xl font-bold text-emerald-400">42</div>
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
                         <h4 className="text-3xl font-black italic tracking-tighter text-white">BOSS RAID</h4>
                      </div>
                      <p className="text-slate-300 text-sm max-w-md">Battle AI Architects in turn-based combat. Use syntax knowledge to deal damage.</p>
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
                         <h4 className="text-3xl font-black italic tracking-tighter text-white">SYNTAX BLITZ</h4>
                      </div>
                      <p className="text-slate-300 text-sm max-w-md">60 seconds. Unlimited questions. How fast can you debug?</p>
                   </div>
                </button>
              </div>
              
              {/* Leaderboard Teaser */}
              <div className="mt-8 bg-[#18181b] rounded-3xl border border-white/5 p-6">
                 <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-sm uppercase tracking-wider text-slate-400">Global Top 3</h4>
                    <button className="text-xs text-primary font-bold hover:underline">View All</button>
                 </div>
                 {[
                   { name: "CodeNinja_99", xp: "15,420", rank: 1 },
                   { name: "Python_Gawd", xp: "14,100", rank: 2 },
                   { name: "Algo_Rhythm", xp: "13,850", rank: 3 },
                 ].map((p, i) => (
                   <div key={i} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                      <div className="flex items-center gap-4">
                         <span className={`font-black font-mono text-lg w-6 ${i===0 ? 'text-yellow-400': i===1 ? 'text-slate-300' : 'text-orange-700'}`}>#{p.rank}</span>
                         <span className="font-bold text-sm">{p.name}</span>
                      </div>
                      <span className="font-mono text-xs text-slate-500">{p.xp} XP</span>
                   </div>
                 ))}
              </div>

            </div>
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
           <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Choose Loadout</h2>
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
                      <span>HP</span>
                      <span className="text-white">{c.hp}</span>
                    </div>
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                       <div className="h-full bg-red-500" style={{width: `${(c.hp/200)*100}%`}}></div>
                    </div>
                    <div className="flex justify-between text-[10px] font-bold uppercase text-slate-500 pt-1">
                      <span>DMG</span>
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
             Start Match
           </button>
        </div>
      </div>
    );
  }

  // --- BATTLE UI (RAID) ---
  if (view === 'raid-battle') {
    const hero = CLASSES[selectedClass];
    // Modulo arithmetic for infinite question looping
    const qData = QUESTIONS[selectedLang];
    const question = qData[qIdx % qData.length];

    return (
      <div className="flex-1 bg-slate-950 flex flex-col font-sans relative overflow-hidden">
        {/* Background Atmosphere */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/20 to-black pointer-events-none"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full border-x border-white/5 pointer-events-none"></div>

        {/* Top HUD */}
        <div className="h-24 px-8 flex items-center justify-between relative z-10">
           {/* Boss HP */}
           <div className="w-1/3">
              <div className="flex justify-between text-xs font-bold uppercase text-red-400 mb-1">
                <span>System Architect</span>
                <span>{bossHp}/{bossMaxHp}</span>
              </div>
              <div className="h-4 bg-slate-900 rounded-full border border-white/10 overflow-hidden relative">
                 <div className="absolute inset-0 bg-red-900/50"></div>
                 <div className="h-full bg-red-500 transition-all duration-300" style={{width: `${(bossHp/bossMaxHp)*100}%`}}></div>
              </div>
           </div>

           {/* VS Indicator */}
           <div className="text-4xl font-black italic text-white/10 tracking-tighter select-none">VS</div>

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
           <div className={`transition-transform duration-500 ${turn === 'boss' ? 'scale-110 drop-shadow-[0_0_50px_rgba(239,68,68,0.5)]' : 'scale-100 opacity-80'}`}>
              <div className="size-40 rounded-full bg-slate-900 border-4 border-red-500 flex items-center justify-center shadow-2xl">
                 <span className="material-symbols-outlined text-8xl text-red-500">token</span>
              </div>
           </div>

           {/* Player Visual */}
           <div className={`transition-transform duration-500 ${turn === 'player' ? 'scale-110 drop-shadow-[0_0_50px_rgba(59,130,246,0.5)]' : 'scale-100 opacity-80'}`}>
              <div className={`size-32 rounded-3xl bg-slate-900 border-4 ${hero.color.replace('text', 'border')} flex items-center justify-center shadow-2xl`}>
                 <span className={`material-symbols-outlined text-6xl ${hero.color}`}>{hero.icon}</span>
              </div>
           </div>
        </div>

        {/* Console Log */}
        <div className="absolute top-28 left-1/2 -translate-x-1/2 w-96 h-24 overflow-hidden text-center space-y-1 mask-linear-fade">
           {logs.map((log, i) => (
             <div key={i} className={`text-xs font-mono font-bold ${log.includes('HIT') ? 'text-green-400' : log.includes('WARNING') ? 'text-red-400' : 'text-slate-500'} animate-in slide-in-from-bottom-2 fade-in`}>{log}</div>
           ))}
        </div>

        {/* Bottom: Controls */}
        <div className="h-[45%] bg-white/5 backdrop-blur-md border-t border-white/10 p-8 flex gap-8 relative z-20">
           {/* Question */}
           <div className="flex-1 flex flex-col justify-center">
              <span className="text-primary text-[10px] font-black uppercase tracking-widest mb-2">Target Protocol: {question.category}</span>
              <h3 className="text-2xl font-mono text-white mb-8">{question.q}</h3>
              <div className="grid grid-cols-2 gap-4">
                 {question.options.map((opt, i) => (
                   <button 
                     key={i}
                     disabled={turn !== 'player'}
                     onClick={() => handleRaidAnswer(i === question.correct)}
                     className="bg-slate-900/50 border border-white/10 hover:border-primary hover:bg-primary/10 text-white py-4 px-6 rounded-xl font-bold text-left transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-4"
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
                 <div className="text-[10px] font-bold uppercase text-slate-500 mb-1">Ultimate Charge</div>
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
              <button onClick={() => setView('lobby')} className="text-xs text-red-500 font-bold uppercase hover:underline text-center">Forfeit Match</button>
           </div>
        </div>
      </div>
    );
  }

  // --- BLITZ MODE UI ---
  if (view === 'blitz-battle') {
    const qData = QUESTIONS[selectedLang];
    const question = qData[qIdx % qData.length];

    return (
      <div className="flex-1 bg-indigo-950 flex flex-col items-center justify-center relative overflow-hidden">
         {/* Timer Background */}
         <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
            <span className="text-[20rem] font-black text-white tabular-nums">{blitzTimeLeft}</span>
         </div>

         <div className="relative z-10 w-full max-w-2xl px-6">
            <div className="flex justify-between items-end mb-8 text-white">
               <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest opacity-60">Current Score</div>
                  <div className="text-6xl font-black">{blitzScore}</div>
               </div>
               <div className="text-right">
                  <div className="text-[10px] font-bold uppercase tracking-widest opacity-60">Time Remaining</div>
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
           <h1 className="text-8xl font-black uppercase italic tracking-tighter mb-4">{isWin ? 'VICTORY' : 'DEFEATED'}</h1>
           <p className="text-xl text-slate-400 font-bold uppercase tracking-widest mb-12">
             {isWin ? '+500 XP Gained' : 'System Logic Failed'}
           </p>
           <button onClick={() => setView('lobby')} className="bg-white text-black px-12 py-4 rounded-full font-black uppercase tracking-widest hover:scale-105 transition-transform">
             Return to Lobby
           </button>
        </div>
      </div>
    );
  }

  return null;
};

export default GameView;
