import { useState, useCallback } from 'react';
import { reverseGeocode } from '../services/weatherApi';
import type { GeoLocation } from '../types/weather';

export function useGeolocation() {
  const [locating, setLocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  const getLocation = useCallback((onSuccess: (loc: GeoLocation) => void) => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser');
      return;
    }
    setLocating(true);
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const loc = await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
          if (loc) {
            onSuccess(loc);
          } else {
            setGeoError('Could not determine your location name');
          }
        } catch {
          setGeoError('Failed to get location details');
        } finally {
          setLocating(false);
        }
      },
      (err) => {
        setLocating(false);
        if (err.code === 1) setGeoError('Location access denied');
        else if (err.code === 2) setGeoError('Location unavailable');
        else setGeoError('Location request timed out');
      },
      { timeout: 10000, maximumAge: 300000 }
    );
  }, []);

  return { locating, geoError, getLocation };
}
