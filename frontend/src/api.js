const defaultApiUrl = import.meta.env.DEV
  ? "/api/hotels"
  : "https://stayscape-backend-hsty.onrender.com/api/hotels";

export const API_URL = import.meta.env.VITE_API_URL || defaultApiUrl;

export const DEFAULT_HOTEL_IMAGE =
  "https://i.pinimg.com/736x/36/09/08/360908ad4725d5f9b87bb6f9b26cdd91.jpg";

export const getImageUrl = (image) => {
  if (!image) return DEFAULT_HOTEL_IMAGE;
  if (
    image.startsWith("http://") ||
    image.startsWith("https://") ||
    image.startsWith("blob:") ||
    image.startsWith("data:")
  ) {
    return image;
  }
  const backendBase = import.meta.env.DEV
    ? ""
    : (import.meta.env.VITE_BACKEND_URL || "https://stayscape-backend-hsty.onrender.com");
  return `${backendBase}${image.startsWith("/") ? "" : "/"}${image}`;
};
