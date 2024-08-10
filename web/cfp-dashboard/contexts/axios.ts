import axios from 'axios';

export const baseURL = 'http://localhost:3001/api';
export const ansibleURL = 'http://localhost:5001/';
export const axiosInstance = axios.create({
  baseURL: baseURL,
});
export const axiosAnsibleInstance = axios.create({
  baseURL: ansibleURL,
  headers: {
    'Content-Type': 'application/json',
  },
});