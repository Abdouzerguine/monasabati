import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Camera, MapPin, DollarSign, Users, Star, X, Upload, ArrowLeft } from 'lucide-react-native';
import { useAuth } from '@/components/AuthContext';
import { useVenues } from '@/components/VenueContext';
import { useTranslation } from 'react-i18next';
import * as ImagePicker from 'expo-image-picker';

export default function EditVenueScreen() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const { venues, updateVenue } = useVenues();
  const { t } = useTranslation();

  const venue = venues.find(v => v.id === id);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    price: '',
    priceUnit: 'per day',
    capacity: '',
    category: '',
  });

  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const categories = [
    'Event Hall',
    'Rooftop',
    'Conference'
  ];
  
  const amenities = [
    'WiFi', 'Parking', 'Sound System', 'Air Conditioning', 'Catering Kitchen',
    'Projectors', 'Dance Floor', 'Bar Setup', 'Outdoor Seating', 'Security'
  ];

  const priceUnits = ['per hour', 'per day'];

  // Load venue data when component mounts
  useEffect(() => {
    if (venue) {
      setFormData({
        name: venue.name,
        description: venue.description || '',
        location: venue.location,
        price: venue.price.toString(),
        priceUnit: venue.priceUnit,
        capacity: venue.capacity.toString(),
        category: venue.category || '',
      });
      setSelectedAmenities(venue.amenities || []);
      setSelectedImages(venue.images || []);
    }
  }, [venue]);

  // Check if user is owner of this venue
  useEffect(() => {
    if (venue && user?.userType !== 'owner') {
      Alert.alert('Access Denied', 'Only venue owners can edit venues');
      router.back();
    }
  }, [venue, user]);

  if (!venue) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Venue not found</Text>
      </View>
    );
  }

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant permission to access your photo library');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        selectionLimit: 5 - selectedImages.length,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets) {
        const newImages = result.assets.map(asset => asset.uri);
        setSelectedImages([...selectedImages, ...newImages]);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const removeImage = (imageUri: string) => {
    setSelectedImages(selectedImages.filter(img => img !== imageUri));
  };

  const handleAmenityToggle = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.location || !formData.price) {
      Alert.alert('Error', 'Please fill in venue name, location, and price');
      return;
    }

    try {
      const updatedVenue = {
        ...venue,
        name: formData.name,
        description: formData.description || '',
        location: formData.location,
        price: parseInt(formData.price),
        priceUnit: formData.priceUnit,
        capacity: parseInt(formData.capacity) || 100,
        category: formData.category || 'Event Hall',
        images: selectedImages.length > 0 ? selectedImages : venue.images,
        amenities: selectedAmenities,
      };

      await updateVenue(venue.id, updatedVenue);
      Alert.alert(
        'Success!',
        'Venue updated successfully!',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error('Error updating venue:', error);
      Alert.alert('Error', 'Failed to update venue. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.title}>Edit Venue</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Venue Information</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Venue Name *</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(text) => setFormData({...formData, name: text})}
              placeholder="Enter your venue name"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.description}
              onChangeText={(text) => setFormData({...formData, description: text})}
              placeholder="Describe your venue..."
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Location *</Text>
            <View style={styles.inputWithIcon}>
              <MapPin size={20} color="#6B7280" />
              <TextInput
                style={styles.inputText}
                value={formData.location}
                onChangeText={(text) => setFormData({...formData, location: text})}
                placeholder="Enter venue location"
              />
            </View>
          </View>
        </View>

        {/* Category */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipContainer}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryChip,
                  formData.category === category && styles.activeCategoryChip,
                ]}
                onPress={() => setFormData({...formData, category})}
              >
                <Text
                  style={[
                    styles.categoryText,
                    formData.category === category && styles.activeCategoryText,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Pricing & Capacity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pricing & Capacity</Text>
          
          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <Text style={styles.label}>Price *</Text>
              <View style={styles.inputWithIcon}>
                <DollarSign size={20} color="#6B7280" />
                <TextInput
                  style={styles.inputText}
                  value={formData.price}
                  onChangeText={(text) => setFormData({...formData, price: text})}
                  placeholder="Enter price"
                  keyboardType="numeric"
                />
              </View>
            </View>
            
            <View style={styles.halfWidth}>
              <Text style={styles.label}>Price Unit</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {priceUnits.map((unit) => (
                  <TouchableOpacity
                    key={unit}
                    style={[
                      styles.unitChip,
                      formData.priceUnit === unit && styles.activeUnitChip,
                    ]}
                    onPress={() => setFormData({...formData, priceUnit: unit})}
                  >
                    <Text
                      style={[
                        styles.unitText,
                        formData.priceUnit === unit && styles.activeUnitText,
                      ]}
                    >
                      {unit}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Capacity</Text>
            <View style={styles.inputWithIcon}>
              <Users size={20} color="#6B7280" />
              <TextInput
                style={styles.inputText}
                value={formData.capacity}
                onChangeText={(text) => setFormData({...formData, capacity: text})}
                placeholder="Maximum number of guests"
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        {/* Amenities */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Amenities</Text>
          <View style={styles.amenitiesGrid}>
            {amenities.map((amenity) => (
              <TouchableOpacity
                key={amenity}
                style={[
                  styles.amenityChip,
                  selectedAmenities.includes(amenity) && styles.activeAmenityChip,
                ]}
                onPress={() => handleAmenityToggle(amenity)}
              >
                <Text
                  style={[
                    styles.amenityText,
                    selectedAmenities.includes(amenity) && styles.activeAmenityText,
                  ]}
                >
                  {amenity}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Photos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Venue Images</Text>
          <Text style={styles.sectionSubtitle}>Add up to 5 images for your venue</Text>
          
          <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
            <Upload size={24} color="#3B82F6" />
            <Text style={styles.uploadButtonText}>Select Images from Gallery</Text>
            <Text style={styles.uploadButtonSubtext}>{selectedImages.length}/5 images selected</Text>
          </TouchableOpacity>
          
          {selectedImages.length > 0 && (
            <View style={styles.selectedImagesContainer}>
              <Text style={styles.selectedImagesTitle}>Selected Images ({selectedImages.length}/5):</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {selectedImages.map((imageUri, index) => (
                  <View key={index} style={styles.selectedImageItem}>
                    <Image source={{ uri: imageUri }} style={styles.selectedImagePreview} />
                    <TouchableOpacity
                      style={styles.removeImageButton}
                      onPress={() => removeImage(imageUri)}
                    >
                      <X size={16} color="white" />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Update Venue</Text>
        </TouchableOpacity>
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
    color: '#1F2937',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 12,
  },
  inputText: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  chipContainer: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
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
  unitChip: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  activeUnitChip: {
    backgroundColor: '#3B82F6',
  },
  unitText: {
    fontSize: 12,
    color: '#6B7280',
  },
  activeUnitText: {
    color: 'white',
    fontWeight: '600',
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  amenityChip: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginBottom: 8,
  },
  activeAmenityChip: {
    backgroundColor: '#3B82F6',
  },
  amenityText: {
    fontSize: 14,
    color: '#6B7280',
  },
  activeAmenityText: {
    color: 'white',
    fontWeight: '500',
  },
  uploadButton: {
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    marginBottom: 16,
  },
  uploadButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
    marginTop: 8,
  },
  uploadButtonSubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  selectedImagesContainer: {
    marginTop: 16,
  },
  selectedImagesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  selectedImageItem: {
    position: 'relative',
    marginRight: 12,
  },
  selectedImagePreview: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EF4444',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 18,
    color: '#EF4444',
    textAlign: 'center',
    marginTop: 100,
  },
});
