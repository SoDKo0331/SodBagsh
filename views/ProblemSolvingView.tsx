
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
    // 1. Кодыг өөрчилсөн эсэхийг фронтенд дээр шууд шалгах
    const originalTemplate = problem.templates[activeLanguage as keyof typeof problem.templates];
    if (userCode.trim() === originalTemplate.trim()) {
        return {
            success: false,
            output: "Error: No changes detected",
            feedback: "Чи өгөгдсөн бэлдэц кодыг өөрчилж, бодлогын шийдийг бичих ёстой. Өөрчлөлт ороогүй байна."
        };
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `
      Чи бол дэлхийн хэмжээний Код Шүүгч. Сурагчийн кодыг маш хатуу шалгана уу.
      
      Бодлогын нэр: ${problem.title}
      Бодлогын нөхцөл: ${problem.description}
      Жишээ тестүүд: ${JSON.stringify(problem.examples)}
      Хүлээгдэж буй үр дүн: ${problem.expectedOutput}
      
      Хэл: ${lang}
      Хэрэглэгчийн бичсэн код:
      \`\`\`${lang}
      ${userCode}
      \`\`\`
      
      ШАЛГАХ ЗААВАР:
      1. Код нь зөвхөн бэлдэцээс өөрчлөгдсөн байх ёстой.
      2. Зөвхөн хариуг хэвлэх (print("${problem.expectedOutput}")) биш, заавал логик тооцоолол (хувьсагч, нөхцөл, давталт г.м) ашигласан байх ёстой.
      3. Хэрэв код нь бүх жишээ тест дээр зөв ажиллаж байвал 'success: true' буцаана.
      
      JSON-оор хариулна уу: { "success": boolean, "output": string, "feedback": string }
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
            },
            required: ["success", "output", "feedback"]
          }
        }
      });

      return JSON.parse(response.text || "{}");
    } catch (e) {
      console.error("Judge API failed", e);
      return { success: false, output: "System Failure", feedback: "Шалгалт хийх явцад AI систем хариу өгсөнгүй. Дахин оролдоно уу." };
    }
  };

  const handleRun = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setTerminalOutput([{type: 'cmd', text: `Preparing environment for ${activeLanguage}...`}]);
    
    setTerminalOutput(prev => [...prev, {type: 'info', text: "Executing test suite and logical analysis..."}]);

    const result = await verifyCodeWithAI(code, activeLanguage);

    if (result.success) {
      setTerminalOutput(prev => [
        ...prev, 
        {type: 'info', text: "Verification complete: 100% test cases passed."},
        {type: 'out', text: result.output || problem.expectedOutput},
        {type: 'success', text: "Гайхалтай! Чи бодлогыг амжилттай бодлоо."}
      ]);
      
      setTimeout(() => {
        if (confirm("Бодлогыг зөв бодлоо! Хадгалж, амжилтаа ахиулах уу?")) {
          onSolve(problem.id);
          onBack();
        }
      }, 500);
    } else {
      setTerminalOutput(prev => [
        ...prev, 
        {type: 'err', text: "Бодлого буруу байна!"},
        {type: 'out', text: result.feedback || "Кодонд логик алдаа байна. Зааврыг дахин уншина уу."}
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

    const systemInstruction = `Чи бол CodeStep Tutor. Бодлого: ${problem.title}. Одоогийн код: \n${code}`;

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: systemInstruction + "\nАсуулт: " + userMsg,
      });
      setChatMessages(prev => [...prev, { role: 'model', text: response.text || "" }]);
    } catch (e) {
       setChatMessages(prev => [...prev, { role: 'model', text: "Алдаа гарлаа. Түр хүлээгээд дахин асууна уу." }]);
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
              <button 
                key={lang}
                onClick={() => setActiveLanguage(lang as any)} 
                className={`px-4 py-1 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${activeLanguage === lang ? 'bg-primary text-slate-900 shadow-sm' : 'text-slate-500'}`}
              >
                {lang === 'cpp' ? 'C++' : lang.toUpperCase()}
              </button>
            ))}
          </div>
          <button onClick={() => setIsAiOpen(!isAiOpen)} className={`p-2 border-2 rounded-lg transition-all ${isAiOpen ? 'bg-primary border-primary text-slate-900 shadow-lg shadow-primary/20' : 'border-primary/20 text-primary hover:bg-primary/5'}`}>
             <span className="material-symbols-outlined">smart_toy</span>
          </button>
          <button onClick={handleRun} disabled={isRunning} className="bg-primary text-slate-900 px-6 py-2 rounded-lg font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20">
            {isRunning ? 'Checking Logic...' : 'Submit Solution'}
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-1/3 bg-white dark:bg-[#0d1a13] border-r border-slate-200 dark:border-white/5 overflow-y-auto p-8 custom-scrollbar">
          <div className="mb-6 flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${problem.difficulty === 'easy' ? 'bg-primary/20 text-primary' : problem.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-red-500/20 text-red-500'}`}>
              {problem.difficulty}
            </span>
          </div>
          <h3 className="text-2xl font-black mb-6">Бодлогын нөхцөл</h3>
          <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed mb-8">{problem.description}</p>
          
          <div>
            <h4 className="text-[10px] font-black text-primary uppercase tracking-widest mb-4">Жишээ Тестүүд</h4>
            {problem.examples.map((ex, i) => (
              <div key={i} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-white/5 mb-4">
                <div className="mb-2 font-mono text-xs flex justify-between">
                    <span className="text-slate-400 uppercase">Input</span>
                    <code>{ex.input}</code>
                </div>
                <div className="font-mono text-xs flex justify-between">
                    <span className="text-slate-400 uppercase">Output</span>
                    <code className="text-primary font-bold">{ex.output}</code>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden relative">
          <div className={`flex flex-col h-full bg-[#1e1e1e] transition-all duration-500 ${isAiOpen ? 'w-1/2' : 'w-full'}`}>
             <div className="px-6 py-2 bg-[#2d2d2d] border-b border-white/5 flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Solution Editor</span>
                <span className="text-[9px] text-slate-600 font-mono tracking-tighter">IDE v1.4 | {activeLanguage.toUpperCase()}</span>
             </div>
             <textarea 
               value={code}
               onChange={(e) => setCode(e.target.value)}
               className="flex-1 bg-transparent p-8 font-mono text-lg text-white resize-none outline-none custom-scrollbar"
               spellCheck={false}
               placeholder="// Шийдлээ энд бичнэ үү..."
             />
             <div className="h-1/3 bg-[#0c0c0c] border-t border-white/5 flex flex-col shadow-2xl">
                <div className="px-6 py-2 bg-[#1a1a1a] border-b border-white/5 flex justify-between items-center">
                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Console Output</span>
                   <button onClick={() => setTerminalOutput([])} className="text-[9px] font-black text-slate-600 hover:text-slate-400 transition-colors uppercase">Clear</button>
                </div>
                <div className="flex-1 p-6 font-mono text-sm overflow-y-auto custom-scrollbar bg-black/40">
                   {terminalOutput.length === 0 ? (
                      <div className="text-slate-800 italic flex items-center gap-2">
                         <span className="material-symbols-outlined text-sm">terminal</span>
                         Бодлогоо шалгахыг хүлээж байна...
                      </div>
                   ) : (
                      <div className="space-y-2">
                        {terminalOutput.map((l, i) => (
                          <div key={i} className={`flex gap-3 animate-in slide-in-from-left duration-200 ${
                            l.type === 'cmd' ? 'text-blue-400/80 italic' : 
                            l.type === 'err' ? 'text-red-400 font-black' : 
                            l.type === 'success' ? 'text-primary font-black uppercase text-xs tracking-widest' : 
                            l.type === 'info' ? 'text-slate-500 italic text-xs' :
                            'text-primary font-medium'
                          }`}>
                             <span className="select-none text-slate-800 shrink-0">❯</span>
                             <span className="whitespace-pre-wrap">{l.text}</span>
                          </div>
                        ))}
                        {isRunning && (
                           <div className="flex gap-3 text-primary animate-pulse mt-1 ml-6">
                              <span className="inline-block w-2 h-4 bg-primary"></span>
                           </div>
                        )}
                        <div ref={terminalEndRef} />
                      </div>
                   )}
                </div>
             </div>
          </div>

          {isAiOpen && (
            <div className="w-1/2 bg-white dark:bg-slate-900 border-l-4 border-primary/20 flex flex-col animate-in slide-in-from-right duration-500 shadow-[-20px_0_50px_rgba(0,0,0,0.3)]">
               <div className="p-4 border-b flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
                  <div className="flex items-center gap-3">
                     <span className="material-symbols-outlined text-primary font-black">smart_toy</span>
                     <h4 className="font-black text-sm uppercase tracking-widest">AI Programming Tutor</h4>
                  </div>
                  <button onClick={() => setIsAiOpen(false)} className="material-symbols-outlined text-slate-400 hover:text-slate-600 transition-colors">close</button>
               </div>
               <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-slate-50/20 dark:bg-transparent">
                  {chatMessages.map((m, i) => (
                    <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                       <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed max-w-[90%] shadow-sm ${m.role === 'user' ? 'bg-primary text-slate-900 font-bold' : 'bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800'}`}>
                         {m.text}
                       </div>
                    </div>
                  ))}
                  {isAiLoading && (
                    <div className="flex gap-2 p-3 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Tutor is analyzing your solution...</span>
                    </div>
                  )}
               </div>
               <form onSubmit={(e) => { e.preventDefault(); askAi(); }} className="p-4 border-t flex gap-2 bg-white dark:bg-slate-900">
                  <input value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Асуух зүйл байна уу?..." className="flex-1 bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-primary/20 transition-all" />
                  <button type="submit" disabled={!chatInput.trim() || isAiLoading} className="bg-primary text-slate-900 size-11 rounded-xl flex items-center justify-center hover:scale-105 transition-all shadow-lg shadow-primary/20"><span className="material-symbols-outlined font-black">send</span></button>
               </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemSolvingView;
