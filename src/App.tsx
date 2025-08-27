import { useState } from 'react';
import { useWordData } from './hooks/useWordData';
import { useGameLogic } from './hooks/useGameLogic';
import { WeekSelector } from './components/WeekSelector';
import { FlashCard } from './components/FlashCard';
import { ScoreDisplay } from './components/ScoreDisplay';
import { BadgeSystem } from './components/BadgeSystem';
import { ProgressTracker } from './components/ProgressTracker';
import type { Word } from './types';
import './App.css';

type AppView = 'week-selection' | 'game' | 'stats';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('week-selection');
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [, setCurrentWordIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(false);

  const { weekData, loading, getWeekData } = useWordData();
  const { 
    progress, 
    currentSession, 
    startNewSession, 
    submitAnswer
  } = useGameLogic();

  const handleWeekSelect = (week: number) => {
    const weekInfo = getWeekData(week);
    if (weekInfo) {
      setSelectedWeek(week);
      setCurrentWordIndex(0);
      setShowResult(false);
      startNewSession(week, weekInfo.words.length);
      setCurrentView('game');
    }
  };

  const handleAnswer = (isCorrect: boolean) => {
    setLastAnswerCorrect(isCorrect);
    setShowResult(true);
    
    const updatedSession = submitAnswer(isCorrect);
    
    setTimeout(() => {
      if (updatedSession?.isComplete) {
        setCurrentView('week-selection');
        setSelectedWeek(null);
      } else {
        setCurrentWordIndex(prev => prev + 1);
        setShowResult(false);
      }
    }, 2000);
  };

  const getCurrentWord = (): Word | null => {
    if (!selectedWeek || !currentSession) return null;
    
    const weekInfo = getWeekData(selectedWeek);
    if (!weekInfo) return null;

    const wordIndex = Math.floor(currentSession.currentWordIndex / 2);
    return weekInfo.words[wordIndex] || null;
  };

  const handleBackToWeeks = () => {
    setCurrentView('week-selection');
    setSelectedWeek(null);
  };

  const handleViewStats = () => {
    setCurrentView('stats');
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🇬🇧🇸🇪 Glosträning</h1>
        <nav className="app-nav">
          <button 
            className={currentView === 'week-selection' ? 'active' : ''}
            onClick={() => setCurrentView('week-selection')}
          >
            Veckor
          </button>
          <button 
            className={currentView === 'stats' ? 'active' : ''}
            onClick={handleViewStats}
          >
            Statistik
          </button>
        </nav>
      </header>

      <main className="app-main">
        {currentView === 'week-selection' && (
          <>
            <ProgressTracker 
              progress={progress} 
              availableWeeks={weekData} 
              compact={true}
            />
            
            <WeekSelector
              weeks={weekData}
              currentWeek={progress.currentWeek}
              completedWeeks={progress.completedWeeks}
              onWeekSelect={handleWeekSelect}
              loading={loading}
            />

            <BadgeSystem badges={progress.badges} recentOnly={true} />
          </>
        )}

        {currentView === 'game' && currentSession && getCurrentWord() && (
          <div className="game-view">
            <div className="game-header">
              <button onClick={handleBackToWeeks} className="back-button">
                ← Tillbaka till veckor
              </button>
              <h2>Vecka {selectedWeek}</h2>
            </div>

            <ScoreDisplay session={currentSession} progress={progress} />

            <FlashCard
              word={getCurrentWord()!}
              direction={currentSession.direction}
              onAnswer={handleAnswer}
              showResult={showResult}
              isCorrect={lastAnswerCorrect}
            />

            {currentSession.isComplete && (
              <div className="session-complete">
                <h3>🎉 Bra jobbat!</h3>
                <p>Du har slutfört vecka {selectedWeek}!</p>
                <ScoreDisplay session={currentSession} progress={progress} />
                <BadgeSystem badges={progress.badges} recentOnly={true} />
              </div>
            )}
          </div>
        )}

        {currentView === 'stats' && (
          <div className="stats-view">
            <ScoreDisplay progress={progress} showDetailed={true} />
            <ProgressTracker progress={progress} availableWeeks={weekData} />
            <BadgeSystem badges={progress.badges} showAll={true} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;