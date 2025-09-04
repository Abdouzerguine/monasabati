import React, { useState } from 'react';
import { Heart, Share2, MessageCircle, Users, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SocialFeaturesProps {
  venueId: string;
  venueName: string;
  initialFavorites?: number;
  initialShares?: number;
}

export default function SocialFeatures({ 
  venueId, 
  venueName, 
  initialFavorites = 0, 
  initialShares = 0 
}: SocialFeaturesProps) {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [favorites, setFavorites] = useState(initialFavorites);
  const [shares, setShares] = useState(initialShares);
  const [showShareModal, setShowShareModal] = useState(false);

  const handleFavorite = () => {
    if (!user) {
      alert('Please login to add favorites');
      return;
    }
    
    setIsFavorite(!isFavorite);
    setFavorites(prev => isFavorite ? prev - 1 : prev + 1);
    
    // In a real app, save to backend
    console.log(`${isFavorite ? 'Removed from' : 'Added to'} favorites:`, venueId);
  };

  const handleShare = async () => {
    const shareData = {
      title: venueName,
      text: `Check out this amazing venue: ${venueName}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        setShares(prev => prev + 1);
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      setShowShareModal(true);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Link copied to clipboard!');
      setShares(prev => prev + 1);
      setShowShareModal(false);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareToSocial = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Check out this amazing venue: ${venueName}`);
    
    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    };
    
    window.open(urls[platform as keyof typeof urls], '_blank', 'width=600,height=400');
    setShares(prev => prev + 1);
    setShowShareModal(false);
  };

  return (
    <>
      <div className="flex items-center space-x-4 py-4 border-t border-gray-200">
        {/* Favorite Button */}
        <button
          onClick={handleFavorite}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            isFavorite
              ? 'bg-red-50 text-red-600 hover:bg-red-100'
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Heart 
            size={18} 
            className={isFavorite ? 'fill-current' : ''} 
          />
          <span className="text-sm font-medium">{favorites}</span>
        </button>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Share2 size={18} />
          <span className="text-sm font-medium">{shares}</span>
        </button>

        {/* Social Proof */}
        <div className="flex items-center space-x-4 ml-auto text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Users size={14} />
            <span>{favorites + 23} people interested</span>
          </div>
          <div className="flex items-center space-x-1">
            <MessageCircle size={14} />
            <span>12 discussions</span>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Share Venue</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="space-y-3">
              {/* Copy Link */}
              <button
                onClick={() => copyToClipboard(window.location.href)}
                className="w-full p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="font-medium text-gray-900">Copy Link</div>
                <div className="text-sm text-gray-500">Share via link</div>
              </button>

              {/* Social Platforms */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => shareToSocial('facebook')}
                  className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center"
                >
                  Facebook
                </button>
                <button
                  onClick={() => shareToSocial('twitter')}
                  className="p-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors text-center"
                >
                  Twitter
                </button>
                <button
                  onClick={() => shareToSocial('whatsapp')}
                  className="p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-center"
                >
                  WhatsApp
                </button>
                <button
                  onClick={() => shareToSocial('linkedin')}
                  className="p-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors text-center"
                >
                  LinkedIn
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}