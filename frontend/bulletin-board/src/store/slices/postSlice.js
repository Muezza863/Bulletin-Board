import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

// Thunk untuk mengambil data dari backend
export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (_, { rejectWithValue }) => {
    try {
      // Asumsi endpoint API Anda adalah GET /posts
      const response = await axiosInstance.get('/post');
      
      // Mengembalikan data array postingan dari Express
      return response.data.data.posts; 
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Gagal mengambil data postingan dari server.'
      );
    }
  }
);

const initialState = {
  posts: [], // Array kosong untuk menampung data dari database
  isLoading: false,
  error: null,
};

const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {}, // Belum ada aksi synchronous saat ini
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        // Menyimpan data dari backend ke dalam state Redux
        state.posts = action.payload; 
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default postSlice.reducer;