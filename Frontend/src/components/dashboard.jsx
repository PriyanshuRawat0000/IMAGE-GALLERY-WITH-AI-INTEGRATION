import React, { useState, useEffect } from "react";
import Tabs from "./tabs";
import RecentGrid from "./recentGrid";
import styles from "./dashboard.module.css";
import axios from "axios";
import API from "../api/axios.js"
import mockImages from "./mockImages.js";
import {useNavigate} from 'react-router-dom';
import {User as UserIcon,Library as LibraryIcon,LogOut as LogOutIcon} from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [showLogoutTab, setShowLogoutTab] = useState(false);
  //const [activeTab, setActiveTab] = useState("recent");
  const [formattedImages, setFormattedImages] = useState([]);
  //const [olderImages, setOlderImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleDownload = async (image) => {
  
  
    try {
      await API.post("api/images/addImage",{
        imageId:image.id,

      });

      const downloadUrl = image.imageUrl.replace(
        "/upload/",
        "/upload/fl_attachment/"
      );
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = image.title || "ai-image";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    catch (err) {
      alert("download failed: " + err);
    }
  
};



  useEffect(() => {
    fetchImages();
  }, []);
const fetchImages = async () => {
  try {
    const res = await API.get("api/images");
    
    console.log(res.data);
    const images = res.data; 

    const now = new Date();
    const formattedImages = [];
    //const older = [];

    images.forEach((img) => {

      // const created = new Date(img.createdAt);
      // const diff = (now - created) / (1000 * 60 * 60);

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

      // if (diff <= 24) recent.push(formatted);
      // else 
      formattedImages.push(formatted);
    });

    setFormattedImages(formattedImages);
    //setOlderImages([]);
    setLoading(false);

  } catch (err) {
    console.log("hello kam ni hora");
    console.error(err);
  }
};

 const handleLogout=async ()=>{
    try{
      await API.post("/api/auth/logout");
      navigate("/login");

    }
    catch(err){
      alert(err);
    }
    
  
  

 }
 
  // const tabs = [
  //   { id: "recent", label: "Recent" },
  //   { id: "older", label: "Older" }
  // ];

  return (
    <div className={styles.dashboard}>

      <div className={styles.header}>
        <div className={styles.logo}>AI <span>Gallery</span></div>

        {/* <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        /> */}
        <div className={styles.otherTabs}>
          <UserIcon
            className={styles.usericon}
            onClick={() => navigate('/profile')}
          />
          <LibraryIcon
            className={styles.libraryicon}
            onClick={() => navigate('/library')}
          />
          <LogOutIcon
            className={styles.logouticon}
            onClick={() => handleLogout()}
        />
        </div>
        
        {/* <div className={styles.library}>Library</div>
        <div className={styles.profile}>Profile</div>
        <button className={styles.logout} onClick={()=>handleLogout()}>Logout</button> */}
      </div>

      <div className={styles.content}>
        {/* {activeTab === "recent" ? ( */}
          <RecentGrid
            images={formattedImages}
            loading={loading}
            onDownload={handleDownload}
          />
        {/* ) : (
          <RecentGrid
            images={olderImages}
            loading={loading}
            onDownload={handleDownload}
          />
        )} */}
      </div>

    </div>
  );
}