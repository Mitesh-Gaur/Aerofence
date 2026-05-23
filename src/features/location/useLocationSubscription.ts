import {useEffect} from 'react';
import {PermissionsAndroid, Platform} from 'react-native';
import Geolocation, {
  GeoPosition,
} from 'react-native-geolocation-service';

import {useLocationStore} from './locationStore';
import {LocationFix} from '../../types/geofence';

const SFO_LOCATION: LocationFix = {
  latitude: 37.621312,
  longitude: -122.378955,
  accuracy: 12.4,
  timestamp: 1747215683000, // May 14, 2025 09:41:23 AM
};

async function requestLocationPermission(): Promise<boolean> {
  if (Platform.OS === 'ios') {
    const result = await Geolocation.requestAuthorization('whenInUse');
    return result === 'granted';
  }

  const result = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );

  return result === PermissionsAndroid.RESULTS.GRANTED;
}

function toLocationFix(position: GeoPosition): LocationFix {
  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
    accuracy: position.coords.accuracy,
    timestamp: position.timestamp,
  };
}

export function useLocationSubscription(): void {
  const setError = useLocationStore(state => state.setError);
  const setLocation = useLocationStore(state => state.setLocation);
  const setPermission = useLocationStore(state => state.setPermission);
  const setWatching = useLocationStore(state => state.setWatching);
  const isDemoMode = useLocationStore(state => state.isDemoMode);

  useEffect(() => {
    if (isDemoMode) {
      setLocation(SFO_LOCATION);
      setWatching(true);
      setPermission(true);
      setError(undefined);
      return;
    }

    let watchId: number | undefined;
    let mounted = true;

    async function startWatching() {
      const granted = await requestLocationPermission();

      if (!mounted) {
        return;
      }

      setPermission(granted);

      if (!granted) {
        setError('Location permission is required to detect airport boundaries.');
        return;
      }

      setWatching(true);
      watchId = Geolocation.watchPosition(
        position => {
          if (!isDemoMode) {
            setLocation(toLocationFix(position));
          }
        },
        error => {
          if (!isDemoMode) {
            setError(error.message);
          }
        },
        {
          accuracy: {android: 'high', ios: 'best'},
          distanceFilter: 1,
          enableHighAccuracy: true,
          interval: 2000,
          fastestInterval: 1000,
          showsBackgroundLocationIndicator: false,
        },
      );
    }

    startWatching();

    return () => {
      mounted = false;
      if (watchId !== undefined) {
        Geolocation.clearWatch(watchId);
      }
      setWatching(false);
    };
  }, [setError, setLocation, setPermission, setWatching, isDemoMode]);
}
