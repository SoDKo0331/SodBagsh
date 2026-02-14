
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { GoogleGenAI } from "@google/genai";
import Prism from 'prismjs';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import { LESSON_DATA } from '../data/lessons';
import { StepContent, CodingTask } from '../types';

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
  const [terminalOutput, setTerminalOutput] = useState<{type: 'cmd' | 'out' | 'err' | 'success' | 'info' | 'warn' | 'hint', text: string}[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState<'python' | 'c' | 'cpp'>(initialLanguage);
  
  // For MiniGame
  const [gameItems, setGameItems] = useState<{id: string, text: string}[]>([]);
  const [gameFeedback, setGameFeedback] = useState<string | null>(null);

  const [userCode, setUserCode] = useState('');
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'model', text: `Сайн уу! 🤖 Чиний багш бэлэн байна. Кодоо бичээд шалгуулаарай.` }
  ]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLPreElement>(null);

  const step: StepContent | undefined = lesson?.steps[currentStepIdx];
  const isLastStep = lesson ? currentStepIdx === lesson.steps.length - 1 : false;
  const currentTask: CodingTask | undefined = step?.codingTasks?.find(t => t.language === activeLanguage);

  useEffect(() => {
    if (step?.type === 'minigame' && step.minigame) {
      setGameItems([...step.minigame.items].sort(() => Math.random() - 0.5));
      setGameFeedback(null);
      setIsTaskCompleted(false);
    } else if (currentTask) {
      setUserCode(currentTask.template);
      setTerminalOutput([]);
      setIsTaskCompleted(false);
    } else if (step?.type === 'concept') {
      setIsTaskCompleted(true);
    }
  }, [currentStepIdx, activeLanguage, moduleId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleScroll = () => {
    if (editorRef.current && lineNumbersRef.current && highlightRef.current) {
      lineNumbersRef.current.scrollTop = editorRef.current.scrollTop;
      highlightRef.current.scrollTop = editorRef.current.scrollTop;
      highlightRef.current.scrollLeft = editorRef.current.scrollLeft;
    }
  };

  const highlightedHtml = useMemo(() => {
    const lang = activeLanguage === 'python' ? 'python' : activeLanguage === 'c' ? 'c' : 'cpp';
    const grammar = Prism.languages[lang];
    if (!grammar) return userCode;
    return Prism.highlight(userCode, grammar, lang);
  }, [userCode, activeLanguage]);

  const lineCount = userCode.split('\n').length;
  const lineNumbers = Array.from({ length: Math.max(lineCount, 15) }, (_, i) => i + 1);

  if (!lesson || !step) return <div className="p-10 text-white">Алдаа: Хичээл олдсонгүй.</div>;

  const verifyCode = async (codeToVerify: string, lang: string) => {
    if (!currentTask) return { success: false, output: "", feedback: "", hint: "" };

    if (codeToVerify.includes('___')) {
      return { success: false, output: "Code contains empty placeholders", feedback: "___ хэсгийг нөхөж бичнэ үү.", hint: "Код доторх дутуу хэсгүүдийг утгаар солин бичээрэй." };
    }

    // Fix: Upgrade model to gemini-3-pro-preview for advanced coding reasoning
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Act as a strict code mentor. Analyze this ${lang} code.
    Goal: Output should be exactly "${currentTask.expectedOutput}".
    User Code: ${codeToVerify}
    
    Response strictly in JSON format: 
    { "success": boolean, "output": "actual program output", "feedback": "short motivational message", "hint": "if failed, give 1 specific hint what to change" }`;
    
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: { 
          responseMimeType: "application/json",
          thinkingConfig: { thinkingBudget: 0 }
        }
      });
      return JSON.parse(response.text || "{}");
    } catch (e) {
      return { success: false, output: "Error", feedback: "Алдаа гарлаа.", hint: "Интернэт холболтоо шалгана уу." };
    }
  };

  const handleRunCode = async () => {
    if (!currentTask || isRunning) return;
    setIsRunning(true);
    setTerminalOutput([{type: 'info', text: `> Running validation...`}]);
    
    const result = await verifyCode(userCode, activeLanguage);
    
    if (result.success) {
      setTerminalOutput(prev => [
        ...prev, 
        {type: 'out', text: result.output}, 
        {type: 'success', text: `✓ БОДЛОГО ЗӨВ: ${result.feedback}`}
      ]);
      setIsTaskCompleted(true);
    } else {
      setTerminalOutput(prev => [
        ...prev, 
        {type: 'err', text: `✗ АЛДАА: ${result.output || 'Logic error'}`},
        {type: 'hint', text: `БАГШИЙН ЗӨВЛӨГӨӨ: ${result.hint}`}
      ]);
    }
    setIsRunning(false);
  };

  const checkGameOrder = () => {
    if (!step.minigame) return;
    const currentOrder = gameItems.map(i => i.id);
    const isCorrect = JSON.stringify(currentOrder) === JSON.stringify(step.minigame.correctOrder);
    
    if (isCorrect) {
      setGameFeedback("Зөв байна! Гайхалтай.");
      setIsTaskCompleted(true);
    } else {
      setGameFeedback("Буруу дараалал байна. Дахиад оролдоод үзээрэй.");
    }
  };

  const moveGameItem = (fromIdx: number, toIdx: number) => {
    const newItems = [...gameItems];
    const [movedItem] = newItems.splice(fromIdx, 1);
    newItems.splice(toIdx, 0, movedItem);
    setGameItems(newItems);
  };

  const handleNext = () => {
    if (isLastStep) {
      setShowCelebration(true);
    } else {
      setCurrentStepIdx(prev => prev + 1);
      setIsTaskCompleted(false);
      setSelectedQuizOption(null);
      setTerminalOutput([]);
      setGameFeedback(null);
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
        model: 'gemini-3-pro-preview',
        contents: `Код: ${userCode}\nАсуулт: ${userMsg}`,
        config: { thinkingConfig: { thinkingBudget: 0 } }
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
        <div className="absolute inset-0 z-[100] bg-primary flex flex-col items-center justify-center p-10 animate-in fade-in zoom-in duration-300 text-center">
          <div className="size-32 rounded-full bg-white flex items-center justify-center mb-8 shadow-2xl animate-bounce">
             <span className="material-symbols-outlined text-6xl text-primary font-black">celebration</span>
          </div>
          <h2 className="text-6xl font-black text-white mb-4 uppercase tracking-tighter">МОДУЛЬ ДУУСЛАА!</h2>
          <p className="text-white/80 font-bold mb-10 text-xl">Чи С хэлний нэгэн чухал давааг давлаа. Баяр хүргэе!</p>
          <button onClick={() => onExit(true)} className="bg-slate-900 text-white px-12 py-5 rounded-[24px] font-black text-xl shadow-2xl hover:scale-110 active:scale-95 transition-all uppercase tracking-widest">
            Дараагийн Модуль
          </button>
        </div>
      )}

      <header className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 bg-white dark:bg-[#111814] px-6 py-4 z-30 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => onExit()} className="size-10 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
             <span className="material-symbols-outlined text-slate-400">arrow_back</span>
          </button>
          <div>
            <h1 className="text-lg font-black tracking-tight leading-none mb-1">{lesson.title}</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{currentStepIdx + 1} / {lesson.steps.length} АЛХАМ</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setIsAiOpen(!isAiOpen)} className={`flex h-11 items-center gap-2 rounded-xl px-5 text-sm font-black transition-all ${isAiOpen ? 'bg-primary text-slate-900' : 'bg-slate-900 text-white'}`}>
            <span className="material-symbols-outlined text-xl">smart_toy</span>
            <span className="hidden md:inline">AI Багш</span>
          </button>
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden relative">
        <section className={`flex flex-col border-r border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1410] transition-all duration-300 relative ${isAiOpen ? 'w-[35%]' : 'w-[45%]'}`}>
          <div className="flex-1 overflow-y-auto custom-scrollbar px-8 py-10 pb-32">
            <div className="mb-8">
              <h2 className="text-3xl font-black tracking-tight mb-6">{step.title}</h2>
              <div className="prose dark:prose-invert max-w-none">
                 <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-300 font-medium">{step.body}</p>
              </div>
            </div>

            {step.type === 'minigame' && step.minigame && (
              <div className="mt-8 space-y-4">
                 <div className="p-4 bg-primary/10 rounded-2xl border-2 border-primary/20 mb-6">
                    <p className="text-sm font-black text-primary uppercase tracking-widest flex items-center gap-2">
                       <span className="material-symbols-outlined text-sm">extension</span> Mini-Game: Кодын эрэмбэ
                    </p>
                 </div>
                 <div className="space-y-2">
                   {gameItems.map((item, idx) => (
                     <div key={item.id} className="flex items-center gap-3">
                        <div className="flex flex-col gap-1">
                           <button onClick={() => idx > 0 && moveGameItem(idx, idx - 1)} className="material-symbols-outlined text-slate-400 hover:text-primary transition-colors text-sm">keyboard_arrow_up</button>
                           <button onClick={() => idx < gameItems.length - 1 && moveGameItem(idx, idx + 1)} className="material-symbols-outlined text-slate-400 hover:text-primary transition-colors text-sm">keyboard_arrow_down</button>
                        </div>
                        <div className="flex-1 p-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl font-mono text-sm shadow-sm">
                           {item.text}
                        </div>
                     </div>
                   ))}
                 </div>
                 <button onClick={checkGameOrder} className="w-full mt-6 bg-slate-900 text-white py-3 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-slate-800 transition-all">Шалгах</button>
                 {gameFeedback && (
                   <p className={`mt-4 text-center font-bold text-sm ${gameFeedback.includes('Зөв') ? 'text-primary' : 'text-red-400'}`}>{gameFeedback}</p>
                 )}
              </div>
            )}

            {step.type === 'quiz' && (
               <div className="space-y-3 mt-8">
                  {step.quiz?.options.map((opt) => (
                    <button 
                      key={opt.id} 
                      onClick={() => { setSelectedQuizOption(opt.id); setIsTaskCompleted(opt.isCorrect); }} 
                      className={`flex w-full items-center justify-between rounded-2xl border-4 p-5 text-left transition-all ${
                        selectedQuizOption === opt.id 
                          ? opt.isCorrect ? 'border-primary bg-primary/10 text-primary' : 'border-red-400 bg-red-50 text-red-500' 
                          : 'border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/5 hover:border-primary/50'
                      }`}
                    >
                      <span className="font-bold text-lg">{opt.text}</span>
                    </button>
                  ))}
               </div>
            )}
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-white/10 flex items-center justify-between z-20">
             <button onClick={() => setCurrentStepIdx(prev => Math.max(0, prev - 1))} disabled={currentStepIdx === 0} className="px-6 py-3 text-slate-400 font-black uppercase text-xs disabled:opacity-0 transition-all flex items-center gap-1">
               <span className="material-symbols-outlined text-sm">arrow_back</span> Өмнөх
             </button>
             {isTaskCompleted && (
               <button onClick={handleNext} className="bg-primary text-slate-900 px-10 py-4 rounded-[20px] font-black text-sm uppercase shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                 <span>{isLastStep ? 'Дуусгах' : 'Дараах'}</span>
                 <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
               </button>
             )}
          </div>
        </section>

        <section className={`flex flex-col bg-[#0d0d0d] transition-all duration-300 overflow-hidden relative flex-1`}>
          {step.type === 'coding' ? (
            <>
              <div className="flex items-center justify-between border-b border-white/5 bg-[#151515] px-6 py-2 shrink-0">
                <div className="flex items-center gap-2">
                   <span className="size-2 rounded-full bg-yellow-500"></span>
                   <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">IDE - Editor</span>
                </div>
                <div className="text-[10px] font-black text-slate-500">main.{activeLanguage === 'python' ? 'py' : activeLanguage}</div>
              </div>
              
              <div className="flex-1 flex overflow-hidden font-mono text-lg bg-[#0d0d0d] relative prism-editor-container">
                <div 
                  ref={lineNumbersRef}
                  className="w-12 bg-[#111] text-[#333] py-8 text-right pr-3 select-none overflow-hidden shrink-0 border-r border-white/5 z-10"
                >
                  {lineNumbers.map(n => <div key={n} className="h-[28px]">{n}</div>)}
                </div>
                <div className="flex-1 relative overflow-hidden">
                  <pre 
                    ref={highlightRef}
                    aria-hidden="true"
                    className="absolute inset-0 pointer-events-none custom-scrollbar overflow-auto"
                  >
                    <code 
                      className={`language-${activeLanguage === 'python' ? 'python' : activeLanguage === 'c' ? 'c' : 'cpp'}`}
                      dangerouslySetInnerHTML={{ __html: highlightedHtml + '\n' }} 
                    />
                  </pre>
                  <textarea 
                    ref={editorRef}
                    value={userCode} 
                    onChange={(e) => setUserCode(e.target.value)} 
                    onScroll={handleScroll}
                    className="absolute inset-0 bg-transparent text-transparent caret-white outline-none border-none resize-none custom-scrollbar leading-[28px] overflow-auto z-20" 
                    spellCheck={false} 
                    autoFocus
                  />
                </div>
              </div>

              <div className="h-[35%] flex flex-col border-t border-white/5 bg-[#080808]">
                <div className="flex items-center justify-between px-6 py-2 bg-[#111] border-b border-white/5">
                   <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm text-slate-500">terminal</span>
                      <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Output</span>
                   </div>
                   <button 
                    onClick={handleRunCode} 
                    disabled={isRunning} 
                    className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isRunning ? 'bg-slate-800 text-slate-500' : 'bg-primary text-slate-900 shadow-lg'}`}
                   >
                     {isRunning ? 'Checking...' : 'Шалгах'}
                   </button>
                </div>
                <div className="flex-1 p-6 font-mono text-sm overflow-y-auto custom-scrollbar bg-black/40">
                  {terminalOutput.map((line, i) => (
                      <div key={i} className={`mb-1.5 flex gap-3 ${
                        line.type === 'err' ? 'text-red-400' : 
                        line.type === 'success' ? 'text-primary' : 
                        'text-white'
                      }`}>
                         <span className="opacity-20 select-none">❯</span>
                         <span className="whitespace-pre-wrap">{line.text}</span>
                      </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
               <div className="size-48 rounded-[48px] bg-white/5 flex items-center justify-center mb-10 border-2 border-white/5 shadow-inner">
                  <span className="material-symbols-outlined text-[100px] text-primary opacity-20 animate-pulse">code_off</span>
               </div>
               <h3 className="text-3xl font-black text-slate-500 mb-4 uppercase tracking-widest italic">Visual Study Mode</h3>
               <p className="text-slate-600 max-w-sm font-medium leading-relaxed">Зүүн талын онолыг уншиж дуусаад, сорилыг бөглөн дараагийн алхам руу шилжээрэй.</p>
            </div>
          )}
        </section>

        {isAiOpen && (
          <div className="w-[30%] bg-white dark:bg-slate-900 border-l-4 border-primary/20 flex flex-col animate-in slide-in-from-right duration-300 shadow-2xl">
            <div className="p-5 border-b flex items-center justify-between bg-slate-50 dark:bg-slate-800/80">
              <h4 className="font-black text-xs uppercase tracking-widest">AI Tutor Helper</h4>
              <button onClick={() => setIsAiOpen(false)} className="material-symbols-outlined text-slate-400">close</button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[90%] px-4 py-3 rounded-[20px] text-sm leading-relaxed ${msg.role === 'user' ? 'bg-primary text-slate-900 font-bold' : 'bg-slate-100 dark:bg-slate-800 border'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <form onSubmit={(e) => { e.preventDefault(); askAi(); }} className="p-4 border-t flex gap-2 bg-white dark:bg-slate-900">
              <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Асуултаа бичээрэй..." className="flex-1 bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-5 py-3 text-sm font-bold" />
              <button type="submit" className="bg-primary text-slate-900 size-11 rounded-xl flex items-center justify-center shadow-lg"><span className="material-symbols-outlined">send</span></button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default LessonView;
