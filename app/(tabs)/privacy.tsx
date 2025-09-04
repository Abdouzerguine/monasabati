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
import { ArrowLeft, Eye, Lock, Shield, Download, Trash2, User, MapPin } from 'lucide-react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function PrivacyScreen() {
  const { t } = useTranslation();
  
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    showLocation: true,
    showContactInfo: false,
    allowMessages: true,
    dataCollection: true,
    analytics: false,
    marketingEmails: false,
  });

  const toggleSwitch = (key: keyof typeof privacySettings) => {
    if (typeof privacySettings[key] === 'boolean') {
      setPrivacySettings(prev => ({
        ...prev,
        [key]: !prev[key],
      }));
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Account Deleted',
              'Your account has been deleted successfully.',
              [
                {
                  text: 'OK',
                  onPress: () => router.replace('/onboarding'),
                },
              ]
            );
          },
        },
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'Your data will be exported and sent to your email address.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Export', 
          onPress: () => {
            Alert.alert('Success', 'Data export initiated. You will receive an email shortly.');
          },
        },
      ]
    );
  };

  const privacyOptions = [
    {
      key: 'profileVisibility',
      title: 'Profile Visibility',
      subtitle: 'Control who can see your profile',
      icon: Eye,
      type: 'select',
      options: ['Public', 'Private', 'Friends Only'],
    },
    {
      key: 'showLocation',
      title: 'Show Location',
      subtitle: 'Display your location to other users',
      icon: MapPin,
      type: 'switch',
    },
    {
      key: 'showContactInfo',
      title: 'Show Contact Info',
      subtitle: 'Display your contact information',
      icon: User,
      type: 'switch',
    },
    {
      key: 'allowMessages',
      title: 'Allow Messages',
      subtitle: 'Let other users send you messages',
      icon: Lock,
      type: 'switch',
    },
  ];

  const dataSettings = [
    {
      key: 'dataCollection',
      title: 'Data Collection',
      subtitle: 'Allow us to collect usage data to improve the app',
      icon: Shield,
      type: 'switch',
    },
    {
      key: 'analytics',
      title: 'Analytics',
      subtitle: 'Help us improve by sharing anonymous usage data',
      icon: Shield,
      type: 'switch',
    },
    {
      key: 'marketingEmails',
      title: 'Marketing Emails',
      subtitle: 'Receive promotional emails and offers',
      icon: Shield,
      type: 'switch',
    },
  ];

  const dataActions = [
    {
      key: 'exportData',
      title: 'Export My Data',
      subtitle: 'Download a copy of your personal data',
      icon: Download,
      action: handleExportData,
      color: '#3B82F6',
    },
    {
      key: 'deleteAccount',
      title: 'Delete Account',
      subtitle: 'Permanently delete your account and all data',
      icon: Trash2,
      action: handleDeleteAccount,
      color: '#EF4444',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.title}>Privacy & Security</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Privacy Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy Settings</Text>
          {privacyOptions.map((item) => {
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
                {item.type === 'switch' && (
                  <Switch
                    value={privacySettings[item.key as keyof typeof privacySettings] as boolean}
                    onValueChange={() => toggleSwitch(item.key as keyof typeof privacySettings)}
                    trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
                    thumbColor={privacySettings[item.key as keyof typeof privacySettings] as boolean ? '#FFFFFF' : '#FFFFFF'}
                  />
                )}
                {item.type === 'select' && (
                  <TouchableOpacity style={styles.selectButton}>
                    <Text style={styles.selectButtonText}>
                      {privacySettings[item.key as keyof typeof privacySettings] as string}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </View>

        {/* Data & Analytics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data & Analytics</Text>
          {dataSettings.map((item) => {
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
                  value={privacySettings[item.key as keyof typeof privacySettings] as boolean}
                  onValueChange={() => toggleSwitch(item.key as keyof typeof privacySettings)}
                  trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
                  thumbColor={privacySettings[item.key as keyof typeof privacySettings] as boolean ? '#FFFFFF' : '#FFFFFF'}
                />
              </View>
            );
          })}
        </View>

        {/* Data Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          {dataActions.map((item) => {
            const Icon = item.icon;
            return (
              <TouchableOpacity key={item.key} style={styles.settingItem} onPress={item.action}>
                <View style={styles.settingInfo}>
                  <Icon size={20} color={item.color} style={styles.settingIcon} />
                  <View style={styles.settingText}>
                    <Text style={[styles.settingTitle, { color: item.color }]}>{item.title}</Text>
                    <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Privacy Policy */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal</Text>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Privacy Policy</Text>
                <Text style={styles.settingSubtitle}>Read our privacy policy</Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Terms of Service</Text>
                <Text style={styles.settingSubtitle}>Read our terms of service</Text>
              </View>
            </View>
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
  selectButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  selectButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
});
