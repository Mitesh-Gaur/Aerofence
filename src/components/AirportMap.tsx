import React, {useRef, useEffect} from 'react';
import {StyleSheet, View, Pressable} from 'react-native';
import MapView, {Circle, Marker, Polygon, PROVIDER_GOOGLE} from 'react-native-maps';

import {getMapRegion} from '../features/geofence/coordinateUtils';
import {Airport, Coordinate, Terminal} from '../types/geofence';
import {AppIcon} from './AppIcon';

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
  const mapRef = useRef<MapView | null>(null);

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

  const coordsKey = coordinates.map(c => `${c.latitude}:${c.longitude}`).join(',');

  // Animate to fit all coordinates (user location + geofence polygons) when coordinates change
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.animateToRegion(getMapRegion(coordinates), 600);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coordsKey]);

  const handleRecenter = () => {
    if (mapRef.current) {
      mapRef.current.animateToRegion(getMapRegion(coordinates), 600);
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={getMapRegion(coordinates)}>
        {visibleAirports.map(airport => (
          <Polygon
            key={airport.id}
            coordinates={airport.boundary.map(toLatLng)}
            fillColor="rgba(16, 185, 129, 0.08)"
            strokeColor="#10B981"
            strokeWidth={2}
          />
        ))}

        {visibleTerminals.map(terminal => {
          const isFocused = terminal.id === focusedTerminal?.id;
          return (
            <Polygon
              key={terminal.id}
              coordinates={terminal.polygon.map(toLatLng)}
              fillColor={
                isFocused
                  ? 'rgba(16, 185, 129, 0.16)'
                  : 'rgba(160, 174, 192, 0.08)'
              }
              strokeColor={isFocused ? '#10B981' : '#A0AEC0'}
              strokeWidth={2}
            />
          );
        })}

        <Circle
          center={toLatLng(location)}
          radius={accuracyMeters}
          fillColor="rgba(30, 98, 236, 0.08)"
          strokeColor="#1E62EC"
          strokeWidth={1}
        />

        <Marker coordinate={toLatLng(location)} anchor={{x: 0.5, y: 0.5}}>
          <View style={styles.userDotOuter}>
            <View style={styles.userDotInner} />
          </View>
        </Marker>
      </MapView>

      {/* Floating Recenter Button */}
      <Pressable
        style={({pressed}) => [
          styles.recenterButton,
          pressed ? styles.pressed : undefined,
        ]}
        onPress={handleRecenter}>
        <AppIcon name="location-target" color="#1E62EC" size={20} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    height: 220,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  userDotOuter: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  userDotInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#1E62EC',
  },
  recenterButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  pressed: {
    opacity: 0.85,
    backgroundColor: '#F8FAFC',
  },
});
