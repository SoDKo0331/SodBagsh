
import React, { useState, useRef, useEffect } from 'react';
import { Problem } from '../types';
import { GoogleGenAI, Type } from "@google/genai";

interface ProblemSolvingViewProps {
  problem: Problem;
  onBack: () => void;
  onSolve: (problemId: string) => void;
}

interface TerminalLine {
  type: 'cmd' | 'out' | 'err' | 'success' | 'info';
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
    { role: 'model', text: `Сайн уу! Би чамд '${problem.title}' бодлогыг бодоход чинь тусална. Асуух зүйл байна уу?` }
  ]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCode(problem.templates[activeLanguage]);
    setTerminalOutput([]);
  }, [activeLanguage, problem]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalOutput]);

  const verifyCodeWithAI = async (userCode: string, lang: string) => {
    const originalTemplate = problem.templates[activeLanguage as keyof typeof problem.templates];
    if (userCode.trim() === originalTemplate.trim()) {
        return {
            success: false,
            output: "Error: No changes",
            feedback: "Чи кодыг өөрчилж бодлогын шийдийг бичих ёстой."
        };
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Чи бол Код Шүүгч. JSON: { "success": boolean, "output": string, "feedback": string }. Бодлого: ${problem.title}. Код: ${userCode}. Хүлээгдэж буй хариу: ${problem.expectedOutput}`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          thinkingConfig: { thinkingBudget: 0 },
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              success: { type: Type.BOOLEAN },
              output: { type: Type.STRING },
              feedback: { type: Type.STRING },
            },
            required: ["success", "output", "feedback"]
          }
        }
      });
      return JSON.parse(response.text || "{}");
    } catch (e) {
      return { success: false, output: "Error", feedback: "Шалгалт хийх явцад алдаа гарлаа. Дахин оролдоно уу." };
    }
  };

  const handleRun = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setTerminalOutput([{type: 'cmd', text: `Analyzing logic...`}]);
    
    const result = await verifyCodeWithAI(code, activeLanguage);

    if (result.success) {
      setTerminalOutput(prev => [
        ...prev, 
        {type: 'out', text: result.output || problem.expectedOutput},
        {type: 'success', text: "Гайхалтай! Чи бодлогыг амжилттай бодлоо."}
      ]);
      
      setTimeout(() => {
        if (confirm("Амжилттай! Хадгалах уу?")) {
          onSolve(problem.id);
          onBack();
        }
      }, 100);
    } else {
      setTerminalOutput(prev => [
        ...prev, 
        {type: 'err', text: "Бодлого буруу байна!"},
        {type: 'out', text: result.feedback || "Логик алдаа байна."}
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
        model: 'gemini-3-flash-preview',
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
    <div className="flex flex-col h-full bg-[#1e1e1e] overflow-hidden">
      <header className="h-16 bg-white dark:bg-[#111814] border-b border-slate-200 dark:border-white/10 flex items-center justify-between px-6 shrink-0 z-20">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
            <span className="material-symbols-outlined text-slate-500">arrow_back</span>
          </button>
          <h2 className="font-black text-slate-900 dark:text-white">{problem.title}</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
            {['python', 'c', 'cpp'].map((lang) => (
              <button key={lang} onClick={() => setActiveLanguage(lang as any)} className={`px-4 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${activeLanguage === lang ? 'bg-primary text-slate-900' : 'text-slate-500'}`}>{lang.toUpperCase()}</button>
            ))}
          </div>
          <button onClick={() => setIsAiOpen(!isAiOpen)} className={`p-2 border-2 rounded-lg ${isAiOpen ? 'bg-primary border-primary text-slate-900' : 'border-primary/20 text-primary'}`}>
             <span className="material-symbols-outlined">smart_toy</span>
          </button>
          <button onClick={handleRun} disabled={isRunning} className="bg-primary text-slate-900 px-6 py-2 rounded-lg font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20">
            {isRunning ? 'Checking...' : 'Submit'}
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-1/3 bg-white dark:bg-[#0d1a13] border-r border-slate-200 dark:border-white/5 overflow-y-auto p-8 custom-scrollbar">
          <h3 className="text-2xl font-black mb-6">Бодлогын нөхцөл</h3>
          <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed mb-8">{problem.description}</p>
          <div>
            <h4 className="text-[10px] font-black text-primary uppercase tracking-widest mb-4">Жишээ Тестүүд</h4>
            {problem.examples.map((ex, i) => (
              <div key={i} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-white/5 mb-4 font-mono text-xs">
                <div><span className="text-slate-400">In:</span> {ex.input}</div>
                <div><span className="text-slate-400">Out:</span> <span className="text-primary font-bold">{ex.output}</span></div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden relative">
          <div className={`flex flex-col h-full bg-[#1e1e1e] transition-all duration-300 ${isAiOpen ? 'w-1/2' : 'w-full'}`}>
             <textarea value={code} onChange={(e) => setCode(e.target.value)} className="flex-1 bg-transparent p-8 font-mono text-lg text-white resize-none outline-none custom-scrollbar" spellCheck={false} placeholder="// Шийдэл..." />
             <div className="h-1/3 bg-[#0c0c0c] border-t border-white/5 flex flex-col">
                <div className="px-6 py-2 bg-[#1a1a1a] border-b border-white/5 flex justify-between items-center text-[10px] font-black text-slate-500 uppercase">
                   <span>Console Output</span>
                </div>
                <div className="flex-1 p-6 font-mono text-sm overflow-y-auto custom-scrollbar bg-black/40">
                   {terminalOutput.map((l, i) => (
                      <div key={i} className={`flex gap-3 ${l.type === 'err' ? 'text-red-400' : l.type === 'success' ? 'text-primary font-black' : 'text-white'}`}>
                         <span className="select-none text-slate-800">❯</span>
                         <span className="whitespace-pre-wrap">{l.text}</span>
                      </div>
                   ))}
                   <div ref={terminalEndRef} />
                </div>
             </div>
          </div>

          {isAiOpen && (
            <div className="w-1/2 bg-white dark:bg-slate-900 border-l-4 border-primary/20 flex flex-col animate-in slide-in-from-right duration-300 shadow-[-20px_0_50px_rgba(0,0,0,0.3)]">
               <div className="p-4 border-b flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
                  <h4 className="font-black text-sm uppercase tracking-widest">AI Tutor</h4>
                  <button onClick={() => setIsAiOpen(false)} className="material-symbols-outlined text-slate-400">close</button>
               </div>
               <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                  {chatMessages.map((m, i) => (
                    <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                       <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed max-w-[90%] ${m.role === 'user' ? 'bg-primary text-slate-900 font-bold' : 'bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800'}`}>
                         {m.text}
                       </div>
                    </div>
                  ))}
               </div>
               <form onSubmit={(e) => { e.preventDefault(); askAi(); }} className="p-4 border-t flex gap-2">
                  <input value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Асуух..." className="flex-1 bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-sm font-bold" />
                  <button type="submit" className="bg-primary text-slate-900 size-11 rounded-xl flex items-center justify-center"><span className="material-symbols-outlined">send</span></button>
               </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemSolvingView;
