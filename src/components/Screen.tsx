import React, {PropsWithChildren} from 'react';
import {ScrollView, StyleSheet, ViewStyle} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface ScreenProps extends PropsWithChildren {
  contentContainerStyle?: ViewStyle;
}

export function Screen({
  children,
  contentContainerStyle,
}: ScreenProps): React.JSX.Element {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.container}
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
    backgroundColor: '#061A22',
  },
  content: {
    padding: 20,
    gap: 16,
  },
});
