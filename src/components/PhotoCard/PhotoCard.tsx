import React, { useEffect, useRef } from 'react';
import './PhotoCard.css';

interface PhotoCardProps {
  photo: any;
  onFavorite: (photo: any) => void;
  isFavorite: boolean;
}

const PhotoCard: React.FC<PhotoCardProps> = React.memo(({ photo, onFavorite, isFavorite }) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const imageUrl = `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_q.jpg`;
  const imageUrlLarge = `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_b.jpg`;

  useEffect(() => {
    const img = imageRef.current;
    let observer: IntersectionObserver;

    if (img) {
      const onLoad = () => {
        img.classList.add('loaded');
      };

      const onError = () => {
        img.classList.add('error');
      };

      const handleIntersect = (entries: IntersectionObserverEntry[]) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            img.src = imageUrlLarge;
            img.addEventListener('load', onLoad);
            img.addEventListener('error', onError);
            observer.unobserve(img);
          }
        });
      };

      observer = new IntersectionObserver(handleIntersect);
      observer.observe(img);

      return () => {
        img.removeEventListener('load', onLoad);
        img.removeEventListener('error', onError);
        if (observer) observer.unobserve(img);
      };
    }
  }, [imageUrlLarge]);

  return (
    <div className="photo-card">
      <div className="photo-overlay">
        <h3>{photo.title}</h3>
        <button onClick={() => onFavorite(photo)}>{isFavorite ? 'Unfavorite' : 'Favorite'}</button>
      </div>
      <img ref={imageRef} src={imageUrl} alt={photo.title} className="lazy-load" />
    </div>
  );
});

export default PhotoCard;
