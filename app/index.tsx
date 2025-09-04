import { useEffect } from 'react';
import { router } from 'expo-router';
import { View, StyleSheet, Image, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/components/AuthContext';

export default function SplashScreen() {
  const { user, isLoading } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isLoading) {
        if (user) {
          router.replace('/(tabs)');
        } else {
          router.replace('/onboarding');
        }
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [user, isLoading]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>M</Text>
          </View>
          <Text style={styles.title}>Monasabeti</Text>
          <Text style={styles.subtitle}>{t('onboarding.subtitle')}</Text>
          <Text style={{ marginTop: 32, color: '#6B7280', fontSize: 16 }}>Loading...</Text>
        </View>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.logoPlaceholder}>
          <Text style={styles.logoText}>M</Text>
        </View>
        <Text style={styles.title}>Monasabeti</Text>
        <Text style={styles.subtitle}>{t('onboarding.subtitle')}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: 'white',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.8,
  },
});