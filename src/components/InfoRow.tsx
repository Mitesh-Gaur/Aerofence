import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

interface InfoRowProps {
  label: string;
  value: React.ReactNode;
}

export function InfoRow({label, value}: InfoRowProps): React.JSX.Element {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.valueContainer}>
        {typeof value === 'string' ? (
          <Text style={styles.valueText}>{value}</Text>
        ) : (
          value
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  label: {
    color: '#718096',
    fontSize: 14,
    fontWeight: '500',
  },
  valueContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  valueText: {
    color: '#1A202C',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'right',
  },
});
