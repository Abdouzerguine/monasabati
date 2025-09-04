import { Venue, Booking, Review, Analytics, TimeSlot } from '../types';

// Generate time slots for venues
const generateTimeSlots = (dates: string[]): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const times = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];
  
  dates.forEach(date => {
    times.forEach((time, index) => {
      const endTime = times[index + 1] || '21:00';
      slots.push({
        date,
        startTime: time,
        endTime,
        isAvailable: Math.random() > 0.3, // 70% availability
        price: 50 + Math.floor(Math.random() * 100), // Random price between $50-150
      });
    });
  });
  
  return slots;
};

// Generate dates for the next 30 days
const generateDates = (count: number = 30): string[] => {
  const dates: string[] = [];
  const today = new Date();
  
  for (let i = 0; i < count; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
  }
  
  return dates;
};

const availableDates = generateDates(30);

export const mockVenues: Venue[] = [
  {
    id: '1',
    name: 'Grand Event Hall',
    description: 'Elegant venue perfect for weddings and celebrations. Features crystal chandeliers and marble floors.',
    location: 'Downtown Algiers, Algeria',
    coordinates: { lat: 36.7538, lng: 3.0588 },
    price: 1500,
    priceUnit: 'per day',
    images: [
      'https://images.pexels.com/photos/1587927/pexels-photo-1587927.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2306281/pexels-photo-2306281.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    amenities: ['WiFi', 'Parking', 'Sound System', 'Air Conditioning', 'Catering Kitchen', 'Dance Floor'],
    capacity: 200,
    category: 'Event Hall',
    rating: 4.8,
    reviewCount: 45,
    ownerId: 'owner1',
    ownerName: 'Ahmed Ben Ali',
    ownerPhone: '+213 555 123 456',
    availability: generateTimeSlots(availableDates.slice(0, 15)),
    createdAt: '2025-01-01',
    isFavorite: false,
  },
  {
    id: '2',
    name: 'Rooftop Restaurant',
    description: 'Beautiful rooftop space with city views. Perfect for outdoor celebrations and cocktail parties.',
    location: 'Highlands District, Oran',
    coordinates: { lat: 35.6969, lng: -0.6331 },
    price: 800,
    priceUnit: 'per day',
    images: [
      'https://images.pexels.com/photos/2306281/pexels-photo-2306281.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1587927/pexels-photo-1587927.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    amenities: ['City View', 'Bar Equipment', 'Outdoor Seating', 'Weather Protection', 'Sound System'],
    capacity: 100,
    category: 'Rooftop',
    rating: 4.6,
    reviewCount: 28,
    ownerId: 'owner2',
    ownerName: 'Fatima Zahra',
    ownerPhone: '+213 555 789 012',
    availability: generateTimeSlots(availableDates.slice(5, 20)),
    createdAt: '2025-01-02',
    isFavorite: true,
  },
  {
    id: '3',
    name: 'Modern Conference Center',
    description: 'State-of-the-art conference facility with latest audio-visual equipment and flexible seating arrangements.',
    location: 'Business District, Constantine',
    coordinates: { lat: 36.3650, lng: 6.6147 },
    price: 1200,
    priceUnit: 'per day',
    images: [
      'https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2306281/pexels-photo-2306281.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    amenities: ['Projectors', 'WiFi', 'Whiteboards', 'Video Conferencing', 'Coffee Station', 'Parking'],
    capacity: 80,
    category: 'Conference',
    rating: 4.7,
    reviewCount: 32,
    ownerId: 'owner1',
    ownerName: 'Ahmed Ben Ali',
    ownerPhone: '+213 555 123 456',
    availability: generateTimeSlots(availableDates.slice(10, 25)),
    createdAt: '2025-01-03',
    isFavorite: false,
  },
];

export const mockBookings: Booking[] = [
  {
    id: '1',
    venueId: '1',
    venueName: 'Grand Event Hall',
    venueImage: 'https://images.pexels.com/photos/1587927/pexels-photo-1587927.jpeg?auto=compress&cs=tinysrgb&w=400',
    userId: 'user1',
    userName: 'Mohamed Ahmed',
    userEmail: 'mohamed@example.com',
    startDate: '2025-01-25',
    endDate: '2025-01-25',
    startTime: '18:00',
    endTime: '23:00',
    totalPrice: 1500,
    status: 'confirmed',
    createdAt: '2025-01-15',
    guests: 150,
    specialRequests: 'Need extra tables for registration',
    paymentStatus: 'paid',
  },
  {
    id: '2',
    venueId: '2',
    venueName: 'Rooftop Restaurant',
    venueImage: 'https://images.pexels.com/photos/2306281/pexels-photo-2306281.jpeg?auto=compress&cs=tinysrgb&w=400',
    userId: 'user1',
    userName: 'Mohamed Ahmed',
    userEmail: 'mohamed@example.com',
    startDate: '2025-01-30',
    endDate: '2025-01-30',
    startTime: '19:00',
    endTime: '22:00',
    totalPrice: 800,
    status: 'pending',
    createdAt: '2025-01-16',
    guests: 75,
    paymentStatus: 'pending',
  },
];

export const mockReviews: Review[] = [
  {
    id: '1',
    venueId: '1',
    userId: 'user1',
    userName: 'Mohamed Ahmed',
    rating: 5,
    comment: 'Absolutely stunning venue! The staff was incredibly helpful and the space exceeded our expectations. Highly recommend for weddings.',
    images: [
      'https://images.pexels.com/photos/1587927/pexels-photo-1587927.jpeg?auto=compress&cs=tinysrgb&w=400',
    ],
    createdAt: '2025-01-10',
    helpful: 12,
  },
  {
    id: '2',
    venueId: '1',
    userId: 'user2',
    userName: 'Fatima Ali',
    rating: 4,
    comment: 'Great location and excellent facilities. The venue was perfect for our celebration. Very reasonable pricing.',
    createdAt: '2025-01-08',
    helpful: 8,
  },
  {
    id: '3',
    venueId: '2',
    userId: 'user3',
    userName: 'Sarah Mohamed',
    rating: 5,
    comment: 'Beautiful rooftop with amazing city views. Perfect for our cocktail party. The weather protection was a great feature.',
    images: [
      'https://images.pexels.com/photos/2306281/pexels-photo-2306281.jpeg?auto=compress&cs=tinysrgb&w=400',
    ],
    createdAt: '2025-01-12',
    helpful: 15,
  },
];

export const mockAnalytics: Analytics = {
  totalRevenue: 45000,
  totalBookings: 127,
  averageRating: 4.7,
  occupancyRate: 78,
  monthlyRevenue: [
    { month: 'Jan', revenue: 12000 },
    { month: 'Feb', revenue: 15000 },
    { month: 'Mar', revenue: 18000 },
    { month: 'Apr', revenue: 22000 },
    { month: 'May', revenue: 25000 },
    { month: 'Jun', revenue: 28000 },
  ],
  popularTimeSlots: [
    { time: '09:00', bookings: 5 },
    { time: '12:00', bookings: 12 },
    { time: '15:00', bookings: 18 },
    { time: '18:00', bookings: 25 },
    { time: '19:00', bookings: 30 },
    { time: '20:00', bookings: 22 },
    { time: '21:00', bookings: 15 },
  ],
  topVenues: [
    { venueId: '1', venueName: 'Grand Event Hall', revenue: 25000 },
    { venueId: '2', venueName: 'Rooftop Restaurant', revenue: 15000 },
    { venueId: '3', venueName: 'Modern Conference Center', revenue: 5000 },
  ],
};