
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

interface SandboxProps {
  onBack: () => void;
}

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

interface TerminalLine {
  type: 'cmd' | 'out' | 'err' | 'success' | 'info' | 'warn';
  text: string;
}

const TEMPLATES = {
  python: "name = 'Super Coder'\nprint('Сайн уу, ' + name + '!')\n\nfor i in range(3):\n    print('Код бичих гоё байна!')",
  c: "#include <stdio.h>\n\nint main() {\n    char name[] = \"Super Coder\";\n    printf(\"Сайн уу, %s!\\n\", name);\n    \n    for(int i=0; i<3; i++) {\n        printf(\"Код бичих гоё байна!\\n\");\n    }\n    return 0;\n}",
  cpp: "#include <iostream>\n#include <string>\n\nint main() {\n    std::string name = \"Super Coder\";\n    std::cout << \"Сайн уу, \" << name << \"!\" << std::endl;\n    \n    for(int i=0; i<3; i++) {\n        std::cout << \"Код бичих гоё байна!\" << std::endl;\n    }\n    return 0;\n}"
};

const Sandbox: React.FC<SandboxProps> = ({ onBack }) => {
  const [activeLanguage, setActiveLanguage] = useState<'python' | 'c' | 'cpp'>('python');
  const [code, setCode] = useState(TEMPLATES.python);
  const [output, setOutput] = useState<TerminalLine[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  
  // AI State
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Сайн уу! Sandbox-т тавтай морил. Чи энд юу ч хамаагүй туршиж үзэж болно. Надаас тусламж хэрэгтэй бол асуугаарай! 🚀" }
  ]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [output]);

  const handleLanguageChange = (lang: 'python' | 'c' | 'cpp') => {
    if (confirm("Хэл солих үед одоогийн бичсэн код устах болно. Зөвшөөрөх үү?")) {
      setActiveLanguage(lang);
      setCode(TEMPLATES[lang]);
      setOutput([]);
    }
  };

  const runCode = () => {
    setIsRunning(true);
    setOutput([]); // Clear previous run
    
    const compilationCmd = activeLanguage === 'python' ? `python3 main.py` : 
                          activeLanguage === 'c' ? `gcc main.c -o main -Wall` : 
                          `g++ main.cpp -o main -Wall`;
    
    setOutput(prev => [...prev, {type: 'cmd', text: compilationCmd}]);
    
    if (activeLanguage !== 'python') {
      setOutput(prev => [...prev, {type: 'info', text: "Building target 'main'..."}]);
    }

    // Use Gemini for a bit more "realistic" sandbox execution if we wanted, 
    // but here we maintain the mock logic with enhanced terminal feel.
    setTimeout(() => {
      const mockResult: string[] = [
        "Сайн уу, Super Coder!",
        "Код бичих гоё байна!",
        "Код бичих гоё байна!",
        "Код бичих гоё байна!"
      ];
      
      if (activeLanguage !== 'python') {
        setOutput(prev => [...prev, 
          {type: 'info', text: "Compilation successful. No warnings generated."},
          {type: 'cmd', text: "./main"}
        ]);
      }

      setOutput(prev => [
        ...prev, 
        ...mockResult.map(r => ({type: 'out', text: r} as TerminalLine)),
        {type: 'success', text: `Program terminated with exit code 0.`}
      ]);
      setIsRunning(false);
    }, 1500);
  };

  const askAi = async () => {
    if (!chatInput.trim() || isAiLoading) return;
    const userMsg = chatInput;
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsAiLoading(true);

    const systemInstruction = `
      Чи бол "CodeStep Tutor" нэртэй интерактив AI багш. 
      Сурагч Sandbox горимд ${activeLanguage.toUpperCase()} дээр код бичиж байна.
      Түүний бичсэн код: \n${code}\n
      Хэв маяг: Найрсаг, энгийн, кодын алдааг олох болон сайжруулахад нь туслаарай.
    `;

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: systemInstruction + "\nАсуулт: " + userMsg,
      });
      setChatMessages(prev => [...prev, { role: 'model', text: response.text || "Би бодож байна..." }]);
    } catch (error) {
      setChatMessages(prev => [...prev, { role: 'model', text: "Алдаа гарлаа. Түр хүлээгээд дахин оролдоно уу." }]);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] font-display overflow-hidden relative">
      <header className="h-20 bg-white dark:bg-[#111814] border-b border-slate-200 dark:border-white/10 flex items-center justify-between px-8 shrink-0 z-20">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all hover:scale-110">
            <span className="material-symbols-outlined text-slate-500">arrow_back</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary border-2 border-primary/20">
              <span className="material-symbols-outlined font-black">extension</span>
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white leading-none">Sandbox</h2>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Чөлөөт горим</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            {['python', 'c', 'cpp'].map((lang) => (
               <button 
                  key={lang}
                  onClick={() => handleLanguageChange(lang as any)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeLanguage === lang ? 'bg-primary text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'}`}
                >
                  {lang === 'cpp' ? 'C++' : lang.toUpperCase()}
                </button>
            ))}
          </div>
          
          <button 
            onClick={() => setIsAiOpen(!isAiOpen)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-black transition-all border-2 ${isAiOpen ? 'bg-primary border-primary text-slate-900 shadow-lg shadow-primary/20' : 'bg-white dark:bg-slate-900 border-primary/20 text-primary hover:border-primary'}`}
          >
            <span className="material-symbols-outlined text-lg">smart_toy</span>
            <span>{isAiOpen ? 'AI Хаах' : 'AI Багш'}</span>
          </button>

          <button 
            onClick={runCode}
            disabled={isRunning}
            className="bg-primary text-slate-900 px-8 py-2.5 rounded-xl font-black shadow-xl shadow-primary/30 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all uppercase tracking-widest text-xs disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-lg animate-spin" style={{ animationDuration: isRunning ? '2s' : '0s' }}>{isRunning ? 'sync' : 'play_arrow'}</span>
            {isRunning ? 'Building...' : 'Код ажиллуулах'}
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        <div className={`flex flex-col bg-[#1e1e1e] border-r border-white/5 transition-all duration-500 ${isAiOpen ? 'w-1/3' : 'w-2/3'}`}>
           <div className="px-6 py-2 bg-[#2d2d2d] flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-2">
                 <div className={`size-2 rounded-full ${activeLanguage === 'python' ? 'bg-yellow-400' : 'bg-blue-400'}`}></div>
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                   {activeLanguage === 'python' ? 'main.py' : activeLanguage === 'c' ? 'main.c' : 'main.cpp'}
                 </span>
              </div>
           </div>
           <div className="flex flex-1 overflow-hidden relative">
              <div className="flex flex-col bg-[#1e1e1e] text-right py-8 px-4 text-white/20 select-none border-r border-white/5 min-w-[50px] font-mono text-lg">
                 {Array.from({length: 25}).map((_, i) => <span key={i}>{i+1}</span>)}
              </div>
              <textarea 
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="flex-1 bg-transparent p-8 font-mono text-lg text-white border-none focus:ring-0 resize-none custom-scrollbar outline-none"
                spellCheck={false}
              />
           </div>
        </div>

        <div className={`flex flex-col bg-[#0c0c0c] transition-all duration-500 ${isAiOpen ? 'w-1/3' : 'w-1/3'}`}>
          <div className="px-6 py-2 bg-[#1a1a1a] border-b border-white/5 flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Гаралт (Terminal)</span>
            <button onClick={() => setOutput([])} className="text-[10px] font-black text-slate-600 hover:text-slate-400 uppercase tracking-widest transition-colors">Clear</button>
          </div>
          <div className="flex-1 p-6 font-mono text-base overflow-y-auto custom-scrollbar bg-black/40">
            {output.length === 0 ? (
              <div className="text-slate-800 italic flex items-center gap-2 text-sm">
                <span className="material-symbols-outlined text-sm">terminal</span>
                Код ажиллуулахыг хүлээж байна...
              </div>
            ) : (
              <div className="space-y-1.5">
                {output.map((line, i) => (
                  <div key={i} className={`flex gap-3 animate-in slide-in-from-left duration-200 ${
                    line.type === 'cmd' ? 'text-blue-400 font-bold' : 
                    line.type === 'err' ? 'text-red-400 font-black' : 
                    line.type === 'success' ? 'text-primary/70 text-xs italic' : 
                    line.type === 'info' ? 'text-slate-500 italic text-sm' :
                    line.type === 'warn' ? 'text-yellow-400 italic border-l-2 border-yellow-400 pl-2' :
                    'text-primary font-medium'
                  }`}>
                     <span className="select-none text-slate-800 shrink-0">
                        {line.type === 'cmd' ? '$' : line.type === 'err' ? '!' : line.type === 'warn' ? '!' : '❯'}
                     </span>
                     <span className="whitespace-pre-wrap">{line.text}</span>
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

        <div 
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
                   <div className="flex gap-1">
                      <div className="size-1.5 bg-primary rounded-full animate-bounce"></div>
                      <div className="size-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="size-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]"></div>
                   </div>
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
                placeholder="Тусламж хэрэгтэй юу?..."
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
        </div>
      </div>
      
      <footer className="h-10 bg-[#1a1a1a] flex items-center justify-between px-8 border-t border-white/5 shrink-0">
         <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
               <div className="size-2 rounded-full bg-primary animate-pulse"></div>
               <span className="text-[10px] font-black text-primary uppercase tracking-widest">Environment Ready</span>
            </div>
            <div className="h-4 w-px bg-white/10"></div>
            <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">
               UTF-8 | {activeLanguage === 'python' ? 'Python 3.11' : activeLanguage === 'c' ? 'GCC 13.2' : 'G++ 13.2'}
            </div>
         </div>
         <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">
            CodeQuest Sandbox v2.1
         </div>
      </footer>
    </div>
  );
};

export default Sandbox;
