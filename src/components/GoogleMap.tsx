import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { MapPin, Navigation } from 'lucide-react';

interface GoogleMapProps {
  center?: { lat: number; lng: number };
  venues?: Array<{
    id: string;
    name: string;
    location: string;
    coordinates?: { lat: number; lng: number };
    price: number;
  }>;
  onVenueClick?: (venueId: string) => void;
  height?: string;
}

export default function GoogleMap({ 
  center = { lat: 36.7538, lng: 3.0588 }, // Algiers
  venues = [],
  onVenueClick,
  height = '400px'
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initMap = async () => {
      try {
        // For demo purposes, we'll create a mock map interface
        // In production, you'd use the actual Google Maps API
        setIsLoading(false);
        
        // Mock Google Maps initialization
        console.log('Google Maps would be initialized here with API key');
        
        // Create a simple map placeholder
        if (mapRef.current) {
          mapRef.current.innerHTML = `
            <div style="width: 100%; height: 100%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; display: flex; flex-direction: column; justify-content: center; align-items: center; color: white; text-align: center;">
              <div style="background: rgba(255,255,255,0.2); padding: 20px; border-radius: 12px; backdrop-filter: blur(10px);">
                <div style="font-size: 24px; margin-bottom: 8px;">🗺️</div>
                <div style="font-size: 18px; font-weight: bold; margin-bottom: 4px;">Interactive Map</div>
                <div style="font-size: 14px; opacity: 0.9;">Showing ${venues.length} venues in Algiers</div>
                <div style="font-size: 12px; margin-top: 8px; opacity: 0.7;">Google Maps integration ready for production</div>
              </div>
            </div>
          `;
        }
      } catch (err) {
        setError('Failed to load map');
        setIsLoading(false);
      }
    };

    initMap();
  }, [venues.length]);

  if (isLoading) {
    return (
      <div 
        style={{ height }}
        className="flex items-center justify-center bg-gray-100 rounded-lg"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        style={{ height }}
        className="flex items-center justify-center bg-gray-100 rounded-lg border-2 border-dashed border-gray-300"
      >
        <div className="text-center text-gray-500">
          <MapPin className="mx-auto h-8 w-8 mb-2" />
          <p>Map unavailable</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div 
        ref={mapRef}
        style={{ height }}
        className="w-full rounded-lg overflow-hidden shadow-sm border"
      />
      
      {/* Venue List for Map */}
      {venues.length > 0 && (
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <h4 className="font-semibold text-gray-900 mb-3">Nearby Venues</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {venues.map((venue) => (
              <button
                key={venue.id}
                onClick={() => onVenueClick?.(venue.id)}
                className="w-full text-left p-2 rounded hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{venue.name}</p>
                    <p className="text-sm text-gray-500">{venue.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-blue-600">${venue.price}</p>
                    <Navigation size={14} className="text-gray-400 ml-auto" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}