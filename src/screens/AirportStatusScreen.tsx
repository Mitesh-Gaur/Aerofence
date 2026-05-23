import React, {useEffect} from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import {ActionButton} from '../components/ActionButton';
import {AirportMap} from '../components/AirportMap';
import {MetricTile} from '../components/MetricTile';
import {Screen} from '../components/Screen';
import {StatusPanel} from '../components/StatusPanel';
import {useAirportDataStore} from '../features/airportData/airportDataStore';
import {RootStackParamList} from '../navigation/types';

type AirportStatusScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'AirportStatus'
>;

function formatBoundaryDistance(distance: number): string {
  return Number.isFinite(distance) ? `${distance.toFixed(1)} m` : 'No match';
}

export function AirportStatusScreen({
  navigation,
  route,
}: AirportStatusScreenProps): React.JSX.Element {
  const {location} = route.params;
  const detectForLocation = useAirportDataStore(state => state.detectForLocation);
  const detection = useAirportDataStore(state => state.cachedDetection);
  const errorMessage = useAirportDataStore(state => state.errorMessage);
  const isLoading = useAirportDataStore(state => state.isLoading);
  const airport = detection?.airport;
  const status = isLoading ? 'loading' : detection?.status ?? 'outside';
  const statusTone =
    status === 'inside' ? 'good' : status === 'near-boundary' ? 'warning' : 'neutral';
  const statusTitle = airport
    ? `${airport.name} (${airport.iataCode})`
    : 'Not at an airport';
  const statusDetail = airport
    ? airport.city
    : 'No airport boundary contains your current GPS fix.';

  useEffect(() => {
    detectForLocation(location);
  }, [detectForLocation, location]);

  return (
    <Screen>
      <View style={styles.flowHeader}>
        <Text style={styles.flowStep}>SCREEN 2 OF 3</Text>
        <Text style={styles.flowTitle}>GEOFENCE VERDICT</Text>
      </View>

      <AirportMap
        airports={detection?.candidates ?? []}
        focusedAirport={airport}
        location={location}
        accuracyMeters={location.accuracy}
        showUnmatchedCandidates
      />

      <StatusPanel
        eyebrow={
          status === 'inside'
            ? 'Airport boundary matched'
            : status === 'near-boundary'
              ? 'Boundary edge case warning'
              : 'Outside known airport boundary'
        }
        title={airport ? airport.iataCode : statusTitle}
        detail={statusDetail}
        tone={statusTone}
      />

      {isLoading ? <ActivityIndicator color="#123C69" /> : null}
      {errorMessage ? <Text style={styles.warning}>{errorMessage}</Text> : null}

      <View style={styles.logPanel}>
        <Text style={styles.logTitle}>LOCATION SIGNAL</Text>
        <Text style={styles.logLine}>
          Stream: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)} |
          Accuracy: +/-{location.accuracy.toFixed(1)}m
        </Text>
        <Text style={styles.logLine}>
          Nearest mapped airport boundary:{' '}
          {formatBoundaryDistance(
            detection?.boundary.distanceToBoundaryMeters ??
              Number.POSITIVE_INFINITY,
          )}
        </Text>
      </View>

      <View style={styles.metrics}>
        {airport ? (
          <MetricTile label="Facility" value={airport.name} tone="good" />
        ) : null}
        <MetricTile label="Latitude" value={location.latitude.toFixed(6)} />
        <MetricTile label="Longitude" value={location.longitude.toFixed(6)} />
        <MetricTile
          label="Accuracy"
          value={`${location.accuracy.toFixed(1)} m`}
          tone="good"
        />
        <MetricTile
          label="Nearest boundary"
          value={formatBoundaryDistance(
            detection?.boundary.distanceToBoundaryMeters ??
              Number.POSITIVE_INFINITY,
          )}
          tone={status === 'near-boundary' ? 'warning' : 'default'}
        />
      </View>

      {detection?.status === 'near-boundary' ? (
        <View style={styles.edgeWarning}>
          <Text style={styles.edgeTitle}>BOUNDARY EDGE CASE WARNING</Text>
          <Text style={styles.edgeText}>
            Near boundary - GPS accuracy overlaps the airport perimeter.
          </Text>
        </View>
      ) : null}

      {airport ? (
        <ActionButton
          title="VIEW TERMINAL DETAILS"
          onPress={() =>
            detection
              ? navigation.navigate('TerminalDetail', {
                  airport,
                  location,
                  airportResult: detection.boundary,
                })
              : undefined
          }
        />
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  metrics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  flowHeader: {
    backgroundColor: '#0C2530',
    borderColor: '#214C58',
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 16,
  },
  flowStep: {
    color: '#8FB3BE',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0,
  },
  flowTitle: {
    color: '#F4FBFC',
    fontSize: 24,
    fontWeight: '900',
    marginTop: 6,
  },
  edgeWarning: {
    backgroundColor: '#30260B',
    borderColor: '#F6AE2D',
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 16,
  },
  edgeTitle: {
    color: '#F6AE2D',
    fontSize: 12,
    fontWeight: '900',
  },
  edgeText: {
    color: '#FBE7B2',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 6,
  },
  warning: {
    color: '#F6AE2D',
    fontSize: 14,
    fontWeight: '600',
  },
  logPanel: {
    backgroundColor: '#0C2530',
    borderColor: '#2B5863',
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 16,
  },
  logTitle: {
    color: '#B8F3E0',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0,
  },
  logLine: {
    color: '#D8E8EC',
    fontFamily: 'Menlo',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 8,
  },
});
