/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {StyleSheet, Text, View, StyleProp, ViewStyle} from 'react-native';

export type IconType =
  | 'airplane'
  | 'settings'
  | 'info'
  | 'checkmark'
  | 'checkmark-circle'
  | 'warning'
  | 'home'
  | 'back'
  | 'location-target'
  | 'terminal'
  | 'close';

interface AppIconProps {
  name: IconType;
  color?: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

export function AppIcon({
  name,
  color = '#4A5568',
  size = 24,
  style,
}: AppIconProps): React.JSX.Element {
  if (name === 'location-target') {
    return (
      <View
        style={[
          styles.container,
          {width: size, height: size},
          style,
        ]}>
        {/* Outer Circle */}
        <View
          style={{
            width: size * 0.7,
            height: size * 0.7,
            borderRadius: (size * 0.7) / 2,
            borderWidth: Math.max(1.5, size * 0.08),
            borderColor: color,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {/* Center Dot */}
          <View
            style={{
              width: size * 0.25,
              height: size * 0.25,
              borderRadius: (size * 0.25) / 2,
              backgroundColor: color,
            }}
          />
        </View>
        {/* Crosshair Ticks */}
        <View
          style={{
            position: 'absolute',
            top: 0,
            width: Math.max(1.5, size * 0.08),
            height: size * 0.2,
            backgroundColor: color,
          }}
        />
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            width: Math.max(1.5, size * 0.08),
            height: size * 0.2,
            backgroundColor: color,
          }}
        />
        <View
          style={{
            position: 'absolute',
            left: 0,
            height: Math.max(1.5, size * 0.08),
            width: size * 0.2,
            backgroundColor: color,
          }}
        />
        <View
          style={{
            position: 'absolute',
            right: 0,
            height: Math.max(1.5, size * 0.08),
            width: size * 0.2,
            backgroundColor: color,
          }}
        />
      </View>
    );
  }

  if (name === 'terminal') {
    return (
      <View
        style={[
          styles.container,
          {width: size, height: size},
          style,
        ]}>
        {/* Lintel/Roof */}
        <View
          style={{
            width: size * 0.8,
            height: size * 0.15,
            backgroundColor: color,
            borderRadius: 1,
          }}
        />
        {/* Pillars */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: size * 0.7,
            height: size * 0.45,
            marginTop: size * 0.05,
          }}
        >
          <View style={{width: size * 0.1, backgroundColor: color, borderRadius: 0.5}} />
          <View style={{width: size * 0.1, backgroundColor: color, borderRadius: 0.5}} />
          <View style={{width: size * 0.1, backgroundColor: color, borderRadius: 0.5}} />
          <View style={{width: size * 0.1, backgroundColor: color, borderRadius: 0.5}} />
        </View>
        {/* Base */}
        <View
          style={{
            width: size * 0.9,
            height: size * 0.1,
            backgroundColor: color,
            borderRadius: 1,
            marginTop: size * 0.02,
          }}
        />
      </View>
    );
  }

  if (name === 'checkmark-circle') {
    return (
      <View
        style={[
          styles.container,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: color,
          },
          style,
        ]}>
        <Text
          style={{
            color: '#FFFFFF',
            fontSize: size * 0.6,
            fontWeight: '900',
            textAlign: 'center',
            lineHeight: size,
          }}>
          {'\u2714\uFE0E'}
        </Text>
      </View>
    );
  }

  // Unicode fallback mapping
  let glyph = '';
  switch (name) {
    case 'airplane':
      glyph = '\u2708\uFE0E';
      break;
    case 'settings':
      glyph = '\u2699\uFE0E';
      break;
    case 'info':
      glyph = '\u2139\uFE0E';
      break;
    case 'checkmark':
      glyph = '\u2714\uFE0E';
      break;
    case 'warning':
      glyph = '\u26A0\uFE0E';
      break;
    case 'home':
      glyph = '\u2302\uFE0E';
      break;
    case 'back':
      glyph = '\u2190\uFE0E';
      break;
    case 'close':
      glyph = '\u2715\uFE0E';
      break;
  }

  return (
    <View style={[styles.container, {width: size, height: size}, style]}>
      <Text
        style={{
          color,
          fontSize: size,
          fontWeight: 'normal',
          lineHeight: size,
          textAlign: 'center',
        }}>
        {glyph}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
