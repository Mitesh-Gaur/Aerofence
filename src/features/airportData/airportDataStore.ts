import {create} from 'zustand';

import {Airport, AirportDetectionResult, Coordinate, LocationFix} from '../../types/geofence';
import {detectAirportFromDataset} from '../geofence/detection';
import {haversineDistanceMeters} from '../geofence/geometry';
import {fetchNearbyAirports} from './overpassClient';

interface AirportDataState {
  cachedDetection?: AirportDetectionResult;
  errorMessage?: string;
  isLoading: boolean;
  locationKey?: string;
  dataSource?: 'live' | 'cache' | 'offline';
  cacheAgeText?: string;
  localBoundaryCache?: {
    airports: Airport[];
    center: Coordinate;
    timestamp: number;
  };
  detectForLocation: (location: LocationFix, forceRefresh?: boolean) => Promise<void>;
  clearCache: () => void;
}

function getLocationKey(location: LocationFix): string {
  return [
    location.latitude.toFixed(5),
    location.longitude.toFixed(5),
    Math.round(location.accuracy),
  ].join(':');
}

export const useAirportDataStore = create<AirportDataState>((set, get) => ({
  isLoading: false,
  dataSource: 'offline',
  detectForLocation: async (location, forceRefresh = false) => {
    const locationKey = getLocationKey(location);

    // Only early return if we are NOT force refreshing, and the key matches, and we have a successful fetch (no error and not offline fallback)
    if (
      !forceRefresh &&
      get().locationKey === locationKey &&
      get().cachedDetection &&
      !get().errorMessage &&
      get().dataSource !== 'offline'
    ) {
      // If we already have the detection for this exact fix, update the cache age description if it is cached
      const cache = get().localBoundaryCache;
      if (get().dataSource === 'cache' && cache) {
        const ageMs = Date.now() - cache.timestamp;
        const ageMinutes = Math.floor(ageMs / 60000);
        const ageSeconds = Math.floor((ageMs % 60000) / 1000);
        const ageText = ageMinutes > 0 ? `${ageMinutes}m ${ageSeconds}s ago` : `${ageSeconds}s ago`;
        set({cacheAgeText: ageText});
      }
      return;
    }

    set({isLoading: true, errorMessage: undefined, locationKey});

    // Check if we have a valid cache within 50km radius
    const cache = get().localBoundaryCache;
    let useCache = false;
    if (cache) {
      const distance = haversineDistanceMeters(location, cache.center);
      if (distance <= 50000) {
        useCache = true;
      }
    }

    if (useCache && cache) {
      const ageMs = Date.now() - cache.timestamp;
      const ageMinutes = Math.floor(ageMs / 60000);
      const ageSeconds = Math.floor((ageMs % 60000) / 1000);
      const ageText = ageMinutes > 0 ? `${ageMinutes}m ${ageSeconds}s ago` : `${ageSeconds}s ago`;

      set({
        cachedDetection: detectAirportFromDataset(location, cache.airports),
        dataSource: 'cache',
        cacheAgeText: ageText,
        isLoading: false,
      });
      return;
    }

    try {
      const airports = await fetchNearbyAirports(location);
      set({
        localBoundaryCache: {
          airports,
          center: {latitude: location.latitude, longitude: location.longitude},
          timestamp: Date.now(),
        },
        cachedDetection: detectAirportFromDataset(location, airports),
        dataSource: 'live',
        cacheAgeText: '0s (Just fetched)',
        isLoading: false,
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to load airport boundary data.';

      // Fallback: If we fail but have any cache (even older/wider), we can still use it!
      if (cache) {
        const ageMs = Date.now() - cache.timestamp;
        const ageMinutes = Math.floor(ageMs / 60000);
        const ageSeconds = Math.floor((ageMs % 60000) / 1000);
        const ageText = ageMinutes > 0 ? `${ageMinutes}m ${ageSeconds}s ago` : `${ageSeconds}s ago`;

        set({
          cachedDetection: detectAirportFromDataset(location, cache.airports),
          dataSource: 'cache',
          cacheAgeText: ageText,
          errorMessage: `${message} Using cached boundaries.`,
          isLoading: false,
        });
      } else {
        // Fallback to seeded offline database
        set({
          cachedDetection: detectAirportFromDataset(location, []),
          dataSource: 'offline',
          errorMessage: message,
          isLoading: false,
        });
      }
    }
  },
  clearCache: () => set({localBoundaryCache: undefined, dataSource: 'offline', cacheAgeText: undefined}),
}));

