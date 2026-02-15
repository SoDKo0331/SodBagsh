
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
    <div className="flex flex-col h-screen bg-[#09090b] font-mono overflow-hidden relative">
      <header className="h-16 bg-[#09090b] border-b border-[#27272a] flex items-center justify-between px-6 shrink-0 z-20">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-[#a1a1aa] hover:text-white transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h2 className="text-sm font-bold text-white tracking-wide uppercase">Sandbox Environment</h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-[#18181b] p-1 rounded-lg border border-[#27272a]">
            {['python', 'c', 'cpp'].map((lang) => (
               <button key={lang} onClick={() => handleLanguageChange(lang as any)} className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase ${activeLanguage === lang ? 'bg-[#27272a] text-white shadow-sm' : 'text-[#71717a] hover:text-[#a1a1aa]'}`}>{lang === 'cpp' ? 'C++' : lang}</button>
            ))}
          </div>
          
          <button onClick={() => setIsAiOpen(!isAiOpen)} className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase transition-all flex items-center gap-2 ${isAiOpen ? 'bg-primary/10 border-primary text-primary' : 'bg-transparent border-[#27272a] text-[#a1a1aa]'}`}>
             <span className="material-symbols-outlined text-sm">smart_toy</span> AI Helper
          </button>

          <button onClick={runCode} disabled={isRunning} className="bg-primary text-primary-foreground px-4 py-1.5 rounded-lg font-bold text-[10px] uppercase hover:brightness-110 transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">play_arrow</span>
            {isRunning ? 'Running...' : 'Run'}
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className={`flex flex-col bg-[#09090b] border-r border-[#27272a] transition-all duration-300 relative prism-editor-container ${isAiOpen ? 'w-[60%]' : 'w-[70%]'}`}>
           <div className="flex-1 relative overflow-hidden">
             <div className="absolute left-0 top-0 bottom-0 w-12 bg-[#09090b] border-r border-[#27272a] text-[#52525b] text-right pr-3 py-4 select-none">
                {code.split('\n').map((_, i) => <div key={i} className="leading-[1.6]">{i+1}</div>)}
             </div>
             <pre 
               ref={highlightRef}
               aria-hidden="true"
               className="absolute inset-0 left-12 pointer-events-none custom-scrollbar overflow-auto p-4"
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
               className="absolute inset-0 left-12 bg-transparent text-transparent caret-white outline-none border-none resize-none custom-scrollbar leading-[1.6] overflow-auto z-10 p-4 font-mono text-sm" 
               spellCheck={false} 
             />
           </div>
        </div>

        <div className={`flex flex-col bg-[#0c0c0e] transition-all duration-300 ${isAiOpen ? 'w-[40%]' : 'w-[30%]'}`}>
          <div className="px-4 py-2 bg-[#18181b] border-b border-[#27272a] text-[10px] font-bold text-[#a1a1aa] uppercase tracking-wider flex justify-between">
              <span>Terminal Output</span>
              <span className="text-[#52525b]">Read-only</span>
          </div>
          <div className="flex-1 p-4 font-mono text-xs overflow-y-auto custom-scrollbar text-[#e4e4e7]">
            {output.map((line, i) => (
              <div key={i} className={`flex gap-2 mb-1 ${line.type === 'cmd' ? 'text-blue-400' : line.type === 'err' ? 'text-red-400' : line.type === 'success' ? 'text-green-400' : ''}`}>
                 <span className="select-none opacity-30">❯</span>
                 <span>{line.text}</span>
              </div>
            ))}
            {output.length === 0 && <span className="text-[#52525b] italic">Ready to execute.</span>}
            <div ref={terminalEndRef} />
          </div>
          
          {isAiOpen && (
            <div className="h-1/2 border-t border-[#27272a] bg-[#111] flex flex-col">
                 <div className="px-4 py-2 bg-[#18181b] border-b border-[#27272a] text-[10px] font-bold text-primary uppercase tracking-wider">AI Assistant</div>
                 <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                    {chatMessages.map((msg, i) => (
                      <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className={`px-3 py-2 rounded-lg text-xs ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-[#27272a] text-[#e4e4e7]'}`}>{msg.text}</div>
                      </div>
                    ))}
                 </div>
                 <form onSubmit={(e) => { e.preventDefault(); askAi(); }} className="p-3 border-t border-[#27272a] flex gap-2">
                    <input value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Type a message..." className="flex-1 bg-[#18181b] border-none rounded text-xs text-white px-3 py-2 focus:ring-1 focus:ring-primary" />
                    <button type="submit" className="bg-primary text-primary-foreground rounded px-3 py-2 text-xs font-bold uppercase">Send</button>
                 </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sandbox;
