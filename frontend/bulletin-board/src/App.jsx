import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import semua halaman yang sudah kita buat
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PostDetail from './pages/PostDetail';

function App() {
  return (
    <Router>
      <Routes>
        {/* Daftarkan rute (URL) dan halamannya di sini */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* :id adalah parameter dinamis, nantinya diisi dengan ID dari database Anda */}
        <Route path="/post/:id" element={<PostDetail />} /> 
      </Routes>
    </Router>
  );
}

export default App;