import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {AirportStatusScreen} from '../screens/AirportStatusScreen';
import {HomeScreen} from '../screens/HomeScreen';
import {TerminalDetailScreen} from '../screens/TerminalDetailScreen';
import {RootStackParamList} from '../navigation/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{title: 'Airport Geofence'}}
        />
        <Stack.Screen
          name="AirportStatus"
          component={AirportStatusScreen}
          options={{title: 'Airport Status'}}
        />
        <Stack.Screen
          name="TerminalDetail"
          component={TerminalDetailScreen}
          options={{title: 'Terminal Detail'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
