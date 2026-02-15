
import React, { useState, useEffect } from 'react';
import { QuizQuestion } from '../data/quizzes';

interface QuizViewProps {
  user: string;
  quizData: QuizQuestion[];
  onBack: () => void;
  onComplete: (score: number, total: number) => void;
}

const QuizView: React.FC<QuizViewProps> = ({ user, quizData, onBack, onComplete }) => {
  const quizStoreKey = `codequest_${user}_quiz_v3_${quizData.length}`;

  const [currentIdx, setCurrentIdx] = useState(() => {
    const saved = localStorage.getItem(quizStoreKey);
    return saved ? JSON.parse(saved).currentIdx : 0;
  });
  const [selectedId, setSelectedId] = useState<string | null>(() => {
    const saved = localStorage.getItem(quizStoreKey);
    return saved ? JSON.parse(saved).selectedId : null;
  });
  const [isAnswered, setIsAnswered] = useState(() => {
    const saved = localStorage.getItem(quizStoreKey);
    return saved ? JSON.parse(saved).isAnswered : false;
  });
  const [score, setScore] = useState(() => {
    const saved = localStorage.getItem(quizStoreKey);
    return saved ? JSON.parse(saved).score : 0;
  });
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (!showResult) {
      localStorage.setItem(quizStoreKey, JSON.stringify({
        currentIdx,
        selectedId,
        isAnswered,
        score
      }));
    }
  }, [currentIdx, selectedId, isAnswered, score, showResult, quizStoreKey]);

  const question = quizData[currentIdx];
  const progressPercent = ((currentIdx + (isAnswered ? 1 : 0)) / quizData.length) * 100;

  if (!question && !showResult) return <div className="p-10 text-white">Тест олдсонгүй.</div>;

  const handleSelect = (id: string) => {
    if (isAnswered) return;
    setSelectedId(id);
    setIsAnswered(true);
    if (id === question.correctOptionId) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIdx < quizData.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedId(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
      onComplete(score, quizData.length);
      localStorage.removeItem(quizStoreKey);
    }
  };

  const handleRestart = () => {
    localStorage.removeItem(quizStoreKey);
    setCurrentIdx(0);
    setScore(0);
    setSelectedId(null);
    setIsAnswered(false);
    setShowResult(false);
  };

  if (showResult) {
    const win = score / quizData.length >= 0.7;
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-10 bg-[#f8faf9] dark:bg-[#0d1a13] font-display">
        <div className="bg-white dark:bg-slate-900 p-12 rounded-[48px] shadow-2xl border-4 border-primary/20 max-w-lg w-full text-center animate-in zoom-in duration-500">
           <div className={`size-32 rounded-[40px] flex items-center justify-center text-slate-900 mx-auto mb-8 shadow-2xl rotate-3 ${win ? 'bg-primary shadow-primary/30' : 'bg-red-500 shadow-red-500/30'}`}>
              <span className="material-symbols-outlined text-6xl font-black">
                {win ? 'emoji_events' : 'sentiment_very_dissatisfied'}
              </span>
           </div>
           <h2 className="text-4xl font-black mb-2 uppercase tracking-tighter">Дүн: {score} / {quizData.length}</h2>
           <p className="text-slate-500 font-bold uppercase tracking-widest text-sm mb-12">
             {win ? 'Гайхалтай! Чи С хэлийг сайн мэдэж байна.' : 'Бага зэрэг хичээх хэрэгтэй байна.'}
           </p>
           
           <div className="grid grid-cols-2 gap-4">
              <button onClick={handleRestart} className="bg-primary text-slate-900 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg">Дахин эхлэх</button>
              <button onClick={onBack} className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 py-4 rounded-2xl font-black text-sm uppercase tracking-widest">Гарах</button>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#f8faf9] dark:bg-[#0d1a13] font-display">
      <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-white/5 flex items-center justify-between px-8 shrink-0">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="size-10 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-all text-slate-400">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h2 className="text-xl font-black tracking-tighter">Мэдлэг шалгах тест</h2>
        </div>
        <div className="flex items-center gap-4">
           <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Оноо</p>
              <p className="text-xl font-black text-primary">{score} / {quizData.length}</p>
           </div>
           <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">psychology</span>
           </div>
        </div>
      </header>

      <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800">
        <div className="h-full bg-primary transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
      </div>

      <main className="flex-1 overflow-y-auto p-10 flex flex-col items-center custom-scrollbar">
        <div className="max-w-3xl w-full">
           <div className="mb-12">
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4 block">Асуулт {currentIdx + 1}</span>
              <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-tight">{question.question}</h1>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {question.options.map((opt) => {
                const isSelected = selectedId === opt.id;
                const isThisCorrect = opt.id === question.correctOptionId;
                
                let btnClass = "bg-white dark:bg-slate-900 border-4 border-slate-100 dark:border-slate-800 hover:border-primary/40";
                if (isAnswered) {
                  if (isThisCorrect) btnClass = "bg-primary/10 border-primary text-primary shadow-lg shadow-primary/10 scale-[1.02]";
                  else if (isSelected) btnClass = "bg-red-500/10 border-red-500 text-red-500 opacity-60";
                  else btnClass = "opacity-40 grayscale";
                }

                return (
                  <button 
                    key={opt.id} 
                    onClick={() => handleSelect(opt.id)}
                    className={`p-8 rounded-[32px] text-left transition-all relative overflow-hidden group ${btnClass}`}
                  >
                    <div className="flex items-center gap-4 relative z-10">
                       <span className={`size-10 rounded-xl flex items-center justify-center font-black ${isSelected ? 'bg-primary text-slate-900' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                          {opt.id.toUpperCase()}
                       </span>
                       <span className="text-lg font-bold">{opt.text}</span>
                    </div>
                  </button>
                );
              })}
           </div>

           {isAnswered && (
             <div className="mt-12 animate-in slide-in-from-bottom-6 duration-500">
                <div className={`p-8 rounded-[32px] border-l-8 ${selectedId === question.correctOptionId ? 'bg-primary/10 border-primary' : 'bg-red-500/10 border-red-500'}`}>
                   <div className="flex items-center gap-3 mb-4">
                      <span className="material-symbols-outlined font-black">
                        {selectedId === question.correctOptionId ? 'check_circle' : 'cancel'}
                      </span>
                      <h4 className="font-black uppercase tracking-widest text-xs">
                        {selectedId === question.correctOptionId ? 'Зөв байна!' : 'Буруу хариуллаа'}
                      </h4>
                   </div>
                   <p className="text-lg font-medium mb-8 leading-relaxed opacity-80">{question.explanation}</p>
                   <button onClick={nextQuestion} className="bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
                      <span>{currentIdx < quizData.length - 1 ? 'Дараагийн асуулт' : 'Дуусгах'}</span>
                      <span className="material-symbols-outlined">arrow_forward</span>
                   </button>
                </div>
             </div>
           )}
        </div>
      </main>
    </div>
  );
};

export default QuizView;
