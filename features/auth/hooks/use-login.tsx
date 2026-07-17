import { useMutation } from '@tanstack/react-query';
import { LoginRequest, LoginResponse } from '../type.js';
import { loginUser } from '../api/login';

export function useLogin() {
    return useMutation<LoginResponse, Error, LoginRequest>({
        mutationFn: loginUser,
    });
}
