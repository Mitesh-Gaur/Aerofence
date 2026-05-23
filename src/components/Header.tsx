import React from 'react';
import {StyleSheet, Text, View, Pressable} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {AppIcon, IconType} from './AppIcon';

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
  leftIconColor = '#4A5568',
  onLeftPress,
  rightIcon,
  onRightPress,
}: HeaderProps): React.JSX.Element {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.headerContainer, {paddingTop: Math.max(insets.top, 12)}]}>
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
              color={leftIconBgColor ? '#FFFFFF' : leftIconColor}
              size={leftIconBgColor ? 18 : 24}
            />
          </Pressable>
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>

      <Text style={styles.titleText}>{title}</Text>

      <View style={styles.actionContainer}>
        {rightIcon ? (
          <Pressable
            onPress={onRightPress}
            disabled={!onRightPress}
            style={({pressed}) => [
              styles.iconBtn,
              pressed && onRightPress ? styles.pressed : undefined,
            ]}>
            <AppIcon name={rightIcon} color="#4A5568" size={24} />
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
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
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
    color: '#1A202C',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    flex: 1,
  },
  pressed: {
    opacity: 0.6,
  },
});
