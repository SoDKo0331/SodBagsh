
import React, { useState, useEffect } from 'react';
import type { User } from "firebase/auth";

interface GameViewProps {
  user: User;
  onBack: () => void;
}

type PlayerClass = 'knight' | 'mage' | 'rogue' | 'techno';

interface Question {
  q: string;
  options: string[];
  correct: number;
  explanation: string;
}

const QUESTIONS: Question[] = [
  { q: "int arr[5] = {1, 2, 3}; arr[4] хэд вэ?", options: ["3", "0", "Алдаа", "Хоосон"], correct: 1, explanation: "Зарлаад утга оноогоогүй элементүүд 0 байна." },
  { q: "for(int i=0; i<5; i++) printf('%d', i); юу хэвлэх вэ?", options: ["12345", "01234", "012345", "54321"], correct: 1, explanation: "0-ээс 4 хүртэл хэвлэнэ." },
  { q: "char s[] = 'Hi'; sizeof(s) хэд вэ?", options: ["2", "3", "4", "1"], correct: 1, explanation: "Төгсгөлийн null тэмдэгтийг тооцно." },
  { q: "int x=5, y=2; float z = x/y; z хэд вэ?", options: ["2.5", "2.0", "3.0", "0.0"], correct: 1, explanation: "Бүхэл тоон хуваалтын үр дүн бүхэл гарна." },
  { q: "C хэлэнд '&&' юуг илэрхийлэх вэ?", options: ["Эсвэл", "Ба", "Үгүйсгэл", "Тэнцүү"], correct: 1, explanation: "Logical AND буюу 'Ба' нөхцөл." }
];

// Fix: Add explicit type to CLASSES to avoid indexing errors and potential confusion with style props
const CLASSES: Record<PlayerClass, { name: string; hp: number; dmg: number; icon: string; color: string }> = {
  knight: { name: 'Array Knight', hp: 150, dmg: 20, icon: 'shield', color: 'text-blue-400' },
  mage: { name: 'Loop Mage', hp: 90, dmg: 45, icon: 'magic_button', color: 'text-purple-400' },
  rogue: { name: 'Logic Rogue', hp: 110, dmg: 30, icon: 'bolt', color: 'text-yellow-400' },
  techno: { name: 'Techno Monk', hp: 130, dmg: 25, icon: 'memory', color: 'text-primary' }
};

const BOSS = {
  name: 'Syntax Overlord',
  hp: 200,
  maxHp: 200,
  dmg: 20,
  icon: 'terminal'
};

const GameView: React.FC<GameViewProps> = ({ user, onBack }) => {
  const [view, setView] = useState<'lobby' | 'battle' | 'result'>('lobby');
  const [p1Class, setP1Class] = useState<PlayerClass>('knight');
  const [playerHp, setPlayerHp] = useState(100);
  const [bossHp, setBossHp] = useState(BOSS.hp);
  const [turn, setTurn] = useState<'player' | 'boss'>('player');
  const [qIdx, setQIdx] = useState(0);
  const [feedback, setFeedback] = useState<{msg: string, type: 'good' | 'bad'} | null>(null);
  const [logs, setLogs] = useState<string[]>(["Arena initialized..."]);

  const startBattle = () => {
    setPlayerHp(CLASSES[p1Class].hp);
    setBossHp(BOSS.hp);
    setTurn('player');
    setQIdx(Math.floor(Math.random() * QUESTIONS.length));
    setLogs([`${CLASSES[p1Class].name} entered the arena.`]);
    setView('battle');
  };

  const handleAnswer = (idx: number) => {
    if (turn !== 'player' || feedback) return;

    const correct = idx === QUESTIONS[qIdx].correct;
    const pDmg = CLASSES[p1Class].dmg;

    if (correct) {
      const newBossHp = Math.max(0, bossHp - pDmg);
      setBossHp(newBossHp);
      setFeedback({ msg: `ЗӨВ! -${pDmg} DAMAGE`, type: 'good' });
      setLogs(prev => [`You hit ${BOSS.name} for ${pDmg}!`, ...prev]);
      
      if (newBossHp <= 0) {
        setTimeout(() => setView('result'), 1500);
        return;
      }
    } else {
      setFeedback({ msg: "АЛДАА! ДОВТОЛГОО ТАСАРЛАА", type: 'bad' });
      setLogs(prev => [`Your attack failed!`, ...prev]);
    }

    setTurn('boss');
    setTimeout(() => {
      setFeedback(null);
      bossAction();
    }, 1500);
  };

  const bossAction = () => {
    const dmg = BOSS.dmg;
    const newPlayerHp = Math.max(0, playerHp - dmg);
    setPlayerHp(newPlayerHp);
    setFeedback({ msg: `${BOSS.name} ATTACKED! -${dmg} HP`, type: 'bad' });
    setLogs(prev => [`${BOSS.name} strikes you for ${dmg}!`, ...prev]);

    setTimeout(() => {
      setFeedback(null);
      if (newPlayerHp <= 0) {
        setView('result');
      } else {
        setTurn('player');
        setQIdx(Math.floor(Math.random() * QUESTIONS.length));
      }
    }, 1500);
  };

  // Fix: Move style calculations to variables to resolve "not callable" and "spread types" errors
  const playerHpPercent = `${(playerHp / (CLASSES[p1Class]?.hp || 100)) * 100}%`;
  const bossHpPercent = `${(bossHp / BOSS.maxHp) * 100}%`;

  return (
    <div className="flex-1 flex flex-col bg-[#050806] text-white font-display overflow-hidden relative select-none">
      {/* Background Matrix Effect */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="grid grid-cols-12 h-full">
          {Array.from({ length: 144 }).map((_, i) => (
            <div key={i} className="border border-primary/10 p-2 font-mono text-[8px] overflow-hidden">
              {Math.random().toString(16)}
            </div>
          ))}
        </div>
      </div>

      <header className="h-20 border-b border-primary/20 flex items-center justify-between px-10 relative z-20 bg-black/60 backdrop-blur-xl">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="size-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-primary/20 transition-all border border-white/10">
            <span className="material-symbols-outlined text-slate-400">arrow_back</span>
          </button>
          <h2 className="text-2xl font-black italic uppercase text-primary tracking-tighter">Cyber Arena: Arcade</h2>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Player Rank</span>
              <span className="text-sm font-black text-white italic">NOVICE CODER</span>
           </div>
           <div className="size-12 rounded-full border-2 border-primary bg-primary/10 flex items-center justify-center shadow-[0_0_15px_rgba(19,236,128,0.3)]">
              <span className="material-symbols-outlined text-primary">person</span>
           </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col p-10 relative z-10 max-w-7xl mx-auto w-full">
        {view === 'lobby' && (
          <div className="flex-1 flex flex-col items-center justify-center animate-in zoom-in duration-500">
             <div className="text-center mb-16">
                <h1 className="text-7xl font-black italic mb-4 uppercase tracking-tighter">Enter The Arena</h1>
                <p className="text-slate-500 font-bold uppercase tracking-[0.6em]">Select your class and fight the system</p>
             </div>
             
             <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                {(Object.keys(CLASSES) as PlayerClass[]).map(c => (
                   <button 
                    key={c} 
                    onClick={() => setP1Class(c)} 
                    className={`relative p-8 rounded-[40px] border-4 transition-all flex flex-col items-center gap-4 group ${
                      p1Class === c ? 'bg-primary border-white text-slate-900 scale-110 shadow-[0_0_50px_rgba(19,236,128,0.4)]' : 'bg-white/5 border-white/5 text-slate-400 hover:border-white/20'
                    }`}
                   >
                      <span className={`material-symbols-outlined text-6xl ${p1Class === c ? 'text-slate-900' : CLASSES[c].color}`}>{CLASSES[c].icon}</span>
                      <div className="text-center">
                        <p className="font-black italic uppercase text-sm tracking-tight">{CLASSES[c].name}</p>
                        <p className={`text-[10px] font-bold ${p1Class === c ? 'text-slate-700' : 'text-slate-500'}`}>HP: {CLASSES[c].hp} | DMG: {CLASSES[c].dmg}</p>
                      </div>
                   </button>
                ))}
             </div>

             <button onClick={startBattle} className="bg-primary text-slate-900 px-24 py-8 rounded-[40px] font-black text-4xl uppercase italic hover:scale-105 transition-all shadow-2xl shadow-primary/30 flex items-center gap-6">
                START BATTLE
                <span className="material-symbols-outlined text-4xl">swords</span>
             </button>
          </div>
        )}

        {view === 'battle' && (
          <div className="flex-1 flex flex-col">
            <div className="grid grid-cols-2 gap-20 items-center mb-16">
               {/* Player Section */}
               <div className={`flex flex-col items-center transition-all ${turn === 'player' ? 'scale-110' : 'opacity-40 grayscale'}`}>
                  <div className={`size-64 rounded-[80px] bg-slate-900 border-8 ${turn === 'player' ? 'border-primary shadow-[0_0_60px_rgba(19,236,128,0.2)]' : 'border-white/5'} flex items-center justify-center relative`}>
                     <span className={`material-symbols-outlined text-[140px] ${CLASSES[p1Class].color}`}>{CLASSES[p1Class].icon}</span>
                     <div className="absolute -bottom-8 left-0 right-0 h-4 bg-slate-800 rounded-full overflow-hidden border-2 border-white/10 shadow-lg">
                        {/* Fix: Use pre-calculated playerHpPercent */}
                        <div className="h-full bg-primary transition-all duration-500" style={{width: playerHpPercent}}></div>
                     </div>
                  </div>
                  <div className="mt-12 text-center">
                    <h4 className="text-3xl font-black italic uppercase tracking-tighter">{user.email?.split('@')[0]}</h4>
                    <p className="text-sm font-black text-primary uppercase tracking-widest">{CLASSES[p1Class].name}</p>
                  </div>
               </div>

               {/* Boss Section */}
               <div className={`flex flex-col items-center transition-all ${turn === 'boss' ? 'scale-110' : 'opacity-40 grayscale'}`}>
                  <div className={`size-64 rounded-[80px] bg-red-950/20 border-8 ${turn === 'boss' ? 'border-red-500 shadow-[0_0_60px_rgba(239,68,68,0.2)]' : 'border-white/5'} flex items-center justify-center relative`}>
                     <span className="material-symbols-outlined text-[140px] text-red-500">{BOSS.icon}</span>
                     <div className="absolute -bottom-8 left-0 right-0 h-4 bg-slate-800 rounded-full overflow-hidden border-2 border-white/10 shadow-lg">
                        {/* Fix: Use pre-calculated bossHpPercent */}
                        <div className="h-full bg-red-500 transition-all duration-500" style={{width: bossHpPercent}}></div>
                     </div>
                  </div>
                  <div className="mt-12 text-center">
                    <h4 className="text-3xl font-black italic uppercase tracking-tighter text-red-500">{BOSS.name}</h4>
                    <p className="text-sm font-black text-red-400/60 uppercase tracking-widest">SYSTEM OVERLORD</p>
                  </div>
               </div>
            </div>

            <div className="flex gap-8 flex-1">
               {/* Question Section */}
               <div className="flex-1 bg-black/60 border-4 border-white/5 rounded-[48px] p-10 flex flex-col shadow-2xl backdrop-blur-3xl relative overflow-hidden">
                  {feedback ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center animate-in zoom-in">
                       <h5 className={`text-6xl font-black italic mb-4 ${feedback.type === 'good' ? 'text-primary' : 'text-red-500'}`}>{feedback.msg}</h5>
                       <p className="text-slate-500 font-bold uppercase tracking-widest">Turn transition...</p>
                    </div>
                  ) : turn === 'boss' ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center">
                       <div className="size-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mb-8"></div>
                       <h5 className="text-3xl font-black italic uppercase tracking-widest text-red-500/50 animate-pulse">Boss is calculating next move...</h5>
                    </div>
                  ) : (
                    <>
                       <div className="flex items-center gap-3 mb-8">
                          <span className="size-3 rounded-full bg-primary animate-ping"></span>
                          <span className="text-xs font-black uppercase text-primary tracking-widest">Execute Script</span>
                       </div>
                       <h3 className="text-4xl font-black mb-12 leading-tight tracking-tight">{QUESTIONS[qIdx].q}</h3>
                       <div className="grid grid-cols-2 gap-4 mt-auto">
                          {QUESTIONS[qIdx].options.map((opt, i) => (
                             <button 
                              key={i} 
                              onClick={() => handleAnswer(i)} 
                              className="bg-white/5 border-2 border-white/10 hover:border-primary/50 p-8 rounded-[32px] text-left font-black text-xl transition-all hover:bg-primary/5 flex items-center justify-between group shadow-lg"
                             >
                                <span>{opt}</span>
                                <span className="text-[10px] font-black text-slate-600 group-hover:text-primary transition-colors tracking-widest uppercase">Select</span>
                             </button>
                          ))}
                       </div>
                    </>
                  )}
               </div>

               {/* Console Log */}
               <div className="w-80 bg-slate-900/40 border-2 border-white/5 rounded-[40px] p-6 flex flex-col overflow-hidden">
                  <div className="flex items-center gap-2 mb-6 opacity-40">
                    <span className="material-symbols-outlined text-sm">terminal</span>
                    <span className="text-[10px] font-black uppercase tracking-widest">Battle Logs</span>
                  </div>
                  <div className="flex-1 space-y-4 font-mono text-xs overflow-y-auto custom-scrollbar">
                     {logs.map((log, i) => (
                        <div key={i} className={`flex gap-3 ${log.includes('hit') ? 'text-primary' : log.includes('strikes') ? 'text-red-400' : 'text-slate-500'}`}>
                           <span className="opacity-20">{'>'}</span>
                           <span>{log}</span>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
          </div>
        )}

        {view === 'result' && (
          <div className="flex-1 flex flex-col items-center justify-center text-center animate-in zoom-in duration-500">
             <div className={`size-56 rounded-[60px] flex items-center justify-center text-slate-900 mb-12 shadow-2xl rotate-3 ${bossHp <= 0 ? 'bg-primary shadow-primary/30' : 'bg-red-500 shadow-red-500/30'}`}>
                <span className="material-symbols-outlined text-[120px] font-black">
                   {bossHp <= 0 ? 'emoji_events' : 'sentiment_very_dissatisfied'}
                </span>
             </div>
             <h2 className="text-8xl font-black italic mb-4 uppercase tracking-tighter">
                {bossHp <= 0 ? 'VICTORY' : 'DEFEATED'}
             </h2>
             <p className="text-3xl text-slate-400 font-bold mb-16 uppercase tracking-widest">
                {bossHp <= 0 ? 'System Overlord bypassed!' : 'Segmentation Fault (Your brain)'}
             </p>
             <div className="flex gap-6">
                <button onClick={() => setView('lobby')} className="bg-primary text-slate-900 px-16 py-6 rounded-[32px] font-black text-2xl uppercase italic shadow-2xl hover:scale-105 transition-all">Try Again</button>
                <button onClick={onBack} className="bg-white/5 text-white px-16 py-6 rounded-[32px] font-black text-2xl uppercase italic border border-white/10 hover:bg-white/10">Exit Arena</button>
             </div>
          </div>
        )}
      </main>

      <footer className="h-12 bg-black/80 border-t border-white/5 px-10 flex items-center justify-between text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">
         <div className="flex gap-10">
            <span>Server: LOCALHOST</span>
            <span>Difficulty: HARDCORE</span>
         </div>
         <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-primary animate-pulse"></span>
            <span>Signed in as {user.email}</span>
         </div>
      </footer>
    </div>
  );
};

export default GameView;
