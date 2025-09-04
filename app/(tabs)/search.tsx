import { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Search, MapPin, Star, Filter } from 'lucide-react-native';
import { mockVenues } from '@/data/mockData';
import { router } from 'expo-router';
import SearchFilters from '@/components/SearchFilters';

export default function SearchScreen() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(t('search.categories.all'));
  const [filters, setFilters] = useState({
    priceRange: { min: 0, max: 1000000 },
    capacity: { min: 0, max: 1000 },
    location: '',
    category: '',
  });
  const [sortBy, setSortBy] = useState<'rating' | 'priceAsc' | 'priceDesc' | 'capacity'>('rating');

  const categories = [
    t('search.categories.all'), 
    t('search.categories.eventHall'), 
    t('search.categories.rooftop'), 
    t('search.categories.conference')
  ];

  const filteredVenues = useMemo(() => {
    const base = mockVenues.filter(venue => {
      const matchesSearch = venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           venue.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategoryTab = selectedCategory === t('search.categories.all') || venue.category === selectedCategory;

      const withinPrice = venue.price >= filters.priceRange.min && venue.price <= filters.priceRange.max;
      const withinCapacity = venue.capacity >= filters.capacity.min && venue.capacity <= filters.capacity.max;
      const matchesLocation = filters.location === '' || venue.location.toLowerCase().includes(filters.location.toLowerCase());
      const matchesFilterCategory = filters.category === '' || venue.category === filters.category;

      return matchesSearch && matchesCategoryTab && withinPrice && withinCapacity && matchesLocation && matchesFilterCategory;
    });

    const sorted = [...base].sort((a, b) => {
      switch (sortBy) {
        case 'priceAsc':
          return a.price - b.price;
        case 'priceDesc':
          return b.price - a.price;
        case 'capacity':
          return b.capacity - a.capacity;
        case 'rating':
        default:
          return b.rating - a.rating;
      }
    });

    return sorted;
  }, [searchQuery, selectedCategory, filters, sortBy, t]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('search.title')}</Text>
        
        <View style={styles.searchContainer}>
          <Search size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder={t('search.searchPlaceholder')}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <View style={styles.inlineFilters}>
            <SearchFilters 
              filters={filters}
              onFiltersChange={setFilters}
              categories={[t('search.categories.eventHall'), t('search.categories.rooftop'), t('search.categories.conference')]}
            />
          </View>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 12 }}
        >
          <View style={styles.sortRow}>
            <TouchableOpacity
              style={[styles.sortChip, sortBy === 'rating' && styles.activeSortChip]}
              onPress={() => setSortBy('rating')}
            >
              <Text style={[styles.sortText, sortBy === 'rating' && styles.activeSortText]}>
                {t('search.sort.bestRated')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sortChip, sortBy === 'priceAsc' && styles.activeSortChip]}
              onPress={() => setSortBy('priceAsc')}
            >
              <Text style={[styles.sortText, sortBy === 'priceAsc' && styles.activeSortText]}>
                {t('search.sort.priceLow')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sortChip, sortBy === 'priceDesc' && styles.activeSortChip]}
              onPress={() => setSortBy('priceDesc')}
            >
              <Text style={[styles.sortText, sortBy === 'priceDesc' && styles.activeSortText]}>
                {t('search.sort.priceHigh')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sortChip, sortBy === 'capacity' && styles.activeSortChip]}
              onPress={() => setSortBy('capacity')}
            >
              <Text style={[styles.sortText, sortBy === 'capacity' && styles.activeSortText]}>
                {t('search.sort.capacity')}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.categoriesContainer}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryChip,
                selectedCategory === category && styles.activeCategoryChip,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category && styles.activeCategoryText,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.results}>
        <Text style={styles.resultsCount}>
          {t('search.resultsCount', { count: filteredVenues.length })}
        </Text>
        
        {filteredVenues.map((venue) => (
          <TouchableOpacity 
            key={venue.id} 
            style={styles.venueCard}
            onPress={() => router.push(`/venue/${venue.id}`)}
          >
            <Image source={{ uri: venue.images[0] }} style={styles.venueImage} />
            <View style={styles.venueContent}>
              <View style={styles.venueHeader}>
                <Text style={styles.venueName}>{venue.name}</Text>
                <View style={styles.rating}>
                  <Star size={16} color="#F59E0B" />
                  <Text style={styles.ratingText}>{venue.rating}</Text>
                </View>
              </View>
              
              <View style={styles.venueLocation}>
                <MapPin size={14} color="#6B7280" />
                <Text style={styles.locationText}>{venue.location}</Text>
              </View>
              
              <Text style={styles.venueDescription} numberOfLines={2}>
                {venue.description}
              </Text>
              
              <View style={styles.venueFooter}>
                <View style={styles.amenities}>
                  {venue.amenities.slice(0, 3).map((amenity, index) => (
                    <Text key={index} style={styles.amenityTag}>
                      {amenity}
                    </Text>
                  ))}
                  {venue.amenities.length > 3 && (
                    <Text style={styles.moreAmenities}>
                      +{venue.amenities.length - 3} more
                    </Text>
                  )}
                </View>
                <Text style={styles.price}>{venue.price} دج/{venue.priceUnit}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  filterButton: {
    padding: 8,
  },
  inlineFilters: {
    paddingVertical: 8,
  },
  sortRow: {
    flexDirection: 'row',
    gap: 8,
  },
  sortChip: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  activeSortChip: {
    backgroundColor: '#3B82F6',
  },
  sortText: {
    fontSize: 14,
    color: '#6B7280',
  },
  activeSortText: {
    color: 'white',
    fontWeight: '600',
  },
  categoriesContainer: {
    marginHorizontal: -24,
    paddingHorizontal: 24,
  },
  categoryChip: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  activeCategoryChip: {
    backgroundColor: '#3B82F6',
  },
  categoryText: {
    fontSize: 14,
    color: '#6B7280',
  },
  activeCategoryText: {
    color: 'white',
    fontWeight: '600',
  },
  results: {
    flex: 1,
    padding: 24,
  },
  resultsCount: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 16,
  },
  venueCard: {
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
  },
  venueImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  venueContent: {
    padding: 16,
  },
  venueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  venueName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    flex: 1,
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
  venueDescription: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 22,
    marginBottom: 16,
  },
  venueFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  amenities: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  amenityTag: {
    fontSize: 12,
    color: '#6B7280',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  moreAmenities: {
    fontSize: 12,
    color: '#3B82F6',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2563EB',
    marginTop: 8,
  },
});