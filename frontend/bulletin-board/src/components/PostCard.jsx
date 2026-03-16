import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleLike } from '../store/slices/postSlice';
import styles from './style/PostCard.module.css';

// Ikon SVG dengan properti isLiked untuk mengatur fill dan stroke color
const HeartIcon = ({ isLiked }) => (
  <svg 
    className={styles.icon} 
    fill={isLiked ? "#ef4444" : "none"} 
    stroke={isLiked ? "#ef4444" : "currentColor"} 
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const CommentIcon = () => (
  <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const ShareIcon = () => (
  <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6a3 3 0 106.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
  </svg>
);

const PostCard = ({ post }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  
  const postId = post._id || post.id;
  const isLiked = post.likes && user ? post.likes.includes(user.id) : false;

  const handleCardClick = () => {
    if (postId) {
      navigate(`/post/${postId}`);
    }
  };

  const handleLikeClick = (e) => {
    e.stopPropagation();
    if (!token) {
      navigate('/login');
      return;
    }
    dispatch(toggleLike({ postId, isLiked }));
  };

  return (
    <div
      className={styles.card}
      onClick={handleCardClick}
      style={{ cursor: postId ? 'pointer' : 'default' }}
    >
      <div className={styles.header}>
        <div className={styles.userInfo}>
          <img
            src={`https://i.pravatar.cc/150?u=${post.userId?._id || post.userId || post._id}`}
            alt="avatar"
            className={styles.avatar}
          />
          <div>
            <div className={styles.nameRow}>
              <span className={styles.name}>
                {post.userId?.username || post.userName || 'Pengguna'}
              </span>
              {(post.userId?.role === 'premium' || post.isPremium) && <span className={styles.badge}>Premium</span>}
            </div>
            <div className={styles.time}>{post.timeAgo}</div>
          </div>
        </div>
        <button className={styles.menuBtn} onClick={(e) => e.stopPropagation()}>
          •••
        </button>
      </div>

      {post.title && <h2 className={styles.title}>{post.title}</h2>}
      <p className={styles.content}>{post.content}</p>

      {post.image && (
        <img src={post.image} alt="post content" className={styles.image} />
      )}

      {/* Bagian Footer Interaksi */}
      <footer className={styles.footer}>
        <div className={styles.leftInteractions}>
          <button 
            className={styles.interaction} 
            onClick={handleLikeClick}
            style={{ color: isLiked ? '#ef4444' : 'inherit' }}
          >
            <HeartIcon isLiked={isLiked} />
            <span className={styles.count}>{post.likeCount || 0}</span>
          </button>
          <button className={styles.interaction} onClick={(e) => e.stopPropagation()}>
            <CommentIcon />
            <span className={styles.count}>{post.commentCount || 0}</span>
          </button>
        </div>
        <button className={styles.shareBtn} onClick={(e) => e.stopPropagation()}>
          <ShareIcon />
        </button>
      </footer>
    </div>
  );
};

export default PostCard;