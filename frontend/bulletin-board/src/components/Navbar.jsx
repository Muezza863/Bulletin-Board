import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice'; // Import aksi logout
import styles from './style/Navbar.module.css';

const Navbar = () => {
  // 1. Ambil data user dan token dari Redux Store
  const { user, token } = useSelector((state) => state.auth);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // 2. State untuk mengontrol buka/tutup dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // 3. Efek untuk menutup dropdown jika user mengklik sembarang tempat di luar menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 4. Fungsi saat tombol logout ditekan
  const handleLogout = () => {
    dispatch(logout()); // Hapus state dan token di Redux & localStorage
    setIsDropdownOpen(false); // Tutup menu
    navigate('/login'); // Lempar kembali ke halaman login
  };

  return (
    <div className={styles.navWrapper}>
      <nav className={styles.nav}>
        <Link to="/" style={{ textDecoration: 'none' }} className={styles.logoWrapper}>
          <div className={styles.dot}></div>
          <span className={styles.logoText}>EchoBoard</span>
        </Link>
        
        <div className={styles.navLinks}>
          {/* Conditional Rendering: Jika token ada (Login), tampilkan Profil. Jika tidak, tampilkan tombol Auth */}
          {token ? (
            <div 
              className={styles.userInfo} 
              ref={dropdownRef} 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span className={styles.userName}>{user?.fullname || 'Pengguna'}</span>
              <img 
                src={user?.profilePicture || 'https://i.pravatar.cc/150?img=11'} 
                alt="Profile" 
                className={styles.userAvatar} 
              />

              {/* Tampilkan menu dropdown jika isDropdownOpen = true */}
              {isDropdownOpen && (
                <div className={styles.dropdown}>
                  <Link 
                    to="/profile" 
                    className={styles.dropdownItem} 
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Profile
                  </Link>
                  <button 
                    onClick={handleLogout} 
                    className={`${styles.dropdownItem} ${styles.logoutBtn}`}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className={styles.loginBtn} style={{ textDecoration: 'none' }}>Login</Link>
              <Link to="/signup" className={styles.signupBtn} style={{ textDecoration: 'none' }}>Sign Up</Link>
            </>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;