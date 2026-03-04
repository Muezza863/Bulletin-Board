import React from 'react';
import { Link } from 'react-router-dom'; // Import Link
import styles from './style/Navbar.module.css';

const Navbar = () => {
  return (
    <div className={styles.navWrapper}>
      <nav className={styles.nav}>
        {/* Link ke Home */}
        <Link to="/" style={{ textDecoration: 'none' }} className={styles.logoWrapper}>
          <div className={styles.dot}></div>
          <span className={styles.logoText}>EchoBoard</span>
        </Link>
        
        <div className={styles.navLinks}>
          {/* Link ke Login dan Signup */}
          <Link to="/login" className={styles.loginBtn} style={{ textDecoration: 'none' }}>Login</Link>
          <Link to="/signup" className={styles.signupBtn} style={{ textDecoration: 'none' }}>Sign Up</Link>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;