
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
  onLanguageChange: (lang: 'python' | 'c' | 'cpp') => void;
}

const LessonView: React.FC<LessonViewProps> = ({ onExit, moduleId, initialLanguage, onLanguageChange }) => {
  const lesson = moduleId ? LESSON_DATA[moduleId] : null;
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [activeLanguage, setActiveLanguage] = useState(initialLanguage);
  const [userCode, setUserCode] = useState('');
  const [isTaskCompleted, setIsTaskCompleted] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState<{type: string, text: string}[]>([]);
  const [bottomTab, setBottomTab] = useState<'output' | 'ai'>('output');
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
      setIsTaskCompleted(false);
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
    setTerminalOutput([{ type: 'info', text: 'Compiling and analyzing...' }]);
    setBottomTab('output');
    
    try {
      const result = await AiService.gradeSubmission(userCode, activeLanguage, currentTask.expectedOutput);
      setTerminalOutput(prev => [
        ...prev,
        { type: result.success ? 'success' : 'err', text: result.output || 'No output captured' },
        { type: 'hint', text: result.success ? result.feedback : result.hint }
      ]);
      if (result.success) setIsTaskCompleted(true);
    } catch (err) {
      setTerminalOutput(prev => [...prev, { type: 'err', text: 'Evaluation Service Unavailable' }]);
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
    <div className="flex h-screen flex-col bg-background text-foreground overflow-hidden font-sans">
      {/* Top Header */}
      <header className="h-14 flex items-center justify-between px-4 border-b border-border bg-background z-50 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => onExit()} className="size-8 flex items-center justify-center hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground">
            <span className="material-symbols-outlined text-lg">arrow_back</span>
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-semibold tracking-tight text-foreground">{lesson.title}</h1>
            <span className="text-muted-foreground">/</span>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Step {currentStepIdx + 1} of {lesson.steps.length}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-muted/50 border border-border">
                <span className="size-2 rounded-full bg-primary animate-pulse"></span>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Live Session</span>
            </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Left Panel: Content */}
        <section className="w-[400px] border-r border-border bg-card flex flex-col overflow-hidden shrink-0">
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            <div className="mb-6">
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-2 py-1 rounded-sm border border-primary/20">
                    {step.type}
                </span>
            </div>
            
            <h2 className="text-2xl font-bold mb-4 leading-tight text-foreground">{step.title}</h2>
            <div className="text-sm text-muted-foreground leading-relaxed space-y-4 font-medium">
                {step.body.split('\n').map((line, i) => <p key={i}>{line}</p>)}
            </div>

            {step.type === 'quiz' && step.quiz && (
              <div className="space-y-3 mt-8">
                {step.quiz.options.map(opt => (
                  <button 
                    key={opt.id} 
                    onClick={() => setIsTaskCompleted(opt.isCorrect)} 
                    className={`w-full p-4 rounded-xl border text-left transition-all text-sm font-medium ${
                        isTaskCompleted && opt.isCorrect 
                        ? 'bg-primary/10 border-primary text-primary' 
                        : 'bg-muted/50 border-border hover:border-primary/50 text-foreground'
                    }`}
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="p-4 border-t border-border bg-background flex justify-between items-center gap-4">
             <button 
                disabled={currentStepIdx === 0} 
                onClick={() => setCurrentStepIdx(prev => prev - 1)} 
                className="px-4 py-2 text-xs font-bold uppercase text-muted-foreground hover:text-foreground disabled:opacity-30"
             >
                Previous
             </button>
             
             {isTaskCompleted ? (
               <button 
                onClick={() => {
                 if (currentStepIdx < lesson.steps.length - 1) {
                   setCurrentStepIdx(v => v + 1);
                   setIsTaskCompleted(false);
                 } else {
                   onExit(true);
                 }
                }} 
                className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg font-bold text-xs uppercase shadow-md hover:brightness-110 transition-all"
               >
                 {currentStepIdx === lesson.steps.length - 1 ? 'Finish Lesson' : 'Next Step'}
               </button>
             ) : (
                <div className="flex-1 text-center text-xs font-medium text-muted-foreground italic">
                    Complete task to continue
                </div>
             )}
          </div>
        </section>

        {/* Right Panel: IDE */}
        <section className="flex-1 flex flex-col bg-[#09090b] relative">
          {step.type === 'coding' ? (
            <>
              {/* Editor Tabs */}
              <div className="h-10 bg-[#18181b] border-b border-[#27272a] flex items-center justify-between px-4">
                <div className="flex items-center gap-1 mt-2">
                   {['python', 'c', 'cpp'].map(l => (
                       <button 
                         key={l} 
                         onClick={() => {
                           setActiveLanguage(l as any);
                           onLanguageChange(l as any);
                         }} 
                         className={`px-4 py-2 rounded-t-md text-[10px] font-bold uppercase border-t border-x ${
                            activeLanguage === l 
                            ? 'bg-[#09090b] border-[#27272a] border-b-[#09090b] text-white' 
                            : 'bg-transparent border-transparent text-[#71717a] hover:text-white'
                         }`}
                       >
                         {l}
                       </button>
                   ))}
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={runCode} disabled={isRunning} className="flex items-center gap-2 px-3 py-1 bg-primary text-primary-foreground rounded text-[10px] font-bold uppercase hover:brightness-110 transition-all disabled:opacity-50">
                        <span className="material-symbols-outlined text-[14px]">play_arrow</span>
                        Run Code
                    </button>
                </div>
              </div>
              
              {/* Code Area */}
              <div className="flex-1 flex overflow-hidden prism-editor-container bg-[#09090b]">
                <div ref={lineNumbersRef} className="w-12 bg-[#09090b] text-[#52525b] py-6 text-right pr-4 select-none font-mono text-sm border-r border-[#27272a]">
                  {Array.from({length: 100}).map((_, i) => <div key={i} className="h-[1.6em]">{i+1}</div>)}
                </div>
                <div className="flex-1 relative overflow-hidden">
                  <pre ref={highlightRef} className="absolute inset-0 m-0 pointer-events-none custom-scrollbar overflow-auto">
                    <code className={`language-${activeLanguage}`} dangerouslySetInnerHTML={{ __html: highlightedHtml + '\n' }} />
                  </pre>
                  <textarea 
                    ref={editorRef}
                    value={userCode} 
                    onChange={(e) => setUserCode(e.target.value)} 
                    onScroll={handleScroll}
                    onKeyDown={handleKeyDown}
                    className="absolute inset-0 bg-transparent text-transparent caret-white outline-none border-none resize-none font-mono text-sm custom-scrollbar overflow-auto z-10 p-6" 
                    spellCheck={false} 
                  />
                </div>
              </div>

              {/* Terminal / AI Panel */}
              <div className="h-[35%] bg-[#0c0c0e] border-t border-[#27272a] flex flex-col">
                <div className="flex items-center gap-4 px-4 py-2 border-b border-[#27272a] bg-[#18181b]">
                    <button 
                        onClick={() => setBottomTab('output')} 
                        className={`text-xs font-semibold uppercase tracking-wider flex items-center gap-2 ${bottomTab === 'output' ? 'text-white' : 'text-[#71717a]'}`}
                    >
                        <span className="material-symbols-outlined text-sm">terminal</span> Terminal
                    </button>
                    <button 
                        onClick={() => setBottomTab('ai')} 
                        className={`text-xs font-semibold uppercase tracking-wider flex items-center gap-2 ${bottomTab === 'ai' ? 'text-primary' : 'text-[#71717a]'}`}
                    >
                        <span className="material-symbols-outlined text-sm">smart_toy</span> AI Tutor
                    </button>
                </div>
                
                <div className="flex-1 overflow-hidden relative">
                    {bottomTab === 'output' && (
                        <div className="absolute inset-0 p-4 font-mono text-xs overflow-y-auto custom-scrollbar text-[#e4e4e7] space-y-1">
                            {terminalOutput.map((l, i) => (
                                <div key={i} className={`flex gap-2 ${l.type === 'err' ? 'text-red-400' : l.type === 'success' ? 'text-green-400' : l.type === 'hint' ? 'text-yellow-400 italic' : l.type === 'info' ? 'text-blue-400' : ''}`}>
                                    <span className="select-none opacity-30">➜</span>
                                    <span>{l.text}</span>
                                </div>
                            ))}
                            {terminalOutput.length === 0 && <span className="text-[#52525b]">No output yet. Run your code to see results.</span>}
                        </div>
                    )}

                    {bottomTab === 'ai' && (
                        <div className="absolute inset-0 flex flex-col bg-[#111]">
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                                {chatMessages.map((m, i) => (
                                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[80%] rounded-lg p-3 text-xs ${m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-[#27272a] text-[#e4e4e7]'}`}>
                                            {m.text}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <form onSubmit={(e) => { e.preventDefault(); askAi(); }} className="p-3 border-t border-[#27272a] flex gap-2">
                                <input 
                                    value={chatInput} 
                                    onChange={e => setChatInput(e.target.value)} 
                                    className="flex-1 bg-[#18181b] border-none rounded text-xs text-white px-3 py-2 focus:ring-1 focus:ring-primary"
                                    placeholder="Ask for a hint..." 
                                />
                                <button type="submit" className="bg-primary text-primary-foreground rounded px-3 py-2 text-xs font-bold uppercase">Send</button>
                            </form>
                        </div>
                    )}
                </div>
              </div>
            </>
          ) : (
             <div className="flex-1 flex items-center justify-center bg-muted/20">
                <div className="text-center">
                    <span className="material-symbols-outlined text-6xl text-muted-foreground/30 mb-4">school</span>
                    <p className="text-muted-foreground font-medium">Interactive Concept Step</p>
                </div>
             </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default LessonView;
