/* eslint-disable react-native/no-inline-styles */
import React, {PropsWithChildren} from 'react';
import {ScrollView, StyleSheet, type ViewStyle} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useLocationStore} from '../features/location/locationStore';

interface ScreenProps extends PropsWithChildren {
  contentContainerStyle?: ViewStyle;
}

export function Screen({
  children,
  contentContainerStyle,
}: ScreenProps): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const isDarkMode = useLocationStore(state => state.isDarkMode);

  return (
    <ScrollView
      style={[
        styles.container,
        {backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC'},
      ]}
      contentContainerStyle={[
        styles.content,
        {paddingBottom: Math.max(insets.bottom, 20)},
        contentContainerStyle,
      ]}>
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 16,
  },
});
