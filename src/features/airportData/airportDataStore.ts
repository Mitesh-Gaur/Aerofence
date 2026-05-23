import {create} from 'zustand';

import {AirportDetectionResult, LocationFix} from '../../types/geofence';
import {detectAirportFromDataset} from '../geofence/detection';
import {fetchNearbyAirports} from './overpassClient';

interface AirportDataState {
  cachedDetection?: AirportDetectionResult;
  errorMessage?: string;
  isLoading: boolean;
  locationKey?: string;
  detectForLocation: (location: LocationFix) => Promise<void>;
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
  detectForLocation: async location => {
    const locationKey = getLocationKey(location);

    if (get().locationKey === locationKey && get().cachedDetection) {
      return;
    }

    set({isLoading: true, errorMessage: undefined, locationKey});

    try {
      const airports = await fetchNearbyAirports(location);
      set({
        cachedDetection: detectAirportFromDataset(location, airports),
        isLoading: false,
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to load airport boundary data.';

      set({
        cachedDetection: detectAirportFromDataset(location, []),
        errorMessage: message,
        isLoading: false,
      });
    }
  },
}));
