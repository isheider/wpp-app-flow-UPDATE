import React, { createContext, useContext, useEffect, useState } from "react";

import api from "../services/api";

import axios from "axios";

interface SignInReturn {
  token: string;
  name: string;
  id: string;
}

interface AuthContextData {
  token: string | null;
  name: string | null;
  id: string | null;
  role?: string | null;
  checkSession?: boolean;
  signIn(email: string, password: string): Promise<SignInReturn | false>;
  logout(): Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

interface AuthProviderProps {
  children?: any;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [id, setId] = useState<string | null>("");
  const [token, setToken] = useState<string | null>(null);
  const [name, setName] = useState<string | null>("");
  const [role, setRole] = useState<string | null>(null);
  const [checkSession, setCheckSession] = useState<boolean>(false);

  useEffect(() => {
    async function load() {
      const storagedToken = localStorage.getItem("@BOT-SIMPLES:token");

      if (storagedToken) {
        api.defaults.headers["Authorization"] = `Bearer ${storagedToken}`;

        setToken(storagedToken);

        const { data: userDetails } = await api.get("/profile");

        if (userDetails) {
          setName(userDetails.name);
          setId(userDetails._id);
          localStorage.setItem("@BOT-SIMPLES:name", userDetails.name);

          setRole(userDetails.role);
          setCheckSession(true);
        }
      } else {
        setToken(null);
        setId(null)
        setCheckSession(true);
      }
    }
    load();
  }, []);

  async function signIn(
    email: string,
    password: string
  ): Promise<SignInReturn | false> {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/sessions`,
        {
          email: email,
          password: password,
        }
      );

      if (response.data.token) {
        setToken(response.data.token);
        setName(response.data.user.name);
        setId(response.data.user._id);

        api.defaults.headers["Authorization"] = `Bearer ${response.data.token}`;
        setRole(response.data.user.role);
        localStorage.setItem("@BOT-SIMPLES:role", response.data.user.role);

        localStorage.setItem("@BOT-SIMPLES:user_id", response.data.user._id);
        localStorage.setItem("@BOT-SIMPLES:token", response.data.token);
        localStorage.setItem("@BOT-SIMPLES:name", response.data.user.name);
        setCheckSession(true);

        return response ? response.data : false;
      } else {
        return false;
      }
    } catch (err) {
      return false;
    }
  }

  async function logout() {
    setToken(null);
    setRole(null);
    setName(null);
    setId(null);

    api.defaults.headers["Authorization"] = ` `;

    localStorage.removeItem("@BOT-SIMPLES:user_id");
    localStorage.removeItem("@BOT-SIMPLES:token");
    localStorage.removeItem("@BOT-SIMPLES:name");
    localStorage.removeItem("@BOT-SIMPLES:role");

    // window.location.href = "/login";
  }

  return (
    <AuthContext.Provider
      value={{
        signIn,
        role,
        token,
        logout,
        name,
        id,
        checkSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);

  return context;
}
