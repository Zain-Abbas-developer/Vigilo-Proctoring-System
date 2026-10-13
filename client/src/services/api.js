import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL || "http://localhost:3000/api",

  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("vigilo_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


// Handle authentication errors globally
api.interceptors.response.use(
  (response) => response,
  (err) => {
    const status = err.response?.status;

    console.error("API request failed:", {
      url: err.config?.url,
      status,
      responseData: err.response?.data,
      message: err.message,
    });

    if (status === 401) {
      localStorage.removeItem("vigilo_token");
      localStorage.removeItem("vigilo_user");

      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }

    // Preserve the original Axios error and its response.
    return Promise.reject(err);
  }
);

export default api;