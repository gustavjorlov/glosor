import { useState, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { GameSession, UserProgress, WeekScore, Badge } from '../types';

const initialProgress: UserProgress = {
  completedWeeks: [],
  currentWeek: 1,
  totalScore: 0,
  badges: [],
  weekScores: {}
};

export function useGameLogic() {
  const [progress, setProgress] = useLocalStorage<UserProgress>('glosor-progress', initialProgress);
  const [currentSession, setCurrentSession] = useState<GameSession | null>(null);

  const startNewSession = useCallback((week: number, totalWords: number) => {
    const session: GameSession = {
      week,
      currentWordIndex: 0,
      score: 0,
      correctAnswers: 0,
      totalQuestions: totalWords * 2, // Both directions
      currentStreak: 0,
      bestStreak: 0,
      direction: Math.random() > 0.5 ? 'en-sv' : 'sv-en',
      isComplete: false
    };
    setCurrentSession(session);
    return session;
  }, []);

  const submitAnswer = useCallback((isCorrect: boolean) => {
    if (!currentSession) return null;

    const updatedSession = { ...currentSession };
    
    if (isCorrect) {
      updatedSession.correctAnswers++;
      updatedSession.score += 10;
      updatedSession.currentStreak++;
      updatedSession.bestStreak = Math.max(updatedSession.bestStreak, updatedSession.currentStreak);
    } else {
      updatedSession.currentStreak = 0;
    }

    updatedSession.currentWordIndex++;
    
    // Switch direction for next word
    updatedSession.direction = updatedSession.direction === 'en-sv' ? 'sv-en' : 'en-sv';
    
    // Check if session is complete
    if (updatedSession.currentWordIndex >= updatedSession.totalQuestions) {
      updatedSession.isComplete = true;
      
      // Complete session logic inline
      const weekScore: WeekScore = {
        week: updatedSession.week,
        correctAnswers: updatedSession.correctAnswers,
        totalQuestions: updatedSession.totalQuestions,
        score: updatedSession.score,
        completedAt: new Date(),
        bestStreak: updatedSession.bestStreak
      };

      const updatedProgress = { ...progress };
      updatedProgress.weekScores[updatedSession.week] = weekScore;
      updatedProgress.totalScore += updatedSession.score;

      // Check if week is completed (80% or higher)
      const completionRate = updatedSession.correctAnswers / updatedSession.totalQuestions;
      if (completionRate >= 0.8 && !updatedProgress.completedWeeks.includes(updatedSession.week)) {
        updatedProgress.completedWeeks.push(updatedSession.week);
        
        // Award badges
        const newBadges = checkForNewBadges(updatedProgress, updatedSession);
        updatedProgress.badges.push(...newBadges);
      }

      setProgress(updatedProgress);
    }

    setCurrentSession(updatedSession);
    return updatedSession;
  }, [currentSession, progress, setProgress]);


  const checkForNewBadges = (progress: UserProgress, session: GameSession): Badge[] => {
    const badges: Badge[] = [];
    const now = new Date();

    // First badge ever
    if (progress.badges.length === 0) {
      badges.push({
        id: 'first-badge',
        name: 'Första märket',
        description: 'Slutförde din första vecka!',
        icon: '🎉',
        unlockedAt: now
      });
    }

    // Week complete badge
    badges.push({
      id: `week-${session.week}-complete`,
      name: `Vecka ${session.week} Klar`,
      description: `Slutförde vecka ${session.week}`,
      icon: '✅',
      unlockedAt: now
    });

    // Perfect score badge
    if (session.correctAnswers === session.totalQuestions) {
      badges.push({
        id: `week-${session.week}-perfect`,
        name: 'Perfekt Poäng',
        description: 'Alla rätt svar!',
        icon: '⭐',
        unlockedAt: now
      });
    }

    // Streak master badge
    if (session.bestStreak >= 10) {
      badges.push({
        id: `streak-master-${session.week}`,
        name: 'Streak Mästare',
        description: '10 rätt i rad!',
        icon: '🔥',
        unlockedAt: now
      });
    }

    // Monthly master (completed 4 weeks)
    if (progress.completedWeeks.length >= 4) {
      const hasMonthlyMaster = progress.badges.some(b => b.id === 'monthly-master');
      if (!hasMonthlyMaster) {
        badges.push({
          id: 'monthly-master',
          name: 'Månads Mästare',
          description: 'Slutförde 4 veckor!',
          icon: '👑',
          unlockedAt: now
        });
      }
    }

    return badges;
  };

  const resetProgress = useCallback(() => {
    setProgress(initialProgress);
    setCurrentSession(null);
  }, [setProgress]);

  const getWeekScore = useCallback((week: number): WeekScore | undefined => {
    return progress.weekScores[week];
  }, [progress]);

  const isWeekCompleted = useCallback((week: number): boolean => {
    return progress.completedWeeks.includes(week);
  }, [progress]);

  return {
    progress,
    currentSession,
    startNewSession,
    submitAnswer,
    resetProgress,
    getWeekScore,
    isWeekCompleted
  };
}