import React, { useState, useEffect } from 'react';
import styles from './style/Signup.module.css';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

// Ikon Utility
const EyeIcon = () => (
  <svg className={styles.eyeIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeOffIcon = () => (
  <svg className={styles.eyeIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);

const CheckIcon = () => (
  <svg className={styles.criteriaIcon} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

const GoogleIcon = () => (
  <svg className={styles.googleIcon} viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
);

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  // State untuk melacak 5 kriteria password
  const [criteria, setCriteria] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    symbol: false
  });

  const [strengthScore, setStrengthScore] = useState(0);

  // Evaluasi password setiap kali input password berubah
  useEffect(() => {
    const p = formData.password;
    const checks = {
      length: p.length >= 8,
      uppercase: /[A-Z]/.test(p),
      lowercase: /[a-z]/.test(p),
      number: /[0-9]/.test(p),
      symbol: /[^A-Za-z0-9]/.test(p)
    };
    
    setCriteria(checks);
    
    // Hitung total kriteria yang terpenuhi (0 - 5)
    const score = Object.values(checks).filter(Boolean).length;
    setStrengthScore(score);
  }, [formData.password]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validasi akhir sebelum submit
    if (strengthScore < 4) {
      alert("Password belum memenuhi syarat keamanan minimum.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert("Konfirmasi password tidak cocok!");
      return;
    }

    const payload = {
      fullname: `${formData.firstName} ${formData.lastName}`.trim(),
      username: formData.username,
      email: formData.email,
      password: formData.password
    };

    console.log("Data siap dikirim ke backend Express:", payload);
    alert("Registrasi sukses di-simulasikan!");
  };

  // Helper untuk menentukan warna bar dan label berdasarkan skor (0-5)
  const getStrengthData = () => {
    switch (strengthScore) {
      case 0:
      case 1: return { label: 'Too Weak', color: '#ef4444' }; // Merah
      case 2: return { label: 'Weak', color: '#f97316' };     // Oranye
      case 3: return { label: 'Fair', color: '#eab308' };     // Kuning
      case 4: return { label: 'Strong', color: 'var(--primary-teal)' }; // Teal (Memenuhi Syarat Utama)
      case 5: return { label: 'Very Strong', color: 'var(--primary-dark)' }; // Biru Tua (Bonus Simbol)
      default: return { label: '', color: 'var(--border-light)' };
    }
  };

  const strengthData = getStrengthData();
  const isPasswordMatch = formData.password === formData.confirmPassword;
  const showMatchError = formData.confirmPassword.length > 0 && !isPasswordMatch;
  
  // Tombol hanya aktif jika skor >= 4 dan password cocok
  const isFormValid = strengthScore >= 4 && isPasswordMatch && formData.confirmPassword.length > 0;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Create Account</h1>
          <p className={styles.subtitle}>Join EchoBoard today.</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Baris First Name & Last Name */}
          <div className={styles.row}>
            <div>
              <label className={styles.label}>First Name</label>
              <input name="firstName" type="text" className={styles.input} required onChange={handleChange} />
            </div>
            <div>
              <label className={styles.label}>Last Name</label>
              <input name="lastName" type="text" className={styles.input} required onChange={handleChange} />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Username</label>
            <input name="username" type="text" className={styles.input} placeholder="Must be unique" required onChange={handleChange} />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Email Address</label>
            <input name="email" type="email" className={styles.input} placeholder="name@example.com" required onChange={handleChange} />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Password</label>
            <div className={styles.passwordWrapper}>
              <input 
                name="password" 
                type={showPassword ? "text" : "password"} 
                className={styles.input} 
                onChange={handleChange} 
                required 
              />
              <button type="button" className={styles.eyeBtn} onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>

            {/* Indikator Kekuatan Password */}
            {formData.password && (
              <div className={styles.strengthMeter}>
                <div className={styles.strengthBars}>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <div 
                      key={num} 
                      className={styles.bar} 
                      style={{ backgroundColor: strengthScore >= num ? strengthData.color : 'var(--border-light)' }}
                    ></div>
                  ))}
                </div>
                <span className={styles.strengthLabel} style={{ color: strengthData.color }}>
                  {strengthData.label}
                </span>
                
                {/* Daftar Kriteria */}
                <ul className={styles.criteriaList}>
                  <li className={criteria.length ? styles.criteriaMet : ''}><CheckIcon /> Min. 8 characters</li>
                  <li className={criteria.uppercase ? styles.criteriaMet : ''}><CheckIcon /> Uppercase letter</li>
                  <li className={criteria.lowercase ? styles.criteriaMet : ''}><CheckIcon /> Lowercase letter</li>
                  <li className={criteria.number ? styles.criteriaMet : ''}><CheckIcon /> Number</li>
                  <li className={criteria.symbol ? styles.criteriaMet : ''}><CheckIcon /> Symbol (Optional)</li>
                </ul>
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Confirm Password</label>
            <div className={styles.passwordWrapper}>
              <input 
                name="confirmPassword" 
                type={showConfirm ? "text" : "password"} 
                // Ubah border jadi merah jika tidak cocok
                className={`${styles.input} ${showMatchError ? styles.inputError : ''}`} 
                onChange={handleChange} 
                required 
              />
              <button type="button" className={styles.eyeBtn} onClick={() => setShowConfirm(!showConfirm)}>
                {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {showMatchError && <div className={styles.errorText}>Passwords do not match</div>}
          </div>

          <button type="submit" className={styles.submitBtn} disabled={!isFormValid}>
            Create Account
          </button>
        </form>

        <div className={styles.divider}>
          <span>OR</span>
        </div>

        <button type="button" className={styles.googleBtn}>
          <GoogleIcon />
          Sign up with Google
        </button>

        <div className={styles.footer}>
          Already have an account? 
          <span onClick={() => navigate('/login')} className={styles.link}>Sign in</span>
        </div>
      </div>
    </div>
  );
};

export default Signup;