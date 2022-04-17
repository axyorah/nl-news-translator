import axios, { AxiosInstance } from 'axios';

const newsapi = axios.create({
    baseURL: 'https://newsapi.org/v2/top-headlines?'
}) as AxiosInstance;

export default newsapi;