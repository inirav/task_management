import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000',
});


axiosInstance.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    response => {
      return response;
    },
    error => {      
      const token = localStorage.getItem('token');
      if (!token) {
          window.location.href = "/login";
          return;
      }
      if (error.response && error.response.status == 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
        const navigate = useNavigate();
        navigate("/login");
      }
      if (error.response && error.response.status == 401) {
        console.log(`calling interceptor for 401`);
        const refresh_token = localStorage.getItem('refresh_token');
        const customConfig = { headers: { 'Content-Type': 'application/json' } }
        const params = JSON.stringify({
          token: refresh_token
        })
        axios.post('http://127.0.0.1:8000/refresh', params, customConfig).then(response => {
          localStorage.setItem('token', response.data.access_token);
          localStorage.setItem('refresh_token', response.data.refresh_token);
        })
      }
      return Promise.reject(error);
    }
);
  
export default axiosInstance;