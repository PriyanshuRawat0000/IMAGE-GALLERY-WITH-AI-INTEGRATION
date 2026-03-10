import React, { useState, useEffect } from "react";
import Tabs from "./tabs";
import RecentGrid from "./recentGrid";
import styles from "./dashboard.module.css";
import axios from "axios";
import mockImages from "./mockImages.js";
export default function Dashboard() {

  const [activeTab, setActiveTab] = useState("recent");
  const [recentImages, setRecentImages] = useState([]);
  const [olderImages, setOlderImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleDownload = (image) => {
    const link = document.createElement("a");
    link.href = image.imageUrl;
    link.download = image.title || "ai-image";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


//   useEffect(() => {

//   const images = mockImages;

//   const now = new Date();
//   const recent = [];
//   const older = [];

//   images.forEach((img) => {

//     const created = new Date(img.createdAt);
//     const diff = (now - created) / (1000 * 60 * 60);

//     if (diff <= 24) recent.push(img);
//     else older.push(img);

//   });

//   setRecentImages(recent);
//   setOlderImages(older);
//   setLoading(false);

// }, []);
  useEffect(() => {
    fetchImages();
  }, []);
const fetchImages = async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/images");
    
    console.log(res.data);
    const images = res.data; // backend returns array directly

    const now = new Date();
    const recent = [];
    const older = [];

    images.forEach((img) => {

      const created = new Date(img.createdAt);
      const diff = (now - created) / (1000 * 60 * 60);

      const formatted = {
        id: img._id,
        imageUrl: img.url,
        title: img.title || "AI Image",
        type: img.type === "paid" ? "Paid" : "Free",
        price: img.price,
        downloads: img.downloadCount,
        category: "AI",
        createdAt: img.createdAt
      };

      if (diff <= 24) recent.push(formatted);
      else older.push(formatted);
    });

    setRecentImages(recent);
    setOlderImages(older);
    setLoading(false);

  } catch (err) {
    console.log("hello kam ni hora");
    console.error(err);
  }
};
  // const fetchImages = async () => {
  //   try {
  //     const res = await axios.get("http://localhost:5000/api/images");

  //     const images = res.data;

  //     const now = new Date();
  //     const recent = [];
  //     const older = [];

  //     images.forEach((img) => {
  //       const created = new Date(img.createdAt);
  //       const diff = (now - created) / (1000 * 60 * 60);

  //       const formatted = {
  //         id: img._id,
  //         imageUrl: img.url,
  //         title: img.title || "AI Image",
  //         type: img.type === "paid" ? "Paid" : "Free",
  //         price: img.price,
  //         downloads: img.downloadCount,
  //         category: "AI",
  //         createdAt: img.createdAt
  //       };

  //       if (diff <= 24) recent.push(formatted);
  //       else older.push(formatted);
  //     });

  //     setRecentImages(recent);
  //     setOlderImages(older);
  //     setLoading(false);

  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  const tabs = [
    { id: "recent", label: "Recent" },
    { id: "older", label: "Older" }
  ];

  return (
    <div className={styles.dashboard}>

      <div className={styles.header}>
        <div className={styles.logo}>AI <span>Gallery</span></div>

        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <div className={styles.profile}></div>
      </div>

      <div className={styles.content}>
        {activeTab === "recent" ? (
          <RecentGrid
            images={recentImages}
            loading={loading}
            onDownload={handleDownload}
          />
        ) : (
          <RecentGrid
            images={olderImages}
            loading={loading}
            onDownload={handleDownload}
          />
        )}
      </div>

    </div>
  );
}