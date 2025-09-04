import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '@/components/AuthContext';
import { LanguageProvider } from '@/components/LanguageContext';
import { VenueProvider } from '@/components/VenueContext';
import { VenueSetupGuard } from '@/components/VenueSetupGuard';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import '../i18n';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <LanguageProvider>
      <AuthProvider>
        <VenueProvider>
          <VenueSetupGuard>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="onboarding" />
                          <Stack.Screen name="auth" />
            <Stack.Screen name="first-venue-setup" />
            <Stack.Screen name="edit-venue" />
            <Stack.Screen name="(tabs)" />
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="auto" />
          </VenueSetupGuard>
        </VenueProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}