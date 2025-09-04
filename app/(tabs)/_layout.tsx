import { Tabs } from 'expo-router';
import { Chrome as Home, Search, Calendar, User, Plus, Building2 } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/components/AuthContext';

export default function TabLayout() {
  const { user } = useAuth();
  const { t } = useTranslation();

  if (user?.userType === 'owner') {
    return (
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: 'white',
            borderTopWidth: 1,
            borderTopColor: '#E5E7EB',
            paddingBottom: 8,
            paddingTop: 8,
            height: 88,
          },
          tabBarActiveTintColor: '#3B82F6',
          tabBarInactiveTintColor: '#6B7280',
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: t('tabs.dashboard'),
            tabBarIcon: ({ size, color }) => <Home size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="venues"
          options={{
            title: t('tabs.myVenues'),
            tabBarIcon: ({ size, color }) => <Building2 size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="availability"
          options={{
            title: t('tabs.availability', 'Availability'),
            tabBarIcon: ({ size, color }) => <Calendar size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="add-venue"
          options={{
            title: t('tabs.addVenue'),
            tabBarIcon: ({ size, color }) => <Plus size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="bookings"
          options={{
            title: t('tabs.bookings'),
            tabBarIcon: ({ size, color }) => <Calendar size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: t('tabs.profile'),
            tabBarIcon: ({ size, color }) => <User size={size} color={color} />,
          }}
        />
      </Tabs>
    );
  }

  // Regular user tabs
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          paddingBottom: 8,
          paddingTop: 8,
          height: 88,
        },
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#6B7280',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.home'),
          tabBarIcon: ({ size, color }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: t('tabs.search'),
          tabBarIcon: ({ size, color }) => <Search size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: t('tabs.bookings'),
          tabBarIcon: ({ size, color }) => <Calendar size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('tabs.profile'),
          tabBarIcon: ({ size, color }) => <User size={size} color={color} />,
        }}
      />
      {/* Hide owner-specific screens for regular users */}
      <Tabs.Screen
        name="venues"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="add-venue"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="availability"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}