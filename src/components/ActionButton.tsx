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
import {useLocationStore} from '../features/location/locationStore';

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
  const isDarkMode = useLocationStore(state => state.isDarkMode);

  // Dynamic Theme Styling
  const buttonStyle = [
    styles.button,
    variant === 'primary'
      ? styles.primary
      : isDarkMode
        ? styles.secondaryDark
        : styles.secondaryLight,
    disabled
      ? isDarkMode
        ? styles.disabledDark
        : styles.disabledLight
      : undefined,
    style,
  ];

  const labelStyle = [
    styles.label,
    variant === 'primary'
      ? styles.primaryLabel
      : isDarkMode
        ? styles.secondaryLabelDark
        : styles.secondaryLabelLight,
    disabled
      ? isDarkMode
        ? styles.disabledLabelDark
        : styles.disabledLabelLight
      : undefined,
  ];

  const subtitleStyle = [
    styles.subtitle,
    variant === 'primary'
      ? styles.primarySubtitle
      : isDarkMode
        ? styles.secondarySubtitleDark
        : styles.secondarySubtitleLight,
    disabled
      ? isDarkMode
        ? styles.disabledSubtitleDark
        : styles.disabledSubtitleLight
      : undefined,
  ];

  const iconColor = disabled
    ? isDarkMode
      ? '#475569'
      : '#94A3B8'
    : variant === 'primary'
      ? '#FFFFFF'
      : isDarkMode
        ? '#F8FAFC'
        : '#4A5568';

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({pressed}) => [
        buttonStyle,
        pressed && !disabled ? styles.pressed : undefined,
      ]}>
      <View style={styles.contentContainer}>
        {icon ? (
          <AppIcon
            name={icon}
            color={iconColor}
            size={18}
            style={styles.iconStyle}
          />
        ) : null}
        <View style={styles.textContainer}>
          <Text style={labelStyle}>{title}</Text>
          {subtitle ? <Text style={subtitleStyle}>{subtitle}</Text> : null}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
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
    // Shadow
    shadowColor: '#1E62EC',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },
  secondaryLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
  },
  secondaryDark: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
  },
  disabledLight: {
    backgroundColor: '#E2E8F0',
    borderColor: '#E2E8F0',
    shadowOpacity: 0,
    elevation: 0,
  },
  disabledDark: {
    backgroundColor: '#334155',
    borderColor: '#334155',
    shadowOpacity: 0,
    elevation: 0,
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
  secondaryLabelLight: {
    color: '#1A202C',
  },
  secondaryLabelDark: {
    color: '#F8FAFC',
  },
  disabledLabelLight: {
    color: '#94A3B8',
  },
  disabledLabelDark: {
    color: '#475569',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
    textAlign: 'center',
  },
  primarySubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  secondarySubtitleLight: {
    color: '#718096',
  },
  secondarySubtitleDark: {
    color: '#94A3B8',
  },
  disabledSubtitleLight: {
    color: '#CBD5E1',
  },
  disabledSubtitleDark: {
    color: '#475569',
  },
});
