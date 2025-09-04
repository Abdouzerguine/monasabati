import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
} from 'react-native';
import { Filter, X, Sliders } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

interface FilterOptions {
  priceRange: {
    min: number;
    max: number;
  };
  capacity: {
    min: number;
    max: number;
  };
  location: string;
  category: string;
}

interface SearchFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  categories: string[];
}

export default function SearchFilters({ filters, onFiltersChange, categories }: SearchFiltersProps) {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [tempFilters, setTempFilters] = useState<FilterOptions>(filters);

  const handleApplyFilters = () => {
    onFiltersChange(tempFilters);
    setIsVisible(false);
  };

  const handleResetFilters = () => {
    const resetFilters: FilterOptions = {
      priceRange: { min: 0, max: 1000000 },
      capacity: { min: 0, max: 1000 },
      location: '',
      category: '',
    };
    setTempFilters(resetFilters);
    onFiltersChange(resetFilters);
    setIsVisible(false);
  };

  const hasActiveFilters = () => {
    return (
      tempFilters.priceRange.min > 0 ||
      tempFilters.priceRange.max < 1000000 ||
      tempFilters.capacity.min > 0 ||
      tempFilters.capacity.max < 1000 ||
      tempFilters.location !== '' ||
      tempFilters.category !== ''
    );
  };

  return (
    <View>
      <TouchableOpacity 
        style={[styles.filterButton, hasActiveFilters() && styles.activeFilterButton]}
        onPress={() => setIsVisible(true)}
      >
        <Filter size={16} color={hasActiveFilters() ? 'white' : '#6B7280'} />
        <Text style={[styles.filterText, hasActiveFilters() && styles.activeFilterText]}>
          {t('search.filters')}
        </Text>
        {hasActiveFilters() && (
          <View style={styles.activeIndicator} />
        )}
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('search.filters')}</Text>
              <TouchableOpacity onPress={() => setIsVisible(false)}>
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.filtersContent}>
              {/* Price Range */}
              <View style={styles.filterSection}>
                <Text style={styles.sectionTitle}>{t('search.priceRange')}</Text>
                <View style={styles.rangeInputs}>
                  <View style={styles.rangeInput}>
                    <Text style={styles.rangeLabel}>{t('search.min')}</Text>
                    <TextInput
                      style={styles.input}
                      value={tempFilters.priceRange.min.toString()}
                      onChangeText={(text) => setTempFilters({
                        ...tempFilters,
                        priceRange: { ...tempFilters.priceRange, min: parseInt(text) || 0 }
                      })}
                      placeholder="0"
                      keyboardType="numeric"
                      placeholderTextColor="#9CA3AF"
                    />
                    <Text style={styles.currency}>دج</Text>
                  </View>
                  <View style={styles.rangeSeparator}>
                    <Text style={styles.separatorText}>-</Text>
                  </View>
                  <View style={styles.rangeInput}>
                    <Text style={styles.rangeLabel}>{t('search.max')}</Text>
                    <TextInput
                      style={styles.input}
                      value={tempFilters.priceRange.max.toString()}
                      onChangeText={(text) => setTempFilters({
                        ...tempFilters,
                        priceRange: { ...tempFilters.priceRange, max: parseInt(text) || 1000000 }
                      })}
                      placeholder="1000000"
                      keyboardType="numeric"
                      placeholderTextColor="#9CA3AF"
                    />
                    <Text style={styles.currency}>دج</Text>
                  </View>
                </View>
              </View>

              {/* Capacity Range */}
              <View style={styles.filterSection}>
                <Text style={styles.sectionTitle}>{t('search.capacity')}</Text>
                <View style={styles.rangeInputs}>
                  <View style={styles.rangeInput}>
                    <Text style={styles.rangeLabel}>{t('search.min')}</Text>
                    <TextInput
                      style={styles.input}
                      value={tempFilters.capacity.min.toString()}
                      onChangeText={(text) => setTempFilters({
                        ...tempFilters,
                        capacity: { ...tempFilters.capacity, min: parseInt(text) || 0 }
                      })}
                      placeholder="0"
                      keyboardType="numeric"
                      placeholderTextColor="#9CA3AF"
                    />
                    <Text style={styles.unit}>{t('search.guests')}</Text>
                  </View>
                  <View style={styles.rangeSeparator}>
                    <Text style={styles.separatorText}>-</Text>
                  </View>
                  <View style={styles.rangeInput}>
                    <Text style={styles.rangeLabel}>{t('search.max')}</Text>
                    <TextInput
                      style={styles.input}
                      value={tempFilters.capacity.max.toString()}
                      onChangeText={(text) => setTempFilters({
                        ...tempFilters,
                        capacity: { ...tempFilters.capacity, max: parseInt(text) || 1000 }
                      })}
                      placeholder="1000"
                      keyboardType="numeric"
                      placeholderTextColor="#9CA3AF"
                    />
                    <Text style={styles.unit}>{t('search.guests')}</Text>
                  </View>
                </View>
              </View>

              {/* Location */}
              <View style={styles.filterSection}>
                <Text style={styles.sectionTitle}>{t('search.location')}</Text>
                <TextInput
                  style={styles.textInput}
                  value={tempFilters.location}
                  onChangeText={(text) => setTempFilters({ ...tempFilters, location: text })}
                  placeholder={t('search.enterLocation')}
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              {/* Category */}
              <View style={styles.filterSection}>
                <Text style={styles.sectionTitle}>{t('search.category')}</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.categoryChips}>
                    <TouchableOpacity
                      style={[
                        styles.categoryChip,
                        tempFilters.category === '' && styles.activeCategoryChip
                      ]}
                      onPress={() => setTempFilters({ ...tempFilters, category: '' })}
                    >
                      <Text style={[
                        styles.categoryChipText,
                        tempFilters.category === '' && styles.activeCategoryChipText
                      ]}>
                        {t('search.allCategories')}
                      </Text>
                    </TouchableOpacity>
                    {categories.map((category) => (
                      <TouchableOpacity
                        key={category}
                        style={[
                          styles.categoryChip,
                          tempFilters.category === category && styles.activeCategoryChip
                        ]}
                        onPress={() => setTempFilters({ ...tempFilters, category })}
                      >
                        <Text style={[
                          styles.categoryChipText,
                          tempFilters.category === category && styles.activeCategoryChipText
                        ]}>
                          {category}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>
            </ScrollView>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.resetButton} onPress={handleResetFilters}>
                <Text style={styles.resetButtonText}>{t('search.reset')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.applyButton} onPress={handleApplyFilters}>
                <Text style={styles.applyButtonText}>{t('search.apply')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  activeFilterButton: {
    backgroundColor: '#3B82F6',
  },
  filterText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  activeFilterText: {
    color: 'white',
  },
  activeIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'white',
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  filtersContent: {
    maxHeight: 500,
  },
  filterSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  rangeInputs: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rangeInput: {
    flex: 1,
  },
  rangeLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 8,
    fontSize: 14,
    backgroundColor: '#F9FAFB',
    color: '#1F2937',
    textAlign: 'center',
  },
  currency: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
  },
  unit: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
  },
  rangeSeparator: {
    paddingHorizontal: 12,
  },
  separatorText: {
    fontSize: 16,
    color: '#6B7280',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
    color: '#1F2937',
  },
  categoryChips: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryChip: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  activeCategoryChip: {
    backgroundColor: '#3B82F6',
  },
  categoryChipText: {
    fontSize: 14,
    color: '#6B7280',
  },
  activeCategoryChipText: {
    color: 'white',
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  resetButton: {
    flex: 1,
    padding: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  applyButton: {
    flex: 1,
    padding: 12,
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
  },
});
