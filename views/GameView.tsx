
import React, { useState, useEffect } from 'react';
import { getFirestore, doc, setDoc, onSnapshot, updateDoc, deleteDoc, getDoc } from "firebase/firestore";
import { User } from "firebase/auth";

interface GameViewProps {
  user: User;
  onBack: () => void;
}

type GameMode = 'adventure' | 'duel' | 'online';
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
  { q: "int x=5, y=2; float z = x/y; z хэд вэ?", options: ["2.5", "2.0", "3.0", "0.0"], correct: 1, explanation: "Бүхэл тоон хуваалтын үр дүн бүхэл гарна." }
];

const CLASSES = {
  knight: { name: 'Array Knight', hp: 150, dmg: 15, icon: 'shield' },
  mage: { name: 'Loop Mage', hp: 90, dmg: 35, icon: 'magic_button' },
  rogue: { name: 'Logic Rogue', hp: 110, dmg: 22, icon: 'bolt' },
  techno: { name: 'Techno Monk', hp: 130, dmg: 20, icon: 'memory' }
};

const GameView: React.FC<GameViewProps> = ({ user, onBack }) => {
  const db = getFirestore();
  const [view, setView] = useState<'lobby' | 'online_menu' | 'battle' | 'result'>('lobby');
  const [mode, setMode] = useState<GameMode>('adventure');
  const [roomId, setRoomId] = useState('');
  const [roomInput, setRoomInput] = useState('');
  const [gameState, setGameState] = useState<any>(null);
  const [p1Class, setP1Class] = useState<PlayerClass>('knight');
  const [feedback, setFeedback] = useState<string | null>(null);

  // Online Multiplayer Logic
  useEffect(() => {
    if (roomId) {
      const unsub = onSnapshot(doc(db, "matches", roomId), (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          setGameState(data);
          if (data.status === 'finished') setView('result');
        }
      });
      return () => unsub();
    }
  }, [roomId]);

  const createRoom = async () => {
    const id = Math.random().toString(36).substring(2, 8).toUpperCase();
    const newMatch = {
      id,
      p1: { uid: user.uid, name: user.email?.split('@')[0], hp: CLASSES[p1Class].hp, maxHp: CLASSES[p1Class].hp, class: p1Class },
      p2: null,
      turn: user.uid,
      status: 'waiting',
      qIdx: Math.floor(Math.random() * QUESTIONS.length),
      lastAction: 'Room created'
    };
    await setDoc(doc(db, "matches", id), newMatch);
    setRoomId(id);
    setView('battle');
  };

  const joinRoom = async () => {
    const id = roomInput.trim().toUpperCase();
    const roomRef = doc(db, "matches", id);
    const snap = await getDoc(roomRef);
    if (snap.exists()) {
      const data = snap.data();
      if (data.status === 'waiting') {
        await updateDoc(roomRef, {
          p2: { uid: user.uid, name: user.email?.split('@')[0], hp: CLASSES[p1Class].hp, maxHp: CLASSES[p1Class].hp, class: p1Class },
          status: 'playing'
        });
        setRoomId(id);
        setView('battle');
      } else {
        alert("Өрөө дүүрсэн эсвэл тоглоом эхэлсэн байна.");
      }
    } else {
      alert("Өрөө олдсонгүй.");
    }
  };

  const handleAnswer = async (idx: number) => {
    if (!gameState || gameState.turn !== user.uid || gameState.status !== 'playing') return;

    const isCorrect = idx === QUESTIONS[gameState.qIdx].correct;
    const isP1 = user.uid === gameState.p1.uid;
    const opponent = isP1 ? gameState.p2 : gameState.p1;
    const attacker = isP1 ? gameState.p1 : gameState.p2;
    const dmg = CLASSES[attacker.class as PlayerClass].dmg;

    let nextState: any = { ...gameState };
    
    if (isCorrect) {
      const newHp = Math.max(0, opponent.hp - dmg);
      if (isP1) nextState.p2.hp = newHp;
      else nextState.p1.hp = newHp;
      nextState.lastAction = `${attacker.name} hit for ${dmg}!`;
      setFeedback("Зөв! Довтолгоо амжилттай.");
    } else {
      nextState.lastAction = `${attacker.name} missed!`;
      setFeedback("Буруу! Логик алдаа.");
    }

    nextState.turn = opponent.uid;
    nextState.qIdx = Math.floor(Math.random() * QUESTIONS.length);

    if (nextState.p1.hp <= 0 || nextState.p2.hp <= 0) {
      nextState.status = 'finished';
    }

    await updateDoc(doc(db, "matches", roomId), nextState);
    setTimeout(() => setFeedback(null), 1500);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#050806] text-white font-display overflow-hidden relative select-none">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="grid grid-cols-12 h-full opacity-20">
          {Array.from({ length: 48 }).map((_, i) => (
            <div key={i} className="border border-primary/20 p-4 font-mono text-[10px]">{Math.floor(Math.random() * 2)}</div>
          ))}
        </div>
      </div>

      <header className="h-20 border-b border-primary/20 flex items-center justify-between px-10 relative z-20 bg-black/60 backdrop-blur-xl">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="size-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-primary/20 transition-all border border-white/10">
            <span className="material-symbols-outlined text-slate-400">arrow_back</span>
          </button>
          <h2 className="text-2xl font-black italic uppercase text-primary tracking-tighter">Online Cyber Arena</h2>
        </div>
        {roomId && (
           <div className="bg-primary/10 border border-primary/30 px-6 py-2 rounded-full flex items-center gap-3">
              <span className="text-[10px] font-black uppercase text-primary/60">Room ID:</span>
              <span className="text-lg font-black tracking-widest text-primary animate-pulse">{roomId}</span>
           </div>
        )}
      </header>

      <main className="flex-1 flex flex-col p-10 relative z-10 max-w-7xl mx-auto w-full">
        {view === 'lobby' && (
          <div className="flex-1 flex flex-col items-center justify-center animate-in zoom-in duration-500">
             <div className="text-center mb-16">
                <h1 className="text-6xl font-black italic mb-4 uppercase tracking-tighter">Battle Online</h1>
                <p className="text-slate-500 font-bold uppercase tracking-[0.4em]">Choose your class & join arena</p>
             </div>
             
             <div className="bg-white/5 p-8 rounded-[48px] border-2 border-white/10 mb-12 flex gap-4">
                {(Object.keys(CLASSES) as PlayerClass[]).map(c => (
                   <button key={c} onClick={() => setP1Class(c)} className={`size-24 rounded-3xl border-4 transition-all flex flex-col items-center justify-center gap-2 ${p1Class === c ? 'bg-primary border-white text-slate-900 scale-110 shadow-xl' : 'bg-slate-900 border-white/5 text-slate-400'}`}>
                      <span className="material-symbols-outlined text-4xl">{CLASSES[c].icon}</span>
                   </button>
                ))}
             </div>

             <div className="grid grid-cols-2 gap-8 w-full max-w-2xl">
                <button onClick={createRoom} className="bg-primary text-slate-900 p-8 rounded-[40px] font-black text-2xl uppercase italic hover:scale-105 transition-all shadow-2xl shadow-primary/20">
                   Create Room
                </button>
                <button onClick={() => setView('online_menu')} className="bg-white text-slate-900 p-8 rounded-[40px] font-black text-2xl uppercase italic hover:scale-105 transition-all shadow-2xl">
                   Join Friend
                </button>
             </div>
          </div>
        )}

        {view === 'online_menu' && (
          <div className="flex-1 flex flex-col items-center justify-center animate-in slide-in-from-bottom duration-500">
             <h2 className="text-4xl font-black italic mb-8 uppercase">Enter Secret Code</h2>
             <input value={roomInput} onChange={e => setRoomInput(e.target.value)} placeholder="Ex: ABCD12" className="bg-white/5 border-4 border-white/10 p-6 rounded-[32px] w-full max-w-md text-center text-3xl font-black tracking-[0.5em] text-primary outline-none focus:border-primary transition-all mb-8" />
             <div className="flex gap-4">
                <button onClick={joinRoom} className="bg-primary text-slate-900 px-12 py-5 rounded-[24px] font-black uppercase italic text-xl shadow-xl hover:scale-105 transition-all">Join Battle</button>
                <button onClick={() => setView('lobby')} className="bg-white/5 text-white px-12 py-5 rounded-[24px] font-black uppercase text-xl border border-white/10">Back</button>
             </div>
          </div>
        )}

        {view === 'battle' && gameState && (
          <div className="flex-1 flex flex-col">
            {gameState.status === 'waiting' ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                 <div className="size-32 border-8 border-primary border-t-transparent rounded-full animate-spin mb-8"></div>
                 <h3 className="text-4xl font-black italic animate-pulse">Waiting for Opponent...</h3>
                 <p className="text-slate-500 mt-4 font-bold uppercase tracking-widest">Share Room ID with a friend to start</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-20 items-center mb-12">
                   {/* P1 Section */}
                   <div className={`flex flex-col items-center transition-all ${gameState.turn === gameState.p1.uid ? 'scale-110' : 'opacity-40 grayscale'}`}>
                      <div className={`size-64 rounded-[80px] bg-slate-900 border-8 ${gameState.turn === gameState.p1.uid ? 'border-primary' : 'border-white/5'} flex items-center justify-center relative shadow-2xl`}>
                         <span className="material-symbols-outlined text-[140px] text-primary">{CLASSES[gameState.p1.class as PlayerClass].icon}</span>
                         <div className="absolute -bottom-4 left-0 right-0 h-4 bg-black/40 rounded-full overflow-hidden">
                            <div className="h-full bg-primary transition-all duration-500" style={{width: `${(gameState.p1.hp/gameState.p1.maxHp)*100}%`}}></div>
                         </div>
                      </div>
                      <h4 className="mt-8 text-2xl font-black italic">{gameState.p1.name} (P1)</h4>
                   </div>

                   {/* P2 Section */}
                   <div className={`flex flex-col items-center transition-all ${gameState.turn === gameState.p2.uid ? 'scale-110' : 'opacity-40 grayscale'}`}>
                      <div className={`size-64 rounded-[80px] bg-red-950/20 border-8 ${gameState.turn === gameState.p2.uid ? 'border-red-500' : 'border-white/5'} flex items-center justify-center relative shadow-2xl`}>
                         <span className="material-symbols-outlined text-[140px] text-red-500">{CLASSES[gameState.p2.class as PlayerClass].icon}</span>
                         <div className="absolute -bottom-4 left-0 right-0 h-4 bg-black/40 rounded-full overflow-hidden">
                            <div className="h-full bg-red-500 transition-all duration-500" style={{width: `${(gameState.p2.hp/gameState.p2.maxHp)*100}%`}}></div>
                         </div>
                      </div>
                      <h4 className="mt-8 text-2xl font-black italic">{gameState.p2.name} (P2)</h4>
                   </div>
                </div>

                <div className="bg-black/60 border-4 border-white/5 rounded-[48px] p-10 min-h-[300px] flex flex-col shadow-2xl backdrop-blur-3xl relative overflow-hidden">
                   {feedback ? (
                      <div className="flex-1 flex items-center justify-center text-center animate-in zoom-in">
                         <h5 className="text-6xl font-black italic text-primary">{feedback}</h5>
                      </div>
                   ) : gameState.turn !== user.uid ? (
                      <div className="flex-1 flex flex-col items-center justify-center text-center">
                         <div className="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6"></div>
                         <h5 className="text-2xl font-black italic uppercase tracking-widest text-slate-500">Opponent is thinking...</h5>
                      </div>
                   ) : (
                      <>
                         <div className="flex items-center gap-3 mb-8">
                            <span className="size-3 rounded-full bg-primary animate-ping"></span>
                            <span className="text-xs font-black uppercase text-primary/60 tracking-widest">Your Turn - Execute Code</span>
                         </div>
                         <h3 className="text-3xl font-black mb-10 leading-relaxed">{QUESTIONS[gameState.qIdx].q}</h3>
                         <div className="grid grid-cols-2 gap-4">
                            {QUESTIONS[gameState.qIdx].options.map((opt, i) => (
                               <button key={i} onClick={() => handleAnswer(i)} className="bg-white/5 border-2 border-white/10 hover:border-primary/50 p-6 rounded-[28px] text-left font-bold text-lg transition-all hover:bg-primary/5 flex items-center justify-between group">
                                  <span>{opt}</span>
                                  <span className="text-[10px] font-black text-slate-600 group-hover:text-primary transition-colors">EXECUTE</span>
                               </button>
                            ))}
                         </div>
                      </>
                   )}
                </div>
              </>
            )}
          </div>
        )}

        {view === 'result' && gameState && (
          <div className="flex-1 flex flex-col items-center justify-center text-center animate-in zoom-in duration-500">
             <div className="size-48 rounded-[60px] bg-primary flex items-center justify-center text-slate-900 mb-10 shadow-[0_0_100px_rgba(19,236,128,0.3)]">
                <span className="material-symbols-outlined text-[100px] font-black animate-bounce">emoji_events</span>
             </div>
             <h2 className="text-8xl font-black italic mb-4 uppercase tracking-tighter">BATTLE END</h2>
             <p className="text-3xl text-slate-400 font-bold mb-12 uppercase">
                {gameState.p1.hp > 0 ? gameState.p1.name : gameState.p2.name} is the Master Coder!
             </p>
             <button onClick={() => setView('lobby')} className="bg-primary text-slate-900 px-16 py-6 rounded-[32px] font-black text-2xl uppercase italic shadow-2xl hover:scale-105 transition-all">Back to Lobby</button>
          </div>
        )}
      </main>

      <footer className="h-12 bg-black/80 border-t border-white/5 px-10 flex items-center justify-between text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">
         <div className="flex gap-10">
            <span>Server: ASIA-EAST</span>
            <span>Latency: 45ms</span>
         </div>
         <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-primary animate-pulse"></span>
            <span>Connected as {user.email}</span>
         </div>
      </footer>
    </div>
  );
};

export default GameView;
