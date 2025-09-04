export interface Venue {
  id: string;
  name: string;
  description: string;
  location: string;
  coordinates?: { lat: number; lng: number };
  price: number;
  priceUnit: string;
  images: string[];
  amenities: string[];
  capacity: number;
  category: string;
  rating: number;
  reviewCount: number;
  ownerId: string;
  ownerName: string;
  ownerPhone?: string;
  availability: TimeSlot[];
  createdAt: string;
  isFavorite?: boolean;
}

export interface TimeSlot {
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  price?: number;
}

export interface Booking {
  id: string;
  venueId: string;
  venueName: string;
  venueImage: string;
  userId: string;
  userName: string;
  userEmail: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
  guests: number;
  specialRequests?: string;
  paymentStatus: 'pending' | 'paid' | 'refunded';
}

export interface Review {
  id: string;
  venueId: string;
  userId: string;
  userName: string;
  userImage?: string;
  rating: number;
  comment: string;
  images?: string[];
  createdAt: string;
  helpful: number;
}

export interface ChatMessage {
  id: string;
  bookingId: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: string;
  type: 'text' | 'image' | 'system';
  read: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  userType: 'user' | 'owner';
  profileImage?: string;
  phone?: string;
  bio?: string;
  language: 'en' | 'ar' | 'fr';
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  favorites: string[];
  createdAt: string;
}

export interface Analytics {
  totalRevenue: number;
  totalBookings: number;
  averageRating: number;
  occupancyRate: number;
  monthlyRevenue: { month: string; revenue: number }[];
  popularTimeSlots: { time: string; bookings: number }[];
  topVenues: { venueId: string; venueName: string; revenue: number }[];
}