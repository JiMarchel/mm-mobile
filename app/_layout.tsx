import '@/global.css';

import { NAV_THEME } from '@/lib/theme';
import { ThemeProvider } from 'expo-router/react-navigation';
import { PortalHost } from '@rn-primitives/portal';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { ThemeToggle } from '@/components/theme-toggle';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/lib/sonner';
import { AuthProvider, useAuth } from '@/features/auth/context/auth-context';
import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

// Inisialisasi Query Client untuk caching dan state management API
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false, // Tidak diperlukan di mobile
    },
  },
});

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { token, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    
    if (!token && !inAuthGroup) {
      // User is not authenticated and not in auth group, redirect to login
      router.replace('/(auth)/login');
    } else if (token && inAuthGroup) {
      // User is authenticated and in auth group, redirect to dashboard
      router.replace('/(protected)/transaction');
    }
  }, [token, isLoading, segments]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <>{children}</>;
}

export default function RootLayout() {
  const { colorScheme } = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AuthGuard>
            <ThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
              <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
              <Stack
                screenOptions={{
                  headerRight: () => <ThemeToggle />,
                }}
              >
                <Stack.Screen name="(protected)" options={{ headerShown: false }} />
              </Stack>
              <PortalHost />
              <Toaster />
            </ThemeProvider>
          </AuthGuard>
        </AuthProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
