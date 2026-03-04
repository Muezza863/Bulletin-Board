import React from 'react';
import styles from './style/PostDetail.module.css';
import PostCard from '../components/PostCard';
import Navbar from '../components/Navbar'; // 1. IMPORT NAVBAR

const ArrowLeftIcon = () => (
  <svg className={styles.backIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const PostDetail = () => {
  const postData = {
    userName: 'Elena Vance',
    userAvatar: 'https://i.pravatar.cc/150?u=elena',
    isPremium: true,
    timeAgo: '2 hours ago',
    content: 'The future of minimalist design is about intentionality. Less but better.',
    image: 'https://images.unsplash.com/photo-1519751138087-5bf79df62d5b?auto=format&fit=crop&w=800&q=80',
    likesCount: 124, 
    commentsCount: 12 
  };

  const commentsData = [
    {
      id: 1,
      userName: 'Liam Hudson',
      userAvatar: 'https://i.pravatar.cc/150?u=liam',
      timeAgo: '1 hour ago',
      content: 'Absolutely agree. Intentionality is key when designing user interfaces. Less noise means better focus.'
    },
    {
      id: 2,
      userName: 'Sophia Martinez',
      userAvatar: 'https://i.pravatar.cc/150?u=sophia',
      timeAgo: '45 mins ago',
      content: 'This is exactly what I was looking for! Do you have any framework recommendations that follow this minimalist philosophy?'
    }
  ];

  return (
    <div className={styles.container}>
      {/* 2. PANGGIL NAVBAR DI SINI */}
      <Navbar /> 

      <div className={styles.contentArea}>
        <div className={styles.wrapper}>
          
          <button className={styles.backBtn} onClick={() => alert('Kembali ke Feed!')}>
            <ArrowLeftIcon />
            Back to feed
          </button>

          {/* PostCard dan CommentItem sekarang akan otomatis mengikuti lebar wrapper (900px) */}
          <PostCard post={postData} />

          <section className={styles.commentsSection}>
            <div className={styles.commentsHeader}>
              <h2 className={styles.commentsTitle}>Comments</h2>
              <span className={styles.commentsCount}>{postData.commentsCount} Comments</span>
            </div>

            <div className={styles.commentList}>
              {commentsData.map((comment) => (
                <div key={comment.id} className={styles.commentItem}>
                  <img src={comment.userAvatar} alt={comment.userName} className={styles.avatar} />
                  <div className={styles.commentContent}>
                    <div className={styles.commentHeader}>
                      <span className={styles.authorName}>{comment.userName}</span>
                      <span className={styles.commentTime}>{comment.timeAgo}</span>
                    </div>
                    <p className={styles.commentText}>{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default PostDetail;