import React, { useState, useEffect, useCallback, useRef } from 'react';
import PhotoCard from '../PhotoCard/PhotoCard';

interface GalleryProps {
  searchQuery: string;
}

const Gallery: React.FC<GalleryProps> = React.memo(({ searchQuery }) => {
  const [photos, setPhotos] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [favorites, setFavorites] = useState<any[]>(() => {
    const savedFavorites = localStorage.getItem('favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  const fetchPhotos = useCallback(async () => {
    setLoading(true);
    try {
      const baseUrl = 'https://api.flickr.com/services/rest/';
      const searchMethod = searchQuery
        ? 'flickr.photos.search'
        : 'flickr.photos.getRecent';

      const url = `${baseUrl}?method=${searchMethod}&api_key=${process.env.REACT_APP_FLICKR_API_KEY}&format=json&nojsoncallback=1&page=${page}&text=${encodeURIComponent(searchQuery)}`;

      const response = await fetch(url);
      const data = await response.json();

      setPhotos(prevPhotos => {
        const existingIds = new Set(prevPhotos.map(photo => photo.id));
        const newPhotos = data.photos.photo.filter((photo: any) => !existingIds.has(photo.id));

        if (newPhotos.length === 0) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }

        return [...prevPhotos, ...newPhotos];
      });
    } catch (error) {
      setHasMore(false); 
    }
    setLoading(false);
  }, [page, searchQuery]);

  useEffect(() => {
    setPage(1);
    setPhotos([]);
    setHasMore(true);
  }, [searchQuery]);

  useEffect(() => {
    if (hasMore && !loading) {
      fetchPhotos();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchPhotos, hasMore]);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const observer = useRef<IntersectionObserver>();
  const lastPhotoElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          setPage(prevPage => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
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
              <PhotoCard
                photo={photo}
                onFavorite={handleFavorite}
                isFavorite={favorites.some(fav => fav.id === photo.id)}
              />
            </div>
          );
        } else {
          return (
            <PhotoCard
              key={photo.id}
              photo={photo}
              onFavorite={handleFavorite}
              isFavorite={favorites.some(fav => fav.id === photo.id)}
            />
          );
        }
      })}
      {loading && <p>Loading...</p>}
      {!hasMore && photos.length > 0 && <p>No more photos to load.</p>}
      {!loading && photos.length === 0 && <p>No photos found.</p>}
    </div>
  );
});

export default Gallery;
