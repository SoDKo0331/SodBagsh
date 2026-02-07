
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
  }, [activeLanguage, problem]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalOutput]);

  const verifyCodeWithAI = async (userCode: string, lang: string) => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `
      Чи бол Код Шүүгч (Code Judge). 
      Бодлогын нэр: ${problem.title}
      Бодлогын нөхцөл: ${problem.description}
      Хэл: ${lang}
      Хэрэглэгчийн бичсэн код:
      \`\`\`${lang}
      ${userCode}
      \`\`\`
      
      Дээрх код бодлогыг зөв шийдсэн эсэхийг шалгана уу. 
      Хэрэв код нь зөвхөн бэлдэц (template) хэвээрээ байгаа эсвэл логик алдаатай бол 'success: false' гэж буцаана уу.
      Мөн кодын гаралтын жишээг (output) болон алдаатай бол яагаад алдаатай байгааг (feedback) хэлнэ үү.
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
              success: { type: Type.BOOLEAN, description: "Код зөв бол true, үгүй бол false" },
              output: { type: Type.STRING, description: "Код ажиллахад гарах текст" },
              feedback: { type: Type.STRING, description: "Алдаатай бол яагаад алдаатай байгаа тайлбар" }
            },
            required: ["success", "output", "feedback"]
          }
        }
      });

      const result = JSON.parse(response.text || "{}");
      return result;
    } catch (e) {
      console.error("AI Verification failed", e);
      return { success: false, output: "Error", feedback: "Шалгалт хийх явцад алдаа гарлаа." };
    }
  };

  const handleRun = async () => {
    setIsRunning(true);
    const cmdMap = {
      python: "python solution.py",
      c: "gcc solution.c -o solution && ./solution",
      cpp: "g++ solution.cpp -o solution && ./solution"
    };
    
    setTerminalOutput([{type: 'cmd', text: cmdMap[activeLanguage]}]);
    setTerminalOutput(prev => [...prev, {type: 'info', text: "Compiling and running tests..."}]);

    const result = await verifyCodeWithAI(code, activeLanguage);

    setTimeout(() => {
      if (result.success) {
        setTerminalOutput(prev => [
          ...prev, 
          {type: 'out', text: result.output || problem.expectedOutput},
          {type: 'success', text: "Гайхалтай! Бүх тестүүд амжилттай давлаа."}
        ]);
        setIsRunning(false);
        
        if (confirm("Бодлогыг зөв бодлоо! Хадгалах уу?")) {
          onSolve(problem.id);
          onBack();
        }
      } else {
        setTerminalOutput(prev => [
          ...prev, 
          {type: 'err', text: "Тест амжилтгүй боллоо!"},
          {type: 'out', text: result.feedback || "Код бодлогын нөхцөлийг бүрэн хангасангүй."}
        ]);
        setIsRunning(false);
      }
    }, 1000);
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
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
            {['python', 'c', 'cpp'].map((lang) => (
              <button 
                key={lang}
                onClick={() => setActiveLanguage(lang as any)} 
                className={`px-4 py-1 rounded-md text-[10px] font-black uppercase transition-all ${activeLanguage === lang ? 'bg-primary text-slate-900 shadow-sm' : 'text-slate-500'}`}
              >
                {lang === 'cpp' ? 'C++' : lang.toUpperCase()}
              </button>
            ))}
          </div>
          <button onClick={() => setIsAiOpen(!isAiOpen)} className={`p-2 border-2 rounded-lg transition-all ${isAiOpen ? 'bg-primary border-primary text-slate-900' : 'border-primary/20 text-primary hover:bg-primary/5'}`}>
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
            <h4 className="text-[10px] font-black text-primary uppercase tracking-widest mb-4">Жишээ Тестүүд</h4>
            {problem.examples.map((ex, i) => (
              <div key={i} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-white/5 mb-4">
                <div className="mb-2"><span className="text-[10px] font-black text-slate-400">INPUT:</span> <code className="text-xs ml-2">{ex.input}</code></div>
                <div><span className="text-[10px] font-black text-slate-400">OUTPUT:</span> <code className="text-xs ml-2 text-primary">{ex.output}</code></div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden relative">
          <div className={`flex flex-col h-full bg-[#1e1e1e] transition-all duration-500 ${isAiOpen ? 'w-1/2' : 'w-full'}`}>
             <div className="px-6 py-2 bg-[#2d2d2d] border-b border-white/5 flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Solution Editor</span>
             </div>
             <textarea 
               value={code}
               onChange={(e) => setCode(e.target.value)}
               className="flex-1 bg-transparent p-8 font-mono text-lg text-white resize-none outline-none custom-scrollbar"
               spellCheck={false}
             />
             <div className="h-1/3 bg-[#0c0c0c] border-t border-white/5 flex flex-col">
                <div className="px-6 py-2 bg-[#1a1a1a] border-b border-white/5 flex items-center justify-between">
                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Гаралт (Terminal)</span>
                   <button onClick={() => setTerminalOutput([])} className="text-[10px] text-slate-600 hover:text-slate-400 font-black uppercase">Clear</button>
                </div>
                <div className="flex-1 p-6 font-mono text-sm overflow-y-auto custom-scrollbar bg-black/40">
                   {terminalOutput.length === 0 ? (
                      <div className="text-slate-800 italic flex items-center gap-2">
                         <span className="material-symbols-outlined text-sm">terminal</span>
                         Шалгалтын үр дүн энд гарна...
                      </div>
                   ) : (
                      <div className="space-y-1.5">
                        {terminalOutput.map((l, i) => (
                          <div key={i} className={`flex gap-3 animate-in slide-in-from-left duration-200 ${
                            l.type === 'cmd' ? 'text-blue-400/70 italic' : 
                            l.type === 'err' ? 'text-red-400' : 
                            l.type === 'success' ? 'text-primary font-bold' : 
                            l.type === 'info' ? 'text-slate-500 italic' :
                            'text-primary font-medium'
                          }`}>
                             <span className="select-none text-slate-800 shrink-0">
                                {l.type === 'cmd' ? '$' : l.type === 'err' ? '!' : l.type === 'info' ? 'i' : '❯'}
                             </span>
                             <span className="whitespace-pre-wrap">{l.text}</span>
                          </div>
                        ))}
                        {isRunning && (
                           <div className="flex gap-3 text-primary animate-pulse">
                              <span className="select-none text-slate-800">❯</span>
                              <span className="inline-block w-2 h-4 bg-primary mt-1"></span>
                           </div>
                        )}
                        <div ref={terminalEndRef} />
                      </div>
                   )}
                </div>
             </div>
          </div>

          {isAiOpen && (
            <div className="w-1/2 bg-white dark:bg-slate-900 border-l-4 border-primary/20 flex flex-col animate-in slide-in-from-right duration-500">
               <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
                  <div className="flex items-center gap-3">
                     <span className="material-symbols-outlined text-primary">smart_toy</span>
                     <h4 className="font-black">AI Tutor</h4>
                  </div>
                  <button onClick={() => setIsAiOpen(false)} className="material-symbols-outlined text-slate-400 hover:text-slate-600">close</button>
               </div>
               <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/20 dark:bg-transparent custom-scrollbar">
                  {chatMessages.map((m, i) => (
                    <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                       <div className={`px-4 py-2 rounded-2xl text-sm leading-relaxed max-w-[90%] shadow-sm ${m.role === 'user' ? 'bg-primary text-slate-900 font-bold' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-700'}`}>
                         {m.text}
                       </div>
                    </div>
                  ))}
                  {isAiLoading && (
                    <div className="flex gap-2 p-2 animate-pulse">
                       <span className="text-[10px] font-black text-primary uppercase tracking-widest">Багш бодож байна...</span>
                    </div>
                  )}
               </div>
               <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <form onSubmit={(e) => { e.preventDefault(); askAi(); }} className="flex gap-2">
                    <input value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Бодлогоо бодоход тусламж хэрэгтэй юу?..." className="flex-1 bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-primary/20 placeholder:text-slate-400" />
                    <button type="submit" disabled={!chatInput.trim() || isAiLoading} className="bg-primary text-slate-900 size-11 rounded-xl flex items-center justify-center hover:scale-105 transition-all shadow-lg shadow-primary/20"><span className="material-symbols-outlined font-black">send</span></button>
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
