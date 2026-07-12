// src/config/axios.js
import axios from "axios";

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true, // Important for cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // You can add token to headers if needed
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle network errors
    if (!error.response) {
      console.error("Network Error:", error);
      return Promise.reject({
        message: "Cannot connect to server. Please check if the backend is running.",
        status: 0,
      });
    }
    
    // Handle 401 Unauthorized
    if (error.response.status === 401) {
      // Clear localStorage and redirect to login
      localStorage.removeItem("organization");
      if (window.location.pathname !== "/login" && window.location.pathname !== "/register") {
        window.location.href = "/login";
      }
    }
    
    // Handle 403 Forbidden
    if (error.response.status === 403) {
      console.error("Forbidden:", error.response.data);
    }
    
    // Handle 404 Not Found
    if (error.response.status === 404) {
      console.error("Resource not found:", error.response.data);
    }
    
    // Handle 500 Server Error
    if (error.response.status >= 500) {
      console.error("Server Error:", error.response.data);
    }
    
    return Promise.reject(error);
  }
);

// Export as default
export default api;

// Also export named exports if needed
export { api };