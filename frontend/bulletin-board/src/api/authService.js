import axiosInstance from './axiosInstance';

export const authService = {
  login: async (credentials) => {
    // credentials: { username, password }
    const response = await axiosInstance.post('/auth/login', credentials);
    return response.data;
  },
  
  register: async (userData) => {
    // userData berasal dari form: { firstName, lastName, email, username, password }
    const payload = {
      fullname: `${userData.firstName} ${userData.lastName}`.trim(),
      email: userData.email,
      username: userData.username,
      password: userData.password
    };
    const response = await axiosInstance.post('/auth/register', payload);
    return response.data;
  }
};