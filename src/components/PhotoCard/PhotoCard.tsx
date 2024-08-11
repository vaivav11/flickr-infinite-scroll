import React, { useState, useEffect, useRef } from 'react';
import './PhotoCard.css';

interface PhotoCardProps {
  photo: any;
  onFavorite: (photo: any) => void;
  isFavorite: boolean;
}

const getUserInfo = async (ownerId: string): Promise<string | null> => {
  try {
    const apiKey = process.env.REACT_APP_FLICKR_API_KEY; 
    const response = await fetch(
      `https://api.flickr.com/services/rest/?method=flickr.people.getInfo&api_key=${apiKey}&user_id=${ownerId}&format=json&nojsoncallback=1`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch user info');
    }

    const data = await response.json();

    return data?.person?.username?._content || null;
  } catch (error) {
    console.error('Error fetching user info:', error);
    return null;
  }
};

const PhotoCard: React.FC<PhotoCardProps> = React.memo(({ photo, onFavorite, isFavorite }) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const imageUrl = `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_q.jpg`;
  const imageUrlLarge = `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_b.jpg`;

  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsername = async () => {
      const name = await getUserInfo(photo.owner);
      setUsername(name);
    };

    fetchUsername();
  }, [photo.owner]);

  useEffect(() => {
    const img = imageRef.current;
    let observer: IntersectionObserver | null = null;

    if (img) {
      const onLoad = () => {
        img?.classList.add('loaded');
      };

      const onError = () => {
        img?.classList.add('error');
      };

      const handleIntersect = (entries: IntersectionObserverEntry[]) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            img.src = imageUrlLarge;
            img.addEventListener('load', onLoad);
            img.addEventListener('error', onError);
            if (observer) observer.unobserve(img);
          }
        });
      };

      observer = new IntersectionObserver(handleIntersect, {
        rootMargin: '100px',
      });
      observer.observe(img);

      return () => {
        img?.removeEventListener('load', onLoad);
        img?.removeEventListener('error', onError);
        if (observer) observer.unobserve(img);
      };
    }
  }, [imageUrlLarge]);

  const truncateTitle = (title: string, maxLength: number) => {
    if (title.length > maxLength) {
      return `${title.substring(0, maxLength)}...`;
    }
    return title;
  };

  const truncatedTitle = truncateTitle(photo.title, 30); 

  return (
    <div className="photo-card">
      <div className="photo-overlay">
        <h3>{truncatedTitle}</h3>
        <hr className="separator-line" />
        <p className="photo-author">{username || 'Loading user info...'}</p>
        <button onClick={() => onFavorite(photo)}>
          {isFavorite ? 'Unfavorite' : 'Favorite'}
        </button>
      </div>
      <img ref={imageRef} src={imageUrl} alt={photo.title} className="lazy-load" />
    </div>
  );
});

export default PhotoCard;
