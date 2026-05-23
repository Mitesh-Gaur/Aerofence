jest.mock(
  'react-native-gesture-handler',
  () => {
    const {View} = require('react-native');

    return {
      GestureHandlerRootView: View,
      PanGestureHandler: View,
      TapGestureHandler: View,
      State: {},
      Directions: {},
    };
  },
  {virtual: true},
);

jest.mock('react-native-geolocation-service', () => ({
  requestAuthorization: jest.fn(() => Promise.resolve('granted')),
  watchPosition: jest.fn(() => 1),
  clearWatch: jest.fn(),
}));

jest.mock('react-native-maps', () => {
  const React = require('react');
  const {View} = require('react-native');
  const MockMap = (props: Record<string, unknown>) => React.createElement(View, props);

  return {
    __esModule: true,
    default: MockMap,
    Circle: MockMap,
    Marker: MockMap,
    Polygon: MockMap,
    PROVIDER_GOOGLE: 'google',
  };
});
