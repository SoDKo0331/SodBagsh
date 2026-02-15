
import React, { useState, useRef, useEffect } from 'react';
import { Problem } from '../types';
import { GoogleGenAI } from "@google/genai";

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
    { role: 'model', text: `Hi! I'm your Code Wizard. Need a hint for '${problem.title}'?` }
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
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Act as an extremely strict and precise Code Judge. 
    Problem: "${problem.title}"
    Description: ${problem.description}
    Target Output: Exactly "${problem.expectedOutput}" (trimmed).
    Language: ${lang}
    User Submission:
    ---
    ${userCode}
    ---
    Respond ONLY in JSON: { "success": boolean, "output": "string", "feedback": "string", "hint": "string" }`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: { responseMimeType: "application/json", thinkingConfig: { thinkingBudget: 0 } }
      });
      return JSON.parse(response.text || "{}");
    } catch (e) {
      return { success: false, output: "Error", feedback: "System Error", hint: "Connection check failed." };
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
        {type: 'success', text: `✓ PASSED: ${result.feedback}`}
      ]);
      setTimeout(() => {
        if (confirm("Great job! Problem solved. Save progress?")) {
          onSolve(problem.id);
          onBack();
        }
      }, 500);
    } else {
      setTerminalOutput(prev => [
        ...prev, 
        {type: 'err', text: `✗ FAILED: ${result.output || 'Output mismatch'}`},
        {type: 'hint', text: `HINT: ${result.hint}`}
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
        contents: `Problem: ${problem.title}\nCode: ${code}\nQuestion: ${userMsg}`,
        config: { thinkingConfig: { thinkingBudget: 0 } }
      });
      setChatMessages(prev => [...prev, { role: 'model', text: response.text || "" }]);
    } catch (e) {
       setChatMessages(prev => [...prev, { role: 'model', text: "Error connecting to AI." }]);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#09090b] overflow-hidden font-sans">
      <header className="h-16 bg-[#09090b] border-b border-[#27272a] flex items-center justify-between px-6 shrink-0 z-20">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-[#a1a1aa] hover:text-white transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h2 className="font-bold text-white text-sm">{problem.title}</h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden lg:flex bg-[#18181b] p-1 rounded-lg border border-[#27272a]">
            {['python', 'c', 'cpp'].map((lang) => (
              <button key={lang} onClick={() => setActiveLanguage(lang as any)} className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase transition-all ${activeLanguage === lang ? 'bg-[#27272a] text-white shadow-sm' : 'text-[#71717a]'}`}>{lang}</button>
            ))}
          </div>
          <button onClick={() => setIsAiOpen(!isAiOpen)} className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase transition-all flex items-center gap-2 ${isAiOpen ? 'bg-primary/10 border-primary text-primary' : 'border-[#27272a] text-[#a1a1aa]'}`}>
             <span className="material-symbols-outlined text-sm">smart_toy</span>
             <span>Tutor</span>
          </button>
          <button onClick={handleRun} disabled={isRunning} className="bg-primary text-primary-foreground px-4 py-1.5 rounded-lg font-bold text-[10px] uppercase hover:brightness-110 transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">send</span>
            {isRunning ? 'Checking...' : 'Submit'}
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Problem Description Panel */}
        <div className="w-[350px] bg-card border-r border-border overflow-y-auto p-6 custom-scrollbar shrink-0">
          <h3 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-4">Problem Statement</h3>
          <p className="text-sm font-medium leading-relaxed text-foreground mb-8">{problem.description}</p>
          
          <div className="space-y-6">
            <div className="bg-muted/50 rounded-xl p-4 border border-border">
              <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Examples</h4>
              <div className="space-y-3">
                {problem.examples.map((ex, i) => (
                  <div key={i} className="font-mono text-xs text-foreground">
                    <div className="mb-1 text-muted-foreground">Input: <span className="text-foreground bg-muted px-1.5 rounded">{ex.input}</span></div>
                    <div>Output: <span className="text-primary font-bold">{ex.output}</span></div>
                    {i < problem.examples.length - 1 && <div className="h-px bg-border my-3"></div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Code Editor & Terminal Panel */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          <div className={`flex flex-col h-full bg-[#09090b] transition-all duration-300 relative`}>
             <div className="flex-1 flex overflow-hidden font-mono text-sm relative">
                <div ref={lineNumbersRef} className="w-12 bg-[#09090b] text-[#52525b] py-6 text-right pr-4 select-none border-r border-[#27272a]">
                  {lineNumbers.map(n => <div key={n} className="h-[20px] leading-[20px]">{n}</div>)}
                </div>
                <textarea 
                  ref={editorRef}
                  value={code} 
                  onChange={(e) => setCode(e.target.value)} 
                  onScroll={handleScroll}
                  className="flex-1 bg-transparent p-6 font-mono text-[#e4e4e7] leading-[20px] resize-none outline-none custom-scrollbar" 
                  spellCheck={false} 
                  placeholder="// Write your solution here..." 
                />
             </div>

             <div className="h-[30%] bg-[#0c0c0e] border-t border-[#27272a] flex flex-col">
                <div className="px-4 py-2 bg-[#18181b] border-b border-[#27272a] flex justify-between items-center text-[10px] font-bold text-[#a1a1aa] uppercase tracking-wider">
                   <span>Console Output</span>
                   {isRunning && <span className="text-primary">Processing...</span>}
                </div>
                <div className="flex-1 p-4 font-mono text-xs overflow-y-auto custom-scrollbar">
                   {terminalOutput.map((l, i) => (
                      <div key={i} className={`flex gap-2 mb-1 ${
                        l.type === 'err' ? 'text-red-400' : 
                        l.type === 'success' ? 'text-green-400 font-bold' : 
                        l.type === 'hint' ? 'text-yellow-400 italic' :
                        l.type === 'info' ? 'text-blue-400' : 
                        'text-[#e4e4e7]'
                      }`}>
                         <span className="select-none opacity-30">❯</span>
                         <span>{l.text}</span>
                      </div>
                   ))}
                   <div ref={terminalEndRef} />
                </div>
             </div>
          </div>

          {/* AI Tutor Slide-in */}
          {isAiOpen && (
            <div className="absolute top-0 right-0 h-full w-[350px] bg-[#111] border-l border-[#27272a] flex flex-col shadow-2xl z-30">
               <div className="p-4 border-b border-[#27272a] flex items-center justify-between bg-[#18181b]">
                  <div className="flex items-center gap-2">
                     <span className="material-symbols-outlined text-primary text-sm">smart_toy</span>
                     <h4 className="font-bold text-xs uppercase text-white tracking-wider">Wizard Helper</h4>
                  </div>
                  <button onClick={() => setIsAiOpen(false)} className="material-symbols-outlined text-[#71717a] text-sm">close</button>
               </div>
               <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                  {chatMessages.map((m, i) => (
                    <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                       <div className={`px-3 py-2.5 rounded-lg text-xs max-w-[90%] ${
                         m.role === 'user' 
                          ? 'bg-primary text-primary-foreground font-bold' 
                          : 'bg-[#27272a] text-[#e4e4e7]'
                        }`}>
                         {m.text}
                       </div>
                    </div>
                  ))}
               </div>
               <form onSubmit={(e) => { e.preventDefault(); askAi(); }} className="p-3 border-t border-[#27272a] flex gap-2 bg-[#18181b]">
                  <input value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Ask a question..." className="flex-1 bg-[#09090b] border border-[#27272a] rounded text-xs text-white px-3 py-2 focus:border-primary outline-none" />
                  <button type="submit" disabled={isAiLoading || !chatInput.trim()} className="bg-primary text-primary-foreground rounded px-3 py-2 flex items-center justify-center"><span className="material-symbols-outlined text-sm">send</span></button>
               </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemSolvingView;
