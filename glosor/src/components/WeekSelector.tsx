import type { WeekData } from '../types';

interface WeekSelectorProps {
  weeks: WeekData[];
  currentWeek: number;
  completedWeeks: number[];
  onWeekSelect: (week: number) => void;
  loading?: boolean;
}

export function WeekSelector({ 
  weeks, 
  currentWeek, 
  completedWeeks, 
  onWeekSelect,
  loading = false 
}: WeekSelectorProps) {
  if (loading) {
    return (
      <div className="week-selector loading">
        <p>Laddar veckor...</p>
      </div>
    );
  }

  return (
    <div className="week-selector">
      <h2>Välj vecka att träna</h2>
      <div className="weeks-grid">
        {weeks.map((week) => (
          <button
            key={week.week}
            className={`week-card ${
              completedWeeks.includes(week.week) ? 'completed' : ''
            } ${currentWeek === week.week ? 'current' : ''}`}
            onClick={() => onWeekSelect(week.week)}
          >
            <div className="week-number">Vecka {week.week}</div>
            <div className="week-title">{week.title}</div>
            <div className="week-description">{week.description}</div>
            {completedWeeks.includes(week.week) && (
              <div className="completion-badge">✅</div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}