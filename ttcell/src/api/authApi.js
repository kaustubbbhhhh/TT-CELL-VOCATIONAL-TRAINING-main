import axiosInstance from './axiosInstance';

export const authApi = {
  login: async (email, password) => {
    const response = await axiosInstance.post('/auth/login/', { email, password });
    return response.data;
  },

  logout: async () => {
    const response = await axiosInstance.post('/auth/logout/');
    return response.data;
  },

  changePassword: async (old_password, new_password, confirm_password) => {
    const response = await axiosInstance.post('/auth/change-password/', {
      old_password,
      new_password,
      confirm_password,
    });
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await axiosInstance.post('/auth/forgot-password/', { email });
    return response.data;
  },

  resetPasswordWithToken: async (token, new_password) => {
    const response = await axiosInstance.post('/auth/reset-password-token/', {
      token,
      new_password,
    });
    return response.data;
  },
};
