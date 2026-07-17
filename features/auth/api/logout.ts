import { api } from '@/infrastructure/api/client';
import { LogoutRequest, LogoutResponse } from '../type';

export async function logoutUser(data: LogoutRequest): Promise<LogoutResponse> {
    const response = await api.post<LogoutResponse>('/auth/logout', data);
    return response.data;
}
