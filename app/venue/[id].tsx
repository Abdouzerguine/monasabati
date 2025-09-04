import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/components/AuthContext';
import { useVenues } from '@/components/VenueContext';
import { mockBookings } from '@/data/mockData';
import DatePicker from '@/components/DatePicker';
import { loadAvailability } from '@/components/availabilityStorage';
import ReviewsSection from '@/components/ReviewsSection';
import FavoriteButton from '@/components/FavoriteButton';
import { 
  MapPin, 
  Star, 
  Users, 
  Calendar, 
  Phone, 
  MessageCircle, 
  ArrowLeft,
  Clock,
  CheckCircle
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function VenueDetailScreen() {
  const { id } = useLocalSearchParams();
  const { t } = useTranslation();
  const { user } = useAuth();
  const { venues } = useVenues();
  const [selectedDate, setSelectedDate] = useState('');
  const [guestCount, setGuestCount] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [allowedDates, setAllowedDates] = useState<string[] | undefined>(undefined);

  const venue = venues.find(v => v.id === id);
  
  if (!venue) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{t('venueDetails.notFound')}</Text>
      </View>
    );
  }

  const handleBooking = () => {
    if (!selectedDate || !guestCount) {
      Alert.alert(t('common.error'), t('venueDetails.fillRequiredFields'));
      return;
    }

    if (parseInt(guestCount) > venue.capacity) {
      Alert.alert(t('common.error'), t('venueDetails.exceedsCapacity'));
      return;
    }

    // Create a new booking (without payment)
    const newBooking = {
      id: Date.now().toString(),
      venueId: venue.id,
      venueName: venue.name,
      venueImage: venue.images[0],
      userId: user?.id || 'user1',
      userName: user?.name || 'User',
      startDate: selectedDate,
      endDate: selectedDate,
      totalPrice: venue.price,
      status: 'pending' as const,
      createdAt: new Date().toISOString().split('T')[0],
      guests: parseInt(guestCount),
      specialRequests: specialRequests || undefined,
    };

    Alert.alert(
      t('venueDetails.bookingRequest'),
      t('venueDetails.bookingRequestSent'),
      [
        {
          text: t('common.ok'),
          onPress: () => {
            // In a real app, you'd save this to your backend
            console.log('New booking:', newBooking);
            router.back();
          },
        },
      ]
    );
  };

  // Load availability allowed dates for this venue
  useEffect(() => {
    (async () => {
      if (!venue) return;
      const map = await loadAvailability(venue.id);
      const fromMock = venue.availability?.reduce<string[]>((acc, d) => { acc.push(d); return acc; }, []) ?? [];
      const merged = map ? Object.entries(map).filter(([,v]) => v).map(([k]) => k) : fromMock;
      setAllowedDates(merged);
    })();
  }, [venue?.id]);

  const handleContactOwner = () => {
    Alert.alert(
      t('venueDetails.contactOwner'),
      t('venueDetails.contactInfo', { 
        name: venue.ownerName,
        phone: '+213 XXX XXX XXX' // Placeholder for Algerian phone
      }),
      [
        { text: t('common.call'), onPress: () => console.log('Call owner') },
        { text: t('common.message'), onPress: () => console.log('Message owner') },
        { text: t('common.cancel'), style: 'cancel' },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('venueDetails.title')}</Text>
        <FavoriteButton 
          venueId={venue.id}
          onToggle={(venueId, isFavorite) => {
            console.log(`${isFavorite ? 'Added to' : 'Removed from'} favorites:`, venueId);
          }}
        />
      </View>

      <ScrollView style={styles.content}>
        {/* Image Gallery */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: venue.images[activeImageIndex] }} style={styles.mainImage} />
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.imageThumbnails}
          >
            {venue.images.map((image, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setActiveImageIndex(index)}
                style={[
                  styles.thumbnail,
                  activeImageIndex === index && styles.activeThumbnail
                ]}
              >
                <Image source={{ uri: image }} style={styles.thumbnailImage} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Venue Info */}
        <View style={styles.infoSection}>
          <Text style={styles.venueName}>{venue.name}</Text>
          
          <View style={styles.ratingContainer}>
            <Star size={16} color="#F59E0B" />
            <Text style={styles.rating}>{venue.rating}</Text>
            <Text style={styles.reviewCount}>({venue.reviewCount} {t('venueDetails.reviews')})</Text>
          </View>

          <View style={styles.locationContainer}>
            <MapPin size={16} color="#6B7280" />
            <Text style={styles.location}>{venue.location}</Text>
          </View>

          <Text style={styles.description}>{venue.description}</Text>
        </View>

        {/* Key Details */}
        <View style={styles.detailsSection}>
          <View style={styles.detailRow}>
            <Users size={20} color="#3B82F6" />
            <Text style={styles.detailLabel}>{t('venueDetails.capacity')}</Text>
            <Text style={styles.detailValue}>{venue.capacity} {t('venueDetails.guests')}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Calendar size={20} color="#10B981" />
            <Text style={styles.detailLabel}>{t('venueDetails.price')}</Text>
            <Text style={styles.detailValue}>{venue.price} دج/{venue.priceUnit}</Text>
          </View>

          <View style={styles.detailRow}>
            <CheckCircle size={20} color="#F59E0B" />
            <Text style={styles.detailLabel}>{t('venueDetails.category')}</Text>
            <Text style={styles.detailValue}>{venue.category}</Text>
          </View>
        </View>

        {/* Amenities */}
        <View style={styles.amenitiesSection}>
          <Text style={styles.sectionTitle}>{t('venueDetails.amenities')}</Text>
          <View style={styles.amenitiesGrid}>
            {venue.amenities.map((amenity, index) => (
              <View key={index} style={styles.amenityItem}>
                <CheckCircle size={16} color="#10B981" />
                <Text style={styles.amenityText}>{amenity}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Booking Form */}
        {user?.userType !== 'owner' && (
          <View style={styles.bookingSection}>
            <Text style={styles.sectionTitle}>{t('venueDetails.bookNow')}</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>{t('venueDetails.selectDate')} *</Text>
              <DatePicker
                value={selectedDate}
                onChange={setSelectedDate}
                placeholder={t('venueDetails.selectDate')}
                allowedDates={allowedDates}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>{t('venueDetails.numberOfGuests')} *</Text>
              <TextInput
                style={styles.input}
                value={guestCount}
                onChangeText={setGuestCount}
                placeholder={t('venueDetails.enterGuestCount')}
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>{t('venueDetails.specialRequests')}</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={specialRequests}
                onChangeText={setSpecialRequests}
                placeholder={t('venueDetails.enterSpecialRequests')}
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={3}
              />
            </View>

            <TouchableOpacity style={styles.bookButton} onPress={handleBooking}>
              <Text style={styles.bookButtonText}>{t('venueDetails.confirmBooking')}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Reviews Section */}
        <ReviewsSection 
          venueId={venue.id} 
          venueName={venue.name}
          onReviewAdded={(newReview) => {
            console.log('New review added:', newReview);
            // In a real app, you'd update the venue's rating here
          }}
        />

        {/* Contact Owner */}
        <View style={styles.contactSection}>
          <Text style={styles.sectionTitle}>{t('venueDetails.contactOwner')}</Text>
          <TouchableOpacity style={styles.contactButton} onPress={handleContactOwner}>
            <Phone size={20} color="white" />
            <Text style={styles.contactButtonText}>{t('venueDetails.callOwner')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'transparent',
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 12,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  mainImage: {
    width: '100%',
    height: 220,
    borderRadius: 20,
    marginBottom: 8,
  },
  imageThumbnails: {
    flexDirection: 'row',
    marginTop: 8,
    paddingHorizontal: 12,
  },
  thumbnail: {
    width: 48,
    height: 48,
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  activeThumbnail: {
    borderColor: '#2563EB',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  infoSection: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 16,
    marginHorizontal: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  venueName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 6,
  },
  reviewCount: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 6,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  location: {
    fontSize: 16,
    color: '#6B7280',
    marginLeft: 8,
  },
  description: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
    marginTop: 8,
  },
  detailsSection: {
    backgroundColor: 'white',
    padding: 16,
    marginHorizontal: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 15,
    color: '#6B7280',
    marginLeft: 12,
    flex: 1,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  amenitiesSection: {
    backgroundColor: 'white',
    padding: 16,
    marginHorizontal: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: 12,
  },
  amenityText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 8,
  },
  bookingSection: {
    backgroundColor: 'white',
    padding: 16,
    marginHorizontal: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  inputContainer: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 10,
    fontSize: 15,
    backgroundColor: '#F9FAFB',
    color: '#1F2937',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  bookButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  bookButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  contactSection: {
    backgroundColor: 'white',
    padding: 16,
    marginHorizontal: 12,
    marginTop: 8,
    marginBottom: 20,
    borderRadius: 12,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    borderRadius: 12,
    padding: 12,
  },
  contactButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  errorText: {
    fontSize: 18,
    color: '#6B7280',
  },
});
