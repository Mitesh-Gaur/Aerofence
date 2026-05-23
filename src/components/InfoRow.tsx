import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useLocationStore} from '../features/location/locationStore';

interface InfoRowProps {
  label: string;
  value: React.ReactNode;
}

export function InfoRow({label, value}: InfoRowProps): React.JSX.Element {
  const isDarkMode = useLocationStore(state => state.isDarkMode);

  const rowStyle = [
    styles.row,
    {borderBottomColor: isDarkMode ? '#334155' : '#E2E8F0'},
  ];
  const labelStyle = [
    styles.label,
    {color: isDarkMode ? '#94A3B8' : '#718096'},
  ];
  const valueTextStyle = [
    styles.valueText,
    {color: isDarkMode ? '#F8FAFC' : '#1A202C'},
  ];

  return (
    <View style={rowStyle}>
      <Text style={labelStyle}>{label}</Text>
      <View style={styles.valueContainer}>
        {typeof value === 'string' ? (
          <Text style={valueTextStyle}>{value}</Text>
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
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  valueContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  valueText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'right',
  },
});
