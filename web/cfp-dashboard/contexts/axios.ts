import axios from 'axios';

export const baseURL = `${process.env.NEXT_PUBLIC_SERVER_URL}/api`;
export const ansibleURL = 'http://ansible:5001/';
export const axiosInstance = axios.create({
  baseURL: baseURL,
});
export const axiosAnsibleInstance = axios.create({
  baseURL: ansibleURL,
  headers: {
    'Content-Type': 'application/json',
  },
});