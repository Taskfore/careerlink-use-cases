const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";
const AUTH_TOKEN_KEY = 'auth_token';

// Initialize authToken from localStorage if available
let authToken: string | null = 
  typeof window !== 'undefined' ? localStorage.getItem(AUTH_TOKEN_KEY) : null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
  
  // Update localStorage when token changes
  if (typeof window !== 'undefined') {
    if (token) {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    }
  }
};

const getAuthHeaders = (): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  
  return headers;
};

interface AuthResponse {
  access_token: string;
  token_type: string;
  user: {
    id: string;
    email: string;
    full_name?: string;
  };
}

// Error response type is not used directly in the code

async function handleResponse<T>(response: Response): Promise<{ data?: T; error?: string }> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    return {
      error: error.detail || error.message || "An error occurred",
    };
  }
  const data = await response.json();
  return { data };
}

export const authService = {
  // Sign in with email and password
  async signIn(email: string, password: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {}),
        },
        body: new URLSearchParams({
          username: email,
          password: password,
        }),
        credentials: 'include',
      });

      const result = await handleResponse<AuthResponse>(response);
      
      // Store the token if login was successful
      if (result.data?.access_token) {
        setAuthToken(result.data.access_token);
      }
      
      return result;
    } catch (err) {
      console.error('Sign in error:', err);
      return { error: 'Failed to sign in. Please check your connection.' };
    }
  },

  // Register new user
  async signUp(email: string, password: string, userData: { full_name: string }) {
    try {
const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          email,
          password,
          full_name: userData.full_name,
        }),
      });

      return handleResponse<AuthResponse>(response);
    } catch (err) {
      console.error('Sign up error:', err);
      return { error: 'Failed to create account. Please try again.' };
    }
  },

  // Get current user
  async getCurrentUser() {
    try {
const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        credentials: 'include',
        headers: getAuthHeaders(),
      });

      const result = await handleResponse<{
        id: string;
        email: string;
        full_name?: string;
      }>(response);

      if (result.error) {
        console.error('Failed to fetch user data:', result.error);
        return { error: 'Failed to fetch user data' };
      }

      return result;
    } catch (err) {
      console.error('Error in getCurrentUser:', err);
      return { error: 'Failed to fetch user data' };
    }
  },

  // Sign out
  async signOut() {
    try {
      // Get the current token before clearing it
      const currentToken = authToken;
      
      // Clear the token immediately to prevent any race conditions
      setAuthToken(null);
      
      // If we have a token, try to send the logout request
      if (currentToken) {
        const response = await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          credentials: 'include',
          headers: getAuthHeaders(),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('Logout API error:', errorData);
          // Continue with the logout flow even if the API call fails
        }
      }
      
      return { success: true };
    } catch (err) {
      console.error('Sign out error:', err);
      return { error: err instanceof Error ? err.message : 'Failed to sign out' };
    }
  },

  // Handle auth state changes
  onAuthStateChange(callback: (event: 'SIGNED_IN' | 'SIGNED_OUT') => void) {
    const checkAuth = async () => {
      const { data } = await this.getCurrentUser();
      if (data) {
        callback('SIGNED_IN');
      } else {
        callback('SIGNED_OUT');
      }
    };

    // Initial check
    checkAuth();

    // Set up polling to check auth state periodically
    const intervalId = setInterval(checkAuth, 5 * 60 * 1000); // Check every 5 minutes

    // Return cleanup function
    return () => clearInterval(intervalId);
  },
};
