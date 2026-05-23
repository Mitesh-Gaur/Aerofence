import {AIRPORTS} from '../../data/airports';
import {Airport, Coordinate, LocationFix, Terminal} from '../../types/geofence';
import {getPolygonCenter} from '../geofence/coordinateUtils';
import {isPointInPolygon} from '../geofence/geometry';

const OVERPASS_ENDPOINT = 'https://overpass-api.de/api/interpreter';
const SEARCH_RADIUS_METERS = 50000;
const MIN_POLYGON_VERTICES = 4;

interface OverpassElementTags {
  name?: string;
  iata?: string;
  icao?: string;
  ref?: string;
  addrCity?: string;
  addrState?: string;
  addrCountry?: string;
  aeroway?: string;
}

interface OverpassElement {
  type: 'way' | 'relation';
  id: number;
  tags: OverpassElementTags;
  geometry: Coordinate[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function readString(record: Record<string, unknown>, key: string): string | undefined {
  const value = record[key];
  return typeof value === 'string' ? value : undefined;
}

function readTags(value: unknown): OverpassElementTags {
  if (!isRecord(value)) {
    return {};
  }

  return {
    name: readString(value, 'name'),
    iata: readString(value, 'iata'),
    icao: readString(value, 'icao'),
    ref: readString(value, 'ref'),
    addrCity: readString(value, 'addr:city'),
    addrState: readString(value, 'addr:state'),
    addrCountry: readString(value, 'addr:country'),
    aeroway: readString(value, 'aeroway'),
  };
}

function readGeometry(value: unknown): Coordinate[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap(item => {
    if (!isRecord(item)) {
      return [];
    }

    const latitude = item.lat;
    const longitude = item.lon;

    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return [];
    }

    return [{latitude, longitude}];
  });
}

function parseOverpassElements(payload: unknown): OverpassElement[] {
  if (!isRecord(payload) || !Array.isArray(payload.elements)) {
    return [];
  }

  return payload.elements.flatMap(item => {
    if (!isRecord(item)) {
      return [];
    }

    const type = item.type;
    const id = item.id;
    const tags = readTags(item.tags);
    const geometry = readGeometry(item.geometry);

    if (
      (type !== 'way' && type !== 'relation') ||
      typeof id !== 'number' ||
      geometry.length < MIN_POLYGON_VERTICES
    ) {
      return [];
    }

    return [{type, id, tags, geometry}];
  });
}

function getElementName(element: OverpassElement): string {
  return element.tags.name ?? `OSM ${element.type} ${element.id}`;
}

function getAirportCode(element: OverpassElement): string {
  return element.tags.iata?.toUpperCase() ?? 'N/A';
}

function toTerminal(element: OverpassElement): Terminal {
  return {
    id: `${element.type}/${element.id}`,
    name: getElementName(element),
    polygon: element.geometry,
  };
}

function attachTerminals(airports: Airport[], terminals: Terminal[]): Airport[] {
  return airports.map(airport => ({
    ...airport,
    terminals: terminals.filter(terminal => {
      const center = getPolygonCenter(terminal.polygon);
      return center ? isPointInPolygon(center, airport.boundary) : false;
    }),
  }));
}

function toAirports(elements: OverpassElement[]): Airport[] {
  const fetchedAt = Date.now();
  const airportElements = elements.filter(
    element =>
      element.tags.aeroway === 'aerodrome' &&
      element.tags.iata !== undefined &&
      element.tags.iata.length === 3,
  );
  const terminalElements = elements.filter(
    element => element.tags.aeroway === 'terminal',
  );
  const terminals = terminalElements.map(toTerminal);

  const airports = airportElements.map<Airport>(element => ({
    id: `${element.type}/${element.id}`,
    iataCode: getAirportCode(element),
    name: getElementName(element),
    city: element.tags.addrCity ?? 'Unknown city',
    state: element.tags.addrState,
    country: element.tags.addrCountry,
    source: `OpenStreetMap Overpass API (${element.type}/${element.id})`,
    fetchedAt,
    boundary: element.geometry,
    terminals: [],
  }));

  return attachTerminals(airports, terminals);
}

function buildAirportQuery(location: LocationFix): string {
  return `
    [out:json][timeout:25];
    (
      way["aeroway"="aerodrome"](around:${SEARCH_RADIUS_METERS},${location.latitude},${location.longitude});
      relation["aeroway"="aerodrome"](around:${SEARCH_RADIUS_METERS},${location.latitude},${location.longitude});
      way["aeroway"="terminal"](around:${SEARCH_RADIUS_METERS},${location.latitude},${location.longitude});
      relation["aeroway"="terminal"](around:${SEARCH_RADIUS_METERS},${location.latitude},${location.longitude});
    );
    out tags geom;
  `;
}

export async function fetchNearbyAirports(
  location: LocationFix,
): Promise<Airport[]> {
  const response = await fetch(OVERPASS_ENDPOINT, {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
    body: `data=${encodeURIComponent(buildAirportQuery(location))}`,
  });

  if (!response.ok) {
    throw new Error(`Overpass request failed with status ${response.status}`);
  }

  const payload: unknown = await response.json();
  const airports = toAirports(parseOverpassElements(payload));

  return airports.length > 0 ? airports : AIRPORTS;
}
