import type { UserProgress, WeekData } from '../types';

interface ProgressTrackerProps {
  progress: UserProgress;
  availableWeeks: WeekData[];
  compact?: boolean;
}

export function ProgressTracker({ 
  progress, 
  availableWeeks, 
  compact = false 
}: ProgressTrackerProps) {
  const totalWeeks = availableWeeks.length;
  const completedWeeks = progress.completedWeeks.length;
  const completionPercentage = totalWeeks > 0 ? Math.round((completedWeeks / totalWeeks) * 100) : 0;

  if (compact) {
    return (
      <div className="progress-tracker compact">
        <div className="progress-summary">
          <span className="completion-text">
            {completedWeeks}/{totalWeeks} veckor slutförda
          </span>
          <span className="completion-percentage">({completionPercentage}%)</span>
        </div>
        <div className="progress-bar small">
          <div 
            className="progress-fill" 
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>
    );
  }

  const getWeekStatus = (weekNumber: number) => {
    if (progress.completedWeeks.includes(weekNumber)) {
      return 'completed';
    }
    if (progress.weekScores[weekNumber]) {
      const score = progress.weekScores[weekNumber];
      const completionRate = score.correctAnswers / score.totalQuestions;
      if (completionRate >= 0.8) {
        return 'completed';
      } else if (completionRate >= 0.6) {
        return 'partial';
      } else {
        return 'attempted';
      }
    }
    return 'not-started';
  };

  const getWeekScore = (weekNumber: number) => {
    const weekScore = progress.weekScores[weekNumber];
    if (!weekScore) return null;
    
    return {
      accuracy: Math.round((weekScore.correctAnswers / weekScore.totalQuestions) * 100),
      points: weekScore.score,
      streak: weekScore.bestStreak
    };
  };

  return (
    <div className="progress-tracker">
      <div className="progress-header">
        <h3>Din framsteg</h3>
        <div className="overall-stats">
          <div className="stat">
            <strong>{completedWeeks}</strong> av <strong>{totalWeeks}</strong> veckor slutförda
          </div>
          <div className="stat">
            <strong>{progress.totalScore}</strong> total poäng
          </div>
        </div>
      </div>

      <div className="progress-bar main">
        <div 
          className="progress-fill" 
          style={{ width: `${completionPercentage}%` }}
        />
        <span className="progress-text">{completionPercentage}%</span>
      </div>

      <div className="weeks-progress">
        <h4>Veckoöversikt</h4>
        <div className="weeks-grid">
          {availableWeeks.map((week) => {
            const status = getWeekStatus(week.week);
            const score = getWeekScore(week.week);
            
            return (
              <div key={week.week} className={`week-progress-item ${status}`}>
                <div className="week-number">
                  Vecka {week.week}
                </div>
                <div className="week-title">{week.title}</div>
                
                <div className="week-status-indicator">
                  {status === 'completed' && '✅'}
                  {status === 'partial' && '🟡'}
                  {status === 'attempted' && '🔴'}
                  {status === 'not-started' && '⭕'}
                </div>

                {score && (
                  <div className="week-score-summary">
                    <div className="accuracy">{score.accuracy}%</div>
                    <div className="points">{score.points}p</div>
                    {score.streak > 0 && (
                      <div className="streak">🔥{score.streak}</div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="progress-legend">
        <div className="legend-item">
          <span className="legend-icon">✅</span>
          <span>Slutförd (≥80%)</span>
        </div>
        <div className="legend-item">
          <span className="legend-icon">🟡</span>
          <span>Delvis (60-79%)</span>
        </div>
        <div className="legend-item">
          <span className="legend-icon">🔴</span>
          <span>Försökt (&lt;60%)</span>
        </div>
        <div className="legend-item">
          <span className="legend-icon">⭕</span>
          <span>Ej påbörjad</span>
        </div>
      </div>
    </div>
  );
}