import React, { useState } from 'react';
import { SendIcon as Send } from 'lucide-react';
import API from '../api/axios.js';
import styles from './prompt.module.css'
export default function Prompt() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState("");
  const [generated, setGenerated] = useState(false);
  const [collapsed, setCollapsed] = useState(true);
  const [loading, setLoading] =useState(false);
  async function handleSend() {
    if (!prompt.trim()) return;

    try {
      setLoading(true);
      const res = await API.post('api/images/promptToImage', {
        Prompt: prompt
      });
      console.log(res.data);
      setImage(res.data.generatedImage.url);
      setGenerated(true);
    } catch (err) {
      console.log(err);
    }
    finally{
      setLoading(false);
    }
  }

  function handleReset() {
    setPrompt("");
    setImage("");
    setGenerated(false);
    setCollapsed(false);
  }

  return (
    <div className={styles.promptComponent}>

  {generated && (
    <div className={styles.imageBox}>
      <div className={styles.imageCard}>
        <img src={image} alt="Generated" className={styles.generatedImage} />
      </div>

      <button onClick={handleReset} className={styles.resetBtn}>
        Reset
      </button>
    </div>
  )}

      <div
        className={`${styles.promptBox} ${collapsed ? styles.collapsed : styles.expanded}`}
        onClick={() => setCollapsed(false)}
      >
        {!collapsed && (
          <textarea
            className={styles.promptInput}
            placeholder="Describe your image..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        )}
        <div className={styles.sendPrompt}>
          {!collapsed && (
            <div
              className={`${styles.sendIcon} ${loading ? styles.loading : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                handleSend();
              }}
            >
              {!loading && <Send />}
            </div>
          )}
        </div>
  </div>

</div>
  );
}