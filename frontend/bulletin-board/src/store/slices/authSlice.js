import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/login', credentials);
      
      if (!response.data.token) {
        return rejectWithValue(response.data.message || 'Username atau password salah.');
      }

      // SIMPAN TOKEN DAN DATA USER KE LOCAL STORAGE
      localStorage.setItem('token', response.data.token);
      // Data user harus diubah menjadi string (JSON) sebelum disimpan
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user)); 
      }
      
      return response.data; 
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Koneksi ke server gagal. Silakan coba lagi.'
      );
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      // Menembak endpoint Express (asumsi endpoint-nya /register)
      const response = await axiosInstance.post('/register', userData);
      return response.data; 
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Koneksi ke server gagal. Silakan coba lagi.'
      );
    }
  }
);

// AMBIL KEMBALI DATA USER DARI LOCAL STORAGE SAAT APLIKASI DIMUAT
const initialState = {
  // Gunakan JSON.parse untuk mengembalikan string JSON menjadi objek JavaScript
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
  token: localStorage.getItem('token') || null,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      // BERSIHKAN KEDUANYA SAAT LOGOUT
      localStorage.removeItem('token');
      localStorage.removeItem('user'); 
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        // Pastikan backend mengirim struktur { token: "...", user: { fullname: "...", ... } }
        state.user = action.payload.user; 
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload; 
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        // Kita tidak otomatis login, jadi biarkan user/token kosong dan arahkan ke halaman login
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload; 
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;