import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

interface InfoRowProps {
  label: string;
  value: string;
}

export function InfoRow({label, value}: InfoRowProps): React.JSX.Element {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#CFD8E3',
  },
  label: {
    color: '#526173',
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
  value: {
    color: '#17202A',
    flex: 1,
    fontSize: 14,
    textAlign: 'right',
  },
});
