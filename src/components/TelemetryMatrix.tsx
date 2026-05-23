import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

interface TelemetryMatrixProps {
  latitude: string;
  longitude: string;
  accuracy: string;
  status: string;
  precisionRatio: number;
}

export function TelemetryMatrix({
  latitude,
  longitude,
  accuracy,
  status,
  precisionRatio,
}: TelemetryMatrixProps): React.JSX.Element {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>LIVE TELEMETRY MATRIX</Text>
      <View style={styles.divider} />
      <View style={styles.row}>
        <Text style={styles.label}>LATITUDE</Text>
        <Text style={styles.value}>[ {latitude} ]</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>LONGITUDE</Text>
        <Text style={styles.value}>[ {longitude} ]</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.row}>
        <Text style={styles.label}>GPS MARGIN</Text>
        <Text style={styles.value}>[ {accuracy} ]</Text>
      </View>
      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            {width: `${Math.min(Math.max(precisionRatio, 0), 1) * 100}%`},
          ]}
        />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>STATUS</Text>
        <Text style={styles.status}>{status}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(9, 35, 45, 0.92)',
    borderColor: '#2BD6A3',
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 18,
    shadowColor: '#00A878',
    shadowOpacity: 0.18,
    shadowRadius: 18,
  },
  title: {
    color: '#B8F3E0',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0,
  },
  divider: {
    backgroundColor: '#2B5863',
    height: StyleSheet.hairlineWidth,
    marginVertical: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  label: {
    color: '#8FB3BE',
    fontFamily: 'Menlo',
    fontSize: 12,
    fontWeight: '800',
  },
  value: {
    color: '#F4FBFC',
    flex: 1,
    fontFamily: 'Menlo',
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'right',
  },
  status: {
    color: '#34D399',
    flex: 1,
    fontSize: 13,
    fontWeight: '900',
    textAlign: 'right',
  },
  track: {
    backgroundColor: '#183A45',
    borderRadius: 999,
    height: 8,
    marginVertical: 10,
    overflow: 'hidden',
  },
  fill: {
    backgroundColor: '#2BD6A3',
    height: 8,
  },
});
