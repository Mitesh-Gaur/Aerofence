/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef} from 'react';
import {ActivityIndicator, Animated, ScrollView, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import {ActionButton} from '../components/ActionButton';
import {AirportMap} from '../components/AirportMap';
import {AppIcon} from '../components/AppIcon';
import {Header} from '../components/Header';
import {InfoRow} from '../components/InfoRow';
import {ThemeAwareCard} from '../components/ThemeAwareCard';
import {useAirportDataStore} from '../features/airportData/airportDataStore';
import {useLocationStore} from '../features/location/locationStore';
import {RootStackParamList} from '../navigation/types';

type AirportStatusScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'AirportStatus'
>;

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

export function AirportStatusScreen({
  navigation,
  route,
}: AirportStatusScreenProps): React.JSX.Element {
  const {location} = route.params;
  const detectForLocation = useAirportDataStore(state => state.detectForLocation);
  const detection = useAirportDataStore(state => state.cachedDetection);
  const errorMessage = useAirportDataStore(state => state.errorMessage);
  const isLoading = useAirportDataStore(state => state.isLoading);
  const isDarkMode = useLocationStore(state => state.isDarkMode);

  const airport = detection?.airport;
  const status = isLoading ? 'loading' : detection?.status ?? 'outside';

  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Pulse animation for the loading plane
  useEffect(() => {
    if (isLoading) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.3,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1.0,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else {
      scaleAnim.setValue(1);
    }
  }, [isLoading, scaleAnim]);

  useEffect(() => {
    detectForLocation(location);
  }, [detectForLocation, location]);

  const renderBadge = (text: string, tone: 'good' | 'warning' | 'neutral') => {
    const colors = isDarkMode
      ? {
          good: {bg: 'rgba(16, 185, 129, 0.12)', text: '#10B981'},
          warning: {bg: 'rgba(217, 119, 6, 0.12)', text: '#F59E0B'},
          neutral: {bg: 'rgba(148, 163, 184, 0.12)', text: '#94A3B8'},
        }[tone]
      : {
          good: {bg: '#E6F7ED', text: '#059669'},
          warning: {bg: '#FEF3C7', text: '#D97706'},
          neutral: {bg: '#F3F4F6', text: '#4B5563'},
        }[tone];

    return (
      <View style={[styles.badge, {backgroundColor: colors.bg}]}>
        <Text style={[styles.badgeText, {color: colors.text}]}>{text}</Text>
      </View>
    );
  };

  // Theme-aware styles
  const textColor = isDarkMode ? '#F8FAFC' : '#1A202C';
  const subtitleColor = isDarkMode ? '#94A3B8' : '#718096';

  return (
    <View style={[
      styles.rootContainer,
      {backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC'}
    ]}>
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
            <Animated.View style={{transform: [{scale: scaleAnim}]}}>
              <AppIcon name="airplane" color="#1E62EC" size={48} />
            </Animated.View>
            <ActivityIndicator color="#1E62EC" style={{marginTop: 8}} />
            <Text style={[styles.loadingText, {color: subtitleColor}]}>
              Searching nearby airports...
            </Text>
            <Text style={[styles.loadingSubtext, {color: subtitleColor}]}>
              Connecting to OpenStreetMap Overpass
            </Text>
          </View>
        ) : (
          <>
            {/* Card 1: Boundary Status (Green or Neutral Alert) */}
            {status === 'inside' || status === 'near-boundary' ? (
              <View style={[
                styles.statusBanner,
                isDarkMode ? styles.statusBannerGreenDark : styles.statusBannerGreenLight
              ]}>
                <AppIcon name="checkmark-circle" color="#10B981" size={24} />
                <View style={styles.bannerTextContainer}>
                  <Text style={[
                    styles.bannerTitle,
                    isDarkMode ? styles.greenTextDark : styles.greenTextLight
                  ]}>Inside Airport</Text>
                  <Text style={[
                    styles.bannerSubtitle,
                    isDarkMode ? styles.greenTextDark : styles.greenTextLight
                  ]}>
                    You are within an airport boundary.
                  </Text>
                </View>
              </View>
            ) : (
              <View style={[
                styles.statusBanner,
                isDarkMode ? styles.statusBannerNeutralDark : styles.statusBannerNeutralLight
              ]}>
                <AppIcon name="info" color={isDarkMode ? '#94A3B8' : '#4B5563'} size={24} />
                <View style={styles.bannerTextContainer}>
                  <Text style={[
                    styles.bannerTitle,
                    isDarkMode ? styles.neutralTextDark : styles.neutralTextLight
                  ]}>Outside Airport</Text>
                  <Text style={[
                    styles.bannerSubtitle,
                    isDarkMode ? styles.neutralTextDark : styles.neutralTextLight
                  ]}>
                    You are outside all known airport boundaries.
                  </Text>
                </View>
              </View>
            )}

            {/* Error / API Fallback Warning Banner */}
            {errorMessage ? (
              <View style={[
                styles.warningBanner,
                {
                  backgroundColor: isDarkMode ? 'rgba(239, 68, 68, 0.08)' : '#FFF1F2',
                  borderColor: isDarkMode ? 'rgba(239, 68, 68, 0.25)' : '#FECDD3'
                }
              ]}>
                <AppIcon name="warning" color="#FB7185" size={22} style={styles.warningIcon} />
                <View style={styles.warningTextCol}>
                  <Text style={[styles.warningTitle, {color: '#E11D48'}]}>API Fetch Failure</Text>
                  <Text style={[styles.warningDesc, {color: isDarkMode ? '#FDA4AF' : '#E11D48'}]}>
                    {errorMessage.includes('Network') || errorMessage.includes('status')
                      ? 'OSM Overpass API offline. Falling back to offline database.'
                      : errorMessage}
                  </Text>
                </View>
              </View>
            ) : null}

            {/* Card 2: Facility details card */}
            {airport ? (
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
            ) : (
              // Empty State Box when Outside Airport
              <ThemeAwareCard style={styles.emptyStateCard}>
                <AppIcon name="airplane" color={isDarkMode ? '#475569' : '#CBD5E1'} size={40} />
                <Text style={[styles.emptyStateTitle, {color: textColor}]}>No Airport Found</Text>
                <Text style={[styles.emptyStateDesc, {color: subtitleColor}]}>
                  Your current location does not match any known airport perimeter. Check SFO Simulation in Developer Settings to test airport-specific states.
                </Text>
              </ThemeAwareCard>
            )}

            {/* Card 3: Metrics Table */}
            <ThemeAwareCard>
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
            </ThemeAwareCard>

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
              <View style={[
                styles.warningBanner,
                {
                  backgroundColor: isDarkMode ? 'rgba(217, 119, 6, 0.08)' : '#FEF3C7',
                  borderColor: isDarkMode ? 'rgba(217, 119, 6, 0.25)' : '#FDE68A'
                }
              ]}>
                <AppIcon name="warning" color="#D97706" size={22} style={styles.warningIcon} />
                <View style={styles.warningTextCol}>
                  <Text style={[styles.warningTitle, {color: isDarkMode ? '#F59E0B' : '#B45309'}]}>Near Boundary</Text>
                  <Text style={[styles.warningDesc, {color: isDarkMode ? '#F59E0B' : '#B45309'}]}>
                    You are near the airport boundary. Results may be affected by GPS accuracy.
                  </Text>
                </View>
              </View>
            )}

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
    gap: 10,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 16,
  },
  loadingSubtext: {
    fontSize: 12,
    fontWeight: '500',
  },
  statusBanner: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBannerGreenLight: {
    backgroundColor: '#E6F7ED',
    borderColor: '#A7F3D0',
  },
  statusBannerGreenDark: {
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderColor: 'rgba(16, 185, 129, 0.25)',
  },
  statusBannerNeutralLight: {
    backgroundColor: '#F3F4F6',
    borderColor: '#E5E7EB',
  },
  statusBannerNeutralDark: {
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
  neutralTextLight: {
    color: '#374151',
  },
  neutralTextDark: {
    color: '#94A3B8',
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
  terminalBtn: {
    flex: 1,
  },
  emptyStateCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    gap: 10,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 6,
  },
  emptyStateDesc: {
    fontSize: 12,
    textAlign: 'center',
    paddingHorizontal: 16,
    lineHeight: 18,
  },
});
