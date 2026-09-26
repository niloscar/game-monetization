import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { AxiosError } from "axios";
import api from "../api/apiClient";

// AuthUser är inte längre samma typ som mock/types' User minus
// passwordHash — den mock-typen har inget tier-fält och är byggd för
// mockdatan. Detta är formen vi FAKTISKT får tillbaka från
// GET /api/user/me (och därmed vad AuthProvider håller i state).
// Justera fälten här om Oscars getUser-query i services/user.ts skiljer
// sig från detta.
export interface AuthUser {
  id: number;
  username: string;
  email: string;
  role: "user" | "admin";
  tier: { id: number; name: string; description: string; level: number } | null;
  createdAt: string;
}

// Lokal förhandsgranskning av inloggat läge utan riktig backend.
// Styrs av VITE_DEV_FAKE_USER i frontend/.env.local (gitignored).
// import.meta.env.DEV gör att detta aldrig kan slå på i en
// produktionsbuild, oavsett env-fil.
const DEV_FAKE_USER = import.meta.env.DEV && import.meta.env.VITE_DEV_FAKE_USER === "true";

// Bygger en fejkad AuthUser istället för att låna users[0] från mock —
// mock-datans User-typ har inte samma form (bl.a. inget tier-objekt)
// längre, så de två kan inte blandas.
const FAKE_USER: AuthUser = {
  id: 1,
  username: "dev_user",
  email: "dev@example.com",
  role: "user",
  tier: { id: 3, name: "High Score Access", description: "", level: 3 },
  createdAt: new Date().toISOString(),
};

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
  const [user, setUser] = useState<AuthUser | null>(DEV_FAKE_USER ? FAKE_USER : null);
  const [loading, setLoading] = useState(!DEV_FAKE_USER);
  const [error, setError] = useState<string | null>(null);

  // Hämtar den fullständiga profilen (inkl. tier) för den som är inloggad
  // just nu. Används både vid appstart och efter login/register/update,
  // eftersom /api/auth/login bara sätter session-cookien och svarar
  // 204 No Content — den skickar INTE med användarobjektet i svaret.
  async function refreshUser(): Promise<AuthUser | null> {
    try {
      const res = await api.get<AuthUser>("/user/me");
      setUser(res.data);
      return res.data;
    } catch {
      setUser(null);
      return null;
    }
  }

  // Vid appstart: kolla om det redan finns en aktiv session (cookie).
  // Hoppas över helt i DEV_FAKE_USER-läge så mock-användaren inte
  // skrivs över av ett 401 från en riktig backend.
  useEffect(() => {
    if (DEV_FAKE_USER) return;

    let cancelled = false;

    async function checkSession() {
      try {
        const res = await api.get<AuthUser>("/user/me");
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
      // OBS: /auth/login svarar 204 No Content (bara cookie, inget body)
      // — därför hämtar vi profilen separat efteråt istället för att
      // läsa användaren ur login-svaret.
      await api.post("/auth/login", { email, password });
      await refreshUser();
    } catch (err) {
      const message = getErrorMessage(err, "Inloggning misslyckades");
      setError(message);
      throw new Error(message);
    }
  }

  async function register(username: string, email: string, password: string) {
    setError(null);
    try {
      // Registrering går via User-endpointen (POST /api/user, singular
      // — inte /api/users), enligt routes/user.ts: userRouter.post('/', createUser).
      await api.post("/user", { username, email, password });
      // Skapar bara kontot, loggar inte in automatiskt (ingen session
      // sätts av createUser) — så vi loggar in direkt efteråt med samma
      // uppgifter, vilket också hämtar den färska profilen.
      await login(email, password);
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
      // Nollställ användaren oavsett om servern svarade OK, så UI:t
      // aldrig fastnar i inloggat läge.
      setUser(null);
    }
  }

  // Uppdaterar inloggad användares profil (användarnamn/e-post/lösenord).
  // DEV_FAKE_USER-läget skriver bara till lokal state, ingen backend finns.
  async function updateProfile(data: UpdateProfileInput) {
    setError(null);

    if (DEV_FAKE_USER) {
      setUser((prev) => {
        if (!prev) return prev;
        const { username, email } = data;
        return { ...prev, ...(username ? { username } : {}), ...(email ? { email } : {}) };
      });
      return;
    }

    if (!user) throw new Error("Ingen inloggad användare");

    try {
      // routes/user.ts: userRouter.patch('/me', updateMe) — inte
      // /users/:id längre, det fanns aldrig en session-koppling där.
      await api.patch("/user/me", data);
      // updateMe kan tänkas svara med olika form (uppdaterad rad,
      // 204, etc.) — hämta profilen på nytt istället för att lita på
      // svarskroppen, så vi alltid har rätt tier/createdAt också.
      await refreshUser();
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