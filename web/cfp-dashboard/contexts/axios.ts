import axios from 'axios';
import { env } from 'next-runtime-env';
const NEXT_PUBLIC_SERVER_URL = env('NEXT_PUBLIC_SERVER_URL');
const NEXT_PUBLIC_ANSIBLE_URL = env('NEXT_PUBLIC_ANSIBLE_URL');
export const baseURL = `${NEXT_PUBLIC_SERVER_URL}/api`;
export const axiosInstance = axios.create({
  baseURL: baseURL,
});
export const axiosAnsibleInstance = axios.create({
  baseURL: NEXT_PUBLIC_ANSIBLE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});