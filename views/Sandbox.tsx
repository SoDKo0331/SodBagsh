
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { GoogleGenAI } from "@google/genai";
import Prism from 'prismjs';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';

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
  
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Sandbox-т тавтай морил. Чи энд юу ч хамаагүй туршиж үзэж болно. 🚀" }
  ]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLPreElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [output]);

  const handleLanguageChange = (lang: 'python' | 'c' | 'cpp') => {
    if (confirm("Хэл солих уу? Одоогийн код устах болно.")) {
      setActiveLanguage(lang);
      setCode(TEMPLATES[lang]);
      setOutput([]);
    }
  };

  const handleScroll = () => {
    if (editorRef.current && highlightRef.current) {
      highlightRef.current.scrollTop = editorRef.current.scrollTop;
      highlightRef.current.scrollLeft = editorRef.current.scrollLeft;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const value = e.currentTarget.value;
      const newValue = value.substring(0, start) + "    " + value.substring(end);
      setCode(newValue);
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.selectionStart = editorRef.current.selectionEnd = start + 4;
        }
      }, 0);
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      const cursor = e.currentTarget.selectionStart;
      const value = e.currentTarget.value;
      const lineStart = value.lastIndexOf('\n', cursor - 1) + 1;
      const currentLine = value.substring(lineStart, cursor);
      const indentMatch = currentLine.match(/^\s*/);
      const indent = indentMatch ? indentMatch[0] : "";
      
      let extraIndent = "";
      const trimmedLine = currentLine.trim();
      if (trimmedLine.endsWith(':') || trimmedLine.endsWith('{')) {
        extraIndent = "    ";
      }

      const insertion = "\n" + indent + extraIndent;
      const newValue = value.substring(0, cursor) + insertion + value.substring(e.currentTarget.selectionEnd);
      setCode(newValue);
      
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.selectionStart = editorRef.current.selectionEnd = cursor + insertion.length;
        }
      }, 0);
    }
  };

  const highlightedHtml = useMemo(() => {
    const lang = activeLanguage === 'python' ? 'python' : activeLanguage === 'c' ? 'c' : 'cpp';
    const grammar = Prism.languages[lang];
    if (!grammar) return code;
    return Prism.highlight(code, grammar, lang);
  }, [code, activeLanguage]);

  const runCode = () => {
    setIsRunning(true);
    setOutput([]);
    
    const compilationCmd = activeLanguage === 'python' ? `python3 main.py` : 
                           activeLanguage === 'cpp' ? `g++ main.cpp -o main && ./main` :
                           `gcc main.c -o main && ./main`;
                           
    setOutput(prev => [...prev, {type: 'cmd', text: compilationCmd}]);

    setTimeout(() => {
      const mockResult: string[] = [
        "Сайн уу, Super Coder!",
        "Код бичих гоё байна!",
        "Код бичих гоё байна!",
        "Код бичих гоё байна!"
      ];
      
      setOutput(prev => [
        ...prev, 
        ...mockResult.map(r => ({type: 'out', text: r} as TerminalLine)),
        {type: 'success', text: `Process finished with exit code 0.`}
      ]);
      setIsRunning(false);
    }, 800);
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
        contents: `Sandbox горим. Хэл: ${activeLanguage}\nКод: \n${code}\nАсуулт: ${userMsg}`,
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
    <div className="flex flex-col h-full bg-[#1e1e1e] font-display overflow-hidden relative">
      <header className="h-20 bg-white dark:bg-[#111814] border-b border-slate-200 dark:border-white/10 flex items-center justify-between px-8 shrink-0 z-20 shadow-xl">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl">
            <span className="material-symbols-outlined text-slate-500">arrow_back</span>
          </button>
          <h2 className="text-xl font-black dark:text-white">Sandbox</h2>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            {['python', 'c', 'cpp'].map((lang) => (
               <button key={lang} onClick={() => handleLanguageChange(lang as any)} className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase ${activeLanguage === lang ? 'bg-primary text-slate-900 shadow-sm' : 'text-slate-500'}`}>{lang === 'cpp' ? 'C++' : lang.toUpperCase()}</button>
            ))}
          </div>
          
          <button onClick={() => setIsAiOpen(!isAiOpen)} className={`px-4 py-2 text-xs font-black rounded-xl border-2 ${isAiOpen ? 'bg-primary border-primary text-slate-900' : 'bg-white dark:bg-slate-900 border-primary/20 text-primary'}`}>AI Багш</button>

          <button onClick={runCode} disabled={isRunning} className="bg-primary text-slate-900 px-8 py-2.5 rounded-xl font-black text-xs uppercase shadow-xl shadow-primary/30">
            {isRunning ? 'Running...' : 'Ажиллуулах'}
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className={`flex flex-col bg-[#1e1e1e] border-r border-white/5 transition-all duration-300 relative prism-editor-container ${isAiOpen ? 'w-1/3' : 'w-2/3'}`}>
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
               value={code} 
               onChange={(e) => setCode(e.target.value)} 
               onScroll={handleScroll}
               onKeyDown={handleKeyDown}
               className="absolute inset-0 bg-transparent text-transparent caret-white outline-none border-none resize-none custom-scrollbar leading-[28px] overflow-auto z-10" 
               spellCheck={false} 
             />
           </div>
        </div>

        <div className={`flex flex-col bg-[#0c0c0c] transition-all duration-300 ${isAiOpen ? 'w-1/3' : 'w-1/3'}`}>
          <div className="px-6 py-2 bg-[#1a1a1a] text-[10px] font-black text-slate-500 uppercase">Terminal</div>
          <div className="flex-1 p-6 font-mono text-base overflow-y-auto custom-scrollbar bg-black/40 text-primary">
            {output.map((line, i) => (
              <div key={i} className={`flex gap-3 ${line.type === 'cmd' ? 'text-blue-400' : line.type === 'err' ? 'text-red-400' : line.type === 'success' ? 'text-green-400' : 'text-primary'}`}>
                 <span className="select-none text-slate-800">❯</span>
                 <span>{line.text}</span>
              </div>
            ))}
            <div ref={terminalEndRef} />
          </div>
        </div>

        {isAiOpen && (
          <div className="w-1/3 bg-white dark:bg-slate-900 border-l-4 border-primary/20 flex flex-col animate-in slide-in-from-right duration-300">
             <div className="p-4 border-b flex items-center justify-between font-black text-sm uppercase">AI Step Tutor <button onClick={() => setIsAiOpen(false)} className="material-symbols-outlined text-slate-400">close</button></div>
             <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`px-4 py-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-primary text-slate-900 font-bold' : 'bg-slate-100 dark:bg-slate-800'}`}>{msg.text}</div>
                  </div>
                ))}
             </div>
             <form onSubmit={(e) => { e.preventDefault(); askAi(); }} className="p-4 border-t flex gap-2">
                <input value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Асуух..." className="flex-1 bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-2 text-sm font-bold" />
                <button type="submit" className="bg-primary text-slate-900 size-10 rounded-xl flex items-center justify-center"><span className="material-symbols-outlined">send</span></button>
             </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sandbox;
