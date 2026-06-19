import React, { useState } from 'react';
import { Check, Copy, Download, TrendingUp } from 'lucide-react';
import styles from './imageCard.module.css';

export default function ImageCard({ image, onDownload, isLibrary = false }) {

  const [downloaded, setDownloaded] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  const promptText = image.prompt?.trim() || '';
  const promptPreviewLimit = 120;
  const promptPreview =
    promptText.length > promptPreviewLimit
      ? `${promptText.slice(0, promptPreviewLimit)}....`
      : promptText;

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

  const handleCopyPrompt = async () => {
    if (!promptText) return;

    try {
      await navigator.clipboard.writeText(promptText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error('Failed to copy prompt:', error);
    }
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

        {promptText && (
          <div className={styles.promptSection}>
            <div className={styles.promptHeader}>
              <span className={styles.promptLabel}>Prompt</span>

              <button
                type="button"
                className={styles.copyBtn}
                onClick={handleCopyPrompt}
                aria-label="Copy prompt to clipboard"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <p className={styles.promptText} title={promptText}>
              {promptPreview}
            </p>
          </div>
        )}

      </div>

    </div>
  );
}
