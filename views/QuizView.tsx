
import React, { useState, useEffect } from 'react';
import { PYTHON_QUIZ, QuizQuestion } from '../data/quizzes';

interface QuizViewProps {
  user: string;
  onBack: () => void;
  onComplete: (score: number, total: number) => void;
}

const QuizView: React.FC<QuizViewProps> = ({ user, onBack, onComplete }) => {
  const quizStoreKey = `codequest_${user}_quiz_v1`;

  // Initialize state from local storage if available
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

  // Save state to local storage whenever it changes
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

  const question = PYTHON_QUIZ[currentIdx];
  const isCorrect = selectedId === question.correctOptionId;

  const handleSelect = (id: string) => {
    if (isAnswered) return;
    setSelectedId(id);
    setIsAnswered(true);
    if (id === question.correctOptionId) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIdx < PYTHON_QUIZ.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedId(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
      onComplete(score, PYTHON_QUIZ.length);
      // Optional: Clear storage on finish so they can restart later
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
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-10 bg-[#f8faf9] dark:bg-[#0d1a13]">
        <div className="bg-white dark:bg-slate-900 p-12 rounded-[40px] shadow-2xl border-4 border-primary/20 max-w-lg w-full text-center">
           <div className={`size-24 rounded-full flex items-center justify-center text-slate-900 mx-auto mb-8 shadow-xl shadow-primary/30 ${score === PYTHON_QUIZ.length ? 'bg-primary' : 'bg-yellow-400'}`}>
              <span className="material-symbols-outlined text-5xl font-black">
                {score === PYTHON_QUIZ.length ? 'military_tech' : 'emoji_events'}
              </span>
           </div>
           <h2 className="text-4xl font-black mb-2">Шалгалт дууслаа!</h2>
           <p className="text-slate-500 font-bold uppercase tracking-widest text-sm mb-8">Чиний амжилт</p>
           
           <div className="text-6xl font-black text-primary mb-4 tracking-tighter">
              {score} / {PYTHON_QUIZ.length}
           </div>
           
           <div className="mb-10">
              {score === PYTHON_QUIZ.length ? (
                <div className="p-4 bg-primary/10 rounded-2xl border-2 border-primary/30 mb-4">
                  <p className="text-primary font-black text-sm uppercase tracking-widest">🏆 Шинэ цол авлаа: Python Master</p>
                </div>
              ) : null}
              <p className="text-lg font-medium text-slate-600 dark:text-slate-400">
                {score > 25 ? "Гайхалтай! Чи Python-ийг маш сайн ойлгожээ. 🚀" : score > 15 ? "Сайн байна! Бага зэрэг давтах хэрэгтэй. 💪" : "Заавал хичээлүүдээ дахин үзээрэй. Чи чадна! 🔥"}
              </p>
           </div>

           <div className="space-y-3">
              <button 
                onClick={onBack}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest"
              >
                Дуусгах
              </button>
              <button 
                onClick={handleRestart}
                className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white py-4 rounded-2xl font-black text-lg border-2 border-slate-100 dark:border-slate-700 hover:bg-slate-50 transition-all uppercase tracking-widest"
              >
                Дахин эхлэх
              </button>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-10 bg-[#f8faf9] dark:bg-[#0d1a13] font-display">
      <header className="mb-10 flex items-center justify-between max-w-4xl mx-auto">
        <div>
          <button onClick={onBack} className="flex items-center gap-2 text-slate-500 font-black uppercase text-xs tracking-widest mb-2 hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-sm">arrow_back</span> Хадгалаад гарах
          </button>
          <h1 className="text-3xl font-black tracking-tight">Мэдлэгээ шалгах 🧠</h1>
        </div>
        <div className="flex items-center gap-4">
           <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Одоогийн оноо</p>
              <p className="text-xl font-black text-primary leading-none">{score}</p>
           </div>
           <div className="bg-slate-900 text-white px-6 py-2 rounded-2xl font-black text-sm uppercase tracking-widest border border-white/10 shrink-0">
              {currentIdx + 1} / {PYTHON_QUIZ.length}
           </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto">
        <div className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-full mb-10 overflow-hidden shadow-inner">
          <div 
            className="h-full bg-primary transition-all duration-500 ease-out shadow-[0_0_15px_rgba(19,236,128,0.5)]"
            style={{ width: `${((currentIdx + 1) / PYTHON_QUIZ.length) * 100}%` }}
          ></div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-10 rounded-[32px] border-4 border-slate-100 dark:border-slate-800 shadow-xl mb-8 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <span className="material-symbols-outlined text-[100px]">psychology</span>
           </div>
           <h3 className="text-2xl font-black mb-8 leading-relaxed relative z-10">
             {question.question}
           </h3>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
              {question.options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleSelect(opt.id)}
                  disabled={isAnswered}
                  className={`p-6 rounded-2xl text-left font-bold text-lg border-4 transition-all flex items-center justify-between group ${
                    isAnswered 
                      ? opt.id === question.correctOptionId 
                        ? 'bg-primary/20 border-primary text-primary shadow-lg shadow-primary/10' 
                        : selectedId === opt.id 
                          ? 'bg-red-500/10 border-red-500 text-red-500' 
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-800 opacity-50 scale-[0.98]'
                      : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-800 hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:scale-[1.02]'
                  }`}
                >
                  <span>{opt.text}</span>
                  <div className="shrink-0 ml-4">
                    {isAnswered && opt.id === question.correctOptionId && (
                      <span className="material-symbols-outlined font-black text-primary animate-in zoom-in">check_circle</span>
                    )}
                    {isAnswered && selectedId === opt.id && opt.id !== question.correctOptionId && (
                      <span className="material-symbols-outlined font-black text-red-500 animate-in zoom-in">cancel</span>
                    )}
                    {!isAnswered && (
                      <span className="size-6 rounded-full border-2 border-slate-200 dark:border-slate-600 group-hover:border-primary transition-colors"></span>
                    )}
                  </div>
                </button>
              ))}
           </div>
        </div>

        {isAnswered && (
          <div className={`p-8 rounded-[32px] border-4 animate-in slide-in-from-bottom duration-500 shadow-2xl ${isCorrect ? 'bg-primary/5 border-primary/20' : 'bg-red-500/5 border-red-500/20'}`}>
            <div className="flex items-start gap-5">
               <div className={`size-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${isCorrect ? 'bg-primary text-slate-900' : 'bg-red-500 text-white'}`}>
                  <span className="material-symbols-outlined font-black text-3xl">{isCorrect ? 'verified' : 'lightbulb'}</span>
               </div>
               <div className="flex-1">
                  <h4 className={`text-xl font-black mb-2 uppercase tracking-tight ${isCorrect ? 'text-primary' : 'text-red-500'}`}>
                    {isCorrect ? 'Гайхалтай, зөв байна!' : 'Дараагийн удаа заавал зөв хариулаарай'}
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed text-lg">
                    {question.explanation}
                  </p>
               </div>
            </div>
            <div className="mt-8 flex justify-end">
               <button 
                onClick={nextQuestion}
                className="bg-slate-900 dark:bg-primary text-white dark:text-slate-900 px-10 py-4 rounded-2xl font-black uppercase text-sm tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/10 flex items-center gap-2"
               >
                 <span>{currentIdx < PYTHON_QUIZ.length - 1 ? 'Дараагийн асуулт' : 'Үр дүнг харах'}</span>
                 <span className="material-symbols-outlined font-bold">arrow_forward</span>
               </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="max-w-4xl mx-auto mt-10 p-6 bg-slate-100/50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 flex items-center gap-3">
         <span className="material-symbols-outlined text-slate-400">info</span>
         <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">Таны явц автоматаар хадгалагдаж байна. Та хүссэн үедээ гараад эргэн орж үргэлжлүүлэх боломжтой.</p>
      </div>
    </div>
  );
};

export default QuizView;
