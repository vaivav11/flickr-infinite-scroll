import React from 'react';
import PhotoCard from '../PhotoCard/PhotoCard';

interface FavoritesProps {
  searchQuery: string;
}

const Favorites: React.FC<FavoritesProps> = ({ searchQuery }) => {
  const [favorites, setFavorites] = React.useState<any[]>(() => {
    const savedFavorites = localStorage.getItem('favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  const handleFavorite = (photo: any) => {
    const isFavorite = favorites.some(fav => fav.id === photo.id);
    if (isFavorite) {
      const updatedFavorites = favorites.filter(fav => fav.id !== photo.id);
      setFavorites(updatedFavorites);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    }
  };

  const filteredFavorites = favorites.filter(photo =>
    photo.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="favorites">
      {filteredFavorites.length === 0 && <p>No favorite photos found.</p>}
      {filteredFavorites.map(photo => (
        <PhotoCard
          key={photo.id}
          photo={photo}
          onFavorite={handleFavorite}
          isFavorite={true}
        />
      ))}
    </div>
  );
};

export default Favorites;
