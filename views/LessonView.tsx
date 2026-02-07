
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
  const [terminalOutput, setTerminalOutput] = useState<{type: 'cmd' | 'out' | 'err' | 'success' | 'info', text: string}[]>([]);
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
    if (!currentTask) return { success: false, output: "", feedback: "" };
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `
      Чи бол маш хатуу Код Шүүгч. 
      Даалгавар: ${step.title}
      Зорилго: ${step.body}
      Хүлээгдэж буй үр дүн: ${currentTask.expectedOutput}
      Анхны бэлдэц (Template): ${currentTask.template}
      
      Хэрэглэгчийн бичсэн код:
      ${codeToVerify}

      ШАЛГАХ ЗААВАР:
      1. Хэрэв код нь анхны бэлдэцтэй (Template) яг ижилхэн байвал ШУУД FAIL (success: false). Хэрэглэгч заавал кодыг өөрчилсөн байх ёстой.
      2. Код нь ажиллах боломжтой (syntactically correct) байх ёстой.
      3. Код нь зорилтот үр дүнг хэвлэж чадах логиктой байх ёстой.
      4. Хэрэв даалгавар дутуу бол яагаад дутуу байгааг 'feedback' хэсэгт бич.
      
      JSON БУЦААХ: { "success": boolean, "output": string, "feedback": string }
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
              feedback: { type: Type.STRING }
            },
            required: ["success", "output", "feedback"]
          }
        }
      });
      return JSON.parse(response.text || "{}");
    } catch (e) {
      return { success: false, output: "Error", feedback: "AI Шүүгч ажиллахад алдаа гарлаа." };
    }
  };

  const handleRunCode = async () => {
    if (!currentTask || isRunning) return;
    setIsRunning(true);
    setIsDebugMode(false);
    
    setTerminalOutput([{type: 'cmd', text: `${activeLanguage === 'python' ? 'python3' : activeLanguage === 'c' ? 'gcc' : 'g++'} ${currentTask.fileName}`}]);
    setTerminalOutput(prev => [...prev, {type: 'info', text: "Шалгаж байна..."}]);

    const result = await verifyCode(userCode, activeLanguage);
    
    setTimeout(() => {
      if (result.success) {
        setTerminalOutput(prev => [
          ...prev, 
          {type: 'out', text: result.output || currentTask.expectedOutput},
          {type: 'success', text: "Зөв! Даалгавар биеллээ."}
        ]);
        setIsTaskCompleted(true);
      } else {
        setTerminalOutput(prev => [
          ...prev, 
          {type: 'err', text: "Алдаа!"},
          {type: 'out', text: result.feedback || "Код дутуу эсвэл алдаатай байна."}
        ]);
      }
      setIsRunning(false);
    }, 1000);
  };

  const startDebug = () => {
    if (!currentTask?.debugSteps) return;
    setIsDebugMode(true);
    setDebugStepIdx(0);
    setTerminalOutput([{type: 'cmd', text: "gdb ./main"}, {type: 'out', text: "Debugger started. Source loaded."}]);
  };

  const stepDebug = () => {
    if (!currentTask?.debugSteps) return;
    if (debugStepIdx < currentTask.debugSteps.length - 1) {
      setDebugStepIdx(prev => prev + 1);
    } else {
      setIsDebugMode(false);
      setIsTaskCompleted(true);
      setTerminalOutput(prev => [{type: 'success', text: "Debug session finished."}]);
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

    const systemInstruction = `Чи бол CodeStep Tutor. Сурагчийн одоогийн хичээл: ${lesson.title}. Код: \n${userCode}`;

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: systemInstruction + "\nСурагчийн асуулт: " + userMsg,
      });
      setChatMessages(prev => [...prev, { role: 'model', text: response.text || "Уучлаарай, хариулж чадахгүй байна." }]);
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
            
            <div className="mt-10 flex items-center justify-between">
               <button 
                onClick={() => setCurrentStepIdx(prev => Math.max(0, prev - 1))}
                disabled={currentStepIdx === 0}
                className="text-slate-400 font-black uppercase text-xs disabled:opacity-30"
               >
                 Өмнөх
               </button>
               {isTaskCompleted && (
                 <button 
                  onClick={handleNext}
                  className="bg-primary text-slate-900 px-8 py-3 rounded-xl font-black text-sm uppercase shadow-xl animate-bounce"
                 >
                   Дараагийнх
                 </button>
               )}
            </div>
          </div>
        </section>

        <section className={`flex flex-col bg-[#1e1e1e] transition-all duration-500 overflow-hidden relative ${isAiOpen ? 'w-1/3' : 'w-1/2'}`}>
          {step.type === 'coding' ? (
            <>
              <div className="flex items-center justify-between border-b border-white/10 bg-[#2d2d2d] px-6 py-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase text-slate-400">{activeLanguage.toUpperCase()} Editor</span>
                </div>
                {isDebugMode && (
                   <button onClick={stepDebug} className="bg-primary text-slate-900 px-3 py-1 rounded text-[10px] font-black uppercase">Step Over</button>
                )}
              </div>
              
              <div className="flex-1 font-mono text-lg text-white relative flex flex-col">
                <textarea 
                  value={userCode}
                  onChange={(e) => setUserCode(e.target.value)}
                  className="flex-1 bg-transparent p-8 outline-none border-none resize-none custom-scrollbar"
                  spellCheck={false}
                />

                {isDebugMode && activeDebugStep && (
                  <div className="absolute bottom-4 left-4 right-4 bg-slate-900 border-2 border-primary/30 p-4 rounded-xl shadow-2xl">
                    <p className="text-[10px] font-black text-primary uppercase mb-2">Variables:</p>
                    <div className="grid grid-cols-2 gap-2">
                       {Object.entries(activeDebugStep.variables).map(([k, v]) => (
                         <div key={k} className="text-xs">
                           <span className="text-blue-400">{k}:</span> <span className="text-yellow-400">{JSON.stringify(v)}</span>
                         </div>
                       ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="h-1/3 flex flex-col border-t border-white/10 bg-[#0c0c0c]">
                <div className="flex items-center justify-between px-6 py-2 bg-[#1a1a1a]">
                   <span className="text-[10px] font-black uppercase text-slate-500">Terminal</span>
                   <button onClick={handleRunCode} disabled={isRunning} className="bg-primary text-slate-900 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase">
                     {isRunning ? 'Running...' : 'Run'}
                   </button>
                </div>
                <div className="flex-1 p-6 font-mono text-sm overflow-y-auto custom-scrollbar bg-black/40">
                  {terminalOutput.map((line, i) => (
                    <div key={i} className={`mb-1 ${line.type === 'err' ? 'text-red-400' : line.type === 'success' ? 'text-primary' : line.type === 'info' ? 'text-slate-500 italic' : 'text-white'}`}>
                       <span className="opacity-50 mr-2">{line.type === 'cmd' ? '$' : '>'}</span>
                       {line.text}
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
               <span className="material-symbols-outlined text-[100px] text-slate-700 mb-6">menu_book</span>
               <h3 className="text-2xl font-black text-slate-500 mb-2 uppercase">Онолын хэсэг</h3>
               <p className="text-slate-600 max-w-xs">Тайлбарыг уншаад бэлэн болмогц "Дараагийнх" товчийг дарна уу.</p>
            </div>
          )}
        </section>

        {isAiOpen && (
          <div className="w-1/3 bg-white dark:bg-slate-900 border-l-4 border-primary/20 flex flex-col">
            <div className="p-5 border-b flex items-center justify-between bg-slate-50 dark:bg-slate-800">
              <h4 className="font-black">AI Tutor</h4>
              <button onClick={() => setIsAiOpen(false)}><span className="material-symbols-outlined">close</span></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[90%] px-4 py-2 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-primary text-slate-900 font-bold' : 'bg-slate-100 dark:bg-slate-800'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <form onSubmit={(e) => { e.preventDefault(); askAi(); }} className="p-4 border-t flex gap-2">
              <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Асуух зүйл байна уу?..." className="flex-1 bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-2 text-sm font-bold" />
              <button type="submit" disabled={isAiLoading} className="bg-primary text-slate-900 p-2 rounded-xl"><span className="material-symbols-outlined">send</span></button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default LessonView;
