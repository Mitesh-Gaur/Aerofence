/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import {ActionButton} from '../components/ActionButton';
import {AppIcon} from '../components/AppIcon';
import {Header} from '../components/Header';
import {ThemeAwareCard} from '../components/ThemeAwareCard';
import {useLocationStore} from '../features/location/locationStore';
import {useLocationSubscription} from '../features/location/useLocationSubscription';
import {RootStackParamList} from '../navigation/types';

const REQUIRED_ACCURACY_METERS = 25;

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

function formatTimestamp(timestamp?: number): string {
  if (!timestamp) {
    return 'Getting GPS lock...';
  }
  return new Date(timestamp).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
}

export function HomeScreen({navigation}: HomeScreenProps): React.JSX.Element {
  useLocationSubscription();

  const currentLocation = useLocationStore(state => state.currentLocation);
  const errorMessage = useLocationStore(state => state.errorMessage);
  const isDemoMode = useLocationStore(state => state.isDemoMode);
  const setDemoMode = useLocationStore(state => state.setDemoMode);
  const isDarkMode = useLocationStore(state => state.isDarkMode);
  const setDarkMode = useLocationStore(state => state.setDarkMode);

  const [settingsVisible, setSettingsVisible] = useState(false);

  const canCheckAirport =
    currentLocation !== undefined &&
    currentLocation.accuracy <= REQUIRED_ACCURACY_METERS;

  const isAccuracyGood = currentLocation && currentLocation.accuracy <= REQUIRED_ACCURACY_METERS;

  // Theme-aware styles
  const textColor = isDarkMode ? '#F8FAFC' : '#1A202C';
  const subtitleColor = isDarkMode ? '#94A3B8' : '#718096';
  const dividerColor = isDarkMode ? '#334155' : '#E2E8F0';

  return (
    <View style={[
      styles.rootContainer,
      {backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC'}
    ]}>
      <Header
        title="Aerofence"
        leftIcon="airplane"
        leftIconBgColor="#1E62EC"
        rightIcon="settings"
        onRightPress={() => setSettingsVisible(true)}
      />

      <ScrollView
        style={styles.scrollStyle}
        contentContainerStyle={styles.scrollContent}>
        
        {/* Card 1: GPS Lock Status */}
        <ThemeAwareCard>
          <View style={styles.row}>
            <View style={styles.iconCircleBlue}>
              <AppIcon name="map-pin" color="#1E62EC" size={20} />
            </View>
            <View style={styles.textColumn}>
              <Text style={[styles.cardTitle, {color: textColor}]}>
                {currentLocation ? 'Location Active' : 'Location Acquiring'}
              </Text>
              <Text style={[styles.cardSubtitle, {color: subtitleColor}]}>
                {currentLocation
                  ? 'GPS tracking signal established.'
                  : 'Getting your current location...'}
              </Text>
            </View>
            <View style={styles.rightAction}>
              {currentLocation ? (
                <View style={[styles.checkmarkBadge, {backgroundColor: isDarkMode ? '#1E293B' : '#EBF3FF'}]}>
                  <AppIcon name="checkmark" color="#1E62EC" size={14} />
                </View>
              ) : (
                <ActivityIndicator color="#1E62EC" size="small" />
              )}
            </View>
          </View>
        </ThemeAwareCard>

        {/* Card 2: Live Location Data */}
        {currentLocation && (
          <ThemeAwareCard>
            <View style={[styles.row, styles.bottomSpacing]}>
              <Text style={[styles.liveLocationTitle, {color: textColor}]}>Live Location</Text>
              <View style={styles.updatingContainer}>
                <View style={styles.greenPulseDot} />
                <Text style={styles.updatingText}>Updating...</Text>
              </View>
            </View>

            <View style={styles.stackedGroup}>
              <Text style={[styles.label, {color: subtitleColor}]}>Latitude</Text>
              <Text style={styles.coordinateValue}>
                {currentLocation.latitude.toFixed(6)}
              </Text>
            </View>

            <View style={styles.stackedGroup}>
              <Text style={[styles.label, {color: subtitleColor}]}>Longitude</Text>
              <Text style={styles.coordinateValue}>
                {currentLocation.longitude.toFixed(6)}
              </Text>
            </View>

            <View style={[styles.divider, {backgroundColor: dividerColor}]} />

            <View style={styles.row}>
              <View style={styles.metricRow}>
                <AppIcon name="crosshair" color={subtitleColor} size={16} style={styles.metricIcon} />
                <Text style={[styles.label, {color: subtitleColor}]}>Accuracy</Text>
              </View>
              <View style={styles.rightMetricContainer}>
                <Text style={[
                  styles.metricValue,
                  isAccuracyGood ? styles.goodColor : styles.warningColor
                ]}>
                  {currentLocation.accuracy.toFixed(1)} m
                </Text>
                <Text style={[
                  styles.accuracyHelperText,
                  isAccuracyGood ? styles.goodColor : styles.warningColor
                ]}>
                  {isAccuracyGood ? 'High accuracy' : 'Acquiring lock...'}
                </Text>
              </View>
            </View>

            <View style={[styles.divider, {backgroundColor: dividerColor}]} />

            <View style={styles.row}>
              <View style={styles.metricRow}>
                <AppIcon name="clock" color={subtitleColor} size={16} style={styles.metricIcon} />
                <Text style={[styles.label, {color: subtitleColor}]}>Last Updated</Text>
              </View>
            </View>
            <Text style={[styles.timestampText, {color: textColor}]}>
              {formatTimestamp(currentLocation.timestamp)}
            </Text>
          </ThemeAwareCard>
        )}

        {/* Card 3: Threshold Notice (Blue layout) */}
        <View style={[
          styles.thresholdNotice,
          {
            backgroundColor: isDarkMode ? 'rgba(30, 98, 236, 0.08)' : '#EBF3FF',
            borderColor: isDarkMode ? 'rgba(30, 98, 236, 0.25)' : '#BFDBFE'
          }
        ]}>
          <AppIcon name="info" color="#1E62EC" size={20} style={styles.thresholdIcon} />
          <Text style={styles.thresholdText}>
            We'll enable airport detection when accuracy is ≤ {REQUIRED_ACCURACY_METERS} meters.
          </Text>
        </View>

        {errorMessage ? (
          <View style={styles.errorCard}>
            <AppIcon name="warning" color="#FB7185" size={20} style={styles.thresholdIcon} />
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : null}

        {/* Main Action Button */}
        <ActionButton
          title="Check Airport Status"
          subtitle={
            isAccuracyGood
              ? 'Enabled (accuracy good)'
              : 'Awaiting high accuracy...'
          }
          icon="navigation"
          disabled={!canCheckAirport}
          onPress={() => {
            if (currentLocation) {
              navigation.navigate('AirportStatus', {location: currentLocation});
            }
          }}
        />
      </ScrollView>

      {/* Developer Settings Modal */}
      <Modal
        visible={settingsVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSettingsVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[
            styles.modalContent,
            {backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF'}
          ]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, {color: textColor}]}>Developer Settings</Text>
              <Pressable
                onPress={() => setSettingsVisible(false)}
                style={[
                  styles.modalCloseBtn,
                  {backgroundColor: isDarkMode ? '#334155' : '#F1F5F9'}
                ]}>
                <AppIcon name="close" color={textColor} size={18} />
              </Pressable>
            </View>

            {/* Toggle 1: Mock Location */}
            <View style={styles.modalRow}>
              <View style={styles.modalTextCol}>
                <Text style={[styles.modalSettingTitle, {color: textColor}]}>Mock SFO Airport Location</Text>
                <Text style={[styles.modalSettingDesc, {color: subtitleColor}]}>
                  Simulate GPS fixes at SFO Terminal 1 (37.621312, -122.378955, accuracy: 12.4m) to test geofencing boundaries.
                </Text>
              </View>
              <Switch
                value={isDemoMode}
                onValueChange={val => {
                  setDemoMode(val);
                }}
                trackColor={{false: '#CBD5E1', true: '#BFDBFE'}}
                thumbColor={isDemoMode ? '#1E62EC' : '#F1F5F9'}
              />
            </View>

            {/* Toggle 2: Dark Mode */}
            <View style={styles.modalRow}>
              <View style={styles.modalTextCol}>
                <View style={{flexDirection: 'row', alignItems: 'center', gap: 6}}>
                  <Text style={[styles.modalSettingTitle, {color: textColor}]}>Dark Mode</Text>
                  <AppIcon name="moon" color={isDarkMode ? '#F59E0B' : '#718096'} size={16} />
                </View>
                <Text style={[styles.modalSettingDesc, {color: subtitleColor}]}>
                  Transition all screens, headers, details tables, and maps to a midnight theme.
                </Text>
              </View>
              <Switch
                value={isDarkMode}
                onValueChange={val => {
                  setDarkMode(val);
                }}
                trackColor={{false: '#CBD5E1', true: '#BFDBFE'}}
                thumbColor={isDarkMode ? '#1E62EC' : '#F1F5F9'}
              />
            </View>

            <ActionButton
              title="Close Settings"
              onPress={() => setSettingsVisible(false)}
              style={styles.modalCloseBtnAction}
            />
          </View>
        </View>
      </Modal>
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bottomSpacing: {
    marginBottom: 16,
  },
  iconCircleBlue: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EBF3FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textColumn: {
    flex: 1,
    marginLeft: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  cardSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  rightAction: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  liveLocationTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  updatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greenPulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  updatingText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
  },
  stackedGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  coordinateValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E62EC',
    marginTop: 2,
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricIcon: {
    marginRight: 6,
  },
  rightMetricContainer: {
    alignItems: 'flex-end',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  accuracyHelperText: {
    fontSize: 10,
    marginTop: 1,
    fontWeight: '500',
  },
  goodColor: {
    color: '#10B981',
  },
  warningColor: {
    color: '#D97706',
  },
  timestampText: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 4,
  },
  thresholdNotice: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  thresholdIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  thresholdText: {
    flex: 1,
    color: '#1E62EC',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
  errorCard: {
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#FECDD3',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  errorText: {
    flex: 1,
    color: '#E11D48',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
    gap: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  modalTextCol: {
    flex: 1,
  },
  modalSettingTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  modalSettingDesc: {
    fontSize: 12,
    marginTop: 4,
    lineHeight: 16,
  },
  modalCloseBtnAction: {
    marginTop: 10,
  },
});
