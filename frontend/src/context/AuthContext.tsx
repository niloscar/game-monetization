import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { AxiosError } from "axios";
import api from "../api/apiClient";
import type { User } from "../mock/types";
import { users } from "../mock";

// OBS: passwordHash ska ALDRIG komma tillbaka från backend till frontend.
// AuthUser är samma User-typ minus det fältet.
export type AuthUser = Omit<User, "passwordHash">;

// Lokal förhandsgranskning av inloggat läge utan riktig backend.
// Styrs av VITE_DEV_FAKE_USER i frontend/.env.local (som är gitignored
// och alltså aldrig följer med i commits). import.meta.env.DEV gör att
// detta aldrig kan slå på i en produktionsbuild, oavsett env-fil.
const DEV_FAKE_USER = import.meta.env.DEV && import.meta.env.VITE_DEV_FAKE_USER === "true";

export interface UpdateProfileInput {
  username?: string;
  email?: string;
  password?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: UpdateProfileInput) => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getErrorMessage(err: unknown, fallback: string): string {
  const axiosErr = err as AxiosError<{ message?: string }>;
  return axiosErr.response?.data?.message ?? fallback;
}

// -----------------------------------------------------------------------
// Provider
// -----------------------------------------------------------------------

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(
    DEV_FAKE_USER ? (users[0] as AuthUser) : null
  );
  const [loading, setLoading] = useState(!DEV_FAKE_USER);
  const [error, setError] = useState<string | null>(null);

  // Vid appstart: kolla om det redan finns en aktiv session (cookie).
  // Hoppas över helt i DEV_FAKE_USER-läge så mock-användaren inte
  // skrivs över av ett 401/404-svar från en backend som inte finns än.
  useEffect(() => {
    if (DEV_FAKE_USER) return;

    let cancelled = false;

    async function checkSession() {
      try {
        const res = await api.get<AuthUser>("/auth/me");
        if (!cancelled) setUser(res.data);
      } catch {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    checkSession();
    return () => {
      cancelled = true;
    };
  }, []);

  async function login(email: string, password: string) {
    setError(null);
    try {
      const res = await api.post<AuthUser>("/auth/login", { email, password });
      setUser(res.data);
    } catch (err) {
      const message = getErrorMessage(err, "Inloggning misslyckades");
      setError(message);
      throw new Error(message);
    }
  }

  async function register(username: string, email: string, password: string) {
    setError(null);
    try {
      // OBS: registrering går via User-endpointen (POST /api/users), inte /auth
      const res = await api.post<AuthUser>("/users", { username, email, password });
      setUser(res.data);
    } catch (err) {
      const message = getErrorMessage(err, "Registrering misslyckades");
      setError(message);
      throw new Error(message);
    }
  }

  async function logout() {
    setError(null);
    try {
      await api.post("/auth/logout");
    } finally {
      // Nollställ användaren oavsett om servern svarade OK,
      // så UI:t aldrig fastnar i inloggat läge
      setUser(null);
    }
  }

  // Uppdaterar inloggad användares profil (användarnamn/e-post/lösenord).
  // DEV_FAKE_USER-läget skriver bara till lokal state, ingen backend finns.
  async function updateProfile(data: UpdateProfileInput) {
    setError(null);

    if (DEV_FAKE_USER) {
      // Bara username/email hör hemma i AuthUser-state — ett ev. nytt
      // lösenord finns inte att spara någonstans i mock-läget.
      setUser((prev) => {
        if (!prev) return prev;
        const { username, email } = data;
        return { ...prev, ...(username ? { username } : {}), ...(email ? { email } : {}) };
      });
      return;
    }

    if (!user) throw new Error("Ingen inloggad användare");

    try {
      const res = await api.patch<AuthUser>(`/users/${user.id}`, data);
      setUser(res.data);
    } catch (err) {
      const message = getErrorMessage(err, "Kunde inte uppdatera profilen");
      setError(message);
      throw new Error(message);
    }
  }

  const value: AuthContextType = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: user !== null,
    isAdmin: user?.role === "admin",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// -----------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth måste användas inuti en <AuthProvider>");
  }
  return context;
}