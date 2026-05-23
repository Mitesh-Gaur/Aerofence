import {useEffect} from 'react';
import {PermissionsAndroid, Platform} from 'react-native';
import Geolocation, {
  GeoPosition,
} from 'react-native-geolocation-service';

import {useLocationStore} from './locationStore';

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

function toLocationFix(position: GeoPosition) {
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

  useEffect(() => {
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
        position => setLocation(toLocationFix(position)),
        error => setError(error.message),
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
  }, [setError, setLocation, setPermission, setWatching]);
}
