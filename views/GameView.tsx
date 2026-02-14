
import React, { useState, useEffect, useCallback, useRef } from 'react';

interface GameViewProps {
  onBack: () => void;
}

type GameMode = 'adventure' | 'duel' | 'survival';
type PlayerClass = 'knight' | 'mage' | 'rogue' | 'techno';

interface Question {
  q: string;
  options: string[];
  correct: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const QUESTIONS: Question[] = [
  { q: "int arr[5] = {1, 2, 3}; arr[4] хэд вэ?", options: ["3", "0", "Алдаа", "Хоосон"], correct: 1, explanation: "Зарлаад утга оноогоогүй элементүүд 0 байна.", difficulty: 'easy' },
  { q: "for(int i=0; i<5; i++) printf('%d', i); юу хэвлэх вэ?", options: ["12345", "01234", "012345", "54321"], correct: 1, explanation: "0-ээс 4 хүртэл хэвлэнэ.", difficulty: 'easy' },
  { q: "char s[] = 'Hi'; sizeof(s) хэд вэ?", options: ["2", "3", "4", "1"], correct: 1, explanation: "Төгсгөлийн null (\0) тэмдэгтийг тооцно.", difficulty: 'medium' },
  { q: "int x=5, y=2; float z = x/y; z хэд вэ?", options: ["2.5", "2.0", "3.0", "0.0"], correct: 1, explanation: "Бүхэл тоог бүхэлд хуваахад үр дүн бүхэл (2) гарч, дараа нь float болно.", difficulty: 'medium' },
  { q: "while(0) { printf('X'); } хэдэн X хэвлэх вэ?", options: ["0", "1", "Хязгааргүй", "Алдаа"], correct: 0, explanation: "0 бол False тул давталт руу орохгүй.", difficulty: 'easy' },
  { q: "int a=10; int *p = &a; *p хэд вэ?", options: ["Хаяг", "10", "Алдаа", "0"], correct: 1, explanation: "Заагчийн утга авах үйлдэл.", difficulty: 'hard' },
  { q: "1 << 3 үйлдлийн хариу?", options: ["3", "8", "4", "1"], correct: 1, explanation: "Битийн зүүн шилжилт (2-ын 3 зэрэг).", difficulty: 'hard' },
  { q: "do { printf('A'); } while(0); хэдэн A хэвлэх вэ?", options: ["0", "1", "2", "Алдаа"], correct: 1, explanation: "Do-while нь нөхцөлөөс үл хамааран дор хаяж 1 удаа ажиллана.", difficulty: 'medium' },
  { q: "static хувьсагч хаана хадгалагддаг вэ?", options: ["Stack", "Heap", "Data Segment", "Register"], correct: 2, explanation: "Static болон Global хувьсагчид Data Segment-д байдаг.", difficulty: 'hard' },
  { q: "&& оператор аль нь вэ?", options: ["Логик ЭСВЭЛ", "Логик БА", "Битийн БА", "Үгүйсгэл"], correct: 1, explanation: "AND логик оператор.", difficulty: 'easy' }
];

const CLASSES = {
  knight: { name: 'Array Knight', hp: 150, maxHp: 150, dmg: 15, mana: 0, maxMana: 3, ability: 'Shield Block (Heal 30)', icon: 'shield' },
  mage: { name: 'Loop Mage', hp: 90, maxHp: 90, dmg: 35, mana: 0, maxMana: 5, ability: 'Recursive Strike (2x Damage)', icon: 'magic_button' },
  rogue: { name: 'Logic Rogue', hp: 110, maxHp: 110, dmg: 22, mana: 0, maxMana: 4, ability: 'Bitwise Critical (Ignores Armor)', icon: 'bolt' },
  techno: { name: 'Techno Monk', hp: 130, maxHp: 130, dmg: 20, mana: 0, maxMana: 4, ability: 'System Overload (Drain Mana)', icon: 'memory' }
};

const BOSSES = [
  { name: "Segmentation Fault", hp: 120, icon: "error", dmg: 10 },
  { name: "The Infinite Loop", hp: 200, icon: "refresh", dmg: 15 },
  { name: "Memory Leak Boss", hp: 350, icon: "database", dmg: 25 }
];

const GameView: React.FC<GameViewProps> = ({ onBack }) => {
  const [view, setView] = useState<'lobby' | 'char_select' | 'battle' | 'result'>('lobby');
  const [mode, setMode] = useState<GameMode>('adventure');
  const [stage, setStage] = useState(1);
  const [p1, setP1] = useState(CLASSES.knight);
  const [p2, setP2] = useState(CLASSES.mage);
  const [turn, setTurn] = useState(1); // 1 or 2
  const [currentQ, setCurrentQ] = useState<Question>(QUESTIONS[0]);
  const [feedback, setFeedback] = useState<{type: 'hit' | 'miss' | 'ability', msg: string} | null>(null);
  const [shake, setShake] = useState(false);
  const [isAiTurn, setIsAiTurn] = useState(false);

  // Initialize Battle
  const startBattle = (selectedMode: GameMode) => {
    setMode(selectedMode);
    setStage(1);
    setView('char_select');
  };

  const initSession = (p1c: PlayerClass, p2c: PlayerClass) => {
    setP1({...CLASSES[p1c]});
    if (mode === 'duel') {
      setP2({...CLASSES[p2c]});
    } else {
      const boss = BOSSES[0];
      setP2({ name: boss.name, hp: boss.hp, maxHp: boss.hp, dmg: boss.dmg, mana: 0, maxMana: 10, ability: 'Boss Smash', icon: boss.icon } as any);
    }
    setTurn(1);
    pickQuestion();
    setView('battle');
  };

  const pickQuestion = () => {
    const q = QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];
    setCurrentQ(q);
  };

  const applyAbility = (player: 1 | 2) => {
    const p = player === 1 ? p1 : p2;
    if (p.mana < p.maxMana) return;

    if (player === 1) {
      if (p1.name === 'Array Knight') setP1(prev => ({...prev, hp: Math.min(prev.maxHp, prev.hp + 30), mana: 0}));
      if (p1.name === 'Loop Mage') {
         setP2(prev => ({...prev, hp: Math.max(0, prev.hp - (p1.dmg * 2))}));
         setP1(prev => ({...prev, mana: 0}));
         setShake(true);
         setTimeout(() => setShake(false), 500);
      }
      setFeedback({type: 'ability', msg: `${p.name} used Special Move!`});
    } else {
      // P2 Ability logic...
      setP2(prev => ({...prev, mana: 0}));
    }

    setTimeout(() => {
      setFeedback(null);
      if (p2.hp <= 0) setView('result');
    }, 1500);
  };

  const handleAnswer = (idx: number) => {
    if (isAiTurn || feedback) return;
    
    const isCorrect = idx === currentQ.correct;
    const attacker = turn;
    const target = turn === 1 ? 2 : 1;
    
    if (isCorrect) {
      const dmg = attacker === 1 ? p1.dmg : p2.dmg;
      if (target === 1) setP1(prev => ({...prev, hp: Math.max(0, prev.hp - dmg)}));
      else setP2(prev => ({...prev, hp: Math.max(0, prev.hp - dmg)}));
      
      if (attacker === 1) setP1(prev => ({...prev, mana: Math.min(prev.maxMana, prev.mana + 1)}));
      else setP2(prev => ({...prev, mana: Math.min(prev.maxMana, prev.mana + 1)}));
      
      setFeedback({type: 'hit', msg: `CRITICAL STRIKE! -${dmg} HP`});
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } else {
      setFeedback({type: 'miss', msg: "MISS! Syntax Error detected."});
    }

    setTimeout(() => {
      setFeedback(null);
      checkGameState();
    }, 1500);
  };

  const checkGameState = () => {
    if (p1.hp <= 0 || p2.hp <= 0) {
      if (mode === 'adventure' && p1.hp > 0 && stage < BOSSES.length) {
          nextStage();
      } else {
          setView('result');
      }
      return;
    }

    if (mode === 'adventure' && turn === 1) {
       setTurn(2);
       setIsAiTurn(true);
       setTimeout(() => {
          const aiCorrect = Math.random() > 0.4;
          if (aiCorrect) {
            setP1(prev => ({...prev, hp: Math.max(0, prev.hp - p2.dmg)}));
            setFeedback({type: 'hit', msg: `${p2.name} attacked you! -${p2.dmg}`});
            setShake(true);
            setTimeout(() => setShake(false), 400);
          } else {
            setFeedback({type: 'miss', msg: `${p2.name} missed its attack!`});
          }
          setTimeout(() => {
            setFeedback(null);
            setIsAiTurn(false);
            setTurn(1);
            pickQuestion();
          }, 1500);
       }, 1000);
    } else {
       setTurn(turn === 1 ? 2 : 1);
       pickQuestion();
    }
  };

  const nextStage = () => {
    const nextS = stage + 1;
    setStage(nextS);
    const boss = BOSSES[nextS - 1];
    setP2({ name: boss.name, hp: boss.hp, maxHp: boss.hp, dmg: boss.dmg, mana: 0, maxMana: 10, ability: 'Boss Smash', icon: boss.icon } as any);
    setP1(prev => ({...prev, hp: Math.min(prev.maxHp, prev.hp + 50)}));
    pickQuestion();
    setTurn(1);
    setFeedback({type: 'hit', msg: `STAGE ${nextS}: ${boss.name} appeared!`});
    setTimeout(() => setFeedback(null), 2000);
  };

  return (
    <div className={`flex-1 flex flex-col bg-[#050806] text-white font-display overflow-hidden relative select-none ${shake ? 'animate-bounce' : ''}`}>
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#13ec8022,transparent_70%)]"></div>
        <div className="grid grid-cols-12 gap-2 p-2 h-full opacity-10">
           {Array.from({length: 144}).map((_, i) => (
             <div key={i} className="border border-primary/5 rounded-lg flex items-center justify-center text-[10px] font-mono text-primary/40">
                {Math.random() > 0.5 ? '1' : '0'}
             </div>
           ))}
        </div>
      </div>

      <header className="h-20 border-b border-primary/20 flex items-center justify-between px-10 relative z-20 bg-black/60 backdrop-blur-xl">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="size-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-red-500/20 transition-all group border border-white/10">
            <span className="material-symbols-outlined text-slate-400 group-hover:text-red-500">logout</span>
          </button>
          <div className="flex flex-col">
            <h2 className="text-2xl font-black italic tracking-tighter uppercase text-primary drop-shadow-[0_0_10px_#13ec80]">Cyber Arena 3.0</h2>
            <div className="flex items-center gap-2">
               <span className="text-[9px] font-black tracking-[0.4em] text-slate-500 uppercase">System Status: Stable</span>
               <div className="size-1.5 rounded-full bg-primary animate-pulse"></div>
            </div>
          </div>
        </div>
        {view === 'battle' && (
          <div className="flex items-center gap-4 bg-primary/10 px-6 py-2 rounded-full border border-primary/20">
             <span className="text-xs font-black text-primary uppercase tracking-widest">Stage {stage}</span>
             <div className="w-px h-4 bg-primary/20"></div>
             <span className="text-xs font-black text-white/60 uppercase">{mode.toUpperCase()} MODE</span>
          </div>
        )}
      </header>

      <main className="flex-1 flex flex-col p-8 relative z-10 max-w-7xl mx-auto w-full">
        {view === 'lobby' && (
          <div className="flex-1 flex flex-col items-center justify-center animate-in zoom-in duration-500">
             <div className="size-48 rounded-[60px] bg-primary flex items-center justify-center text-slate-900 mb-12 shadow-[0_0_80px_rgba(19,236,128,0.4)] rotate-6 group hover:rotate-0 transition-transform cursor-pointer">
                <span className="material-symbols-outlined text-9xl font-black group-hover:scale-110 transition-transform">terminal</span>
             </div>
             <h1 className="text-7xl font-black italic mb-2 uppercase tracking-tighter text-white drop-shadow-2xl">Cyber Arena</h1>
             <p className="text-slate-500 font-black uppercase tracking-[0.5em] mb-16 text-sm">Select Your Destiny</p>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                <button onClick={() => startBattle('adventure')} className="group bg-slate-900 border-2 border-white/5 p-10 rounded-[40px] text-left hover:border-primary/50 transition-all hover:-translate-y-2 flex flex-col">
                   <span className="material-symbols-outlined text-5xl text-primary mb-6">swords</span>
                   <h3 className="text-3xl font-black mb-2 italic">ADVENTURE</h3>
                   <p className="text-slate-400 text-sm font-medium uppercase tracking-widest leading-relaxed">Дараалсан боссуудыг ялж, С хэлний мастер бол.</p>
                </button>
                <button onClick={() => startBattle('duel')} className="group bg-slate-900 border-2 border-white/5 p-10 rounded-[40px] text-left hover:border-white/50 transition-all hover:-translate-y-2 flex flex-col">
                   <span className="material-symbols-outlined text-5xl text-white mb-6">groups</span>
                   <h3 className="text-3xl font-black mb-2 italic">1V1 DUEL</h3>
                   <p className="text-slate-400 text-sm font-medium uppercase tracking-widest leading-relaxed">Найзтайгаа нэг дэлгэц дээр логикоо уралдуул.</p>
                </button>
             </div>
          </div>
        )}

        {view === 'char_select' && (
           <div className="flex-1 flex flex-col items-center justify-center animate-in fade-in duration-500">
              <h2 className="text-4xl font-black italic mb-12 uppercase tracking-tighter text-primary">Choose Your Guardian</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-5xl">
                 {(Object.keys(CLASSES) as PlayerClass[]).map(key => {
                    const c = CLASSES[key];
                    return (
                      <button 
                        key={key} 
                        onClick={() => initSession(key, 'mage')}
                        className="group bg-slate-900 border-4 border-white/5 p-8 rounded-[48px] flex flex-col items-center hover:border-primary hover:scale-105 transition-all text-center"
                      >
                         <div className="size-24 rounded-3xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
                            <span className="material-symbols-outlined text-5xl text-primary group-hover:text-slate-900 transition-colors">{c.icon}</span>
                         </div>
                         <h4 className="text-xl font-black mb-2">{c.name}</h4>
                         <div className="space-y-1 opacity-60 text-[10px] font-black uppercase tracking-widest mb-4">
                            <div>HP: {c.hp}</div>
                            <div>DMG: {c.dmg}</div>
                         </div>
                         <div className="text-[9px] font-black text-primary uppercase tracking-tighter border-t border-white/5 pt-4 w-full">
                            Special: {c.ability.split(' ')[0]}
                         </div>
                      </button>
                    );
                 })}
              </div>
           </div>
        )}

        {view === 'battle' && (
          <div className="flex-1 flex flex-col">
            <div className="flex-1 grid grid-cols-2 gap-12 items-center mb-8 relative">
               {/* Center Clash Effect */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 opacity-10">
                  <span className="material-symbols-outlined text-[300px] text-primary animate-ping">bolt</span>
               </div>

               {/* P1 Side */}
               <div className={`flex flex-col items-center transition-all duration-500 relative z-10 ${turn === 1 ? 'scale-110' : 'opacity-40 grayscale scale-90'}`}>
                  <div className={`size-72 rounded-[90px] bg-[#0a0f0d] border-8 ${turn === 1 ? 'border-primary' : 'border-white/5'} flex items-center justify-center shadow-[0_40px_80px_rgba(0,0,0,0.6)] relative overflow-hidden`}>
                     <div className="absolute inset-0 bg-primary/5 animate-pulse"></div>
                     <span className="material-symbols-outlined text-[160px] text-primary relative z-10 drop-shadow-[0_0_20px_#13ec80]">{p1.icon}</span>
                     
                     {/* HP Bar Overlay */}
                     <div className="absolute bottom-6 left-6 right-6 h-4 bg-black/40 rounded-full border border-white/10 overflow-hidden backdrop-blur-md">
                        <div className="h-full bg-primary transition-all duration-700 shadow-[0_0_10px_#13ec80]" style={{width: `${(p1.hp/p1.maxHp)*100}%`}}></div>
                     </div>
                  </div>
                  <div className="mt-8 text-center bg-black/40 px-8 py-4 rounded-3xl border border-white/5">
                     <p className="text-[10px] font-black uppercase text-primary tracking-[0.4em] mb-1">{p1.name}</p>
                     <div className="flex items-center gap-3">
                        <span className="text-4xl font-black italic tracking-tighter">{p1.hp} HP</span>
                        <div className="flex gap-1">
                           {Array.from({length: p1.maxMana}).map((_, i) => (
                             <div key={i} className={`size-3 rounded-full border ${i < p1.mana ? 'bg-primary border-primary shadow-[0_0_5px_#13ec80]' : 'bg-transparent border-white/20'}`}></div>
                           ))}
                        </div>
                     </div>
                     {p1.mana >= p1.maxMana && turn === 1 && (
                        <button onClick={() => applyAbility(1)} className="mt-4 w-full bg-white text-slate-900 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest animate-bounce">USE SPECIAL</button>
                     )}
                  </div>
               </div>

               {/* P2/Boss Side */}
               <div className={`flex flex-col items-center transition-all duration-500 relative z-10 ${turn === 2 ? 'scale-110' : 'opacity-40 grayscale scale-90'}`}>
                  <div className={`size-72 rounded-[90px] bg-[#140a0a] border-8 ${turn === 2 ? 'border-red-500' : 'border-white/5'} flex items-center justify-center shadow-[0_40px_80px_rgba(0,0,0,0.6)] relative overflow-hidden`}>
                     <div className="absolute inset-0 bg-red-500/5 animate-pulse"></div>
                     <span className="material-symbols-outlined text-[160px] text-red-500 relative z-10 drop-shadow-[0_0_20px_#ef4444]">{p2.icon}</span>
                     
                     <div className="absolute bottom-6 left-6 right-6 h-4 bg-black/40 rounded-full border border-white/10 overflow-hidden backdrop-blur-md">
                        <div className="h-full bg-red-500 transition-all duration-700 shadow-[0_0_10px_#ef4444]" style={{width: `${(p2.hp/p2.maxHp)*100}%`}}></div>
                     </div>
                  </div>
                  <div className="mt-8 text-center bg-black/40 px-8 py-4 rounded-3xl border border-white/5">
                     <p className="text-[10px] font-black uppercase text-red-500 tracking-[0.4em] mb-1">{p2.name}</p>
                     <p className="text-4xl font-black italic tracking-tighter">{p2.hp} HP</p>
                  </div>
               </div>
            </div>

            {/* Battle Interface */}
            <div className="bg-[#080c0a] border-4 border-white/5 rounded-[50px] p-10 min-h-[350px] flex flex-col shadow-[0_40px_100px_rgba(0,0,0,0.8)] relative overflow-hidden backdrop-blur-2xl">
               <div className="absolute top-0 right-0 p-10 opacity-[0.03] select-none pointer-events-none">
                  <span className="material-symbols-outlined text-[300px] text-primary">security</span>
               </div>

               {feedback ? (
                 <div className="flex-1 flex flex-col items-center justify-center text-center animate-in zoom-in duration-300">
                    <h5 className={`text-7xl font-black italic uppercase tracking-tighter mb-4 ${feedback.type === 'hit' ? 'text-primary' : feedback.type === 'ability' ? 'text-yellow-400' : 'text-red-500'}`}>{feedback.msg}</h5>
                    <p className="text-slate-500 font-bold uppercase tracking-[0.2em]">{currentQ.explanation}</p>
                 </div>
               ) : isAiTurn ? (
                 <div className="flex-1 flex flex-col items-center justify-center text-center">
                    <div className="size-20 border-4 border-red-500 border-t-transparent rounded-full animate-spin mb-8"></div>
                    <h5 className="text-3xl font-black italic uppercase text-red-500 tracking-widest">Enemy is analyzing your code...</h5>
                 </div>
               ) : (
                 <>
                   <div className="flex items-center justify-between mb-8 relative z-10">
                      <div className="flex items-center gap-4">
                         <span className="px-4 py-1 bg-primary/20 text-primary text-[10px] font-black rounded-full uppercase tracking-widest border border-primary/20">System Prompt</span>
                         <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Player {turn} - Logic Verification</span>
                      </div>
                      <div className="text-[10px] font-black text-slate-500 uppercase">Difficulty: {currentQ.difficulty}</div>
                   </div>
                   <h3 className="text-3xl font-black leading-tight mb-12 max-w-4xl relative z-10">{currentQ.q}</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                      {currentQ.options.map((opt, i) => (
                        <button 
                          key={i} 
                          onClick={() => handleAnswer(i)}
                          className="bg-white/5 border-2 border-white/5 hover:border-primary/40 hover:bg-primary/5 p-6 rounded-[32px] text-left transition-all flex items-center justify-between group overflow-hidden relative"
                        >
                           <span className="font-bold text-lg group-hover:text-white transition-colors relative z-10">{opt}</span>
                           <span className="material-symbols-outlined text-primary/0 group-hover:text-primary transition-all translate-x-4 group-hover:translate-x-0 relative z-10">bolt</span>
                           <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </button>
                      ))}
                   </div>
                 </>
               )}
            </div>
          </div>
        )}

        {view === 'result' && (
          <div className="flex-1 flex flex-col items-center justify-center text-center animate-in zoom-in duration-500">
             <div className="size-48 rounded-[60px] bg-primary flex items-center justify-center text-slate-900 mb-10 shadow-[0_0_100px_rgba(19,236,128,0.3)]">
                <span className="material-symbols-outlined text-[100px] font-black animate-bounce">{p1.hp > 0 ? 'emoji_events' : 'error'}</span>
             </div>
             <h2 className="text-8xl font-black italic mb-4 uppercase tracking-tighter text-white drop-shadow-2xl">
               {p1.hp > 0 ? 'VICTORY' : 'DEFEATED'}
             </h2>
             <p className="text-2xl text-slate-400 font-bold mb-12 uppercase tracking-widest max-w-xl">
                {p1.hp > 0 ? `Чи ${stage}-р түвшнийг давж, жинхэнэ С хэлний мастер гэдгээ баталлаа!` : 'Чиний логик хана нурлаа. Дахин оролдож ур чадвараа ахиул!'}
             </p>
             <div className="flex gap-6">
                <button onClick={() => setView('lobby')} className="bg-primary text-slate-900 px-16 py-6 rounded-[32px] font-black text-2xl uppercase italic shadow-2xl hover:scale-105 transition-all">Retry Arena</button>
                <button onClick={onBack} className="bg-white/5 text-white border-2 border-white/10 px-16 py-6 rounded-[32px] font-black text-2xl uppercase italic hover:bg-white/10 transition-all">Lobby Exit</button>
             </div>
          </div>
        )}
      </main>

      <footer className="h-14 bg-black/80 border-t border-white/5 px-10 flex items-center justify-between text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">
         <div className="flex gap-10">
            <span className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-primary"></span> Core: Active</span>
            <span className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-blue-500"></span> Buffer: Clean</span>
         </div>
         <div className="flex items-center gap-4">
            <span className="text-primary/60">Stage Multiplier: x{(1 + stage * 0.1).toFixed(1)}</span>
            <span>Build v3.0.4-LATEST</span>
         </div>
      </footer>
    </div>
  );
};

export default GameView;
