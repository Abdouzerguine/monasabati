import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { Star, MessageCircle, User, Calendar } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/components/AuthContext';
import { mockReviews } from '@/data/mockData';

interface Review {
  id: string;
  venueId: string;
  userId: string;
  userName: string;
  userImage?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ReviewsSectionProps {
  venueId: string;
  venueName: string;
  onReviewAdded?: (review: Review) => void;
}

export default function ReviewsSection({ venueId, venueName, onReviewAdded }: ReviewsSectionProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');

  const venueReviews = mockReviews.filter(review => review.venueId === venueId);
  const averageRating = venueReviews.length > 0 
    ? venueReviews.reduce((sum, review) => sum + review.rating, 0) / venueReviews.length 
    : 0;

  const handleAddReview = () => {
    if (newRating === 0) {
      Alert.alert(t('reviews.selectRating'), t('reviews.pleaseSelectRating'));
      return;
    }

    if (!newComment.trim()) {
      Alert.alert(t('reviews.addComment'), t('reviews.pleaseAddComment'));
      return;
    }

    const newReview: Review = {
      id: Date.now().toString(),
      venueId,
      userId: user?.id || 'user1',
      userName: user?.name || 'User',
      rating: newRating,
      comment: newComment.trim(),
      createdAt: new Date().toISOString().split('T')[0],
    };

    // In a real app, you'd save this to your backend
    console.log('New review:', newReview);
    
    if (onReviewAdded) {
      onReviewAdded(newReview);
    }

    // Reset form and close modal
    setNewRating(0);
    setNewComment('');
    setShowReviewModal(false);

    Alert.alert(t('common.success'), t('reviews.reviewSubmitted'));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderStars = (rating: number, size: number = 16) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={size}
        color={index < rating ? '#F59E0B' : '#E5E7EB'}
        fill={index < rating ? '#F59E0B' : 'transparent'}
      />
    ));
  };

  return (
    <View style={styles.container}>
      {/* Reviews Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>{t('reviews.title')}</Text>
          <View style={styles.ratingContainer}>
            <View style={styles.starsContainer}>
              {renderStars(Math.round(averageRating), 18)}
            </View>
            <Text style={styles.averageRating}>{averageRating.toFixed(1)}</Text>
            <Text style={styles.reviewCount}>({venueReviews.length} {t('reviews.reviews')})</Text>
          </View>
        </View>
        
        {user?.userType !== 'owner' && (
          <TouchableOpacity 
            style={styles.addReviewButton}
            onPress={() => setShowReviewModal(true)}
          >
            <MessageCircle size={16} color="#3B82F6" />
            <Text style={styles.addReviewText}>{t('reviews.addReview')}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Reviews List */}
      <ScrollView style={styles.reviewsList}>
        {venueReviews.length === 0 ? (
          <View style={styles.emptyState}>
            <MessageCircle size={48} color="#E5E7EB" />
            <Text style={styles.emptyTitle}>{t('reviews.noReviews')}</Text>
            <Text style={styles.emptySubtitle}>{t('reviews.beFirstToReview')}</Text>
          </View>
        ) : (
          venueReviews.map((review) => (
            <View key={review.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <View style={styles.userInfo}>
                  <View style={styles.userAvatar}>
                    <User size={20} color="#6B7280" />
                  </View>
                  <View style={styles.userDetails}>
                    <Text style={styles.userName}>{review.userName}</Text>
                    <View style={styles.reviewMeta}>
                      <View style={styles.starsContainer}>
                        {renderStars(review.rating, 14)}
                      </View>
                      <Text style={styles.reviewDate}>{formatDate(review.createdAt)}</Text>
                    </View>
                  </View>
                </View>
              </View>
              
              <Text style={styles.reviewComment}>{review.comment}</Text>
            </View>
          ))
        )}
      </ScrollView>

      {/* Add Review Modal */}
      <Modal
        visible={showReviewModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowReviewModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('reviews.writeReview')}</Text>
              <TouchableOpacity onPress={() => setShowReviewModal(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.venueName}>{venueName}</Text>

            {/* Rating Selection */}
            <View style={styles.ratingSection}>
              <Text style={styles.ratingLabel}>{t('reviews.yourRating')}</Text>
              <View style={styles.ratingStars}>
                {Array.from({ length: 5 }, (_, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setNewRating(index + 1)}
                  >
                    <Star
                      size={32}
                      color={index < newRating ? '#F59E0B' : '#E5E7EB'}
                      fill={index < newRating ? '#F59E0B' : 'transparent'}
                    />
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.ratingText}>
                {newRating > 0 ? t('reviews.ratingSelected', { rating: newRating }) : t('reviews.tapToRate')}
              </Text>
            </View>

            {/* Comment Input */}
            <View style={styles.commentSection}>
              <Text style={styles.commentLabel}>{t('reviews.yourReview')}</Text>
              <TextInput
                style={styles.commentInput}
                value={newComment}
                onChangeText={setNewComment}
                placeholder={t('reviews.shareYourExperience')}
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity 
              style={styles.submitButton}
              onPress={handleAddReview}
            >
              <Text style={styles.submitButtonText}>{t('reviews.submitReview')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 20,
    marginTop: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 8,
  },
  averageRating: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginRight: 4,
  },
  reviewCount: {
    fontSize: 14,
    color: '#6B7280',
  },
  addReviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  addReviewText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
  reviewsList: {
    maxHeight: 400,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 8,
  },
  reviewCard: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingVertical: 16,
  },
  reviewHeader: {
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  reviewMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewDate: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 8,
  },
  reviewComment: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
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
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  closeButton: {
    fontSize: 24,
    color: '#6B7280',
    padding: 4,
  },
  venueName: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 20,
  },
  ratingSection: {
    marginBottom: 20,
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  ratingStars: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  commentSection: {
    marginBottom: 24,
  },
  commentLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
    color: '#1F2937',
    minHeight: 100,
  },
  submitButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
