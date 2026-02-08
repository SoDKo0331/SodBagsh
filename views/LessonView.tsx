
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { LESSON_DATA } from '../data/lessons';
import { StepContent, CodingTask, DebugStep } from '../types';

interface LessonViewProps {
  onExit: (completed?: boolean) => void;
  moduleId: string | null;
  initialLanguage: 'python' | 'c' | 'cpp';
  onLanguageChange?: (lang: 'python' | 'c' | 'cpp') => void;
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
  const [terminalOutput, setTerminalOutput] = useState<{type: 'cmd' | 'out' | 'err' | 'success' | 'info' | 'warn', text: string}[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState<'python' | 'c' | 'cpp'>(initialLanguage);
  
  const [userCode, setUserCode] = useState('');
  const [isDebugMode, setIsDebugMode] = useState(false);
  const [debugStepIdx, setDebugStepIdx] = useState(0);
  
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'model', text: `Сайн уу! Би чиний 'CodeStep Tutor' багш байна. 🤖 Би чамд ${initialLanguage === 'c' ? 'C Language' : initialLanguage === 'cpp' ? 'C++' : 'Python'} сурахад тусална. Юуг ойлгохгүй байна, надаас шууд асуугаарай!` }
  ]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const step: StepContent | undefined = lesson?.steps[currentStepIdx];
  const isLastStep = lesson ? currentStepIdx === lesson.steps.length - 1 : false;
  const currentTask: CodingTask | undefined = step?.codingTasks?.find(t => t.language === activeLanguage);
  const activeDebugStep: DebugStep | undefined = currentTask?.debugSteps?.[debugStepIdx];

  useEffect(() => {
    if (currentTask) {
      setUserCode(currentTask.template);
      setTerminalOutput([]);
      setIsTaskCompleted(false);
      setIsDebugMode(false);
      setDebugStepIdx(0);
    } else if (step?.type === 'concept') {
      setIsTaskCompleted(true);
    }
  }, [currentStepIdx, activeLanguage, moduleId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  if (!lesson || !step) return <div className="p-10 text-white">Алдаа: Хичээл олдсонгүй.</div>;

  const handleLanguageToggle = (lang: 'python' | 'c' | 'cpp') => {
    setActiveLanguage(lang);
    setIsDebugMode(false);
    if (onLanguageChange) onLanguageChange(lang);
  };

  const verifyCode = async (codeToVerify: string, lang: string) => {
    if (!currentTask) return { success: false, output: "", feedback: "", warnings: "" };
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Чи бол Код Шүүгч. JSON: { "success": boolean, "output": string, "feedback": string, "warnings": string }. Код: ${codeToVerify}`;
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });
      return JSON.parse(response.text || "{}");
    } catch (e) {
      return { success: false, output: "Error", feedback: "Алдаа гарлаа.", warnings: "" };
    }
  };

  const handleRunCode = async () => {
    if (!currentTask || isRunning) return;
    setIsRunning(true);
    setIsDebugMode(false);
    setTerminalOutput([{type: 'cmd', text: `Running ${currentTask.fileName}...`}]);
    const result = await verifyCode(userCode, activeLanguage);
    setTimeout(() => {
      if (result.success) {
        setTerminalOutput(prev => [...prev, {type: 'out', text: result.output}, {type: 'success', text: "Зөв байна!"}]);
        setIsTaskCompleted(true);
      } else {
        setTerminalOutput(prev => [...prev, {type: 'err', text: result.feedback}]);
      }
      setIsRunning(false);
    }, 1000);
  };

  const startDebug = () => {
    if (!currentTask?.debugSteps) return;
    setIsDebugMode(true);
    setDebugStepIdx(0);
  };

  const stepDebug = () => {
    if (!currentTask?.debugSteps) return;
    if (debugStepIdx < currentTask.debugSteps.length - 1) {
      setDebugStepIdx(prev => prev + 1);
    } else {
      setIsDebugMode(false);
      setIsTaskCompleted(true);
    }
  };

  const handleQuizSelect = (optionId: string) => {
    setSelectedQuizOption(optionId);
    // Хариулт сонгосон л бол дараагийнх руу шилжих боломжтой болгоно
    setIsTaskCompleted(true);
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
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Код: ${userCode}\nАсуулт: ${userMsg}`,
      });
      setChatMessages(prev => [...prev, { role: 'model', text: response.text || "" }]);
    } catch (error) {
      setChatMessages(prev => [...prev, { role: 'model', text: "Алдаа гарлаа." }]);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background-light dark:bg-background-dark relative font-display text-slate-900 dark:text-slate-100">
      {showCelebration && (
        <div className="absolute inset-0 z-[100] bg-primary flex flex-col items-center justify-center p-10 animate-in fade-in zoom-in duration-500">
          <span className="material-symbols-outlined text-[120px] text-white animate-bounce mb-6">workspace_premium</span>
          <h2 className="text-5xl font-black text-white text-center mb-4 uppercase">Амжилттай!</h2>
          <button onClick={() => onExit(true)} className="bg-white text-primary px-10 py-4 rounded-2xl font-black text-xl shadow-2xl hover:scale-105 transition-transform uppercase tracking-widest">
            Дуусгах
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
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{currentStepIdx + 1}-р алхам / {lesson.steps.length}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setIsAiOpen(!isAiOpen)} className={`flex h-11 items-center gap-2 rounded-xl px-5 text-sm font-black border-2 ${isAiOpen ? 'bg-primary border-primary text-slate-900' : 'bg-white border-primary/20 text-primary'}`}>
            <span className="material-symbols-outlined text-xl">smart_toy</span>
            <span>AI Багш</span>
          </button>
          <button onClick={() => onExit()} className="p-2 text-slate-400 hover:text-slate-600">
             <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden relative">
        <section className={`flex flex-col border-r border-slate-200 dark:border-white/10 bg-white dark:bg-[#111814]/30 transition-all duration-500 relative ${isAiOpen ? 'w-1/3' : 'w-1/2'}`}>
          <div className="flex-1 overflow-y-auto custom-scrollbar px-8 py-10 pb-32">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="h-1 w-8 bg-primary rounded-full"></span>
                <h2 className="text-3xl font-black tracking-tight">{step.title}</h2>
              </div>
              <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-300 mb-8 font-medium">{step.body}</p>
              {step.analogy && (
                <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-2xl mb-8 flex gap-4 shadow-sm">
                   <div className="size-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary shrink-0"><span className="material-symbols-outlined font-bold">{step.analogy.icon}</span></div>
                   <div><p className="text-slate-600 dark:text-slate-300 font-medium italic">"{step.analogy.text}"</p></div>
                </div>
              )}
            </div>

            {step.type === 'quiz' && (
               <div className="mb-10 rounded-3xl border-4 border-slate-100 dark:border-white/5 p-8 bg-slate-50/50 dark:bg-white/5">
                <p className="text-xl font-black mb-6">Сонгоно уу:</p>
                <div className="space-y-3">
                  {step.quiz?.options.map((opt) => (
                    <button key={opt.id} onClick={() => handleQuizSelect(opt.id)} className={`flex w-full items-center justify-between rounded-2xl border-2 p-5 text-left transition-all ${selectedQuizOption === opt.id ? opt.isCorrect ? 'border-primary bg-primary/10' : 'border-red-400 bg-red-50' : 'border-white dark:border-white/5 bg-white dark:bg-slate-900 shadow-sm hover:border-primary/50'}`}>
                      <span className="font-bold text-lg">{opt.text}</span>
                      {selectedQuizOption === opt.id && <span className="material-symbols-outlined">{opt.isCorrect ? 'check_circle' : 'cancel'}</span>}
                    </button>
                  ))}
                </div>
                {selectedQuizOption && !step.quiz?.options.find(o => o.id === selectedQuizOption)?.isCorrect && (
                   <p className="mt-4 text-red-500 font-bold text-sm uppercase">Буруу хариулт байна. Дахин оролдож эсвэл шууд дараагийнх руу шилжиж болно.</p>
                )}
              </div>
            )}
          </div>

          {/* Fixed Footer Navigation */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200 dark:border-white/10 flex items-center justify-between z-20">
             <button onClick={() => setCurrentStepIdx(prev => Math.max(0, prev - 1))} disabled={currentStepIdx === 0} className="px-6 py-3 text-slate-500 font-black uppercase text-xs disabled:opacity-30 flex items-center gap-1 hover:text-primary transition-colors">
               <span className="material-symbols-outlined text-sm">arrow_back</span> Өмнөх
             </button>
             {isTaskCompleted && (
               <button onClick={handleNext} className="bg-primary text-slate-900 px-10 py-4 rounded-2xl font-black text-sm uppercase shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                 <span>Дараах</span>
                 <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
               </button>
             )}
          </div>
        </section>

        <section className={`flex flex-col bg-[#1e1e1e] transition-all duration-500 overflow-hidden relative ${isAiOpen ? 'w-1/3' : 'w-1/2'}`}>
          {step.type === 'coding' ? (
            <>
              <div className="flex items-center justify-between border-b border-white/10 bg-[#2d2d2d] px-6 py-2">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{activeLanguage.toUpperCase()} Editor</span>
                {(activeLanguage === 'c' || activeLanguage === 'cpp') && currentTask?.debugSteps && (
                   <button onClick={isDebugMode ? stepDebug : startDebug} className={`${isDebugMode ? 'bg-yellow-500' : 'bg-slate-700 text-slate-300'} px-3 py-1 rounded text-[10px] font-black uppercase flex items-center gap-1`}>
                     <span className="material-symbols-outlined text-sm">{isDebugMode ? 'step_over' : 'bug_report'}</span>
                     {isDebugMode ? 'Step Over' : 'Start Debugger'}
                   </button>
                )}
              </div>
              <div className="flex-1 font-mono text-lg text-white relative flex flex-col">
                <textarea value={userCode} onChange={(e) => setUserCode(e.target.value)} className="flex-1 bg-transparent p-8 outline-none border-none resize-none custom-scrollbar" spellCheck={false} placeholder="// Кодоо энд бичнэ үү..." />
                {isDebugMode && activeDebugStep && (
                  <div className="absolute bottom-4 left-4 right-4 bg-slate-900/95 border-2 border-primary/30 p-5 rounded-2xl shadow-2xl">
                    <p className="text-[10px] font-black text-primary uppercase mb-2">Debugger Info</p>
                    <div className="grid grid-cols-2 gap-2">
                       {Object.entries(activeDebugStep.variables).map(([k, v]) => (
                         <div key={k} className="text-xs font-mono"><span className="text-blue-400">{k}:</span> <span className="text-yellow-400">{JSON.stringify(v)}</span></div>
                       ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="h-1/3 flex flex-col border-t border-white/10 bg-[#0c0c0c]">
                <div className="flex items-center justify-between px-6 py-2 bg-[#1a1a1a]">
                   <span className="text-[10px] font-black uppercase text-slate-500">Терминал</span>
                   <button onClick={handleRunCode} disabled={isRunning} className="bg-primary text-slate-900 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">
                     {isRunning ? 'Checking...' : 'Ажиллуулах'}
                   </button>
                </div>
                <div className="flex-1 p-6 font-mono text-sm overflow-y-auto custom-scrollbar bg-black/40">
                  {terminalOutput.map((line, i) => (
                      <div key={i} className={`mb-1 flex gap-2 ${line.type === 'err' ? 'text-red-400' : line.type === 'success' ? 'text-primary font-black' : 'text-white'}`}>
                         <span className="opacity-40 select-none">❯</span>
                         <span className="whitespace-pre-wrap">{line.text}</span>
                      </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-slate-50/5 dark:bg-white/5">
               <div className="size-32 rounded-3xl bg-slate-800/50 flex items-center justify-center mb-8 border-2 border-white/5 shadow-inner">
                  <span className="material-symbols-outlined text-[64px] text-primary/40">menu_book</span>
               </div>
               <h3 className="text-2xl font-black text-slate-400 mb-4 uppercase">Онолын хэсэг</h3>
               <p className="text-slate-600 dark:text-slate-500 max-w-xs font-medium leading-relaxed">Зүүн талын тайлбарыг уншаад бэлэн болмогц "Дараах" товчийг дарна уу.</p>
            </div>
          )}
        </section>

        {isAiOpen && (
          <div className="w-1/3 bg-white dark:bg-slate-900 border-l-4 border-primary/20 flex flex-col animate-in slide-in-from-right duration-500">
            <div className="p-5 border-b flex items-center justify-between bg-slate-50 dark:bg-slate-800/80">
              <h4 className="font-black text-sm uppercase">AI Багш</h4>
              <button onClick={() => setIsAiOpen(false)}><span className="material-symbols-outlined text-slate-400">close</span></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[90%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-primary text-slate-900 font-bold' : 'bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 shadow-sm'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <form onSubmit={(e) => { e.preventDefault(); askAi(); }} className="p-4 border-t flex gap-2 bg-white dark:bg-slate-900">
              <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Асуух зүйл байна уу?..." className="flex-1 bg-slate-100 dark:bg-slate-800 border-none rounded-2xl px-5 py-3 text-sm font-bold" />
              <button type="submit" disabled={isAiLoading || !chatInput.trim()} className="bg-primary text-slate-900 size-11 rounded-2xl flex items-center justify-center shadow-lg"><span className="material-symbols-outlined font-black">send</span></button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default LessonView;
