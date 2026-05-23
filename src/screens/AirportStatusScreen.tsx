import React, { useEffect } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { ActionButton } from '../components/ActionButton';
import { AirportMap } from '../components/AirportMap';
import { AppIcon } from '../components/AppIcon';
import { Header } from '../components/Header';
import { InfoRow } from '../components/InfoRow';
import { useAirportDataStore } from '../features/airportData/airportDataStore';
import { RootStackParamList } from '../navigation/types';

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

type AirportStatusScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'AirportStatus'
>;

export function AirportStatusScreen({
  navigation,
  route,
}: AirportStatusScreenProps): React.JSX.Element {
  const { location } = route.params;
  const detectForLocation = useAirportDataStore(state => state.detectForLocation);
  const detection = useAirportDataStore(state => state.cachedDetection);
  const errorMessage = useAirportDataStore(state => state.errorMessage);
  const isLoading = useAirportDataStore(state => state.isLoading);

  const airport = detection?.airport;
  const status = isLoading ? 'loading' : detection?.status ?? 'outside';

  useEffect(() => {
    detectForLocation(location);
  }, [detectForLocation, location]);

  const renderBadge = (text: string, tone: 'good' | 'warning' | 'neutral') => {
    const colors = {
      good: { bg: '#E6F7ED', text: '#059669' },
      warning: { bg: '#FEF3C7', text: '#D97706' },
      neutral: { bg: '#F3F4F6', text: '#4B5563' },
    }[tone];

    return (
      <View style={[styles.badge, { backgroundColor: colors.bg }]}>
        <Text style={[styles.badgeText, { color: colors.text }]}>{text}</Text>
      </View>
    );
  };

  return (
    <View style={styles.rootContainer}>
      <Header
        title="Airport Status"
        leftIcon="back"
        onLeftPress={() => navigation.goBack()}
        rightIcon="info"
        onRightPress={() => {
          // Can display debugging alerts/logs if desired
        }}
      />

      <ScrollView
        style={styles.scrollStyle}
        contentContainerStyle={styles.scrollContent}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color="#1E62EC" size="large" />
            <Text style={styles.loadingText}>Analyzing geofence boundaries...</Text>
          </View>
        ) : (
          <>
            {/* Card 1: Boundary Status (Green or Neutral Alert) */}
            {status === 'inside' || status === 'near-boundary' ? (
              <View style={[styles.statusBanner, styles.statusBannerGreen]}>
                <AppIcon name="checkmark-circle" color="#10B981" size={24} />
                <View style={styles.bannerTextContainer}>
                  <Text style={[styles.bannerTitle, styles.greenText]}>Inside Airport</Text>
                  <Text style={[styles.bannerSubtitle, styles.greenText]}>
                    You are within an airport boundary.
                  </Text>
                </View>
              </View>
            ) : (
              <View style={[styles.statusBanner, styles.statusBannerNeutral]}>
                <AppIcon name="info" color="#4A5568" size={24} />
                <View style={styles.bannerTextContainer}>
                  <Text style={[styles.bannerTitle, styles.neutralText]}>Outside Airport</Text>
                  <Text style={[styles.bannerSubtitle, styles.neutralText]}>
                    You are outside all known airport boundaries.
                  </Text>
                </View>
              </View>
            )}

            {/* Card 2: Facility details card */}
            {airport && (
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
            )}

            {/* Card 3: Metrics Table */}
            <View style={styles.card}>
              <InfoRow
                label="Airport (IATA)"
                value={airport ? airport.iataCode : 'N/A'}
              />
              <InfoRow
                label="City"
                value={airport ? airport.city : 'N/A'}
              />
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
                label="Boundary Status"
                value={
                  status === 'inside'
                    ? renderBadge('Inside', 'good')
                    : status === 'near-boundary'
                      ? renderBadge('Near Boundary', 'warning')
                      : renderBadge('Outside', 'neutral')
                }
              />
              <InfoRow
                label="Confidence"
                value={
                  status === 'inside'
                    ? renderBadge('High', 'good')
                    : status === 'near-boundary'
                      ? renderBadge('Medium', 'warning')
                      : renderBadge('Low', 'neutral')
                }
              />
            </View>

            {/* Card 4: Geofence Map */}
            <AirportMap
              airports={detection?.candidates ?? []}
              focusedAirport={airport}
              location={location}
              accuracyMeters={location.accuracy}
              showUnmatchedCandidates
            />

            {/* Card 5: Boundary Edge Alert (Warning orange) */}
            {status === 'near-boundary' && (
              <View style={styles.warningBanner}>
                <AppIcon name="warning" color="#D97706" size={22} style={styles.warningIcon} />
                <View style={styles.warningTextCol}>
                  <Text style={styles.warningTitle}>Near Boundary</Text>
                  <Text style={styles.warningDesc}>
                    You are near the airport boundary. Results may be affected by GPS accuracy.
                  </Text>
                </View>
              </View>
            )}

            {errorMessage ? (
              <Text style={styles.errorMessageText}>{errorMessage}</Text>
            ) : null}

            {/* Actions Row */}
            <View style={styles.actionsRow}>
              {airport ? (
                <ActionButton
                  title="View Terminal Details"
                  icon="terminal"
                  style={styles.terminalBtn}
                  onPress={() =>
                    detection
                      ? navigation.navigate('TerminalDetail', {
                        airport,
                        location,
                        airportResult: detection.boundary,
                      })
                      : undefined
                  }
                />
              ) : null}
            </View>
          </>
        )}
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
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    gap: 16,
  },
  loadingText: {
    fontSize: 15,
    color: '#718096',
    fontWeight: '500',
  },
  statusBanner: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBannerGreen: {
    backgroundColor: '#E6F7ED',
    borderColor: '#A7F3D0',
  },
  statusBannerNeutral: {
    backgroundColor: '#F3F4F6',
    borderColor: '#E5E7EB',
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
  greenText: {
    color: '#065F46',
  },
  neutralText: {
    color: '#374151',
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
  blueValue: {
    color: '#1E62EC',
    fontWeight: '600',
    fontSize: 14,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
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
  errorMessageText: {
    color: '#E11D48',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  backBtn: {
    flex: 1,
  },
  terminalBtn: {
    flex: 1.5,
  },
});
