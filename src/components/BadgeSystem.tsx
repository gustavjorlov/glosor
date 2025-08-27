import type { Badge } from '../types';

interface BadgeSystemProps {
  badges: Badge[];
  showAll?: boolean;
  recentOnly?: boolean;
}

export function BadgeSystem({ badges, showAll = false, recentOnly = false }: BadgeSystemProps) {
  let displayBadges = badges;

  if (recentOnly) {
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    displayBadges = badges.filter(badge => 
      new Date(badge.unlockedAt) > oneDayAgo
    );
  }

  if (!showAll && !recentOnly) {
    displayBadges = badges.slice(-3);
  }

  if (displayBadges.length === 0) {
    if (recentOnly) {
      return null;
    }
    
    return (
      <div className="badge-system empty">
        <h3>Märken</h3>
        <p className="no-badges">Inga märken än. Slutför din första vecka för att få ditt första märke!</p>
      </div>
    );
  }

  return (
    <div className="badge-system">
      <h3>
        Märken 
        {!showAll && badges.length > 3 && (
          <span className="badge-count">({displayBadges.length}/{badges.length})</span>
        )}
      </h3>
      
      <div className="badges-grid">
        {displayBadges.map((badge) => (
          <div key={badge.id} className="badge-item">
            <div className="badge-icon">{badge.icon}</div>
            <div className="badge-info">
              <div className="badge-name">{badge.name}</div>
              <div className="badge-description">{badge.description}</div>
              <div className="badge-date">
                {new Date(badge.unlockedAt).toLocaleDateString('sv-SE')}
              </div>
            </div>
          </div>
        ))}
      </div>

      {!showAll && badges.length > 3 && (
        <button className="show-all-badges">
          Visa alla märken ({badges.length})
        </button>
      )}
    </div>
  );
}

interface BadgeNotificationProps {
  badges: Badge[];
  onDismiss: () => void;
}

export function BadgeNotification({ badges, onDismiss }: BadgeNotificationProps) {
  if (badges.length === 0) return null;

  return (
    <div className="badge-notification">
      <div className="notification-content">
        <h4>🎉 Nytt märke!</h4>
        {badges.map(badge => (
          <div key={badge.id} className="new-badge">
            <span className="badge-icon large">{badge.icon}</span>
            <div className="badge-info">
              <div className="badge-name">{badge.name}</div>
              <div className="badge-description">{badge.description}</div>
            </div>
          </div>
        ))}
        <button className="dismiss-button" onClick={onDismiss}>
          Stäng
        </button>
      </div>
    </div>
  );
}