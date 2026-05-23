import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

interface MetricTileProps {
  label: string;
  value: string;
  tone?: 'default' | 'good' | 'warning' | 'critical';
}

export function MetricTile({
  label,
  value,
  tone = 'default',
}: MetricTileProps): React.JSX.Element {
  return (
    <View style={[styles.tile, styles[tone]]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value} numberOfLines={2}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    backgroundColor: 'rgba(12, 37, 48, 0.94)',
    borderColor: '#2B5863',
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    flex: 1,
    minHeight: 86,
    minWidth: '47%',
    padding: 14,
  },
  default: {
    borderLeftColor: '#5A7D8A',
    borderLeftWidth: 4,
  },
  good: {
    borderLeftColor: '#0B6B3A',
    borderLeftWidth: 4,
  },
  warning: {
    borderLeftColor: '#9A6200',
    borderLeftWidth: 4,
  },
  critical: {
    borderLeftColor: '#B42318',
    borderLeftWidth: 4,
  },
  label: {
    color: '#8FB3BE',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  value: {
    color: '#F4FBFC',
    fontSize: 18,
    fontWeight: '800',
    marginTop: 8,
  },
});
