"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { authService, setAuthToken } from "@/lib/api/services/authService";

type User = {
  id: string;
  email: string;
  full_name?: string;
};

type Session = {
  access_token: string;
  token_type: string;
  user: User;
};

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    userData: { full_name: string }
  ) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const checkAuth = useCallback(async () => {
    try {
      const { data, error } = await authService.getCurrentUser();

      if (data && !error) {
        setUser(data);
        // Create a session-like object for compatibility
        setSession({
          access_token: "", // This will be handled by httpOnly cookies
          token_type: "bearer",
          user: data,
        });
      } else {
        setUser(null);
        setSession(null);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
      setSession(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial auth check from localStorage
    const initializeAuth = async () => {
      const token = localStorage.getItem("auth_token");
      if (token) {
        // If we have a token, verify it by fetching the current user
        const { data: userData, error } = await authService.getCurrentUser();
        if (userData && !error) {
          setUser(userData);
          setSession({
            access_token: token,
            token_type: "bearer",
            user: userData,
          });
        } else {
          // Clear invalid token
          setAuthToken(null);
          setUser(null);
          setSession(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();

    // Set up auth state change listener
    const unsubscribe = authService.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        checkAuth();
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setSession(null);
        setAuthToken(null);
        if (!["/login", "/register", "/"].includes(pathname)) {
          router.push("/");
        }
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [checkAuth, pathname, router]);

  const signIn = async (email: string, password: string) => {
    // First, get the access token by signing in
    const { data: authData, error } = await authService.signIn(email, password);
    if (error) throw new Error(error);

    if (authData) {
      // Then fetch the user data using the /auth/me endpoint
      const { data: userData, error: userError } =
        await authService.getCurrentUser();

      if (userError) {
        throw new Error(userError);
      }

      if (userData) {
        // Update the session with both the token and user data
        const session = {
          access_token: authData.access_token,
          token_type: authData.token_type,
          user: userData,
        };

        setSession(session);
        setUser(userData);

        // Redirect to events page after successful login
        router.push("/events");
      } else {
        throw new Error("Failed to fetch user data after login");
      }
    }
  };

  const signUp = async (
    email: string,
    password: string,
    userData: { full_name: string }
  ) => {
    // First, create the user account
    const { error: signUpError } = await authService.signUp(
      email,
      password,
      userData
    );
    if (signUpError) throw new Error(signUpError);

    // Then sign in the user to get the access token
    const { data: authData, error: signInError } = await authService.signIn(
      email,
      password
    );
    if (signInError) throw new Error(signInError);

    if (authData) {
      // Fetch the user data using the /auth/me endpoint
      const { data: userData, error: userError } =
        await authService.getCurrentUser();

      if (userError) {
        throw new Error(userError);
      }

      if (userData) {
        // Update the session with both the token and user data
        const session = {
          access_token: authData.access_token,
          token_type: authData.token_type,
          user: userData,
        };

        setSession(session);
        setUser(userData);

        // Redirect to events page after successful registration and login
        router.push("/events");
      } else {
        throw new Error("Failed to fetch user data after registration");
      }
    }
  };

  const signOut = async () => {
    const { error } = await authService.signOut();
    if (error) throw new Error(error);

    setUser(null);
    setSession(null);
    router.push("/");
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  };

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Protected route component
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      // Store the current path to redirect back after login
      const redirectTo =
        pathname !== "/login"
          ? `?redirectTo=${encodeURIComponent(pathname)}`
          : "";
      router.push(`/login${redirectTo}`);
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null; // or a loading/redirect component
  }

  return <>{children}</>;
}
