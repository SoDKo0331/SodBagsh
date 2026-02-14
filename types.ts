
export enum LessonStatus {
  COMPLETED = 'completed',
  IN_PROGRESS = 'in-progress',
  LOCKED = 'locked'
}

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  category: string;
  constraints: string[];
  examples: { input: string; output: string }[];
  templates: {
    python: string;
    c: string;
    cpp: string;
  };
  expectedOutput: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  isEarned: boolean;
}

export interface Module {
  id: string;
  number: number;
  title: string;
  description: string;
  status: LessonStatus;
  progressText?: string;
  icon: string;
  lockedType?: 'default' | 'ultimate';
  badgeId?: string;
}

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface CodingTask {
  language: 'python' | 'c' | 'cpp';
  template: string;
  explanation: string[];
  expectedOutput: string;
  fileName: string;
}

export interface MiniGameData {
  type: 'sorter' | 'matcher';
  question: string;
  items: { id: string; text: string; order?: number }[];
  correctOrder?: string[]; // IDs in correct order
}

export interface StepContent {
  id: number;
  type: 'concept' | 'quiz' | 'coding' | 'minigame';
  title: string;
  subtitle?: string;
  body: string;
  minigame?: MiniGameData;
  quiz?: {
    question: string;
    options: QuizOption[];
  };
  codingTasks?: CodingTask[];
}

export interface FullLesson {
  id: string;
  title: string;
  steps: StepContent[];
}
