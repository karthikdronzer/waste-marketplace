import axios from 'axios';

const API = axios.create({
  baseURL: 'https://waste-marketplace-api.onrender.com/api',
});

export default API;