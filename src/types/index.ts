export interface Word {
  id: string;
  english: string;
  swedish: string;
  category?: string;
}

export interface WeekData {
  week: number;
  title: string;
  description: string;
  words: Word[];
}

export interface UserProgress {
  completedWeeks: number[];
  currentWeek: number;
  totalScore: number;
  badges: Badge[];
  weekScores: Record<number, WeekScore>;
}

export interface WeekScore {
  week: number;
  correctAnswers: number;
  totalQuestions: number;
  score: number;
  completedAt?: Date;
  bestStreak: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
}

export interface GameSession {
  week: number;
  currentWordIndex: number;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  currentStreak: number;
  bestStreak: number;
  direction: 'en-sv' | 'sv-en';
  isComplete: boolean;
}

export interface GameSettings {
  direction: 'en-sv' | 'sv-en' | 'both';
  shuffleWords: boolean;
  showHints: boolean;
}

export type BadgeType = 
  | 'week-complete'
  | 'perfect-score' 
  | 'monthly-master'
  | 'streak-master'
  | 'first-badge';