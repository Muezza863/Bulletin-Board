import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import styles from './style/Navbar.module.css';

// --- Kumpulan Ikon SVG untuk Dropdown ---
const ProfileIcon = () => (
  <svg className={styles.menuIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const DashboardIcon = () => (
  <svg className={styles.menuIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const LogoutIcon = () => (
  <svg className={styles.menuIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

const Navbar = () => {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setIsDropdownOpen(false);
    navigate('/login');
  };

  return (
    <div className={styles.navWrapper}>
      <nav className={styles.nav}>
        <Link to="/" style={{ textDecoration: 'none' }} className={styles.logoWrapper}>
          <div className={styles.dot}></div>
          <span className={styles.logoText}>EchoBoard</span>
        </Link>
        
        <div className={styles.navLinks}>
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

              {isDropdownOpen && (
                <div className={styles.dropdown}>
                  {/* --- Header Identitas User --- */}
                  <div className={styles.dropdownHeader}>
                    <span className={styles.dropdownName}>{user?.fullname || 'User'}</span>
                    <span className={styles.dropdownRole}>
                      {user?.role === 'admin' ? 'Admin Account' : user?.role === 'free' ? 'Free Account' : 'Premium Account'}
                    </span>
                  </div>
                  
                  <div className={styles.dropdownDivider}></div>

                  {/* --- Menu Profile --- */}
                  <Link to="/profile" className={styles.dropdownItem} onClick={() => setIsDropdownOpen(false)}>
                    <ProfileIcon />
                    Profile
                  </Link>

                  {/* --- Menu Admin (Hanya Tampil Jika Role = admin) --- */}
                  {user?.role === 'admin' && (
                    <Link to="/admin" className={styles.dropdownItem} onClick={() => setIsDropdownOpen(false)}>
                      <DashboardIcon />
                      Admin Dashboard
                    </Link>
                  )}

                  <div className={styles.dropdownDivider}></div>

                  {/* --- Menu Logout --- */}
                  <button onClick={handleLogout} className={`${styles.dropdownItem} ${styles.logoutBtn}`}>
                    <LogoutIcon />
                    Log out
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