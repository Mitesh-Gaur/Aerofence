import {Airport, BoundaryCheckResult, LocationFix} from '../types/geofence';

export type RootStackParamList = {
  Home: undefined;
  AirportStatus: {
    location: LocationFix;
  };
  TerminalDetail: {
    airport: Airport;
    location: LocationFix;
    airportResult: BoundaryCheckResult;
  };
};
