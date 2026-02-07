
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { LESSON_DATA } from '../data/lessons';
import { StepContent, CodingTask, DebugStep } from '../types';

interface LessonViewProps {
  onExit: (completed?: boolean) => void;
  moduleId: string | null;
  initialLanguage: 'python' | 'c';
  onLanguageChange?: (lang: 'python' | 'c') => void;
}

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

const LessonView: React.FC<LessonViewProps> = ({ onExit, moduleId, initialLanguage, onLanguageChange }) => {
  const lesson = moduleId ? LESSON_DATA[moduleId] : null;
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [selectedQuizOption, setSelectedQuizOption] = useState<string | null>(null);
  const [isTaskCompleted, setIsTaskCompleted] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState<'python' | 'c'>(initialLanguage);
  
  // Debug State
  const [isDebugMode, setIsDebugMode] = useState(false);
  const [debugStepIdx, setDebugStepIdx] = useState(0);
  
  // AI Chat State
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'model', text: `Сайн уу! Би чиний 'CodeStep Tutor' багш байна. 🤖 Би чамд ${initialLanguage === 'c' ? 'C Language' : 'Python'} сурахад тусална. Юуг ойлгохгүй байна, надаас шууд асуугаарай!` }
  ]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const step: StepContent | undefined = lesson?.steps[currentStepIdx];
  const isLastStep = lesson ? currentStepIdx === lesson.steps.length - 1 : false;

  const currentTask: CodingTask | undefined = step?.codingTasks?.find(t => t.language === activeLanguage);
  const activeDebugStep: DebugStep | undefined = currentTask?.debugSteps?.[debugStepIdx];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  if (!lesson || !step) return <div className="p-10">Алдаа: Хичээл олдсонгүй.</div>;

  const handleLanguageToggle = (lang: 'python' | 'c') => {
    setActiveLanguage(lang);
    setIsDebugMode(false);
    setTerminalOutput([]);
    if (onLanguageChange) onLanguageChange(lang);
    
    // Notify tutor of language change if chat is open
    if (isAiOpen) {
      setChatMessages(prev => [...prev, { role: 'model', text: `Одоо бид ${lang === 'c' ? 'C Language' : 'Python'} дээр үргэлжлүүлэн суралцах болно. Сонирхолтой байгаа биз? 🚀` }]);
    }
  };

  const handleRunCode = () => {
    if (!currentTask) return;
    setIsRunning(true);
    setIsDebugMode(false);
    const cmd = activeLanguage === 'python' ? `$ python ${currentTask.fileName}` : `$ gcc ${currentTask.fileName} -o main && ./main`;
    setTerminalOutput(prev => [...prev, cmd]);
    
    setTimeout(() => {
      setTerminalOutput(prev => [...prev, currentTask.expectedOutput]);
      setIsRunning(false);
      setIsTaskCompleted(true);
    }, 1000);
  };

  const startDebug = () => {
    if (!currentTask?.debugSteps) return;
    setIsDebugMode(true);
    setDebugStepIdx(0);
    setTerminalOutput(["$ gdb ./main (Debugger эхэллээ)"]);
  };

  const stepDebug = () => {
    if (!currentTask?.debugSteps) return;
    if (debugStepIdx < currentTask.debugSteps.length - 1) {
      setDebugStepIdx(prev => prev + 1);
    } else {
      setIsDebugMode(false);
      setIsTaskCompleted(true);
      setTerminalOutput(prev => [...prev, "Debug амжилттай дууслаа.", currentTask.expectedOutput]);
    }
  };

  const handleQuizSelect = (optionId: string) => {
    setSelectedQuizOption(optionId);
    const option = step.quiz?.options.find(o => o.id === optionId);
    if (option?.isCorrect) {
      setIsTaskCompleted(true);
    }
  };

  const handleNext = () => {
    if (isLastStep) {
      setShowCelebration(true);
    } else {
      setCurrentStepIdx(prev => prev + 1);
      setIsTaskCompleted(false);
      setSelectedQuizOption(null);
      setTerminalOutput([]);
      setIsDebugMode(false);
    }
  };

  const askAi = async () => {
    if (!chatInput.trim() || isAiLoading) return;
    const userMsg = chatInput;
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsAiLoading(true);

    const systemInstruction = `
      Чи бол "CodeStep Tutor" нэртэй интерактив AI багш. 
      Сурагч ${activeLanguage === 'c' ? 'C хэл (C Language)' : 'Python'} сурч байна.
      Хэв маяг: Найрсаг, маш энгийн, богино өгүүлбэртэй. 
      Одоогийн хичээл: ${lesson.title} - ${step.title}.
      Одоо ашиглаж буй кодчилол: ${activeLanguage}.
    `;

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: systemInstruction + "\nСурагчийн асуулт: " + userMsg,
      });
      setChatMessages(prev => [...prev, { role: 'model', text: response.text || "Би бодож байна..." }]);
    } catch (error) {
      setChatMessages(prev => [...prev, { role: 'model', text: "Уучлаарай, алдаа гарлаа. Дахин оролдоно уу!" }]);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background-light dark:bg-background-dark relative font-display text-slate-900 dark:text-slate-100">
      {showCelebration && (
        <div className="absolute inset-0 z-[100] bg-primary flex flex-col items-center justify-center p-10 animate-in fade-in zoom-in duration-500">
          <span className="material-symbols-outlined text-[120px] text-white animate-bounce mb-6">workspace_premium</span>
          <h2 className="text-5xl font-black text-white text-center mb-4 italic uppercase">Амжилттай!</h2>
          <p className="text-xl text-white/90 text-center max-w-md mb-10 font-medium font-display">Гайхалтай! Чи {lesson.title} хичээлийг сурч дууслаа.</p>
          <button 
            onClick={() => onExit(true)}
            className="bg-white text-primary px-10 py-4 rounded-2xl font-black text-xl shadow-2xl hover:scale-105 transition-transform uppercase tracking-widest"
          >
            Дараагийн хичээл рүү
          </button>
        </div>
      )}

      <header className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 bg-white dark:bg-[#111814] px-6 py-4 z-30 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/20 text-primary border-2 border-primary/20">
            <span className="material-symbols-outlined text-3xl font-bold">school</span>
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight leading-none mb-1">{lesson.title}</h1>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{currentStepIdx + 1}-р алхам (Нийт {lesson.steps.length})</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mr-4 border border-slate-200 dark:border-slate-700">
            <button 
              onClick={() => handleLanguageToggle('c')}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeLanguage === 'c' ? 'bg-primary text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
            >
              C Language
            </button>
            <button 
              onClick={() => handleLanguageToggle('python')}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeLanguage === 'python' ? 'bg-primary text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
            >
              Python
            </button>
          </div>
          
          <button 
            onClick={() => setIsAiOpen(!isAiOpen)}
            className={`flex h-11 items-center gap-2 rounded-xl px-5 text-sm font-black transition-all border-2 ${isAiOpen ? 'bg-primary border-primary text-slate-900' : 'bg-white border-primary/20 text-primary hover:border-primary'}`}
          >
            <span className="material-symbols-outlined text-xl">smart_toy</span>
            <span>{isAiOpen ? 'Хаах' : 'AI Багш'}</span>
          </button>
          <button onClick={() => onExit()} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
             <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden relative">
        <section className={`flex flex-col overflow-y-auto border-r border-slate-200 dark:border-white/10 bg-white dark:bg-[#111814]/30 custom-scrollbar transition-all duration-500 ${isAiOpen ? 'w-1/3' : 'w-1/2'}`}>
          <div className="max-w-xl mx-auto px-8 py-10">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="h-1 w-8 bg-primary rounded-full"></span>
                <h2 className="text-3xl font-black tracking-tight">{step.title}</h2>
              </div>
              <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-300 mb-6 font-medium">
                {step.body}
              </p>

              {step.visualAid === 'box' && (
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="bg-primary/10 p-6 rounded-3xl border-4 border-dashed border-primary/30 flex flex-col items-center">
                    <div className="relative w-28 h-28 mb-4 scale-110">
                      <div className="absolute inset-0 bg-yellow-600 rounded-2xl shadow-inner transform rotate-3"></div>
                      <div className="absolute inset-0 bg-yellow-400 rounded-2xl -translate-y-2 -translate-x-1 border-2 border-yellow-700 flex items-center justify-center shadow-lg">
                        <span className="text-4xl text-yellow-900 font-black">13</span>
                      </div>
                      <div className="absolute -bottom-3 -right-3 bg-white px-3 py-1 rounded-lg border-2 border-slate-200 text-sm font-black text-slate-800 rotate-6 shadow-md">age</div>
                    </div>
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Мэдээлэл хадгалах</span>
                  </div>
                </div>
              )}

              {step.analogy && (
                <div className="bg-primary/10 p-6 rounded-2xl border-2 border-primary/20 flex gap-4 items-start shadow-sm">
                   <div className="bg-primary/20 p-2 rounded-lg shrink-0">
                      <span className="material-symbols-outlined text-primary text-3xl">{step.analogy.icon}</span>
                   </div>
                   <p className="text-sm font-semibold italic text-slate-700 dark:text-slate-300">"{step.analogy.text}"</p>
                </div>
              )}
            </div>

            {step.type === 'quiz' && (
               <div className="mb-10 rounded-3xl border-4 border-slate-100 dark:border-white/5 p-8 bg-slate-50/50 dark:bg-white/5">
                <p className="text-xl font-black mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary font-bold">contact_support</span>
                  Асуулт:
                </p>
                <div className="space-y-3">
                  {step.quiz?.options.map((opt) => (
                    <button 
                      key={opt.id}
                      onClick={() => handleQuizSelect(opt.id)}
                      className={`flex w-full items-center justify-between rounded-2xl border-2 p-5 text-left transition-all ${
                        selectedQuizOption === opt.id 
                          ? opt.isCorrect ? 'border-primary bg-primary/10' : 'border-red-400 bg-red-50' 
                          : 'border-white dark:border-white/5 bg-white dark:bg-slate-900 shadow-sm hover:border-primary/50'
                      }`}
                    >
                      <span className="font-bold text-lg">{opt.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        <section className={`flex flex-col bg-[#1e1e1e] transition-all duration-500 overflow-hidden relative ${isAiOpen ? 'w-1/3' : 'w-1/2'}`}>
          {step.type === 'coding' ? (
            <>
              <div className="flex items-center justify-between border-b border-white/10 bg-[#2d2d2d] px-6 py-2">
                <div className="flex items-center gap-2">
                  <div className={`size-3 rounded-full ${activeLanguage === 'c' ? 'bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]' : 'bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.6)]'}`}></div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    {activeLanguage === 'c' ? 'C Source' : 'Python Script'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                   {activeLanguage === 'c' && currentTask?.debugSteps && !isDebugMode && (
                     <button 
                        onClick={startDebug}
                        className="px-4 py-1.5 rounded-lg text-[10px] font-black bg-yellow-500 text-slate-900 uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-yellow-500/20 flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-sm font-black">bug_report</span>
                        Debug
                      </button>
                   )}
                   <div className="text-[10px] text-slate-500 font-mono tracking-widest opacity-60 italic">{currentTask?.fileName}</div>
                </div>
              </div>
              
              <div className="flex-1 p-6 font-mono text-lg leading-relaxed text-white relative overflow-hidden flex flex-col">
                <div className="flex gap-4 flex-1 overflow-y-auto custom-scrollbar">
                  <div className="flex flex-col text-right text-white/20 select-none pr-4 border-r border-white/5 opacity-50 min-w-8">
                    {Array.from({length: 12}).map((_, i) => <span key={i}>{i+1}</span>)}
                  </div>
                  <div className="flex-1 relative">
                    {currentTask?.template.split('\n').map((line, i) => (
                      <div key={i} className={`relative group flex items-center gap-4 transition-all duration-300 ${isDebugMode && activeDebugStep?.lineIndex === i ? 'bg-primary/20 -mx-4 px-4 border-l-4 border-primary' : ''}`}>
                        <span className="flex-1">
                          {line.includes('printf') || line.includes('print(') ? <><span className="code-syntax-function">{line.split('(')[0]}</span>({line.split('(')[1]}</> : 
                           line.includes('=') ? <><span className="code-syntax-keyword">{line.split('=')[0]}</span> = {line.split('=')[1]}</> : 
                           line.includes('#') || line.includes('int ') || line.includes('void ') || line.includes('return ') ? <span className="code-syntax-keyword">{line}</span> : line}
                        </span>
                        {isDebugMode && activeDebugStep?.lineIndex === i && (
                          <div className="absolute left-full ml-4 bg-primary text-slate-900 px-3 py-1 rounded-lg text-[10px] font-black whitespace-nowrap shadow-xl z-50 animate-in slide-in-from-left-2">
                            {activeDebugStep.comment}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {isDebugMode && (
                  <div className="mt-4 p-4 bg-slate-900 rounded-2xl border-2 border-primary/30 shadow-2xl animate-in slide-in-from-bottom-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">memory</span>
                        Санах ой (Variables):
                      </p>
                      <button 
                        onClick={stepDebug}
                        className="bg-primary text-slate-900 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-sm">step_over</span>
                        Дараагийн мөр
                      </button>
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                      {Object.keys(activeDebugStep?.variables || {}).length > 0 ? (
                        Object.entries(activeDebugStep?.variables || {}).map(([key, val]) => (
                          <div key={key} className="bg-white/5 px-4 py-2 rounded-xl border border-white/10 flex items-center gap-3">
                            <span className="text-primary font-black text-xs font-mono">{key}</span>
                            <span className="text-slate-400">=</span>
                            <span className="text-yellow-400 font-mono text-xs">{JSON.stringify(val)}</span>
                          </div>
                        ))
                      ) : (
                        <span className="text-xs text-slate-600 italic">Санах ой хоосон байна.</span>
                      )}
                    </div>
                  </div>
                )}

                {!isDebugMode && (
                  <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/10 border-dashed">
                     <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">info</span>
                        Мөр бүрийн тайлбар ({activeLanguage === 'c' ? 'C' : 'Python'}):
                     </p>
                     <div className="space-y-1">
                        {currentTask?.explanation.map((exp, i) => (
                          <div key={i} className="text-xs text-slate-400 flex gap-2">
                            <span className="text-primary font-bold">●</span> {exp}
                          </div>
                        ))}
                     </div>
                  </div>
                )}
              </div>

              <div className="h-1/3 flex flex-col border-t border-white/10 bg-[#0c0c0c]">
                <div className="flex items-center justify-between px-6 py-3 bg-[#1a1a1a]">
                   <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Үр дүн (Terminal)</span>
                   {!isDebugMode && (
                    <button 
                      onClick={handleRunCode}
                      disabled={isRunning}
                      className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-xs font-black text-slate-900 hover:scale-105 transition-all disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined text-sm font-bold">{isRunning ? 'sync' : 'play_arrow'}</span>
                      {isRunning ? 'Ажиллуулж байна...' : 'Ажиллуулах'}
                    </button>
                   )}
                </div>
                <div className="flex-1 p-6 font-mono text-lg text-primary overflow-y-auto custom-scrollbar bg-black/40">
                  {terminalOutput.length === 0 ? (
                    <div className="text-slate-700 italic text-sm">Код ажиллуулах эсвэл Debug хийхийг хүлээж байна...</div>
                  ) : (
                    terminalOutput.map((line, i) => (
                      <div key={i} className={`flex gap-3 ${line.startsWith('$') ? 'text-slate-500' : 'animate-in slide-in-from-left duration-300'}`}>
                         <span className="select-none text-slate-700">{line.startsWith('$') ? '' : '>'}</span>
                         <span>{line}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-slate-900/50">
               <div className="size-32 rounded-full bg-slate-800/50 flex items-center justify-center mb-8 border-4 border-slate-700">
                  <span className="material-symbols-outlined text-[64px] text-slate-500">menu_book</span>
               </div>
               <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-wider">Онол</h3>
               <p className="text-slate-400 max-w-sm font-medium">Зүүн талын тайлбарыг сайн уншаарай. Дараа нь бид хамтдаа код бичих болно!</p>
            </div>
          )}
        </section>

        <section 
          className={`absolute right-0 top-0 bottom-0 z-40 bg-white dark:bg-slate-900 border-l-4 border-primary/20 shadow-[-20px_0_50px_rgba(0,0,0,0.2)] transition-all duration-500 flex flex-col ${isAiOpen ? 'w-1/3 translate-x-0' : 'w-1/3 translate-x-full'}`}
        >
           <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-2xl bg-primary flex items-center justify-center text-slate-900">
                <span className="material-symbols-outlined font-black">smart_toy</span>
              </div>
              <h4 className="font-black text-lg">CodeStep Tutor</h4>
            </div>
            <button onClick={() => setIsAiOpen(false)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors">
              <span className="material-symbols-outlined text-slate-500">close</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-slate-50/30 dark:bg-transparent">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[90%] px-5 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-primary text-slate-900 font-bold shadow-lg shadow-primary/20' 
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-2 border-slate-100 dark:border-slate-700 shadow-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isAiLoading && (
              <div className="flex flex-col items-start animate-pulse">
                <div className="bg-slate-100 dark:bg-slate-800 px-5 py-3 rounded-2xl flex gap-2 items-center">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Багш бодож байна...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-5 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <form onSubmit={(e) => { e.preventDefault(); askAi(); }} className="flex gap-3">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Багшаас асуух зүйл байна уу?..."
                className="flex-1 bg-slate-100 dark:bg-slate-800 border-none rounded-2xl px-5 py-3 text-sm font-bold focus:ring-4 focus:ring-primary/20 transition-all placeholder:text-slate-400"
              />
              <button 
                type="submit"
                disabled={!chatInput.trim() || isAiLoading}
                className="bg-primary text-slate-900 size-12 flex items-center justify-center rounded-2xl hover:scale-105 transition-all disabled:opacity-50 shadow-lg shadow-primary/20"
              >
                <span className="material-symbols-outlined font-black">send</span>
              </button>
            </form>
          </div>
        </section>
      </main>

      <footer className="flex items-center justify-between border-t border-slate-200 dark:border-white/10 bg-white dark:bg-[#111814] px-10 py-5 shadow-2xl z-30">
        <button 
          onClick={() => currentStepIdx > 0 ? setCurrentStepIdx(prev => prev - 1) : onExit()}
          className="flex h-14 items-center gap-2 rounded-2xl border-2 border-slate-200 dark:border-white/10 px-8 font-black text-slate-600 hover:bg-slate-50 transition-all uppercase tracking-widest text-xs"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          Буцах
        </button>

        <div className="flex items-center gap-8">
           {isTaskCompleted && (
            <div className="hidden lg:flex items-center gap-3 text-primary animate-in zoom-in duration-300">
              <span className="material-symbols-outlined font-black text-3xl">task_alt</span>
              <span className="font-black uppercase tracking-widest text-xs">Даалгавар биеллээ!</span>
            </div>
          )}
          <button 
            onClick={handleNext}
            disabled={!isTaskCompleted && step.type !== 'concept'}
            className={`flex h-14 min-w-[200px] items-center justify-center gap-3 rounded-2xl px-10 font-black text-lg transition-all shadow-xl uppercase tracking-[0.15em] ${
              !isTaskCompleted && step.type !== 'concept'
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-50'
                : 'bg-primary text-slate-900 shadow-primary/30 hover:scale-105 active:scale-95'
            }`}
          >
            {isLastStep ? 'Дуусгах' : 'Үргэлжлүүлэх'}
            <span className="material-symbols-outlined font-black">{isLastStep ? 'auto_awesome' : 'arrow_forward'}</span>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default LessonView;
