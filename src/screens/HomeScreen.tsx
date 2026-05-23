import React from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import {ActionButton} from '../components/ActionButton';
import {Screen} from '../components/Screen';
import {TelemetryMatrix} from '../components/TelemetryMatrix';
import {useLocationStore} from '../features/location/locationStore';
import {useLocationSubscription} from '../features/location/useLocationSubscription';
import {RootStackParamList} from '../navigation/types';

const REQUIRED_ACCURACY_METERS = 50;

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

function formatTimestamp(timestamp?: number): string {
  return timestamp
    ? new Date(timestamp).toLocaleString()
    : 'Awaiting first GPS fix';
}

export function HomeScreen({navigation}: HomeScreenProps): React.JSX.Element {
  useLocationSubscription();

  const currentLocation = useLocationStore(state => state.currentLocation);
  const errorMessage = useLocationStore(state => state.errorMessage);
  const isWatching = useLocationStore(state => state.isWatching);

  const canCheckAirport =
    currentLocation !== undefined &&
    currentLocation.accuracy <= REQUIRED_ACCURACY_METERS;
  const accuracyText = currentLocation
    ? `${currentLocation.accuracy.toFixed(1)} m`
    : 'Acquiring';
  const locationStatus = canCheckAirport
    ? 'Optimal for geofencing'
    : 'Acquiring satellite locks';
  const precisionRatio = currentLocation
    ? 1 - currentLocation.accuracy / REQUIRED_ACCURACY_METERS
    : 0;

  return (
    <Screen contentContainerStyle={styles.screen}>
      <View style={styles.hero}>
        <View>
          <Text style={styles.kicker}>CONTROL TOWER</Text>
          <Text style={styles.heroTitle}>AERO-FENCE</Text>
          <Text style={styles.heroSubtitle}>Real-time Terminal Locator</Text>
        </View>
        <View style={[styles.syncBadge, isWatching ? styles.syncActive : undefined]}>
          <Text style={styles.syncText}>{isWatching ? 'SYNCING' : 'STARTING'}</Text>
        </View>
      </View>

      <TelemetryMatrix
        latitude={
          currentLocation ? `${currentLocation.latitude.toFixed(6)} N` : '--'
        }
        longitude={
          currentLocation ? `${currentLocation.longitude.toFixed(6)} E` : '--'
        }
        accuracy={accuracyText}
        status={locationStatus}
        precisionRatio={precisionRatio}
      />

      {!canCheckAirport ? (
        <View style={styles.lockPanel}>
          <ActivityIndicator color="#2BD6A3" />
          <Text style={styles.lockText}>Acquiring satellite locks...</Text>
        </View>
      ) : null}

      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

      <ActionButton
        title="CHECK AIRPORT STATUS"
        disabled={!canCheckAirport}
        onPress={() => {
          if (currentLocation) {
            navigation.navigate('AirportStatus', {location: currentLocation});
          }
        }}
      />

      <Text style={styles.timestamp}>
        Fix Timestamp: {formatTimestamp(currentLocation?.timestamp)}
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    justifyContent: 'flex-start',
  },
  hero: {
    alignItems: 'flex-start',
    backgroundColor: '#0B3D35',
    borderColor: '#1EA37A',
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    padding: 18,
  },
  kicker: {
    color: '#8EF0CD',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0,
  },
  heroTitle: {
    color: '#F4FBFC',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 0,
    marginTop: 6,
  },
  heroSubtitle: {
    color: '#B8F3E0',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 4,
  },
  syncBadge: {
    backgroundColor: '#102C35',
    borderColor: '#2BD6A3',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  syncActive: {
    backgroundColor: '#063E31',
  },
  syncText: {
    color: '#B8F3E0',
    fontSize: 11,
    fontWeight: '900',
  },
  error: {
    color: '#FB7185',
    fontSize: 14,
    fontWeight: '600',
  },
  lockPanel: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 16,
  },
  lockText: {
    color: '#B8F3E0',
    fontSize: 14,
    fontWeight: '800',
  },
  timestamp: {
    color: '#8FB3BE',
    fontFamily: 'Menlo',
    fontSize: 12,
    textAlign: 'center',
  },
});
