import { ApiSuccessResponse } from '@/infrastructure/api/types';
import { RegisterInput } from '../validation/register';
import z from 'zod';
import { loginSchema } from '../validation/login';

export type RegisterRequest = Omit<RegisterInput, 'confirmPassword'>;
export type RegisterResponse = ApiSuccessResponse<void>;

export type LoginRequest = z.infer<typeof loginSchema>;
export type Token = {
    accessToken: string,
    refreshToken: string
}
export type LoginResponse = ApiSuccessResponse<Token>