
export enum LessonStatus {
  COMPLETED = 'completed',
  IN_PROGRESS = 'in-progress',
  LOCKED = 'locked'
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

export interface DebugStep {
  lineIndex: number;
  variables: Record<string, any>;
  comment: string;
}

export interface CodingTask {
  language: 'python' | 'c';
  template: string;
  explanation: string[];
  expectedOutput: string;
  fileName: string;
  debugSteps?: DebugStep[]; 
}

export interface StepContent {
  id: number;
  type: 'concept' | 'quiz' | 'coding';
  title: string;
  subtitle?: string;
  body: string;
  analogy?: {
    icon: string;
    text: string;
  };
  visualAid?: 'box' | 'hardware' | 'logic';
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
