import React from 'react';
import ImageCard from './ImageCard.jsx';
import styles from './recentGrid.module.css';

export default function RecentGrid({ images, loading, onDownload }) {

  if (loading) {
    return (
     
    <div className={styles.grid}>     {[...Array(12)].map((_, i) => (
          <div key={i} className={styles.skeleton}></div>
        ))}
      </div>
    );
  }

  if (!images || images.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No images available at the moment</p>
        <span>Check back later for new AI-generated images</span>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {images.map((image) => (
        <ImageCard
          key={image.id}
          image={image}
          onDownload={onDownload}
        />
      ))}
    </div>
  );
}