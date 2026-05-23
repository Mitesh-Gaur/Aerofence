export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface LocationFix extends Coordinate {
  accuracy: number;
  timestamp: number;
}

export interface Terminal {
  id: string;
  name: string;
  polygon: Coordinate[];
}

export interface Airport {
  id: string;
  iataCode: string;
  name: string;
  city: string;
  state?: string;
  country?: string;
  source: string;
  fetchedAt?: number;
  boundary: Coordinate[];
  terminals: Terminal[];
}

export type BoundaryStatus = 'inside' | 'outside' | 'near-boundary';

export interface BoundaryCheckResult {
  status: BoundaryStatus;
  distanceToBoundaryMeters: number;
}

export interface AirportDetectionResult {
  status: BoundaryStatus;
  airport?: Airport;
  boundary: BoundaryCheckResult;
  candidates: Airport[];
}

export interface TerminalDetectionResult {
  status: BoundaryStatus;
  terminal?: Terminal;
  label: string;
  boundary: BoundaryCheckResult;
}
