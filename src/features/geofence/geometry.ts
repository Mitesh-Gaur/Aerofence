import {BoundaryCheckResult, Coordinate} from '../../types/geofence';

const EARTH_RADIUS_METERS = 6371000;

function toRadians(value: number): number {
  return (value * Math.PI) / 180;
}

function haversineDistanceMeters(a: Coordinate, b: Coordinate): number {
  const deltaLat = toRadians(b.latitude - a.latitude);
  const deltaLon = toRadians(b.longitude - a.longitude);
  const lat1 = toRadians(a.latitude);
  const lat2 = toRadians(b.latitude);

  const h =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) ** 2;

  return 2 * EARTH_RADIUS_METERS * Math.asin(Math.sqrt(h));
}

function projectToMeters(point: Coordinate, origin: Coordinate): {x: number; y: number} {
  const latScale = EARTH_RADIUS_METERS;
  const lonScale = EARTH_RADIUS_METERS * Math.cos(toRadians(origin.latitude));

  return {
    x: toRadians(point.longitude - origin.longitude) * lonScale,
    y: toRadians(point.latitude - origin.latitude) * latScale,
  };
}

function distanceToSegmentMeters(
  point: Coordinate,
  start: Coordinate,
  end: Coordinate,
): number {
  const p = projectToMeters(point, point);
  const a = projectToMeters(start, point);
  const b = projectToMeters(end, point);

  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const lengthSquared = dx * dx + dy * dy;

  if (lengthSquared === 0) {
    return haversineDistanceMeters(point, start);
  }

  const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / lengthSquared));
  const closest = {x: a.x + t * dx, y: a.y + t * dy};

  return Math.hypot(p.x - closest.x, p.y - closest.y);
}

export function isPointInPolygon(point: Coordinate, polygon: Coordinate[]): boolean {
  if (polygon.length < 3) {
    return false;
  }

  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const current = polygon[i];
    const previous = polygon[j];
    const intersects =
      current.longitude > point.longitude !== previous.longitude > point.longitude &&
      point.latitude <
        ((previous.latitude - current.latitude) * (point.longitude - current.longitude)) /
          (previous.longitude - current.longitude) +
          current.latitude;

    if (intersects) {
      inside = !inside;
    }
  }

  return inside;
}

export function distanceToPolygonBoundaryMeters(
  point: Coordinate,
  polygon: Coordinate[],
): number {
  if (polygon.length < 2) {
    return Number.POSITIVE_INFINITY;
  }

  let nearest = Number.POSITIVE_INFINITY;

  for (let i = 0; i < polygon.length; i++) {
    const start = polygon[i];
    const end = polygon[(i + 1) % polygon.length];
    nearest = Math.min(nearest, distanceToSegmentMeters(point, start, end));
  }

  return nearest;
}

export function checkPolygonBoundary(
  point: Coordinate,
  polygon: Coordinate[],
  accuracyMeters: number,
): BoundaryCheckResult {
  const inside = isPointInPolygon(point, polygon);
  const distanceToBoundaryMeters = distanceToPolygonBoundaryMeters(point, polygon);

  if (distanceToBoundaryMeters <= accuracyMeters) {
    return {status: 'near-boundary', distanceToBoundaryMeters};
  }

  return {
    status: inside ? 'inside' : 'outside',
    distanceToBoundaryMeters,
  };
}
