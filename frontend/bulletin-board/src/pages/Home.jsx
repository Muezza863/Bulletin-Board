import React, { useEffect } from 'react';
import styles from './style/Home.module.css';
import Navbar from '../components/Navbar';
import PostCard from '../components/PostCard';
import CategorySidebar from '../components/CategorySidebar';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPosts } from '../store/slices/postSlice';

const Home = () => {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const { posts, isLoading, error } = useSelector((state) => state.post);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  return (
    <div className={styles.container}>
      <Navbar />

      <section className={styles.heroSection}>
        {!token && (
          <div>
        <h1 className={styles.title}>
          Share your thoughts with <br />
          <span className={styles.brand}>EchoBoard</span>
        </h1>
        <p className={styles.subtitle}>
          A space for clean, minimal, and meaningful discussions. Join our community today.
        </p>
        
        
            <button onClick={() => navigate('/login')} className={styles.btnPrimary}>
              Start Posting
            </button>
            <button className={styles.btnSecondary}>
              Learn More
            </button>
          </div>
        )}
      </section>

      <div className={styles.mainLayout}>
      <aside className={styles.sidebar}>
        <CategorySidebar />
      </aside>
      
      <main className={styles.feedContainer}>
        <div className={styles.feedHeader}>
          <h2 className={styles.feedTitle}>Recent Discussions</h2>
          <div className={styles.feedTabs}>
            <span>Trending</span>
            <span className={styles.tabActive}>Newest</span>
          </div>
        </div>

        {/* Memanggil komponen PostCard dan mengirim data dummy */}
        <div className={styles.postList}>
          {/* 1. Tangani status Loading */}
            {isLoading && <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Memuat postingan...</p>}
            
            {/* 2. Tangani status Error */}
            {error && <p style={{ color: '#ef4444', textAlign: 'center' }}>{error}</p>}
            
            {/* 3. Render Postingan jika array tidak kosong */}
            {!isLoading && !error && posts.length > 0 && (
              posts.map((postData) => (
                <PostCard key={postData.id || postData._id} post={postData} />
              ))
            )}

            {/* 4. Jika database kosong */}
            {!isLoading && !error && posts.length === 0 && (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Belum ada diskusi saat ini.</p>
            )}
        </div>
      </main>
      </div>
    </div>
  );
};

export default Home;