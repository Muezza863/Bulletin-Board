import React from 'react';
import styles from './style/Home.module.css';
import Navbar from '../components/Navbar';
import PostCard from '../components/PostCard';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  // Data dummy yang sama persis dengan desain Anda
  const dummyPost = {
    userName: 'Elena Vance',
    userAvatar: 'https://i.pravatar.cc/150?u=elena',
    isPremium: true,
    timeAgo: '2 hours ago',
    content: 'The future of minimalist design is about intentionality. Less but better.',
    image: 'https://images.unsplash.com/photo-1519751138087-5bf79df62d5b?auto=format&fit=crop&w=800&q=80',
    // Tambahkan field baru ini
    likesCount: 124, 
    commentsCount: 12 
  };

  return (
    <div className={styles.container}>
      <Navbar />

      <section className={styles.heroSection}>
        <h1 className={styles.title}>
          Share your thoughts with <br />
          <span className={styles.brand}>EchoBoard</span>
        </h1>
        <p className={styles.subtitle}>
          A space for clean, minimal, and meaningful discussions. Join our community today.
        </p>
        
        <div>
          <button onClick={() => navigate('/login')} className={styles.btnPrimary}>Start Posting</button>
          <button className={styles.btnSecondary}>Learn More</button>
        </div>
      </section>

      <main className={styles.feedContainer}>
        <div className={styles.feedHeader}>
          <h2 className={styles.feedTitle}>Recent Discussions</h2>
          <div className={styles.feedTabs}>
            <span>Trending</span>
            <span className={styles.tabActive}>Newest</span>
          </div>
        </div>

        {/* Memanggil komponen PostCard dan mengirim data dummy */}
        <PostCard post={dummyPost} />
      </main>
    </div>
  );
};

export default Home;