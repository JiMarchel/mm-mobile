import { useMutation } from '@tanstack/react-query';
import { LogoutRequest, LogoutResponse } from '../type';
import { logoutUser } from '../api/logout';
import { useAuth } from '../context/auth-context';
import { clearTokens } from '@/infrastructure/storage/token';
import { useRouter } from 'expo-router';

export function useLogout() {
    const { setToken } = useAuth();
    const router = useRouter();

    return useMutation<LogoutResponse, Error, LogoutRequest>({
        mutationFn: logoutUser,
        onSuccess: async () => {
            await clearTokens();
            setToken(null);
            router.replace('/(auth)/login');
        },
    });
}
