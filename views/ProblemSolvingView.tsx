
import React, { useState, useRef, useEffect } from 'react';
import { Problem } from '../types';
import { GoogleGenAI, Type } from "@google/genai";

interface ProblemSolvingViewProps {
  problem: Problem;
  onBack: () => void;
  onSolve: (problemId: string) => void;
}

interface TerminalLine {
  type: 'cmd' | 'out' | 'err' | 'success' | 'info' | 'hint';
  text: string;
}

const ProblemSolvingView: React.FC<ProblemSolvingViewProps> = ({ problem, onBack, onSolve }) => {
  const [activeLanguage, setActiveLanguage] = useState<'python' | 'c' | 'cpp'>('python');
  const [code, setCode] = useState(problem.templates.python);
  const [terminalOutput, setTerminalOutput] = useState<TerminalLine[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{role: 'user'|'model', text: string}[]>([
    { role: 'model', text: `Сайн уу! 🧙‍♂️ Би '${problem.title}' бодлогыг бодоход чинь туслах 'Code Wizard' байна. Кодоо бичээд шалгуулаарай!` }
  ]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCode(problem.templates[activeLanguage]);
    setTerminalOutput([]);
  }, [activeLanguage, problem]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalOutput]);

  const handleScroll = () => {
    if (editorRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = editorRef.current.scrollTop;
    }
  };

  const lineCount = code.split('\n').length;
  const lineNumbers = Array.from({ length: Math.max(lineCount, 20) }, (_, i) => i + 1);

  const verifyCodeWithAI = async (userCode: string, lang: string) => {
    // Fix: Upgrade to gemini-3-pro-preview for complex coding reasoning
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Act as a Code Judge. Analyze this ${lang} code for the problem: "${problem.title}".
    Problem Description: ${problem.description}
    Target Output: "${problem.expectedOutput}"
    User Code: ${userCode}

    Respond ONLY in JSON:
    { "success": boolean, "output": "program output", "feedback": "very short message", "hint": "specific hint if failed" }`;

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
      return { success: false, output: "Error", feedback: "Шалгалт хийх явцад алдаа гарлаа.", hint: "Холболтоо шалгана уу." };
    }
  };

  const handleRun = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setTerminalOutput([{type: 'info', text: `> Compiling ${activeLanguage} code...`}]);
    
    await new Promise(r => setTimeout(r, 600));
    setTerminalOutput(prev => [...prev, {type: 'info', text: `> Running test cases...`}]);
    
    const result = await verifyCodeWithAI(code, activeLanguage);

    if (result.success) {
      setTerminalOutput(prev => [
        ...prev, 
        {type: 'out', text: result.output || problem.expectedOutput},
        {type: 'success', text: `✓ АМЖИЛТТАЙ: ${result.feedback}`}
      ]);
      
      setTimeout(() => {
        if (confirm("Гайхалтай! Бодлогыг зөв бодлоо. Амжилтаа хадгалах уу?")) {
          onSolve(problem.id);
          onBack();
        }
      }, 300);
    } else {
      setTerminalOutput(prev => [
        ...prev, 
        {type: 'err', text: `✗ АЛДАА: ${result.output || 'Output mismatch'}`},
        {type: 'hint', text: `ЗӨВЛӨГӨӨ: ${result.hint}`}
      ]);
    }
    setIsRunning(false);
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
        contents: `Бодлого: ${problem.title}\nКод: ${code}\nАсуулт: ${userMsg}`,
        config: { thinkingConfig: { thinkingBudget: 0 } }
      });
      setChatMessages(prev => [...prev, { role: 'model', text: response.text || "" }]);
    } catch (e) {
       setChatMessages(prev => [...prev, { role: 'model', text: "Алдаа гарлаа." }]);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] overflow-hidden font-display">
      <header className="h-20 bg-white dark:bg-[#111814] border-b border-slate-200 dark:border-white/10 flex items-center justify-between px-8 shrink-0 z-20 shadow-sm">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="size-10 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-all">
            <span className="material-symbols-outlined text-slate-500">arrow_back</span>
          </button>
          <div>
            <h2 className="font-black text-slate-900 dark:text-white leading-none mb-1">{problem.title}</h2>
            <div className="flex items-center gap-2">
               <span className="size-1.5 rounded-full bg-primary animate-pulse"></span>
               <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Solving</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex bg-slate-100 dark:bg-white/5 p-1 rounded-xl">
            {['python', 'c', 'cpp'].map((lang) => (
              <button key={lang} onClick={() => setActiveLanguage(lang as any)} className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeLanguage === lang ? 'bg-white dark:bg-slate-700 shadow-lg text-primary' : 'text-slate-500'}`}>{lang}</button>
            ))}
          </div>
          <button onClick={() => setIsAiOpen(!isAiOpen)} className={`px-4 py-2.5 rounded-xl border-2 font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 ${isAiOpen ? 'bg-primary border-primary text-slate-900' : 'bg-slate-900 text-white border-slate-900'}`}>
             <span className="material-symbols-outlined text-sm">smart_toy</span>
             <span>Тьютор</span>
          </button>
          <button onClick={handleRun} disabled={isRunning} className="bg-primary text-slate-900 px-10 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20">
            {isRunning ? 'Checking...' : 'Илгээх'}
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Problem Description Panel */}
        <div className="w-[35%] bg-white dark:bg-[#0d1410] border-r border-slate-200 dark:border-white/5 overflow-y-auto p-10 custom-scrollbar shrink-0">
          <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4">Бодлогын Нөхцөл</h3>
          <p className="text-xl font-medium leading-relaxed text-slate-700 dark:text-slate-300 mb-10">{problem.description}</p>
          
          <div className="space-y-8">
            <div className="bg-slate-50 dark:bg-white/5 rounded-3xl p-6 border border-slate-100 dark:border-white/5">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">checklist</span> Жишээ Тестүүд
              </h4>
              <div className="space-y-4">
                {problem.examples.map((ex, i) => (
                  <div key={i} className="font-mono text-xs">
                    <div className="mb-2 flex items-center gap-2">
                       <span className="size-1.5 rounded-full bg-slate-300"></span>
                       <span className="text-slate-500 uppercase">Оролт:</span> 
                       <code className="bg-slate-200 dark:bg-white/10 px-2 py-0.5 rounded">{ex.input}</code>
                    </div>
                    <div className="flex items-center gap-2">
                       <span className="size-1.5 rounded-full bg-primary"></span>
                       <span className="text-slate-500 uppercase">Гаралт:</span> 
                       <code className="text-primary font-bold">{ex.output}</code>
                    </div>
                    {i < problem.examples.length - 1 && <div className="h-px bg-slate-200 dark:bg-white/5 my-4"></div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Code Editor & Terminal Panel */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          <div className={`flex flex-col h-full bg-[#0d0d0d] transition-all duration-300`}>
             <div className="flex-1 flex overflow-hidden font-mono text-lg relative group">
                {/* Editor Line Numbers */}
                <div 
                  ref={lineNumbersRef}
                  className="w-14 bg-[#0a0a0a] text-[#2a2a2a] py-8 text-right pr-4 select-none overflow-hidden shrink-0 border-r border-white/5"
                >
                  {lineNumbers.map(n => <div key={n} className="h-[28px]">{n}</div>)}
                </div>

                {/* Main Textarea */}
                <textarea 
                  ref={editorRef}
                  value={code} 
                  onChange={(e) => setCode(e.target.value)} 
                  onScroll={handleScroll}
                  className="flex-1 bg-transparent p-8 py-8 font-mono text-[#e0e0e0] leading-[28px] resize-none outline-none custom-scrollbar" 
                  spellCheck={false} 
                  placeholder="# Шийдлээ энд бичнэ үү..." 
                />
             </div>

             <div className="h-[30%] bg-[#080808] border-t border-white/5 flex flex-col shadow-2xl">
                <div className="px-6 py-2 bg-[#111] border-b border-white/5 flex justify-between items-center">
                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Debug Console</span>
                   {isRunning && <div className="size-3 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>}
                </div>
                <div className="flex-1 p-6 font-mono text-sm overflow-y-auto custom-scrollbar bg-black/40">
                   {terminalOutput.map((l, i) => (
                      <div key={i} className={`flex gap-3 mb-1.5 animate-in slide-in-from-left-2 duration-300 ${
                        l.type === 'err' ? 'text-red-400' : 
                        l.type === 'success' ? 'text-primary font-black' : 
                        l.type === 'hint' ? 'text-yellow-400 bg-yellow-400/5 p-3 rounded-xl border border-yellow-400/10' :
                        l.type === 'info' ? 'text-blue-400' : 
                        'text-white'
                      }`}>
                         <span className="select-none opacity-20">❯</span>
                         <span className="whitespace-pre-wrap">{l.text}</span>
                      </div>
                   ))}
                   <div ref={terminalEndRef} />
                </div>
             </div>
          </div>

          {/* AI Tutor Slide-in */}
          {isAiOpen && (
            <div className="absolute top-0 right-0 h-full w-[40%] bg-white dark:bg-slate-900 border-l-4 border-primary/20 flex flex-col animate-in slide-in-from-right duration-500 shadow-[-40px_0_60px_rgba(0,0,0,0.5)] z-30">
               <div className="p-6 border-b flex items-center justify-between bg-slate-50 dark:bg-slate-800/80">
                  <div className="flex items-center gap-3">
                     <span className="material-symbols-outlined text-primary font-black">magic_button</span>
                     <h4 className="font-black text-xs uppercase tracking-[0.2em]">Code Wizard Helper</h4>
                  </div>
                  <button onClick={() => setIsAiOpen(false)} className="material-symbols-outlined text-slate-400">close</button>
               </div>
               <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                  {chatMessages.map((m, i) => (
                    <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                       <div className={`px-5 py-4 rounded-[24px] text-sm leading-relaxed max-w-[90%] shadow-sm ${
                         m.role === 'user' 
                          ? 'bg-primary text-slate-900 font-bold' 
                          : 'bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-white/5'
                        }`}>
                         {m.text}
                       </div>
                    </div>
                  ))}
                  {isAiLoading && (
                    <div className="flex justify-start">
                       <div className="bg-slate-100 dark:bg-slate-800 px-6 py-4 rounded-3xl animate-pulse text-[10px] font-black uppercase text-slate-400 tracking-widest">
                         Шидэт дохиур хөдөлж байна...
                       </div>
                    </div>
                  )}
               </div>
               <form onSubmit={(e) => { e.preventDefault(); askAi(); }} className="p-6 border-t flex gap-3 bg-white dark:bg-slate-900">
                  <input value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Асуултаа энд бич..." className="flex-1 bg-slate-100 dark:bg-slate-800 border-none rounded-[20px] px-6 py-4 text-sm font-bold focus:ring-2 ring-primary transition-all" />
                  <button type="submit" disabled={isAiLoading || !chatInput.trim()} className="bg-primary text-slate-900 size-14 rounded-[20px] flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all"><span className="material-symbols-outlined font-black">send</span></button>
               </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemSolvingView;
