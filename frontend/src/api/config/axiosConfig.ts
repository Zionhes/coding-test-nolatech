import axios from "axios";
import { REFRESH_ENDPOINT } from "../endpointsConstants";

import { store } from "@/store/store";
import { logout } from "@/store/authSlice";
import { persistStore } from "redux-persist";
import { publics } from "@/routes/pathConstants";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

// Variable para evitar múltiples llamadas simultáneas al refreshToken
let isRefreshing = false;
let refreshSubscribers: (() => void)[] = [];

const refreshAccessToken = async () => {
  try {
    await api.get(import.meta.env.VITE_BACKEND_URL + REFRESH_ENDPOINT);
    refreshSubscribers.forEach((callback) => callback()); // Notificar a las solicitudes en espera
    refreshSubscribers = [];
  } catch (error) {
    console.error("Session expired. Redirecting to login.");
    window.location.replace(publics.LOGIN);
    throw error;
  } finally {
    isRefreshing = false;
  }
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If cookies don't exist = logout
    if (error.response?.status === 401) {
      store.dispatch(logout());
      persistStore(store).purge();

      return window.location.replace(publics.LOGIN);
    }

    // if invalid token or expired token = refresh
    originalRequest._retry = true;
    if (error.response?.status === 403 && !originalRequest._retry) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          await refreshAccessToken();
          return api.request(originalRequest); // retry original request
        } catch (err) {
          return Promise.reject(err);
        }
      }

      // If the token is already being refreshed, wait for it to finish before retrying
      return new Promise((resolve) => {
        refreshSubscribers.push(() => resolve(api.request(originalRequest)));
      });
    }

    return Promise.reject(error);
  },
);

export { api };
