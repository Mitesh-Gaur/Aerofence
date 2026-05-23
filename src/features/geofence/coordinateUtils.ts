import {Coordinate} from '../../types/geofence';

export function getPolygonCenter(polygon: Coordinate[]): Coordinate | undefined {
  if (polygon.length === 0) {
    return undefined;
  }

  const total = polygon.reduce(
    (accumulator, coordinate) => ({
      latitude: accumulator.latitude + coordinate.latitude,
      longitude: accumulator.longitude + coordinate.longitude,
    }),
    {latitude: 0, longitude: 0},
  );

  return {
    latitude: total.latitude / polygon.length,
    longitude: total.longitude / polygon.length,
  };
}

export function getMapRegion(
  coordinates: Coordinate[],
): {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
} {
  if (coordinates.length === 0) {
    return {
      latitude: 0,
      longitude: 0,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    };
  }

  const latitudes = coordinates.map(coordinate => coordinate.latitude);
  const longitudes = coordinates.map(coordinate => coordinate.longitude);
  const minLatitude = Math.min(...latitudes);
  const maxLatitude = Math.max(...latitudes);
  const minLongitude = Math.min(...longitudes);
  const maxLongitude = Math.max(...longitudes);

  return {
    latitude: (minLatitude + maxLatitude) / 2,
    longitude: (minLongitude + maxLongitude) / 2,
    latitudeDelta: Math.max((maxLatitude - minLatitude) * 1.4, 0.02),
    longitudeDelta: Math.max((maxLongitude - minLongitude) * 1.4, 0.02),
  };
}
