import axios from 'axios';

export const baseURL = 'http://localhost:3001/api';
export const axiosInstance = axios.create({
  baseURL: baseURL,
});