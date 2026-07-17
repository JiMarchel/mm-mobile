import { createContext, useContext, useEffect, useState } from 'react';
import { getAccessToken } from '@/infrastructure/storage/token';

type AuthContextType = {
  token: string | null;
  isLoading: boolean;
  setToken: (token: string | null) => void;
};

const AuthContext = createContext<AuthContextType>({
  token: null,
  isLoading: true,
  setToken: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadToken() {
      try {
        const t = await getAccessToken();
        setToken(t);
      } catch (error) {
        console.error('Failed to load token', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadToken();
  }, []);

  return (
    <AuthContext.Provider value={{ token, isLoading, setToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
