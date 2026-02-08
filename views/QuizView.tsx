
import React, { useState } from 'react';
import { PYTHON_QUIZ, QuizQuestion } from '../data/quizzes';

interface QuizViewProps {
  onBack: () => void;
}

const QuizView: React.FC<QuizViewProps> = ({ onBack }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

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
    }
  };

  if (showResult) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-10 bg-[#f8faf9] dark:bg-[#0d1a13]">
        <div className="bg-white dark:bg-slate-900 p-12 rounded-[40px] shadow-2xl border-4 border-primary/20 max-w-lg w-full text-center">
           <div className="size-24 rounded-full bg-primary flex items-center justify-center text-slate-900 mx-auto mb-8 shadow-xl shadow-primary/30">
              <span className="material-symbols-outlined text-5xl font-black">emoji_events</span>
           </div>
           <h2 className="text-4xl font-black mb-2">Шалгалт дууслаа!</h2>
           <p className="text-slate-500 font-bold uppercase tracking-widest text-sm mb-8">Чиний амжилт</p>
           
           <div className="text-6xl font-black text-primary mb-4 tracking-tighter">
              {score} / {PYTHON_QUIZ.length}
           </div>
           <p className="text-lg font-medium text-slate-600 dark:text-slate-400 mb-10">
              {score > 25 ? "Гайхалтай! Чи Python-ийг маш сайн ойлгожээ. 🚀" : score > 15 ? "Сайн байна! Бага зэрэг давтах хэрэгтэй. 💪" : "Заавал хичээлүүдээ дахин үзээрэй. Чи чадна! 🔥"}
           </p>

           <button 
            onClick={onBack}
            className="w-full bg-primary text-slate-900 py-4 rounded-2xl font-black text-xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest"
           >
             Буцах
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-10 bg-[#f8faf9] dark:bg-[#0d1a13] font-display">
      <header className="mb-10 flex items-center justify-between max-w-4xl mx-auto">
        <div>
          <button onClick={onBack} className="flex items-center gap-2 text-slate-500 font-black uppercase text-xs tracking-widest mb-2 hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-sm">arrow_back</span> Гарах
          </button>
          <h1 className="text-3xl font-black tracking-tight">Мэдлэгээ шалгах 🧠</h1>
        </div>
        <div className="bg-slate-900 text-white px-6 py-2 rounded-2xl font-black text-sm uppercase tracking-widest border border-white/10">
           {currentIdx + 1} / {PYTHON_QUIZ.length}
        </div>
      </header>

      <div className="max-w-4xl mx-auto">
        <div className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-full mb-10 overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${((currentIdx + 1) / PYTHON_QUIZ.length) * 100}%` }}
          ></div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-10 rounded-[32px] border-4 border-slate-100 dark:border-slate-800 shadow-xl mb-8">
           <h3 className="text-2xl font-black mb-8 leading-relaxed">
             {question.question}
           </h3>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {question.options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleSelect(opt.id)}
                  disabled={isAnswered}
                  className={`p-6 rounded-2xl text-left font-bold text-lg border-4 transition-all flex items-center justify-between ${
                    isAnswered 
                      ? opt.id === question.correctOptionId 
                        ? 'bg-primary/20 border-primary text-primary' 
                        : selectedId === opt.id 
                          ? 'bg-red-500/10 border-red-500 text-red-500' 
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-800 opacity-50'
                      : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-800 hover:border-primary/50'
                  }`}
                >
                  <span>{opt.text}</span>
                  {isAnswered && opt.id === question.correctOptionId && (
                    <span className="material-symbols-outlined font-black">check_circle</span>
                  )}
                  {isAnswered && selectedId === opt.id && opt.id !== question.correctOptionId && (
                    <span className="material-symbols-outlined font-black">cancel</span>
                  )}
                </button>
              ))}
           </div>
        </div>

        {isAnswered && (
          <div className={`p-8 rounded-[32px] border-4 animate-in slide-in-from-bottom duration-500 shadow-lg ${isCorrect ? 'bg-primary/5 border-primary/20' : 'bg-red-500/5 border-red-500/20'}`}>
            <div className="flex items-start gap-4">
               <div className={`size-12 rounded-2xl flex items-center justify-center shrink-0 ${isCorrect ? 'bg-primary text-slate-900' : 'bg-red-500 text-white'}`}>
                  <span className="material-symbols-outlined font-black">{isCorrect ? 'verified' : 'info'}</span>
               </div>
               <div>
                  <h4 className={`text-xl font-black mb-2 uppercase tracking-tight ${isCorrect ? 'text-primary' : 'text-red-500'}`}>
                    {isCorrect ? 'Зөв байна!' : 'Буруу хариуллаа'}
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                    {question.explanation}
                  </p>
               </div>
            </div>
            <div className="mt-8 flex justify-end">
               <button 
                onClick={nextQuestion}
                className="bg-slate-900 text-white px-8 py-3 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-primary hover:text-slate-900 transition-all shadow-xl"
               >
                 {currentIdx < PYTHON_QUIZ.length - 1 ? 'Дараагийн асуулт' : 'Үр дүнг харах'}
               </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizView;
