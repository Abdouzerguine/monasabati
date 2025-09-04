import AsyncStorage from '@react-native-async-storage/async-storage';
import { AvailabilityMap } from './AvailabilityCalendar';

const KEY_PREFIX = 'venue_availability:';

export async function loadAvailability(venueId: string): Promise<AvailabilityMap | null> {
  try {
    const raw = await AsyncStorage.getItem(KEY_PREFIX + venueId);
    if (!raw) return null;
    return JSON.parse(raw) as AvailabilityMap;
  } catch (e) {
    return null;
  }
}

export async function saveAvailability(venueId: string, map: AvailabilityMap): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY_PREFIX + venueId, JSON.stringify(map));
  } catch (e) {
    // noop
  }
}
