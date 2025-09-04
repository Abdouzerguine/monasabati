import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { ArrowLeft, Bell, MessageCircle, Calendar, Star, Settings } from 'lucide-react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function NotificationsScreen() {
  const { t } = useTranslation();
  
  const [notifications, setNotifications] = useState({
    pushNotifications: true,
    emailNotifications: true,
    bookingUpdates: true,
    newReviews: true,
    availabilityChanges: true,
    promotionalOffers: false,
    weeklyDigest: true,
    soundEnabled: true,
    vibrationEnabled: true,
  });

  const toggleSwitch = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear All Notifications',
      'Are you sure you want to clear all notifications?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear All', 
          style: 'destructive',
          onPress: () => {
            // In a real app, you'd clear notifications from storage
            Alert.alert('Success', 'All notifications cleared');
          },
        },
      ]
    );
  };

  const notificationTypes = [
    {
      key: 'pushNotifications',
      title: 'Push Notifications',
      subtitle: 'Receive notifications on your device',
      icon: Bell,
    },
    {
      key: 'emailNotifications',
      title: 'Email Notifications',
      subtitle: 'Receive notifications via email',
      icon: MessageCircle,
    },
    {
      key: 'bookingUpdates',
      title: 'Booking Updates',
      subtitle: 'Get notified about booking status changes',
      icon: Calendar,
    },
    {
      key: 'newReviews',
      title: 'New Reviews',
      subtitle: 'Get notified when you receive new reviews',
      icon: Star,
    },
    {
      key: 'availabilityChanges',
      title: 'Availability Changes',
      subtitle: 'Get notified when venue availability changes',
      icon: Settings,
    },
    {
      key: 'promotionalOffers',
      title: 'Promotional Offers',
      subtitle: 'Receive special offers and discounts',
      icon: Bell,
    },
    {
      key: 'weeklyDigest',
      title: 'Weekly Digest',
      subtitle: 'Receive a weekly summary of activity',
      icon: Calendar,
    },
  ];

  const soundSettings = [
    {
      key: 'soundEnabled',
      title: 'Sound',
      subtitle: 'Play sound for notifications',
    },
    {
      key: 'vibrationEnabled',
      title: 'Vibration',
      subtitle: 'Vibrate for notifications',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.title}>Notifications</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Notification Types */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notification Types</Text>
          {notificationTypes.map((item) => {
            const Icon = item.icon;
            return (
              <View key={item.key} style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Icon size={20} color="#6B7280" style={styles.settingIcon} />
                  <View style={styles.settingText}>
                    <Text style={styles.settingTitle}>{item.title}</Text>
                    <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
                  </View>
                </View>
                <Switch
                  value={notifications[item.key as keyof typeof notifications]}
                  onValueChange={() => toggleSwitch(item.key as keyof typeof notifications)}
                  trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
                  thumbColor={notifications[item.key as keyof typeof notifications] ? '#FFFFFF' : '#FFFFFF'}
                />
              </View>
            );
          })}
        </View>

        {/* Sound & Vibration */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sound & Vibration</Text>
          {soundSettings.map((item) => (
            <View key={item.key} style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>{item.title}</Text>
                  <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
                </View>
              </View>
              <Switch
                value={notifications[item.key as keyof typeof notifications]}
                onValueChange={() => toggleSwitch(item.key as keyof typeof notifications)}
                trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
                thumbColor={notifications[item.key as keyof typeof notifications] ? '#FFFFFF' : '#FFFFFF'}
              />
            </View>
          ))}
        </View>

        {/* Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions</Text>
          <TouchableOpacity style={styles.actionButton} onPress={handleClearAll}>
            <Text style={styles.actionButtonText}>Clear All Notifications</Text>
          </TouchableOpacity>
        </View>

        {/* Notification Preview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notification Preview</Text>
          <View style={styles.previewCard}>
            <View style={styles.previewHeader}>
              <Bell size={16} color="#3B82F6" />
              <Text style={styles.previewTitle}>Monasabeti</Text>
              <Text style={styles.previewTime}>now</Text>
            </View>
            <Text style={styles.previewMessage}>
              Your booking request for "Algiers Event Hall" has been confirmed!
            </Text>
          </View>
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
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  actionButton: {
    backgroundColor: '#EF4444',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  previewCard: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 16,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  previewTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
    flex: 1,
  },
  previewTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  previewMessage: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
});
