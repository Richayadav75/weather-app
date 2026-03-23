import { useState, useRef, useEffect, useCallback } from 'react';
import type { GeoLocation } from '../types/weather';
import { searchLocations } from '../services/weatherApi';

interface Props {
  onSelect: (location: GeoLocation) => void;
  onGeolocate: () => void;
  locating: boolean;
}

export default function SearchBar({ onSelect, onGeolocate, locating }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeoLocation[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const search = useCallback(async (q: string) => {
    if (q.trim().length < 2) { setResults([]); setOpen(false); return; }
    setLoading(true);
    try {
      const data = await searchLocations(q);
      setResults(data);
      setOpen(data.length > 0);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(query), 350);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, search]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function handleSelect(loc: GeoLocation) {
    setQuery(`${loc.name}, ${loc.country}`);
    setOpen(false);
    onSelect(loc);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') setOpen(false);
  }

  return (
    <div className="search-container" ref={containerRef}>
      <div className={`search-box ${focused ? 'focused' : ''}`}>
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search for a city..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => { setFocused(true); if (results.length > 0) setOpen(true); }}
          onBlur={() => setFocused(false)}
          onKeyDown={handleKeyDown}
          className="search-input"
          aria-label="Search location"
          autoComplete="off"
        />
        {loading && <span className="search-spinner" />}
        {query && (
          <button className="search-clear" onClick={() => { setQuery(''); setResults([]); setOpen(false); }} aria-label="Clear">✕</button>
        )}
        <button
          className={`geo-btn ${locating ? 'locating' : ''}`}
          onClick={onGeolocate}
          disabled={locating}
          title="Use my location"
          aria-label="Use my location"
        >
          {locating ? <span className="search-spinner small" /> : '📍'}
        </button>
      </div>

      {open && results.length > 0 && (
        <ul className="search-dropdown" role="listbox">
          {results.map(loc => (
            <li
              key={loc.id}
              className="search-option"
              onMouseDown={() => handleSelect(loc)}
              role="option"
            >
              <span className="option-flag">{getFlagEmoji(loc.country_code)}</span>
              <span className="option-info">
                <span className="option-name">{loc.name}</span>
                <span className="option-sub">{[loc.admin1, loc.country].filter(Boolean).join(', ')}</span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function getFlagEmoji(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) return '🌍';
  const codePoints = countryCode.toUpperCase().split('').map(c => 127397 + c.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}
