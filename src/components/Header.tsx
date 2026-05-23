import React from 'react';
import {StyleSheet, Text, View, Pressable} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {AppIcon, IconType} from './AppIcon';
import {useLocationStore} from '../features/location/locationStore';

interface HeaderProps {
  title: string;
  leftIcon?: IconType;
  leftIconBgColor?: string;
  leftIconColor?: string;
  onLeftPress?: () => void;
  rightIcon?: IconType;
  onRightPress?: () => void;
}

export function Header({
  title,
  leftIcon,
  leftIconBgColor,
  leftIconColor,
  onLeftPress,
  rightIcon,
  onRightPress,
}: HeaderProps): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const isDarkMode = useLocationStore(state => state.isDarkMode);

  // Theme styles
  const defaultIconColor = isDarkMode ? '#94A3B8' : '#4A5568';
  const activeLeftIconColor = leftIconColor || defaultIconColor;
  const headerContainerStyle = [
    styles.headerContainer,
    isDarkMode ? styles.darkContainer : styles.lightContainer,
    {paddingTop: Math.max(insets.top, 12)},
  ];
  const titleStyle = [
    styles.titleText,
    {color: isDarkMode ? '#F8FAFC' : '#1A202C'},
  ];

  return (
    <View style={headerContainerStyle}>
      <View style={styles.actionContainer}>
        {leftIcon ? (
          <Pressable
            onPress={onLeftPress}
            disabled={!onLeftPress}
            style={({pressed}) => [
              styles.iconBtn,
              leftIconBgColor ? {backgroundColor: leftIconBgColor} : undefined,
              pressed && onLeftPress ? styles.pressed : undefined,
            ]}>
            <AppIcon
              name={leftIcon}
              color={leftIconBgColor ? '#FFFFFF' : activeLeftIconColor}
              size={leftIconBgColor ? 18 : 24}
            />
          </Pressable>
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>

      <Text style={titleStyle}>{title}</Text>

      <View style={styles.actionContainer}>
        {rightIcon ? (
          <Pressable
            onPress={onRightPress}
            disabled={!onRightPress}
            style={({pressed}) => [
              styles.iconBtn,
              pressed && onRightPress ? styles.pressed : undefined,
            ]}>
            <AppIcon name={rightIcon} color={defaultIconColor} size={24} />
          </Pressable>
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  lightContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomColor: '#E2E8F0',
  },
  darkContainer: {
    backgroundColor: '#1E293B',
    borderBottomColor: '#334155',
  },
  actionContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    width: 36,
    height: 36,
  },
  titleText: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    flex: 1,
  },
  pressed: {
    opacity: 0.6,
  },
});
