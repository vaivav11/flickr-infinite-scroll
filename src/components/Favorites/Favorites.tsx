import React, { useState } from 'react';
import PhotoCard from '../PhotoCard/PhotoCard';
import './Favorites.css';

const Favorites: React.FC = () => {
  const [favorites, setFavorites] = useState<any[]>(() => {
    const savedFavorites = localStorage.getItem('favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  const handleFavorite = (photo: any) => {
    const updatedFavorites = favorites.filter(fav => fav.id !== photo.id);
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  return (
    <div className="favorites">
      {favorites.length === 0 ? (
        <p>No favorite photos yet.</p>
      ) : (
        favorites.map(photo => (
          <PhotoCard key={photo.id} photo={photo} onFavorite={handleFavorite} isFavorite />
        ))
      )}
    </div>
  );
};

export default Favorites;

