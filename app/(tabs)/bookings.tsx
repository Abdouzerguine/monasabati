import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Calendar, Clock, MapPin } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/components/AuthContext';
import { mockBookings, mockVenues } from '@/data/mockData';

export default function BookingsScreen() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  const userBookings = user?.userType === 'owner' 
    ? mockBookings.filter(booking => 
        mockVenues.find(venue => venue.id === booking.venueId && venue.ownerId === 'owner1')
      )
    : mockBookings;

  const upcomingBookings = userBookings.filter(booking => 
    new Date(booking.startDate) >= new Date()
  );
  const pastBookings = userBookings.filter(booking => 
    new Date(booking.startDate) < new Date()
  );

  const currentBookings = activeTab === 'upcoming' ? upcomingBookings : pastBookings;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return { bg: '#D1FAE5', text: '#065F46' };
      case 'pending': return { bg: '#FEF3C7', text: '#92400E' };
      case 'cancelled': return { bg: '#FEE2E2', text: '#991B1B' };
      default: return { bg: '#F3F4F6', text: '#374151' };
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {user?.userType === 'owner' ? t('bookings.venueBookings') : t('bookings.title')}
        </Text>
        
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
            onPress={() => setActiveTab('upcoming')}
          >
            <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>
              {t('bookings.upcoming')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'past' && styles.activeTab]}
            onPress={() => setActiveTab('past')}
          >
            <Text style={[styles.tabText, activeTab === 'past' && styles.activeTabText]}>
              {t('bookings.past')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {currentBookings.length === 0 ? (
          <View style={styles.emptyState}>
            <Calendar size={48} color="#6B7280" />
            <Text style={styles.emptyTitle}>{t('bookings.noBookings')}</Text>
            <Text style={styles.emptySubtitle}>
              {activeTab === 'upcoming' 
                ? t('bookings.noUpcomingBookings')
                : t('bookings.noPastBookings')
              }
            </Text>
          </View>
        ) : (
          currentBookings.map((booking) => {
            const statusColors = getStatusColor(booking.status);
            return (
              <TouchableOpacity key={booking.id} style={styles.bookingCard}>
                <Image source={{ uri: booking.venueImage }} style={styles.bookingImage} />
                
                <View style={styles.bookingContent}>
                  <View style={styles.bookingHeader}>
                    <Text style={styles.venueName}>{booking.venueName}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: statusColors.bg }]}>
                      <Text style={[styles.statusText, { color: statusColors.text }]}>
                        {booking.status}
                      </Text>
                    </View>
                  </View>
                  
                  {user?.userType === 'owner' && (
                    <Text style={styles.userName}>{t('bookings.bookedBy', { name: booking.userName })}</Text>
                  )}
                  
                  <View style={styles.bookingDetails}>
                    <View style={styles.detailRow}>
                      <Calendar size={16} color="#6B7280" />
                      <Text style={styles.detailText}>{booking.startDate}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Clock size={16} color="#6B7280" />
                      <Text style={styles.detailText}>{booking.guests} guests</Text>
                    </View>
                  </View>
                  
                  <View style={styles.bookingFooter}>
                    <Text style={styles.price}>${booking.totalPrice}</Text>
                    <Text style={styles.bookingDate}>
                      Booked {new Date(booking.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      {user?.userType !== 'owner' && (
        <TouchableOpacity style={styles.newBookingButton}>
          <Text style={styles.newBookingText}>Book New Venue</Text>
        </TouchableOpacity>
      )}
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
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: 'white',
  },
  tabText: {
    fontSize: 14,
    color: '#6B7280',
  },
  activeTabText: {
    color: '#3B82F6',
    fontWeight: '600',
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
  },
  bookingCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
  },
  bookingImage: {
    width: 80,
    height: 120,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  bookingContent: {
    flex: 1,
    padding: 16,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  venueName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  userName: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  bookingDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#6B7280',
  },
  bookingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563EB',
    marginTop: 8,
  },
  bookingDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  newBookingButton: {
    backgroundColor: '#3B82F6',
    margin: 24,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  newBookingText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});