
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
      case 'easy': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'medium': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'hard': return 'text-red-500 bg-red-500/10 border-red-500/20';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-background p-10 custom-scrollbar">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Practice Problems</h1>
          <p className="text-muted-foreground font-medium">Challenge yourself with algorithmic puzzles and improve your logic.</p>
        </header>

        <div className="flex gap-3 mb-10 overflow-x-auto pb-2">
          {['all', 'easy', 'medium', 'hard'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition-all border ${
                filter === f 
                  ? 'bg-primary text-primary-foreground border-primary shadow-sm' 
                  : 'bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground'
              }`}
            >
              {f === 'all' ? 'All Problems' : f}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProblems.map((problem) => (
            <div 
              key={problem.id}
              onClick={() => onSelectProblem(problem.id)}
              className="group bg-card p-6 rounded-2xl border border-border hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all cursor-pointer flex flex-col h-full"
            >
              <div className="flex items-center justify-between mb-4">
                <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getDifficultyColor(problem.difficulty)}`}>
                  {problem.difficulty}
                </span>
                {solvedProblems.includes(problem.id) && (
                  <div className="flex items-center gap-1 text-primary text-xs font-bold">
                    <span className="material-symbols-outlined text-lg">check_circle</span>
                    <span>Solved</span>
                  </div>
                )}
              </div>
              
              <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{problem.title}</h3>
              <p className="text-sm text-muted-foreground mb-6 line-clamp-2">{problem.description}</p>
              
              <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{problem.category}</span>
                <span className="material-symbols-outlined text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all">arrow_forward</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProblemBank;
