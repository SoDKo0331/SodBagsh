
export enum LessonStatus {
  COMPLETED = 'completed',
  IN_PROGRESS = 'in-progress',
  LOCKED = 'locked'
}

export type UserRole = 'student' | 'admin' | 'tutor';
export type SubscriptionStatus = 'free' | 'pro' | 'enterprise';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface UserProfile {
  uid: string;
  email: string;
  role: UserRole; // Enforces role-based access control
  subscriptionStatus: SubscriptionStatus;
  xp: number;
  streak: number;
  lastActive: string;
  stripeCustomerId?: string;
}

export interface UserProgress {
  moduleId: string;
  status: LessonStatus;
  completedSteps: number;
  lastAttempted: string;
}

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
  isPremium: boolean;
  icon: string;
  badgeId?: string;
}

export interface CodingTask {
  language: 'python' | 'c' | 'cpp';
  template: string;
  explanation: string[];
  expectedOutput: string;
  fileName: string;
}

export interface StepContent {
  id: number;
  type: 'concept' | 'quiz' | 'coding' | 'minigame';
  title: string;
  body: string;
  quiz?: {
    question: string;
    options: { id: string; text: string; isCorrect: boolean }[];
  };
  codingTasks?: CodingTask[];
  minigame?: {
    type: string;
    question: string;
    items: { id: string; text: string }[];
    correctOrder: string[];
  };
}

export interface FullLesson {
  id: string;
  title: string;
  steps: StepContent[];
}
