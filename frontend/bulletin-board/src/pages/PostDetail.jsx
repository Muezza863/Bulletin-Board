import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPostById, fetchCommentsByPostId, clearPostDetail, toggleLike, addComment } from '../store/slices/postSlice';
import styles from './style/PostDetail.module.css';
import Navbar from '../components/Navbar';
import CommentBar from '../components/CommentBar'; // <-- Import CommentBar

const ArrowLeftIcon = () => (
  <svg className={styles.backIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

// Ikon Heart dengan properti isLiked
const HeartIcon = ({ isLiked, size = 18 }) => (
  <svg 
    width={size} 
    height={size}
    fill={isLiked ? "#ef4444" : "none"} 
    stroke={isLiked ? "#ef4444" : "currentColor"} 
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

// Helper: format tanggal relatif
const formatTimeAgo = (dateStr) => {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Baru saja';
  if (minutes < 60) return `${minutes} menit lalu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  return `${days} hari lalu`;
};

const PostDetail = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const {
    currentPost,
    isLoadingDetail,
    errorDetail,
    comments,
    isLoadingComments,
    isAddingComment, // <-- Pastikan ini ditarik dari Redux state
  } = useSelector((state) => state.post);

  // Selector auth untuk memeriksa apakah user sedang login dan mendapatkan id user
  const { user, token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (id) {
      dispatch(fetchPostById(id));
      dispatch(fetchCommentsByPostId(id));
    }
    // Bersihkan state saat keluar dari halaman
    return () => {
      dispatch(clearPostDetail());
    };
  }, [id, dispatch]);

  // Handler toggle Like
  const handleLikeClick = () => {
    if (!token) {
      navigate('/login');
      return;
    }
    const isLiked = currentPost.likes && user ? currentPost.likes.includes(user.id) : false;
    dispatch(toggleLike({ postId: currentPost._id, isLiked }));
  };

  // Handler pengiriman komen dari CommentBar
  const handleSendComment = (text) => {
    if (!token) {
      navigate('/login');
      return;
    }
    if (text.trim() && currentPost) {
      dispatch(addComment({ postId: currentPost._id, content: text }));
    }
  };

  // State: loading
  if (isLoadingDetail) {
    return (
      <div className={styles.container}>
        <Navbar />
        <div className={styles.contentArea}>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', paddingTop: '40px' }}>
            Memuat postingan...
          </p>
        </div>
      </div>
    );
  }

  // State: error
  if (errorDetail) {
    return (
      <div className={styles.container}>
        <Navbar />
        <div className={styles.contentArea}>
          <p style={{ textAlign: 'center', color: '#ef4444', paddingTop: '40px' }}>
            {errorDetail}
          </p>
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <button className={styles.backBtn} onClick={() => navigate(-1)}>
              <ArrowLeftIcon />
              Kembali
            </button>
          </div>
        </div>
      </div>
    );
  }

  // State: data belum ada
  if (!currentPost) return null;

  // Ambil gambar dari attachments jika ada
  const postImage = currentPost.attachments?.[0]?.url || null;
  // Nama author - userId bisa berupa object (jika di-populate) atau string
  const authorName = currentPost.userId?.username || currentPost.userId || 'Pengguna';
  
  // Status isLiked
  const isLiked = currentPost.likes && user ? currentPost.likes.includes(user.id) : false;

  return (
    <div className={styles.container}>
      <Navbar />

      <div className={styles.contentArea}>
        <div className={styles.wrapper}>

          <button className={styles.backBtn} onClick={() => navigate(-1)}>
            <ArrowLeftIcon />
            Back to feed
          </button>

          {/* Card detail post */}
          <div style={{
            background: 'white',
            border: '1px solid var(--border-light)',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 6px -1px rgba(41, 115, 178, 0.05)',
          }}>
            {/* Header post */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <img
                src={`https://i.pravatar.cc/150?u=${currentPost._id}`}
                alt="avatar"
                style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ fontWeight: '700', fontSize: '15px', color: 'var(--primary-dark)' }}>
                    {authorName}
                  </div>
                  {(currentPost.userId?.role === 'premium') && (
                    <span style={{
                      fontSize: '11px',
                      fontWeight: '700',
                      color: 'white',
                      backgroundColor: 'var(--primary-teal)',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Premium
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {formatTimeAgo(currentPost.createdAt)}
                </div>
              </div>
            </div>

            {/* Judul post */}
            {currentPost.title && (
              <h1 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--primary-dark)', marginBottom: '12px' }}>
                {currentPost.title}
              </h1>
            )}

            {/* Konten post */}
            <p style={{ fontSize: '15px', color: 'var(--text-main)', lineHeight: '1.7', marginBottom: '16px' }}>
              {currentPost.content}
            </p>

            {/* Gambar (jika ada) */}
            {postImage && (
              <img
                src={postImage}
                alt="post attachment"
                style={{ width: '100%', borderRadius: '12px', objectFit: 'cover', marginBottom: '16px' }}
              />
            )}

            {/* Footer interaksi */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-light)' }}>
              <button 
                onClick={handleLikeClick}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px', 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer',
                  padding: 0,
                  fontSize: '13px', 
                  color: isLiked ? '#ef4444' : 'var(--text-muted)'
                }}
              >
                <HeartIcon isLiked={isLiked} />
                <span>{currentPost.likeCount || 0} suka</span>
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-muted)' }}>
                <span>💬 {comments.length} komentar</span>
              </div>
              {currentPost.category && (
                <span style={{ marginLeft: 'auto', fontSize: '12px', fontWeight: '600', color: 'var(--primary-teal)', background: 'rgba(20, 184, 166, 0.1)', padding: '4px 10px', borderRadius: '20px' }}>
                  {currentPost.category}
                </span>
              )}
            </div>
          </div>

          {/* Seksi komentar */}
          <section className={styles.commentsSection}>
            <div className={styles.commentsHeader}>
              <h2 className={styles.commentsTitle}>Komentar</h2>
              <span className={styles.commentsCount}>{comments.length} Komentar</span>
            </div>

            <div className={styles.commentList} style={{ paddingBottom: '80px' }}>
              {isLoadingComments && (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Memuat komentar...</p>
              )}

              {!isLoadingComments && comments.length === 0 && (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Belum ada komentar.</p>
              )}

              {!isLoadingComments && comments.map((comment) => (
                <div key={comment._id} className={styles.commentItem}>
                  <img
                    src={`https://i.pravatar.cc/150?u=${comment.userId?._id || comment.userId}`}
                    alt={comment.userId?.username || 'User'}
                    className={styles.avatar}
                  />
                  <div className={styles.commentContent}>
                    <div className={styles.commentHeader}>
                      <span className={styles.authorName}>
                        {comment.userId?.username || 'Pengguna'}
                      </span>
                      <span className={styles.commentTime}>
                        {formatTimeAgo(comment.createdAt)}
                      </span>
                    </div>
                    <p className={styles.commentText}>{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* CommentBar ditempel di sini agar sticky di bagian bawah halaman */}
            <CommentBar 
              onSend={handleSendComment} 
              isLoading={isAddingComment} 
            />

          </section>

        </div>
      </div>
    </div>
  );
};

export default PostDetail;