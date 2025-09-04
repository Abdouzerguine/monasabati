import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useAuth } from './AuthContext';
import { useVenues } from './VenueContext';
import { router } from 'expo-router';

interface VenueSetupGuardProps {
  children: React.ReactNode;
}

export function VenueSetupGuard({ children }: VenueSetupGuardProps) {
  const { user, isLoading: authLoading } = useAuth();
  const { getVenuesByOwner, isLoading: venuesLoading } = useVenues();

  useEffect(() => {
    if (authLoading || venuesLoading) return;

    if (user?.userType === 'owner') {
      const ownerVenues = getVenuesByOwner(user.id);
      if (ownerVenues.length === 0) {
        // Owner has no venues, redirect to first venue setup
        router.replace('/first-venue-setup');
      }
    }
  }, [user, authLoading, venuesLoading, getVenuesByOwner]);

  // Show loading while checking
  if (authLoading || venuesLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={{ marginTop: 16, color: '#6B7280' }}>Loading...</Text>
      </View>
    );
  }

  return <>{children}</>;
}
