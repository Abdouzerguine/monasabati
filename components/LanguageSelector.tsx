import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useLanguage } from './LanguageContext';
import { Globe } from 'lucide-react-native';

export default function LanguageSelector() {
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage } = useLanguage();

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'ar', name: 'العربية', nativeName: 'Arabic' },
  ];

  const handleLanguageChange = async (languageCode: string) => {
    if (languageCode !== currentLanguage) {
      await changeLanguage(languageCode);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Globe size={20} color="#6B7280" />
        <Text style={styles.title}>{t('profile.language')}</Text>
      </View>
      
      <View style={styles.languageList}>
        {languages.map((language) => (
          <TouchableOpacity
            key={language.code}
            style={[
              styles.languageItem,
              currentLanguage === language.code && styles.selectedLanguage,
            ]}
            onPress={() => handleLanguageChange(language.code)}
          >
            <View style={styles.languageInfo}>
              <Text style={[
                styles.languageName,
                currentLanguage === language.code && styles.selectedLanguageText,
              ]}>
                {language.name}
              </Text>
              <Text style={[
                styles.languageNativeName,
                currentLanguage === language.code && styles.selectedLanguageText,
              ]}>
                {language.nativeName}
              </Text>
            </View>
            
            {currentLanguage === language.code && (
              <View style={styles.checkmark}>
                <Text style={styles.checkmarkText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
  },
  languageList: {
    gap: 8,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedLanguage: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  languageNativeName: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  selectedLanguageText: {
    color: 'white',
  },
  checkmark: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: '#3B82F6',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
