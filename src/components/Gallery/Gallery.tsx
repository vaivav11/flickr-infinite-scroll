// src/components/Gallery.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import PhotoCard from '../PhotoCard/PhotoCard';
import './Gallery.css';

const Gallery: React.FC = () => {
  const [photos, setPhotos] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState<any[]>(() => {
    const savedFavorites = localStorage.getItem('favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  const fetchPhotos = useCallback(async () => {
    setLoading(true);
    const response = await fetch(`https://api.flickr.com/services/rest/?method=flickr.photos.getRecent&api_key=${process.env.REACT_APP_FLICKR_API_KEY}&format=json&nojsoncallback=1&page=${page}`);
    const data = await response.json();
    setPhotos(prevPhotos => [...prevPhotos, ...data.photos.photo]);
    setLoading(false);
  }, [page]);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const observer = useRef<IntersectionObserver>();
  const lastPhotoElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
          setPage(prevPage => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading]
  );

  const handleFavorite = (photo: any) => {
    if (favorites.some(fav => fav.id === photo.id)) {
      setFavorites(favorites.filter(fav => fav.id !== photo.id));
    } else {
      setFavorites([...favorites, photo]);
    }
  };

  return (
    <div className="gallery">
      {photos.map((photo, index) => {
        if (photos.length === index + 1) {
          return (
            <div ref={lastPhotoElementRef} key={photo.id}>
              <PhotoCard photo={photo} onFavorite={handleFavorite} isFavorite={favorites.some(fav => fav.id === photo.id)} />
            </div>
          );
        } else {
          return (
            <PhotoCard key={photo.id} photo={photo} onFavorite={handleFavorite} isFavorite={favorites.some(fav => fav.id === photo.id)} />
          );
        }
      })}
      {loading && <p>Loading...</p>}
    </div>
  );
};

export default Gallery;
