import {AIRPORTS} from '../../data/airports';
import {
  Airport,
  AirportDetectionResult,
  BoundaryCheckResult,
  LocationFix,
  TerminalDetectionResult,
} from '../../types/geofence';
import {checkPolygonBoundary} from './geometry';

export function detectAirport(location: LocationFix): AirportDetectionResult {
  return detectAirportFromDataset(location, AIRPORTS);
}

export function detectAirportFromDataset(
  location: LocationFix,
  airports: Airport[],
): AirportDetectionResult {
  let nearestBoundary: BoundaryCheckResult = {
    status: 'outside',
    distanceToBoundaryMeters: Number.POSITIVE_INFINITY,
  };

  for (const airport of airports) {
    const boundary = checkPolygonBoundary(
      location,
      airport.boundary,
      location.accuracy,
    );

    if (
      boundary.distanceToBoundaryMeters <
      nearestBoundary.distanceToBoundaryMeters
    ) {
      nearestBoundary = boundary;
    }

    if (boundary.status !== 'outside') {
      return {status: boundary.status, airport, boundary, candidates: airports};
    }
  }

  return {
    status: 'outside',
    candidates: airports,
    boundary: nearestBoundary,
  };
}

export function detectTerminal(
  airport: Airport,
  location: LocationFix,
): TerminalDetectionResult {
  for (const terminal of airport.terminals) {
    const boundary = checkPolygonBoundary(
      location,
      terminal.polygon,
      location.accuracy,
    );

    if (boundary.status !== 'outside') {
      return {
        status: boundary.status,
        terminal,
        label: terminal.name,
        boundary,
      };
    }
  }

  return {
    status: 'outside',
    label: 'Airside area / non-terminal zone',
    boundary: {
      status: 'outside',
      distanceToBoundaryMeters: Number.POSITIVE_INFINITY,
    },
  };
}
