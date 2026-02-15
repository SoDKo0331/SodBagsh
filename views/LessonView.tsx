
import React, { useState, useRef, useEffect, useMemo } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import { LESSON_DATA } from '../data/lessons';
import { StepContent, CodingTask } from '../types';
import { AiService, GradeResult } from '../services/AiService';

interface LessonViewProps {
  onExit: (completed?: boolean) => void;
  moduleId: string | null;
  initialLanguage: 'python' | 'c' | 'cpp';
  // Add missing onLanguageChange prop to fix App.tsx error
  onLanguageChange: (lang: 'python' | 'c' | 'cpp') => void;
}

const LessonView: React.FC<LessonViewProps> = ({ onExit, moduleId, initialLanguage, onLanguageChange }) => {
  const lesson = moduleId ? LESSON_DATA[moduleId] : null;
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [activeLanguage, setActiveLanguage] = useState(initialLanguage);
  const [userCode, setUserCode] = useState('');
  const [isTaskCompleted, setIsTaskCompleted] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState<any[]>([]);
  const [inspectedVars, setInspectedVars] = useState<GradeResult['variables']>([]);
  const [bottomTab, setBottomTab] = useState<'output' | 'debugger'>('output');
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const editorRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLPreElement>(null);

  const step = lesson?.steps[currentStepIdx];
  const currentTask = useMemo(() => 
    step?.codingTasks?.find(t => t.language === activeLanguage) || step?.codingTasks?.[0]
  , [step, activeLanguage]);

  useEffect(() => {
    if (currentTask) {
      setUserCode(currentTask.template);
      setTerminalOutput([]);
      setInspectedVars([]);
      setIsTaskCompleted(false);
      // Sync language selection if the task forces a specific language fallback
      if (currentTask.language !== activeLanguage) {
        setActiveLanguage(currentTask.language);
        onLanguageChange(currentTask.language);
      }
    }
  }, [currentStepIdx, currentTask, activeLanguage, onLanguageChange]);

  const handleScroll = () => {
    if (editorRef.current && lineNumbersRef.current && highlightRef.current) {
      lineNumbersRef.current.scrollTop = editorRef.current.scrollTop;
      highlightRef.current.scrollTop = editorRef.current.scrollTop;
      highlightRef.current.scrollLeft = editorRef.current.scrollLeft;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = editorRef.current!.selectionStart;
      const end = editorRef.current!.selectionEnd;
      const val = editorRef.current!.value;
      setUserCode(val.substring(0, start) + "    " + val.substring(end));
      setTimeout(() => {
        editorRef.current!.selectionStart = editorRef.current!.selectionEnd = start + 4;
      }, 0);
    }
    // Auto-indent logic
    if (e.key === 'Enter') {
      e.preventDefault();
      const cursor = editorRef.current!.selectionStart;
      const val = editorRef.current!.value;
      const lineStart = val.lastIndexOf('\n', cursor - 1) + 1;
      const currentLine = val.substring(lineStart, cursor);
      const indent = currentLine.match(/^\s*/)?.[0] || "";
      const extraIndent = (currentLine.trim().endsWith(':') || currentLine.trim().endsWith('{')) ? "    " : "";
      const insertion = "\n" + indent + extraIndent;
      setUserCode(val.substring(0, cursor) + insertion + val.substring(cursor));
      setTimeout(() => {
        editorRef.current!.selectionStart = editorRef.current!.selectionEnd = cursor + insertion.length;
      }, 0);
    }
  };

  const highlightedHtml = useMemo(() => {
    const lang = activeLanguage === 'cpp' ? 'cpp' : activeLanguage === 'c' ? 'c' : 'python';
    return Prism.highlight(userCode, Prism.languages[lang], lang);
  }, [userCode, activeLanguage]);

  const runCode = async () => {
    if (!currentTask || isRunning) return;
    setIsRunning(true);
    setTerminalOutput([{ type: 'info', text: 'Grading submission...' }]);
    
    try {
      const result = await AiService.gradeSubmission(userCode, activeLanguage, currentTask.expectedOutput);
      setTerminalOutput(prev => [
        ...prev,
        { type: result.success ? 'success' : 'err', text: result.output || 'No output' },
        { type: 'hint', text: result.success ? result.feedback : result.hint }
      ]);
      setInspectedVars(result.variables);
      if (result.success) setIsTaskCompleted(true);
    } catch (err) {
      setTerminalOutput(prev => [...prev, { type: 'err', text: 'Evaluation Service Offline' }]);
    } finally {
      setIsRunning(false);
    }
  };

  const askAi = async () => {
    if (!chatInput.trim() || isAiLoading) return;
    const msg = chatInput;
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', text: msg }]);
    setIsAiLoading(true);
    const reply = await AiService.askTutor(msg, userCode, step?.title || "");
    setChatMessages(prev => [...prev, { role: 'model', text: reply }]);
    setIsAiLoading(false);
  };

  if (!lesson || !step) return null;

  return (
    <div className="flex h-screen flex-col bg-background-dark font-display text-slate-100 overflow-hidden">
      {/* Header */}
      <header className="h-16 flex items-center justify-between px-6 border-b border-white/5 bg-[#0d1410] z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => onExit()} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
            <span className="material-symbols-outlined text-slate-400">arrow_back</span>
          </button>
          <div className="hidden md:block">
            <h1 className="text-sm font-black tracking-tight">{lesson.title}</h1>
            <p className="text-[10px] text-primary font-black uppercase tracking-widest">{currentStepIdx + 1} / {lesson.steps.length} Алхам</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setIsAiOpen(!isAiOpen)} className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${isAiOpen ? 'bg-primary text-slate-900' : 'bg-white/5 text-primary'}`}>AI Mentor</button>
          <button onClick={() => onExit()} className="px-4 py-2 bg-white/5 hover:bg-red-500/10 hover:text-red-500 rounded-xl text-xs font-black transition-all">Гарах</button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Content Panel */}
        <section className="w-1/3 border-r border-white/5 bg-[#0d1410] flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            <h2 className="text-2xl font-black mb-6 tracking-tight">{step.title}</h2>
            <p className="text-slate-400 leading-relaxed mb-10">{step.body}</p>

            {step.type === 'quiz' && (
              <div className="space-y-3">
                {step.quiz?.options.map(opt => (
                  <button key={opt.id} onClick={() => setIsTaskCompleted(opt.isCorrect)} className="w-full p-4 rounded-2xl bg-white/5 border-2 border-transparent hover:border-primary/50 text-left transition-all font-bold">
                    {opt.text}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="p-6 border-t border-white/5 bg-black/20 flex justify-between items-center">
             <button disabled={currentStepIdx === 0} onClick={() => setCurrentStepIdx(prev => prev - 1)} className="text-xs font-black uppercase text-slate-500 disabled:opacity-0">Буцах</button>
             {isTaskCompleted && (
               <button onClick={() => {
                 if (currentStepIdx < lesson.steps.length - 1) {
                   setCurrentStepIdx(v => v + 1);
                   setIsTaskCompleted(false);
                 } else {
                   onExit(true);
                 }
               }} className="px-8 py-3 bg-primary text-slate-900 rounded-xl font-black text-xs uppercase shadow-lg shadow-primary/20 animate-in zoom-in duration-300">
                 {currentStepIdx === lesson.steps.length - 1 ? 'Дуусгах' : 'Дараах'}
               </button>
             )}
          </div>
        </section>

        {/* IDE Panel */}
        <section className="flex-1 flex flex-col bg-black relative">
          {step.type === 'coding' ? (
            <>
              <div className="h-10 bg-[#1a1a1a] border-b border-white/5 flex items-center justify-between px-4">
                <div className="flex items-center gap-2">
                   <div className="flex gap-1 bg-black/40 p-1 rounded-lg">
                     {['python', 'c', 'cpp'].map(l => (
                       <button 
                         key={l} 
                         onClick={() => {
                           setActiveLanguage(l as any);
                           onLanguageChange(l as any); // Update global preferred language
                         }} 
                         className={`px-3 py-1 rounded-md text-[9px] font-black uppercase transition-all ${activeLanguage === l ? 'bg-primary text-slate-900' : 'text-slate-500'}`}
                       >
                         {l}
                       </button>
                     ))}
                   </div>
                </div>
                <span className="text-[10px] font-mono text-slate-600">main.{activeLanguage === 'python' ? 'py' : activeLanguage}</span>
              </div>
              
              <div className="flex-1 flex overflow-hidden prism-editor-container">
                <div ref={lineNumbersRef} className="w-12 bg-[#0d0d0d] text-[#2a2a2a] py-8 text-right pr-4 select-none font-mono text-sm border-r border-white/5 overflow-hidden">
                  {Array.from({length: 100}).map((_, i) => <div key={i} className="h-[25.6px] leading-[25.6px]">{i+1}</div>)}
                </div>
                <div className="flex-1 relative overflow-hidden">
                  <pre ref={highlightRef} className="absolute inset-0 m-0 p-8 pointer-events-none custom-scrollbar overflow-auto leading-[25.6px]">
                    <code className={`language-${activeLanguage}`} dangerouslySetInnerHTML={{ __html: highlightedHtml + '\n' }} />
                  </pre>
                  <textarea 
                    ref={editorRef}
                    value={userCode} 
                    onChange={(e) => setUserCode(e.target.value)} 
                    onScroll={handleScroll}
                    onKeyDown={handleKeyDown}
                    className="absolute inset-0 bg-transparent text-transparent caret-white outline-none border-none p-8 resize-none font-mono text-base leading-[25.6px] custom-scrollbar overflow-auto z-10" 
                    spellCheck={false} 
                  />
                </div>
              </div>

              {/* Bottom Console */}
              <div className="h-[35%] bg-[#080808] border-t border-white/5 flex flex-col">
                <div className="flex items-center justify-between px-6 py-2 bg-[#111] border-b border-white/5">
                   <div className="flex gap-4">
                      <button onClick={() => setBottomTab('output')} className={`text-[10px] font-black uppercase transition-colors ${bottomTab === 'output' ? 'text-primary' : 'text-slate-500'}`}>Terminal</button>
                      <button onClick={() => setBottomTab('debugger')} className={`text-[10px] font-black uppercase transition-colors ${bottomTab === 'debugger' ? 'text-primary' : 'text-slate-500'}`}>Memory</button>
                   </div>
                   <button onClick={runCode} disabled={isRunning} className="px-6 py-1.5 bg-primary text-slate-900 rounded-lg text-[10px] font-black uppercase shadow-lg disabled:opacity-50">Шалгах</button>
                </div>
                <div className="flex-1 p-6 font-mono text-sm overflow-y-auto custom-scrollbar">
                  {bottomTab === 'output' ? (
                    terminalOutput.map((l, i) => (
                      <div key={i} className={`mb-1.5 ${l.type === 'err' ? 'text-red-400' : l.type === 'success' ? 'text-primary' : l.type === 'hint' ? 'text-yellow-200 opacity-60 italic' : 'text-slate-300'}`}>
                        {l.text}
                      </div>
                    ))
                  ) : (
                    <table className="w-full text-left text-xs opacity-80">
                      <thead><tr className="text-slate-500 border-b border-white/5"><th className="pb-2">Variable</th><th className="pb-2">Value</th><th className="pb-2">Type</th></tr></thead>
                      <tbody>
                        {inspectedVars.map((v, i) => (
                          <tr key={i} className="border-b border-white/5"><td className="py-2 text-primary">{v.name}</td><td className="py-2">{v.value}</td><td className="py-2 text-slate-500">{v.type}</td></tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center opacity-20">
              <span className="material-symbols-outlined text-[120px]">auto_awesome</span>
              <p className="font-black uppercase tracking-widest text-sm mt-4">Visual Lesson Mode</p>
            </div>
          )}
        </section>

        {/* AI Tutor Panel */}
        {isAiOpen && (
          <div className="w-[350px] bg-slate-900 border-l border-white/5 flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-4 border-b border-white/5 flex justify-between items-center bg-black/20">
              <h4 className="text-[10px] font-black uppercase text-slate-500">AI Tutor</h4>
              <button onClick={() => setIsAiOpen(false)} className="material-symbols-outlined text-sm text-slate-500">close</button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {chatMessages.map((m, i) => (
                <div key={i} className={`p-3 rounded-xl text-xs leading-relaxed ${m.role === 'user' ? 'bg-primary/10 text-primary self-end' : 'bg-white/5 text-slate-300'}`}>
                  {m.text}
                </div>
              ))}
              {isAiLoading && <div className="text-[10px] text-slate-600 animate-pulse font-bold uppercase">Thinking...</div>}
            </div>
            <form onSubmit={(e) => {e.preventDefault(); askAi();}} className="p-4 border-t border-white/5 flex gap-2">
              <input value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Асуух..." className="flex-1 bg-white/5 border-none rounded-lg px-4 py-2 text-xs focus:ring-1 ring-primary" />
              <button className="p-2 bg-primary text-slate-900 rounded-lg material-symbols-outlined text-sm">send</button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default LessonView;
