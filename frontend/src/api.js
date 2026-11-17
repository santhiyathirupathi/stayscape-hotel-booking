const defaultApiUrl = import.meta.env.DEV
  ? "/api/hotels"
  : "https://stayscape-backend-hsty.onrender.com/api/hotels";

export const API_URL = import.meta.env.VITE_API_URL || defaultApiUrl;
