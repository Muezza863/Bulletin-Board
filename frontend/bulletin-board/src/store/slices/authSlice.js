import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

// 1. Ini adalah Redux Thunk untuk Async API Call (Login)
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      // Menembak endpoint Express Anda
      const response = await axiosInstance.post('/login', credentials);
      
      // Simpan token ke localStorage jika ada
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      return response.data; // Ini akan menjadi 'action.payload' jika sukses
    } catch (error) {
      // Menangkap pesan error dari Express
      return rejectWithValue(error.response?.data?.message || 'Login gagal. Silakan coba lagi.');
    }
  }
);

// 2. Setup Initial State
const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
  isLoading: false,
  error: null,
};

// 3. Buat Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Action synchronous (contoh: untuk logout)
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    },
  },
  // extraReducers digunakan untuk menangani state dari Thunk (Async)
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user; // Sesuaikan dengan struktur response Express Anda
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload; // Berisi rejectWithValue dari blok catch
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;