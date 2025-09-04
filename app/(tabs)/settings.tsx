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
import { ArrowLeft, Settings, Moon, Sun, Globe, Volume2, VolumeX, Smartphone, Wifi, Battery } from 'lucide-react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function SettingsScreen() {
  const { t } = useTranslation();
  
  const [settings, setSettings] = useState({
    darkMode: false,
    autoSave: true,
    locationServices: true,
    backgroundRefresh: true,
    lowPowerMode: false,
    dataSaver: false,
    soundEnabled: true,
    hapticFeedback: true,
    autoUpdate: true,
    cacheEnabled: true,
  });

  const toggleSwitch = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'Are you sure you want to clear the app cache? This will free up storage space.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear Cache', 
          onPress: () => {
            Alert.alert('Success', 'Cache cleared successfully');
          },
        },
      ]
    );
  };

  const handleResetSettings = () => {
    Alert.alert(
      'Reset Settings',
      'Are you sure you want to reset all settings to default?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: () => {
            setSettings({
              darkMode: false,
              autoSave: true,
              locationServices: true,
              backgroundRefresh: true,
              lowPowerMode: false,
              dataSaver: false,
              soundEnabled: true,
              hapticFeedback: true,
              autoUpdate: true,
              cacheEnabled: true,
            });
            Alert.alert('Success', 'Settings reset to default');
          },
        },
      ]
    );
  };

  const appSettings = [
    {
      key: 'darkMode',
      title: 'Dark Mode',
      subtitle: 'Use dark theme throughout the app',
      icon: Moon,
    },
    {
      key: 'autoSave',
      title: 'Auto Save',
      subtitle: 'Automatically save your changes',
      icon: Settings,
    },
    {
      key: 'locationServices',
      title: 'Location Services',
      subtitle: 'Allow app to access your location',
      icon: Globe,
    },
    {
      key: 'backgroundRefresh',
      title: 'Background Refresh',
      subtitle: 'Allow app to refresh in background',
      icon: Smartphone,
    },
  ];

  const performanceSettings = [
    {
      key: 'lowPowerMode',
      title: 'Low Power Mode',
      subtitle: 'Reduce app performance to save battery',
      icon: Battery,
    },
    {
      key: 'dataSaver',
      title: 'Data Saver',
      subtitle: 'Reduce data usage',
      icon: Wifi,
    },
    {
      key: 'cacheEnabled',
      title: 'Cache Data',
      subtitle: 'Store data locally for faster access',
      icon: Settings,
    },
  ];

  const soundSettings = [
    {
      key: 'soundEnabled',
      title: 'Sound Effects',
      subtitle: 'Play sound effects in the app',
      icon: Volume2,
    },
    {
      key: 'hapticFeedback',
      title: 'Haptic Feedback',
      subtitle: 'Vibrate on touch interactions',
      icon: Smartphone,
    },
  ];

  const systemSettings = [
    {
      key: 'autoUpdate',
      title: 'Auto Update',
      subtitle: 'Automatically update the app',
      icon: Settings,
    },
  ];

  const actions = [
    {
      key: 'clearCache',
      title: 'Clear Cache',
      subtitle: 'Free up storage space',
      icon: Settings,
      action: handleClearCache,
      color: '#3B82F6',
    },
    {
      key: 'resetSettings',
      title: 'Reset Settings',
      subtitle: 'Reset all settings to default',
      icon: Settings,
      action: handleResetSettings,
      color: '#EF4444',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* App Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Settings</Text>
          {appSettings.map((item) => {
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
                  value={settings[item.key as keyof typeof settings]}
                  onValueChange={() => toggleSwitch(item.key as keyof typeof settings)}
                  trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
                  thumbColor={settings[item.key as keyof typeof settings] ? '#FFFFFF' : '#FFFFFF'}
                />
              </View>
            );
          })}
        </View>

        {/* Performance Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance</Text>
          {performanceSettings.map((item) => {
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
                  value={settings[item.key as keyof typeof settings]}
                  onValueChange={() => toggleSwitch(item.key as keyof typeof settings)}
                  trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
                  thumbColor={settings[item.key as keyof typeof settings] ? '#FFFFFF' : '#FFFFFF'}
                />
              </View>
            );
          })}
        </View>

        {/* Sound Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sound & Haptics</Text>
          {soundSettings.map((item) => {
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
                  value={settings[item.key as keyof typeof settings]}
                  onValueChange={() => toggleSwitch(item.key as keyof typeof settings)}
                  trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
                  thumbColor={settings[item.key as keyof typeof settings] ? '#FFFFFF' : '#FFFFFF'}
                />
              </View>
            );
          })}
        </View>

        {/* System Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>System</Text>
          {systemSettings.map((item) => {
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
                  value={settings[item.key as keyof typeof settings]}
                  onValueChange={() => toggleSwitch(item.key as keyof typeof settings)}
                  trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
                  thumbColor={settings[item.key as keyof typeof settings] ? '#FFFFFF' : '#FFFFFF'}
                />
              </View>
            );
          })}
        </View>

        {/* Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions</Text>
          {actions.map((item) => {
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

        {/* App Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Information</Text>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Version</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Build</Text>
            <Text style={styles.infoValue}>2024.1.1</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Size</Text>
            <Text style={styles.infoValue}>45.2 MB</Text>
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
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  infoLabel: {
    fontSize: 16,
    color: '#374151',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
  },
});
