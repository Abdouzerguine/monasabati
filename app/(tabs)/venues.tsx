import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { CreditCard as Edit3, Trash2, Eye, Plus } from 'lucide-react-native';
import { mockBookings } from '@/data/mockData';
import { router } from 'expo-router';
import { useAuth } from '@/components/AuthContext';
import { useVenues } from '@/components/VenueContext';
import { Venue } from '@/types';

export default function VenuesScreen() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { getVenuesByOwner, deleteVenue, venues } = useVenues();
  const [ownerVenues, setOwnerVenues] = useState<Venue[]>([]);

  useEffect(() => {
    const ownerId = user?.id || 'owner1';
    const filteredVenues = getVenuesByOwner(ownerId);
    setOwnerVenues(filteredVenues);
  }, [user, venues, getVenuesByOwner]);

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

  const handleDeleteVenue = async (venueId: string) => {
    Alert.alert(
      'Delete Venue',
      'Are you sure you want to delete this venue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteVenue(venueId);
              Alert.alert('Success', 'Venue deleted successfully');
            } catch (error) {
              console.error('Error deleting venue:', error);
              Alert.alert('Error', 'Failed to delete venue');
            }
          },
        },
      ]
    );
  };

  const handleEditVenue = (venue: Venue) => {
    router.push(`/edit-venue/${venue.id}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('venues.title')}</Text>
        <Text style={styles.subtitle}>{t('venues.subtitle', { count: ownerVenues.length })}</Text>
      </View>

      <ScrollView style={styles.content}>
        {ownerVenues.length === 0 ? (
          <View style={styles.emptyState}>
            <Plus size={48} color="#6B7280" />
            <Text style={styles.emptyTitle}>{t('venues.noVenues')}</Text>
            <Text style={styles.emptySubtitle}>
              {t('venues.noVenuesSubtitle')}
            </Text>
            <TouchableOpacity style={styles.addFirstButton}>
              <Text style={styles.addFirstButtonText}>{t('venues.addFirstVenue')}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          ownerVenues.map((venue) => (
            <View key={venue.id} style={styles.venueCard}>
              <Image source={{ uri: venue.images[0] }} style={styles.venueImage} />
              
              <View style={styles.venueContent}>
                <View style={styles.venueHeader}>
                  <View style={styles.venueInfo}>
                    <Text style={styles.venueName}>{venue.name}</Text>
                    <Text style={styles.venueLocation}>{venue.location}</Text>
                  </View>
                  <Text style={styles.venuePrice}>${venue.price}/{venue.priceUnit}</Text>
                </View>

                <View style={styles.venueStats}>
                  <View style={styles.stat}>
                    <Text style={styles.statNumber}>{venue.rating}</Text>
                    <Text style={styles.statLabel}>{t('venues.rating')}</Text>
                  </View>
                  <View style={styles.stat}>
                    <Text style={styles.statNumber}>{venue.reviewCount}</Text>
                    <Text style={styles.statLabel}>{t('venues.reviews')}</Text>
                  </View>
                  <View style={styles.stat}>
                    <Text style={styles.statNumber}>{venue.capacity}</Text>
                    <Text style={styles.statLabel}>{t('venues.capacity')}</Text>
                  </View>
                  <View style={styles.stat}>
                    <Text style={styles.statNumber}>{mockBookings.filter(b => b.venueId === venue.id).length}</Text>
                    <Text style={styles.statLabel}>{t('tabs.bookings')}</Text>
                  </View>
                </View>

                <View style={styles.actionButtons}>
                  <TouchableOpacity 
                    style={styles.actionButton} 
                    onPress={() => router.push(`/venue/${venue.id}`)}
                  >
                    <Eye size={18} color="#6B7280" />
                    <Text style={styles.actionButtonText}>View</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => handleEditVenue(venue)}
                  >
                    <Edit3 size={18} color="#3B82F6" />
                    <Text style={[styles.actionButtonText, { color: '#3B82F6' }]}>Edit</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => handleDeleteVenue(venue.id)}
                  >
                    <Trash2 size={18} color="#EF4444" />
                    <Text style={[styles.actionButtonText, { color: '#EF4444' }]}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => router.push('/(tabs)/add-venue')}
      >
        <Plus size={24} color="white" />
        <Text style={styles.addButtonText}>Add New Venue</Text>
      </TouchableOpacity>
    </View>
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
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  addFirstButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addFirstButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  venueCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  venueImage: {
    width: '100%',
    height: 160,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  venueContent: {
    padding: 16,
  },
  venueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  venueInfo: {
    flex: 1,
  },
  venueName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  venueLocation: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  venuePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  venueStats: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 4,
  },
  actionButtonText: {
    fontSize: 14,
    color: '#6B7280',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    margin: 24,
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});