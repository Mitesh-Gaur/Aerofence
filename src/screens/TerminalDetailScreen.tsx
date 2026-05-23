import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { ActionButton } from '../components/ActionButton';
import { AirportMap } from '../components/AirportMap';
import { AppIcon } from '../components/AppIcon';
import { Header } from '../components/Header';
import { InfoRow } from '../components/InfoRow';
import { detectTerminal } from '../features/geofence/detection';
import { RootStackParamList } from '../navigation/types';

type TerminalDetailScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'TerminalDetail'
>;

function getTerminalType(name: string): string {
  if (name.toLowerCase().includes('international')) {
    return 'International Terminal';
  }
  return 'Domestic Terminal';
}

function formatAirportLocation(airport: {
  city: string;
  state?: string;
  country?: string;
  iataCode?: string;
}): string {
  const parts = [airport.city];
  if (airport.state) {
    parts.push(airport.state);
  }
  if (airport.country) {
    parts.push(airport.country);
  }
  if (parts.length === 1 && airport.iataCode === 'SFO') {
    return 'San Francisco, California, USA';
  }
  return parts.join(', ');
}

export function TerminalDetailScreen({
  navigation,
  route,
}: TerminalDetailScreenProps): React.JSX.Element {
  const { airport, location } = route.params;

  const terminalDetection = useMemo(
    () => detectTerminal(airport, location),
    [airport, location],
  );

  const status = terminalDetection.status;
  const isInside = status === 'inside' || status === 'near-boundary';

  const terminalName = terminalDetection.terminal?.name ?? 'Terminal 1';
  const terminalType = getTerminalType(terminalName);

  return (
    <View style={styles.rootContainer}>
      <Header
        title="Terminal Details"
        leftIcon="back"
        onLeftPress={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.scrollStyle}
        contentContainerStyle={styles.scrollContent}>

        {/* Card 1: Facility details card (same as Screen 2) */}
        <View style={styles.card}>
          <View style={styles.facilityRow}>
            <View style={styles.iconCircleBlue}>
              <AppIcon name="airplane" color="#FFFFFF" size={18} />
            </View>
            <View style={styles.facilityInfo}>
              <Text style={styles.facilityName} numberOfLines={2}>
                {airport.name}
              </Text>
              <Text style={styles.facilityCity}>
                {formatAirportLocation(airport)}
              </Text>
            </View>
            <View style={styles.iataCodeBadge}>
              <Text style={styles.iataCodeText}>{airport.iataCode}</Text>
            </View>
          </View>
        </View>

        {/* Card 2: Terminal detected status (Green layout) */}
        {isInside ? (
          <View style={styles.terminalBanner}>
            <AppIcon name="terminal" color="#059669" size={24} />
            <View style={styles.bannerTextContainer}>
              <Text style={styles.bannerTitle}>{terminalName}</Text>
              <Text style={styles.bannerSubtitle}>{terminalType}</Text>
            </View>
            <View style={styles.detectedBadge}>
              <Text style={styles.detectedText}>Detected</Text>
            </View>
          </View>
        ) : (
          <View style={styles.terminalBannerNeutral}>
            <AppIcon name="info" color="#4B5563" size={24} />
            <View style={styles.bannerTextContainer}>
              <Text style={styles.bannerTitleNeutral}>Airside area</Text>
              <Text style={styles.bannerSubtitleNeutral}>Non-terminal zone</Text>
            </View>
          </View>
        )}

        {/* Card 3: Geofence Map */}
        <AirportMap
          airports={[airport]}
          focusedAirport={airport}
          focusedTerminal={terminalDetection.terminal}
          location={location}
          accuracyMeters={location.accuracy}
        />

        {/* Card 4: Metrics Table */}
        <View style={styles.card}>
          <InfoRow label="Airport (IATA)" value={airport.iataCode} />
          <InfoRow
            label="Terminal"
            value={
              <Text style={styles.greenValue}>
                {isInside ? terminalName : 'None'}
              </Text>
            }
          />
          <InfoRow label="Terminal Type" value={isInside ? terminalType : 'N/A'} />
          <InfoRow
            label="User Coordinates"
            value={
              <Text style={styles.blueValue}>
                {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
              </Text>
            }
          />
          <InfoRow
            label="Accuracy"
            value={<Text style={styles.blueValue}>{location.accuracy.toFixed(1)} m</Text>}
          />
          <InfoRow
            label="Detection Status"
            value={
              <Text
                style={[
                  styles.statusValue,
                  isInside ? styles.greenStatus : styles.neutralStatus,
                ]}>
                {isInside ? 'Inside Terminal Polygon' : 'Outside Terminal Polygons'}
              </Text>
            }
          />
        </View>

        {/* Terminal warning (yellow, visible if status is 'near-boundary') */}
        {status === 'near-boundary' && (
          <View style={styles.warningBanner}>
            <AppIcon name="warning" color="#D97706" size={22} style={styles.warningIcon} />
            <View style={styles.warningTextCol}>
              <Text style={styles.warningTitle}>Terminal Boundary Alert</Text>
              <Text style={styles.warningDesc}>
                GPS accuracy overlaps a terminal boundary. Terminal match is slightly uncertain.
              </Text>
            </View>
          </View>
        )}

        {/* Bottom Actions Row (Both are outline/secondary buttons) */}
        <View style={styles.actionsRow}>
          <ActionButton
            title="Back to Home"
            variant="primary"
            style={styles.actionBtn}
            onPress={() => navigation.popToTop()}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollStyle: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  facilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircleBlue: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#1E62EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  facilityInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  facilityName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A202C',
  },
  facilityCity: {
    fontSize: 12,
    color: '#718096',
    marginTop: 2,
  },
  iataCodeBadge: {
    backgroundColor: '#EBF3FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  iataCodeText: {
    color: '#1E62EC',
    fontSize: 11,
    fontWeight: '700',
  },
  terminalBanner: {
    backgroundColor: '#E6F7ED',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  terminalBannerNeutral: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#065F46',
  },
  bannerSubtitle: {
    fontSize: 12,
    color: '#047857',
    marginTop: 2,
    fontWeight: '500',
  },
  bannerTitleNeutral: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
  },
  bannerSubtitleNeutral: {
    fontSize: 12,
    color: '#4B5563',
    marginTop: 2,
    fontWeight: '500',
  },
  detectedBadge: {
    backgroundColor: '#DEF7EC',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  detectedText: {
    color: '#03543F',
    fontSize: 12,
    fontWeight: '700',
  },
  blueValue: {
    color: '#1E62EC',
    fontWeight: '600',
    fontSize: 14,
  },
  greenValue: {
    color: '#10B981',
    fontWeight: '700',
    fontSize: 14,
  },
  statusValue: {
    fontWeight: '600',
    fontSize: 14,
  },
  greenStatus: {
    color: '#10B981',
  },
  neutralStatus: {
    color: '#4B5563',
  },
  warningBanner: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  warningIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  warningTextCol: {
    flex: 1,
  },
  warningTitle: {
    color: '#B45309',
    fontSize: 14,
    fontWeight: '700',
  },
  warningDesc: {
    color: '#B45309',
    fontSize: 12,
    marginTop: 2,
    lineHeight: 16,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  actionBtn: {
    flex: 1,
  },
});
