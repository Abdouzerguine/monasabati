import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Venue } from '@/types';
import { mockVenues } from '@/data/mockData';

interface VenueContextType {
  venues: Venue[];
  addVenue: (venue: Omit<Venue, 'id' | 'rating' | 'reviewCount' | 'createdAt'>) => Promise<void>;
  updateVenue: (id: string, updates: Partial<Venue>) => Promise<void>;
  deleteVenue: (id: string) => Promise<void>;
  getVenuesByOwner: (ownerId: string) => Venue[];
  isLoading: boolean;
}

const VenueContext = createContext<VenueContextType | undefined>(undefined);

export function VenueProvider({ children }: { children: React.ReactNode }) {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadVenues();
  }, []);

  const loadVenues = async () => {
    try {
      const storedVenues = await AsyncStorage.getItem('venues');
      if (storedVenues) {
        setVenues(JSON.parse(storedVenues));
      } else {
        setVenues(mockVenues);
        await AsyncStorage.setItem('venues', JSON.stringify(mockVenues));
      }
    } catch (error) {
      console.error('Error loading venues:', error);
      setVenues(mockVenues);
    } finally {
      setIsLoading(false);
    }
  };

  const addVenue = async (venueData: Omit<Venue, 'id' | 'rating' | 'reviewCount' | 'createdAt'>) => {
    try {
      const newVenue: Venue = {
        ...venueData,
        id: Date.now().toString(),
        rating: 0,
        reviewCount: 0,
        createdAt: new Date().toISOString().split('T')[0],
      };

      const updatedVenues = [...venues, newVenue];
      setVenues(updatedVenues);
      await AsyncStorage.setItem('venues', JSON.stringify(updatedVenues));
    } catch (error) {
      console.error('Error adding venue:', error);
      throw error;
    }
  };

  const updateVenue = async (id: string, updates: Partial<Venue>) => {
    try {
      const updatedVenues = venues.map(venue => 
        venue.id === id ? { ...venue, ...updates } : venue
      );
      setVenues(updatedVenues);
      await AsyncStorage.setItem('venues', JSON.stringify(updatedVenues));
    } catch (error) {
      console.error('Error updating venue:', error);
      throw error;
    }
  };

  const deleteVenue = async (id: string) => {
    try {
      const updatedVenues = venues.filter(venue => venue.id !== id);
      setVenues(updatedVenues);
      await AsyncStorage.setItem('venues', JSON.stringify(updatedVenues));
    } catch (error) {
      console.error('Error deleting venue:', error);
      throw error;
    }
  };

  const getVenuesByOwner = (ownerId: string) => {
    return venues.filter(venue => venue.ownerId === ownerId);
  };

  return (
    <VenueContext.Provider value={{
      venues,
      addVenue,
      updateVenue,
      deleteVenue,
      getVenuesByOwner,
      isLoading,
    }}>
      {children}
    </VenueContext.Provider>
  );
}

export function useVenues() {
  const context = useContext(VenueContext);
  if (context === undefined) {
    throw new Error('useVenues must be used within a VenueProvider');
  }
  return context;
}
