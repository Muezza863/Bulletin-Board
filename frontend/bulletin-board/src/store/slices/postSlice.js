import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

// Thunk: ambil semua post (untuk Home)
export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/post');
      return response.data.data.posts;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'error fetching posts data'
      );
    }
  }
);

// Thunk: ambil satu post berdasarkan ID (untuk PostDetail)
export const fetchPostById = createAsyncThunk(
  'posts/fetchPostById',
  async (postId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/post/${postId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'error fetching post detail data'
      );
    }
  }
);

// Thunk: ambil komentar berdasarkan post ID (untuk PostDetail)
export const fetchCommentsByPostId = createAsyncThunk(
  'posts/fetchCommentsByPostId',
  async (postId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/post/${postId}/comment`);
      return response.data.comments || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'error fetching comments data'
      );
    }
  }
);

// Thunk: Kirim komentar baru
export const addComment = createAsyncThunk(
  'posts/addComment',
  async ({ postId, content }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/post/${postId}/comment`, { content });
      return response.data; // Server mengembalikan dokumen comment
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'error adding comment'
      );
    }
  }
);

// Thunk: Toggle Like postingan
export const toggleLike = createAsyncThunk(
  'posts/toggleLike',
  async ({ postId, isLiked }, { rejectWithValue }) => {
    try {
      const endpoint = isLiked ? `/post/${postId}/unlike` : `/post/${postId}/like`;
      const response = await axiosInstance.post(endpoint);
      // Kita return postId dan isLiked agar reducer tau state awal untuk revert jika perlu
      return { postId, isLiked, message: response.data.message };
    } catch (error) {
      return rejectWithValue({
        postId, 
        isLiked, 
        message: error.response?.data?.message || 'error toggling like'
      });
    }
  }
);

const initialState = {
  posts: [],
  isLoading: false,
  error: null,
  // State untuk halaman detail
  currentPost: null,
  isLoadingDetail: false,
  errorDetail: null,
  comments: [],
  isLoadingComments: false,
  errorComments: null,
  // State untuk add comment
  isAddingComment: false,
  errorAddComment: null,
};

const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    // Reset state detail saat meninggalkan halaman PostDetail
    clearPostDetail: (state) => {
      state.currentPost = null;
      state.comments = [];
      state.errorDetail = null;
      state.errorComments = null;
      state.errorAddComment = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchPosts
      .addCase(fetchPosts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // fetchPostById
      .addCase(fetchPostById.pending, (state) => {
        state.isLoadingDetail = true;
        state.errorDetail = null;
        state.currentPost = null;
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.isLoadingDetail = false;
        state.currentPost = action.payload;
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.isLoadingDetail = false;
        state.errorDetail = action.payload;
      })
      // fetchCommentsByPostId
      .addCase(fetchCommentsByPostId.pending, (state) => {
        state.isLoadingComments = true;
        state.errorComments = null;
      })
      .addCase(fetchCommentsByPostId.fulfilled, (state, action) => {
        state.isLoadingComments = false;
        state.comments = action.payload;
      })
      .addCase(fetchCommentsByPostId.rejected, (state, action) => {
        state.isLoadingComments = false;
        state.errorComments = action.payload;
      })
      // addComment
      .addCase(addComment.pending, (state) => {
        state.isAddingComment = true;
        state.errorAddComment = null;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.isAddingComment = false;
        // Kita juga tambahkan ID user sekarang langsung kalau belum tersambung (karena populate di server hanya untuk get array)
        const currentUser = JSON.parse(localStorage.getItem('user'));
        const newComment = {
          ...action.payload,
          userId: { // Simulasi populate locally untuk author name
            _id: currentUser?.id,
            username: currentUser?.username,
            role: currentUser?.role
          }
        };
        // Unshift: taruh komentar baru di bagian paling atas
        state.comments.unshift(newComment);

        // Update jumlah komentar di _currentPost_ saat viewer berada di PostDetail
        if (state.currentPost && state.currentPost._id === action.payload.postId) {
          state.currentPost.commentCount = (state.currentPost.commentCount || 0) + 1;
        }

        // Update jumlah komentar pada array _posts_ agar component PostCard ikutan responsif (sinkron)
        const postIndex = state.posts.findIndex((p) => p._id === action.payload.postId);
        if (postIndex !== -1) {
          state.posts[postIndex].commentCount = (state.posts[postIndex].commentCount || 0) + 1;
        }
      })
      .addCase(addComment.rejected, (state, action) => {
        state.isAddingComment = false;
        state.errorAddComment = action.payload;
      })
      // toggleLike (Optimistic Update)
      .addCase(toggleLike.pending, (state, action) => {
        // Ambil data dari aksi yang baru dipanggil (sebelum request selesai)
        const { postId, isLiked } = action.meta.arg;
        
        // Ambil ID user dari localStorage untuk dimasukkan/dikeluarkan dari array likes
        const userId = JSON.parse(localStorage.getItem('user'))?.id;
        
        if (!userId) return;

        // 1. Update pada list 'posts' (halaman Home)
        const postIndex = state.posts.findIndex((p) => p._id === postId || p.id === postId);
        if (postIndex !== -1) {
          if (isLiked) { // Saat ini di-like, lalu di-pencet = UNLIKE
            state.posts[postIndex].likeCount -= 1;
            state.posts[postIndex].likes = state.posts[postIndex].likes.filter(id => id !== userId);
          } else { // Saat ini BELUM di-like, lalu di-pencet = LIKE
            state.posts[postIndex].likeCount += 1;
            if (!state.posts[postIndex].likes.includes(userId)) {
              state.posts[postIndex].likes.push(userId);
            }
          }
        }
        
        // 2. Update pada 'currentPost' (halaman PostDetail)
        if (state.currentPost && (state.currentPost._id === postId || state.currentPost.id === postId)) {
          if (isLiked) { // UNLIKE
            state.currentPost.likeCount -= 1;
            state.currentPost.likes = state.currentPost.likes.filter(id => id !== userId);
          } else { // LIKE
            state.currentPost.likeCount += 1;
            if (!state.currentPost.likes.includes(userId)) {
              state.currentPost.likes.push(userId);
            }
          }
        }
      })
      .addCase(toggleLike.rejected, (state, action) => {
        // Jika request gagal, REVERT kembali ke state awal
        const { postId, isLiked, message } = action.payload;
        const userId = JSON.parse(localStorage.getItem('user'))?.id;
        
        if (!userId) return;

        // Karena gagal, kita balikkan keadaannya
        
        // 1. Revert di state.posts
        const postIndex = state.posts.findIndex((p) => p._id === postId || p.id === postId);
        if (postIndex !== -1) {
          if (isLiked) { // Gagal unlike (isLiked awalnya true) -> kembali tambah like seperti semula
            state.posts[postIndex].likeCount += 1;
            if (!state.posts[postIndex].likes.includes(userId)) {
              state.posts[postIndex].likes.push(userId);
            }
          } else { // Gagal like (isLiked awalnya false) -> kembali kurangi like seperti semula
            state.posts[postIndex].likeCount -= 1;
            state.posts[postIndex].likes = state.posts[postIndex].likes.filter(id => id !== userId);
          }
        }
        
        // 2. Revert di state.currentPost
        if (state.currentPost && (state.currentPost._id === postId || state.currentPost.id === postId)) {
          if (isLiked) {
            state.currentPost.likeCount += 1;
            if (!state.currentPost.likes.includes(userId)) {
              state.currentPost.likes.push(userId);
            }
          } else {
            state.currentPost.likeCount -= 1;
            state.currentPost.likes = state.currentPost.likes.filter(id => id !== userId);
          }
        }
        
        // Bisa tambahkan peringatan/toast menggunakan error message: message
      });
  },
});

export const { clearPostDetail } = postSlice.actions;
export default postSlice.reducer;
