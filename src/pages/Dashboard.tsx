@@ .. @@
 import React from 'react';
-import { TrendingUp, Calendar, MapPin, Plus } from 'lucide-react';
+import { TrendingUp, Calendar, MapPin, Plus, MessageCircle, Bell } from 'lucide-react';
 import { useAuth } from '../contexts/AuthContext';
 import { useVenues } from '../contexts/VenueContext';
-import { mockBookings } from '../data/mockData';
+import { mockBookings, mockAnalytics } from '../data/mockData';
+import AnalyticsDashboard from '../components/AnalyticsDashboard';
+import EmailNotifications from '../components/EmailNotifications';
 import { useNavigate } from 'react-router-dom';
 
@@ .. @@
   const navigate = useNavigate();
   const ownerVenues = getVenuesByOwner(user?.id || 'owner1');
   const ownerBookings = mockBookings.filter(booking => 
     ownerVenues.some(venue => venue.id === booking.venueId)
   );
 
+  const handleSendNotification = (type: string, data: any) => {
+    console.log('Sending notification:', type, data);
+    // In a real app, this would trigger email/SMS notifications
+  };
+
   return (
     <div className="min-h-screen bg-gray-50">
@@ .. @@
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
-        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
+        {/* Quick Actions */}
+        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
+          <button
+            onClick={() => navigate('/add-venue')}
+            className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow text-left"
+          >
+            <div className="flex items-center space-x-3">
+              <div className="p-3 bg-blue-100 rounded-lg">
+                <Plus className="h-6 w-6 text-blue-600" />
+              </div>
+              <div>
+                <h3 className="font-semibold text-gray-900">Add New Venue</h3>
+                <p className="text-sm text-gray-600">Expand your business</p>
+              </div>
+            </div>
+          </button>
+          
+          <button className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow text-left">
+            <div className="flex items-center space-x-3">
+              <div className="p-3 bg-green-100 rounded-lg">
+                <MessageCircle className="h-6 w-6 text-green-600" />
+              </div>
+              <div>
+                <h3 className="font-semibold text-gray-900">Messages</h3>
+                <p className="text-sm text-gray-600">3 unread messages</p>
+              </div>
+            </div>
+          </button>
+          
+          <button className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow text-left">
+            <div className="flex items-center space-x-3">
+              <div className="p-3 bg-yellow-100 rounded-lg">
+                <Bell className="h-6 w-6 text-yellow-600" />
+              </div>
+              <div>
+                <h3 className="font-semibold text-gray-900">Notifications</h3>
+                <p className="text-sm text-gray-600">5 new notifications</p>
+              </div>
+            </div>
+          </button>
+        </div>
+        
+        {/* Analytics Dashboard */}
+        <div className="mb-8">
+          <h2 className="text-2xl font-bold text-gray-900 mb-6">Analytics Overview</h2>
+          <AnalyticsDashboard analytics={mockAnalytics} />
+        </div>
+        
+        {/* Stats Grid */}
+        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
           <div className="bg-white p-6 rounded-lg shadow-sm">
@@ .. @@
         </div>
 
-        {/* Recent Bookings */}
-        <div className="bg-white rounded-lg shadow-sm">
+        {/* Two Column Layout */}
+        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
+          {/* Recent Bookings */}
+          <div className="bg-white rounded-lg shadow-sm border">
-          <div className="p-6 border-b">
+            <div className="p-6 border-b">
-            <h2 className="text-xl font-bold text-gray-900">Recent Bookings</h2>
+              <h2 className="text-xl font-bold text-gray-900">Recent Bookings</h2>
-          </div>
+            </div>
-          <div className="divide-y">
+            <div className="divide-y max-h-96 overflow-y-auto">
-            {ownerBookings.slice(0, 5).map((booking) => (
+              {ownerBookings.slice(0, 5).map((booking) => (
-              <div key={booking.id} className="p-6 hover:bg-gray-50">
+                <div key={booking.id} className="p-6 hover:bg-gray-50 transition-colors">
-                <div className="flex items-center justify-between">
+                  <div className="flex items-center justify-between">
-                  <div className="flex items-center space-x-4">
+                    <div className="flex items-center space-x-4">
-                    <img
+                      <img
-                      src={booking.venueImage}
+                        src={booking.venueImage}
-                      alt={booking.venueName}
+                        alt={booking.venueName}
-                      className="w-12 h-12 rounded-lg object-cover"
+                        className="w-12 h-12 rounded-lg object-cover"
-                    />
+                      />
-                    <div>
+                      <div>
-                      <h3 className="font-semibold text-gray-900">{booking.venueName}</h3>
+                        <h3 className="font-semibold text-gray-900">{booking.venueName}</h3>
-                      <p className="text-sm text-gray-600">by {booking.userName}</p>
+                        <p className="text-sm text-gray-600">by {booking.userName}</p>
-                      <p className="text-sm text-gray-500">{booking.startDate}</p>
+                        <p className="text-sm text-gray-500">
+                          {booking.startDate} at {booking.startTime}
+                        </p>
-                    </div>
+                      </div>
-                  </div>
+                    </div>
-                  <div className="text-right">
+                    <div className="text-right">
-                    <p className="font-semibold text-gray-900">${booking.totalPrice}</p>
+                      <p className="font-semibold text-gray-900">${booking.totalPrice}</p>
-                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
+                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
-                      booking.status === 'confirmed' 
+                        booking.status === 'confirmed' 
-                        ? 'bg-green-100 text-green-800' 
+                          ? 'bg-green-100 text-green-800' 
-                        : 'bg-yellow-100 text-yellow-800'
+                          : 'bg-yellow-100 text-yellow-800'
-                    }`}>
+                      }`}>
-                      {booking.status}
+                        {booking.status}
-                    </span>
+                      </span>
-                  </div>
+                    </div>
-                </div>
+                  </div>
-              </div>
+                </div>
-            ))}
+              ))}
+            </div>
+          </div>
+          
+          {/* Notifications */}
+          <EmailNotifications onSendNotification={handleSendNotification} />
+        </div>
       </div>
     </div>
   );