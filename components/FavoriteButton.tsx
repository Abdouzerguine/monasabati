import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Heart } from 'lucide-react-native';

interface FavoriteButtonProps {
  venueId: string;
  isFavorite?: boolean;
  onToggle?: (venueId: string, isFavorite: boolean) => void;
  size?: number;
}

export default function FavoriteButton({ 
  venueId, 
  isFavorite = false, 
  onToggle,
  size = 24 
}: FavoriteButtonProps) {
  const [favorite, setFavorite] = useState(isFavorite);

  const handleToggle = () => {
    const newFavoriteState = !favorite;
    setFavorite(newFavoriteState);
    
    if (onToggle) {
      onToggle(venueId, newFavoriteState);
    }
  };

  return (
    <TouchableOpacity 
      style={styles.button} 
      onPress={handleToggle}
      activeOpacity={0.7}
    >
      <Heart
        size={size}
        color={favorite ? '#EF4444' : '#9CA3AF'}
        fill={favorite ? '#EF4444' : 'transparent'}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
  },
});
