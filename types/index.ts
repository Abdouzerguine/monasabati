export interface Venue {
  id: string;
  name: string;
  description: string;
  location: string;
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
  availability: string[];
  createdAt: string;
}

export interface Booking {
  id: string;
  venueId: string;
  venueName: string;
  venueImage: string;
  userId: string;
  userName: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
  guests: number;
  specialRequests?: string;
}

export interface Review {
  id: string;
  venueId: string;
  userId: string;
  userName: string;
  userImage?: string;
  rating: number;
  comment: string;
  createdAt: string;
}