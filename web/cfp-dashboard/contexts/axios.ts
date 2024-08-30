import axios from 'axios';

export const baseURL = `${process.env.NEXT_PUBLIC_SERVER_URL}/api`;
export const ansibleURL = process.env.NEXT_PUBLIC_ANSIBLE_URL;
export const axiosInstance = axios.create({
  baseURL: baseURL,
});
export const axiosAnsibleInstance = axios.create({
  baseURL: ansibleURL,
  headers: {
    'Content-Type': 'application/json',
  },
});