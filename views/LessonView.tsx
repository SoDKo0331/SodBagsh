
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
  
  // User's edited code state
  const [userCode, setUserCode] = useState('');
  
  // Debug State
  const [isDebugMode, setIsDebugMode] = useState(false);
  const [debugStepIdx, setDebugStepIdx] = useState(0);
  
  // AI Chat State
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

  // Reset code when step or language changes
  useEffect(() => {
    if (currentTask) {
      setUserCode(currentTask.template);
      setTerminalOutput([]);
      setIsTaskCompleted(false);
      setIsDebugMode(false);
      setDebugStepIdx(0);
    } else if (step?.type === 'concept') {
      setIsTaskCompleted(true); // Concept steps are automatically "completed" for navigation
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
    const prompt = `
      Чи бол маш хатуу Код Шүүгч. Сурагч даалгавраа зөв биелүүлсэн эсэхийг шалгана уу.
      
      Даалгавар: ${step.title}
      Хүлээгдэж буй үр дүн: ${currentTask.expectedOutput}
      Хэл: ${lang}
      
      Хэрэглэгчийн бичсэн код:
      ${codeToVerify}

      ШАЛГАХ ДҮРЭМ:
      1. Код нь өгөгдсөн 'Хүлээгдэж буй үр дүн'-г гаргаж чадаж байвал 'success: true' болго.
      2. 'output' талбарт жинхэнэ терминал дээрх шиг гаралтыг бич.
      3. 'warnings' талбарт хэрэв кодонд муу зуршил байвал gcc/python маягийн анхааруулга бич.
      
      JSON-оор хариулна уу: { "success": boolean, "output": string, "feedback": string, "warnings": string }
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              success: { type: Type.BOOLEAN },
              output: { type: Type.STRING },
              feedback: { type: Type.STRING },
              warnings: { type: Type.STRING }
            },
            required: ["success", "output", "feedback", "warnings"]
          }
        }
      });
      return JSON.parse(response.text || "{}");
    } catch (e) {
      return { success: false, output: "Execution Error", feedback: "Шүүгч ажиллахад алдаа гарлаа.", warnings: "" };
    }
  };

  const handleRunCode = async () => {
    if (!currentTask || isRunning) return;
    setIsRunning(true);
    setIsDebugMode(false);
    
    const compilationCmd = activeLanguage === 'python' ? `python3 ${currentTask.fileName}` : 
                          activeLanguage === 'c' ? `gcc ${currentTask.fileName} -o main -Wall` : 
                          `g++ ${currentTask.fileName} -o main -Wall`;

    setTerminalOutput([{type: 'cmd', text: compilationCmd}]);
    
    const result = await verifyCode(userCode, activeLanguage);
    
    setTimeout(() => {
      if (result.warnings) setTerminalOutput(prev => [...prev, {type: 'warn', text: result.warnings}]);

      if (result.success) {
        if (activeLanguage !== 'python') setTerminalOutput(prev => [...prev, {type: 'cmd', text: "./main"}]);
        setTerminalOutput(prev => [
          ...prev, 
          {type: 'out', text: result.output || currentTask.expectedOutput},
          {type: 'success', text: "Verification complete. Program exited with code 0."}
        ]);
        setIsTaskCompleted(true);
      } else {
        setTerminalOutput(prev => [
          ...prev, 
          {type: 'err', text: result.output || "Runtime Error"},
          {type: 'out', text: result.feedback || "Код дутуу эсвэл логик алдаатай байна."}
        ]);
      }
      setIsRunning(false);
    }, 1200);
  };

  const startDebug = () => {
    if (!currentTask?.debugSteps) return;
    setIsDebugMode(true);
    setDebugStepIdx(0);
    setTerminalOutput([{type: 'cmd', text: `${activeLanguage === 'c' ? 'gdb' : 'lldb'} ./main`}, {type: 'out', text: "Reading symbols from ./main... Done."}]);
  };

  const stepDebug = () => {
    if (!currentTask?.debugSteps) return;
    if (debugStepIdx < currentTask.debugSteps.length - 1) {
      setDebugStepIdx(prev => prev + 1);
    } else {
      setIsDebugMode(false);
      setIsTaskCompleted(true);
      setTerminalOutput(prev => [{type: 'success', text: "Program exited normally."}]);
    }
  };

  const handleQuizSelect = (optionId: string) => {
    setSelectedQuizOption(optionId);
    const option = step.quiz?.options.find(o => o.id === optionId);
    if (option?.isCorrect) setIsTaskCompleted(true);
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

    const systemInstruction = `Чи бол CodeStep Tutor багш. Сурагч ${activeLanguage} дээр '${step.title}' хичээл үзэж байна. Хэрэглэгчийн бичсэн код: \n${userCode}`;

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: systemInstruction + "\nАсуулт: " + userMsg,
      });
      setChatMessages(prev => [...prev, { role: 'model', text: response.text || "Би бодож байна..." }]);
    } catch (error) {
      setChatMessages(prev => [...prev, { role: 'model', text: "Алдаа гарлаа. Холболтоо шалгана уу." }]);
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
          <button onClick={() => onExit(true)} className="bg-white text-primary px-10 py-4 rounded-2xl font-black text-xl shadow-2xl hover:scale-105 transition-transform uppercase tracking-widest">
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
            {['c', 'cpp', 'python'].map((lang) => (
              <button 
                key={lang}
                onClick={() => handleLanguageToggle(lang as any)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeLanguage === lang ? 'bg-primary text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
              >
                {lang === 'cpp' ? 'C++' : lang.toUpperCase()}
              </button>
            ))}
          </div>
          
          <button onClick={() => setIsAiOpen(!isAiOpen)} className={`flex h-11 items-center gap-2 rounded-xl px-5 text-sm font-black transition-all border-2 ${isAiOpen ? 'bg-primary border-primary text-slate-900' : 'bg-white border-primary/20 text-primary hover:border-primary'}`}>
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
              <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-300 mb-8 font-medium">
                {step.body}
              </p>

              {step.analogy && (
                <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-2xl mb-8 flex gap-4 items-start shadow-sm">
                   <div className="size-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary shrink-0">
                      <span className="material-symbols-outlined font-bold">{step.analogy.icon}</span>
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Амьдрал дээрх жишээ</p>
                      <p className="text-slate-600 dark:text-slate-300 font-medium italic">"{step.analogy.text}"</p>
                   </div>
                </div>
              )}

              {step.visualAid === 'box' && (
                <div className="bg-slate-50 dark:bg-white/5 p-8 rounded-3xl border-2 border-slate-100 dark:border-white/5 flex flex-col items-center mb-8">
                  <div className="relative w-32 h-32 scale-110 mb-4">
                    <div className="absolute inset-0 bg-yellow-600 rounded-2xl shadow-inner transform rotate-3"></div>
                    <div className="absolute inset-0 bg-yellow-400 rounded-2xl -translate-y-2 -translate-x-1 border-2 border-yellow-700 flex items-center justify-center shadow-lg">
                      <span className="text-4xl text-yellow-900 font-black">13</span>
                    </div>
                    <div className="absolute -bottom-3 -right-3 bg-white px-3 py-1 rounded-lg border-2 border-slate-200 text-sm font-black text-slate-800 rotate-6 shadow-md">age</div>
                  </div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest text-center mt-4">Компьютер санах ойд иймэрхүү байдалтай хадгалдаг</p>
                </div>
              )}
              
              {step.visualAid === 'logic' && (
                 <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-green-500/10 p-5 rounded-2xl border-2 border-green-500/20 text-center">
                       <span className="material-symbols-outlined text-green-500 text-3xl mb-2">check_circle</span>
                       <p className="text-[10px] font-black text-green-500 uppercase">Нөхцөл үнэн</p>
                       <p className="text-xs text-slate-500 font-bold mt-1">Үйлдэл А ажиллана</p>
                    </div>
                    <div className="bg-red-500/10 p-5 rounded-2xl border-2 border-red-500/20 text-center">
                       <span className="material-symbols-outlined text-red-500 text-3xl mb-2">cancel</span>
                       <p className="text-[10px] font-black text-red-500 uppercase">Нөхцөл худал</p>
                       <p className="text-xs text-slate-500 font-bold mt-1">Үйлдэл Б ажиллана</p>
                    </div>
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
                    <button key={opt.id} onClick={() => handleQuizSelect(opt.id)} className={`flex w-full items-center justify-between rounded-2xl border-2 p-5 text-left transition-all ${selectedQuizOption === opt.id ? opt.isCorrect ? 'border-primary bg-primary/10' : 'border-red-400 bg-red-50' : 'border-white dark:border-white/5 bg-white dark:bg-slate-900 shadow-sm hover:border-primary/50'}`}>
                      <span className="font-bold text-lg">{opt.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mt-10 flex items-center justify-between">
               <button onClick={() => setCurrentStepIdx(prev => Math.max(0, prev - 1))} disabled={currentStepIdx === 0} className="text-slate-400 font-black uppercase text-xs disabled:opacity-30 flex items-center gap-1">
                 <span className="material-symbols-outlined text-sm">arrow_back</span> Өмнөх
               </button>
               {isTaskCompleted && (
                 <button onClick={handleNext} className="bg-primary text-slate-900 px-8 py-3 rounded-xl font-black text-sm uppercase shadow-xl animate-bounce flex items-center gap-1">
                   Дараагийнх <span className="material-symbols-outlined text-sm">arrow_forward</span>
                 </button>
               )}
            </div>
          </div>
        </section>

        <section className={`flex flex-col bg-[#1e1e1e] transition-all duration-500 overflow-hidden relative ${isAiOpen ? 'w-1/3' : 'w-1/2'}`}>
          {step.type === 'coding' ? (
            <>
              <div className="flex items-center justify-between border-b border-white/10 bg-[#2d2d2d] px-6 py-2">
                <div className="flex items-center gap-2"><span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{activeLanguage.toUpperCase()} Editor</span></div>
                {(activeLanguage === 'c' || activeLanguage === 'cpp') && currentTask?.debugSteps && (
                   <button onClick={isDebugMode ? stepDebug : startDebug} className={`${isDebugMode ? 'bg-yellow-500' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'} px-3 py-1 rounded text-[10px] font-black uppercase transition-all flex items-center gap-1`}>
                     <span className="material-symbols-outlined text-sm">{isDebugMode ? 'step_over' : 'bug_report'}</span>
                     {isDebugMode ? 'Step Over' : 'Start Debugger'}
                   </button>
                )}
              </div>
              <div className="flex-1 font-mono text-lg text-white relative flex flex-col">
                <textarea value={userCode} onChange={(e) => setUserCode(e.target.value)} className="flex-1 bg-transparent p-8 outline-none border-none resize-none custom-scrollbar" spellCheck={false} placeholder="// Кодоо энд бичнэ үү..." />
                {isDebugMode && activeDebugStep && (
                  <div className="absolute bottom-4 left-4 right-4 bg-slate-900/95 border-2 border-primary/30 p-5 rounded-2xl shadow-2xl animate-in slide-in-from-bottom-4">
                    <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
                        <p className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-2"><span className="material-symbols-outlined text-sm">memory</span> Memory Inspector</p>
                        <span className="text-[9px] text-slate-500 italic font-bold">Line {activeDebugStep.lineIndex + 1}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       {Object.entries(activeDebugStep.variables).map(([k, v]) => (
                         <div key={k} className="flex items-center justify-between bg-white/5 px-3 py-2 rounded-lg">
                           <span className="text-xs font-black text-blue-400">{k}</span> 
                           <span className="text-xs font-mono text-yellow-400">{JSON.stringify(v)}</span>
                         </div>
                       ))}
                    </div>
                    <p className="mt-3 text-[11px] text-slate-300 italic">"{activeDebugStep.comment}"</p>
                  </div>
                )}
              </div>
              <div className="h-1/3 flex flex-col border-t border-white/10 bg-[#0c0c0c]">
                <div className="flex items-center justify-between px-6 py-2 bg-[#1a1a1a]">
                   <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Терминал</span>
                   <button onClick={handleRunCode} disabled={isRunning} className="bg-primary text-slate-900 px-5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                     {isRunning ? 'Checking...' : 'Run & Submit'}
                   </button>
                </div>
                <div className="flex-1 p-6 font-mono text-sm overflow-y-auto custom-scrollbar bg-black/40">
                  {terminalOutput.length === 0 ? (
                    <div className="text-slate-800 italic text-sm">Код ажиллуулахыг хүлээж байна...</div>
                  ) : (
                    terminalOutput.map((line, i) => (
                        <div key={i} className={`mb-1 flex gap-2 ${line.type === 'err' ? 'text-red-400' : line.type === 'success' ? 'text-primary font-black' : line.type === 'info' ? 'text-slate-500 italic' : line.type === 'warn' ? 'text-yellow-400 italic' : line.type === 'cmd' ? 'text-blue-400 font-bold' : 'text-white'}`}>
                           <span className="opacity-40 shrink-0 select-none">{line.type === 'cmd' ? '$' : '❯'}</span>
                           <span className="whitespace-pre-wrap">{line.text}</span>
                        </div>
                    ))
                  )}
                  {isRunning && <div className="inline-block w-2 h-4 bg-primary animate-pulse ml-6 mt-1"></div>}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-slate-50/5 dark:bg-white/5">
               <div className="size-32 rounded-3xl bg-slate-800/50 flex items-center justify-center mb-8 border-2 border-white/5 shadow-inner">
                  <span className="material-symbols-outlined text-[64px] text-primary/40">menu_book</span>
               </div>
               <h3 className="text-2xl font-black text-slate-400 mb-4 uppercase tracking-tight">Онолын хэсэг</h3>
               <p className="text-slate-600 dark:text-slate-500 max-w-xs font-medium leading-relaxed">
                  Зүүн талын тайлбарыг сайн уншаад бэлэн болмогц "Дараагийнх" товчийг дарж туршилт хийгээрэй.
               </p>
               <div className="mt-8 flex gap-2">
                  <div className="size-2 rounded-full bg-primary animate-pulse"></div>
                  <div className="size-2 rounded-full bg-primary animate-pulse [animation-delay:0.2s]"></div>
                  <div className="size-2 rounded-full bg-primary animate-pulse [animation-delay:0.4s]"></div>
               </div>
            </div>
          )}
        </section>

        {isAiOpen && (
          <div className="w-1/3 bg-white dark:bg-slate-900 border-l-4 border-primary/20 flex flex-col animate-in slide-in-from-right duration-500">
            <div className="p-5 border-b flex items-center justify-between bg-slate-50 dark:bg-slate-800/80">
              <div className="flex items-center gap-2"><span className="material-symbols-outlined text-primary font-black">smart_toy</span><h4 className="font-black text-sm uppercase tracking-widest">AI Tutor</h4></div>
              <button onClick={() => setIsAiOpen(false)} className="hover:rotate-90 transition-transform"><span className="material-symbols-outlined text-slate-400">close</span></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[90%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-primary text-slate-900 font-bold' : 'bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isAiLoading && <div className="flex gap-1 items-center px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit animate-pulse"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Багш бодож байна...</span></div>}
              <div ref={chatEndRef} />
            </div>
            <form onSubmit={(e) => { e.preventDefault(); askAi(); }} className="p-4 border-t flex gap-2 bg-white dark:bg-slate-900">
              <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Асуух зүйл байна уу?..." className="flex-1 bg-slate-100 dark:bg-slate-800 border-none rounded-2xl px-5 py-3 text-sm font-bold focus:ring-4 focus:ring-primary/20 transition-all" />
              <button type="submit" disabled={isAiLoading || !chatInput.trim()} className="bg-primary text-slate-900 size-11 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 transition-all"><span className="material-symbols-outlined font-black">send</span></button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default LessonView;
