@@ .. @@
 import React, { useState } from 'react';
-import { MapPin, Star, Users, Calendar, Phone, MessageCircle, ArrowLeft } from 'lucide-react';
+import { MapPin, Star, Users, Calendar, Phone, MessageCircle, ArrowLeft, Clock } from 'lucide-react';
 import { useParams, useNavigate } from 'react-router-dom';
 import { useAuth } from '../contexts/AuthContext';
 import { useVenues } from '../contexts/VenueContext';
+import { mockReviews } from '../data/mockData';
+import { TimeSlot } from '../types';
+import AdvancedCalendar from '../components/AdvancedCalendar';
+import ReviewSystem from '../components/ReviewSystem';
+import GoogleMap from '../components/GoogleMap';
+import SocialFeatures from '../components/SocialFeatures';
+import Chat from '../components/Chat';
 
 export default function VenueDetails() {
@@ .. @@
   const [selectedDate, setSelectedDate] = useState('');
+  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | undefined>();
   const [guestCount, setGuestCount] = useState('');
   const [specialRequests, setSpecialRequests] = useState('');
+  const [showChat, setShowChat] = useState(false);
+  const [activeImageIndex, setActiveImageIndex] = useState(0);
 
@@ .. @@
   }
 
+  const venueReviews = mockReviews.filter(review => review.venueId === venue.id);
+
+  const handleAddReview = (newReview: any) => {
+    console.log('New review added:', newReview);
+    // In a real app, save to backend
+  };
+
+  const handleTimeSlotSelect = (slot: TimeSlot) => {
+    setSelectedTimeSlot(slot);
+    setSelectedDate(slot.date);
+  };
+
   const handleBooking = () => {
-    if (!selectedDate || !guestCount) {
+    if (!selectedDate || !selectedTimeSlot || !guestCount) {
-      alert('Please fill in all required fields');
+      alert('Please select date, time slot, and number of guests');
       return;
     }
@@ .. @@
       startDate: selectedDate,
       endDate: selectedDate,
+      startTime: selectedTimeSlot.startTime,
+      endTime: selectedTimeSlot.endTime,
-      totalPrice: venue.price,
+      totalPrice: selectedTimeSlot.price || venue.price,
       status: 'pending' as const,
@@ .. @@
       guests: parseInt(guestCount),
       specialRequests: specialRequests || undefined,
+      paymentStatus: 'pending' as const,
+      userEmail: user?.email || 'user@example.com',
     };
@@ .. @@
       <div className="min-h-screen bg-gray-50">
         {/* Header */}
-        <div className="bg-white shadow-sm border-b">
+        <div className="bg-white shadow-sm border-b sticky top-0 z-10">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
@@ .. @@
         {/* Main Content */}
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
-          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
+          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             {/* Left Column - Images and Info */}
             <div className="lg:col-span-2 space-y-6">
               {/* Image Gallery */}
-              <div className="bg-white rounded-lg overflow-hidden shadow-sm">
+              <div className="bg-white rounded-lg overflow-hidden shadow-sm border">
-                <img
+                <div className="relative">
+                  <img
-                  src={venue.images[0]}
+                    src={venue.images[activeImageIndex]}
                     alt={venue.name}
-                    className="w-full h-64 object-cover"
+                    className="w-full h-80 object-cover"
                   />
+                  
+                  {/* Image Navigation */}
+                  {venue.images.length > 1 && (
+                    <>
+                      <button
+                        onClick={() => setActiveImageIndex(prev => 
+                          prev === 0 ? venue.images.length - 1 : prev - 1
+                        )}
+                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
+                      >
+                        <ArrowLeft size={20} />
+                      </button>
+                      <button
+                        onClick={() => setActiveImageIndex(prev => 
+                          prev === venue.images.length - 1 ? 0 : prev + 1
+                        )}
+                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
+                      >
+                        <ArrowLeft size={20} className="rotate-180" />
+                      </button>
+                    </>
+                  )}
+                  
+                  {/* Image Indicators */}
+                  {venue.images.length > 1 && (
+                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
+                      {venue.images.map((_, index) => (
+                        <button
+                          key={index}
+                          onClick={() => setActiveImageIndex(index)}
+                          className={`w-2 h-2 rounded-full transition-all ${
+                            index === activeImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
+                          }`}
+                        />
+                      ))}
+                    </div>
+                  )}
+                </div>
+                
+                {/* Thumbnail Strip */}
+                {venue.images.length > 1 && (
+                  <div className="p-4 bg-gray-50">
+                    <div className="flex space-x-2 overflow-x-auto">
+                      {venue.images.map((image, index) => (
+                        <button
+                          key={index}
+                          onClick={() => setActiveImageIndex(index)}
+                          className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
+                            index === activeImageIndex ? 'border-blue-500' : 'border-gray-200'
+                          }`}
+                        >
+                          <img
+                            src={image}
+                            alt={`${venue.name} ${index + 1}`}
+                            className="w-full h-full object-cover"
+                          />
+                        </button>
+                      ))}
+                    </div>
+                  </div>
+                )}
               </div>
@@ .. @@
               {/* Venue Information */}
-              <div className="bg-white rounded-lg p-6 shadow-sm">
+              <div className="bg-white rounded-lg p-6 shadow-sm border">
                 <div className="flex items-start justify-between mb-4">
@@ .. @@
                     <h1 className="text-3xl font-bold text-gray-900">{venue.name}</h1>
                     <div className="flex items-center mt-2">
@@ .. @@
                       <span className="ml-2 text-gray-600">({venue.reviewCount} reviews)</span>
                     </div>
+                    
+                    <div className="flex items-center mt-2 text-gray-600">
+                      <MapPin size={16} className="mr-1" />
+                      <span>{venue.location}</span>
+                    </div>
                   </div>
+                  
+                  {/* Social Features */}
+                  <SocialFeatures 
+                    venueId={venue.id}
+                    venueName={venue.name}
+                    initialFavorites={23}
+                    initialShares={8}
+                  />
                 </div>
@@ .. @@
                 <p className="text-gray-700 mb-6">{venue.description}</p>
@@ .. @@
                 {/* Key Details */}
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
@@ .. @@
                     <div className="text-center p-4 bg-gray-50 rounded-lg">
                       <Users className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                       <p className="text-sm text-gray-600">Capacity</p>
                       <p className="font-semibold text-gray-900">{venue.capacity} guests</p>
                     </div>
                     <div className="text-center p-4 bg-gray-50 rounded-lg">
-                      <Calendar className="h-6 w-6 text-green-600 mx-auto mb-2" />
+                      <Clock className="h-6 w-6 text-green-600 mx-auto mb-2" />
                       <p className="text-sm text-gray-600">Price</p>
                       <p className="font-semibold text-gray-900">${venue.price}/{venue.priceUnit}</p>
                     </div>
+                    <div className="text-center p-4 bg-gray-50 rounded-lg">
+                      <Calendar className="h-6 w-6 text-purple-600 mx-auto mb-2" />
+                      <p className="text-sm text-gray-600">Category</p>
+                      <p className="font-semibold text-gray-900">{venue.category}</p>
+                    </div>
+                    <div className="text-center p-4 bg-gray-50 rounded-lg">
+                      <Phone className="h-6 w-6 text-orange-600 mx-auto mb-2" />
+                      <p className="text-sm text-gray-600">Contact</p>
+                      <p className="font-semibold text-gray-900">Available</p>
+                    </div>
                 </div>
@@ .. @@
                 {/* Amenities */}
                 <div className="mb-6">
@@ .. @@
                   </div>
                 </div>
+                
+                {/* Contact Owner */}
+                <div className="flex space-x-3">
+                  <button
+                    onClick={() => alert(`Calling ${venue.ownerName}: ${venue.ownerPhone}`)}
+                    className="flex-1 flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
+                  >
+                    <Phone size={18} className="mr-2" />
+                    Call Owner
+                  </button>
+                  <button
+                    onClick={() => setShowChat(true)}
+                    className="flex-1 flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
+                  >
+                    <MessageCircle size={18} className="mr-2" />
+                    Chat
+                  </button>
+                </div>
               </div>
+              
+              {/* Map */}
+              <GoogleMap
+                center={venue.coordinates}
+                venues={[{
+                  id: venue.id,
+                  name: venue.name,
+                  location: venue.location,
+                  coordinates: venue.coordinates,
+                  price: venue.price,
+                }]}
+                height="300px"
+              />
+              
+              {/* Reviews */}
+              <ReviewSystem
+                venueId={venue.id}
+                reviews={venueReviews}
+                onAddReview={handleAddReview}
+              />
             </div>
@@ .. @@
             {/* Right Column - Booking Form */}
-            <div className="lg:col-span-1">
+            <div className="space-y-6">
-              <div className="bg-white rounded-lg p-6 shadow-sm sticky top-8">
+              {/* Advanced Calendar */}
+              <AdvancedCalendar
+                availability={venue.availability}
+                onSlotSelect={handleTimeSlotSelect}
+                selectedSlot={selectedTimeSlot}
+              />
+              
+              {/* Booking Form */}
+              <div className="bg-white rounded-lg p-6 shadow-sm border sticky top-8">
                 <h3 className="text-xl font-bold text-gray-900 mb-6">Book This Venue</h3>
@@ .. @@
                 <div className="space-y-4">
-                  <div>
-                    <label className="block text-sm font-medium text-gray-700 mb-2">
-                      Select Date
-                    </label>
-                    <input
-                      type="date"
-                      value={selectedDate}
-                      onChange={(e) => setSelectedDate(e.target.value)}
-                      min={new Date().toISOString().split('T')[0]}
-                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
-                    />
-                  </div>
+                  {/* Selected Date & Time Display */}
+                  {selectedTimeSlot && (
+                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
+                      <div className="flex items-center justify-between">
+                        <div>
+                          <p className="font-medium text-blue-900">Selected Slot</p>
+                          <p className="text-sm text-blue-700">
+                            {new Date(selectedTimeSlot.date).toLocaleDateString()} 
+                            {' at '} 
+                            {selectedTimeSlot.startTime} - {selectedTimeSlot.endTime}
+                          </p>
+                        </div>
+                        <div className="text-right">
+                          <p className="font-bold text-blue-900">
+                            ${selectedTimeSlot.price || venue.price}
+                          </p>
+                          <p className="text-xs text-blue-700">per slot</p>
+                        </div>
+                      </div>
+                    </div>
+                  )}
 
@@ .. @@
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                       Number of Guests
                     </label>
                     <input
                       type="number"
                       value={guestCount}
                       onChange={(e) => setGuestCount(e.target.value)}
                       placeholder="Enter number of guests"
+                      max={venue.capacity}
                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                     />
+                    <p className="text-xs text-gray-500 mt-1">
+                      Maximum capacity: {venue.capacity} guests
+                    </p>
                   </div>
@@ .. @@
                   {/* Total Price */}
-                  <div className="border-t pt-4">
+                  <div className="border-t pt-4 space-y-2">
                     <div className="flex justify-between items-center">
                       <span className="text-lg font-semibold text-gray-900">Total Amount</span>
-                      <span className="text-2xl font-bold text-blue-600">${venue.price}</span>
+                      <span className="text-2xl font-bold text-blue-600">
+                        ${selectedTimeSlot?.price || venue.price}
+                      </span>
                     </div>
+                    {guestCount && (
+                      <div className="flex justify-between text-sm text-gray-600">
+                        <span>For {guestCount} guests</span>
+                        <span>
+                          ${((selectedTimeSlot?.price || venue.price) / parseInt(guestCount || '1')).toFixed(2)} per guest
+                        </span>
+                      </div>
+                    )}
                   </div>
@@ .. @@
                   <button
                     onClick={handleBooking}
-                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
+                    disabled={!selectedTimeSlot || !guestCount}
+                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
                   >
                     Confirm Booking
                   </button>
                 </div>
               </div>
             </div>
           </div>
         </div>
+        
+        {/* Chat Modal */}
+        {showChat && (
+          <Chat
+            bookingId="temp-booking"
+            recipientName={venue.ownerName}
+            onClose={() => setShowChat(false)}
+          />
+        )}
       </div>
     );
   }