import React, { useState } from 'react';
import { PROBLEMS } from '../data/problems';
import { Problem, Difficulty } from '../types';

interface ProblemBankProps {
  onSelectProblem: (problemId: string) => void;
  solvedProblems: string[];
}

const ProblemBank: React.FC<ProblemBankProps> = ({ onSelectProblem, solvedProblems }) => {
  const [filter, setFilter] = useState<Difficulty | 'all'>('all');

  const filteredProblems = filter === 'all' 
    ? PROBLEMS 
    : PROBLEMS.filter(p => p.difficulty === filter);

  const getDifficultyColor = (diff: Difficulty) => {
    switch (diff) {
      case 'easy': return 'text-primary bg-primary/10';
      case 'medium': return 'text-yellow-600 bg-yellow-500/10';
      case 'hard': return 'text-red-600 bg-red-500/10';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-10 bg-[#f8faf9] dark:bg-[#0d1a13]">
      <header className="mb-12">
        <h1 className="text-4xl font-black tracking-tighter mb-4 text-slate-950 dark:text-white">Бодлогын сан 🧩</h1>
        <p className="text-slate-950 dark:text-slate-400 font-bold uppercase tracking-widest text-sm">Өөрийгөө сорьж, кодын ур чадвараа ахиул.</p>
      </header>

      <div className="flex gap-4 mb-10">
        {['all', 'easy', 'medium', 'hard'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              filter === f 
                ? 'bg-primary text-slate-900 shadow-lg' 
                : 'bg-white dark:bg-slate-900 text-slate-950 dark:text-slate-400 hover:text-slate-800 border border-slate-200 dark:border-slate-800 shadow-sm'
            }`}
          >
            {f === 'all' ? 'Бүгд' : f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProblems.map((problem) => (
          <div 
            key={problem.id}
            className="group bg-white dark:bg-slate-900 p-8 rounded-[32px] border-2 border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all cursor-pointer flex flex-col"
            onClick={() => onSelectProblem(problem.id)}
          >
            <div className="flex items-center justify-between mb-6">
              <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${getDifficultyColor(problem.difficulty)}`}>
                {problem.difficulty}
              </span>
              {solvedProblems.includes(problem.id) && (
                <span className="material-symbols-outlined text-primary font-black">check_circle</span>
              )}
            </div>
            
            <h3 className="text-xl font-black mb-3 text-slate-950 dark:text-white group-hover:text-primary transition-colors">{problem.title}</h3>
            <p className="text-sm text-slate-950 dark:text-slate-400 font-medium mb-8 line-clamp-2">{problem.description}</p>
            
            <div className="mt-auto flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-950 uppercase tracking-widest">{problem.category}</span>
              <button className="bg-slate-50 dark:bg-slate-800 p-2 rounded-xl text-slate-400 group-hover:bg-primary group-hover:text-slate-900 transition-all">
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProblemBank;