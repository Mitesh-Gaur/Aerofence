import {Airport} from '../types/geofence';

export const AIRPORTS: Airport[] = [
  {
    id: 'offline/sfo',
    iataCode: 'SFO',
    name: 'San Francisco International Airport',
    city: 'San Francisco',
    state: 'California',
    country: 'USA',
    source: 'Local Offline Database',
    fetchedAt: 1747215683000,
    boundary: [
      {latitude: 37.632, longitude: -122.395},
      {latitude: 37.632, longitude: -122.365},
      {latitude: 37.608, longitude: -122.355},
      {latitude: 37.605, longitude: -122.385},
      {latitude: 37.615, longitude: -122.402},
    ],
    terminals: [
      {
        id: 'offline/sfo/t1',
        name: 'Terminal 1',
        polygon: [
          {latitude: 37.6235, longitude: -122.3815},
          {latitude: 37.6235, longitude: -122.3765},
          {latitude: 37.6195, longitude: -122.3765},
          {latitude: 37.6195, longitude: -122.3815},
        ],
      },
      {
        id: 'offline/sfo/t2',
        name: 'Terminal 2',
        polygon: [
          {latitude: 37.6210, longitude: -122.3725},
          {latitude: 37.6210, longitude: -122.3685},
          {latitude: 37.6170, longitude: -122.3685},
          {latitude: 37.6170, longitude: -122.3725},
        ],
      },
      {
        id: 'offline/sfo/t3',
        name: 'Terminal 3',
        polygon: [
          {latitude: 37.6285, longitude: -122.3905},
          {latitude: 37.6285, longitude: -122.3855},
          {latitude: 37.6245, longitude: -122.3855},
          {latitude: 37.6245, longitude: -122.3905},
        ],
      },
    ],
  },
];
