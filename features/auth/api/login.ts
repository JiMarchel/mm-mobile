import { api } from '@/infrastructure/api/client';
import { LoginRequest, LoginResponse } from '../type.js';

export async function loginUser(data: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', data);
    return response.data;
}
