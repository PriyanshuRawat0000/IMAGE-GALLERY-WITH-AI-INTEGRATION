import React, { useState ,useEffect } from 'react';
import { User, Mail, Download, Award } from 'lucide-react';
import styles from './Profile.module.css';
import API from '../api/axios.js';
export default function Profile({ user, downloadCount }) {
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(user?.username || 'User');
  const [email, setEmail] = useState(user?.email || 'user@example.com');
  
  const fetchDetails=async ()=>{
    try{
      const user=await API.post("api/auth/fetchDetails");
      setUsername(user.data.username);
      setEmail(user.data.email);

    }
    catch(err){
      console.log(`err is ${err}`);
      
    }
    
  
  };
  useEffect(()=>{
    fetchDetails();
  },[]);

  const handleSave =async () => {
    try{
      const data=await API.post("api/auth/saveProfile",{
      username:username,
      email:email
    });
    }
    catch(err){
      console.log(err);
    }
    
     
  };

  return (
    <div className={styles.profile}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Profile</h1>
          <p>Manage your account information</p>
        </div>

        <div className={styles.card}>
          

          <div className={styles.infoSection}>
            {isEditing ? (
              <>
                <div className={styles.inputGroup}>
                  <label>Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className={styles.actions}>
                  <button onClick={handleSave} className={styles.saveBtn}>
                    Save Changes
                  </button>
                  <button onClick={() => setIsEditing(false)} className={styles.cancelBtn}>
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className={styles.infoItem}>
                  <User className={styles.icon} size={20} />
                  <div>
                    <label>Username</label>
                    <p>{username}</p>
                  </div>
                </div>

                <div className={styles.infoItem}>
                  <Mail className={styles.icon} size={20} />
                  <div>
                    <label>Email</label>
                    <p>{email}</p>
                  </div>
                </div>

                {/* <div className={styles.infoItem}>
                  <Download className={styles.icon} size={20} />
                  <div>
                    <label>Total Downloads</label>
                    <p>{downloadCount}</p>
                  </div>
                </div> */}

                {/* <div className={styles.infoItem}>
                  <Award className={styles.icon} size={20} />
                  <div>
                    <label>Account Type</label>
                    <p>{user?.accountType || 'Free'}</p>
                  </div>
                </div> */}

                <button onClick={() => setIsEditing(true)} className={styles.editBtn}>
                  Edit Profile
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
