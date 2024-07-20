import { axiosInstance } from './axios';
import { useAuth } from './authContext';

const useAxios = () => {
  const { token } = useAuth();

  axiosInstance.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export default useAxios;