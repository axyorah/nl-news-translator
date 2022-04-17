import axios, { AxiosInstance } from 'axios';

const backend = axios.create({
    baseURL: 'http://localhost:8000/api'
}) as AxiosInstance;

export default backend;