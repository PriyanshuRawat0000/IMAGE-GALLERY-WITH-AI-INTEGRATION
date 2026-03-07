import React, { useState } from 'react';
import { Download, TrendingUp } from 'lucide-react';
import styles from './ImageCard.module.css';

export default function ImageCard({ image, onDownload, isLibrary = false }) {

  const [downloaded, setDownloaded] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = () => {

    if (isLibrary || downloading) return;

    setDownloading(true);

    if (onDownload) {
      onDownload(image);
    }

    setTimeout(() => {
      setDownloaded(true);
      setDownloading(false);
    }, 800);
  };

  const getTimeAgo = (createdAt) => {
    const hours = Math.floor((Date.now() - new Date(createdAt)) / (1000 * 60 * 60));

    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;

    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className={styles.card}>

      <div className={styles.imageWrapper}>

        <img
          src={image.imageUrl}
          alt={image.title}
          className={styles.image}
        />

        <div className={styles.overlay}>
          {!isLibrary && (
            <button
              className={`${styles.downloadBtn} ${downloaded ? styles.downloaded : ""}`}
              onClick={handleDownload}
              disabled={downloading || downloaded}
            >
              <Download size={18}/>
              {downloading ? "Downloading..." : downloaded ? "Downloaded" : "Download"}
            </button>
          )}
        </div>

        <span className={`${styles.badge} ${image.type === "Paid" ? styles.paidBadge : styles.freeBadge}`}>
          {image.type}
        </span>

      </div>

      <div className={styles.content}>

        <h3 className={styles.title}>{image.title}</h3>

        <div className={styles.meta}>
          <span className={styles.category}>{image.category}</span>
          <span className={styles.date}>{getTimeAgo(image.createdAt)}</span>
        </div>

        <div className={styles.footer}>
          <div className={styles.stats}>
            <TrendingUp size={14}/>
            <span>{image.downloads} downloads</span>
          </div>

          {image.type === "Paid" && (
            <span className={styles.price}>${image.price}</span>
          )}
        </div>

      </div>

    </div>
  );
}
