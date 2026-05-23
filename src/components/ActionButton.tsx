import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

interface ActionButtonProps {
  title: string;
  disabled?: boolean;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  style?: StyleProp<ViewStyle>;
}

export function ActionButton({
  title,
  disabled = false,
  onPress,
  variant = 'primary',
  style,
}: ActionButtonProps): React.JSX.Element {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({pressed}) => [
        styles.button,
        variant === 'primary' ? styles.primary : styles.secondary,
        disabled ? styles.disabled : undefined,
        pressed && !disabled ? styles.pressed : undefined,
        style,
      ]}>
      <Text
        style={[
          styles.label,
          variant === 'primary' ? styles.primaryLabel : styles.secondaryLabel,
          disabled ? styles.disabledLabel : undefined,
        ]}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderColor: '#76FFD2',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 8,
    justifyContent: 'center',
    minHeight: 64,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  primary: {
    backgroundColor: '#008F6A',
  },
  secondary: {
    backgroundColor: '#102C35',
    borderColor: '#2C5662',
    borderWidth: StyleSheet.hairlineWidth,
  },
  disabled: {
    backgroundColor: '#263B43',
  },
  pressed: {
    opacity: 0.82,
  },
  label: {
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0,
  },
  primaryLabel: {
    color: '#FFFFFF',
  },
  secondaryLabel: {
    color: '#B8F3E0',
  },
  disabledLabel: {
    color: '#78919A',
  },
});
