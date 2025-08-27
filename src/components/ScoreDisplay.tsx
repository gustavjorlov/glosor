import type { GameSession, UserProgress } from '../types';

interface ScoreDisplayProps {
  session?: GameSession | null;
  progress: UserProgress;
  showDetailed?: boolean;
}

export function ScoreDisplay({ session, progress, showDetailed = false }: ScoreDisplayProps) {
  if (!session && !showDetailed) {
    return (
      <div className="score-display minimal">
        <div className="total-score">
          <span className="score-label">Total poäng:</span>
          <span className="score-value">{progress.totalScore}</span>
        </div>
      </div>
    );
  }

  if (session) {
    const progressPercentage = Math.round((session.currentWordIndex / session.totalQuestions) * 100);
    const accuracyPercentage = session.currentWordIndex > 0 
      ? Math.round((session.correctAnswers / session.currentWordIndex) * 100) 
      : 0;

    return (
      <div className="score-display session">
        <div className="session-stats">
          <div className="stat">
            <span className="stat-label">Poäng:</span>
            <span className="stat-value">{session.score}</span>
          </div>
          
          <div className="stat">
            <span className="stat-label">Rätt svar:</span>
            <span className="stat-value">
              {session.correctAnswers}/{session.currentWordIndex}
            </span>
          </div>

          <div className="stat">
            <span className="stat-label">Framsteg:</span>
            <span className="stat-value">{progressPercentage}%</span>
          </div>

          {session.currentStreak > 0 && (
            <div className="stat streak">
              <span className="stat-label">Streak:</span>
              <span className="stat-value">🔥 {session.currentStreak}</span>
            </div>
          )}
        </div>

        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {session.isComplete && (
          <div className="completion-stats">
            <h3>Slutresultat</h3>
            <div className="final-stats">
              <div className="final-stat">
                <strong>Total poäng:</strong> {session.score}
              </div>
              <div className="final-stat">
                <strong>Träffsäkerhet:</strong> {accuracyPercentage}%
              </div>
              <div className="final-stat">
                <strong>Bästa streak:</strong> {session.bestStreak}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (showDetailed) {
    const completedWeeksCount = progress.completedWeeks.length;
    const badgesCount = progress.badges.length;
    
    return (
      <div className="score-display detailed">
        <h3>Din statistik</h3>
        
        <div className="detailed-stats">
          <div className="stat-card">
            <div className="stat-number">{progress.totalScore}</div>
            <div className="stat-description">Total poäng</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-number">{completedWeeksCount}</div>
            <div className="stat-description">Slutförda veckor</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-number">{badgesCount}</div>
            <div className="stat-description">Märken</div>
          </div>
        </div>

        {Object.keys(progress.weekScores).length > 0 && (
          <div className="week-scores">
            <h4>Vecko-resultat</h4>
            {Object.values(progress.weekScores)
              .sort((a, b) => a.week - b.week)
              .map(weekScore => (
                <div key={weekScore.week} className="week-score-item">
                  <span className="week-number">Vecka {weekScore.week}</span>
                  <span className="week-accuracy">
                    {Math.round((weekScore.correctAnswers / weekScore.totalQuestions) * 100)}%
                  </span>
                  <span className="week-points">{weekScore.score}p</span>
                </div>
              ))}
          </div>
        )}
      </div>
    );
  }

  return null;
}