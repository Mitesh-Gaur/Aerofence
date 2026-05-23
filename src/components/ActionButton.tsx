import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import {AppIcon, IconType} from './AppIcon';

interface ActionButtonProps {
  title: string;
  subtitle?: string;
  disabled?: boolean;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  icon?: IconType;
  style?: StyleProp<ViewStyle>;
}

export function ActionButton({
  title,
  subtitle,
  disabled = false,
  onPress,
  variant = 'primary',
  icon,
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
      <View style={styles.contentContainer}>
        {icon ? (
          <AppIcon
            name={icon}
            color={
              disabled
                ? '#94A3B8'
                : variant === 'primary'
                  ? '#FFFFFF'
                  : '#4A5568'
            }
            size={18}
            style={styles.iconStyle}
          />
        ) : null}
        <View style={styles.textContainer}>
          <Text
            style={[
              styles.label,
              variant === 'primary' ? styles.primaryLabel : styles.secondaryLabel,
              disabled ? styles.disabledLabel : undefined,
            ]}>
            {title}
          </Text>
          {subtitle ? (
            <Text
              style={[
                styles.subtitle,
                variant === 'primary' ? styles.primarySubtitle : styles.secondarySubtitle,
                disabled ? styles.disabledSubtitle : undefined,
              ]}>
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderColor: '#E2E8F0',
    borderWidth: 1,
    borderRadius: 12,
    justifyContent: 'center',
    minHeight: 52,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconStyle: {
    marginRight: 8,
  },
  textContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: '#1E62EC',
    borderColor: '#1E62EC',
  },
  secondary: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
  },
  disabled: {
    backgroundColor: '#E2E8F0',
    borderColor: '#E2E8F0',
  },
  pressed: {
    opacity: 0.85,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  primaryLabel: {
    color: '#FFFFFF',
  },
  secondaryLabel: {
    color: '#1A202C',
  },
  disabledLabel: {
    color: '#94A3B8',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
    textAlign: 'center',
  },
  primarySubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  secondarySubtitle: {
    color: '#718096',
  },
  disabledSubtitle: {
    color: '#CBD5E1',
  },
});
