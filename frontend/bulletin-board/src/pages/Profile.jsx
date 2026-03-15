import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import styles from './style/Profile.module.css';
import { fetchProfile } from '../store/slices/profileSlice';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, user: authUser } = useSelector((state) => state.auth);
  const { profileData, isLoading, error } = useSelector((state) => state.profile);

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      dispatch(fetchProfile());
    }
  }, [dispatch, navigate, token]);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <Navbar />
        <div className={styles.mainLayout}>
          <p style={{ textAlign: 'center', marginTop: '40px', color: 'var(--text-muted)' }}>Membaca data profil...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <Navbar />
        <div className={styles.mainLayout}>
          <p style={{ textAlign: 'center', marginTop: '40px', color: '#ef4444' }}>Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!profileData) return null;

  const { username, email, role, quotaStats } = profileData;

  // Helpers untuk tampilan role
  let roleClass = styles.free;
  let roleLabel = 'Free Account';
  if (role === 'admin') {
    roleClass = styles.admin;
    roleLabel = 'Admin';
  } else if (role === 'premium') {
    roleClass = styles.premium;
    roleLabel = 'Premium';
  }

  return (
    <div className={styles.container}>
      <Navbar />
      
      <main className={styles.mainLayout}>
        <header className={styles.header}>
          <h1 className={styles.pageTitle}>Profile</h1>
          <p className={styles.pageSubtitle}>Kelola akun dan pantau kuota postingan Anda.</p>
        </header>

        <div className={styles.contentWrapper}>
          
          {/* Bagian Profil Kiri */}
          <section className={`${styles.card} ${styles.userInfo}`}>
            <img 
              src={authUser?.profilePicture || 'https://i.pravatar.cc/150?img=11'} 
              alt="Profile Avatar" 
              className={styles.avatar} 
            />
            <h2 className={styles.userName}>{username || authUser?.fullname}</h2>
            <p className={styles.userEmail}>{email}</p>
            <span className={`${styles.roleBadge} ${roleClass}`}>
              {roleLabel}
            </span>
          </section>

          {/* Bagian Statistik Kanan */}
          <section className={styles.card}>
            <h3 className={styles.statsTitle}>Posting Quota & Stats</h3>
            
            <div className={styles.statsGrid}>
              <div className={styles.statItem}>
                <div className={styles.statValue}>{quotaStats?.used || 0}</div>
                <div className={styles.statLabel}>Postingan Dibuat</div>
              </div>

              <div className={styles.statItem}>
                <div className={styles.statValue}>
                   {quotaStats?.limit === null || quotaStats?.limit === undefined || quotaStats?.limit === "Infinity" 
                     ? <span className={styles.infinityIcon}>∞</span> 
                     : quotaStats?.limit}
                </div>
                <div className={styles.statLabel}>Total Kuota Bulanan</div>
              </div>

              <div className={`${styles.statItem} ${styles.fullWidth}`}>
                <div className={styles.statValue}>
                   {quotaStats?.remaining === null || quotaStats?.remaining === undefined || quotaStats?.remaining === "Infinity" 
                     ? <span className={styles.infinityIcon}>∞</span> 
                     : quotaStats?.remaining}
                </div>
                <div className={styles.statLabel}>Sisa Kuota</div>
                {quotaStats?.resetDate && (
                  <p className={styles.statSubtitle}>
                    Kuota direset pada: {new Date(quotaStats.resetDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                )}
              </div>
            </div>
            
          </section>

        </div>
      </main>
    </div>
  );
};

export default Profile;
