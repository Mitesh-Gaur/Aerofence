import {create} from 'zustand';

import {LocationFix} from '../../types/geofence';

interface LocationState {
  currentLocation?: LocationFix;
  errorMessage?: string;
  hasPermission: boolean;
  isWatching: boolean;
  setLocation: (location: LocationFix) => void;
  setError: (message?: string) => void;
  setPermission: (hasPermission: boolean) => void;
  setWatching: (isWatching: boolean) => void;
}

export const useLocationStore = create<LocationState>(set => ({
  hasPermission: false,
  isWatching: false,
  setLocation: currentLocation =>
    set({currentLocation, errorMessage: undefined, hasPermission: true}),
  setError: errorMessage => set({errorMessage}),
  setPermission: hasPermission => set({hasPermission}),
  setWatching: isWatching => set({isWatching}),
}));
