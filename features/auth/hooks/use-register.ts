import { useMutation } from '@tanstack/react-query';
import { registerUser } from '../api/register';
import { RegisterRequest, RegisterResponse } from '../type';

export function useRegister() {
  return useMutation<RegisterResponse, Error, RegisterRequest>({
    mutationFn: registerUser,
  });
}
