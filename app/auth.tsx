import { useState } from 'react';
import { router } from 'expo-router';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { User, Building2 } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/components/AuthContext';

export default function AuthScreen() {
  const { t } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState<'user' | 'owner'>('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [placeName, setPlaceName] = useState('');
  const { login, register } = useAuth();

  const handleAuth = async () => {
    if (!email || !password || (!isLogin && (!name || (userType === 'owner' && (!phone || !placeName))))) {
      Alert.alert(t('common.error'), t('auth.fillAllFields'));
      return;
    }

    try {
      if (isLogin) {
        await login(email, password, userType);
        router.replace('/(tabs)');
      } else {
        await register(email, password, name, userType, phone || undefined, placeName || undefined);
        // Navigation is handled in the register function based on user type
      }
    } catch (error) {
      Alert.alert(t('common.error'), t('auth.authenticationFailed'));
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          {isLogin ? t('auth.welcomeBack') : t('auth.createAccount')}
        </Text>
        <Text style={styles.subtitle}>
          {isLogin ? t('auth.signInToContinue') : t('auth.joinMonasabeti')}
        </Text>

        {/* User Type Selection */}
        <View style={styles.userTypeContainer}>
          <Text style={styles.label}>{t('auth.iAmA')}</Text>
          <View style={styles.userTypeButtons}>
            <TouchableOpacity
              style={[
                styles.userTypeButton,
                userType === 'user' && styles.activeUserType,
              ]}
              onPress={() => setUserType('user')}
            >
              <User size={24} color={userType === 'user' ? '#3B82F6' : '#6B7280'} />
              <Text
                style={[
                  styles.userTypeText,
                  userType === 'user' && styles.activeUserTypeText,
                ]}
              >
                {t('auth.eventOrganizer')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.userTypeButton,
                userType === 'owner' && styles.activeUserType,
              ]}
              onPress={() => setUserType('owner')}
            >
              <Building2 size={24} color={userType === 'owner' ? '#3B82F6' : '#6B7280'} />
              <Text
                style={[
                  styles.userTypeText,
                  userType === 'owner' && styles.activeUserTypeText,
                ]}
              >
                {t('auth.venueOwner')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Form Fields */}
        {!isLogin && (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>{t('auth.fullName')}</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder={t('auth.enterFullName')}
              autoCapitalize="words"
            />
          </View>
        )}

        {!isLogin && userType === 'owner' && (
          <>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t('profile.phone')}</Text>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder={t('profile.phone')}
                keyboardType="phone-pad"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t('addVenue.venueName')}</Text>
              <TextInput
                style={styles.input}
                value={placeName}
                onChangeText={setPlaceName}
                placeholder={t('addVenue.venueName')}
              />
            </View>
          </>
        )}

        <View style={styles.inputContainer}>
          <Text style={styles.label}>{t('auth.email')}</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
                          placeholder={t('auth.enterEmail')}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>{t('auth.password')}</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
                          placeholder={t('auth.enterPassword')}
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={styles.authButton} onPress={handleAuth}>
          <Text style={styles.authButtonText}>
            {isLogin ? t('auth.signIn') : t('auth.createAccount')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.switchButton}
          onPress={() => setIsLogin(!isLogin)}
        >
          <Text style={styles.switchText}>
            {isLogin ? t('auth.dontHaveAccount') : t('auth.alreadyHaveAccount')}
            <Text style={styles.switchLink}>
              {isLogin ? t('auth.signUp') : t('auth.signIn')}
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    padding: 24,
    paddingTop: 80,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 32,
  },
  userTypeContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  userTypeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  userTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    gap: 8,
  },
  activeUserType: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  userTypeText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  activeUserTypeText: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
  },
  authButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 8,
  },
  authButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  switchButton: {
    marginTop: 24,
    alignItems: 'center',
  },
  switchText: {
    fontSize: 14,
    color: '#6B7280',
  },
  switchLink: {
    color: '#3B82F6',
    fontWeight: '600',
  },
});