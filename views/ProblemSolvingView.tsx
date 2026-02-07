
import React, { useState, useRef, useEffect } from 'react';
import { Problem } from '../types';
import { GoogleGenAI } from "@google/genai";

interface ProblemSolvingViewProps {
  problem: Problem;
  onBack: () => void;
  onSolve: (problemId: string) => void;
}

const ProblemSolvingView: React.FC<ProblemSolvingViewProps> = ({ problem, onBack, onSolve }) => {
  const [activeLanguage, setActiveLanguage] = useState<'python' | 'c'>('python');
  const [code, setCode] = useState(problem.templates.python);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{role: 'user'|'model', text: string}[]>([
    { role: 'model', text: `Сайн уу! Би чамд '${problem.title}' бодлогыг бодоход чинь тусална. Асуух зүйл байна уу?` }
  ]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    setCode(activeLanguage === 'python' ? problem.templates.python : problem.templates.c);
  }, [activeLanguage, problem]);

  const handleRun = () => {
    setIsRunning(true);
    const cmd = activeLanguage === 'python' ? "$ python solution.py" : "$ gcc solution.c -o solution && ./solution";
    setTerminalOutput([cmd]);

    setTimeout(() => {
      // Энгийн тест шалгалт (Жишээ)
      setTerminalOutput(prev => [...prev, problem.expectedOutput]);
      setIsRunning(false);
      
      // Хэрэв зөв бол
      if (confirm("Бодлогыг зөв бодлоо! Хадгалах уу?")) {
        onSolve(problem.id);
        onBack();
      }
    }, 1500);
  };

  const askAi = async () => {
    if (!chatInput.trim() || isAiLoading) return;
    const userMsg = chatInput;
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsAiLoading(true);

    const systemInstruction = `Чи бол CodeStep Tutor. Сурагч '${problem.title}' бодлогыг ${activeLanguage} дээр бодож байна.
    Бодлогын тайлбар: ${problem.description}. Сурагчийн бичсэн код: \n${code}\n
    Түүнд шууд хариуг нь хэлэхгүйгээр, зөв чиглэл рүү нь хөтлөх тайлбар өгөөрэй.`;

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: systemInstruction + "\nАсуулт: " + userMsg,
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
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            <button onClick={() => setActiveLanguage('python')} className={`px-4 py-1 rounded-md text-[10px] font-black uppercase ${activeLanguage === 'python' ? 'bg-primary text-slate-900' : 'text-slate-500'}`}>Python</button>
            <button onClick={() => setActiveLanguage('c')} className={`px-4 py-1 rounded-md text-[10px] font-black uppercase ${activeLanguage === 'c' ? 'bg-primary text-slate-900' : 'text-slate-500'}`}>C</button>
          </div>
          <button onClick={() => setIsAiOpen(!isAiOpen)} className="p-2 border-2 border-primary/20 rounded-lg text-primary hover:bg-primary/5 transition-all">
             <span className="material-symbols-outlined">smart_toy</span>
          </button>
          <button onClick={handleRun} disabled={isRunning} className="bg-primary text-slate-900 px-6 py-2 rounded-lg font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">
            {isRunning ? 'Running...' : 'Submit'}
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left: Problem Statement */}
        <div className="w-1/3 bg-white dark:bg-[#0d1a13] border-r border-slate-200 dark:border-white/5 overflow-y-auto p-8 custom-scrollbar">
          <h3 className="text-2xl font-black mb-6">Бодлогын нөхцөл</h3>
          <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed mb-8">{problem.description}</p>
          
          <div className="mb-8">
            <h4 className="text-[10px] font-black text-primary uppercase tracking-widest mb-4">Хязгаарлалт</h4>
            <ul className="space-y-2">
              {problem.constraints.map((c, i) => (
                <li key={i} className="text-xs text-slate-500 flex gap-2">
                  <span className="text-primary font-bold">•</span> {c}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-black text-primary uppercase tracking-widest mb-4">Жишээ</h4>
            {problem.examples.map((ex, i) => (
              <div key={i} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-white/5 mb-4">
                <div className="mb-2"><span className="text-[10px] font-black text-slate-400">INPUT:</span> <code className="text-xs ml-2">{ex.input}</code></div>
                <div><span className="text-[10px] font-black text-slate-400">OUTPUT:</span> <code className="text-xs ml-2 text-primary">{ex.output}</code></div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Code Editor & AI Sidebar */}
        <div className="flex-1 flex overflow-hidden relative">
          <div className={`flex flex-col h-full bg-[#1e1e1e] transition-all duration-500 ${isAiOpen ? 'w-1/2' : 'w-full'}`}>
             <textarea 
               value={code}
               onChange={(e) => setCode(e.target.value)}
               className="flex-1 bg-transparent p-8 font-mono text-lg text-white resize-none outline-none custom-scrollbar"
               spellCheck={false}
             />
             <div className="h-1/3 bg-[#0c0c0c] border-t border-white/5 p-6 font-mono text-primary overflow-y-auto custom-scrollbar">
                {terminalOutput.map((l, i) => (
                  <div key={i} className="mb-1">{l}</div>
                ))}
             </div>
          </div>

          {isAiOpen && (
            <div className="w-1/2 bg-white dark:bg-slate-900 border-l-4 border-primary/20 flex flex-col animate-in slide-in-from-right duration-500">
               <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <h4 className="font-black">AI Tutor</h4>
                  <button onClick={() => setIsAiOpen(false)} className="material-symbols-outlined text-slate-400">close</button>
               </div>
               <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {chatMessages.map((m, i) => (
                    <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                       <div className={`px-4 py-2 rounded-2xl text-sm ${m.role === 'user' ? 'bg-primary text-slate-900 font-bold' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'}`}>
                         {m.text}
                       </div>
                    </div>
                  ))}
                  {isAiLoading && <div className="text-[10px] font-bold text-primary animate-pulse">Thinking...</div>}
               </div>
               <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                  <form onSubmit={(e) => { e.preventDefault(); askAi(); }} className="flex gap-2">
                    <input value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Асуух зүйл..." className="flex-1 bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20" />
                    <button type="submit" className="bg-primary text-slate-900 p-2 rounded-xl"><span className="material-symbols-outlined">send</span></button>
                  </form>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemSolvingView;
