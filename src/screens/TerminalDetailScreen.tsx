/* eslint-disable react-native/no-inline-styles */
import React, {useMemo} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import {ActionButton} from '../components/ActionButton';
import {AirportMap} from '../components/AirportMap';
import {AppIcon} from '../components/AppIcon';
import {Header} from '../components/Header';
import {InfoRow} from '../components/InfoRow';
import {ThemeAwareCard} from '../components/ThemeAwareCard';
import {detectTerminal} from '../features/geofence/detection';
import {useLocationStore} from '../features/location/locationStore';
import {RootStackParamList} from '../navigation/types';

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
  const {airport, location} = route.params;
  const isDarkMode = useLocationStore(state => state.isDarkMode);

  const terminalDetection = useMemo(
    () => detectTerminal(airport, location),
    [airport, location],
  );

  const status = terminalDetection.status;
  const isInside = status === 'inside' || status === 'near-boundary';

  const terminalName = terminalDetection.terminal?.name ?? 'Terminal 1';
  const terminalType = getTerminalType(terminalName);

  // Theme-aware styles
  const textColor = isDarkMode ? '#F8FAFC' : '#1A202C';
  const subtitleColor = isDarkMode ? '#94A3B8' : '#718096';

  return (
    <View style={[
      styles.rootContainer,
      {backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC'}
    ]}>
      <Header
        title="Terminal Details"
        leftIcon="back"
        onLeftPress={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.scrollStyle}
        contentContainerStyle={styles.scrollContent}>
        
        {/* Card 1: Facility details card (same as Screen 2) */}
        <ThemeAwareCard>
          <View style={styles.facilityRow}>
            <View style={styles.iconCircleBlue}>
              <AppIcon name="airplane" color="#FFFFFF" size={18} />
            </View>
            <View style={styles.facilityInfo}>
              <Text style={[styles.facilityName, {color: textColor}]} numberOfLines={2}>
                {airport.name}
              </Text>
              <Text style={[styles.facilityCity, {color: subtitleColor}]}>
                {formatAirportLocation(airport)}
              </Text>
            </View>
            <View style={[
              styles.iataCodeBadge,
              {backgroundColor: isDarkMode ? 'rgba(30, 98, 236, 0.12)' : '#EBF3FF'}
            ]}>
              <Text style={styles.iataCodeText}>{airport.iataCode}</Text>
            </View>
          </View>
        </ThemeAwareCard>

        {/* Card 2: Terminal detected status (Green layout) */}
        {isInside ? (
          <View style={[
            styles.terminalBanner,
            isDarkMode ? styles.terminalBannerDark : styles.terminalBannerLight
          ]}>
            <AppIcon name="terminal" color="#059669" size={24} />
            <View style={styles.bannerTextContainer}>
              <Text style={[styles.bannerTitle, isDarkMode ? styles.greenTextDark : styles.greenTextLight]}>{terminalName}</Text>
              <Text style={[styles.bannerSubtitle, isDarkMode ? styles.greenTextDark : styles.greenTextLight]}>{terminalType}</Text>
            </View>
            <View style={[
              styles.detectedBadge,
              isDarkMode ? styles.detectedBadgeDark : styles.detectedBadgeLight
            ]}>
              <Text style={[styles.detectedText, isDarkMode ? styles.greenTextDark : styles.greenTextLight]}>Detected</Text>
            </View>
          </View>
        ) : (
          <View style={[
            styles.terminalBannerNeutral,
            isDarkMode ? styles.terminalBannerNeutralDark : styles.terminalBannerNeutralLight
          ]}>
            <AppIcon name="info" color={isDarkMode ? '#94A3B8' : '#4B5563'} size={24} />
            <View style={styles.bannerTextContainer}>
              <Text style={[styles.bannerTitleNeutral, {color: textColor}]}>Airside area</Text>
              <Text style={[styles.bannerSubtitleNeutral, {color: subtitleColor}]}>Non-terminal zone</Text>
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
        <ThemeAwareCard>
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
        </ThemeAwareCard>

        {/* Terminal warning (yellow, visible if status is 'near-boundary') */}
        {status === 'near-boundary' && (
          <View style={[
            styles.warningBanner,
            {
              backgroundColor: isDarkMode ? 'rgba(217, 119, 6, 0.08)' : '#FEF3C7',
              borderColor: isDarkMode ? 'rgba(217, 119, 6, 0.25)' : '#FDE68A'
            }
          ]}>
            <AppIcon name="warning" color="#D97706" size={22} style={styles.warningIcon} />
            <View style={styles.warningTextCol}>
              <Text style={[styles.warningTitle, {color: isDarkMode ? '#F59E0B' : '#B45309'}]}>Terminal Boundary Alert</Text>
              <Text style={[styles.warningDesc, {color: isDarkMode ? '#F59E0B' : '#B45309'}]}>
                GPS accuracy overlaps a terminal boundary. Terminal match is slightly uncertain.
              </Text>
            </View>
          </View>
        )}

        {/* Bottom Actions Row */}
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
  },
  scrollStyle: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 16,
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
    fontSize: 18,
    fontWeight: '700',
  },
  facilityCity: {
    fontSize: 12,
    marginTop: 2,
  },
  iataCodeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#1E62EC',
  },
  iataCodeText: {
    color: '#1E62EC',
    fontSize: 11,
    fontWeight: '700',
  },
  terminalBanner: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  terminalBannerLight: {
    backgroundColor: '#E6F7ED',
    borderColor: '#A7F3D0',
  },
  terminalBannerDark: {
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderColor: 'rgba(16, 185, 129, 0.25)',
  },
  terminalBannerNeutral: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  terminalBannerNeutralLight: {
    backgroundColor: '#F3F4F6',
    borderColor: '#E5E7EB',
  },
  terminalBannerNeutralDark: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
  },
  bannerTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  bannerSubtitle: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: '500',
  },
  greenTextLight: {
    color: '#065F46',
  },
  greenTextDark: {
    color: '#10B981',
  },
  bannerTitleNeutral: {
    fontSize: 16,
    fontWeight: '700',
  },
  bannerSubtitleNeutral: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: '500',
  },
  detectedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  detectedBadgeLight: {
    backgroundColor: '#DEF7EC',
    borderColor: '#10B981',
  },
  detectedBadgeDark: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderColor: '#10B981',
  },
  detectedText: {
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
    borderWidth: 1,
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
    fontSize: 14,
    fontWeight: '700',
  },
  warningDesc: {
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
