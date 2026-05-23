import React, {useMemo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {StackActions} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import {ActionButton} from '../components/ActionButton';
import {AirportMap} from '../components/AirportMap';
import {MetricTile} from '../components/MetricTile';
import {Screen} from '../components/Screen';
import {StatusPanel} from '../components/StatusPanel';
import {detectTerminal} from '../features/geofence/detection';
import {RootStackParamList} from '../navigation/types';

type TerminalDetailScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'TerminalDetail'
>;

export function TerminalDetailScreen({
  navigation,
  route,
}: TerminalDetailScreenProps): React.JSX.Element {
  const {airport, location, airportResult} = route.params;
  const terminalDetection = useMemo(
    () => detectTerminal(airport, location),
    [airport, location],
  );
  const ambiguityResolution =
    terminalDetection.status === 'near-boundary'
      ? 'Overlap handled by boundary proximity and GPS accuracy radius.'
      : 'Boundary resolved by terminal polygon containment.';

  return (
    <Screen>
      <View style={styles.flowHeader}>
        <Text style={styles.flowStep}>SCREEN 3 OF 3</Text>
        <Text style={styles.flowTitle}>{airport.iataCode} INFRASTRUCTURE</Text>
      </View>

      <AirportMap
        airports={[airport]}
        focusedAirport={airport}
        focusedTerminal={terminalDetection.terminal}
        location={location}
        accuracyMeters={location.accuracy}
      />

      <StatusPanel
        eyebrow="Current infrastructure node"
        title={terminalDetection.label}
        detail={ambiguityResolution}
        tone={
          terminalDetection.status === 'inside'
            ? 'good'
            : terminalDetection.status === 'near-boundary'
              ? 'warning'
              : 'neutral'
        }
      />

      <View style={styles.metrics}>
        <MetricTile label="Airport" value={airport.iataCode} tone="good" />
        <MetricTile label="City" value={airport.city} />
        <MetricTile label="Zone" value={terminalDetection.label} tone="good" />
        <MetricTile label="Latitude" value={location.latitude.toFixed(6)} />
        <MetricTile label="Longitude" value={location.longitude.toFixed(6)} />
        <MetricTile label="Accuracy" value={`${location.accuracy.toFixed(1)} m`} />
        <MetricTile label="Airport boundary" value={airportResult.status} />
      </View>

      <View style={styles.breakdownPanel}>
        <Text style={styles.breakdownTitle}>COMPLETE AGGREGATED BREAKDOWN</Text>
        <Text style={styles.breakdownLine}>FACILITY : {airport.name}</Text>
        <Text style={styles.breakdownLine}>
          HUB IATA : {airport.iataCode} ({airport.city})
        </Text>
        <Text style={styles.breakdownLine}>ZONE     : {terminalDetection.label}</Text>
        <Text style={styles.breakdownLine}>
          GPS FIX  : {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
        </Text>
        <Text style={styles.breakdownLine}>
          ACCURACY : +/-{location.accuracy.toFixed(1)} meters
        </Text>
      </View>

      <Text style={styles.source}>{airport.source || 'Boundary source unavailable'}</Text>

      {terminalDetection.status === 'near-boundary' ? (
        <Text style={styles.warning}>
          Terminal match is uncertain because GPS accuracy overlaps a terminal boundary.
        </Text>
      ) : null}

      <ActionButton
        title="BACK TO AIRPORT STATUS"
        variant="secondary"
        onPress={() => navigation.goBack()}
      />
      <ActionButton
        title="TERMINATE FLOW AND RESET HOME"
        onPress={() => navigation.dispatch(StackActions.popToTop())}
      />
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
  source: {
    color: '#8FB3BE',
    fontSize: 13,
    lineHeight: 18,
  },
  warning: {
    color: '#F6AE2D',
    fontSize: 14,
    fontWeight: '600',
  },
  breakdownPanel: {
    backgroundColor: '#0C2530',
    borderColor: '#2B5863',
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 16,
  },
  breakdownTitle: {
    color: '#B8F3E0',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0,
    marginBottom: 10,
  },
  breakdownLine: {
    color: '#F4FBFC',
    fontFamily: 'Menlo',
    fontSize: 12,
    lineHeight: 21,
  },
});
