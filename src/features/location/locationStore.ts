import {create} from 'zustand';

import {LocationFix} from '../../types/geofence';

interface LocationState {
  currentLocation?: LocationFix;
  locationHistory: LocationFix[];
  errorMessage?: string;
  hasPermission: boolean;
  isWatching: boolean;
  isDemoMode: boolean;
  isDarkMode: boolean;
  setLocation: (location: LocationFix) => void;
  clearHistory: () => void;
  setError: (message?: string) => void;
  setPermission: (hasPermission: boolean) => void;
  setWatching: (isWatching: boolean) => void;
  setDemoMode: (enabled: boolean) => void;
  setDarkMode: (enabled: boolean) => void;
}

export const useLocationStore = create<LocationState>(set => ({
  locationHistory: [],
  hasPermission: false,
  isWatching: false,
  isDemoMode: false,
  isDarkMode: false,
  setLocation: currentLocation =>
    set(state => {
      const lastFix = state.locationHistory[0];
      if (
        lastFix &&
        lastFix.latitude === currentLocation.latitude &&
        lastFix.longitude === currentLocation.longitude &&
        lastFix.timestamp === currentLocation.timestamp
      ) {
        return {
          currentLocation,
          errorMessage: undefined,
          hasPermission: true,
        };
      }
      const history = [currentLocation, ...state.locationHistory].slice(0, 10);
      return {
        currentLocation,
        locationHistory: history,
        errorMessage: undefined,
        hasPermission: true,
      };
    }),
  clearHistory: () => set({locationHistory: []}),
  setError: errorMessage => set({errorMessage}),
  setPermission: hasPermission => set({hasPermission}),
  setWatching: isWatching => set({isWatching}),
  setDemoMode: isDemoMode => set({isDemoMode}),
  setDarkMode: isDarkMode => set({isDarkMode}),
}));

