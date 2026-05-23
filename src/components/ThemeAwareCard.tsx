import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet, type StyleProp, type ViewStyle} from 'react-native';
import {useLocationStore} from '../features/location/locationStore';

interface ThemeAwareCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function ThemeAwareCard({
  children,
  style,
}: ThemeAwareCardProps): React.JSX.Element {
  const isDarkMode = useLocationStore(state => state.isDarkMode);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const cardThemeStyles = isDarkMode ? styles.darkCard : styles.lightCard;

  return (
    <Animated.View
      style={[
        styles.card,
        cardThemeStyles,
        {opacity: fadeAnim},
        style,
      ]}>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  lightCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    // Shadow
    shadowColor: '#1E293B',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  darkCard: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
    // Shadow
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
});
