import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { onAuthStateChanged, signInAnonymously, signOut, type User } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "../config/firebase";

const DISPLAY_NAME_KEY = "yazen-display-name";

interface AuthContextType {
  user: User | null;
  displayName: string | null;
  loading: boolean;
  setDisplayName: (name: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [displayName, setDisplayNameState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let nameLoaded = false;
    let authResolved = false;

    async function init() {
      const savedName = await AsyncStorage.getItem(DISPLAY_NAME_KEY);
      if (mounted) {
        setDisplayNameState(savedName);
        nameLoaded = true;
        if (savedName) {
          await signInAnonymously(auth);
        }
        if (authResolved && !savedName) {
          setLoading(false);
        }
      }
    }

    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (mounted) {
        setUser(u);
        authResolved = true;
        if (nameLoaded) {
          setLoading(false);
        }
      }
    });

    init().catch((e) => {
      console.warn("Auth init failed:", e);
      if (mounted) setLoading(false);
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  async function setDisplayName(name: string) {
    await AsyncStorage.setItem(DISPLAY_NAME_KEY, name);
    setDisplayNameState(name);
    await signInAnonymously(auth);
  }

  async function logout() {
    try {
      await AsyncStorage.removeItem(DISPLAY_NAME_KEY);
      setDisplayNameState(null);
      await signOut(auth);
    } catch (err) {
      console.warn("Logout failed:", err);
    }
  }

  return (
    <AuthContext.Provider value={{ user, displayName, loading, setDisplayName, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
