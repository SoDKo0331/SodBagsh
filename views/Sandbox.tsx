
import React, { useState } from 'react';

interface SandboxProps {
  onBack: () => void;
}

const Sandbox: React.FC<SandboxProps> = ({ onBack }) => {
  const [code, setCode] = useState("name = 'Super Coder'\nprint('Hello ' + name + '!')\n\nfor i in range(5):\n    print('Code is fun!')");
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runCode = () => {
    setIsRunning(true);
    setOutput(prev => [...prev, "$ python main.py"]);
    
    // Simple simulation of Python execution
    setTimeout(() => {
      const lines = code.split('\n');
      const mockResult: string[] = [];
      
      lines.forEach(line => {
        if (line.includes('print')) {
          const match = line.match(/print\(['"](.+)['"]\)/);
          if (match) mockResult.push(match[1]);
          else if (line.includes('name')) mockResult.push('Hello Super Coder!');
          else if (line.includes('Code is fun!')) {
             for(let i=0; i<5; i++) mockResult.push('Code is fun!');
          }
        }
      });

      if (mockResult.length === 0) mockResult.push("(Code ran successfully, but no output printed)");
      
      setOutput(prev => [...prev, ...mockResult]);
      setIsRunning(false);
    }, 800);
  };

  const clearOutput = () => setOutput([]);

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] font-display">
      <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
            <span className="material-symbols-outlined text-slate-500">arrow_back</span>
          </button>
          <div className="size-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined font-black">extension</span>
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">Creative Sandbox</h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Free Play Mode</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={clearOutput}
            className="px-4 py-2 text-xs font-black text-slate-500 uppercase tracking-widest hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Clear Terminal
          </button>
          <button 
            onClick={runCode}
            disabled={isRunning}
            className="bg-primary text-slate-900 px-6 py-2.5 rounded-xl font-black shadow-lg shadow-primary/20 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all uppercase tracking-widest text-xs disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-lg">{isRunning ? 'sync' : 'play_arrow'}</span>
            {isRunning ? 'Running...' : 'Run Code'}
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Editor Area */}
        <div className="flex-1 flex flex-col bg-[#1e1e1e] border-r border-white/5">
           <div className="px-6 py-2 bg-[#2d2d2d] flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Main Script</span>
              <span className="text-[10px] text-slate-500 font-mono">python 3.x</span>
           </div>
           <textarea 
             value={code}
             onChange={(e) => setCode(e.target.value)}
             className="flex-1 w-full bg-[#1e1e1e] p-8 font-mono text-lg text-white border-none focus:ring-0 resize-none custom-scrollbar"
             spellCheck={false}
           />
        </div>

        {/* Terminal Area */}
        <div className="w-1/3 flex flex-col bg-[#0c0c0c]">
          <div className="px-6 py-2 bg-[#1a1a1a] border-b border-white/5">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Terminal</span>
          </div>
          <div className="flex-1 p-6 font-mono text-sm text-primary overflow-y-auto custom-scrollbar">
            {output.length === 0 ? (
              <div className="text-slate-800 italic">Program output will appear here...</div>
            ) : (
              output.map((line, i) => (
                <div key={i} className={`flex gap-3 ${line.startsWith('$') ? 'text-slate-500' : 'animate-in slide-in-from-left duration-200'}`}>
                   <span className="select-none text-slate-700">{line.startsWith('$') ? '' : '>'}</span>
                   <span className="whitespace-pre-wrap">{line}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      
      <div className="h-10 bg-primary/5 flex items-center px-8 border-t border-primary/10">
         <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-primary animate-pulse"></div>
            <span className="text-[10px] font-black text-primary uppercase tracking-widest">Cloud Runner Ready</span>
         </div>
      </div>
    </div>
  );
};

export default Sandbox;
