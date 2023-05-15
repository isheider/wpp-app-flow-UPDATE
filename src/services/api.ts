import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3333",
});

api.interceptors.response.use(
  (response: any) => {
    if (response.status === 401) {
      api.defaults.headers["Authorization"] = ` `;

      localStorage.removeItem("@BOT-SIMPLES:user_id");
      localStorage.removeItem("@BOT-SIMPLES:token");
      localStorage.removeItem("@BOT-SIMPLES:name");
      localStorage.removeItem("@BOT-SIMPLES:role");

      window.location.href = "/login";
    }
    return response;
  },
  (error: any) => {
    if (error.response.status === 401) {
      api.defaults.headers["Authorization"] = ` `;

      localStorage.removeItem("@BOT-SIMPLES:user_id");
      localStorage.removeItem("@BOT-SIMPLES:token");
      localStorage.removeItem("@BOT-SIMPLES:name");
      localStorage.removeItem("@BOT-SIMPLES:role");

      window.location.href = "/login";
      return null;
    }

    if (error.response && error.response.data) {
      return Promise.reject(error.response.data);
    }
    return Promise.reject(error.message);
  }
);

export default api;
