import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/components/AuthContext';
import { mockVenues, mockBookings } from '@/data/mockData';
import { MapPin, Star, TrendingUp, Calendar } from 'lucide-react-native';
import { router } from 'expo-router';

export default function HomeScreen() {
  const { user } = useAuth();
  const { t } = useTranslation();

  if (user?.userType === 'owner') {
    return <OwnerDashboard />;
  }

  return <UserHome />;
}

function UserHome() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const featuredVenues = mockVenues.slice(0, 3);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
                  <Text style={styles.greeting}>{t('home.greeting', { name: user?.name })}</Text>
        <Text style={styles.subGreeting}>{t('home.userGreeting')}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('home.featuredVenues')}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {featuredVenues.map((venue) => (
            <TouchableOpacity 
              key={venue.id} 
              style={styles.venueCard}
              onPress={() => router.push(`/venue/${venue.id}`)}
            >
              <Image source={{ uri: venue.images[0] }} style={styles.venueImage} />
              <View style={styles.venueInfo}>
                <Text style={styles.venueName}>{venue.name}</Text>
                <View style={styles.venueLocation}>
                  <MapPin size={14} color="#6B7280" />
                  <Text style={styles.locationText}>{venue.location}</Text>
                </View>
                <View style={styles.venueFooter}>
                  <View style={styles.rating}>
                    <Star size={14} color="#F59E0B" />
                    <Text style={styles.ratingText}>{venue.rating}</Text>
                  </View>
                  <Text style={styles.price}>{venue.price} دج/{venue.priceUnit}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('home.quickActions')}</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity style={styles.actionCard}>
            <View style={styles.actionIcon}>
              <MapPin size={24} color="#3B82F6" />
            </View>
            <Text style={styles.actionTitle}>{t('home.findVenues')}</Text>
            <Text style={styles.actionSubtitle}>{t('home.searchNearby')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <View style={styles.actionIcon}>
              <Calendar size={24} color="#10B981" />
            </View>
            <Text style={styles.actionTitle}>{t('home.myBookings')}</Text>
            <Text style={styles.actionSubtitle}>{t('home.viewReservations')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

function OwnerDashboard() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const ownerVenues = mockVenues.filter(v => v.ownerId === 'owner1').length;
  const ownerBookings = mockBookings.filter(b => mockVenues.find(v => v.id === b.venueId && v.ownerId === 'owner1')).length;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{t('home.greeting', { name: user?.name })}</Text>
          <Text style={styles.subGreeting}>{t('home.ownerGreeting')}</Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <View style={styles.statIcon}>
            <TrendingUp size={24} color="#10B981" />
          </View>
          <Text style={styles.statNumber}>{ownerVenues}</Text>
          <Text style={styles.statLabel}>{t('home.activeVenues')}</Text>
        </View>
        <View style={styles.statCard}>
          <View style={styles.statIcon}>
            <Calendar size={24} color="#3B82F6" />
          </View>
          <Text style={styles.statNumber}>{ownerBookings}</Text>
          <Text style={styles.statLabel}>{t('home.totalBookings')}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('home.recentBookings')}</Text>
        {mockBookings.slice(0, 2).map((booking) => (
          <View key={booking.id} style={styles.bookingItem}>
            <Image source={{ uri: booking.venueImage }} style={styles.bookingImage} />
            <View style={styles.bookingInfo}>
              <Text style={styles.bookingVenue}>{booking.venueName}</Text>
              <Text style={styles.bookingUser}>By {booking.userName}</Text>
              <Text style={styles.bookingDate}>{booking.startDate}</Text>
            </View>
            <View style={[styles.statusBadge, booking.status === 'confirmed' ? styles.confirmedBadge : styles.pendingBadge]}>
              <Text style={[styles.statusText, booking.status === 'confirmed' ? styles.confirmedText : styles.pendingText]}>
                {booking.status}
              </Text>
            </View>
          </View>
        ))}
      </View>
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
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  subGreeting: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  section: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  horizontalScroll: {
    marginHorizontal: -24,
    paddingHorizontal: 24,
  },
  venueCard: {
    width: 240,
    marginRight: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  venueImage: {
    width: '100%',
    height: 140,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  venueInfo: {
    padding: 12,
  },
  venueName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  venueLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 4,
  },
  locationText: {
    fontSize: 14,
    color: '#6B7280',
  },
  venueFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    color: '#374151',
  },
  price: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  actionCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 24,
    gap: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 28,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  bookingItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  bookingImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  bookingInfo: {
    flex: 1,
    marginLeft: 12,
  },
  bookingVenue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  bookingUser: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  bookingDate: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  confirmedBadge: {
    backgroundColor: '#D1FAE5',
  },
  pendingBadge: {
    backgroundColor: '#FEF3C7',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  confirmedText: {
    color: '#065F46',
  },
  pendingText: {
    color: '#92400E',
  },
});