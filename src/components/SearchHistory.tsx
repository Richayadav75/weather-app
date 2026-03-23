import type { GeoLocation } from '../types/weather';

interface Props {
  history: GeoLocation[];
  onSelect: (loc: GeoLocation) => void;
  onClear: () => void;
}

export default function SearchHistory({ history, onSelect, onClear }: Props) {
  if (history.length === 0) return null;

  return (
    <div className="section-card history-card">
      <div className="section-header">
        <h3 className="section-title">🕓 Recent Searches</h3>
        <button className="clear-btn" onClick={onClear}>Clear</button>
      </div>
      <div className="history-chips">
        {history.map((loc, idx) => (
          <button
            key={`${loc.name}-${loc.latitude}-${idx}`}
            className="history-chip"
            onClick={() => onSelect(loc)}
          >
            {getFlagEmoji(loc.country_code)} {loc.name}
          </button>
        ))}
      </div>
    </div>
  );
}

function getFlagEmoji(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) return '📍';
  const codePoints = countryCode.toUpperCase().split('').map(c => 127397 + c.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}
