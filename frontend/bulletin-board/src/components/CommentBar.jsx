import React, { useState } from 'react';
import styles from './style/CommentBar.module.css';

// Ikon Pesawat Kertas (Paper Plane)
const SendIcon = () => (
  <svg 
    className={styles.sendIcon} 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth="2" 
      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" 
    />
  </svg>
);

const CommentBar = ({ onSend, isLoading }) => {
  const [commentText, setCommentText] = useState('');

  const handleSend = () => {
    if (commentText.trim() && !isLoading) {
      onSend(commentText.trim());
      setCommentText(''); // Kosongkan input setelah dikirim
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={styles.barWrapper}>
      <div className={styles.bar}>
        <input 
          type="text" 
          placeholder="Tulis komentar..." 
          className={styles.input} 
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />
        <button 
          className={styles.sendBtn} 
          onClick={handleSend}
          disabled={!commentText.trim() || isLoading}
        >
          <SendIcon />
        </button>
      </div>
    </div>
  );
};

export default CommentBar;
