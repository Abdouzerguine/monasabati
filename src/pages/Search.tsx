@@ .. @@
 import React, { useState, useMemo } from 'react';
-import { Search as SearchIcon, MapPin, Star, Filter } from 'lucide-react';
+import { Search as SearchIcon, MapPin, Star, Filter, Map, List } from 'lucide-react';
 import { useVenues } from '../contexts/VenueContext';
 import { useNavigate } from 'react-router-dom';
+import { useTranslation } from 'react-i18next';
+import GoogleMap from '../components/GoogleMap';
 
 export default function Search() {
+  const { t } = useTranslation();
   const { venues } = useVenues();
   const navigate = useNavigate();
   const [searchQuery, setSearchQuery] = useState('');
   const [selectedCategory, setSelectedCategory] = useState('All');
+  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
   const [filters, setFilters] = useState({
     priceRange: { min: 0, max: 10000 },
     capacity: { min: 0, max: 1000 },
+    rating: 0,
+    amenities: [] as string[],
   });
   const [showFilters, setShowFilters] = useState(false);
 
-  const categories = ['All', 'Event Hall', 'Rooftop', 'Conference'];
+  const categories = ['All', 'Event Hall', 'Rooftop', 'Conference', 'Restaurant', 'Garden'];
+  const allAmenities = ['WiFi', 'Parking', 'Sound System', 'Air Conditioning', 'Catering Kitchen', 'Projectors', 'Dance Floor', 'Bar Setup', 'Outdoor Seating', 'Security'];
 
   const filteredVenues = useMemo(() => {
     return venues.filter(venue => {
@@ -1,6 +1,10 @@
       const matchesCategory = selectedCategory === 'All' || venue.category === selectedCategory;
       const withinPriceRange = venue.price >= filters.priceRange.min && venue.price <= filters.priceRange.max;
       const withinCapacity = venue.capacity >= filters.capacity.min && venue.capacity <= filters.capacity.max;
+      const meetsRating = venue.rating >= filters.rating;
+      const hasAmenities = filters.amenities.length === 0 || 
+        filters.amenities.every(amenity => venue.amenities.includes(amenity));
       
-      return matchesSearch && matchesCategory && withinPriceRange && withinCapacity;
+      return matchesSearch && matchesCategory && withinPriceRange && withinCapacity && meetsRating && hasAmenities;
     });
-  }, [venues, searchQuery, selectedCategory, filters]);
+  }, [venues, searchQuery, selectedCategory, filters]);
+
+  const handleAmenityToggle = (amenity: string) => {
+    setFilters(prev => ({
+      ...prev,
+      amenities: prev.amenities.includes(amenity)
+        ? prev.amenities.filter(a => a !== amenity)
+        : [...prev.amenities, amenity]
+    }));
+  };
 
   return (
@@ .. @@
       {/* Header */}
-      <div className="bg-white shadow-sm border-b">
+      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
-          <h1 className="text-3xl font-bold text-gray-900 mb-6">Find Venues</h1>
+          <div className="flex items-center justify-between mb-6">
+            <h1 className="text-3xl font-bold text-gray-900">{t('search')}</h1>
+            
+            {/* View Mode Toggle */}
+            <div className="flex bg-gray-100 rounded-lg p-1">
+              <button
+                onClick={() => setViewMode('list')}
+                className={`flex items-center space-x-2 px-3 py-2 rounded text-sm font-medium transition-colors ${
+                  viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
+                }`}
+              >
+                <List size={16} />
+                <span>List</span>
+              </button>
+              <button
+                onClick={() => setViewMode('map')}
+                className={`flex items-center space-x-2 px-3 py-2 rounded text-sm font-medium transition-colors ${
+                  viewMode === 'map' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
+                }`}
+              >
+                <Map size={16} />
+                <span>Map</span>
+              </button>
+            </div>
+          </div>
           
           {/* Search Bar */}
@@ .. @@
           {/* Categories */}
           <div className="flex space-x-2 overflow-x-auto pb-2">
@@ .. @@
         </div>
       </div>

       {/* Filters Modal */}
       {showFilters && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
-          <div className="bg-white rounded-lg p-6 w-full max-w-md">
+          <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
             <div className="flex items-center justify-between mb-4">
-              <h3 className="text-lg font-bold text-gray-900">Filters</h3>
+              <h3 className="text-lg font-bold text-gray-900">Advanced Filters</h3>
               <button
                 onClick={() => setShowFilters(false)}
                 className="text-gray-400 hover:text-gray-600"
               >
                 ×
               </button>
             </div>

-            <div className="space-y-4">
+            <div className="space-y-6">
               {/* Price Range */}
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">
                   Price Range
                 </label>
                 <div className="flex space-x-2">
                   <input
                     type="number"
                     placeholder="Min"
                     value={filters.priceRange.min}
                     onChange={(e) => setFilters({
                       ...filters,
                       priceRange: { ...filters.priceRange, min: parseInt(e.target.value) || 0 }
                     })}
                     className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                   />
                   <input
                     type="number"
                     placeholder="Max"
                     value={filters.priceRange.max}
                     onChange={(e) => setFilters({
                       ...filters,
                       priceRange: { ...filters.priceRange, max: parseInt(e.target.value) || 10000 }
                     })}
                     className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                   />
                 </div>
               </div>

               {/* Capacity Range */}
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">
                   Capacity
                 </label>
                 <div className="flex space-x-2">
                   <input
                     type="number"
                     placeholder="Min guests"
                     value={filters.capacity.min}
                     onChange={(e) => setFilters({
                       ...filters,
                       capacity: { ...filters.capacity, min: parseInt(e.target.value) || 0 }
                     })}
                     className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                   />
                   <input
                     type="number"
                     placeholder="Max guests"
                     value={filters.capacity.max}
                     onChange={(e) => setFilters({
                       ...filters,
                       capacity: { ...filters.capacity, max: parseInt(e.target.value) || 1000 }
                     })}
                     className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                   />
                 </div>
               </div>
+              
+              {/* Minimum Rating */}
+              <div>
+                <label className="block text-sm font-medium text-gray-700 mb-2">
+                  Minimum Rating
+                </label>
+                <div className="flex space-x-2">
+                  {[1, 2, 3, 4, 5].map(rating => (
+                    <button
+                      key={rating}
+                      onClick={() => setFilters({ ...filters, rating })}
+                      className={`flex items-center space-x-1 px-3 py-2 rounded-lg border transition-colors ${
+                        filters.rating === rating
+                          ? 'bg-yellow-100 border-yellow-300 text-yellow-800'
+                          : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
+                      }`}
+                    >
+                      <Star size={16} className={filters.rating === rating ? 'fill-current' : ''} />
+                      <span>{rating}+</span>
+                    </button>
+                  ))}
+                </div>
+              </div>
+              
+              {/* Amenities */}
+              <div>
+                <label className="block text-sm font-medium text-gray-700 mb-2">
+                  Required Amenities
+                </label>
+                <div className="grid grid-cols-2 gap-2">
+                  {allAmenities.map(amenity => (
+                    <button
+                      key={amenity}
+                      onClick={() => handleAmenityToggle(amenity)}
+                      className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
+                        filters.amenities.includes(amenity)
+                          ? 'bg-blue-100 border-blue-300 text-blue-800'
+                          : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
+                      }`}
+                    >
+                      {amenity}
+                    </button>
+                  ))}
+                </div>
+              </div>

               <div className="flex space-x-3 pt-4">
                 <button
                   onClick={() => {
                     setFilters({
                       priceRange: { min: 0, max: 10000 },
                       capacity: { min: 0, max: 1000 },
+                      rating: 0,
+                      amenities: [],
                     });
                     setShowFilters(false);
                   }}
                   className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                 >
                   Reset
                 </button>
                 <button
                   onClick={() => setShowFilters(false)}
                   className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                 >
                   Apply Filters
                 </button>
               </div>
             </div>
           </div>
         </div>
       )}

       {/* Results */}
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
         <div className="flex items-center justify-between mb-6">
           <p className="text-gray-600">
             {filteredVenues.length} venues found
+            {filters.amenities.length > 0 && (
+              <span className="ml-2 text-sm">
+                with {filters.amenities.join(', ')}
+              </span>
+            )}
           </p>
+          
+          {/* Active Filters */}
+          {(filters.rating > 0 || filters.amenities.length > 0) && (
+            <div className="flex items-center space-x-2">
+              <span className="text-sm text-gray-500">Active filters:</span>
+              {filters.rating > 0 && (
+                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
+                  {filters.rating}+ stars
+                </span>
+              )}
+              {filters.amenities.map(amenity => (
+                <span key={amenity} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
+                  {amenity}
+                </span>
+              ))}
+            </div>
+          )}
         </div>

-        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
+        {viewMode === 'map' ? (
+          <GoogleMap
+            venues={filteredVenues.map(venue => ({
+              id: venue.id,
+              name: venue.name,
+              location: venue.location,
+              coordinates: venue.coordinates,
+              price: venue.price,
+            }))}
+            onVenueClick={(venueId) => navigate(`/venue/${venueId}`)}
+            height="600px"
+          />
+        ) : (
+          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
-          {filteredVenues.map((venue) => (
+            {filteredVenues.map((venue) => (
-            <div
+              <div
-              key={venue.id}
+                key={venue.id}
-              onClick={() => navigate(`/venue/${venue.id}`)}
+                onClick={() => navigate(`/venue/${venue.id}`)}
-              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
+                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border"
-            >
+              >
-              <img
+                <img
-                src={venue.images[0]}
+                  src={venue.images[0]}
-                alt={venue.name}
+                  alt={venue.name}
-                className="w-full h-48 object-cover rounded-t-lg"
+                  className="w-full h-48 object-cover rounded-t-lg"
-              />
+                />
-              <div className="p-6">
+                <div className="p-6">
-                <div className="flex items-start justify-between mb-2">
+                  <div className="flex items-start justify-between mb-2">
-                  <h3 className="text-lg font-semibold text-gray-900">{venue.name}</h3>
+                    <h3 className="text-lg font-semibold text-gray-900">{venue.name}</h3>
-                  <div className="flex items-center">
+                    <div className="flex items-center">
-                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
+                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
-                    <span className="ml-1 text-sm text-gray-600">{venue.rating}</span>
+                      <span className="ml-1 text-sm text-gray-600">{venue.rating}</span>
-                  </div>
+                    </div>
-                </div>
+                  </div>
-                
+                  
-                <div className="flex items-center text-gray-600 mb-2">
+                  <div className="flex items-center text-gray-600 mb-2">
-                  <MapPin size={16} className="mr-1" />
+                    <MapPin size={16} className="mr-1" />
-                  <span className="text-sm">{venue.location}</span>
+                    <span className="text-sm">{venue.location}</span>
-                </div>
+                  </div>
-                
+                  
-                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
+                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
-                  {venue.description}
+                    {venue.description}
-                </p>
+                  </p>
-                
+                  
-                <div className="flex items-center justify-between">
+                  {/* Amenities Preview */}
+                  <div className="flex flex-wrap gap-1 mb-4">
+                    {venue.amenities.slice(0, 3).map(amenity => (
+                      <span key={amenity} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
+                        {amenity}
+                      </span>
+                    ))}
+                    {venue.amenities.length > 3 && (
+                      <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded">
+                        +{venue.amenities.length - 3} more
+                      </span>
+                    )}
+                  </div>
+                  
+                  <div className="flex items-center justify-between">
-                  <span className="text-lg font-bold text-blue-600">${venue.price}/{venue.priceUnit}</span>
+                    <span className="text-lg font-bold text-blue-600">${venue.price}/{venue.priceUnit}</span>
-                  <span className="text-sm text-gray-500">{venue.capacity} guests</span>
+                    <span className="text-sm text-gray-500">{venue.capacity} guests</span>
-                </div>
+                  </div>
-              </div>
+                </div>
-            </div>
+              </div>
-          ))}
+            ))}
+          </div>
+        )}
       </div>
     </div>
   );