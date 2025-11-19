// src/services/authService.js

import axios from "axios";

const API_BASE_URL = "https://jigsaw-s7qa.onrender.com";
// const API_BASE_URL = "http://localhost:3003";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // allows refresh token cookie to work
});

/** ───────────────────────────────────────────────
 *  TOKEN REFRESH LOGIC (GLOBAL)
 *  ─────────────────────────────────────────────── */
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, newToken = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    error ? reject(error) : resolve(newToken);
  });
  failedQueue = [];
};

/** ───────────────────────────────────────────────
 *  REQUEST INTERCEPTOR → attach access token
 *  ─────────────────────────────────────────────── */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

/** ───────────────────────────────────────────────
 *  RESPONSE INTERCEPTOR → Handle expired token
 *  ─────────────────────────────────────────────── */
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        // queue the request until new token is generated
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            original.headers.Authorization = `Bearer ${token}`;
            return api(original);
          })
          .catch((err) => Promise.reject(err));
      }

      original._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.get(`${API_BASE_URL}/api/auth/refresh`, {
          withCredentials: true,
        });

        const newAccessToken = response.data.accessToken;

        localStorage.setItem("accessToken", newAccessToken);
        processQueue(null, newAccessToken);

        original.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(original);
      } catch (refreshError) {
        processQueue(refreshError, null);

        // fully logout user
        localStorage.removeItem("accessToken");
        window.dispatchEvent(new CustomEvent("auth:logout"));

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

/** ───────────────────────────────────────────────
 *  AUTH APIs
 *  ─────────────────────────────────────────────── */

/** LOGIN */
export const loginUser = async (email, password) => {
  try {
    const res = await api.post("/api/auth/login", { email, password });

    return {
      accessToken: res.data.accessToken,
      user: res.data.user, // includes role: influencer/brand
    };
  } catch (error) {
    throw {
      message:
        error.response?.data?.error || "Login failed. Please try again.",
    };
  }
};

/** SIGNUP — influencer or brand */
export const signupUser = async (formData) => {
  try {
    const res = await api.post("/api/auth/signup", formData);

    return {
      accessToken: res.data.accessToken,
      user: res.data.user,
    };
  } catch (error) {
    throw {
      message: error.response?.data?.message || "Signup failed",
      errors: error.response?.data?.errors || {},
    };
  }
};

/** MANUAL TOKEN REFRESH (not used often but available) */
export const refreshToken = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/auth/refresh`, {
      withCredentials: true,
    });

    return res.data.accessToken;
  } catch (error) {
    throw { message: "Session expired. Please login again." };
  }
};

/** LOGOUT */
export const logoutUser = async () => {
  try {
    const res = await api.post(
      "/api/auth/logout",
      {},
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );

    // force logout on frontend
    localStorage.removeItem("accessToken");
    window.dispatchEvent(new CustomEvent("auth:logout"));

    return res.data;
  } catch (error) {
    console.error("Logout failed:", error);

    localStorage.removeItem("accessToken");
    window.dispatchEvent(new CustomEvent("auth:logout"));

    throw error;
  }
};

export { api };
