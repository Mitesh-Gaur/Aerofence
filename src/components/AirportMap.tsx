import React from 'react';
import {StyleSheet, View} from 'react-native';
import MapView, {Circle, Marker, Polygon, PROVIDER_GOOGLE} from 'react-native-maps';

import {getMapRegion} from '../features/geofence/coordinateUtils';
import {Airport, Coordinate, Terminal} from '../types/geofence';

interface AirportMapProps {
  airports: Airport[];
  focusedAirport?: Airport;
  focusedTerminal?: Terminal;
  location: Coordinate;
  accuracyMeters: number;
  showUnmatchedCandidates?: boolean;
}

function toLatLng(coordinate: Coordinate): {
  latitude: number;
  longitude: number;
} {
  return {
    latitude: coordinate.latitude,
    longitude: coordinate.longitude,
  };
}

export function AirportMap({
  airports,
  focusedAirport,
  focusedTerminal,
  location,
  accuracyMeters,
  showUnmatchedCandidates = false,
}: AirportMapProps): React.JSX.Element {
  const visibleAirports = focusedAirport
    ? [focusedAirport]
    : showUnmatchedCandidates
      ? airports
      : [];
  const visibleTerminals = focusedAirport?.terminals ?? [];
  const coordinates = [
    location,
    ...visibleAirports.flatMap(airport => airport.boundary),
    ...visibleTerminals.flatMap(terminal => terminal.polygon),
  ];

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={getMapRegion(coordinates)}
        region={getMapRegion(coordinates)}>
        {visibleAirports.map(airport => (
          <Polygon
            key={airport.id}
            coordinates={airport.boundary.map(toLatLng)}
            fillColor="rgba(18, 60, 105, 0.12)"
            strokeColor="#123C69"
            strokeWidth={2}
          />
        ))}

        {visibleTerminals.map(terminal => (
          <Polygon
            key={terminal.id}
            coordinates={terminal.polygon.map(toLatLng)}
            fillColor={
              terminal.id === focusedTerminal?.id
                ? 'rgba(11, 107, 58, 0.28)'
                : 'rgba(246, 174, 45, 0.22)'
            }
            strokeColor={terminal.id === focusedTerminal?.id ? '#0B6B3A' : '#9A6200'}
            strokeWidth={2}
          />
        ))}

        <Circle
          center={toLatLng(location)}
          radius={accuracyMeters}
          fillColor="rgba(197, 48, 48, 0.12)"
          strokeColor="#C53030"
          strokeWidth={1}
        />
        <Marker coordinate={toLatLng(location)} title="Current location" />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    height: 300,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
});
