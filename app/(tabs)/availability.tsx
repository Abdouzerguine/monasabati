import { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import AvailabilityCalendar, { AvailabilityMap } from '@/components/AvailabilityCalendar';
import { loadAvailability, saveAvailability } from '@/components/availabilityStorage';
import { mockVenues } from '@/data/mockData';
import { useAuth } from '@/components/AuthContext';

export default function AvailabilityScreen() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const ownerVenues = useMemo(() => mockVenues.filter(v => v.ownerId === 'owner1'), []);
  const [selectedVenueId, setSelectedVenueId] = useState(ownerVenues[0]?.id);
  const selectedVenue = ownerVenues.find(v => v.id === selectedVenueId);

  // Build initial availability map from venue.availability (dates where it's available)
  const initialAvailability: AvailabilityMap = useMemo(() => {
    const map: AvailabilityMap = {};
    if (selectedVenue?.availability) {
      selectedVenue.availability.forEach(date => {
        map[date] = true;
      });
    }
    return map;
  }, [selectedVenueId]);

  const [availability, setAvailability] = useState<AvailabilityMap>(initialAvailability);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!selectedVenueId) return;
      const stored = await loadAvailability(selectedVenueId);
      if (active) {
        setAvailability(stored ?? initialAvailability);
      }
    })();
    return () => { active = false; };
  }, [selectedVenueId, initialAvailability]);

  const handleSave = async () => {
    // In a real app, send to backend
    const availableDates = Object.entries(availability)
      .filter(([, val]) => val)
      .map(([key]) => key)
      .sort();

    await saveAvailability(selectedVenueId!, availability);

    Alert.alert(
      t('common.success'),
      t('availability.saved', 'Availability saved'),
    );

    console.log('Saving availability for venue', selectedVenueId, availableDates);
  };

  useEffect(() => {
    if (!user || user.userType !== 'owner') {
      Alert.alert(
        t('common.error'),
        t('venues.noVenuesSubtitle'),
        [
          {
            text: t('common.back'),
            onPress: () => router.replace('/(tabs)')
          }
        ]
      );
    }
  }, [user]);

  if (!user || user.userType !== 'owner') {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F9FAFB' }}>
        <Text style={{ color: '#6B7280' }}>{t('auth.iAmA')}: {t('auth.eventOrganizer')}</Text>
      </View>
    );
  }

  if (!selectedVenue) {
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>{t('venues.noVenues')}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('availability.title', 'Availability')}</Text>
        <Text style={styles.subtitle}>{t('availability.subtitle', 'Manage when your venue can be booked')}</Text>
      </View>

      {/* Venue Switcher */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.venueSwitcher}>
        {ownerVenues.map(v => (
          <TouchableOpacity
            key={v.id}
            style={[styles.venueChip, v.id === selectedVenueId && styles.activeVenueChip]}
            onPress={() => {
              setSelectedVenueId(v.id);
              // reset availability from venue
              const map: AvailabilityMap = {};
              v.availability.forEach(d => { map[d] = true; });
              setAvailability(map);
            }}
          >
            <Text style={[styles.venueChipText, v.id === selectedVenueId && styles.activeVenueChipText]}>{v.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <AvailabilityCalendar value={availability} onChange={setAvailability} />

      <View style={{ flexDirection: 'row', gap: 12, marginHorizontal: 24 }}>
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: '#10B981', flex: 1 }]}
          onPress={() => {
            // Select next 30 days as available
            const map: AvailabilityMap = { ...availability };
            const start = new Date();
            for (let i = 0; i < 30; i++) {
              const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
              const key = d.toISOString().split('T')[0];
              map[key] = true;
            }
            setAvailability(map);
          }}
        >
          <Text style={styles.saveText}>{t('availability.quickNext30', 'Next 30 days')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: '#EF4444', flex: 1 }]}
          onPress={() => setAvailability({})}
        >
          <Text style={styles.saveText}>{t('availability.clearAll', 'Clear all')}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>{t('common.save')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: 'white',
    padding: 24,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 6,
  },
  venueSwitcher: {
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  venueChip: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  activeVenueChip: {
    backgroundColor: '#3B82F6',
  },
  venueChipText: {
    color: '#6B7280',
    fontSize: 14,
  },
  activeVenueChipText: {
    color: 'white',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    padding: 16,
    margin: 24,
    alignItems: 'center',
  },
  saveText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  muted: {
    color: '#6B7280',
  },
});
