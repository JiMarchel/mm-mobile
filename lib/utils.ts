import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function extractErrorMessage(error: any, defaultMessage: string = 'An error occurred'): string {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return defaultMessage;
}
