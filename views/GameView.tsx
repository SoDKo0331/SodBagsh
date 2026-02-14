
import React, { useState, useEffect } from 'react';

interface GameViewProps {
  onBack: () => void;
}

interface DungeonEnemy {
  name: string;
  hp: number;
  maxHp: number;
  icon: string;
  question: string;
  options: { id: string, text: string }[];
  correctId: string;
  explanation: string;
}

const ENEMIES: DungeonEnemy[] = [
  {
    name: "Array Slime",
    hp: 40,
    maxHp: 40,
    icon: "database",
    question: "int arr[3] = {10, 20, 30}; arr[1] дээр ямар утга хадгалагдаж байгаа вэ?",
    options: [
      { id: 'a', text: "10" },
      { id: 'b', text: "20" },
      { id: 'c', text: "30" },
      { id: 'd', text: "Алдаа өгнө" }
    ],
    correctId: 'b',
    explanation: "С хэл дээр массивын индекс 0-ээс эхэлдэг тул arr[0]=10, arr[1]=20, arr[2]=30 байна."
  },
  {
    name: "Looping Golem",
    hp: 60,
    maxHp: 60,
    icon: "refresh",
    question: "Массивын бүх элементийг хэвлэхийн тулд ихэвчлэн юу ашигладаг вэ?",
    options: [
      { id: 'a', text: "if нөхцөл" },
      { id: 'b', text: "for давталт" },
      { id: 'c', text: "printf-ийг 100 удаа бичих" },
      { id: 'd', text: "scanf()" }
    ],
    correctId: 'b',
    explanation: "Массив доторх элементүүдээр дамжиж (iterate) үйлдэл хийхэд 'for' эсвэл 'while' давталт хамгийн тохиромжтой."
  },
  {
    name: "The Logic Dragon",
    hp: 100,
    maxHp: 100,
    icon: "account_tree",
    question: "int a=10, b=20; if(a > b) max=a; else max=b; Энэ кодын дараа max-д ямар утга орох вэ?",
    options: [
      { id: 'a', text: "10" },
      { id: 'b', text: "20" },
      { id: 'c', text: "30" },
      { id: 'd', text: "0" }
    ],
    correctId: 'b',
    explanation: "10 нь 20-оос их биш тул 'else' хэсэг ажиллаж, max-д b буюу 20-ийг онооно."
  }
];

const GameView: React.FC<GameViewProps> = ({ onBack }) => {
  const [currentEnemyIdx, setCurrentEnemyIdx] = useState(0);
  const [enemyHp, setEnemyHp] = useState(ENEMIES[0].hp);
  const [playerHp, setPlayerHp] = useState(100);
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'feedback' | 'victory' | 'gameover'>('intro');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState({ isCorrect: false, msg: "" });
  const [attackAnim, setAttackAnim] = useState(false);

  const enemy = ENEMIES[currentEnemyIdx];

  const handleStart = () => {
    setGameState('playing');
    setEnemyHp(ENEMIES[0].hp);
    setPlayerHp(100);
    setCurrentEnemyIdx(0);
    setSelectedId(null);
  };

  const handleOptionClick = (id: string) => {
    if (gameState !== 'playing') return;
    setSelectedId(id);
    const correct = id === enemy.correctId;
    
    if (correct) {
      setAttackAnim(true);
      setTimeout(() => setAttackAnim(false), 500);
      setEnemyHp(prev => Math.max(0, prev - 34));
      setFeedback({ isCorrect: true, msg: "CRITICAL HIT! Код зөв ажиллалаа!" });
    } else {
      setPlayerHp(prev => Math.max(0, prev - 25));
      setFeedback({ isCorrect: false, msg: "LOGIC ERROR! Чиний хамгаалалт суларлаа." });
    }
    setGameState('feedback');
  };

  const nextAction = () => {
    if (enemyHp <= 0) {
      if (currentEnemyIdx < ENEMIES.length - 1) {
        const nextIdx = currentEnemyIdx + 1;
        setCurrentEnemyIdx(nextIdx);
        setEnemyHp(ENEMIES[nextIdx].hp);
        setGameState('playing');
        setSelectedId(null);
      } else {
        setGameState('victory');
      }
    } else if (playerHp <= 0) {
      setGameState('gameover');
    } else {
      setGameState('playing');
      setSelectedId(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#050a08] text-white font-display overflow-hidden relative">
      {/* Background Matrix-like Decor */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="grid grid-cols-12 h-full w-full">
           {Array.from({length: 144}).map((_, i) => (
             <div key={i} className="border-[0.5px] border-primary/10 p-2 font-mono text-[10px] text-primary/40">
                {Math.floor(Math.random()*2)}
             </div>
           ))}
        </div>
      </div>

      <header className="h-16 border-b border-primary/20 flex items-center justify-between px-8 relative z-10 bg-black/50 backdrop-blur-md">
         <div className="flex items-center gap-4">
            <button onClick={onBack} className="size-10 flex items-center justify-center rounded-xl hover:bg-white/5 transition-colors">
               <span className="material-symbols-outlined text-slate-400">arrow_back</span>
            </button>
            <div className="flex flex-col">
               <h2 className="font-black uppercase tracking-[0.2em] text-primary text-[10px] leading-none mb-1">Array Guardian</h2>
               <p className="text-[9px] text-slate-500 font-bold">STREET CODE CHALLENGE</p>
            </div>
         </div>
         <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Player HP</span>
               <div className="w-40 h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-white/5">
                  <div className={`h-full rounded-full transition-all duration-700 ${playerHp < 30 ? 'bg-red-500 shadow-[0_0_10px_#ef4444]' : 'bg-primary shadow-[0_0_10px_#13ec80]'}`} style={{width: `${playerHp}%`}}></div>
               </div>
            </div>
         </div>
      </header>

      <main className="flex-1 flex flex-col p-10 relative z-10 max-w-6xl mx-auto w-full">
         
         {gameState === 'intro' ? (
           <div className="flex-1 flex flex-col items-center justify-center text-center animate-in zoom-in duration-500">
              <div className="size-40 rounded-[48px] bg-primary flex items-center justify-center text-slate-900 mb-8 shadow-[0_0_60px_rgba(19,236,128,0.4)] rotate-3">
                 <span className="material-symbols-outlined text-8xl font-black">fort</span>
              </div>
              <h1 className="text-6xl font-black mb-4 tracking-tighter uppercase italic text-white drop-shadow-2xl">Array Defender</h1>
              <p className="text-slate-400 max-w-md mb-12 font-bold uppercase tracking-widest text-[11px] leading-loose border-y border-white/10 py-6">
                С хэлний массивын ертөнцөд дайснууд довтолж байна. Чиний логик сэтгэлгээ бол хамгийн хүчтэй бамбай юм. Бэлэн үү?
              </p>
              <button onClick={handleStart} className="bg-primary text-slate-900 px-16 py-5 rounded-[24px] font-black text-xl uppercase tracking-widest shadow-2xl hover:scale-110 active:scale-95 transition-all">
                Тулааныг эхлүүлэх
              </button>
           </div>
         ) : gameState === 'victory' ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center animate-in zoom-in duration-500">
               <div className="size-40 rounded-full bg-yellow-400 flex items-center justify-center text-slate-900 mb-8 shadow-[0_0_80px_rgba(250,204,21,0.4)]">
                  <span className="material-symbols-outlined text-[100px] font-black animate-bounce">emoji_events</span>
               </div>
               <h2 className="text-7xl font-black text-white mb-4 uppercase tracking-tighter">Legendary Coder!</h2>
               <p className="text-primary font-black uppercase tracking-widest mb-12 text-lg">Чи С хэлний массивын нууцыг бүрэн тайллаа.</p>
               <button onClick={onBack} className="bg-white text-slate-900 px-12 py-5 rounded-3xl font-black uppercase tracking-widest hover:scale-105 transition-all shadow-2xl">Ордноос гарах</button>
            </div>
         ) : gameState === 'gameover' ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center animate-in shake duration-500">
               <div className="size-40 rounded-[40px] bg-red-600 flex items-center justify-center text-white mb-8 shadow-[0_0_80px_rgba(220,38,38,0.4)]">
                  <span className="material-symbols-outlined text-[100px] font-black">gavel</span>
               </div>
               <h2 className="text-7xl font-black text-white mb-4 uppercase tracking-tighter">Syntax Error</h2>
               <p className="text-red-400 font-black uppercase tracking-widest mb-12">Чиний логик хана нурлаа. Дахин оролдож үзнэ үү.</p>
               <button onClick={handleStart} className="bg-red-600 text-white px-12 py-5 rounded-3xl font-black uppercase tracking-widest hover:scale-105 transition-all shadow-2xl shadow-red-600/20">Дахин ачаалах</button>
            </div>
         ) : (
           <div className="flex-1 flex flex-col">
              {/* Arena Scene */}
              <div className="flex-1 grid grid-cols-2 gap-16 items-center mb-10">
                 {/* Hero Side */}
                 <div className="flex flex-col items-center relative">
                    <div className={`size-60 rounded-[72px] bg-slate-900 border-4 border-primary/20 flex items-center justify-center shadow-2xl transition-all duration-300 ${attackAnim ? 'translate-x-16 scale-110 border-primary' : ''}`}>
                       <span className="material-symbols-outlined text-[120px] text-primary font-black drop-shadow-[0_0_20px_rgba(19,236,128,0.4)]">shield_person</span>
                    </div>
                    <div className="mt-8 text-center bg-black/40 px-6 py-3 rounded-2xl border border-white/5">
                       <p className="text-[10px] font-black uppercase text-primary tracking-[0.3em] mb-1">The Array Defender</p>
                       <p className="text-3xl font-black italic tracking-tighter">HP: {playerHp}</p>
                    </div>
                    {attackAnim && (
                      <div className="absolute top-1/2 -right-16 text-primary animate-ping">
                        <span className="material-symbols-outlined text-[80px]">flare</span>
                      </div>
                    )}
                 </div>

                 {/* Enemy Side */}
                 <div className="flex flex-col items-center">
                    <div className={`size-60 rounded-[72px] bg-red-950/10 border-4 border-red-500/20 flex items-center justify-center shadow-2xl relative animate-pulse`}>
                       <span className="material-symbols-outlined text-[120px] text-red-500 font-black">{enemy.icon}</span>
                       <div className="absolute -top-6 -right-6 bg-red-600 text-white px-5 py-2 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl border-2 border-white/10">STAGE {currentEnemyIdx + 1}</div>
                    </div>
                    <div className="mt-8 text-center w-full max-w-sm">
                       <p className="text-[10px] font-black uppercase text-red-500 tracking-[0.3em] mb-3">{enemy.name}</p>
                       <div className="w-full h-5 bg-slate-900 rounded-full p-1 border border-white/5 mb-3 shadow-inner">
                          <div className="h-full bg-red-600 rounded-full transition-all duration-700 shadow-[0_0_15px_#dc2626]" style={{width: `${(enemyHp/enemy.maxHp)*100}%`}}></div>
                       </div>
                       <p className="text-2xl font-black italic tracking-tighter text-red-400">BOSS HP: {enemyHp}</p>
                    </div>
                 </div>
              </div>

              {/* Combat Log & Interface */}
              <div className="bg-[#0a0f0d] border-4 border-primary/10 rounded-[48px] p-10 min-h-[350px] flex flex-col shadow-[0_40px_80px_rgba(0,0,0,0.6)] backdrop-blur-xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-10 opacity-5">
                    <span className="material-symbols-outlined text-[200px] text-primary">data_array</span>
                 </div>

                 {gameState === 'playing' ? (
                   <>
                     <div className="mb-10 relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                           <span className="h-1 w-12 bg-primary rounded-full"></span>
                           <span className="text-[11px] font-black text-primary uppercase tracking-[0.4em]">Combat Question</span>
                        </div>
                        <h3 className="text-3xl font-black leading-tight text-white max-w-3xl">{enemy.question}</h3>
                     </div>
                     <div className="grid grid-cols-2 gap-5 relative z-10">
                        {enemy.options.map(opt => (
                          <button 
                            key={opt.id} 
                            onClick={() => handleOptionClick(opt.id)}
                            className="bg-white/5 border-2 border-white/5 hover:border-primary/40 p-6 rounded-[28px] text-left font-bold text-lg transition-all hover:bg-primary/5 hover:scale-[1.02] group flex items-center justify-between"
                          >
                             <div className="flex items-center gap-4">
                                <div className="size-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-primary transition-colors text-xs font-black">{opt.id.toUpperCase()}</div>
                                <span className="group-hover:text-white transition-colors">{opt.text}</span>
                             </div>
                             <span className="material-symbols-outlined text-primary/0 group-hover:text-primary transition-all translate-x-4 group-hover:translate-x-0">bolt</span>
                          </button>
                        ))}
                     </div>
                   </>
                 ) : (
                   <div className="flex-1 flex flex-col items-center justify-center text-center animate-in zoom-in duration-300 relative z-10">
                      <div className={`size-20 rounded-3xl flex items-center justify-center mb-8 shadow-2xl ${feedback.isCorrect ? 'bg-primary text-slate-900 shadow-primary/30' : 'bg-red-600 text-white shadow-red-600/30'}`}>
                        <span className="material-symbols-outlined text-5xl font-black">{feedback.isCorrect ? 'verified' : 'priority_high'}</span>
                      </div>
                      <h4 className={`text-4xl font-black mb-4 uppercase italic tracking-tighter ${feedback.isCorrect ? 'text-primary' : 'text-red-500'}`}>{feedback.msg}</h4>
                      <p className="text-slate-400 font-medium mb-12 max-w-xl text-lg leading-relaxed">{enemy.explanation}</p>
                      <button onClick={nextAction} className="bg-white text-slate-900 px-16 py-4 rounded-[20px] font-black uppercase tracking-widest text-sm hover:scale-110 active:scale-95 transition-all shadow-xl shadow-white/10 flex items-center gap-3">
                        <span>Дараагийн дайралт</span>
                        <span className="material-symbols-outlined font-black">arrow_forward</span>
                      </button>
                   </div>
                 )}
              </div>
           </div>
         )}
      </main>
    </div>
  );
};

export default GameView;
