import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

interface StatusPanelProps {
  eyebrow: string;
  title: string;
  detail?: string;
  tone?: 'good' | 'warning' | 'critical' | 'neutral';
}

export function StatusPanel({
  eyebrow,
  title,
  detail,
  tone = 'neutral',
}: StatusPanelProps): React.JSX.Element {
  return (
    <View style={[styles.panel, styles[tone]]}>
      <Text style={[styles.eyebrow, styles[`${tone}Text`]]}>{eyebrow}</Text>
      <Text style={styles.title}>{title}</Text>
      {detail ? <Text style={styles.detail}>{detail}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    borderRadius: 8,
    padding: 20,
  },
  neutral: {
    backgroundColor: '#0C2530',
    borderColor: '#214C58',
    borderWidth: StyleSheet.hairlineWidth,
  },
  good: {
    backgroundColor: '#082B26',
    borderColor: '#00A878',
    borderWidth: StyleSheet.hairlineWidth,
  },
  warning: {
    backgroundColor: '#30260B',
    borderColor: '#F6AE2D',
    borderWidth: StyleSheet.hairlineWidth,
  },
  critical: {
    backgroundColor: '#331719',
    borderColor: '#E85D75',
    borderWidth: StyleSheet.hairlineWidth,
  },
  neutralText: {
    color: '#8FB3BE',
  },
  goodText: {
    color: '#34D399',
  },
  warningText: {
    color: '#F6AE2D',
  },
  criticalText: {
    color: '#FB7185',
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  title: {
    color: '#F4FBFC',
    fontSize: 34,
    fontWeight: '900',
    marginTop: 8,
  },
  detail: {
    color: '#B7CED6',
    fontSize: 15,
    lineHeight: 21,
    marginTop: 8,
  },
});
