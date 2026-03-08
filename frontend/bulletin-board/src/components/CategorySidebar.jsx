import React, { useState } from 'react';
import styles from './style/CategorySidebar.module.css';

const CategorySidebar = () => {
  const [showAllCategories, setShowAllCategories] = useState(false);

  const categories = [
    { id: 1, name: 'Technology', count: 128 },
    { id: 2, name: 'Design', count: 84 },
    { id: 3, name: 'Career', count: 65 },
    { id: 4, name: 'Business', count: 42 },
    { id: 5, name: 'Lifestyle', count: 31 },
    { id: 6, name: 'Gaming', count: 28 },
    { id: 7, name: 'Finance', count: 19 },
    { id: 8, name: 'Health', count: 14 },
  ];

  const visibleCategories = showAllCategories ? categories : categories.slice(0, 5);

  return (
    <div className={styles.categoryCard}>
      <h3 className={styles.categoryTitle}>Topics</h3>
      <div className={styles.categoryList}>
        {visibleCategories.map((cat, index) => (
          <button 
            key={cat.id} 
            className={`${styles.categoryItem} ${index === 0 ? styles.categoryActive : ''}`}
          >
            {cat.name}
            <span className={styles.categoryBadge}>{cat.count}</span>
          </button>
        ))}
      </div>
      
      {categories.length > 5 && (
        <button 
          className={styles.seeMoreBtn}
          onClick={() => setShowAllCategories(!showAllCategories)}
        >
          {showAllCategories ? 'Sembunyikan' : 'Selengkapnya...'}
        </button>
      )}
    </div>
  );
};

export default CategorySidebar;